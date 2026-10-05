import { defineComponent, h, onMounted, shallowRef, Teleport } from 'vue'
import Cube from './rotating-cube-v2/App'
import { SOURCE_BOX_MODEL_URL } from './shared/SourceBox'
import { preloadGLTF, preloadTextures } from './scene'
import { cubeTextureUrls } from './rotating-cube-v2/assets'
import { loadEmbedFonts, adaptEmbedCss, loadDocumentRules } from './composables'
import css from '../prototypes/rotating-cube-v2/App.css?inline'
const styles = adaptEmbedCss(css + '\n:host(:not([data-topbar])) .prototype-topbar{display:none}')
export const VueRotatingDocument = defineComponent({
  name: 'DeasyRotatingDocument',
  props: { showTopbar: Boolean, loadFonts: { type: Boolean, default: true } },
  setup(props) {
    const host = shallowRef<HTMLElement>(), target = shallowRef<ShadowRoot>(), ready = shallowRef(false), error = shallowRef('')
    onMounted(async () => {
      loadEmbedFonts(props.loadFonts)
      loadDocumentRules('rotating-document', styles.lifted)
      target.value = host.value!.attachShadow({ mode: 'open' })
      try { await Promise.all([preloadGLTF(SOURCE_BOX_MODEL_URL), preloadTextures(cubeTextureUrls)]); ready.value = true } catch (cause) { error.value = String(cause) }
    })
    return () => h('div', { ref: host, class: 'deasy-vue-rotating-document', 'data-topbar': props.showTopbar ? '' : undefined }, target.value ? h(Teleport, { to: target.value }, [h('style', styles.css), ready.value ? h(Cube) : h('div', { role: 'status' }, error.value || 'Loading document stream…')]) : null)
  },
})
