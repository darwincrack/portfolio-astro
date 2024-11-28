import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['bootstrap'],
    },
    optimizeDeps: {
      include: ['tsparticles', 'tsparticles-engine'],
    },
  },
  site: 'https://darwincd.com',
  integrations: [sitemap()]
});
