# 柏源 Infra 维护规则

本仓库包含两个独立子系统：`docs/` 与 `overrides/` 是 MkDocs Knowledge Base；`apps/simulator/` 是 React AI Infra Simulator。两者共享一个 GitHub Pages artifact，但技术栈和维护规则不能混用。Simulator 规则见 `apps/simulator/AGENTS.md`。

- 本仓库是 AI Infra 技术资料库，技术准确性优先于内容数量。
- 所有文章位于 `docs/`；新文章必须先判断所属分类。
- 新增或移动文章后无需手动维护导航；`hooks/auto_catalog.py` 会按目录自动生成导航、分类索引、文章库和首页最近整理。
- 不随意修改公开 URL；已发布文章应避免改文件名，确需调整时应考虑兼容旧链接。
- 不删除历史文章或用户已有内容，除非用户明确要求。
- 不虚构技术参数、性能测试结果、项目案例或客户信息；不确定的信息应明确标注或不写。
- 内容以架构、原理、配置取舍和工程实践为主，中文为主，保留必要英文术语。
- 网站使用 Material for MkDocs，并由 GitHub Actions 部署到 GitHub Pages。
- 大规模修改前先执行 `git status`，避免覆盖未提交工作。
- 修改后至少执行 `python -m mkdocs build --strict`，并修复警告、断链和配置错误。
- 网站页面分为 Home、Category、Article 三类，分别使用 `home.html`、`category.html`、`article.html`。
- Category 文件只负责分类说明、文章索引和入口，不在分类首页堆叠大段百科内容。
- 新技术文章放入对应分类目录即可，构建时会自动补齐 Article 模板与分类元数据；front matter 建议填写 `title`，可选填写真实的 `date`、`description` 和 `order`。
- 新增文章后依次：放入正确分类目录、检查标题和链接、执行严格构建；不要手动维护分类索引、`docs/articles/index.md` 或 `mkdocs.yml` 导航。
