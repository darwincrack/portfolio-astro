import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['bootstrap'],
    },
    optimizeDeps: {
      include: ['tsparticles', 'tsparticles-engine'],
    },
    // Agrega esta sección aquí:
    server: {
      allowedHosts: ['.trycloudflare.com'],
    },
  },

  experimental: {
    liveContentCollections: true,
  },
  site: 'https://darwincd.com',
  integrations: [sitemap()],
  output: 'server',
  adapter: vercel({
    // Gemini + PDF puede superar los 10 s por defecto de Vercel
    maxDuration: 60,
  }),
});
