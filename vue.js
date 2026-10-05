import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { mountHowItWorks } from './how-it-works.js'
import { mountScanner } from './scanner.js'
import { mountRotatingDocument } from './rotating-document.js'

function component(name, propDefaults, mount, update) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: propDefaults,
    setup(props, { attrs }) {
      const host = ref()
      let handle
      onMounted(() => {
        if (host.value) handle = mount(host.value, props)
      })
      watch(() => update(props), (next) => handle?.update?.(next))
      onBeforeUnmount(() => handle?.unmount())
      return () => h('div', { ...attrs, ref: host, class: ['deasy-vue-embed', attrs.class] })
    },
  })
}

export const DeasyHowItWorks = component(
  'DeasyHowItWorks',
  { design: { type: String, default: 'site' }, colorMode: { type: String, default: 'dark' }, transparent: Boolean, loadFonts: { type: Boolean, default: true } },
  (el, props) => mountHowItWorks(el, { ...props }),
  ({ design, colorMode, transparent }) => ({ design, colorMode, transparent }),
)

export const DeasyScanner = component(
  'DeasyScanner',
  { colorMode: { type: String, default: 'dark' }, transparent: Boolean, loadFonts: { type: Boolean, default: true } },
  (el, props) => mountScanner(el, { ...props }),
  ({ colorMode, transparent }) => ({ colorMode, transparent }),
)

export const DeasyRotatingDocument = defineComponent({
  name: 'DeasyRotatingDocument',
  inheritAttrs: false,
  props: { showTopbar: Boolean, loadFonts: { type: Boolean, default: true } },
  setup(props, { attrs }) {
    const host = ref()
    let handle
    onMounted(() => {
      if (host.value) handle = mountRotatingDocument(host.value, { ...props })
    })
    watch(() => props.showTopbar, (visible) => host.value?.toggleAttribute('data-topbar', visible))
    onBeforeUnmount(() => handle?.unmount())
    return () => h('div', { ...attrs, ref: host, class: ['deasy-vue-embed', attrs.class] })
  },
})
