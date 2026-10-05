import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import {
  mountHowItWorks,
  type HowItWorksOptions,
  type HowItWorksHandle,
} from '../how-it-works'
import { mountScanner, type ScannerOptions, type ScannerHandle } from '../scanner'
import { mountRotatingDocument, type RotatingDocumentOptions, type RotatingDocumentHandle } from '../rotating-document'

/** Vue component props shared by all embeds. */
export type VueMountProps = { loadFonts?: boolean }

/** The shipped How it Works widget as a Vue component. */
export const DeasyHowItWorks = defineComponent({
  name: 'DeasyHowItWorks',
  inheritAttrs: false,
  props: {
    design: { type: String as PropType<HowItWorksOptions['design']>, default: 'site' },
    colorMode: { type: String as PropType<HowItWorksOptions['colorMode']>, default: 'dark' },
    transparent: { type: Boolean, default: false },
    loadFonts: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    const el = ref<HTMLElement>()
    let handle: HowItWorksHandle | undefined
    onMounted(() => {
      if (!el.value) return
      handle = mountHowItWorks(el.value, {
        design: props.design,
        colorMode: props.colorMode,
        transparent: props.transparent,
        loadFonts: props.loadFonts,
      })
    })
    watch(() => [props.design, props.colorMode, props.transparent] as const, () => {
      handle?.update({ design: props.design, colorMode: props.colorMode, transparent: props.transparent })
    })
    onBeforeUnmount(() => handle?.unmount())
    return () => h('div', { ...attrs, ref: el, class: ['deasy-vue-embed', attrs.class] })
  },
})

/** The shipped Scanner widget as a Vue component. */
export const DeasyScanner = defineComponent({
  name: 'DeasyScanner',
  inheritAttrs: false,
  props: {
    colorMode: { type: String as PropType<ScannerOptions['colorMode']>, default: 'dark' },
    transparent: { type: Boolean, default: false },
    loadFonts: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    const el = ref<HTMLElement>()
    let handle: ScannerHandle | undefined
    onMounted(() => {
      if (!el.value) return
      handle = mountScanner(el.value, {
        colorMode: props.colorMode,
        transparent: props.transparent,
        loadFonts: props.loadFonts,
      })
    })
    watch(() => [props.colorMode, props.transparent] as const, () => {
      handle?.update({ colorMode: props.colorMode, transparent: props.transparent })
    })
    onBeforeUnmount(() => handle?.unmount())
    return () => h('div', { ...attrs, ref: el, class: ['deasy-vue-embed', attrs.class] })
  },
})

/** The shipped 3D Rotating Document widget as a Vue component. */
export const DeasyRotatingDocument = defineComponent({
  name: 'DeasyRotatingDocument',
  inheritAttrs: false,
  props: {
    showTopbar: { type: Boolean, default: false },
    loadFonts: { type: Boolean, default: true },
  },
  setup(props, { attrs }) {
    const el = ref<HTMLElement>()
    let handle: RotatingDocumentHandle | undefined
    onMounted(() => {
      if (!el.value) return
      handle = mountRotatingDocument(el.value, {
        showTopbar: props.showTopbar,
        loadFonts: props.loadFonts,
      })
    })
    watch(() => props.showTopbar, (showTopbar) => {
      el.value?.toggleAttribute('data-topbar', showTopbar)
    })
    onBeforeUnmount(() => handle?.unmount())
    return () => h('div', { ...attrs, ref: el, class: ['deasy-vue-embed', attrs.class] })
  },
})

export type { HowItWorksOptions, ScannerOptions, RotatingDocumentOptions }
export type { HowItWorksHandle, ScannerHandle, RotatingDocumentHandle }
