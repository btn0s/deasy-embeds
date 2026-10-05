import { useState } from 'react'
import { liveMapPopupVisualSrc } from './liveMapPopupAssets'
import {
  liveMapPopupCopy,
  type LiveMapPopupVariant,
} from './liveMapPopupVariants'
import './LiveMapPopup.css'

type ColorMode = 'light' | 'dark'

export type LiveMapPopupProps = {
  bleed: boolean
  colorMode: ColorMode
  shimmer: boolean
  variant: LiveMapPopupVariant
}

function PopupClose({ onDismiss }: { onDismiss: () => void }) {
  return (
    <button className="popup-close" type="button" aria-label="Dismiss" onClick={onDismiss}>
      ×
    </button>
  )
}

function PopupMinimize({ onMinimize }: { onMinimize: () => void }) {
  return (
    <button
      className="popup-minimize"
      type="button"
      aria-label="Minimize announcement"
      onClick={onMinimize}
    >
      Minimize
    </button>
  )
}

function PopupTitleRow() {
  return (
    <div className="popup-title-row">
      <h4>{liveMapPopupCopy.title}</h4>
      <span className="new-badge">New</span>
    </div>
  )
}

function PopupCta({ shimmer, compact = false }: { shimmer: boolean; compact?: boolean }) {
  return (
    <a
      className={[
        'popup-cta',
        compact ? 'popup-cta--compact' : '',
        shimmer ? 'popup-cta--shimmer' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      href="https://www.deasylabs.com/demo"
    >
      {liveMapPopupCopy.cta}
    </a>
  )
}

function PopupVisual({
  colorMode,
  variant,
  bleed,
  context,
}: {
  colorMode: ColorMode
  variant: LiveMapPopupVariant
  bleed: boolean
  context: 'expanded' | 'collapsed'
}) {
  const src = liveMapPopupVisualSrc('orchestration', colorMode)

  if (context === 'collapsed') {
    return (
      <span className="popup-collapsed-visual" aria-hidden="true">
        <img src={src} alt="" />
      </span>
    )
  }

  const layout = variant === 'border-beam' ? 'strip' : 'rail'

  return (
    <div
      className={[
        'popup-visual',
        `popup-visual--${layout}`,
        bleed ? 'is-bleed' : 'is-inset',
      ].join(' ')}
      aria-hidden="true"
    >
      {bleed ? <div className="popup-visual-mesh" /> : null}
      <img className="popup-visual-art" src={src} alt="" />
    </div>
  )
}

function VerticalExpanded({
  bleed,
  colorMode,
  shimmer,
  onMinimize,
  onDismiss,
}: {
  bleed: boolean
  colorMode: ColorMode
  shimmer: boolean
  onMinimize: () => void
  onDismiss: () => void
}) {
  return (
    <>
      <PopupClose onDismiss={onDismiss} />
      <div className="popup-vertical-inner">
        <div className="popup-stagger-visual">
          <PopupVisual bleed={bleed} colorMode={colorMode} context="expanded" variant="border-beam" />
        </div>
        <div className="popup-vertical-body popup-stagger-body">
          <PopupTitleRow />
          <p>{liveMapPopupCopy.description}</p>
          <PopupCta shimmer={shimmer} />
          <PopupMinimize onMinimize={onMinimize} />
        </div>
      </div>
    </>
  )
}

function HorizontalExpanded({
  bleed,
  colorMode,
  shimmer,
  onMinimize,
  onDismiss,
}: {
  bleed: boolean
  colorMode: ColorMode
  shimmer: boolean
  onMinimize: () => void
  onDismiss: () => void
}) {
  return (
    <>
      <PopupClose onDismiss={onDismiss} />
      <div className="popup-split">
        <div className="popup-split-rail popup-stagger-rail">
          <PopupVisual bleed={bleed} colorMode={colorMode} context="expanded" variant="split-rail" />
        </div>
        <div className="popup-split-main popup-stagger-body">
          <PopupTitleRow />
          <p>{liveMapPopupCopy.description}</p>
          <PopupCta compact shimmer={shimmer} />
          <PopupMinimize onMinimize={onMinimize} />
        </div>
      </div>
    </>
  )
}

function CollapsedTrigger({
  bleed,
  colorMode,
  variant,
  onExpand,
}: {
  bleed: boolean
  colorMode: ColorMode
  variant: LiveMapPopupVariant
  onExpand: () => void
}) {
  return (
    <button className="popup-collapsed-trigger" type="button" onClick={onExpand}>
      <PopupVisual bleed={bleed} colorMode={colorMode} context="collapsed" variant={variant} />
      <span className="popup-collapsed-copy">
        <span className="popup-collapsed-title">{liveMapPopupCopy.title}</span>
        <span className="new-badge">New</span>
      </span>
    </button>
  )
}

export function LiveMapPopup({ bleed, colorMode, shimmer, variant }: LiveMapPopupProps) {
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(() => window.matchMedia('(min-width: 521px)').matches)

  if (!visible) return null

  const dismiss = () => setVisible(false)
  const minimize = () => setExpanded(false)
  const expand = () => setExpanded(true)

  return (
    <aside
      className={`live-map-popup live-map-popup--${variant} ${expanded ? 'is-expanded' : 'is-collapsed'}`}
      data-bleed={bleed ? 'true' : 'false'}
      data-popup-variant={variant}
      role="dialog"
      aria-label="Live Map early access"
    >
      {expanded ? (
        variant === 'border-beam' ? (
          <VerticalExpanded
            bleed={bleed}
            colorMode={colorMode}
            shimmer={shimmer}
            onMinimize={minimize}
            onDismiss={dismiss}
          />
        ) : (
          <HorizontalExpanded
            bleed={bleed}
            colorMode={colorMode}
            shimmer={shimmer}
            onMinimize={minimize}
            onDismiss={dismiss}
          />
        )
      ) : (
        <>
          <PopupClose onDismiss={dismiss} />
          <CollapsedTrigger
            bleed={bleed}
            colorMode={colorMode}
            variant={variant}
            onExpand={expand}
          />
        </>
      )}
    </aside>
  )
}
