import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo-192.png', 'logo-512.png'],
      manifest: {
        name: 'CheckIt! - Schulplaner',
        short_name: 'CheckIt!',
        description: 'Dein digitaler Schulplaner',
        theme_color: '#7c3aed',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/checkIt/',
        start_url: '/checkIt/',
        icons: [
          { src: 'logo-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'logo-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
  base: '/checkIt/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          storage: ['dexie', 'dexie-react-hooks'],
          dates: ['date-fns'],
        },
      },
    },
  },
});
