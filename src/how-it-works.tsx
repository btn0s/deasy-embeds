import baselineCss from './variants/baseline/App.css?inline'
import brandThemesCss from './variants/baseline/brand-themes.css?inline'
import scannerCss from './prototypes/scanner-gunmetal/scanner.css?inline'
import howItWorksCss from './prototypes/how-it-works/howItWorks.css?inline'
import siteCss from './prototypes/how-it-works-site/site.css?inline'
import { HowItWorksDemo } from './prototypes/how-it-works/HowItWorksDemo'
import { defineEmbedElement, mountInShadow, type EmbedHandle, type MountOptions } from './shadow'

export type ColorMode = 'light' | 'dark'

export type HowItWorksOptions = MountOptions & {
  /** Light or dark palette for the optional gunmetal design (default 'dark'). */
  colorMode?: ColorMode
  /** Site matches home-v2: cream on charcoal, fixed header. Default 'site'. */
  design?: 'gunmetal' | 'site'
  /** Leave the background transparent so the host page shows through. */
  transparent?: boolean
}

/* Same wrapper as the scanner embed: the markup the styles key off, without
   BaselineThemeShell's writes to <html> and localStorage. */
const embedCss = `
.variant-shell { font-family: var(--sans); font-size: var(--body-size); line-height: var(--body-line-height); -webkit-font-smoothing: antialiased; }
.variant-shell[data-color-mode='light'] { color-scheme: light; background: #fbf9f5; color: #24221e; }
.variant-shell[data-color-mode='dark'] { color-scheme: dark; background: #211e1c; color: #f0ebe3; }
.variant-shell.hiw-site-page { background: #2f2c25; }
.variant-shell[data-transparent] { background: transparent; }
`

function HowItWorks({ colorMode = 'dark', design = 'site', transparent = false }: HowItWorksOptions) {
  const site = design === 'site'
  return (
    <div
      className={`variant-shell ${site ? 'hiw-site-page' : ''}`}
      data-brand-theme="rust"
      data-color-mode={site ? 'light' : colorMode}
      data-theme="deasy"
      data-transparent={transparent || undefined}
    >
      <main className={`scanner-gunmetal how-it-works ${site ? 'hiw-site' : ''}`}>
        <HowItWorksDemo fixedHeader={site} />
      </main>
    </div>
  )
}

export type HowItWorksHandle = Omit<EmbedHandle, 'update'> & {
  update: (options: HowItWorksOptions) => void
}

/** Render the How it Works blade into `el` (inside a shadow root). */
export function mountHowItWorks(el: HTMLElement, options: HowItWorksOptions = {}): HowItWorksHandle {
  let current = options
  const handle = mountInShadow(
    el,
    'how-it-works',
    [baselineCss, brandThemesCss, scannerCss, howItWorksCss, siteCss, embedCss],
    <HowItWorks {...current} />,
    options,
  )
  return {
    update: (next) => {
      current = { ...current, ...next }
      handle.update(<HowItWorks {...current} />)
    },
    unmount: handle.unmount,
  }
}

function fromAttributes(el: HTMLElement): HowItWorksOptions {
  return {
    colorMode: el.getAttribute('color-mode') === 'light' ? 'light' : 'dark',
    design: el.getAttribute('design') === 'gunmetal' ? 'gunmetal' : 'site',
    transparent: el.hasAttribute('transparent'),
    loadFonts: !el.hasAttribute('no-fonts'),
  }
}

/** Register `<deasy-how-it-works color-mode="light|dark" transparent no-fonts>`. */
export function defineHowItWorksElement(tag = 'deasy-how-it-works') {
  defineEmbedElement(
    tag,
    ['color-mode', 'design', 'transparent'],
    (el) => mountHowItWorks(el, fromAttributes(el)),
    (el, handle) => handle.update(fromAttributes(el)),
  )
}
