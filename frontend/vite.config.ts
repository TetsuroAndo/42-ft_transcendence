import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  server: {
    port: parseInt(process.env.FRONTEND_PORT || '3000'),
    host: process.env.FRONTEND_HOST || true,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://${process.env.BACKEND_HOST || 'backend'}:${process.env.BACKEND_PORT || '4000'}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
