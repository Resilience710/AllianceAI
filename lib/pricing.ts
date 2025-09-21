export const normalizePrice = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return null
}

interface FormatPriceOptions {
  currencySymbol?: string
  fallback?: string
}

export const formatPrice = (value: number | null, options: FormatPriceOptions = {}): string => {
  const { currencySymbol = '$', fallback = 'Contact for quote' } = options
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${currencySymbol}${value.toLocaleString()}`
  }
  return fallback
}
