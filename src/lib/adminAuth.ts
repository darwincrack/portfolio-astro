export function verifyAdminRequest(request: Request): boolean {
  const secret = import.meta.env.ADMIN_SECRET;
  if (!secret) return false;

  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;

  return auth.slice(7) === secret;
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'No autorizado' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
