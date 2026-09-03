import { useMemo, useState } from 'react'
import type { Model } from '../types/schema'
import './model-search.css'

export function ModelSearch({ models, selectedId, onSelect }: { models: Model[]; selectedId: string; onSelect: (model: Model) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const normalized = query.trim().toLowerCase()
  const matches = useMemo(() => models.filter((model) => !normalized || [model.display_name, model.organization, model.model_family, model.moe ? 'moe' : 'dense', model.parameters_total, ...model.variants.flatMap((variant) => [variant.weight_dtype, variant.quantization_method])].join(' ').toLowerCase().includes(normalized)), [models, normalized])
  const choose = (model: Model) => { onSelect(model); setQuery(''); setOpen(false) }

  return <div className="model-search">
    <label className="field"><span>搜索并选择模型</span><input type="search" value={query} placeholder="名称 / 机构 / Dense / MoE / 精度" aria-label="搜索并选择模型" aria-expanded={open} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onChange={(event) => { setQuery(event.target.value); setOpen(true) }} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); if (event.key === 'Enter' && matches[0]) { event.preventDefault(); choose(matches[0]) } }}/></label>
    {open && <div className="model-search-results" role="listbox">{matches.length ? matches.map((model) => <button type="button" role="option" aria-selected={model.model_id === selectedId} className={model.model_id === selectedId ? 'is-selected' : ''} key={model.model_id} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(model)}><strong>{model.display_name}</strong><span>{model.organization} · {model.moe ? 'MoE' : 'Dense'} · {model.variants.map((variant) => variant.weight_dtype).join(' / ')}</span></button>) : <p className="model-search-empty">没有匹配模型</p>}</div>}
  </div>
}
