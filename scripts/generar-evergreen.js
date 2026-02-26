/**
 * Script para generar un post de blog evergreen (contenido que no caduca)
 * usando la API de Gemini. Prioridad: IA, luego programación.
 * Las imágenes se obtienen de Picsum Photos (por seed del título).
 * Uso: GEMINI_API_KEY=xxx node scripts/generar-evergreen.js
 */

import { GoogleGenAI } from '@google/genai';
import slugify from 'slugify';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');
const EJEMPLOS_TONO = path.join(__dirname, 'ejemplos-tono-blog.md');

/** Días hacia atrás para considerar "temas recientes" y no repetir (evitar overfitting, redes neuronales, etc.). */
const DIAS_EVITAR_REPETICION = 30;

/**
 * Lee los títulos de los posts del blog publicados en los últimos N días.
 * @returns {Promise<string[]>}
 */
async function getTitulosRecientes() {
  const posts = await getAllBlogPosts();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DIAS_EVITAR_REPETICION);
  return posts.filter((p) => p.pubDate >= cutoff).map((p) => p.title);
}

/**
 * Lee todos los posts del blog con título, slug y fecha para enlaces internos.
 * @returns {Promise<{ title: string, slug: string, pubDate: Date }[]>}
 */
async function getAllBlogPosts() {
  let entries;
  try {
    entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  } catch (e) {
    return [];
  }
  const posts = [];
  for (const ent of entries) {
    if (!ent.isFile() || !ent.name.endsWith('.md')) continue;
    const slug = ent.name.replace(/\.md$/, '');
    const filePath = path.join(BLOG_DIR, ent.name);
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch {
      continue;
    }
    const pubMatch = content.match(/pubDate:\s*(\S+)/);
    const titleMatch = content.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
    if (!titleMatch) continue;
    posts.push({
      title: titleMatch[1].replace(/\\"/g, '"').trim(),
      slug,
      pubDate: pubMatch ? new Date(pubMatch[1].trim()) : new Date(0),
    });
  }
  return posts.sort((a, b) => b.pubDate - a.pubDate);
}

/**
 * Lee el documento de ejemplos de tono para inyectarlo en el prompt.
 * @returns {Promise<string>}
 */
async function getEjemplosTono() {
  try {
    const content = await fs.readFile(EJEMPLOS_TONO, 'utf8');
    // Extraer solo las secciones EVITAR y USAR (sin el encabezado del doc)
    const evitar = content.match(/## ❌ EVITAR[\s\S]*?(?=## ✅ USAR|$)/)?.[0]?.trim() || '';
    const usar = content.match(/## ✅ USAR[\s\S]*?(?=## Resumen|$)/)?.[0]?.trim() || '';
    return [evitar, usar].filter(Boolean).join('\n\n');
  } catch {
    return '';
  }
}

const SYSTEM_PROMPT = `Eres un desarrollador con años de experiencia que escribe artículos para su blog personal. No eres un asistente genérico: escribes con TU voz, desde TU experiencia, dando TU opinión. El contenido debe parecer escrito por un humano experto, no por IA.

VOZ Y ESTILO:
- Usa primera persona ("En mi experiencia...", "Me sorprendió...", "Yo evito...") cuando aporte valor.
- Da opiniones claras: qué te funciona, qué no, qué recomiendas y por qué.
- Varía la estructura: no siempre intro → secciones → conclusión. Algunos artículos pueden empezar con una anécdota, una pregunta incómoda, o ir directo al grano.
- Longitud variable: entre 350 y 1000 palabras. Adapta la extensión al tema.
- NUNCA uses frases típicas de contenido IA: evita "descubre", "explora", "en conclusión", "en el mundo de", "en el ámbito de", "sin duda", "en resumen" al inicio, "este artículo profundiza en", "mantente atento", "da los primeros pasos" de forma genérica.
- Escribe como alguien que ha debuggeado esto a las 3am, tiene preferencias fuertes y no teme compartirlas.

PRIORIDAD DE TEMAS (elige según qué falte en el blog):
1. Inteligencia artificial y ML: fundamentos, conceptos atemporales, buenas prácticas, ética.
2. Agentes de IA: qué son, cómo funcionan, cuándo usarlos, límites.
3. Programación: fundamentos (variables, tipos, control de flujo), lenguajes (características, cuándo elegir cada uno), patrones, testing, código limpio.
4. Arquitectura, DevOps, herramientas que no caducan.

CONTENIDO EVERGREEN:
- NO noticias, lanzamientos con fecha, ni eventos pasados.
- NO "en 2024", "este año", "últimamente".
- SÍ: conceptos que sigan siendo válidos dentro de 5 años.

ENLACES INTERNOS:
- Si te proporcionan una lista de artículos ya publicados, incluye 1-3 enlaces internos en el cuerpo donde tenga sentido referenciarlos.
- Formato: [Texto del enlace](/blog/slug-del-articulo/)
- Solo enlaza si la referencia es natural y aporta valor (ampliar un concepto, post relacionado).

SEO:
- Encabezados descriptivos (##, ###), palabras clave de forma natural, responde la intención de búsqueda.
- Evita keyword stuffing.

FORMATO:
- Español, Markdown (encabezados, listas, **negritas**, código si aplica).
- Devuelve ÚNICAMENTE un JSON válido (sin markdown alrededor, sin \`\`\`json):
{"titulo": "string", "descripcion": "string corta para meta description, max 160 caracteres", "cuerpo": "string en markdown con el artículo completo", "tags": ["evergreen", "ia"] o ["evergreen", "programacion"] según el tema}
- El "cuerpo" es el markdown listo para el post (sin incluir el título en el cuerpo).`;

const USER_PROMPT_BASE = `Genera un nuevo artículo evergreen. Prioriza IA y agentes de IA; si ya hay muchos, elige fundamentos de programación, lenguajes o conceptos atemporales de desarrollo. Escribe con voz personal, da tu opinión, varía la estructura. Que sea útil dentro de 5 años.`;

// Schema para forzar respuesta JSON válida (structured output de Gemini)
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    titulo: { type: 'string', description: 'Título del artículo' },
    descripcion: { type: 'string', description: 'Meta description, máximo 160 caracteres' },
    cuerpo: { type: 'string', description: 'Cuerpo del artículo en Markdown' },
    tags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Tags como evergreen, ia, programacion, agentes',
    },
  },
  required: ['titulo', 'descripcion', 'cuerpo'],
};

/**
 * Parsea la respuesta de Gemini: puede ser JSON puro o envuelto en markdown.
 * Intenta reparar JSON mal formado (llave suelta, fragmentos).
 * @param {string} raw
 * @returns {{ titulo: string, descripcion: string, cuerpo: string }}
 */
function parseJsonResponse(raw) {
  let jsonStr = raw.trim();

  // Quitar bloques ```json ... ```
  const codeMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) jsonStr = codeMatch[1].trim();

  // Extraer solo el objeto: desde el primer { hasta el último }
  const firstBrace = jsonStr.indexOf('{');
  const lastBrace = jsonStr.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }

  // Quitar posibles llaves sueltas al inicio (error típico de Gemini)
  jsonStr = jsonStr.replace(/^\s*}\s*/, '').trim();
  if (!jsonStr.startsWith('{')) {
    jsonStr = '{' + jsonStr;
  }

  try {
    const data = JSON.parse(jsonStr);
    if (!data.titulo || !data.cuerpo) {
      throw new Error('Faltan titulo o cuerpo en el JSON');
    }
    return data;
  } catch (e) {
    console.error('La respuesta no es JSON válido. Raw (primeros 400 chars):', raw.slice(0, 400));
    process.exit(1);
  }
}

/**
 * Genera la URL de imagen del post. Usa Picsum Photos (determinista por slug, sin API key y fiable).
 * @param {string} titulo - Título del post (se usa para generar un seed único)
 * @returns {string}
 */
function getBlogImageUrl(titulo) {
  const seed = slugify(titulo, { lower: true, strict: true }) || 'evergreen';
  return `https://picsum.photos/seed/${seed}/1200/630`;
}

/**
 * Escapa comillas dobles en frontmatter YAML.
 * @param {string} s
 * @returns {string}
 */
function escapeYaml(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/"/g, '\\"').replace(/\n/g, ' ');
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY no está definida. Configúrala en el entorno o en GitHub Secrets.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  const [titulosRecientes, todosLosPosts] = await Promise.all([
    getTitulosRecientes(),
    getAllBlogPosts(),
  ]);

  let userPrompt = USER_PROMPT_BASE;

  if (titulosRecientes.length > 0) {
    userPrompt += `\n\nNO repitas tema: Estos artículos son recientes. Elige algo CLARAMENTE DIFERENTE:\n- ${titulosRecientes.join('\n- ')}`;
  }

  // Lista de posts para enlaces internos (últimos 40, más relevantes para enlazar)
  const postsParaEnlazar = todosLosPosts.slice(0, 40);
  if (postsParaEnlazar.length > 0) {
    const listaEnlaces = postsParaEnlazar
      .map((p) => `- "${p.title}" → slug: ${p.slug}`)
      .join('\n');
    userPrompt += `\n\nARTÍCULOS DEL BLOG (para enlaces internos): Incluye 1-3 enlaces en formato [texto](/blog/slug/) cuando sea natural y aporte valor. Usa estos slugs:\n${listaEnlaces}`;
  }

  userPrompt += '.\n\nResponde solo con JSON: {"titulo": "...", "descripcion": "...", "cuerpo": "..."}.';

  console.log('Generando artículo evergreen con Gemini...');
  if (titulosRecientes.length > 0) {
    console.log(`Evitando repetir temas de ${titulosRecientes.length} post(s) recientes.`);
  }
  if (postsParaEnlazar.length > 0) {
    console.log(`${postsParaEnlazar.length} posts disponibles para enlaces internos.`);
  }

  const ejemplosTono = await getEjemplosTono();
  const systemPrompt = ejemplosTono
    ? `${SYSTEM_PROMPT}\n\nREFERENCIA DE TONO (ejemplos concretos de qué evitar y qué usar):\n\n${ejemplosTono}`
    : SYSTEM_PROMPT;
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
  let raw;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });
    raw = response?.text?.trim() || '';
  } catch (err) {
    // Si el modelo no soporta responseSchema, intentar sin config y reparar el JSON
    console.warn('Structured output no disponible, usando fallback:', err.message);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });
      raw = response?.text?.trim() || '';
    } catch (err2) {
      console.error('Error al llamar a Gemini:', err2.message);
      process.exit(1);
    }
  }

  if (!raw) {
    console.error('Gemini no devolvió texto.');
    process.exit(1);
  }

  const data = parseJsonResponse(raw);

  const { titulo, descripcion, cuerpo, tags } = data;
  const tagsList = Array.isArray(tags) && tags.length > 0 ? tags : ['evergreen', 'ia'];

  const postSlug = slugify(titulo, { lower: true, strict: true });
  const imageUrl = getBlogImageUrl(titulo);

  let frontmatter = '---\n';
  frontmatter += `title: "${escapeYaml(titulo)}"\n`;
  frontmatter += `pubDate: ${new Date().toISOString()}\n`;
  frontmatter += `description: "${escapeYaml(descripcion || titulo)}"\n`;
  frontmatter += 'image:\n';
  frontmatter += `  url: "${imageUrl}"\n`;
  frontmatter += `  alt: "${escapeYaml(titulo)}"\n`;
  frontmatter += 'tags:\n';
  for (const tag of tagsList) {
    frontmatter += `  - ${tag}\n`;
  }
  frontmatter += '---\n\n';

  const fileContent = frontmatter + (cuerpo || '').trim() + '\n';
  const filePath = path.join(BLOG_DIR, `${postSlug}.md`);

  await fs.mkdir(BLOG_DIR, { recursive: true });
  await fs.writeFile(filePath, fileContent, 'utf8');

  console.log('Post evergreen creado:', filePath);
  console.log('Slug:', postSlug);
  console.log('URL imagen (Picsum):', imageUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
