import type { DType, ModelVariant, ReserveProfile } from '../../types/schema'

const BITS: Record<DType, number> = { FP32: 32, FP16: 16, BF16: 16, FP8: 8, INT8: 8, INT4: 4 }
export const bytesPerElement = (dtype: string): number | null => dtype in BITS ? BITS[dtype as DType] / 8 : null

export function weightMemoryGiB(parametersTotal: number | null, variant: ModelVariant) {
  const bytes = bytesPerElement(variant.weight_dtype)
  if (parametersTotal == null || parametersTotal < 0 || bytes == null) return { theoreticalGiB: null, deploymentGiB: null, error: '缺少有效总参数量或权重 dtype' }
  const theoreticalGiB = parametersTotal * bytes / 2 ** 30
  const metadataRatio = variant.quantization_method && variant.quantization_method !== 'none' ? 0.05 : 0.01
  return { theoreticalGiB, deploymentGiB: theoreticalGiB * (1 + metadataRatio), error: null }
}

const PROFILES: Record<ReserveProfile, { runtime: number; framework: number }> = {
  conservative: { runtime: 0.15, framework: 0.10 }, balanced: { runtime: 0.10, framework: 0.06 }, aggressive: { runtime: 0.06, framework: 0.03 },
}
export function totalMemoryGiB(weightGiB: number, kvGiB: number, profile: ReserveProfile) {
  if (![weightGiB, kvGiB].every(Number.isFinite) || weightGiB < 0 || kvGiB < 0) return null
  const base = weightGiB + kvGiB; const p = PROFILES[profile]
  return { runtimeReserveGiB: base * p.runtime, frameworkOverheadGiB: weightGiB * p.framework, requiredGiB: base * (1 + p.runtime) + weightGiB * p.framework }
}

export function deploymentFit(requiredGiB: number, memoryPerGpuGiB: number | null, gpuCount: number) {
  if (memoryPerGpuGiB == null || memoryPerGpuGiB <= 0 || !Number.isInteger(gpuCount) || gpuCount <= 0 || requiredGiB < 0) return null
  const availableGiB = memoryPerGpuGiB * gpuCount
  return { canRun: availableGiB >= requiredGiB, availableGiB, headroomGiB: availableGiB - requiredGiB, utilization: requiredGiB / availableGiB, minimumGpuCount: Math.ceil(requiredGiB / memoryPerGpuGiB) }
}
