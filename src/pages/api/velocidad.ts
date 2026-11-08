/**
 * Velocidad en el celular con PageSpeed Insights (Google). Va aparte de la
 * revisión porque tarda 20-40 segundos.
 */
import type { APIRoute } from 'astro';
import { PAGESPEED_API_KEY } from 'astro:env/server';
import { normalizeUrl, AuditError } from '../../lib/site-audit';
import { allowedOrigin, clientIp, createRateLimiter, jsonResponse } from '../../lib/api-guard';

export const prerender = false;

const rateLimited = createRateLimiter(6, 10 * 60 * 1000);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!allowedOrigin(request.headers.get('origin'))) return jsonResponse(403, { error: 'Origen no permitido.' });
  if (rateLimited(clientIp(request, clientAddress))) {
    return jsonResponse(429, { error: 'Demasiadas mediciones seguidas. Prueba en unos minutos.' });
  }

  let target: URL;
  try {
    target = normalizeUrl(String((await request.json())?.url ?? ''));
  } catch (error) {
    return jsonResponse(400, { error: error instanceof AuditError ? error.message : 'Petición no válida.' });
  }

  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', target.href);
  api.searchParams.set('strategy', 'mobile');
  api.searchParams.set('category', 'performance');
  api.searchParams.set('locale', 'es');
  if (PAGESPEED_API_KEY) api.searchParams.set('key', PAGESPEED_API_KEY);

  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(55_000) });
    const data = await res.json();
    if (!res.ok || !data.lighthouseResult) {
      console.error('PageSpeed', res.status, data?.error?.message);
      return jsonResponse(502, { error: 'Google no pudo medir la velocidad de esa web ahora mismo.' });
    }
    const lh = data.lighthouseResult;
    const audits = lh.audits ?? {};
    const metric = (id: string) => (audits[id] ? { value: audits[id].displayValue ?? '', score: audits[id].score } : null);
    // Las mejoras con más ahorro, ya en español
    const opportunities = Object.values(audits as Record<string, any>)
      .filter((a) => a.details?.type === 'opportunity' && (a.details.overallSavingsMs ?? 0) >= 300)
      .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
      .slice(0, 4)
      .map((a) => ({ title: a.title, savings: Math.round(a.details.overallSavingsMs / 100) / 10 }));

    return jsonResponse(200, {
      score: Math.round((lh.categories?.performance?.score ?? 0) * 100),
      metrics: {
        fcp: metric('first-contentful-paint'),
        lcp: metric('largest-contentful-paint'),
        tbt: metric('total-blocking-time'),
        cls: metric('cumulative-layout-shift'),
      },
      opportunities,
    });
  } catch {
    return jsonResponse(504, { error: 'La medición de velocidad tardó demasiado. Puedes probar en pagespeed.web.dev.' });
  }
};
