import {
  esMimeTypePermitido,
  extraerDatosCarrera,
  formatGeminiError,
  GeminiApiError,
  MIME_TYPES_PERMITIDOS,
  type PayloadExtraido,
} from '../../lib/extraerCarreraPdf';

export const prerender = false;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** @type {import('astro').APIRoute} */
export const POST = async ({ request }) => {
  try {
    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY no está configurada en el servidor.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(
        JSON.stringify({ error: 'Envía el archivo como multipart/form-data.' }),
        { status: 415, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const paginaRaw = formData.get('pagina');
    const pagina = paginaRaw != null && paginaRaw !== '' ? Number(paginaRaw) : undefined;

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'Falta el campo "file" con el PDF o imagen.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (file.size === 0) {
      return new Response(
        JSON.stringify({ error: 'El archivo está vacío.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'El archivo supera el límite de 10 MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const mimeType = file.type || 'application/pdf';
    if (!esMimeTypePermitido(mimeType)) {
      return new Response(
        JSON.stringify({
          error: `Tipo de archivo no soportado. Usa: ${MIME_TYPES_PERMITIDOS.join(', ')}`,
        }),
        { status: 415, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (pagina != null && (Number.isNaN(pagina) || pagina < 1)) {
      return new Response(
        JSON.stringify({ error: 'El campo "pagina" debe ser un entero ≥ 1.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const startedAt = Date.now();
    const result = await extraerDatosCarrera(buffer, mimeType, apiKey, pagina);
    const elapsedMs = Date.now() - startedAt;

    if ('needsPagination' in result && result.needsPagination) {
      return new Response(
        JSON.stringify({
          success: true,
          needsPagination: true,
          totalPaginas: result.totalPaginas,
          elapsedMs,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const datos = result as PayloadExtraido;

    if (pagina != null) {
      const carrera = datos.carreras[0];
      return new Response(
        JSON.stringify({
          success: true,
          pagina,
          totalPaginas: datos.total_paginas,
          carrera,
          formato_detectado: datos.formato_detectado,
          elapsedMs,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        datos,
        elapsedMs,
        advertencias: datos.advertencias ?? [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error al extraer PDF:', error);

    if (error instanceof GeminiApiError) {
      return new Response(
        JSON.stringify({ error: error.message, code: error.status }),
        { status: error.status, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const formatted = formatGeminiError(error);
    return new Response(
      JSON.stringify({ error: formatted.message, code: formatted.status }),
      { status: formatted.status, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const config = {
  maxDuration: 60,
};
