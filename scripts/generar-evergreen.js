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

/** Días hacia atrás para considerar "temas recientes" y no repetir (evitar overfitting, redes neuronales, etc.). */
const DIAS_EVITAR_REPETICION = 30;

/**
 * Lee los títulos de los posts del blog publicados en los últimos N días.
 * @returns {Promise<string[]>}
 */
async function getTitulosRecientes() {
  let entries;
  try {
    entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  } catch (e) {
    return [];
  }
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DIAS_EVITAR_REPETICION);
  const titulos = [];
  for (const ent of entries) {
    if (!ent.isFile() || !ent.name.endsWith('.md')) continue;
    const filePath = path.join(BLOG_DIR, ent.name);
    let content;
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch {
      continue;
    }
    const pubMatch = content.match(/pubDate:\s*(\S+)/);
    const titleMatch = content.match(/title:\s*"((?:[^"\\]|\\.)*)"/);
    if (!pubMatch || !titleMatch) continue;
    const pubDate = new Date(pubMatch[1].trim());
    if (pubDate >= cutoff) {
      titulos.push(titleMatch[1].replace(/\\"/g, '"').trim());
    }
  }
  return titulos;
}

const SYSTEM_PROMPT = `Eres un experto escritor de blogs de tecnología. Tu tarea es crear contenido EVERGREEN: artículos que no caducan con el tiempo, útiles durante años.

Prioridad de temas (en este orden):
1. Inteligencia artificial: conceptos, buenas prácticas, tutoriales atemporales, fundamentos de ML/IA, ética en IA, herramientas de IA para desarrolladores, patrones que no pasan de moda.
2. Programación: fundamentos, patrones de diseño, buenas prácticas, conceptos de lenguajes, arquitectura de software, testing, refactoring, código limpio.

Reglas:
- NO escribas sobre noticias recientes, lanzamientos de productos con fecha, ni eventos pasados.
- NO uses "en 2024", "este año", "últimamente" ni referencias temporales que envejezcan el texto.
- Sí: conceptos explicados de forma atemporal, "cómo funciona X", "por qué Y", "guía de Z", mejores prácticas, fundamentos.
- SEO: el contenido debe estar optimizado para buscadores. Usa encabezados descriptivos (H2, H3) que incluyan términos de búsqueda, palabras clave relevantes de forma natural, responde directamente a la intención de búsqueda del lector y evita el keyword stuffing.
- El artículo debe ser en español, bien estructurado con Markdown (encabezados ##, ###, listas, **negritas**, código si aplica).
- Longitud: entre 400 y 800 palabras, que aporte valor real.
- Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta (sin markdown alrededor, sin \`\`\`json):
{"titulo": "string", "descripcion": "string corta para meta description, max 160 caracteres", "cuerpo": "string en markdown con el artículo completo"}
- El "cuerpo" debe ser el markdown listo para el post (sin incluir el título en el cuerpo).`;

const USER_PROMPT_BASE = `Genera un nuevo artículo evergreen sobre tecnología. Elige un tema que priorice inteligencia artificial; si ya has cubierto muchos de IA, elige uno de programación. Asegúrate de que el contenido sea atemporal y útil a largo plazo.`;

// Schema para forzar respuesta JSON válida (structured output de Gemini)
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    titulo: { type: 'string', description: 'Título del artículo' },
    descripcion: { type: 'string', description: 'Meta description, máximo 160 caracteres' },
    cuerpo: { type: 'string', description: 'Cuerpo del artículo en Markdown' },
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

  const titulosRecientes = await getTitulosRecientes();
  let userPrompt = USER_PROMPT_BASE;
  if (titulosRecientes.length > 0) {
    userPrompt += `\n\nIMPORTANTE - NO repitas tema: Los siguientes artículos se publicaron en los últimos ${DIAS_EVITAR_REPETICION} días. Elige un tema CLARAMENTE DIFERENTE (no el mismo concepto con otras palabras). Evita sobre todo temas muy similares como "overfitting/underfitting", "redes neuronales", "aprendizaje supervisado", etc. si ya aparecen en la lista:\n- ${titulosRecientes.join('\n- ')}`;
  }
  userPrompt += '. Responde solo con un JSON válido: {"titulo": "...", "descripcion": "...", "cuerpo": "..."}.';

  console.log('Generando artículo evergreen con Gemini...');
  if (titulosRecientes.length > 0) {
    console.log(`Evitando repetir temas de ${titulosRecientes.length} post(s) recientes.`);
  }
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;
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

  const { titulo, descripcion, cuerpo } = data;

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
  frontmatter += '  - evergreen\n';
  frontmatter += '  - ia\n';
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
