import rotatingCss from './prototypes/rotating-cube-v2/App.css?inline'
import RotatingDocument from './prototypes/rotating-cube-v2/App'
import { defineEmbedElement, mountInShadow, type EmbedHandle, type MountOptions } from './shadow'

export type RotatingDocumentOptions = MountOptions & {
  /** Keep the prototype's fake site top bar (default false). */
  showTopbar?: boolean
}

const embedCss = `
.deasy-embed-root { font-family: 'Rethink Sans', sans-serif; }
:host(:not([data-topbar])) .prototype-topbar { display: none; }
`

export type RotatingDocumentHandle = Pick<EmbedHandle, 'unmount'>

/** Render the rotating-document hero (3D scene, copy and toggle) into `el`. */
export function mountRotatingDocument(el: HTMLElement, options: RotatingDocumentOptions = {}): RotatingDocumentHandle {
  el.toggleAttribute('data-topbar', Boolean(options.showTopbar))
  const { unmount } = mountInShadow(el, 'rotating-document', [rotatingCss, embedCss], <RotatingDocument />, options)
  return { unmount }
}

/** Register `<deasy-rotating-document show-topbar no-fonts>`. */
export function defineRotatingDocumentElement(tag = 'deasy-rotating-document') {
  defineEmbedElement(
    tag,
    [],
    (el) => mountRotatingDocument(el, { showTopbar: el.hasAttribute('show-topbar'), loadFonts: !el.hasAttribute('no-fonts') }),
  )
}
