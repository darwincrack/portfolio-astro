import { defineConfig } from 'astro/config';

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
});
