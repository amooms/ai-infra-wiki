# 柏源 Infra

AI Infra / HPC / GPU / 大模型基础设施技术知识库。

本站以工程实践为中心，整理服务器、GPU、高速网络、存储、HPC、大模型部署与智算项目中的架构、原理和配置取舍。

## 本地运行

```powershell
python -m pip install -r requirements.txt
python -m mkdocs serve
```

浏览器访问 `http://127.0.0.1:8000/`。

## 构建

```powershell
python -m mkdocs build --strict
```

生成内容位于 `site/`，该目录不会提交到 Git。

## 内容目录

所有文章均位于 `docs/`：

- `server/`：服务器
- `gpu/`：GPU
- `network/`：高速网络
- `storage/`：存储
- `hpc/`：HPC
- `llm/`：大模型部署
- `project/`：智算项目实践

## 在线访问

[https://amooms.github.io/ai-infra-wiki/](https://amooms.github.io/ai-infra-wiki/)

仓库通过 GitHub Actions 自动构建并发布到 GitHub Pages。
