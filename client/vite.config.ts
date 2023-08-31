import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    commonjsOptions: {
      requireReturnsDefault: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ['@vue-leaflet/vue-leaflet', 'leaflet'],
          socket: ['socket.io-client'],
          vue: ['vue', 'vue-gtag', 'vue-router', 'vuetify'],
        },
      },
    },
  },
  test: {
    globals: true,
  },
})
