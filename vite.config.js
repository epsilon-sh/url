import { defineConfig } from 'vite'

export default defineConfig({
  root: 'ui',
  server: {
    proxy: {
      '/shorten': 'http://localhost:3000',
      '^/[A-Za-z0-9]{6}$': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/static': {
        target: 'https://epsilon.sh',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
