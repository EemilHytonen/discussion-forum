import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
  proxy: process.env.NODE_ENV === "development" ? {
    '/api': 'http://localhost:8000'
  } : undefined
  }
});
