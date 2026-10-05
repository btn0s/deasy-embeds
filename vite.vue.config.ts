import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, type Plugin } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))
const parent = fileURLToPath(new URL('..', import.meta.url))
const inMonorepo = existsSync(`${parent}src/prototypes/registry.ts`)
const publicDir = existsSync(`${root}public`) ? `${root}public/` : `${parent}public/`
function inlineSceneAssets(): Plugin {
  const pattern = /(['"])(\/(?:brand|renders|models)\/[^'"\s]+\.(?:png|webp|jpe?g|svg|glb))\1/g
  return {
    name: 'deasy-native-vue-assets', enforce: 'pre',
    transform(code, id) {
      if (!id.includes('/src/vue/') || !/\.[jt]sx?$/.test(id)) return
      const assets = new Map<string, string>()
      const body = code.replace(pattern, (_, _quote, path: string) => {
        if (!assets.has(path)) assets.set(path, `__deasyAsset${assets.size}`)
        return assets.get(path)!
      })
      if (!assets.size) return
      return { code: [...assets].map(([path, name]) => `import ${name} from ${JSON.stringify(publicDir + path.slice(1))};`).join('\n') + '\n' + body, map: null }
    },
    generateBundle() {
      for (const id of this.getModuleIds()) {
        if (/\/node_modules\/(?:react|react-dom|@react-three)\//.test(id) || /\/src\/(?:shadow|how-it-works|rotating-document)\.[jt]sx?$/.test(id)) {
          this.error(`React renderer reached native Vue build: ${id}`)
        }
      }
    },
  }
}
export default defineConfig({
  root, publicDir: false, assetsInclude: ['**/*.glb'],
  plugins: [inlineSceneAssets(), vueJsx()],
  resolve: { alias: [{ find: /^\/(brand|renders|models)\//, replacement: `${publicDir}$1/` }] },
  define: { 'process.env.NODE_ENV': JSON.stringify('production'), __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false },
  build: {
    outDir: inMonorepo ? `${root}package` : root,
    emptyOutDir: false, copyPublicDir: false, assetsInlineLimit: Infinity,
    lib: { entry: `${root}src/vue/index.ts`, formats: ['es'], fileName: () => 'vue.js' },
    rollupOptions: { external: ['vue'], output: { chunkFileNames: 'vue-chunks/[name]-[hash].js' } },
  },
})
