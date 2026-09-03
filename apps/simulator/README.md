# AI Infra Simulator

柏源 Infra 的独立静态工程工具，用模型结构、精度、GPU 显存与并行配置分析部署可行性。V0.1 不预测实际 tokens/s，也不内置虚构 Benchmark。

## 本地运行

```bash
pnpm install --frozen-lockfile
pnpm run dev
pnpm test
pnpm run build
```

开发地址默认为 `http://localhost:5173/ai-infra-wiki/tools/simulator/`。生产构建位于 `dist/`。根目录部署工作流先构建 MkDocs，再把该目录复制到 `site/tools/simulator/` 后上传唯一 Pages artifact。

## 数据更新

`public/data/` 是浏览器读取的已校验静态快照。`npm run sync:models` 获取上游元数据，使用缓存处理暂时性错误，并验证正式索引。Token 仅通过 `HF_TOKEN`、`MODELSCOPE_TOKEN` 环境变量传入。
