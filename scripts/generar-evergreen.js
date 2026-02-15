/**
 * Script para generar un post de blog evergreen (contenido que no caduca)
 * usando la API de Gemini. Prioridad: IA, luego programación.
 * Las imágenes se obtienen de Pollinations.ai.
 * Uso: GEMINI_API_KEY=xxx node scripts/generar-evergreen.js
 */

import { GoogleGenAI } from '@google/genai';
import slugify from 'slugify';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');

const SYSTEM_PROMPT = `Eres un experto escritor de blogs de tecnología. Tu tarea es crear contenido EVERGREEN: artículos que no caducan con el tiempo, útiles durante años.

Prioridad de temas (en este orden):
1. Inteligencia artificial: conceptos, buenas prácticas, tutoriales atemporales, fundamentos de ML/IA, ética en IA, herramientas de IA para desarrolladores, patrones que no pasan de moda.
2. Programación: fundamentos, patrones de diseño, buenas prácticas, conceptos de lenguajes, arquitectura de software, testing, refactoring, código limpio.

Reglas:
- NO escribas sobre noticias recientes, lanzamientos de productos con fecha, ni eventos pasados.
- NO uses "en 2024", "este año", "últimamente" ni referencias temporales que envejezcan el texto.
- Sí: conceptos explicados de forma atemporal, "cómo funciona X", "por qué Y", "guía de Z", mejores prácticas, fundamentos.
- El artículo debe ser en español, bien estructurado con Markdown (encabezados ##, ###, listas, **negritas**, código si aplica).
- Longitud: entre 400 y 800 palabras, que aporte valor real.
- Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta (sin markdown alrededor, sin \`\`\`json):
{"titulo": "string", "descripcion": "string corta para meta description, max 160 caracteres", "cuerpo": "string en markdown con el artículo completo"}
- El "cuerpo" debe ser el markdown listo para el post (sin incluir el título en el cuerpo).`;

const USER_PROMPT = `Genera un nuevo artículo evergreen sobre tecnología. Elige un tema que priorice inteligencia artificial; si ya has cubierto muchos de IA, elige uno de programación. Asegúrate de que el contenido sea atemporal y útil a largo plazo. Responde solo con el JSON.`;

/**
 * Genera la URL de imagen en Pollinations.ai a partir del título/tema del post.
 * @param {string} titulo
 * @returns {string}
 */
function getPollinationsImageUrl(titulo) {
  const prompt = `professional blog illustration, technology, ${titulo}, digital art, clean modern style, no text`;
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=1200&height=630`;
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

  console.log('Generando artículo evergreen con Gemini...');
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${USER_PROMPT}`;
  let raw;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    raw = response?.text?.trim() || '';
  } catch (err) {
    console.error('Error al llamar a Gemini:', err.message);
    process.exit(1);
  }

  if (!raw) {
    console.error('Gemini no devolvió texto.');
    process.exit(1);
  }

  // Limpiar posible markdown alrededor del JSON
  let jsonStr = raw;
  const codeMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) jsonStr = codeMatch[1].trim();

  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    console.error('La respuesta no es JSON válido. Raw:', raw.slice(0, 300));
    process.exit(1);
  }

  const { titulo, descripcion, cuerpo } = data;
  if (!titulo || !cuerpo) {
    console.error('Faltan titulo o cuerpo en la respuesta.');
    process.exit(1);
  }

  const postSlug = slugify(titulo, { lower: true, strict: true });
  const imageUrl = getPollinationsImageUrl(titulo);

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
  console.log('URL imagen:', imageUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
