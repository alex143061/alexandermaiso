import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1'
    ? '/alexandermaiso/' // GitHub Pages
    : '/',                // Vercel or local dev
  build: {
    sourcemap: false // ⛔ disables .map files in the build output
  }
})
