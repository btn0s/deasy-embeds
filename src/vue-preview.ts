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
      h('a', { href: '#how-it-works' }, 'Site'),
      h('a', { href: '#gunmetal-light' }, 'Gunmetal light'),
      h('a', { href: '#gunmetal-dark' }, 'Gunmetal dark'),
      h('a', { href: '#cube' }, 'Cube v2'),
      h('a', { href: 'https://github.com/btn0s/deasy-embeds', target: '_blank', rel: 'noreferrer' }, 'GitHub ↗'),
      h('button', {
        class: 'preview-toggle',
        type: 'button',
        'aria-pressed': colorMode.value === 'dark',
        onClick: () => { colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark' },
      }, colorMode.value === 'dark' ? 'Dark mode: on' : 'Dark mode: off'),
    ]),
    h('section', { id: 'how-it-works', class: `preview-section ${colorMode.value === 'light' ? 'preview-section--light' : ''}` }, [
      h('div', { class: 'preview-label' }, [
        h('span', 'How it Works — Site design'),
        h('code', `<DeasyHowItWorks color-mode="${colorMode.value}" />`),
      ]),
      h(DeasyHowItWorks, { colorMode: colorMode.value }),
    ]),
    h('section', { id: 'gunmetal-light', class: 'preview-section preview-section--light' }, [
      h('div', { class: 'preview-label' }, [
        h('span', 'How it Works — Gunmetal (light)'),
        h('code', '<DeasyHowItWorks design="gunmetal" color-mode="light" />'),
      ]),
      h(DeasyHowItWorks, { design: 'gunmetal', colorMode: 'light' }),
    ]),
    h('section', { id: 'gunmetal-dark', class: 'preview-section preview-section--dark' }, [
      h('div', { class: 'preview-label' }, [
        h('span', 'How it Works — Gunmetal (dark)'),
        h('code', '<DeasyHowItWorks design="gunmetal" color-mode="dark" />'),
      ]),
      h(DeasyHowItWorks, { design: 'gunmetal', colorMode: 'dark' }),
    ]),
    h('section', { id: 'cube', class: 'preview-section preview-section--cube' }, [
      h('div', { class: 'preview-label' }, [
        h('span', 'Rotating Document — Cube v2'),
        h('code', '<DeasyRotatingDocument />'),
      ]),
      h(DeasyRotatingDocument),
    ]),
  ]),
}).mount('#app')
