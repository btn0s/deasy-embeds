import { copyFileSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const embeds = fileURLToPath(new URL('.', import.meta.url))
const monorepoRoot = fileURLToPath(new URL('..', import.meta.url))
const inMonorepo =
  existsSync(`${monorepoRoot}/package.json`) && existsSync(`${monorepoRoot}/src/prototypes/registry.ts`)
const publicDir = existsSync(`${embeds}public/`)
  ? `${embeds}public/`
  : inMonorepo
    ? `${monorepoRoot}public/`
    : `${embeds}public/`
const EMPTY_CSS = '\0deasy-embed-empty-css'

function prototypeAdapter(): Plugin {
  const literal = /(['"])(\/(?:brand|renders|models)\/[^'"\s]+\.(?:png|webp|jpe?g|svg|glb))\1/g
  return {
    name: 'deasy-embed-adapter',
    enforce: 'pre',
    resolveId(source, importer) {
      if (importer && !importer.includes('/embeds/') && /\.css$/.test(source)) return EMPTY_CSS
    },
    load(id) {
      if (id === EMPTY_CSS) return ''
    },
    transform(code, id) {
      if (!/\/embeds\/src\/.*\.[jt]sx?$/.test(id) && !/^.*\/src\/.*\.[jt]sx?$/.test(id)) return
      if (!id.includes('/src/') || code.search(literal) === -1) return
      const assets = new Map<string, string>()
      const body = code.replace(literal, (_, _q, path: string) => {
        if (!assets.has(path)) assets.set(path, `__deasyAsset${assets.size}`)
        return assets.get(path)!
      })
      const imports = [...assets].map(([path, name]) => `import ${name} from ${JSON.stringify(publicDir + path.slice(1))};`)
      return { code: `${imports.join('\n')}\n${body}`, map: null }
    },
  }
}

function packageFiles(): Plugin {
  const outDir = inMonorepo ? `${embeds}package` : embeds
  return {
    name: 'deasy-embed-package-files',
    closeBundle() {
      if (!inMonorepo) return
      for (const file of readdirSync(`${embeds}types`)) copyFileSync(`${embeds}types/${file}`, `${embeds}package/${file}`)
      copyFileSync(`${embeds}package.template.json`, `${embeds}package/package.json`)
      copyFileSync(`${embeds}README.md`, `${embeds}package/README.md`)
    },
  }
}

export default defineConfig({
  root: embeds,
  publicDir: false,
  assetsInclude: ['**/*.glb'],
  plugins: [prototypeAdapter(), react(), packageFiles()],
  resolve: {
    alias: [
      { find: /^\/(brand|renders|models)\//, replacement: `${publicDir}$1/` },
      { find: '@', replacement: `${embeds}src` },
    ],
  },
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: inMonorepo ? `${embeds}package` : embeds,
    emptyOutDir: inMonorepo,
    copyPublicDir: false,
    assetsInlineLimit: Number.POSITIVE_INFINITY,
    cssCodeSplit: false,
    sourcemap: false,
    lib: {
      entry: {
        index: `${embeds}src/index.ts`,
        scanner: `${embeds}src/scanner.tsx`,
        'how-it-works': `${embeds}src/how-it-works.tsx`,
        'rotating-document': `${embeds}src/rotating-document.tsx`,
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: { chunkFileNames: 'chunks/[name]-[hash].js' },
    },
  },
})
