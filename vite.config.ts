import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/renderer')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        renderer: resolve(__dirname, 'src/renderer/main.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]'
      }
    }
  },
  base: './'
});
