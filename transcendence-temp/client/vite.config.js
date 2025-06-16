import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3333,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'
    }
  }
}); 