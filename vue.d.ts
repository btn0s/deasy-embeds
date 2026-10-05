import type { DefineComponent } from 'vue'
import type { HowItWorksOptions, RotatingDocumentOptions } from './index.js'

export type VueMountProps = { loadFonts?: boolean }
export declare const DeasyHowItWorks: DefineComponent<HowItWorksOptions & VueMountProps>
export declare const DeasyRotatingDocument: DefineComponent<RotatingDocumentOptions>
export type { HowItWorksOptions, RotatingDocumentOptions }
