export const interactionFlowVariants = ['scanner', 'paper-table'] as const

export type InteractionFlowVariant = (typeof interactionFlowVariants)[number]

export const interactionFlowLabels: Record<InteractionFlowVariant, string> = {
  scanner: 'Scanner (baseline)',
  'paper-table': 'Paper Table',
}

export function normalizeInteractionFlowVariant(value: string): InteractionFlowVariant {
  return interactionFlowVariants.includes(value as InteractionFlowVariant)
    ? (value as InteractionFlowVariant)
    : 'scanner'
}
