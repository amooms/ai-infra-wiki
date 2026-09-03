import { bytesPerElement } from '../memory/memory'
import type { Model } from '../../types/schema'

export function kvCacheGiB(model: Model, contextLength: number, concurrency: number, dtype: string) {
  const missing: string[] = []
  if (!model.num_layers) missing.push('num_layers')
  if (!model.kv_heads) missing.push('kv_heads')
  if (!model.head_dim) missing.push('head_dim')
  const bytes = bytesPerElement(dtype)
  if (bytes == null) missing.push('kv_cache_dtype')
  if (!Number.isInteger(contextLength) || contextLength <= 0) missing.push('context_length')
  if (!Number.isInteger(concurrency) || concurrency <= 0) missing.push('concurrency')
  if (missing.length) return { gib: null, missing }
  // K and V: 2 × layers × KV heads × head dim × tokens × concurrent sequences.
  const totalBytes = 2 * model.num_layers! * model.kv_heads! * model.head_dim! * contextLength * concurrency * bytes!
  return { gib: totalBytes / 2 ** 30, missing: [] }
}
