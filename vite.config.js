import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/alexander143061/', 
 // Add the base path for GitHub Pages
  plugins: [react()],
})
