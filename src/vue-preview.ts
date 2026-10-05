import { createApp, h } from 'vue'
const { DeasyHowItWorks, DeasyRotatingDocument } = new URLSearchParams(location.search).has('bundle')
  ? await import(/* @vite-ignore */ '/vue.js')
  : await import('./vue/index')

createApp({
  render: () => h('div', [
    h('nav', { class: 'preview-nav', 'aria-label': 'Vue port preview sections' }, [
      h('a', { href: '#how-it-works' }, 'How it Works'),
      h('a', { href: '#cube' }, 'Cube v2'),
      h('a', { href: 'reference-preview.html' }, 'Shipped reference'),
    ]),
    h('div', { id: 'how-it-works' }, [
      h('div', { class: 'preview-label' }, 'Vue port · Latest How it Works'),
      h(DeasyHowItWorks),
    ]),
    h('div', { id: 'cube' }, [
      h('div', { class: 'preview-label' }, 'Vue port · Rotating Document / Cube v2'),
      h(DeasyRotatingDocument),
    ]),
  ]),
}).mount('#app')
