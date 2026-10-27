import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Source maps are opt-in: they are useful for debugging a local build but
// they roughly double the deploy size and expose the original source.
const enableSourceMaps = process.env.VITE_ENABLE_SOURCEMAP === 'true'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    sourcemap: enableSourceMaps,
    target: 'esnext',            // modern browsers only → smaller bundles
    cssCodeSplit: true,          // split CSS per chunk for faster parsing
    // Keep three.js in its own chunk so the app code can be cached and
    // re-deployed independently of the 3D runtime.
    rollupOptions: {
      output: {
        compact: true,           // smaller output filenames
        manualChunks: {
          three: ['three'],
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion', 'gsap'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
