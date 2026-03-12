import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fitnesstracker-backend-m43k.onrender.com',
        changeOrigin: true
      }
    }
  }
})
