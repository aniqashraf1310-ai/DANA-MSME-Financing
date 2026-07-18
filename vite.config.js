import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configure Vite to load Tailwind dynamically
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
})