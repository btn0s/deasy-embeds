export const liveMapPopupVariants = ['border-beam', 'split-rail'] as const

export type LiveMapPopupVariant = (typeof liveMapPopupVariants)[number]

export const liveMapPopupCopy = {
  title: 'Live Map',
  description: "Give your agent a map of how your company's knowledge fits together.",
  cta: 'Get early access →',
} as const

export const liveMapPopupLayoutLabels: Record<LiveMapPopupVariant, string> = {
  'border-beam': 'Vertical',
  'split-rail': 'Horizontal',
}

export function normalizeLiveMapPopupVariant(value: string): LiveMapPopupVariant {
  if (
    value === 'split-rail' ||
    value === 'horizontal' ||
    value === 'attached-flip' ||
    value === 'topology'
  ) {
    return 'split-rail'
  }
  return 'border-beam'
}
