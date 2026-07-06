import { defineConfig } from 'vite';

export default defineConfig({
  root: './project',
  build: {
    outDir: '../dist',
  },
  server: {
    port: 3000,
    proxy: {
      '/generate': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true
      }
    }
  }
});