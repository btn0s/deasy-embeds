import { onBeforeUnmount, onMounted, shallowRef, watch, type WatchSource } from 'vue'

/** Run DOM/scene effects only after refs attach, replacing their resources on change. */
export function watchAfterMount(effect: () => void | (() => void), dependencies: () => readonly unknown[]) {
  let mounted = false
  let cleanup: void | (() => void)
  const run = () => {
    if (!mounted) return
    if (typeof cleanup === 'function') cleanup()
    cleanup = effect()
  }
  const stop = watch(dependencies as WatchSource, run, { flush: 'post' })
  onMounted(() => { mounted = true; run() })
  onBeforeUnmount(() => { mounted = false; stop(); if (typeof cleanup === 'function') cleanup() })
}

export function useMotionPreference() {
  const reduced = shallowRef(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  onMounted(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => { reduced.value = query.matches }
    query.addEventListener('change', change)
    cleanup = () => query.removeEventListener('change', change)
  })
  let cleanup = () => {}
  onBeforeUnmount(() => cleanup())
  return reduced
}

export function loadEmbedFonts(enabled: boolean) {
  if (!enabled || typeof document === 'undefined' || document.querySelector('[data-deasy-vue-fonts]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Gilda+Display&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&family=IBM+Plex+Mono:wght@400;500&display=swap'
  link.dataset.deasyVueFonts = ''
  document.head.append(link)
}

/** Preserve the shipped embed's page-token adaptation and document-only rules. */
export function adaptEmbedCss(css: string) {
  const documentOnly = /@(?:property|font-face)[^{]*\{[^}]*\}/g
  const lifted = css.match(documentOnly) ?? []
  const scoped = css.replace(documentOnly, '')
    .replace(/(?:^|\})\s*(?:html\[[^{]*|#root)\s*\{[^}]*\}/gm, rule => rule.startsWith('}') ? '}' : '')
    .replace(/(^|[\s,}])html(\s*[{,])/g, '$1:host$2')
    .replace(/(^|[\s,}])body(\s*[{,])/g, '$1:host$2')
    .replace(/:root\b/g, ':host')
  return { css: ':host{display:block;position:relative}\n' + scoped, lifted }
}
export function loadDocumentRules(key: string, rules: string[]) {
  if (!rules.length || document.head.querySelector(`style[data-deasy-vue-rules="${key}"]`)) return
  const style = document.createElement('style')
  style.dataset.deasyVueRules = key
  style.textContent = rules.join('\n')
  document.head.append(style)
}
