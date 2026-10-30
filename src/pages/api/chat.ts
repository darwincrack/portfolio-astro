/**
 * Asistente del sitio: recibe la conversación y devuelve la respuesta de
 * Gemini como texto en streaming.
 */
import type { APIRoute } from 'astro';
import { GEMINI_API_KEY, ASSISTANT_MODEL } from 'astro:env/server';
import { getSystemPrompt } from '../../lib/assistant';

export const prerender = false;

const MAX_TURNS = 12; // mensajes del visitante por conversación
const MAX_CHARS = 800; // por mensaje
const MAX_HISTORY = 16; // mensajes que se envían al modelo

// Límite por IP en memoria. Cada instancia de Vercel lleva su cuenta, así que
// no es exacto, pero frena el abuso básico; el tope fuerte es el límite de
// gasto configurado en Google AI Studio.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

function allowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'darwincd.com' ||
      hostname === 'www.darwincd.com' ||
      hostname === 'localhost' ||
      hostname.endsWith('-darwincracks-projects.vercel.app')
    );
  } catch {
    return false;
  }
}

type ChatMessage = { role: 'user' | 'model'; text: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const clean: ChatMessage[] = [];
  for (const m of messages) {
    if (!m || (m.role !== 'user' && m.role !== 'model') || typeof m.text !== 'string') return null;
    const text = m.text.trim().slice(0, MAX_CHARS);
    if (text) clean.push({ role: m.role, text });
  }
  if (clean.at(-1)?.role !== 'user') return null;
  if (clean.filter((m) => m.role === 'user').length > MAX_TURNS) return null;
  return clean.slice(-MAX_HISTORY);
}

const json = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!GEMINI_API_KEY) return json(503, 'El asistente no está disponible ahora mismo.');
  if (!allowedOrigin(request.headers.get('origin'))) return json(403, 'Origen no permitido.');

  const ip = request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'desconocida';
  if (rateLimited(ip)) return json(429, 'Demasiados mensajes seguidos. Prueba en unos minutos o escribe a Darwin por WhatsApp.');

  let messages: ChatMessage[] | null = null;
  try {
    messages = parseMessages(await request.json());
  } catch {
    // cuerpo inválido
  }
  if (!messages) return json(400, 'La conversación llegó en un formato no válido o es demasiado larga.');

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${ASSISTANT_MODEL}:streamGenerateContent?alt=sse`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: await getSystemPrompt() }] },
        contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        generationConfig: {
          maxOutputTokens: 700,
          temperature: 0.4,
          // Razonamiento mínimo: responde antes. Los modelos "lite" admiten
          // 'minimal'; los demás, como mucho 'low'.
          thinkingConfig: { thinkingLevel: ASSISTANT_MODEL.includes('lite') ? 'minimal' : 'low' },
        },
      }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    console.error('Gemini', upstream.status, await upstream.text().catch(() => ''));
    return json(502, 'El asistente no pudo responder. Puedes escribir a Darwin por WhatsApp.');
  }

  // Gemini envía eventos SSE con JSON; al navegador le pasamos solo el texto.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          try {
            const data = JSON.parse(line.slice(5));
            const text = (data.candidates?.[0]?.content?.parts ?? [])
              .filter((p: { thought?: boolean }) => !p.thought)
              .map((p: { text?: string }) => p.text ?? '')
              .join('');
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // línea incompleta o sin JSON
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
};
