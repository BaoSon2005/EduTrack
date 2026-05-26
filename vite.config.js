import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ép hệ thống hiểu 'react-native' chính là 'react-native-web' khi chạy trên trình duyệt
      'react-native': 'react-native-web',
    },
  },
})