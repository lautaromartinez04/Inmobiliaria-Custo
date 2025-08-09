import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,           // <-- esto permite acceso desde la red
    port: 5173,           // opcional, cambiá si querés usar otro puerto
  },
});