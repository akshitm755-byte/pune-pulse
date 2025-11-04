import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This proxy is for LOCAL development
  // It tells `npm run dev` to send API requests to your live ALB
  server: {
    proxy: {
      '/api': {
        target: 'http://YOUR_ALB_URL_HERE', // <<< PASTE YOUR ALB URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
})