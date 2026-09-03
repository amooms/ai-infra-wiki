# AI Infra Simulator 维护规则

- 本目录是独立 React + Vite + TypeScript 静态应用，不把 MkDocs 页面迁入 React。
- 技术准确优先。未知字段使用 `null`；禁止为完整性猜测模型、GPU、互联或性能数据。
- 数据与 UI 必须区分 `actual`、`theoretical`、`estimated`、`unknown`。无来源时禁止展示 Benchmark 精确值。
- MoE 权重使用 `parameters_total`，不得以 `parameters_active` 代替；KV Cache 缺少结构字段时返回不可精确计算。
- 公共数据写入 `public/data/`，必须提供来源、可信度和验证日期；同步凭据仅来自环境变量/GitHub Secrets。
- 计算逻辑放在 `src/engine/` 并补充 Vitest；修改后必须执行 `npm test` 和 `npm run build`。
- Vite `base` 必须保持 `/ai-infra-wiki/tools/simulator/`；不要使用会导致 Pages 刷新 404 的 BrowserRouter。
- 构建产物由根工作流合并到 `site/tools/simulator/`，不能单独部署或覆盖 MkDocs artifact。
