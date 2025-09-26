import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), nodePolyfills()],
    test: {
            environment: 'jsdom',
            include: ['**/*.test.ts', '**/*.test.tsx'],
            globals: true
        },
  }

})
