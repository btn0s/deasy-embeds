import { defineComponent, h, onMounted, shallowRef, Teleport } from 'vue'
import { HowItWorksDemo } from './how-it-works/HowItWorksDemo'
import baselineCss from '../variants/baseline/App.css?inline'
import brandCss from '../variants/baseline/brand-themes.css?inline'
import scannerCss from '../prototypes/scanner-gunmetal/scanner.css?inline'
import flowCss from '../prototypes/how-it-works/howItWorks.css?inline'
import siteCss from '../prototypes/how-it-works-site/site.css?inline'
import { loadEmbedFonts, adaptEmbedCss, loadDocumentRules } from './composables'
const styles = adaptEmbedCss([baselineCss, brandCss, scannerCss, flowCss, siteCss, '.variant-shell{min-height:0;font-family:var(--sans);font-size:var(--body-size);line-height:var(--body-line-height);-webkit-font-smoothing:antialiased}.variant-shell.hiw-site-page{min-height:0;background:#2f2c25}.variant-shell.hiw-site-page[data-surround=light]{background:#fbf9f5}.variant-shell[data-transparent]{background:transparent}.scanner-gunmetal{min-height:0;padding-block:48px 64px}.scan-section{margin-top:0}'].join('\n'))
export const VueHowItWorks = defineComponent({
  name: 'DeasyHowItWorks',
  props: { design: { type: String, default: 'site' }, colorMode: { type: String, default: 'dark' }, transparent: Boolean, loadFonts: { type: Boolean, default: true } },
  setup(props) {
    const host = shallowRef<HTMLElement>(), target = shallowRef<ShadowRoot>()
    onMounted(() => { loadEmbedFonts(props.loadFonts); loadDocumentRules('how-it-works', styles.lifted); target.value = host.value!.attachShadow({ mode: 'open' }) })
    return () => h('div', { ref: host, class: 'deasy-vue-how-it-works' }, target.value ? h(Teleport, { to: target.value }, [h('style', styles.css), h('div', { class: `variant-shell ${props.design === 'site' ? 'hiw-site-page' : ''}`, 'data-brand-theme': 'rust', 'data-color-mode': props.design === 'site' ? 'light' : props.colorMode, 'data-surround': props.design === 'site' ? props.colorMode : undefined, 'data-theme': 'deasy', 'data-transparent': props.transparent ? '' : undefined }, [h('main', { class: `scanner-gunmetal how-it-works ${props.design === 'site' ? 'hiw-site' : ''}` }, h(HowItWorksDemo, { fixedHeader: props.design === 'site' }))])]) : null)
  },
})
