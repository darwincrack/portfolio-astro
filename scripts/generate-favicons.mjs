/**
 * Genera favicons e iconos de app desde public/logodc.png
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import toIco from 'to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
const source = path.join(publicDir, 'logodc.png');
const bg = { r: 15, g: 23, b: 42, alpha: 1 };

async function png(size, outfile) {
  await sharp(source)
    .resize(size, size, { fit: 'contain', background: bg })
    .png()
    .toFile(path.join(publicDir, outfile));
}

await png(16, 'favicon-16x16.png');
await png(32, 'favicon-32x32.png');
await png(48, 'favicon-48x48.png');
await png(180, 'apple-touch-icon.png');

const pngFiles = ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png'];
const buffers = pngFiles.map((f) => fs.readFileSync(path.join(publicDir, f)));

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), await toIco(buffers));

console.log('Favicons generados en public/');
