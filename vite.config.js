import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ach.runasp.net',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
