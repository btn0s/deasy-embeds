import type { BrandTheme } from './brandThemes'

export const COLOR_MODE_STORAGE_KEY = 'deasy-color-mode'

export type ColorMode = 'light' | 'dark'

export const documentBackground: Record<BrandTheme, Record<ColorMode, string>> = {
  rust: { light: '#fbf9f5', dark: '#211e1c' },
  pine: { light: '#f9faf7', dark: '#1c201d' },
  slate: { light: '#f8f9fb', dark: '#1e2024' },
}

export function getInitialColorMode(): ColorMode {
  try {
    const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage may be unavailable in restricted contexts.
  }

  const fromUrl = new URLSearchParams(window.location.search).get('colorMode')
  if (fromUrl === 'light' || fromUrl === 'dark') return fromUrl

  return getComputedStyle(document.documentElement).colorScheme === 'dark' ? 'dark' : 'light'
}

export function syncDocumentTheme(mode: ColorMode, brand: BrandTheme) {
  document.documentElement.dataset.colorMode = mode
  document.documentElement.dataset.brandTheme = brand
  document.documentElement.style.colorScheme = mode
  document.documentElement.style.backgroundColor = documentBackground[brand][mode]
}
