// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: '/alexander143061/', 
//  // Add the base path for GitHub Pages
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1'
    ? '/alexander143061/' // GitHub Pages
    : '/',                // Vercel or local dev
})
