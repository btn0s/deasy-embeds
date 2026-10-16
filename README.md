# Deasy embeds

Native **Vue 3** components for the Deasy **How it Works** blade and
**Rotating Document (Cube v2)** 3D hero live as TypeScript source under
`embeds/src/vue/` and compile into `@deasy/embeds/vue` (`vue.js`).

- **Handoff entry point:** `@deasy/embeds/vue` (`./vue.js`), with TypeScript source under `src/vue/`.
- **Self-contained:** motion, Three.js (via TresJS), textures, 3D model, and CSS are bundled into the Vue package. No React renderer is loaded.
- **Shadow DOM isolation:** each component renders inside an open shadow root so its styles never leak into the host page and host styles never affect it.
- **Minimal head footprint:** only the Google Fonts stylesheet (opt out with `:load-fonts="false"`) and one `@property --pct` rule are added to `document.head`.

## Install

```sh
pnpm add github:btn0s/deasy-embeds   # or npm i / yarn add
```

Or copy `vue.js` and `chunks/` into your project and import `./vue.js` directly.

## Use (Vue 3 — primary handoff)

Install `vue` (`^3.5.0`) in the host app, then import the components from `@deasy/embeds/vue`:

```vue
<script setup lang="ts">
import { DeasyHowItWorks, DeasyRotatingDocument } from '@deasy/embeds/vue'
</script>

<template>
  <!-- Reviewed site design on a dark surround (default) -->
  <DeasyHowItWorks />

  <!-- Site design on a light surround -->
  <DeasyHowItWorks color-mode="light" />

  <!-- Rotating Document / Cube v2 hero -->
  <DeasyRotatingDocument :show-topbar="false" />
</template>
```

### `DeasyHowItWorks` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `colorMode` | `'dark' \| 'light'` | `'dark'` | Dark or light surround. |
| `transparent` | `boolean` | `false` | Leave the outer shell background transparent so the host page shows through. |
| `loadFonts` | `boolean` | `true` | Inject the Google Fonts stylesheet into `document.head`. |

### `DeasyRotatingDocument` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `showTopbar` | `boolean` | `false` | Show the prototype's site top bar. |
| `loadFonts` | `boolean` | `true` | Inject the Google Fonts stylesheet into `document.head`. |

## Develop the native Vue source

In the handoff repository, install the source dependencies (the root
`package.json` describes the distributable package):

```sh
npm install --no-save $(node -p "Object.entries({...JSON.parse(require('fs').readFileSync('package-source.json')).dependencies,...JSON.parse(require('fs').readFileSync('package-source.json')).devDependencies}).map(([name,version])=>name+'@'+version).join(' ')")
npx vite --config vite.preview.config.ts
npx vite build --config vite.vue.config.ts
```

Open `/vue-preview.html` to preview the native Vue widgets (or `/vue-preview.html?bundle` to preview the built `vue.js`).
Use `npx tsc --project tsconfig.vue.json` to type-check the Vue source.
Vue JSX is only required when rebuilding the source; consumers of `@deasy/embeds/vue` only need Vue 3.

## Rebuild and publish

From `deasy-proto-01` after changing embed source:

```sh
pnpm build:embeds   # writes embeds/package
DEASY_EMBEDS_REPO=/path/to/deasy-embeds-clone node scripts/publish-deasy-embeds.mjs --push
```

The built package and `src/` tree are published to https://github.com/btn0s/deasy-embeds.
Its `example.html` mounts the Vue components (`DeasyHowItWorks` and `DeasyRotatingDocument`) on a plain HTML page.

## Deprecated React entry points

> **Deprecated:** The React and custom-element entry points (`index.js`, `how-it-works.js`, `scanner.js`, `rotating-document.js`, and the `<deasy-how-it-works>`, `<deasy-scanner>`, and `<deasy-rotating-document>` custom elements) are deprecated and retained only for legacy prototype hosting. Use `@deasy/embeds/vue` (`./vue.js`) for all handoff and production integration.
