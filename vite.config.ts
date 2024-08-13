import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), nodePolyfills()],
    define: {
      "process.env.REACT_APP_CONIQL_SOCKET": JSON.stringify(env.REACT_APP_CONIQL_SOCKET),
      "process.env.REACT_APP_CONIQL_SSL": JSON.stringify(env.REACT_APP_CONIQL_SSL)
    }
  }

})
