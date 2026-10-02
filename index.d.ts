export type ColorMode = 'light' | 'dark'

export type MountOptions = {
  /** Inject the Google Fonts stylesheet (Gilda Display, Rethink Sans, IBM Plex Mono) into document.head. Default true. */
  loadFonts?: boolean
}

export type ScannerOptions = MountOptions & {
  /** Light or dark palette. Default 'dark'. */
  colorMode?: ColorMode
  /** Leave the background transparent so the host page shows through. */
  transparent?: boolean
}

export type ScannerHandle = {
  /** Merge new options and re-render (e.g. to follow the host's theme). */
  update: (options: ScannerOptions) => void
  unmount: () => void
}

/** Palette plus the site's fixed-header design. */
export type HowItWorksOptions = ScannerOptions & {
  /** Default 'gunmetal'; 'site' uses the home-v2 light palette on charcoal. */
  design?: 'gunmetal' | 'site'
}

export type HowItWorksHandle = {
  /** Merge new options and re-render (e.g. to follow the host's theme). */
  update: (options: HowItWorksOptions) => void
  unmount: () => void
}

export type RotatingDocumentOptions = MountOptions & {
  /** Keep the prototype's fake site top bar. Default false. */
  showTopbar?: boolean
}

export type RotatingDocumentHandle = {
  unmount: () => void
}

/** Render the scanner demo into `el` inside a shadow root. */
export declare function mountScanner(el: HTMLElement, options?: ScannerOptions): ScannerHandle
/** Register `<deasy-scanner color-mode="light|dark" transparent no-fonts>`. */
export declare function defineScannerElement(tag?: string): void

/** Render the How it Works blade (connect, Read, Curate, Activate) into `el` inside a shadow root. */
export declare function mountHowItWorks(el: HTMLElement, options?: HowItWorksOptions): HowItWorksHandle
/** Register `<deasy-how-it-works color-mode="light|dark" transparent no-fonts>`. */
export declare function defineHowItWorksElement(tag?: string): void

/** Render the rotating-document hero (3D scene, copy, toggle) into `el` inside a shadow root. */
export declare function mountRotatingDocument(el: HTMLElement, options?: RotatingDocumentOptions): RotatingDocumentHandle
/** Register `<deasy-rotating-document show-topbar no-fonts>`. */
export declare function defineRotatingDocumentElement(tag?: string): void
