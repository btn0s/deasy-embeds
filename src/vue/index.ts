export { VueHowItWorks as DeasyHowItWorks } from './howItWorks'
export { VueRotatingDocument as DeasyRotatingDocument } from './rotatingDocument'

export type VueMountProps = { loadFonts?: boolean }
export type HowItWorksOptions = VueMountProps & {
  design?: 'site' | 'gunmetal'
  colorMode?: 'light' | 'dark'
  transparent?: boolean
}
export type RotatingDocumentOptions = VueMountProps & { showTopbar?: boolean }
