import type { SimulationConfig } from '../../types/schema'
export type Bottleneck = 'Compute Bound' | 'Memory Bound' | 'Communication Bound' | 'KV Cache Bound' | 'Unknown'
export function theoreticalBottleneck(config: SimulationConfig, kvGiB: number | null, availableGiB: number | null): Bottleneck {
  if (kvGiB != null && availableGiB != null && kvGiB / availableGiB > 0.45) return 'KV Cache Bound'
  if ((config.tp > 1 || config.ep > 1 || config.pp > 1) && !config.gpu.interconnect_bandwidth_gb_s) return 'Communication Bound'
  if (config.gpu.memory_bandwidth_tb_s && config.gpu.fp16_tflops && config.gpu.fp16_tflops / config.gpu.memory_bandwidth_tb_s > 100) return 'Memory Bound'
  if (config.gpu.fp16_tflops) return 'Compute Bound'
  return 'Unknown'
}
