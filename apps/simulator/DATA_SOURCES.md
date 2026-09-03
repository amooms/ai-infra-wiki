# Data Sources

模型种子快照来自模型组织的官方 Hugging Face repository `config.json` 与 Model Card，记录在每条数据的 `source_repo`、`data_source`、`confidence`、`last_verified`。当前仅是开发种子，不代表完整或实时模型库。

GPU 数据来自厂商官方 datasheet。未知值保留 `null`。Tensor 算力按数据表口径记录，跨厂商比较前需核对数据类型、稀疏性与功耗条件。

`public/data/benchmarks/index.json` 当前为空。实测记录必须有 URL、日期、软件版本、工作负载、并行配置和 `verified`；估算记录必须标记 `estimated`，不可混入 `actual`。

同步脚本已经实现上游请求、环境变量 Token、错误处理、本地缓存、标准化入口与索引校验。上游接口兼容性和速率限制仍需在 GitHub Actions 真实网络中验证。
