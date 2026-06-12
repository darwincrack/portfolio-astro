import { GoogleGenAI } from '@google/genai';
import { PDFDocument } from 'pdf-lib';

const PAGE_PROMPT = `Extractor de UNA carrera hípica venezolana (INH) en esta página.
Formatos: "rinconada" (La Rinconada) | "valencia" (Valencia).
Kilos "56-1" → kilos: 56, descargo: -1. "(USA)" → procedencia USA; si no → NACIONAL.
PREMIOS obligatorios si aparecen: Premio Bs → total_bs; % al 1°-5°; Prima Criador 2%; Bono $ → bono_usd.
Columna "Entrenador" de la tabla → campo entrenador (texto del entrenador, NO confundir con criador ni P.I.).
Columna "Medic." → campo medicamentos (ej. BUT-LAX).
Extrae reunión, hipódromo, fecha, día, llamado, carrera nro, hora, distancia, condición, ejemplares, juegos.`;

const EJEMPLAR_SCHEMA = {
  type: 'object',
  properties: {
    p_p: { type: 'number', nullable: true },
    no: { type: 'number', nullable: true },
    nombre: { type: 'string', nullable: true },
    procedencia: { type: 'string', nullable: true },
    sexo_pelaje: { type: 'string', nullable: true },
    ano_nacimiento: { type: 'number', nullable: true },
    padre_madre: { type: 'string', nullable: true },
    propietario: { type: 'string', nullable: true },
    stud: { type: 'string', nullable: true },
    medicamentos: { type: 'string', nullable: true },
    kilos: { type: 'number', nullable: true },
    descargo: { type: 'number', nullable: true },
    jinete: { type: 'string', nullable: true },
    implementos: { type: 'string', nullable: true },
    entrenador: { type: 'string', nullable: true },
    criador: { type: 'string', nullable: true },
  },
};

const PREMIOS_SCHEMA = {
  type: 'object',
  properties: {
    total_bs: { type: 'number', nullable: true },
    distribucion: {
      type: 'object',
      properties: {
        '1er_lugar_porcentaje': { type: 'number', nullable: true },
        '2do_lugar_porcentaje': { type: 'number', nullable: true },
        '3er_lugar_porcentaje': { type: 'number', nullable: true },
        '4to_lugar_porcentaje': { type: 'number', nullable: true },
        '5to_lugar_porcentaje': { type: 'number', nullable: true },
        prima_criador_porcentaje: { type: 'number', nullable: true },
      },
    },
    bono_usd: { type: 'number', nullable: true },
    adicional_usd: { type: 'number', nullable: true },
  },
};

const SINGLE_PAGE_SCHEMA = {
  type: 'object',
  properties: {
    formato_detectado: { type: 'string', enum: ['rinconada', 'valencia'] },
    informacion_general: {
      type: 'object',
      properties: {
        institucion: { type: 'string', nullable: true },
        hipodromo: { type: 'string', nullable: true },
        direccion: { type: 'string', nullable: true },
        reunion: { type: 'number', nullable: true },
        llamado: { type: 'number', nullable: true },
        dia: { type: 'string', nullable: true },
        fecha: { type: 'string', nullable: true },
        carrera_nro: { type: 'number', nullable: true },
        carrera_del_dia_nro: { type: 'number', nullable: true },
        carrera_anual_nro: { type: 'number', nullable: true },
        hora: { type: 'string', nullable: true },
        distancia_mts: { type: 'number', nullable: true },
      },
    },
    condiciones: {
      type: 'object',
      properties: {
        descripcion: { type: 'string', nullable: true },
        premios: PREMIOS_SCHEMA,
        observacion: { type: 'string', nullable: true },
        observaciones: { type: 'string', nullable: true },
      },
    },
    ejemplares: { type: 'array', items: EJEMPLAR_SCHEMA },
    juegos_disponibles: { type: 'array', items: { type: 'string' } },
  },
};

/** A partir de 2 páginas se procesa una por una (evita JSON truncado y timeout). */
export const UMBRAL_PAGINAS_POR_PAGINA = 2;

export type CarreraExtraida = Record<string, unknown>;

export type PayloadExtraido = {
  formato_detectado?: string;
  multipagina: boolean;
  total_paginas: number;
  reunion_info: Record<string, unknown>;
  carreras: CarreraExtraida[];
  advertencias?: string[];
};

function getModel() {
  return import.meta.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function contarPaginasPdf(buffer: Buffer): Promise<number> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return doc.getPageCount();
}

export async function extraerPaginaPdfBuffer(fullBuffer: Buffer, pageIndex: number): Promise<Buffer> {
  const src = await PDFDocument.load(fullBuffer, { ignoreEncryption: true });
  const dst = await PDFDocument.create();
  const [page] = await dst.copyPages(src, [pageIndex]);
  dst.addPage(page);
  return Buffer.from(await dst.save());
}

function extractJsonString(raw: string): string {
  let jsonStr = raw.trim().replace(/^\uFEFF/, '');
  const codeMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeMatch) jsonStr = codeMatch[1].trim();

  // Gemini a veces antepone una llave suelta: "}\n{ ... }"
  jsonStr = jsonStr.replace(/^\s*}\s*(?=\{)/, '').trim();

  const firstBrace = jsonStr.indexOf('{');
  const lastBrace = jsonStr.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  } else if (firstBrace !== -1 && lastBrace === -1) {
    jsonStr = jsonStr.slice(firstBrace);
  }

  return jsonStr
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, '$1');
}

function closeOpenJson(jsonStr: string): string {
  let s = jsonStr.trim().replace(/,\s*([}\]])/g, '$1');
  const stack: ('}' | ']')[] = [];
  let inString = false;
  let escape = false;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inString) {
      if (escape) escape = false;
      else if (c === '\\') escape = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === '{') stack.push('}');
    else if (c === '[') stack.push(']');
    else if (c === '}' || c === ']') {
      if (stack.length && stack[stack.length - 1] === c) stack.pop();
    }
  }

  if (inString) s += '"';
  s = s.replace(/,\s*"[^"]*":\s*"[^"]*$/s, '');
  s = s.replace(/,\s*"[^"]*":\s*[^,}\]]*$/s, '');
  s = s.replace(/,\s*$/, '');
  while (stack.length) s += stack.pop();
  return s;
}

export function parseJsonResponse(raw: string): { data: unknown; advertencias: string[] } {
  if (!raw?.trim()) {
    throw new GeminiApiError('Gemini devolvió respuesta vacía.', 422);
  }

  const jsonStr = extractJsonString(raw);
  const advertencias: string[] = [];

  try {
    return { data: JSON.parse(jsonStr), advertencias };
  } catch (firstErr) {
    try {
      const data = JSON.parse(closeOpenJson(jsonStr));
      advertencias.push('JSON reparado automáticamente.');
      return { data, advertencias };
    } catch {
      const preview = raw.replace(/\s+/g, ' ').slice(0, 120);
      console.error('[extraerCarreraPdf] JSON inválido. Preview:', preview);
      const detail =
        firstErr instanceof Error && firstErr.message ? ` (${firstErr.message})` : '';
      throw new GeminiApiError(`Gemini devolvió JSON inválido${detail}.`, 422);
    }
  }
}

function extractResponseText(response: {
  text?: string;
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}): string {
  const direct = response?.text?.trim();
  if (direct) return direct;

  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((part) => part.text ?? '')
    .join('')
    .trim();
}

export class GeminiApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'GeminiApiError';
    this.status = status;
  }
}

export function formatGeminiError(err: unknown): { message: string; status: number } {
  const raw = err instanceof Error ? err.message : String(err);

  const tryParse = (text: string) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    try {
      return JSON.parse(jsonMatch[0]) as {
        error?: { code?: number; message?: string; status?: string };
      };
    } catch {
      return null;
    }
  };

  const parsed = tryParse(raw);
  const apiError = parsed?.error;
  const code = apiError?.code;
  const apiMessage = apiError?.message ?? raw;

  if (
    code === 429 ||
    apiError?.status === 'RESOURCE_EXHAUSTED' ||
    /quota exceeded|exceeded your current quota/i.test(apiMessage)
  ) {
    const retryMatch = apiMessage.match(/retry in ([\d.]+)s/i);
    const retrySec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 8;
    return {
      status: 429,
      message: `Cuota de Gemini agotada. Reintenta en ${retrySec} s.`,
    };
  }

  if (
    code === 503 ||
    code === 502 ||
    code === 504 ||
    apiError?.status === 'UNAVAILABLE' ||
    /high demand|temporarily unavailable|overloaded|try again later/i.test(apiMessage)
  ) {
    return {
      status: 503,
      message: 'Gemini está saturado momentáneamente. Reintentando automáticamente…',
    };
  }

  if (code === 403 || /api key not valid|permission denied/i.test(apiMessage)) {
    return { status: 403, message: 'Clave de Gemini inválida. Revisa GEMINI_API_KEY.' };
  }

  if (code === 400) {
    return { status: 400, message: 'Gemini rechazó la solicitud.' };
  }

  if (raw.length > 280) {
    return { status: 500, message: 'Error al procesar con Gemini.' };
  }

  return { status: 500, message: raw };
}

function buildGenerateConfig(
  model: string,
  schema: Record<string, unknown> | null,
  maxOutputTokens = 16384,
) {
  const config: Record<string, unknown> = {
    responseMimeType: 'application/json',
    temperature: 0,
    maxOutputTokens,
  };

  if (schema) {
    config.responseSchema = schema;
  }

  if (model.includes('2.5')) {
    config.thinkingConfig = { thinkingBudget: 0 };
  }

  return config;
}

function isRetryableGeminiStatus(status: number) {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

async function callGeminiWithRetry(
  ai: GoogleGenAI,
  contents: unknown[],
  model: string,
  schema: Record<string, unknown>,
): Promise<string> {
  const maxAttempts = 6;
  let lastParseError: GeminiApiError | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const useSchema = attempt < 3;
    const maxTokens = attempt >= 3 ? 24576 : 16384;

    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: buildGenerateConfig(model, useSchema ? schema : null, maxTokens),
      });

      const text = extractResponseText(response);
      if (!text) {
        lastParseError = new GeminiApiError('Gemini no devolvió texto.', 500);
        await sleep(1500 + attempt * 1000);
        continue;
      }

      try {
        parseJsonResponse(text);
        return text;
      } catch (err) {
        lastParseError =
          err instanceof GeminiApiError
            ? err
            : new GeminiApiError('Gemini devolvió JSON inválido.', 422);
        console.warn(
          `[extraerCarreraPdf] Intento ${attempt + 1}/${maxAttempts} JSON inválido${useSchema ? '' : ' (sin schema)'}`,
        );
        await sleep(2000 + attempt * 1500);
      }
    } catch (err) {
      const formatted = formatGeminiError(err);
      if (isRetryableGeminiStatus(formatted.status) && attempt < maxAttempts - 1) {
        const wait = Math.min(20000, 2000 * 2 ** attempt);
        console.warn(
          `[extraerCarreraPdf] ${formatted.status} en intento ${attempt + 1}/${maxAttempts}, espera ${wait}ms`,
        );
        await sleep(wait);
        continue;
      }
      throw new GeminiApiError(formatted.message, formatted.status);
    }
  }

  throw lastParseError ?? new GeminiApiError('Gemini no devolvió datos válidos.', 500);
}

const ENTRENADOR_KEYS = ['entrenador', 'Entrenador', 'ENTRENADOR', 'entrenador_nombre', 'trainer'] as const;
const MEDICAMENTOS_KEYS = ['medicamentos', 'Medicamentos', 'medic', 'Medic.', 'medicamento', 'Medicamento'] as const;
const JINETE_KEYS = ['jinete', 'Jinete', 'JINETE'] as const;
const IMPLEMENTOS_KEYS = ['implementos', 'Implementos', 'IMPLEMENTOS', 'impl'] as const;

function pickFirstField(obj: Record<string, unknown>, keys: readonly string[]): unknown {
  for (const key of keys) {
    const val = obj[key];
    if (val != null && String(val).trim() !== '') return val;
  }
  return undefined;
}

function normalizeEjemplar(ej: Record<string, unknown>): Record<string, unknown> {
  const entrenador = pickFirstField(ej, ENTRENADOR_KEYS);
  if (entrenador != null) {
    ej.entrenador = String(entrenador).trim();
  } else if (ej.criador != null && String(ej.criador).trim() !== '') {
    ej.entrenador = String(ej.criador).trim();
  }

  const medicamentos = pickFirstField(ej, MEDICAMENTOS_KEYS);
  if (medicamentos != null) ej.medicamentos = String(medicamentos).trim();

  const jinete = pickFirstField(ej, JINETE_KEYS);
  if (jinete != null) ej.jinete = String(jinete).trim();

  const implementos = pickFirstField(ej, IMPLEMENTOS_KEYS);
  if (implementos != null) ej.implementos = String(implementos).trim();

  if (ej.p_p == null) {
    const pp = pickFirstField(ej, ['p_p', 'pp', 'P_P', 'p.p', 'pi', 'P.I.']);
    if (pp != null) ej.p_p = pp;
  }

  return ej;
}

function normalizeEjemplares(data: Record<string, unknown>) {
  if (!Array.isArray(data.ejemplares)) return;
  data.ejemplares = data.ejemplares.map((item) => {
    if (!item || typeof item !== 'object') return item;
    return normalizeEjemplar({ ...(item as Record<string, unknown>) });
  });
}

export function normalizeCarreraData(data: Record<string, unknown>) {
  if (!data.condiciones || typeof data.condiciones !== 'object') {
    data.condiciones = {};
  }

  const cond = data.condiciones as Record<string, unknown>;
  if (!cond.premios || typeof cond.premios !== 'object') cond.premios = {};

  const premios = cond.premios as Record<string, unknown>;
  const root = data as Record<string, unknown>;

  if (root.total_bs != null && premios.total_bs == null) premios.total_bs = root.total_bs;
  if (root.bono_usd != null && premios.bono_usd == null) premios.bono_usd = root.bono_usd;

  if (!premios.distribucion || typeof premios.distribucion !== 'object') {
    premios.distribucion = {};
  }

  const dist = premios.distribucion as Record<string, unknown>;
  const pctKeys = [
    ['1er_lugar_porcentaje', '1er_lugar'],
    ['2do_lugar_porcentaje', '2do_lugar'],
    ['3er_lugar_porcentaje', '3er_lugar'],
    ['4to_lugar_porcentaje', '4to_lugar'],
    ['5to_lugar_porcentaje', '5to_lugar'],
  ] as const;

  for (const aliases of pctKeys) {
    const target = aliases[0];
    if (dist[target] == null) {
      for (const alias of aliases.slice(1)) {
        if (dist[alias] != null) {
          dist[target] = dist[alias];
          break;
        }
      }
    }
  }

  normalizeEjemplares(data);
  return data;
}

export function extractReunionInfoFromCarrera(carrera: Record<string, unknown>) {
  const info = (carrera.informacion_general as Record<string, unknown>) ?? carrera;
  return {
    institucion: info.institucion ?? null,
    hipodromo: info.hipodromo ?? null,
    direccion: info.direccion ?? null,
    reunion: info.reunion ?? null,
    dia: info.dia ?? null,
    fecha: info.fecha ?? null,
  };
}

export function normalizeExtractedPayload(
  data: Record<string, unknown>,
  advertencias: string[] = [],
): PayloadExtraido {
  if (Array.isArray(data.carreras) && data.carreras.length > 0) {
    const carreras = (data.carreras as Record<string, unknown>[]).map((c, i) =>
      normalizeCarreraData({ ...c, pagina: c.pagina ?? i + 1 }),
    );

    const reunionInfo =
      data.reunion_info && typeof data.reunion_info === 'object'
        ? (data.reunion_info as Record<string, unknown>)
        : extractReunionInfoFromCarrera(carreras[0] ?? {});

    return {
      formato_detectado: String(data.formato_detectado ?? 'rinconada'),
      multipagina: carreras.length > 1,
      total_paginas: Number(data.total_paginas ?? carreras.length),
      reunion_info: reunionInfo,
      carreras,
      advertencias: advertencias.length ? advertencias : undefined,
    };
  }

  const single = normalizeCarreraData({ ...data });
  return {
    formato_detectado: String(single.formato_detectado ?? 'rinconada'),
    multipagina: false,
    total_paginas: 1,
    reunion_info: extractReunionInfoFromCarrera(single),
    carreras: [{ ...single, pagina: 1 }],
    advertencias: advertencias.length ? advertencias : undefined,
  };
}

export function mergeCarreraParaFormulario(payload: PayloadExtraido, index: number) {
  const carrera = payload.carreras[index] ?? {};
  const info = (carrera.informacion_general as Record<string, unknown>) ?? {};
  return {
    ...carrera,
    formato_detectado: payload.formato_detectado,
    informacion_general: { ...payload.reunion_info, ...info },
  };
}

/** Procesa una sola página de un PDF multipágina. */
export async function extraerPaginaCarrera(
  fullBuffer: Buffer,
  pageIndex: number,
  totalPaginas: number,
  apiKey: string,
): Promise<CarreraExtraida> {
  const pageBuffer = await extraerPaginaPdfBuffer(fullBuffer, pageIndex);
  const ai = new GoogleGenAI({ apiKey });
  const model = getModel();
  const pagina = pageIndex + 1;

  const contents = [
    { text: PAGE_PROMPT },
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: pageBuffer.toString('base64'),
      },
    },
    {
      text: `Página ${pagina} de ${totalPaginas}. Extrae SOLO esta carrera. Incluye premios y todos los ejemplares visibles.`,
    },
  ];

  const raw = await callGeminiWithRetry(ai, contents, model, SINGLE_PAGE_SCHEMA);
  const { data } = parseJsonResponse(raw);
  const normalized = normalizeCarreraData(data as Record<string, unknown>);

  return {
    ...normalized,
    pagina,
    informacion_general: normalized.informacion_general ?? {},
  };
}

/** PDF/imagen de 1 sola carrera. */
export async function extraerDocumentoUnico(
  fileBuffer: Buffer,
  mimeType: string,
  apiKey: string,
): Promise<PayloadExtraido> {
  const ai = new GoogleGenAI({ apiKey });
  const model = getModel();

  const contents = [
    { text: PAGE_PROMPT },
    {
      inlineData: {
        mimeType,
        data: fileBuffer.toString('base64'),
      },
    },
    { text: 'Extrae la carrera. Incluye premios (Premio Bs, %, Bono $) y ejemplares.' },
  ];

  const raw = await callGeminiWithRetry(ai, contents, model, SINGLE_PAGE_SCHEMA);
  const { data, advertencias } = parseJsonResponse(raw);
  return normalizeExtractedPayload(data as Record<string, unknown>, advertencias);
}

/** Detecta páginas; si ≥2, el cliente debe pedir página a página. */
export async function extraerDatosCarrera(
  fileBuffer: Buffer,
  mimeType: string,
  apiKey: string,
  pagina?: number,
): Promise<PayloadExtraido | { needsPagination: true; totalPaginas: number }> {
  if (mimeType === 'application/pdf') {
    const totalPaginas = await contarPaginasPdf(fileBuffer);

    if (totalPaginas >= UMBRAL_PAGINAS_POR_PAGINA) {
      if (!pagina) {
        return { needsPagination: true, totalPaginas };
      }

      if (pagina < 1 || pagina > totalPaginas) {
        throw new GeminiApiError(`Página ${pagina} fuera de rango (1-${totalPaginas}).`, 400);
      }

      const carrera = await extraerPaginaCarrera(fileBuffer, pagina - 1, totalPaginas, apiKey);
      return {
        formato_detectado: String(carrera.formato_detectado ?? 'rinconada'),
        multipagina: true,
        total_paginas: totalPaginas,
        reunion_info: extractReunionInfoFromCarrera(carrera),
        carreras: [carrera],
      };
    }
  }

  return extraerDocumentoUnico(fileBuffer, mimeType, apiKey);
}

export const MIME_TYPES_PERMITIDOS = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export type MimeTypePermitido = (typeof MIME_TYPES_PERMITIDOS)[number];

export function esMimeTypePermitido(mimeType: string): mimeType is MimeTypePermitido {
  return (MIME_TYPES_PERMITIDOS as readonly string[]).includes(mimeType);
}
