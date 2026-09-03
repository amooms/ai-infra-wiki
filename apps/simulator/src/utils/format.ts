export const gib = (value: number | null | undefined) => value == null ? 'N/A' : `${value.toFixed(value >= 100 ? 0 : 1)} GiB`
export const number = (value: number | null | undefined, suffix='') => value == null ? 'N/A' : `${value.toLocaleString()}${suffix}`
