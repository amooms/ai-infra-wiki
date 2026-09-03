import type { ReactNode } from 'react'
export function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}) { return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label> }
export function NumberField({label,value,min=1,onChange}:{label:string;value:number;min?:number;onChange:(n:number)=>void}) { return <Field label={label}><input type="number" min={min} value={value} onChange={e=>onChange(Math.max(min,Number(e.target.value)||min))}/></Field> }
