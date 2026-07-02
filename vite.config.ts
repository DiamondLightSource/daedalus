import { defineConfig, loadEnv } from 'vite'
import reactPlugin from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [reactPlugin()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    test: {
            environment: 'jsdom',
            include: ['**/*.test.ts', '**/*.test.tsx'],
            globals: true,
            setupFiles: 'src/setupTests.tsx',
            css: true,
        },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  }
})
