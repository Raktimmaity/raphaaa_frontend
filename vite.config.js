import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  server: {
    host: true,
  },
  build: {
    outDir: 'dist',
    minify: 'terser', // Minifies JS/CSS
    cssCodeSplit: true, // Splits CSS by component
    sourcemap: false, // Prevents revealing source in DevTools
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});
