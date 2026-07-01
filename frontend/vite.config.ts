import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor'
          }
          if (id.includes('/node_modules/@tanstack/')) {
            return 'query-vendor'
          }
          if (
            id.includes('/node_modules/radix-ui') ||
            id.includes('/node_modules/lucide-react') ||
            id.includes('/node_modules/motion') ||
            id.includes('/node_modules/class-variance-authority') ||
            id.includes('/node_modules/clsx') ||
            id.includes('/node_modules/tailwind-merge')
          ) {
            return 'ui-vendor'
          }
          if (
            id.includes('/node_modules/react-hook-form') ||
            id.includes('/node_modules/@hookform') ||
            id.includes('/node_modules/zod') ||
            id.includes('/node_modules/@hookform/resolvers')
          ) {
            return 'form-vendor'
          }
        },
      },
    },
  },
})
