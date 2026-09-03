import { gpuSchema, type GPU } from '../types/schema'
export async function loadGpus(): Promise<{ gpus: GPU[]; errors: string[] }> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/gpus/gpus.json`); if (!response.ok) throw new Error(`GPU 数据加载失败 (${response.status})`)
  const raw: unknown = await response.json(); if (!Array.isArray(raw)) return { gpus: [], errors: ['GPU 数据不是数组'] }
  const gpus: GPU[]=[]; const errors:string[]=[]; raw.forEach((row,index)=>{const r=gpuSchema.safeParse(row);r.success?gpus.push(r.data):errors.push(`gpus[${index}]: ${r.error.issues[0]?.message}`)}); return {gpus,errors}
}
