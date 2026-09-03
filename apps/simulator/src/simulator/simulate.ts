import type { SimulationConfig } from '../types/schema'
import { deploymentFit, totalMemoryGiB, weightMemoryGiB } from '../engine/memory/memory'
import { kvCacheGiB } from '../engine/kv-cache/kvCache'
import { theoreticalBottleneck } from '../engine/roofline/bottleneck'
import { recommendParallelism } from '../engine/parallelism/recommend'

export function simulate(config: SimulationConfig) {
  const weight = weightMemoryGiB(config.model.parameters_total, config.variant)
  const kv = kvCacheGiB(config.model, config.contextLength, config.concurrency, config.variant.kv_cache_dtype ?? '')
  const total = weight.deploymentGiB != null && kv.gib != null ? totalMemoryGiB(weight.deploymentGiB, kv.gib, config.reserveProfile) : null
  const fit = total ? deploymentFit(total.requiredGiB, config.gpu.memory_gb, config.gpuCount) : null
  return { weight, kv, total, fit, bottleneck: theoreticalBottleneck(config, kv.gib, fit?.availableGiB ?? null), recommendation: recommendParallelism(config, fit?.minimumGpuCount ?? null) }
}
