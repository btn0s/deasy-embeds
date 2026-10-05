# Deasy embeds

The How it Works blade, scanner demo, and rotating-document 3D hero live as
**TypeScript source under `embeds/src/`** (see `embeds/src/prototypes/`) and
compile into a framework-agnostic ES module package. Drop it into any TS/JS
project; it does not need React, three.js or a bundler plugin on the host side.

- **Source of truth:** `embeds/src/` (published to [deasy-embeds](https://github.com/btn0s/deasy-embeds) under `src/`).
- Prototype routes in the Vite app re-import from `embeds/src` for local dev.
- React, motion, three.js and every image/model are bundled in (assets inlined).
- Each embed renders inside a shadow root, so its styles never touch the host page
  and the host's styles never touch it. The host `<html>`, `<body>` and
  localStorage are left alone.
- Only two things go into `document.head`: the Google Fonts stylesheet (opt out
  with `loadFonts: false` / `no-fonts`) and one `@property --pct` rule.

## Install

```sh
pnpm add github:btn0s/deasy-embeds   # or npm i / yarn add
```

Or copy the files into your project and import `./index.js` directly.

## Use

```ts
import { mountHowItWorks } from '@deasy/embeds/how-it-works'
import { mountScanner } from '@deasy/embeds/scanner'
import { mountRotatingDocument } from '@deasy/embeds/rotating-document'

const blade = mountHowItWorks(document.querySelector('#how-it-works')!)
// The reviewed site design is the default; no styling option is required.

const scanner = mountScanner(document.querySelector('#scanner')!, { colorMode: 'dark' })
scanner.update({ colorMode: 'light' })
scanner.unmount()

const hero = mountRotatingDocument(document.querySelector('#hero')!)
hero.unmount()
```

Or as custom elements:

```ts
import { defineHowItWorksElement } from '@deasy/embeds/how-it-works'
import { defineScannerElement } from '@deasy/embeds/scanner'
import { defineRotatingDocumentElement } from '@deasy/embeds/rotating-document'

defineHowItWorksElement()       // <deasy-how-it-works>
defineScannerElement()          // <deasy-scanner color-mode="light" transparent no-fonts>
defineRotatingDocumentElement() // <deasy-rotating-document show-topbar no-fonts>
```

In React, mount into a ref in an effect and call `unmount()` in the cleanup.
Import the subpaths (`/how-it-works`, `/scanner`, `/rotating-document`) rather than the root so
a page that only needs one blade doesn't load three.js.

`how-it-works` is the latest How it Works flow (connect up to four sources, Read,
Curate, Activate) with the reviewed home-v2 styling, fixed header, and
cream-on-charcoal palette by default. Use `mountHowItWorks(el)` or
`<deasy-how-it-works>` directly. The earlier treatment is available explicitly
with `design: 'gunmetal'` or `design="gunmetal"`; `colorMode` applies to that
legacy design. `scanner` is the earlier Gunmetal
scanner it was designed on; use `how-it-works` for the site module.

## Notes

- These were built as full-page prototypes: the scanners fill at least
  one viewport of height, and the hero listens to window scroll/wheel/touch.
- The hero hides the prototype's fake site top bar unless `showTopbar` is set.
  Append `?debug` to the host URL to show its Leva tuning panel.
- Size: the shared runtime is ~250 kB gzip, `how-it-works` adds ~870 kB (including the inlined site background),
  `scanner` adds ~45 kB, and the
  hero adds ~1.6 MB (three.js plus the inlined textures and model).

## Rebuild and publish

From `deasy-proto-01` after changing embed source:

```sh
pnpm build:embeds   # writes embeds/package
DEASY_EMBEDS_REPO=/path/to/deasy-embeds-clone node scripts/publish-deasy-embeds.mjs --push
```

The built package and `src/` tree are published to https://github.com/btn0s/deasy-embeds.
Its `example.html` shows every piece on a plain HTML page (serve the folder
statically, e.g. `python3 -m http.server`).
