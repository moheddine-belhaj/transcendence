import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add proxy for backend API in development
    proxy: {
      '/api': {
        target: 'http://backend:5003', // Matches your backend service name in docker-compose
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add any other aliases you need
    },
  },
  // Production build specific settings
  build: {
    outDir: "dist",
    rollupOptions: {
      // Explicitly externalize any problematic imports
      external: mode === 'production' ? [] : []
    },
    sourcemap: mode === 'development'
  },
  // Ensure environment variables are properly loaded
  define: {
    'process.env': process.env
  }
}));