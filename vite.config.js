import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fork } from 'child_process';
import net from 'net';

function backendServerPlugin() {
  let backendProc = null;
  return {
    name: 'backend-server-plugin',
    configureServer() {
      const socket = new net.Socket();
      socket.setTimeout(800);
      socket.connect(5000, '127.0.0.1', () => {
        socket.destroy();
        console.log('📡 [Thread Elite] Backend server already active on port 5000.');
      });
      socket.on('error', () => {
        socket.destroy();
        console.log('🚀 [Thread Elite] Launching backend server on http://localhost:5000...');
        backendProc = fork('./node_modules/tsx/dist/cli.mjs', ['watch', 'server/src/server.ts'], {
          stdio: 'inherit',
          env: process.env,
        });
      });
      socket.on('timeout', () => {
        socket.destroy();
      });

      const cleanup = () => {
        if (backendProc) {
          try { backendProc.kill(); } catch (e) {}
          backendProc = null;
        }
      };

      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      process.on('exit', cleanup);
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    backendServerPlugin()
  ],
  build: {
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('ogl')) {
              return 'vendor-graphics';
            }
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-animation';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
