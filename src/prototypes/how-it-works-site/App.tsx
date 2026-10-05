import { HowItWorksDemo } from '../how-it-works/HowItWorksDemo'
import '../../variants/baseline/App.css'
import '../../variants/baseline/brand-themes.css'
import '../scanner-gunmetal/scanner.css'
import '../how-it-works/howItWorks.css'
import './site.css'

/* deasylabs.com is light only, so this page skips the theme shell and its
   stored colour mode, and sets the markup the styles key off directly. */
export default function App() {
  return (
    <div className="variant-shell hiw-site-page" data-brand-theme="rust" data-color-mode="light" data-theme="deasy">
      <main className="scanner-gunmetal how-it-works hiw-site">
        <header className="prototype-chrome wrap">
          <a className="prototype-back" href="/prototypes">← Prototypes</a>
        </header>
        <div className="site-intro">
          <h2>How it works</h2>
        </div>
        <HowItWorksDemo fixedHeader />
      </main>
    </div>
  )
}
