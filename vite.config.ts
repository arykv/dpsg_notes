import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        // Keep the first paint tiny: React + router ship in the entry, everything
        // heavier (search index, palette, motion) splits off on demand.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('fuse.js')) return 'search'
          if (id.includes('cmdk') || id.includes('@radix-ui')) return 'overlays'
          if (id.includes('motion')) return 'motion'
          if (id.includes('lucide-react')) return 'icons'
        },
      },
    },
  },
})
