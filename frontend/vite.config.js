import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

console.log('Backend Target:', process.env.BACKEND_TARGET);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0",
        port: 3000,
        proxy: {
            "/api": {
                target: process.env.BACKEND_TARGET,
                changeOrigin: true
            }
        }
    }
})
