/**
 * Protección común de los endpoints públicos: origen permitido y límite por IP.
 */

export function allowedOrigin(origin: string | null): boolean {
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

/**
 * Límite en memoria por IP. Cada instancia de Vercel lleva su cuenta, así que
 * no es exacto, pero frena el abuso básico.
 */
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (ip: string): boolean => {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > max;
  };
}

export const clientIp = (request: Request, clientAddress?: string) =>
  request.headers.get('cf-connecting-ip') ?? clientAddress ?? 'desconocida';

export const jsonResponse = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
