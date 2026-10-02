# Deasy embeds

The How it Works blade (`src/prototypes/how-it-works`), the scanner demo
(`src/prototypes/scanner-gunmetal`) and the rotating-document 3D hero
(`src/prototypes/rotating-cube-v2`) compiled into a framework-agnostic
ES module package. Drop it into any TS/JS project; it does not need React,
three.js or a bundler plugin on the host side.

- Built straight from the prototype source; nothing there is modified or forked.
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

const blade = mountHowItWorks(document.querySelector('#how-it-works')!, { colorMode: 'light' })
blade.update({ colorMode: 'dark' })

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

defineHowItWorksElement()       // <deasy-how-it-works color-mode="light" transparent no-fonts>
defineScannerElement()          // <deasy-scanner color-mode="light" transparent no-fonts>
defineRotatingDocumentElement() // <deasy-rotating-document show-topbar no-fonts>
```

In React, mount into a ref in an effect and call `unmount()` in the cleanup.
Import the subpaths (`/how-it-works`, `/scanner`, `/rotating-document`) rather than the root so
a page that only needs one blade doesn't load three.js.

`how-it-works` is the latest How it Works flow (connect up to four sources, Read,
Curate, Activate) in the Gunmetal treatment by default. Set `design: 'site'` or
`<deasy-how-it-works design="site">` for the reviewed home-v2 styling,
fixed header, and cream-on-charcoal palette. `scanner` is the earlier Gunmetal
scanner it was designed on; use `how-it-works` for the site module.

## Notes

- These were built as full-page prototypes: the scanners fill at least
  one viewport of height, and the hero listens to window scroll/wheel/touch.
- The hero hides the prototype's fake site top bar unless `showTopbar` is set.
  Append `?debug` to the host URL to show its Leva tuning panel.
- Size: the shared runtime is ~250 kB gzip, `how-it-works` and `scanner` each
  add ~45 kB (mostly the inlined source marks, shared between them), and the
  hero adds ~1.6 MB (three.js plus the inlined textures and model).

## Rebuild

From the repo root after changing a prototype:

```sh
pnpm build:embeds   # writes embeds/package
```

The built package is published to https://github.com/btn0s/deasy-embeds.
Its `example.html` shows every piece on a plain HTML page (serve the folder
statically, e.g. `python3 -m http.server`).
