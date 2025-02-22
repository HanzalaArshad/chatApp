import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Creates '@' alias for 'src' folder
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'

    },
  },
});
