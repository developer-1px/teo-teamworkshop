import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시 리포지토리 이름 뒤에 경로가 붙으므로 상대 경로로 설정
  base: './',
})