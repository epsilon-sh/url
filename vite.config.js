import { defineConfig, loadEnv } from 'vite'

const defaultEnv = {
  API_URL: 'http://localhost:3000',
}

export default defineConfig(({ mode }) => {
  process.env = {
    ...defaultEnv,
    ...process.env,
    ...loadEnv(mode, process.cwd(), 'VITE_'),
  }
  // Load env files from project root
  const env = {
    ...process.env,
    ...loadEnv(mode, process.cwd(), 'VITE_'),
  }

  return {
    root: 'ui',
    server: {
      proxy: {
        '/shorten': env.API_URL,
        '^/[A-Za-z0-9]{6}$': {
          target: env.API_URL,
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
  }
})
