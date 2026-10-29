/**
 * Genera la identidad de marca a partir de un único símbolo:
 * - brand/  kit de marca (SVG + PNG por variante, hoja de marca, tarjeta)
 * - public/ favicon.svg, favicons PNG/ICO, logodc.*, og-default.jpg
 *
 * Todo el texto se convierte en trazos (Poppins vía fontkit), así que
 * los SVG se ven igual en cualquier sitio, tenga o no la fuente instalada.
 */
import sharp from 'sharp';
import * as fontkit from 'fontkit';
import QRCode from 'qrcode';
import toIco from 'to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const brandDir = path.join(root, 'brand');
const fontsDir = path.join(root, 'node_modules/@fontsource/poppins/files');

const WHATSAPP_URL =
  'https://wa.me/584125447114?text=' +
  encodeURIComponent('Hola Darwin, vi tu tarjeta y quiero consultarte sobre un proyecto.');

// ---------------------------------------------------------------------------
// Colores y variantes
// ---------------------------------------------------------------------------

export const colors = {
  night: '#0b1220',
  navy: '#0f172a',
  sky: '#0ea5e9',
  blue: '#2563eb',
  skyDeep: '#0284c7',
  blueDeep: '#1d4ed8',
  mist: '#93c5fd',
  slate: '#475569',
};

const variants = {
  // para fondos oscuros: el degradado original
  'fondo-oscuro': { from: colors.sky, to: colors.blue, name: '#ffffff', tagline: colors.mist },
  // para fondos claros: el mismo degradado, un tono más profundo para contraste
  'fondo-claro': { from: colors.skyDeep, to: colors.blueDeep, name: colors.navy, tagline: colors.slate },
  // una sola tinta: estampados, sellos, grabados
  blanco: { from: '#ffffff', to: '#ffffff', name: '#ffffff', tagline: 'rgba(255,255,255,0.75)' },
  'azul-noche': { from: colors.navy, to: colors.navy, name: colors.navy, tagline: colors.slate },
};

// ---------------------------------------------------------------------------
// Símbolo: el marco se abre por la derecha y forma la C; dentro, la D.
// viewBox 0 0 100 100
// ---------------------------------------------------------------------------

let gradientSeq = 0;

function mark(x, y, size, variant) {
  const v = variants[variant];
  const id = `dc${gradientSeq++}`;
  const stroke = v.from === v.to ? v.from : `url(#${id})`;
  const grad =
    v.from === v.to
      ? ''
      : `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="16" y1="16" x2="84" y2="84">` +
        `<stop offset="0" stop-color="${v.from}"/><stop offset="1" stop-color="${v.to}"/></linearGradient></defs>`;
  return `<g transform="translate(${x} ${y}) scale(${size / 100})">${grad}
    <path fill="none" stroke="${stroke}" stroke-width="8" stroke-linecap="square" d="M80 34 V16 H16 V84 H80 V66"/>
    <path fill="none" stroke="${stroke}" stroke-width="9" stroke-linejoin="miter" d="M38 34 V66 H46 A16 16 0 0 0 46 34 Z"/>
  </g>`;
}

// ---------------------------------------------------------------------------
// Texto a trazos
// ---------------------------------------------------------------------------

const fonts = {};
const font = (weight) =>
  (fonts[weight] ??= fontkit.openSync(path.join(fontsDir, `poppins-latin-${weight}-normal.woff2`)));

function measure(str, size, weight) {
  const f = font(weight);
  const run = f.layout(str);
  return run.positions.reduce((w, p) => w + p.xAdvance, 0) * (size / f.unitsPerEm);
}

function text(str, { x, y, size, weight = 400, fill, anchor = 'start', tracking = 0 }) {
  const f = font(weight);
  const scale = size / f.unitsPerEm;
  const run = f.layout(str);
  const width = measure(str, size, weight) + tracking * (str.length - 1);
  let cx = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  let out = '';
  run.glyphs.forEach((glyph, i) => {
    const d = glyph.path.toSVG();
    if (d) out += `<path transform="translate(${cx.toFixed(2)} ${y}) scale(${scale} ${-scale})" d="${d}"/>`;
    cx += run.positions[i].xAdvance * scale + tracking;
  });
  return `<g fill="${fill}">${out}</g>`;
}

// ---------------------------------------------------------------------------
// Composiciones del logo
// ---------------------------------------------------------------------------

const NAME = 'Darwin Cedeño';
const TAGLINE = 'Webs, sistemas y apps a medida';

/** Horizontal: símbolo a la izquierda, nombre y lema a la derecha. Altura = h. */
function horizontal(x, y, h, variant, { tagline = true } = {}) {
  const v = variants[variant];
  const tx = x + h * 1.12;
  const nameSize = h * (tagline ? 0.4 : 0.46);
  let svg = mark(x, y, h, variant);
  if (tagline) {
    svg += text(NAME, { x: tx, y: y + h * 0.55, size: nameSize, weight: 600, fill: v.name });
    svg += text(TAGLINE, { x: tx, y: y + h * 0.82, size: h * 0.19, weight: 400, fill: v.tagline });
  } else {
    svg += text(NAME, { x: tx, y: y + h * 0.66, size: nameSize, weight: 600, fill: v.name });
  }
  return svg;
}

function horizontalWidth(h, { tagline = true } = {}) {
  const nameW = measure(NAME, h * (tagline ? 0.4 : 0.46), 600);
  const tagW = tagline ? measure(TAGLINE, h * 0.19, 400) : 0;
  return h * 1.12 + Math.max(nameW, tagW);
}

/** Vertical: símbolo arriba, nombre y lema centrados debajo. */
function stacked(cx, y, h, variant) {
  const v = variants[variant];
  return (
    mark(cx - h / 2, y, h, variant) +
    text(NAME, { x: cx, y: y + h * 1.42, size: h * 0.36, weight: 600, fill: v.name, anchor: 'middle' }) +
    text(TAGLINE, { x: cx, y: y + h * 1.72, size: h * 0.17, weight: 400, fill: v.tagline, anchor: 'middle' })
  );
}

/** Icono de app: símbolo sobre baldosa. */
function appIcon(size, { bg = colors.navy, variant = 'fondo-oscuro', radius = 0.18 } = {}) {
  const pad = size * 0.14;
  return (
    `<rect width="${size}" height="${size}" rx="${size * radius}" fill="${bg}"/>` +
    mark(pad, pad, size - pad * 2, variant)
  );
}

const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;

// ---------------------------------------------------------------------------
// Salidas
// ---------------------------------------------------------------------------

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

async function exportPng(svg, file, width) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg), { density: 300 }).resize({ width }).png().toFile(file);
}

// 1. Kit de marca ------------------------------------------------------------

for (const variant of Object.keys(variants)) {
  const symbol = svgDoc(100, 100, mark(0, 0, 100, variant));
  write(path.join(brandDir, 'svg', `simbolo-${variant}.svg`), symbol);
  await exportPng(symbol, path.join(brandDir, 'png', `simbolo-${variant}.png`), 1024);

  const hW = Math.ceil(horizontalWidth(100));
  const hor = svgDoc(hW, 100, horizontal(0, 0, 100, variant));
  write(path.join(brandDir, 'svg', `logo-horizontal-${variant}.svg`), hor);
  await exportPng(hor, path.join(brandDir, 'png', `logo-horizontal-${variant}.png`), 2000);

  const hcW = Math.ceil(horizontalWidth(100, { tagline: false }));
  const horC = svgDoc(hcW, 100, horizontal(0, 0, 100, variant, { tagline: false }));
  write(path.join(brandDir, 'svg', `logo-nombre-${variant}.svg`), horC);
  await exportPng(horC, path.join(brandDir, 'png', `logo-nombre-${variant}.png`), 2000);

  const sW = Math.ceil(Math.max(measure(TAGLINE, 17, 400), measure(NAME, 36, 600)) + 4);
  const st = svgDoc(sW, 182, stacked(sW / 2, 0, 100, variant));
  write(path.join(brandDir, 'svg', `logo-vertical-${variant}.svg`), st);
  await exportPng(st, path.join(brandDir, 'png', `logo-vertical-${variant}.png`), 1600);
}

const iconDark = svgDoc(512, 512, appIcon(512));
const iconLight = svgDoc(512, 512, appIcon(512, { bg: '#ffffff', variant: 'fondo-claro' }));
write(path.join(brandDir, 'svg', 'icono-app-oscuro.svg'), iconDark);
write(path.join(brandDir, 'svg', 'icono-app-claro.svg'), iconLight);
await exportPng(iconDark, path.join(brandDir, 'png', 'icono-app-oscuro.png'), 1024);
await exportPng(iconLight, path.join(brandDir, 'png', 'icono-app-claro.png'), 1024);

// 2. Archivos del sitio ------------------------------------------------------

write(path.join(publicDir, 'favicon.svg'), svgDoc(32, 32, appIcon(32, { radius: 0.16 })).replace(
  '<svg ', '<svg role="img" aria-label="Darwin Cedeño" '));

// A 16 px el marco necesita menos margen para no perderse.
const tinyIcon = (size) => svgDoc(size, size,
  `<rect width="${size}" height="${size}" rx="${size * 0.16}" fill="${colors.navy}"/>` +
  mark(size * 0.04, size * 0.04, size * 0.92, 'fondo-oscuro'));

const png = (svg, size) => sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png().toBuffer();
const icons = {
  16: await png(tinyIcon(64), 16),
  32: await png(tinyIcon(64), 32),
  48: await png(svgDoc(512, 512, appIcon(512)), 48),
};
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), icons[16]);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), icons[32]);
fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), icons[48]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), await toIco([icons[16], icons[32], icons[48]]));
// iOS recorta las esquinas solo: baldosa sin redondear
await sharp(Buffer.from(svgDoc(512, 512, appIcon(512, { radius: 0 })))).resize(180, 180).png()
  .toFile(path.join(publicDir, 'apple-touch-icon.png'));

const logoSquare = svgDoc(1024, 1024, `<rect width="1024" height="1024" fill="${colors.navy}"/>` + mark(212, 212, 600, 'fondo-oscuro'));
await sharp(Buffer.from(logoSquare)).jpeg({ quality: 90 }).toFile(path.join(publicDir, 'logodc.jpg'));
await sharp(Buffer.from(logoSquare)).resize(120, 120).png().toFile(path.join(publicDir, 'logodc.png'));
await sharp(Buffer.from(logoSquare)).resize(120, 120).avif().toFile(path.join(publicDir, 'logodc.avif'));

// Imagen por defecto al compartir enlaces (1200×630)
{
  const h = 150;
  const w = horizontalWidth(h);
  const og = svgDoc(1200, 630, `
    <defs><radialGradient id="glow" cx="0.85" cy="0.15" r="0.75">
      <stop offset="0" stop-color="${colors.blue}" stop-opacity="0.35"/><stop offset="1" stop-color="${colors.blue}" stop-opacity="0"/>
    </radialGradient></defs>
    <rect width="1200" height="630" fill="${colors.night}"/><rect width="1200" height="630" fill="url(#glow)"/>
    ${horizontal((1200 - w) / 2, 200, h, 'fondo-oscuro')}
    ${text('darwincd.com', { x: 600, y: 520, size: 26, weight: 500, fill: colors.mist, anchor: 'middle', tracking: 1 })}`);
  await sharp(Buffer.from(og)).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(publicDir, 'og-default.jpg'));
}

// 3. Tarjeta de presentación -------------------------------------------------
// 90×50 mm a 300 ppp, con 3 mm de sangrado por lado (96×56 mm).

const MM = 300 / 25.4;
const BLEED = Math.round(3 * MM);
const TRIM_W = Math.round(90 * MM);
const TRIM_H = Math.round(50 * MM);
const CARD_W = TRIM_W + BLEED * 2;
const CARD_H = TRIM_H + BLEED * 2;

async function qrSvg(size, color) {
  const qr = QRCode.create(WHATSAPP_URL, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const cell = size / n;
  let rects = '';
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.modules.get(r, c))
        rects += `<rect x="${(c * cell).toFixed(2)}" y="${(r * cell).toFixed(2)}" width="${(cell + 0.3).toFixed(2)}" height="${(cell + 0.3).toFixed(2)}"/>`;
  return `<g fill="${color}">${rects}</g>`;
}

const B = BLEED;
const front = svgDoc(CARD_W, CARD_H, `
  <defs><radialGradient id="cglow" cx="0.9" cy="0.05" r="0.9">
    <stop offset="0" stop-color="${colors.blue}" stop-opacity="0.4"/><stop offset="1" stop-color="${colors.blue}" stop-opacity="0"/>
  </radialGradient></defs>
  <rect width="${CARD_W}" height="${CARD_H}" fill="${colors.night}"/>
  <rect width="${CARD_W}" height="${CARD_H}" fill="url(#cglow)"/>
  ${stacked(CARD_W / 2, B + 120, 190, 'fondo-oscuro')}`);

const qrSize = 250;
const qrX = B + TRIM_W - 70 - qrSize;
const qrY = B + (TRIM_H - qrSize) / 2 - 20;
const lx = B + 100;
const back = svgDoc(CARD_W, CARD_H, `
  <rect width="${CARD_W}" height="${CARD_H}" fill="#ffffff"/>
  <rect x="0" y="0" width="${B + 42}" height="${CARD_H}" fill="${colors.blueDeep}"/>
  ${text(NAME, { x: lx, y: B + 140, size: 64, weight: 600, fill: colors.navy })}
  ${text('Desarrollador de webs, sistemas y apps', { x: lx, y: B + 192, size: 30, weight: 400, fill: colors.slate })}
  <rect x="${lx}" y="${B + 228}" width="70" height="5" rx="2.5" fill="${colors.skyDeep}"/>
  ${text('WhatsApp', { x: lx, y: B + 305, size: 22, weight: 600, fill: colors.skyDeep, tracking: 1 })}
  ${text('+58 412 544 7114', { x: lx, y: B + 345, size: 34, weight: 500, fill: colors.navy })}
  ${text('contacto@darwincd.com', { x: lx, y: B + 420, size: 30, weight: 400, fill: colors.navy })}
  ${text('darwincd.com', { x: lx, y: B + 466, size: 30, weight: 600, fill: colors.blueDeep })}
  <g transform="translate(${qrX} ${qrY})">${await qrSvg(qrSize, colors.navy)}</g>
  ${text('Escríbeme por WhatsApp', { x: qrX + qrSize / 2, y: qrY + qrSize + 48, size: 22, weight: 500, fill: colors.slate, anchor: 'middle' })}
  ${mark(B + TRIM_W - 70 - 56, B + 50, 56, 'fondo-claro')}`);

const cardDir = path.join(brandDir, 'tarjeta');
write(path.join(cardDir, 'tarjeta-frente.svg'), front);
write(path.join(cardDir, 'tarjeta-reverso.svg'), back);
const frontPng = await sharp(Buffer.from(front)).withMetadata({ density: 300 }).png().toBuffer();
const backPng = await sharp(Buffer.from(back)).withMetadata({ density: 300 }).png().toBuffer();
fs.writeFileSync(path.join(cardDir, 'tarjeta-frente-imprenta.png'), frontPng);
fs.writeFileSync(path.join(cardDir, 'tarjeta-reverso-imprenta.png'), backPng);

// 4. Presentación: hoja de marca con las tarjetas ----------------------------

const trim = (buf) => sharp(buf).extract({ left: B, top: B, width: TRIM_W, height: TRIM_H }).toBuffer();
async function cardShot(buf, width, angle) {
  const w = width;
  const h = Math.round((TRIM_H / TRIM_W) * w);
  const r = Math.round(w * 0.035);
  const mask = Buffer.from(svgDoc(w, h, `<rect width="${w}" height="${h}" rx="${r}" fill="#fff"/>`));
  const card = await sharp(await trim(buf)).resize(w, h).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const pad = 60;
  const shadow = await sharp(Buffer.from(svgDoc(w + pad * 2, h + pad * 2,
    `<defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="22"/></filter></defs>
     <rect x="${pad}" y="${pad + 24}" width="${w}" height="${h}" rx="${r}" fill="#000" fill-opacity="0.45" filter="url(#s)"/>`)))
    .composite([{ input: card, left: pad, top: pad }]).png().toBuffer();
  return sharp(shadow).rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

{
  const W = 2400;
  const H = 1640;
  const sheet = svgDoc(W, H, `
    <rect width="${W}" height="${H}" fill="#eef2f7"/>
    <rect width="${W / 2}" height="${H}" fill="${colors.night}"/>
    ${text('IDENTIDAD DE MARCA', { x: 120, y: 150, size: 28, weight: 600, fill: colors.mist, tracking: 6 })}
    ${horizontal(120, 230, 150, 'fondo-oscuro')}
    ${text('IDENTIDAD DE MARCA', { x: W / 2 + 120, y: 150, size: 28, weight: 600, fill: colors.slate, tracking: 6 })}
    ${horizontal(W / 2 + 120, 230, 150, 'fondo-claro')}

    ${mark(120, 520, 120, 'fondo-oscuro')}
    ${mark(300, 520, 120, 'blanco')}
    <g transform="translate(480 520)">${appIcon(120, { bg: '#1e293b' })}</g>
    ${mark(W / 2 + 120, 520, 120, 'fondo-claro')}
    ${mark(W / 2 + 300, 520, 120, 'azul-noche')}
    <g transform="translate(${W / 2 + 480} 520)">${appIcon(120, { bg: '#ffffff', variant: 'fondo-claro' })}</g>
    ${text('Fondo oscuro', { x: 120, y: 690, size: 22, weight: 500, fill: '#94a3b8' })}
    ${text('Fondo claro', { x: W / 2 + 120, y: 690, size: 22, weight: 500, fill: colors.slate })}

    ${[[colors.sky, '#0EA5E9'], [colors.blue, '#2563EB'], [colors.navy, '#0F172A']]
      .map(([c, label], i) => `<rect x="${120 + i * 170}" y="760" width="140" height="80" rx="12" fill="${c}" stroke="#334155"/>` +
        text(label, { x: 120 + i * 170, y: 875, size: 20, weight: 500, fill: '#cbd5e1' })).join('')}
    ${[[colors.skyDeep, '#0284C7'], [colors.blueDeep, '#1D4ED8'], ['#ffffff', '#FFFFFF']]
      .map(([c, label], i) => `<rect x="${W / 2 + 120 + i * 170}" y="760" width="140" height="80" rx="12" fill="${c}" stroke="#cbd5e1"/>` +
        text(label, { x: W / 2 + 120 + i * 170, y: 875, size: 20, weight: 500, fill: colors.slate })).join('')}
  `);
  const frontShot = await cardShot(frontPng, 860, -5);
  const backShot = await cardShot(backPng, 860, 4);
  await sharp(Buffer.from(sheet))
    .composite([
      { input: frontShot, left: 140, top: 900 },
      { input: backShot, left: W / 2 + 140, top: 880 },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(brandDir, 'presentacion-marca.jpg'));
}

console.log('✓ brand/ y public/ generados');
