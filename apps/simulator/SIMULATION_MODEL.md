# Simulation Model

## 数据层级

- **真实数据（source data）**：可追溯的模型 config 与 GPU 官方规格；字段可为空。
- **理论计算（theoretical）**：由结构和 dtype 的确定公式产生，如理论权重和 KV Cache。
- **工程估算（estimated）**：量化 metadata、框架开销与 runtime reserve；界面明确标注，不能等同实测。
- **Benchmark（actual / estimated）**：actual 必须来自可复现实测；当前没有随包发布的数据。
- **未来 AI Prediction**：未实现。未来输出必须包含区间、覆盖度和置信等级，不给虚假精确值。

## 公式

理论权重字节 = `parameters_total × weight_dtype_bits / 8`。MoE 仍加载总权重，因此不使用 active parameters 替代 total。量化部署估算在理论值上加 5% metadata；非量化加 1% 容器/对齐估算。

KV Cache 字节 = `2(K,V) × layers × kv_heads × head_dim × context_length × concurrency × dtype_bytes`。缺少任一结构字段即返回“无法精确计算”。V0.1 以配置的最大序列长度作为预分配上界，不将 input/output tokens 重复计入。

总需求 = 部署权重 + KV Cache + Runtime Reserve + Framework Overhead。三种 profile 分别采用 base 的 15/10/6% runtime reserve，以及权重的 10/6/3% framework overhead。这些比例是透明的容量规划假设，不是框架 Benchmark。

Can Run 只比较总需求与 `memory_per_gpu × gpu_count`，不代表算子、格式、拓扑或框架一定兼容。瓶颈判断为粗粒度理论启发式，所有并行建议均是待测试候选。
