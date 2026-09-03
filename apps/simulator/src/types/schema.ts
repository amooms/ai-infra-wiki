import { z } from 'zod'

const nullableNumber = z.number().finite().nonnegative().nullable()
export const dtypeSchema = z.enum(['FP32', 'FP16', 'BF16', 'FP8', 'INT8', 'INT4'])
export type DType = z.infer<typeof dtypeSchema>

export const modelVariantSchema = z.object({
  variant_id: z.string(), checkpoint: z.string(), weight_dtype: dtypeSchema,
  compute_dtype: dtypeSchema.nullable(), kv_cache_dtype: dtypeSchema.nullable(),
  quantization_method: z.enum(['none', 'AWQ', 'GPTQ', 'GGUF', 'other']).nullable(),
  official: z.boolean(), source_repo: z.string().url().nullable(),
})
export type ModelVariant = z.infer<typeof modelVariantSchema>

export const modelSchema = z.object({
  model_id: z.string(), model_family: z.string(), display_name: z.string(), organization: z.string(),
  sources: z.array(z.enum(['HuggingFace', 'ModelScope', 'official', 'other'])).min(1), source_repo: z.string().url().nullable(),
  architecture: z.string().nullable(), model_type: z.enum(['base', 'instruct', 'reasoning', 'other']),
  parameters_total: nullableNumber, parameters_active: nullableNumber,
  num_layers: nullableNumber, hidden_size: nullableNumber, intermediate_size: nullableNumber,
  attention_heads: nullableNumber, kv_heads: nullableNumber, head_dim: nullableNumber,
  context_length: nullableNumber, moe: z.boolean(), num_experts: nullableNumber, num_experts_per_token: nullableNumber,
  native_dtype: dtypeSchema.nullable(), last_modified: z.string().nullable(), data_source: z.string(),
  confidence: z.enum(['high', 'medium', 'low']), last_verified: z.string().nullable(), featured: z.boolean(),
  variants: z.array(modelVariantSchema).min(1),
})
export type Model = z.infer<typeof modelSchema>

export const gpuSchema = z.object({
  gpu_id: z.string(), vendor: z.string(), model: z.string(), architecture: z.string().nullable(),
  memory_gb: nullableNumber, memory_type: z.string().nullable(), memory_bandwidth_tb_s: nullableNumber,
  fp32_tflops: nullableNumber, fp16_tflops: nullableNumber, bf16_tflops: nullableNumber,
  fp8_tflops: nullableNumber, int8_tops: nullableNumber, tdp_w: nullableNumber,
  pcie_generation: z.string().nullable(), pcie_lanes: nullableNumber, form_factor: z.string().nullable(),
  interconnect_type: z.string().nullable(), interconnect_bandwidth_gb_s: nullableNumber,
  source: z.string().url(), verified: z.boolean(), last_verified: z.string().nullable(),
})
export type GPU = z.infer<typeof gpuSchema>

export const benchmarkSchema = z.object({
  kind: z.enum(['actual', 'estimated']), model: z.string(), model_variant: z.string(), gpu: z.string(), gpu_count: z.number().int().positive(), node_count: z.number().int().positive(),
  framework: z.string(), framework_version: z.string().nullable(), tp: z.number().int().positive(), dp: z.number().int().positive(), pp: z.number().int().positive(), ep: z.number().int().positive(),
  input_tokens: z.number().int().nonnegative(), output_tokens: z.number().int().nonnegative(), context_length: z.number().int().positive(), concurrency: z.number().int().positive(),
  ttft_ms: nullableNumber, tpot_ms: nullableNumber, itl_ms: nullableNumber, output_tokens_per_second: nullableNumber, total_tokens_per_second: nullableNumber,
  gpu_utilization: nullableNumber, memory_utilization: nullableNumber, power_w: nullableNumber, benchmark_source: z.string().url(), benchmark_date: z.string(), verified: z.boolean(),
})

export type ReserveProfile = 'conservative' | 'balanced' | 'aggressive'
export interface SimulationConfig { model: Model; variant: ModelVariant; gpu: GPU; gpuCount: number; nodeCount: number; contextLength: number; concurrency: number; inputTokens: number; outputTokens: number; tp: number; dp: number; pp: number; ep: number; reserveProfile: ReserveProfile }
