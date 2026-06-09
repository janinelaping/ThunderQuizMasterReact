import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ThunderQuizMasterReact/',
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
});
