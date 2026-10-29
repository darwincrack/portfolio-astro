import purgeCSSPlugin from '@fullhuman/postcss-purgecss';

// Quita de Bootstrap las reglas que el sitio no usa (de ~230 KB a una fracción).
// Solo se aplica al CSS de Bootstrap: los estilos propios y los de componentes
// Astro (con atributos data-astro-cid) no se tocan.
const purge = purgeCSSPlugin({
  content: ['./src/**/*.{astro,ts,js,mjs,md}'],
  // Clases que añade el navegador o que se arman en tiempo de ejecución
  safelist: {
    standard: [/^show$/, /^fade$/, /^collapsing$/, /^was-validated$/, /^is-(valid|invalid)$/],
  },
  variables: true,
  keyframes: true,
  fontFace: true,
});

const isBootstrap = (root) => /node_modules[\\/]bootstrap[\\/]/.test(root.source?.input?.file ?? '');

const purgeBootstrap = {
  postcssPlugin: 'purge-bootstrap',
  OnceExit(root, helpers) {
    if (process.env.NODE_ENV !== 'production' || !isBootstrap(root)) return;
    return purge.OnceExit(root, helpers);
  },
};

export default {
  plugins: [purgeBootstrap],
};
