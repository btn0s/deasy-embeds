import { createApp, h, ref, watchEffect } from 'vue'
const { DeasyHowItWorks, DeasyRotatingDocument } = new URLSearchParams(location.search).has('bundle')
  ? await import(/* @vite-ignore */ '/vue.js')
  : await import('./vue/index')

/* The page around the widget follows the toggle, as a host page would. */
const colorMode = ref<'dark' | 'light'>('dark')
watchEffect(() => {
  document.documentElement.style.background = colorMode.value === 'dark' ? '#2f2c25' : '#fbf9f5'
})

createApp({
  render: () => h('div', [
    h('nav', { class: 'preview-nav', 'aria-label': 'Vue port preview sections' }, [
      h('a', { href: '#how-it-works' }, 'How it Works'),
      h('a', { href: '#cube' }, 'Cube v2'),
      h('button', {
        class: 'preview-toggle',
        type: 'button',
        'aria-pressed': colorMode.value === 'dark',
        onClick: () => { colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark' },
      }, colorMode.value === 'dark' ? 'Dark mode: on' : 'Dark mode: off'),
    ]),
    h('div', { id: 'how-it-works' }, [
      h(DeasyHowItWorks, { colorMode: colorMode.value }),
      h(DeasyHowItWorks, { design: 'gunmetal', colorMode: 'light' }),
      h(DeasyHowItWorks, { design: 'gunmetal', colorMode: 'dark' }),
    ]),
    h('div', { id: 'cube' }, [
      h(DeasyRotatingDocument),
    ]),
  ]),
}).mount('#app')
