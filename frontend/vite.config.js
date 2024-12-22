import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with '/api' to the Flask backend
      '/api': {
        target: 'http://127.0.0.1:5000', // Flask backend URL
        changeOrigin: true,  // Needed for cross-origin requests
        secure: false,  // Set to false because you're running locally without HTTPS
        // Optionally rewrite paths if needed (e.g., remove '/api' prefix)
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
