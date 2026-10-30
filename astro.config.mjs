import { defineConfig, envField } from 'astro/config';
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
  // Asistente del sitio (/api/chat). Se configuran en Vercel → Settings → Environment Variables.
  env: {
    schema: {
      GEMINI_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      ASSISTANT_MODEL: envField.string({ context: 'server', access: 'secret', default: 'gemini-3.5-flash-lite' }),
    },
  },
  site: 'https://darwincd.com',
  // El CSS ya es pequeño (Bootstrap depurado, sin Font Awesome): en línea evita
  // una petición que bloquea el primer pintado en el celular.
  build: {
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
  output: 'server',
  adapter: vercel(),
});
