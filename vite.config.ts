import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { codeInspectorPlugin } from 'code-inspector-plugin'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    open: true, // 自动打开浏览器
    proxy: {
      // 匹配 /api 开头请求
      // '/api': {
      //   target: 'http://api.example.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，类似 Vue CLI 的 pathRewrite
      // },
    },
  },
})
