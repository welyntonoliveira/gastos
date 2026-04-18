import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ou vue()

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})