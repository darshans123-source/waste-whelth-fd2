<<<<<<< HEAD
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
<<<<<<< HEAD
      },
    },
  },
});
=======
      }
    }
  }
})
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
