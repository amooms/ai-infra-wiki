import { describe, expect, it } from 'vitest'
import { bytesPerElement, deploymentFit, totalMemoryGiB, weightMemoryGiB } from './memory/memory'
import { kvCacheGiB } from './kv-cache/kvCache'
import type { Model, ModelVariant } from '../types/schema'

const variant = (weight_dtype: ModelVariant['weight_dtype'], quantization_method: ModelVariant['quantization_method'] = 'none'): ModelVariant => ({ variant_id: 'v', checkpoint: 'test', weight_dtype, compute_dtype: 'BF16', kv_cache_dtype: 'BF16', quantization_method, official: true, source_repo: null })
const model: Model = { model_id:'m', model_family:'f', display_name:'m', organization:'o', sources:['official'], source_repo:null, architecture:'test', model_type:'base', parameters_total:8e9, parameters_active:8e9, num_layers:32, hidden_size:4096, intermediate_size:null, attention_heads:32, kv_heads:8, head_dim:128, context_length:8192, moe:false, num_experts:null, num_experts_per_token:null, native_dtype:'BF16', last_modified:null, data_source:'test fixture', confidence:'high', last_verified:null, featured:true, variants:[variant('BF16')] }

describe('dtype bytes', () => {
  it.each([['BF16',2], ['FP8',1], ['INT4',0.5]])('%s = %s bytes', (d, n) => expect(bytesPerElement(d)).toBe(n))
  it('returns null for unknown dtype', () => expect(bytesPerElement('mystery')).toBeNull())
})
describe('weight memory', () => {
  it('uses total parameters for dense', () => expect(weightMemoryGiB(model.parameters_total, variant('BF16')).theoreticalGiB).toBeCloseTo(14.901, 2))
  it('uses total rather than active parameters for MoE weights', () => expect(weightMemoryGiB(100e9, variant('FP8')).theoreticalGiB).toBeCloseTo(93.132, 2))
  it('supports INT4 quantization', () => expect(weightMemoryGiB(8e9, variant('INT4','AWQ')).theoreticalGiB).toBeCloseTo(3.725, 2))
  it('rejects dirty parameters', () => expect(weightMemoryGiB(-1, variant('BF16')).error).not.toBeNull())
})
describe('KV cache', () => {
  it('calculates K and V from architecture', () => expect(kvCacheGiB(model, 8192, 1, 'BF16').gib).toBe(1))
  it('reports missing kv_heads', () => expect(kvCacheGiB({...model,kv_heads:null},8192,1,'BF16').missing).toContain('kv_heads'))
  it('reports missing head_dim', () => expect(kvCacheGiB({...model,head_dim:null},8192,1,'BF16').missing).toContain('head_dim'))
})
describe('total and fit', () => {
  it('adds explicit reserves', () => expect(totalMemoryGiB(60,20,'balanced')?.requiredGiB).toBeCloseTo(91.6))
  it('computes GPU count and headroom', () => expect(deploymentFit(150,80,2)).toMatchObject({canRun:true,minimumGpuCount:2,headroomGiB:10}))
  it('rejects invalid GPU data', () => expect(deploymentFit(100,null,8)).toBeNull())
})
