import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// All API traffic is same-origin under /api (see src/config.js). In production
// nginx rewrites /api/* to the FastAPI backend; this proxy does the same for
// the dev server. Override the target with API_PROXY_TARGET when the backend
// isn't on localhost:8000 (e.g. docker-compose.dev.yml).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
