import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Docs 개발 시 dist 산출물 대신 라이브러리 소스를 직접 바라보게 해서
      // 컴포넌트 수정이 즉시 반영되도록 한다.
      'orot-ui': path.resolve(__dirname, '../../src'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '../..')],
    },
  },
});
