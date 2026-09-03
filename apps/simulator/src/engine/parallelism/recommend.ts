import type { SimulationConfig } from '../../types/schema'
export function recommendParallelism(config: SimulationConfig, minimumGpuCount: number | null) {
  if (!minimumGpuCount) return '关键显存数据缺失，无法生成并行候选。'
  const tp = Math.min(config.gpuCount, Math.max(1, 2 ** Math.ceil(Math.log2(minimumGpuCount))))
  const dp = Math.max(1, Math.floor(config.gpuCount / tp))
  const ep = config.model.moe ? Math.max(1, Math.min(config.ep, config.model.num_experts ?? 1)) : 1
  return `候选：TP${tp} + DP${dp} + PP${config.pp} + EP${ep}。该组合仅用于缩小测试范围，需以目标框架的实测 Benchmark 验证。`
}
