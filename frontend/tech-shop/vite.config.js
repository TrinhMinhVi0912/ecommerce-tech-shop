import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Có thể thêm nhiều alias khác nếu muốn
      '@components': path.resolve(__dirname, './src'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
})