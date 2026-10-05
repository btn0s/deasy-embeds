import { Moon, Sun } from 'lucide-react'
import { BaselineThemeShell, useBaselineTheme } from './BaselineThemeShell'
import { BrandThemeDialRoot, useLiveMapPopupDial } from './BrandThemeDial'
import { InteractionFlow } from './InteractionFlow'
import { LiveMapPopup } from './LiveMapPopup'
import { RotatingHeroWord } from './RotatingHeroWord'
import type { ColorMode } from './baselineShell'
import './App.css'

function ThemeModeButton({ mode, onToggle }: { mode: ColorMode; onToggle: () => void }) {
  const nextMode = mode === 'light' ? 'dark' : 'light'

  return (
    <button
      aria-label={`Switch to ${nextMode} mode`}
      className="theme-mode-button"
      onClick={onToggle}
      title={`Switch to ${nextMode} mode`}
      type="button"
    >
      {mode === 'light' ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </button>
  )
}

function Header({ colorMode, onToggle }: { colorMode: ColorMode; onToggle: () => void }) {
  return (
    <header className="site-header">
      <div className="site-inner">
        <a className="brand" href="/" aria-label="Deasy Labs home">
          <span aria-hidden="true" className="brand-lockup" />
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#platform">Platform</a>
          <a href="#payoff">Blog</a>
          <a href="#platform">Docs</a>
          <div className="nav-actions">
            <a className="button button-primary" href="https://www.deasylabs.com/demo">Book a demo</a>
            <ThemeModeButton mode={colorMode} onToggle={onToggle} />
          </div>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero wrap">
      <h1>
        <span className="hero-line">
          Catch <RotatingHeroWord />
        </span>
        <span className="hero-line">before they become context</span>
      </h1>
      <p className="lede">
        Good answers start with good sources. Deasy reads across your files and systems, figures out how everything connects, and delivers the right context to your agents at runtime.
      </p>
    </section>
  )
}

function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-inner">
        <span>Brought to you by <b>Collibra</b></span><span className="trust-dot" />
        <span>Featured in <b>TechCrunch</b></span><span className="trust-dot" />
        <span>Petabyte scale, your cloud</span>
      </div>
    </div>
  )
}

function Payoff() {
  return (
    <section className="payoff" id="payoff">
      <div className="wrap">
        <div className="payoff-heading"><span className="eyebrow">The payoff</span></div>
        <div className="payoff-grid">
          <article><h3>Improve accuracy by <span>46%</span></h3><p>Your AI retrieves from high-quality, relevant knowledge — not the wild west of your company&apos;s files.</p></article>
          <article><h3>Save hundreds of hours</h3><p>Turn three months of data preparation into three minutes.</p></article>
          <article><h3>Keep answers reliable over time</h3><p>As files get added and changed, Deasy re-reads and re-filters automatically, so answers never go stale.</p></article>
        </div>
        <div className="payoff-cta"><a className="button button-primary with-arrow" href="https://www.deasylabs.com/demo">See it on your data</a></div>
      </div>
    </section>
  )
}

function BaselinePage() {
  const { colorMode, toggleColorMode } = useBaselineTheme()
  const liveMapPopup = useLiveMapPopupDial()

  return (
    <>
      <Header colorMode={colorMode} onToggle={toggleColorMode} />
      <main>
        <Hero />
        <InteractionFlow />
        <TrustBar />
        <Payoff />
      </main>
      <LiveMapPopup
        bleed={liveMapPopup.bleed}
        colorMode={colorMode}
        shimmer={liveMapPopup.shimmer}
        variant={liveMapPopup.variant}
      />
    </>
  )
}

function App() {
  return (
    <BaselineThemeShell dial={<BrandThemeDialRoot />}>
      <BaselinePage />
    </BaselineThemeShell>
  )
}

export default App

export { DataSourceDemo } from './DataSourceDemo'
