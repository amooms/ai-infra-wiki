"""Build navigation and article indexes from the docs directory structure."""

from __future__ import annotations

from datetime import date, datetime
from html import escape
from pathlib import Path
import re

import yaml


CATEGORIES = (
    ("server", "服务器", "Server"),
    ("gpu", "GPU", "GPU"),
    ("network", "高速网络", "Network"),
    ("storage", "存储", "Storage"),
    ("hpc", "HPC", "HPC"),
    ("llm", "大模型", "LLM"),
    ("project", "智算项目", "Projects"),
)

NAV_LABELS = {
    "server": "L0 物理与供电", "gpu": "L1 算力与GPU", "network": "L2 智算网络",
    "storage": "L3 存储", "hpc": "L4 调度运维", "llm": "L5 大模型工程", "project": "项目实战",
}

DEFAULT_TAGS = {
    "server": ["L0", "服务器", "供电"], "gpu": ["L1", "GPU", "异构计算"],
    "network": ["L2", "智算网络"], "storage": ["L3", "并行存储"],
    "hpc": ["L4", "HPC", "调度运维"], "llm": ["L5", "大模型工程"], "project": ["项目实战"],
}

CATALOG: dict[str, list[dict[str, object]]] = {}


def _read_article(path: Path, docs_dir: Path, category: str) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    metadata: dict[str, object] = {}
    body = text
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) == 3:
            metadata = yaml.safe_load(parts[1]) or {}
            body = parts[2]

    heading = re.search(r"^#\s+(.+?)\s*$", body, re.MULTILINE)
    title = str(metadata.get("title") or (heading.group(1) if heading else path.stem))
    relative = path.relative_to(docs_dir).as_posix()
    category_relative = path.relative_to(docs_dir / category).with_suffix("").as_posix()
    raw_date = metadata.get("date")
    display_date = raw_date.isoformat() if isinstance(raw_date, (date, datetime)) else str(raw_date or "—")

    try:
        order = float(metadata.get("order", 10000))
    except (TypeError, ValueError):
        order = 10000

    return {
        "title": title,
        "src_uri": relative,
        "category_href": f"{category_relative}/",
        "archive_href": f"../{category}/{category_relative}/",
        "date": display_date,
        "dated": display_date != "—",
        "order": order,
    }


def _scan(docs_dir: Path) -> dict[str, list[dict[str, object]]]:
    catalog: dict[str, list[dict[str, object]]] = {}
    for slug, _label, _label_en in CATEGORIES:
        folder = docs_dir / slug
        articles = [
            _read_article(path, docs_dir, slug)
            for path in folder.rglob("*.md")
            if path.name != "index.md"
        ]
        articles.sort(key=lambda item: (item["order"], str(item["title"]).casefold()))
        catalog[slug] = articles
    return catalog


def on_config(config):
    global CATALOG
    CATALOG = _scan(Path(config["docs_dir"]))

    nav: list[dict[str, object]] = [{"首页": "index.md"}, {"文章库": "articles/index.md"}]
    for slug, _label, _label_en in CATEGORIES:
        children: list[dict[str, str]] = [{"概览": f"{slug}/index.md"}]
        children.extend({str(article["title"]): str(article["src_uri"])} for article in CATALOG[slug])
        nav.append({NAV_LABELS[slug]: children})
    config["nav"] = nav
    return config


def _category_index(slug: str) -> str:
    rows = "\n".join(
        f'    <a href="{escape(str(article["category_href"]))}"><span>{escape(str(article["title"]))}</span>'
        f'{f"<time>{escape(str(article["date"]))}</time>" if article["dated"] else ""}</a>'
        for article in CATALOG.get(slug, [])
    )
    return (
        "## 全部文章 <small>| Articles</small>\n\n"
        '<div class="by-archive-group">\n'
        "  <h3>现有条目</h3>\n"
        '  <div class="by-file-list">\n'
        f"{rows}\n"
        "  </div>\n"
        "</div>\n"
    )


def _articles_index() -> str:
    groups: list[str] = ["## 全部条目 <small>| All Entries</small>"]
    for slug, label, label_en in CATEGORIES:
        rows = "\n".join(
            f'  <a href="{escape(str(article["archive_href"]))}"><span>{escape(str(article["title"]))}</span>'
            f'{f"<time>{escape(str(article["date"]))}</time>" if article["dated"] else ""}</a>'
            for article in CATALOG.get(slug, [])
        )
        groups.append(
            f'<div class="by-archive-group"><h3>{escape(label)} <small>{escape(label_en)}</small></h3>'
            f'<div class="by-file-list">\n{rows}\n</div></div>'
        )
    return "\n\n".join(groups) + "\n"


def _latest_list() -> str:
    category_names = {slug: label for slug, label, _label_en in CATEGORIES}
    items: list[tuple[str, dict[str, object]]] = [
        (slug, article) for slug, articles in CATALOG.items() for article in articles
    ]
    items.sort(
        key=lambda item: (
            0 if item[1]["dated"] else 1,
            str(item[1]["date"]) if item[1]["dated"] else "",
            str(item[1]["title"]).casefold(),
        ),
        reverse=False,
    )
    dated = [item for item in items if item[1]["dated"]]
    undated = [item for item in items if not item[1]["dated"]]
    dated.reverse()
    selected = (dated + undated)[:4]
    return "\n".join(
        f'<a href="{escape(slug)}/{escape(str(article["category_href"]))}" role="listitem"><span>{escape(str(article["title"]))}</span><small>{escape(category_names[slug])}</small><time>{escape(str(article["date"]))}</time></a>'
        for slug, article in selected
    )


def on_page_markdown(markdown, page, config, files):
    src_uri = page.file.src_uri.replace("\\", "/")

    if src_uri == "articles/index.md":
        return _articles_index()

    for slug, label, _label_en in CATEGORIES:
        if src_uri == f"{slug}/index.md":
            return _category_index(slug)
        if src_uri.startswith(f"{slug}/") and src_uri.endswith(".md"):
            page.meta.setdefault("template", "article.html")
            page.meta.setdefault("page_type", "article")
            page.meta.setdefault("category", slug)
            page.meta.setdefault("category_label", label)
            page.meta.setdefault("tags", DEFAULT_TAGS[slug])
            break

    if src_uri == "index.md":
        markdown = markdown.replace("<!-- AUTO_LATEST -->", _latest_list())
    return markdown
