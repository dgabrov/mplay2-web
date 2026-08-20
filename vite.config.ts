import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Requests starting with /api will be forwarded to target
      '/mediaserv': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
