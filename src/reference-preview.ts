import { createApp, defineComponent, h, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { mountHowItWorks } from '../how-it-works.js'
import { mountRotatingDocument } from '../rotating-document.js'
function reference(mount: (element: HTMLElement) => { unmount(): void }) {
  return defineComponent({ setup() {
    const element = shallowRef<HTMLElement>()
    let handle: { unmount(): void }
    onMounted(() => { handle = mount(element.value!) })
    onBeforeUnmount(() => handle?.unmount())
    return () => h('div', { ref: element })
  } })
}
createApp({render: () => h('div', [
  h('nav', {class:'preview-nav'}, [h('a',{href:'#how-it-works'},'How it Works'),h('a',{href:'#cube'},'Cube v2'),h('a',{href:'vue-preview.html'},'Native Vue')]),
  h('div',{id:'how-it-works'},[h('div',{class:'preview-label'},'Shipped reference · Latest How it Works'),h(reference(mountHowItWorks))]),
  h('div',{id:'cube'},[h('div',{class:'preview-label'},'Shipped reference · Cube v2'),h(reference(mountRotatingDocument))]),
])}).mount('#app')
