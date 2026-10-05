export type LiveMapPopupVisualKey = 'orchestration' | 'accuracy'

export const liveMapPopupVisuals: Record<
  LiveMapPopupVisualKey,
  { light: string; dark: string }
> = {
  orchestration: {
    light: '/brand/visuals/data-visualization/metadata-orchestration-light.svg',
    dark: '/brand/visuals/data-visualization/metadata-orchestration-dark.svg',
  },
  accuracy: {
    light: '/brand/visuals/data-visualization/retrieval-accuracy-light.svg',
    dark: '/brand/visuals/data-visualization/retrieval-accuracy-dark.svg',
  },
}

export function liveMapPopupVisualSrc(
  key: LiveMapPopupVisualKey,
  colorMode: 'light' | 'dark',
): string {
  return liveMapPopupVisuals[key][colorMode]
}
