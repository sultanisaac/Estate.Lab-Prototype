import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning limit from 500kB to 1000kB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy third-party libraries into their own chunk
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
        }
      }
    }
  }
})
