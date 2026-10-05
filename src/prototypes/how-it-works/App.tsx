import { BaselineThemeShell, useBaselineTheme } from '../../variants/baseline/BaselineThemeShell'
import { HowItWorksDemo } from './HowItWorksDemo'
import '../../variants/baseline/App.css'
import '../scanner-gunmetal/scanner.css'
import './howItWorks.css'

/* The base scanner's colour mode lives in its dev dial; this page has no
   dial, so it gets a plain two-segment switch instead. */
function ModeToggle() {
  const { colorMode, toggleColorMode } = useBaselineTheme()
  return (
    <div className="mode-toggle" role="group" aria-label="Color mode">
      <button
        type="button"
        aria-pressed={colorMode === 'light'}
        data-active={colorMode === 'light'}
        onClick={colorMode === 'light' ? undefined : toggleColorMode}
      >
        Light
      </button>
      <button
        type="button"
        aria-pressed={colorMode === 'dark'}
        data-active={colorMode === 'dark'}
        onClick={colorMode === 'dark' ? undefined : toggleColorMode}
      >
        Dark
      </button>
    </div>
  )
}

export default function App() {
  return (
    <BaselineThemeShell>
      <main className="scanner-gunmetal how-it-works">
        <header className="prototype-chrome wrap">
          <a className="prototype-back" href="/prototypes">← Prototypes</a>
          <ModeToggle />
        </header>
        <HowItWorksDemo />
      </main>
    </BaselineThemeShell>
  )
}
