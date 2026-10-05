import type { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Gilda+Display&family=IBM+Plex+Mono:wght@400;500&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap'

export type EmbedHandle = {
  /** Re-render with new props. */
  update: (element: ReactElement) => void
  /** Unmount React and clear the shadow root. */
  unmount: () => void
}

export type MountOptions = {
  /** Inject the Google Fonts stylesheet into document.head (default true). */
  loadFonts?: boolean
}

/* The prototypes' stylesheets were written for a whole page. Inside a shadow
   root, page-level selectors either match nothing or would leak if left in the
   document, so rewrite them onto :host and lift the few at-rules that only
   work at document level (@property, @font-face) out into document.head. */
const documentOnly = /@(?:property|font-face)[^{]*\{[^}]*\}/g

function adaptCss(css: string) {
  const lifted = css.match(documentOnly) ?? []
  const scoped = css
    .replace(documentOnly, '')
    // The theme shell painted html/body/#root; the embed paints its own wrapper.
    .replace(/(?:^|\})\s*(?:html\[[^{]*|#root)\s*\{[^}]*\}/gm, (rule) => (rule.startsWith('}') ? '}' : ''))
    .replace(/(^|[\s,}])html(\s*[{,])/g, '$1:host$2')
    .replace(/(^|[\s,}])body(\s*[{,])/g, '$1:host$2')
    .replace(/:root\b/g, ':host')
  return { lifted, scoped }
}

function ensureDocumentStyles(key: string, rules: string[], loadFonts: boolean) {
  const head = document.head
  if (loadFonts && !head.querySelector('link[data-deasy-embed-fonts]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONTS_HREF
    link.dataset.deasyEmbedFonts = ''
    head.append(link)
  }
  if (rules.length && !head.querySelector(`style[data-deasy-embed="${key}"]`)) {
    const style = document.createElement('style')
    style.dataset.deasyEmbed = key
    style.textContent = rules.join('\n')
    head.append(style)
  }
}

export function mountInShadow(
  host: HTMLElement,
  key: string,
  cssChunks: string[],
  element: ReactElement,
  { loadFonts = true }: MountOptions = {},
): EmbedHandle {
  const { lifted, scoped } = adaptCss(cssChunks.join('\n'))
  ensureDocumentStyles(key, lifted, loadFonts)

  const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' })
  shadow.replaceChildren()
  const style = document.createElement('style')
  style.textContent = `:host{display:block;position:relative}\n${scoped}`
  const container = document.createElement('div')
  container.className = 'deasy-embed-root'
  shadow.append(style, container)

  const root = createRoot(container)
  root.render(element)
  return {
    update: (next) => root.render(next),
    unmount: () => {
      root.unmount()
      shadow.replaceChildren()
    },
  }
}

/** Define a custom element that mounts on connect and unmounts on disconnect. */
export function defineEmbedElement<H extends { unmount: () => void }>(
  tag: string,
  observed: string[],
  mount: (el: HTMLElement) => H,
  onAttributeChange?: (el: HTMLElement, handle: H) => void,
) {
  if (typeof customElements === 'undefined' || customElements.get(tag)) return
  customElements.define(
    tag,
    class extends HTMLElement {
      static observedAttributes = observed
      #handle: H | null = null
      connectedCallback() {
        this.#handle ??= mount(this)
      }
      disconnectedCallback() {
        this.#handle?.unmount()
        this.#handle = null
      }
      attributeChangedCallback() {
        if (this.#handle) onAttributeChange?.(this, this.#handle)
      }
    },
  )
}

