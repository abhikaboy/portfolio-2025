import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 5173 is used by other local projects.
  server: { port: 5199, strictPort: true },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
