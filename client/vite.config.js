import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {usePolling: true},
    proxy: {
      '/auth': {
        target: 'http://localhost:8000/',
        changeOrigin: true
      },
      '/api': {
        target: 'http://localhost:8000/',
        changeOrigin: true
      }
    }
  }
})
