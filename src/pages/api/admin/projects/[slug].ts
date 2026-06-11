import { verifyAdminRequest, unauthorizedResponse } from '../../../../lib/adminAuth';
import {
  deleteProjectAdmin,
  getProjectAdmin,
  updateProjectAdmin,
} from '../../../../lib/projectApi';

export const prerender = false;

export async function GET({ request, params }: { request: Request; params: { slug: string } }) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();

  try {
    const project = await getProjectAdmin(params.slug);
    if (!project) {
      return new Response(JSON.stringify({ error: 'Proyecto no encontrado' }), { status: 404 });
    }
    return new Response(JSON.stringify(project), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function PUT({ request, params }: { request: Request; params: { slug: string } }) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();

  try {
    const payload = await request.json();
    const project = await updateProjectAdmin(params.slug, payload);
    return new Response(JSON.stringify(project), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function DELETE({ request, params }: { request: Request; params: { slug: string } }) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();

  try {
    await deleteProjectAdmin(params.slug);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
