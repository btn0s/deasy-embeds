import baselineCss from './variants/baseline/App.css?inline'
import brandThemesCss from './variants/baseline/brand-themes.css?inline'
import scannerCss from './prototypes/scanner-gunmetal/scanner.css?inline'
import { ScannerDemo } from './prototypes/scanner-gunmetal/ScannerDemo'
import { defineEmbedElement, mountInShadow, type EmbedHandle, type MountOptions } from './shadow'

export type ColorMode = 'light' | 'dark'

export type ScannerOptions = MountOptions & {
  /** Light or dark palette (default 'dark'). */
  colorMode?: ColorMode
  /** Leave the background transparent so the host page shows through. */
  transparent?: boolean
}

/* The prototype page wraps the demo in BaselineThemeShell, which also writes
   to <html> and localStorage. The embed reproduces only the wrapper markup the
   styles key off, so the host document is left alone. */
const embedCss = `
.variant-shell { font-family: var(--sans); font-size: var(--body-size); line-height: var(--body-line-height); -webkit-font-smoothing: antialiased; }
.variant-shell[data-color-mode='light'] { color-scheme: light; background: #fbf9f5; color: #24221e; }
.variant-shell[data-color-mode='dark'] { color-scheme: dark; background: #211e1c; color: #f0ebe3; }
.variant-shell[data-transparent] { background: transparent; }
`

function Scanner({ colorMode = 'dark', transparent = false }: ScannerOptions) {
  return (
    <div
      className="variant-shell"
      data-brand-theme="rust"
      data-color-mode={colorMode}
      data-theme="deasy"
      data-transparent={transparent || undefined}
    >
      <main className="scanner-gunmetal">
        <ScannerDemo />
      </main>
    </div>
  )
}

export type ScannerHandle = Omit<EmbedHandle, 'update'> & {
  update: (options: ScannerOptions) => void
}

/** Render the scanner demo into `el` (inside a shadow root). */
export function mountScanner(el: HTMLElement, options: ScannerOptions = {}): ScannerHandle {
  let current = options
  const handle = mountInShadow(el, 'scanner', [baselineCss, brandThemesCss, scannerCss, embedCss], <Scanner {...current} />, options)
  return {
    update: (next) => {
      current = { ...current, ...next }
      handle.update(<Scanner {...current} />)
    },
    unmount: handle.unmount,
  }
}

function fromAttributes(el: HTMLElement): ScannerOptions {
  return {
    colorMode: el.getAttribute('color-mode') === 'light' ? 'light' : 'dark',
    transparent: el.hasAttribute('transparent'),
    loadFonts: !el.hasAttribute('no-fonts'),
  }
}

/** Register `<deasy-scanner color-mode="light|dark" transparent no-fonts>`. */
export function defineScannerElement(tag = 'deasy-scanner') {
  defineEmbedElement(
    tag,
    ['color-mode', 'transparent'],
    (el) => mountScanner(el, fromAttributes(el)),
    (el, handle) => handle.update(fromAttributes(el)),
  )
}
