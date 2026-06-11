import { verifyAdminRequest, unauthorizedResponse } from '../../../../lib/adminAuth';
import { createProjectAdmin, listProjectsAdmin } from '../../../../lib/projectApi';

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();

  try {
    const projects = await listProjectsAdmin();
    return new Response(JSON.stringify(projects), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function POST({ request }: { request: Request }) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const project = await createProjectAdmin(payload);
    return new Response(JSON.stringify(project), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
