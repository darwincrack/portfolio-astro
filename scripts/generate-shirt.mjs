/**
 * Diseño de camisa con la identidad de marca:
 * - brand/camisa/frente-pecho.*   logo pequeño en el pecho (10 cm de ancho)
 * - brand/camisa/espalda.*        diseño grande de espalda (30 x 36 cm)
 * - versiones en una sola tinta (blanco) para vinil o serigrafía
 * - brand/camisa/vista-previa.jpg  cómo se ve sobre una camisa azul noche
 *
 * Los PNG de imprenta salen a 300 ppp con fondo transparente.
 */
import sharp from 'sharp';
import * as fontkit from 'fontkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'brand', 'camisa');
const fontsDir = path.join(root, 'node_modules/@fontsource/poppins/files');
fs.mkdirSync(outDir, { recursive: true });

const c = { navy: '#0f172a', night: '#0b1220', sky: '#0ea5e9', blue: '#2563eb', mist: '#93c5fd' };

let seq = 0;
function mark(x, y, size, { gradient = true, color = '#ffffff' } = {}) {
  const id = `g${seq++}`;
  const stroke = gradient ? `url(#${id})` : color;
  const defs = gradient
    ? `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="16" y1="16" x2="84" y2="84">` +
      `<stop offset="0" stop-color="${c.sky}"/><stop offset="1" stop-color="${c.blue}"/></linearGradient></defs>`
    : '';
  return `<g transform="translate(${x} ${y}) scale(${size / 100})">${defs}
    <path fill="none" stroke="${stroke}" stroke-width="8" stroke-linecap="square" d="M80 34 V16 H16 V84 H80 V66"/>
    <path fill="none" stroke="${stroke}" stroke-width="9" stroke-linejoin="miter" d="M38 34 V66 H46 A16 16 0 0 0 46 34 Z"/>
  </g>`;
}

const fonts = {};
const font = (w) => (fonts[w] ??= fontkit.openSync(path.join(fontsDir, `poppins-latin-${w}-normal.woff2`)));
const measure = (s, size, w) => font(w).layout(s).positions.reduce((a, p) => a + p.xAdvance, 0) * (size / font(w).unitsPerEm);
function text(s, { x, y, size, weight = 400, fill, anchor = 'start', tracking = 0 }) {
  const f = font(weight), k = size / f.unitsPerEm, run = f.layout(s);
  const width = measure(s, size, weight) + tracking * (s.length - 1);
  let cx = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  let out = '';
  run.glyphs.forEach((g, i) => {
    const d = g.path.toSVG();
    if (d) out += `<path transform="translate(${cx.toFixed(2)} ${y}) scale(${k} ${-k})" d="${d}"/>`;
    cx += run.positions[i].xAdvance * k + tracking;
  });
  return `<g fill="${fill}">${out}</g>`;
}
const doc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;

// --- Frente: símbolo + nombre, para el pecho izquierdo ---------------------
// Alto 300; el ancho se ajusta al texto
const FRONT_W = Math.ceil(289 + Math.max(measure('Darwin Cedeño', 104, 600), measure('Webs, sistemas y apps a medida', 49, 400)) + 10);
function front({ mono = false } = {}) {
  const white = '#ffffff';
  return doc(FRONT_W, 300,
    mark(10, 30, 240, { gradient: !mono }) +
    text('Darwin Cedeño', { x: 285, y: 155, size: 104, weight: 600, fill: white }) +
    text('Webs, sistemas y apps a medida', { x: 289, y: 232, size: 49, weight: 400, fill: mono ? white : c.mist }));
}

// --- Espalda: símbolo, lema, servicios, QR a WhatsApp y teléfono ----------
// Lienzo 3000 x 3800 (30 x 38 cm)
const WA_URL = 'https://wa.me/584125447114?text=' +
  encodeURIComponent('Hola Darwin, vi tu camisa y quiero consultarte sobre un proyecto.');
const PHONE = '+58 412 544 7114';
const BACK_W = 3000, BACK_H = 3800;

// QR: placa blanca con los módulos calados, para que se vea la tela (contraste oscuro sobre claro)
function qrTile(x, y, size) {
  const qr = QRCode.create(WA_URL, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size, quiet = 3, cell = size / (n + quiet * 2);
  let holes = '';
  for (let r = 0; r < n; r++) for (let col = 0; col < n; col++)
    if (qr.modules.get(r, col)) holes += `<rect x="${(x + (col + quiet) * cell).toFixed(2)}" y="${(y + (r + quiet) * cell).toFixed(2)}" width="${(cell + 0.6).toFixed(2)}" height="${(cell + 0.6).toFixed(2)}"/>`;
  return `<defs><mask id="qrm" maskUnits="userSpaceOnUse" x="0" y="0" width="${BACK_W}" height="${BACK_H}">
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${cell * 1.5}" fill="#fff"/><g fill="#000">${holes}</g></mask></defs>
    <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${cell * 1.5}" fill="#ffffff" mask="url(#qrm)"/>`;
}

function back({ mono = false } = {}) {
  const W = BACK_W, cx = W / 2, white = '#ffffff', soft = mono ? white : c.mist, accent = mono ? white : c.sky;
  const services = ['PÁGINAS WEB', 'SISTEMAS', 'APPS', 'AGENTES DE IA'];
  const sSize = 86, gap = 130;
  const widths = services.map((s) => measure(s, sSize, 500) + 6 * (s.length - 1));
  let sx = cx - (widths.reduce((a, b) => a + b, 0) + gap * (services.length - 1)) / 2;
  let row = '';
  services.forEach((s, i) => {
    row += text(s, { x: sx, y: 2300, size: sSize, weight: 500, fill: white, tracking: 6 });
    sx += widths[i];
    if (i < services.length - 1) row += `<circle cx="${sx + gap / 2}" cy="2269" r="13" fill="${accent}"/>`;
    sx += gap;
  });

  // Bloque inferior: QR a la izquierda, contacto a la derecha, todo centrado
  const qrSize = 860, colGap = 140;
  const tw = Math.max(measure(PHONE, 150, 600), measure('darwincd.com', 150, 600), measure('ESCANÉAME O ESCRÍBEME', 70, 500) + 4 * 20);
  const bx = cx - (qrSize + colGap + tw) / 2, by = 2620, tx = bx + qrSize + colGap;
  const wa = 'M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z';
  const contact =
    text('ESCANÉAME O ESCRÍBEME', { x: tx, y: by + 250, size: 70, weight: 500, fill: accent, tracking: 20 }) +
    `<path transform="translate(${tx} ${by + 345}) scale(${130 / 512})" d="${wa}" fill="${mono ? white : '#25d366'}"/>` +
    text(PHONE, { x: tx + 160, y: by + 465, size: 125, weight: 600, fill: white }) +
    `<rect x="${tx}" y="${by + 560}" width="${tw}" height="4" fill="${mono ? white : '#1e3a5f'}"/>` +
    text('darwincd.com', { x: tx, y: by + 760, size: 150, weight: 600, fill: soft });

  return doc(W, BACK_H,
    mark(cx - 650, 60, 1300, { gradient: !mono }) +
    text('Tu idea,', { x: cx, y: 1690, size: 220, weight: 600, fill: white, anchor: 'middle' }) +
    text('hecha a medida.', { x: cx, y: 1950, size: 220, weight: 600, fill: soft, anchor: 'middle' }) +
    `<rect x="${cx - 160}" y="2080" width="320" height="12" rx="6" fill="${accent}"/>` +
    row + qrTile(bx, by, qrSize) + contact);
}

// --- Vistas previas sobre una camisa azul noche ----------------------------
const shirt = (neck) =>
  `M330 70 Q500 ${neck} 670 70 L860 135 Q930 230 990 360 L850 440 L800 375 L800 1070 Q500 1090 200 1070 L200 375 L150 440 L10 360 Q70 230 140 135 Z`;
const collar = (neck) => `M330 70 Q500 ${neck} 670 70`;
const embed = (svg, x, y, w, h) =>
  `<image x="${x}" y="${y}" width="${w}" height="${h}" href="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"/>`;
const shirtView = (dx, neck, label, art) => `
  <g transform="translate(${dx} 120)">
    <path d="${shirt(neck)}" fill="${c.navy}" stroke="#1e293b" stroke-width="4"/>
    <path d="${collar(neck)}" fill="none" stroke="#1e293b" stroke-width="22"/>
    ${art}
  </g>
  ${text(label, { x: dx + 500, y: 1330, size: 40, weight: 500, fill: '#475569', anchor: 'middle', tracking: 4 })}`;
const frontArt = () => embed(front(), 500, 270, 230, 230 * 300 / FRONT_W);
const backArt = () => embed(back(), 300, 200, 400, 400 * BACK_H / BACK_W);
const bg = (w) => `<rect width="${w}" height="1400" fill="#eef2f7"/>`;

const out = async (name, svg, widthPx) => {
  fs.writeFileSync(path.join(outDir, `${name}.svg`), svg);
  await sharp(Buffer.from(svg), { density: 300 }).resize({ width: widthPx }).png().toFile(path.join(outDir, `${name}-imprenta.png`));
};

// 10 cm y 30 cm de ancho a 300 ppp
await out('frente-pecho', front(), 1181);
await out('frente-pecho-una-tinta', front({ mono: true }), 1181);
await out('espalda', back(), 3543);
await out('espalda-una-tinta', back({ mono: true }), 3543);
const jpg = (svg, name) => sharp(Buffer.from(svg), { density: 150 }).jpeg({ quality: 90 }).toFile(path.join(outDir, name));
await jpg(doc(2200, 1400, bg(2200) + shirtView(50, 170, 'FRENTE', frontArt()) + shirtView(1150, 110, 'ESPALDA', backArt())), 'vista-previa.jpg');
await jpg(doc(1100, 1400, bg(1100) + shirtView(50, 170, 'FRENTE', frontArt())), 'vista-frente.jpg');
await jpg(doc(1100, 1400, bg(1100) + shirtView(50, 110, 'ESPALDA', backArt())), 'vista-espalda.jpg');
console.log('listo:', fs.readdirSync(outDir).join(', '));
