import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/', // ensures correct path in production
  server: {
    host: true,
    // NOTE: Vite does not use `historyApiFallback`. It’s for webpack.
  },
  build: {
    outDir: 'dist',
  },
})
