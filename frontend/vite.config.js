import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vitejs.dev/config/
export default ({ mode }) => {
    // Load environment variables based on the current mode (development, production, etc.)
    const env = loadEnv(mode, process.cwd());

    console.log('Backend Target:', env.VITE_BACKEND_URL);

    return defineConfig({
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 3000,
            proxy: {
                "/api": {
                    target: env.VITE_BACKEND_URL,
                    changeOrigin: true
                }
            }
        }
    });
};