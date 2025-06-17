import { defineConfig } from 'vite'
import fs from 'fs';

export default defineConfig({
plugins: [
    {
      name: 'raw-html-loader',
      transform(_, id) {
        if (id.endsWith('.html')) {
          const content = fs.readFileSync(id, 'utf-8');
          return `export default ${JSON.stringify(content)}`;
        }
      },
    },
  ],
  assetsInclude: ['**/*.html'],
  server: {
    proxy: {
      
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // Keep /api in the path
      }
    },
    host: true,  
    port: 5173,
     fs: {
      // Allow serving files from project root
      allow: ['..']
    }
  }
})