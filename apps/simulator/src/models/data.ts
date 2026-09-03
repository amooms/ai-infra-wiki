import { modelSchema, type Model } from '../types/schema'
export function parseModels(input: unknown): { models: Model[]; errors: string[] } {
  if (!Array.isArray(input)) return { models: [], errors: ['模型数据不是数组'] }
  const models: Model[] = []; const errors: string[] = []
  input.forEach((row, index) => { const result = modelSchema.safeParse(row); result.success ? models.push(result.data) : errors.push(`models[${index}]: ${result.error.issues[0]?.message}`) })
  return { models, errors }
}
export async function loadModels() { const response = await fetch(`${import.meta.env.BASE_URL}data/models/index.json`); if (!response.ok) throw new Error(`模型数据加载失败 (${response.status})`); return parseModels(await response.json()) }
