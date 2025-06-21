import OpenAI from 'openai';
import { createEntry } from 'astro:content';
import slugify from 'slugify';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

// Configurar el cliente de DeepSeek
const deepseek = new OpenAI({
    apiKey: import.meta.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});

/**
 * @param {string} titulo
 * @param {string} contenido
 */
async function reescribirContenido(titulo, contenido) {
    const promptContent = contenido || titulo;
    console.log("Enviando a DeepSeek - Título:", titulo);
    console.log("Enviando a DeepSeek - Contenido:", promptContent);

    const completion = await deepseek.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
            {
                role: 'system',
                content: 'Eres un experto escritor de blogs de tecnología. Tu tarea es reescribir el siguiente artículo para que sea único, atractivo y optimizado para SEO. Proporciona un nuevo título y un nuevo cuerpo para el post. El resultado debe estar en formato JSON con las claves "nuevoTitulo" y "nuevoCuerpo". Asegúrate de que el JSON sea siempre válido.'
            },
            {
                role: 'user',
                content: `Título Original: ${titulo}\n\nContenido Original: ${promptContent}`
            }
        ],
        response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0].message.content;
    console.log("Respuesta recibida de DeepSeek:", responseContent);

    try {
        return JSON.parse(responseContent);
    } catch (e) {
        console.error("Error al parsear JSON de DeepSeek:", e);
        throw new Error("La respuesta de la IA no es un JSON válido.");
    }
}

/** @type {import('astro').APIRoute} */
export const POST = async ({ request }) => {


    try {
        console.log("Cabeceras recibidas en el servidor:", Object.fromEntries(request.headers.entries()));

        if (!request.headers.get("content-type")?.includes("application/json")) {
            return new Response(JSON.stringify({ error: 'La solicitud debe ser JSON.' }), { status: 415 });
        }

        const body = await request.text();
        if (!body) {
            return new Response(JSON.stringify({ error: 'El cuerpo de la solicitud está vacío.' }), { status: 400 });
        }

        const article = JSON.parse(body);

        if (!article.content) {
            console.warn(`El artículo "${article.title}" no tiene contenido. Se usará la descripción en su lugar.`);
        }

        const { nuevoTitulo, nuevoCuerpo } = await reescribirContenido(article.title, article.content || article.description);

        const postSlug = slugify(nuevoTitulo, { lower: true, strict: true });

        // --- CONSTRUCCIÓN SEGURA DEL FRONTMATTER (VERSIÓN CORREGIDA) ---
        let frontmatter = '---\n';
        frontmatter += `title: "${nuevoTitulo.replace(/"/g, '\\"')}"\n`;
        frontmatter += `pubDate: ${new Date().toISOString()}\n`;
        frontmatter += `description: "${article.description.replace(/"/g, '\\"')}"\n`;

        if (article.url) {
            frontmatter += `originalUrl: "${article.url}"\n`;
        }
        if (article.image) {
            frontmatter += 'image:\n';
            frontmatter += `  url: "${article.image}"\n`;
            frontmatter += `  alt: "${nuevoTitulo.replace(/"/g, '\\"')}"\n`;
        }
        frontmatter += '---';

        const fileContent = `${frontmatter}\n\n${nuevoCuerpo}`;
        
        const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${postSlug}.md`);
        await fs.writeFile(filePath, fileContent);

        const postUrl = `/blog/${postSlug}/`;
        return new Response(JSON.stringify({ success: true, postUrl }), { status: 200 });

    } catch (error) {
        console.error("Error al crear el post:", error);
        return new Response(JSON.stringify({ error: 'No se pudo crear el post.' }), { status: 500 });
    }
}; 