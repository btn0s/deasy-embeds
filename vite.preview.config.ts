import vueJsx from '@vitejs/plugin-vue-jsx'
export default { plugins: [vueJsx()], server: { host: '0.0.0.0', port: 4173, strictPort: true }, publicDir: 'public', build: { rollupOptions: { input: ['vue-preview.html', 'reference-preview.html'] } }, define: { __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false } }
