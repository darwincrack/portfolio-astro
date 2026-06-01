/**
 * Normaliza capturas de proyectos para Astro Image + Vercel:
 * - Máximo 1600×900 (variante 2x del componente Image)
 * - Recorte 16:9 desde arriba, sin ampliar
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../src/images');
const MAX_W = 1600;
const MAX_H = 900;
const TARGET_RATIO = MAX_W / MAX_H;

const files = fs
  .readdirSync(imagesDir)
  .filter(
    (f) =>
      f.endsWith('.avif') &&
      (f.startsWith('project') || f === 'projectsupport1.avif')
  )
  .sort();

function targetSize(width, height) {
  let outW = Math.min(width, MAX_W);
  let outH = Math.round(outW / TARGET_RATIO);
  if (outH > Math.min(height, MAX_H)) {
    outH = Math.min(height, MAX_H);
    outW = Math.round(outH * TARGET_RATIO);
  }
  return { outW, outH };
}

function needsProcessing(meta) {
  const { outW, outH } = targetSize(meta.width, meta.height);
  const ratio = meta.width / meta.height;
  const ratioOff = Math.abs(ratio - TARGET_RATIO) > 0.02;
  const sizeOff = meta.width !== outW || meta.height !== outH;
  return ratioOff || sizeOff;
}

for (const file of files) {
  const input = path.join(imagesDir, file);
  const meta = await sharp(input).metadata();

  if (!needsProcessing(meta)) {
    console.log(`skip ${file} (${meta.width}x${meta.height})`);
    continue;
  }

  const { outW, outH } = targetSize(meta.width, meta.height);
  const before = fs.statSync(input).size;
  const tmp = `${input}.tmp.avif`;

  await sharp(input)
    .resize(outW, outH, { fit: 'cover', position: 'top' })
    .avif({ quality: 75, effort: 4 })
    .toFile(tmp);

  fs.renameSync(tmp, input);

  const afterMeta = await sharp(input).metadata();
  const after = fs.statSync(input).size;
  console.log(
    `ok   ${file}: ${meta.width}x${meta.height} -> ${afterMeta.width}x${afterMeta.height} (${before} -> ${after} bytes)`
  );
}
