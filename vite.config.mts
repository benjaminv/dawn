import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import shopify from 'vite-plugin-shopify';
import cleanup from '@by-association-only/vite-plugin-shopify-clean';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
  },
  server: {
    https: true,
    cors: true,
  },
  plugins: [
    tailwindcss(),
    cleanup({
      themeRoot: './src/theme',
      // manifestFileName: '.vite/manifest.json',
    }),
    shopify({
      themeRoot: './src/theme',
      sourceCodeDir: './src/frontend',
      entrypointsDir: './src/frontend/entrypoints',
      snippetFile: 'vite-tag.liquid',
    }),
    mkcert(),
  ],
});
