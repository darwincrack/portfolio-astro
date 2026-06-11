/**
 * Migra los proyectos de src/content/projects/*.md a Supabase.
 * Requiere: PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env
 *
 * Uso: node --env-file=.env scripts/seed-projects-supabase.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '../src/content/projects');

const url = process.env.PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Faltan PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const keyName = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (value.startsWith('[')) {
      fm[keyName] = JSON.parse(value);
    } else if (value === 'true' || value === 'false') {
      fm[keyName] = value === 'true';
    } else if (/^\d+$/.test(value)) {
      fm[keyName] = Number(value);
    } else {
      fm[keyName] = JSON.parse(value);
    }
  }

  return { data: fm, body: match[2].trim() };
}

const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md'));

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const parsed = parseFrontmatter(fs.readFileSync(path.join(contentDir, file), 'utf8'));
  if (!parsed) {
    console.warn(`Omitido (frontmatter inválido): ${file}`);
    continue;
  }

  const d = parsed.data;
  const row = {
    slug,
    title: d.title,
    description: d.description,
    priority: d.priority ?? 10,
    type: d.type ?? 'fullstack',
    link: d.link ?? '',
    github: d.github ?? '',
    tags: d.tags ?? [],
    cover_image: d.coverImage,
    gallery: d.gallery?.length ? d.gallery : [d.coverImage],
    body: parsed.body,
  };

  const { error } = await supabase.from('projects').upsert(row, { onConflict: 'slug' });
  if (error) {
    console.error(`Error en ${slug}:`, error.message);
  } else {
    console.log(`ok ${slug}`);
  }
}

console.log(`Migración completada (${files.length} archivos).`);
