/**
 * Revisa los básicos de una web (título, descripción, favicon, vista previa en
 * redes, contacto…). Lo usa la herramienta /revisa-tu-web/.
 */
import type { APIRoute } from 'astro';
import { auditSite, AuditError } from '../../lib/site-audit';
import { allowedOrigin, clientIp, createRateLimiter, jsonResponse } from '../../lib/api-guard';

export const prerender = false;

const rateLimited = createRateLimiter(10, 10 * 60 * 1000);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!allowedOrigin(request.headers.get('origin'))) return jsonResponse(403, { error: 'Origen no permitido.' });
  if (rateLimited(clientIp(request, clientAddress))) {
    return jsonResponse(429, { error: 'Hiciste muchas revisiones seguidas. Prueba de nuevo en unos minutos.' });
  }

  let url = '';
  try {
    url = String((await request.json())?.url ?? '');
  } catch {
    return jsonResponse(400, { error: 'Petición no válida.' });
  }

  try {
    return jsonResponse(200, await auditSite(url));
  } catch (error) {
    if (error instanceof AuditError) return jsonResponse(422, { error: error.message });
    console.error('revisar-web', error);
    return jsonResponse(500, { error: 'No pude revisar esa web ahora mismo. Prueba de nuevo en un momento.' });
  }
};
