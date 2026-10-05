import { DialRoot, useDialKit } from 'dialkit'
import 'dialkit/styles.css'
import './dialkit-overrides.css'
import { brandThemeLabels, brandThemes, type BrandTheme } from './brandThemes'
import {
  interactionFlowLabels,
  interactionFlowVariants,
  normalizeInteractionFlowVariant,
  type InteractionFlowVariant,
} from './interactionFlowVariants'
import {
  liveMapPopupLayoutLabels,
  liveMapPopupVariants,
  normalizeLiveMapPopupVariant,
  type LiveMapPopupVariant,
} from './liveMapPopupVariants'

const BRAND_THEME_DIAL_ID = 'deasy-brand-theme'
const INTERACTION_FLOW_DIAL_ID = 'deasy-interaction-flow'
const LIVE_MAP_POPUP_DIAL_ID = 'deasy-live-map-popup'

function isBrandTheme(value: string): value is BrandTheme {
  return (brandThemes as readonly string[]).includes(value)
}

export type LiveMapPopupDialState = {
  variant: LiveMapPopupVariant
  bleed: boolean
  shimmer: boolean
}

export function useBrandThemeDial(): BrandTheme {
  const params = useDialKit(
    'Brand palette',
    {
      palette: {
        type: 'select',
        options: brandThemes.map((theme) => ({
          value: theme,
          label: brandThemeLabels[theme],
        })),
        default: 'rust',
      },
    },
    {
      id: BRAND_THEME_DIAL_ID,
      persist: {
        key: 'deasy-brand-theme',
        presets: false,
      },
    },
  )

  return isBrandTheme(params.palette) ? params.palette : 'rust'
}

export function useInteractionFlowDial(): InteractionFlowVariant {
  const params = useDialKit(
    'Interaction flow',
    {
      widget: {
        type: 'select',
        options: interactionFlowVariants.map((flowVariant) => ({
          value: flowVariant,
          label: interactionFlowLabels[flowVariant],
        })),
        default: 'scanner',
      },
    },
    {
      id: INTERACTION_FLOW_DIAL_ID,
      persist: {
        key: 'deasy-interaction-flow',
        presets: false,
      },
    },
  )

  return normalizeInteractionFlowVariant(String(params.widget))
}

export function useLiveMapPopupDial(): LiveMapPopupDialState {
  const params = useDialKit(
    'Live Map popup',
    {
      layout: {
        type: 'select',
        options: liveMapPopupVariants.map((popupVariant) => ({
          value: popupVariant,
          label: liveMapPopupLayoutLabels[popupVariant],
        })),
        default: 'border-beam',
      },
      bleed: true,
      shimmer: false,
    },
    {
      id: LIVE_MAP_POPUP_DIAL_ID,
      persist: {
        key: 'deasy-live-map-popup',
        presets: false,
      },
    },
  )

  return {
    variant: normalizeLiveMapPopupVariant(String(params.layout)),
    bleed: params.bleed,
    shimmer: params.shimmer,
  }
}

export function BrandThemeDialRoot() {
  return <DialRoot position="bottom-right" defaultOpen={false} theme="system" />
}
