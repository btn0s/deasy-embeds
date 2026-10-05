import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { useBrandThemeDial } from './BrandThemeDial'
import type { BrandTheme } from './brandThemes'
import {
  COLOR_MODE_STORAGE_KEY,
  getInitialColorMode,
  syncDocumentTheme,
  type ColorMode,
} from './baselineShell'
import './brand-themes.css'

type BaselineThemeContextValue = {
  brandTheme: BrandTheme
  colorMode: ColorMode
  toggleColorMode: () => void
}

const BaselineThemeContext = createContext<BaselineThemeContextValue | null>(null)

export function useBaselineTheme(): BaselineThemeContextValue {
  const value = useContext(BaselineThemeContext)
  if (!value) {
    throw new Error('useBaselineTheme must be used within BaselineThemeShell')
  }
  return value
}

type BaselineThemeShellProps = {
  children: ReactNode
  dial?: ReactNode
}

export function BaselineThemeShell({ children, dial }: BaselineThemeShellProps) {
  const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode)
  const brandTheme = useBrandThemeDial()

  useLayoutEffect(() => {
    syncDocumentTheme(colorMode, brandTheme)
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode)
    } catch {
      // Ignore write failures in restricted contexts.
    }
  }, [colorMode, brandTheme])

  const contextValue = useMemo(
    () => ({
      brandTheme,
      colorMode,
      toggleColorMode: () => setColorMode((mode) => (mode === 'light' ? 'dark' : 'light')),
    }),
    [brandTheme, colorMode],
  )

  return (
    <BaselineThemeContext.Provider value={contextValue}>
      <div className="variant-shell" data-brand-theme={brandTheme} data-color-mode={colorMode} data-theme="deasy">
        {children}
        {dial}
      </div>
    </BaselineThemeContext.Provider>
  )
}
