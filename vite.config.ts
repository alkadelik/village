// import { fileURLToPath, URL } from 'node:url'
import path from "path"

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    strict: false, // Set this to false to ignore TS errors during the build process
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url))
      "@": path.resolve(__dirname, "./src"),
    }
  }
})
