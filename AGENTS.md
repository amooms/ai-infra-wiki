# 柏源 Infra 维护规则

- 本仓库是 AI Infra 技术资料库，技术准确性优先于内容数量。
- 所有文章位于 `docs/`；新文章必须先判断所属分类。
- 新增、移动文章后同步更新 `mkdocs.yml` 中的 `nav`，并检查站内链接。
- 不随意修改公开 URL；已发布文章应避免改文件名，确需调整时应考虑兼容旧链接。
- 不删除历史文章或用户已有内容，除非用户明确要求。
- 不虚构技术参数、性能测试结果、项目案例或客户信息；不确定的信息应明确标注或不写。
- 内容以架构、原理、配置取舍和工程实践为主，中文为主，保留必要英文术语。
- 网站使用 Material for MkDocs，并由 GitHub Actions 部署到 GitHub Pages。
- 大规模修改前先执行 `git status`，避免覆盖未提交工作。
- 修改后至少执行 `python -m mkdocs build --strict`，并修复警告、断链和配置错误。
- 网站页面分为 Home、Category、Article 三类，分别使用 `home.html`、`category.html`、`article.html`。
- Category 文件只负责分类说明、文章索引和入口，不在分类首页堆叠大段百科内容。
- 新技术文章必须使用 Article 规范，front matter 至少包含 `template: article.html`、`page_type: article`、`category`；确认后再填写 `date` 和 `description`，不得编造。
- 新增文章后依次：判断 category、填写 front matter、更新分类索引、更新 `docs/articles/index.md`、检查 `nav`、检查链接、执行严格构建。
