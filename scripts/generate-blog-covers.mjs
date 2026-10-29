/**
 * Genera portadas 1200×630 para artículos del blog (card + og:image):
 * título a la izquierda y captura del caso real a la derecha.
 * Salida: public/images/blog/<slug>.jpg
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../src/images');
const outDir = path.join(__dirname, '../public/images/blog');

const W = 1200;
const H = 630;

const covers = [
  {
    slug: 'web-sistema-o-aplicacion-que-encargar',
    title: 'Web, sistema o aplicación: qué encargar',
    label: 'ANTES DE CONTRATAR',
    image: 'project5.avif',
  },
  {
    slug: 'que-tener-claro-antes-de-pedir-una-web-o-un-sistema',
    title: 'Qué tener claro antes de pedir una web o un sistema',
    label: 'ANTES DE CONTRATAR',
    image: 'poligono-reservas.jpg',
  },
  {
    slug: 'la-web-carga-lenta-que-se-puede-hacer-antes-de-rehacerla',
    title: 'La web carga lenta: qué hacer antes de rehacerla',
    label: 'RENDIMIENTO · CASO MISCA STUDIO',
    image: 'project19.avif',
  },
  {
    slug: 'la-app-se-quedo-atras-actualizarla-o-hacer-otra',
    title: 'La app se quedó atrás: ¿actualizarla o hacer otra?',
    label: 'APPS · CASO CROPLIFE',
    image: 'project16_1.avif',
  },
  {
    slug: 'cobrar-con-pago-movil-en-una-tienda-online',
    title: 'Cobrar con Pago Móvil en una tienda online',
    label: 'TIENDAS ONLINE · VENEZUELA',
    image: 'project11.avif',
    position: 'northeast',
  },
  {
    slug: 'cuanto-cuesta-una-web-o-un-sistema-de-que-depende',
    title: 'Cuánto cuesta una web o un sistema',
    label: 'ANTES DE CONTRATAR · PRESUPUESTO',
    image: 'poligono-bcv.jpg',
  },
  {
    slug: 'mi-web-no-aparece-en-google-que-revisar-primero',
    title: 'Mi web no aparece en Google: qué revisar',
    label: 'SEO · CASO MERIDIANO.NET',
    image: 'project5.avif',
    position: 'north',
  },
  {
    slug: 'app-para-socios-de-un-club-pagos-reservas-y-qr',
    title: 'App para socios: pagos, reservas y QR',
    label: 'SISTEMAS · CASO POLÍGONO VALENCIA',
    image: 'poligono-app.jpg',
  },
  {
    slug: 'que-pedir-cuando-te-entregan-una-web-o-una-app',
    title: 'Qué pedir cuando te entregan una web o una app',
    label: 'ANTES DE CONTRATAR',
    image: 'project16_1.avif',
    position: 'north',
  },
  {
    slug: 'mantenimiento-de-una-web-en-wordpress-que-incluye',
    title: 'Mantenimiento de una web en WordPress',
    label: 'WORDPRESS · CASO MISCA STUDIO',
    image: 'project19.avif',
    position: 'northeast',
  },
];

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Partición simple por caracteres; suficiente para títulos cortos.
function wrap(text, maxChars) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Captura dentro de un marco de navegador, sangrando por el borde derecho.
const SHOT_X = 640;
const SHOT_Y = 120;
const SHOT_W = 620;
const BAR_H = 34;

function backgroundSvg({ title, label }) {
  const lines = wrap(title, 18);
  const fontSize = lines.length > 3 ? 46 : 52;
  const lineH = Math.round(fontSize * 1.15);
  const titleTop = 250 - ((lines.length - 1) * lineH) / 2;
  const tspans = lines
    .map((l, i) => `<tspan x="70" y="${titleTop + i * lineH}">${escape(l)}</tspan>`)
    .join('');

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset="1" stop-color="#0f2a5c"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.2" r="0.6">
      <stop offset="0" stop-color="#0d6efd" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#0d6efd" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="70" y="82" width="6" height="26" rx="3" fill="#25d366"/>
  <text x="88" y="102" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2" fill="#93c5fd">${escape(label)}</text>
  <text font-family="Segoe UI, Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff">${tspans}</text>
  <text x="70" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Darwin Cedeño</text>
  <text x="70" y="590" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="#93c5fd">darwincd.com · Webs, sistemas y apps a medida</text>
  <rect x="${SHOT_X - 2}" y="${SHOT_Y - 2}" width="${SHOT_W + 4}" height="${H}" rx="16" fill="#1e293b"/>
  <rect x="${SHOT_X}" y="${SHOT_Y}" width="${SHOT_W}" height="${BAR_H}" rx="14" fill="#1e293b"/>
  <circle cx="${SHOT_X + 22}" cy="${SHOT_Y + 17}" r="6" fill="#f87171"/>
  <circle cx="${SHOT_X + 42}" cy="${SHOT_Y + 17}" r="6" fill="#fbbf24"/>
  <circle cx="${SHOT_X + 62}" cy="${SHOT_Y + 17}" r="6" fill="#34d399"/>
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });

for (const cover of covers) {
  const shotH = H - SHOT_Y - BAR_H;
  const shot = await sharp(path.join(imagesDir, cover.image))
    .resize(SHOT_W, shotH, { fit: 'cover', position: cover.position ?? 'northwest' })
    .toBuffer();

  const out = path.join(outDir, `${cover.slug}.jpg`);
  await sharp(Buffer.from(backgroundSvg(cover)))
    .composite([{ input: shot, left: SHOT_X, top: SHOT_Y + BAR_H }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);

  console.log(`✓ ${path.relative(process.cwd(), out)} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
}
