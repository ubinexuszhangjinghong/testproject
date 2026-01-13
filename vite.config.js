import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n'],
      dts: 'src/auto-imports.d.ts'
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8181',
        changeOrigin: false
      },
      '/auth': {
        target: 'http://127.0.0.1:8181',
        changeOrigin: false
      },
      '/web': {
        target: 'http://127.0.0.1:8181',
        changeOrigin: false
      },
      '/rests': {
        target: 'http://127.0.0.1:8181',
        changeOrigin: false
      },
      '/restconf': {
        target: 'http://127.0.0.1:8181',
        changeOrigin: false
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          const match = id.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
          if (match) {
            const pkgName = match[1].startsWith('@') ? match[1].replace(/[\\/]/g, '_') : match[1]
            // 常见大包做合并，避免过多小碎片
            if (/^@?vue(_|$)/.test(pkgName)) return 'vendor-vue'
            if (/^element-plus/.test(pkgName)) return 'vendor-element-plus'
            if (/^echarts/.test(pkgName)) return 'vendor-echarts'
            if (/^lodash/.test(pkgName)) return 'vendor-lodash'
            if (/^xlsx/.test(pkgName)) return 'vendor-xlsx'
            if (/^dayjs/.test(pkgName)) return 'vendor-dayjs'
            return `vendor-${pkgName}`
          }
          return 'vendor'
        }
      }
    }
  }
}) 