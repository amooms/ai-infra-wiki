# Architecture

应用是无后端的 React 单页工具。`models/` 和 `hardware/` 负责加载与 Zod 隔离脏数据；`engine/` 放置无 UI 依赖的纯计算；`simulator/` 聚合结果；`comparison/`、`pages/`、`components/` 负责交互。静态 JSON 随 Vite 构建发布。

仓库部署结构为：MkDocs → `site/`，Vite → `apps/simulator/dist/` → `site/tools/simulator/`。应用不使用客户端路径路由，因此 Pages 刷新不依赖 SPA fallback。未来 Benchmark 或代理模型接入必须保持输入来源和结果类型可追溯。
