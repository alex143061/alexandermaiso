import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/alex-devhub/', // 👈 Add this line
  plugins: [react()],
})
