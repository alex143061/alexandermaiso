import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Alexander/', 
 // Add the base path for GitHub Pages
  plugins: [react()],
})
