import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: [
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'og-image.png',
          'robots.txt',
          'sitemap.xml',
        ],
        manifest: false, // Managed in public/manifest.json
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
          runtimeCaching: [
            // Google Fonts Stylesheet
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
                },
              },
            },
            // Google Fonts Webfonts
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // Planilha Google Sheets:
            // NetworkFirst com timeout curto (3s) e TTL de 5 minutos (300s)
            // Impede cache indefinido e garante atualização frequente
            {
              urlPattern: /^https:\/\/docs\.google\.com\/spreadsheets\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'sheets-dynamic-data',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 15,
                  maxAgeSeconds: 300, // 5 minutos
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // Imagens institucionais
            {
              urlPattern: /^https:\/\/i\.imgur\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'imgur-images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dias
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['motion'],
            'vendor-icons': ['lucide-react'],
            'vendor-parser': ['papaparse'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
