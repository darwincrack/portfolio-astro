/**
 * Informe semanal de darwincd.com: Search Console + Google Analytics.
 *
 * Calcula las cifras de forma exacta, le pide a Gemini el análisis
 * (qué mejoró, qué empeoró y en qué trabajar) y lo envía por correo.
 *
 * Variables de entorno:
 *   GOOGLE_SA_JSON | GOOGLE_APPLICATION_CREDENTIALS  cuenta de servicio (contenido o ruta)
 *   GEMINI_API_KEY                                   opcional: sin ella el informe va sin análisis
 *   GMAIL_USER, GMAIL_APP_PASSWORD, REPORT_TO        envío por Gmail
 *
 * Uso: node report.mjs [--dry-run]   (--dry-run guarda informe.html y no envía)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAuth } from 'google-auth-library';
import nodemailer from 'nodemailer';

const SITE = 'sc-domain:darwincd.com';
const GA_PROPERTY = '285655002';
const MODEL = process.env.REPORT_MODEL || 'gemini-3.8-flash';
// Fuentes de tráfico basura detectadas (bots de referencia)
const SPAM_SOURCES = ['aocr.org', 'gipkd.com'];
const DRY_RUN = process.argv.includes('--dry-run');

// Artículos que existen hoy (el script corre dentro del repo). Las URLs del blog
// que no están aquí son de los artículos borrados: Google tarda en olvidarlas.
const BLOG_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../src/content/blog');
const POSTS = new Set(fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)));
function isObsoletePage(url) {
  const p = url.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '');
  const blog = p.match(/^\/blog\/(.+)$/);
  return (blog && !POSTS.has(blog[1])) || /^\/testpdf/.test(p);
}

// ---------------------------------------------------------------------------
// Fechas: Search Console va ~3 días atrasado; Analytics, 1 día
// ---------------------------------------------------------------------------

const day = (offset) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
};
const RANGES = {
  gsc: { cur: [day(9), day(3)], prev: [day(16), day(10)] },
  ga: { cur: [day(7), day(1)], prev: [day(14), day(8)] },
};

// ---------------------------------------------------------------------------
// Acceso a las APIs con la cuenta de servicio (solo lectura)
// ---------------------------------------------------------------------------

function credentials() {
  if (process.env.GOOGLE_SA_JSON) return { credentials: JSON.parse(process.env.GOOGLE_SA_JSON) };
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return { keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS };
  throw new Error('Falta GOOGLE_SA_JSON o GOOGLE_APPLICATION_CREDENTIALS');
}

const auth = new GoogleAuth({
  ...credentials(),
  scopes: [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly',
  ],
});

async function post(url, body) {
  const client = await auth.getClient();
  const res = await client.request({ url, method: 'POST', data: body });
  return res.data;
}

const gsc = (range, dimensions, rowLimit = 250) =>
  post(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    startDate: range[0], endDate: range[1], dimensions, rowLimit,
  }).then((d) => d.rows ?? []);

const ga = (range, dimensions, metrics, dimensionFilter) =>
  post(`https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY}:runReport`, {
    dateRanges: [{ startDate: range[0], endDate: range[1] }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    ...(dimensionFilter ? { dimensionFilter } : {}),
    limit: 250,
  }).then((d) => (d.rows ?? []).map((r) => ({
    dims: r.dimensionValues.map((v) => v.value),
    vals: r.metricValues.map((v) => Number(v.value)),
  })));

const notSpam = {
  notExpression: { filter: { fieldName: 'sessionSource', inListFilter: { values: SPAM_SOURCES } } },
};

// ---------------------------------------------------------------------------
// Cálculos
// ---------------------------------------------------------------------------

const sum = (rows, key) => rows.reduce((s, r) => s + r[key], 0);
const pct = (a, b) => (b === 0 ? (a === 0 ? 0 : null) : Math.round(((a - b) / b) * 100));
const avgPosition = (rows) => {
  const imp = sum(rows, 'impressions');
  return imp ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / imp : null;
};

function compareQueries(cur, prev, obsolete) {
  const p = new Map(prev.map((r) => [r.keys[0], r]));
  const c = new Map(cur.map((r) => [r.keys[0], r]));
  const rows = [...new Set([...c.keys(), ...p.keys()])].filter((q) => !obsolete.has(q)).map((q) => {
    const a = c.get(q), b = p.get(q);
    return {
      query: q,
      clicks: a?.clicks ?? 0, clicksPrev: b?.clicks ?? 0,
      impressions: a?.impressions ?? 0, impressionsPrev: b?.impressions ?? 0,
      position: a ? +a.position.toFixed(1) : null, positionPrev: b ? +b.position.toFixed(1) : null,
    };
  });
  const moved = rows.filter((r) => r.position && r.positionPrev && r.impressions + r.impressionsPrev >= 3);
  return {
    top: rows.filter((r) => r.impressions).sort((x, y) => y.clicks - x.clicks || y.impressions - x.impressions).slice(0, 15),
    nuevas: rows.filter((r) => r.impressions && !r.impressionsPrev).sort((x, y) => y.impressions - x.impressions).slice(0, 10),
    perdidas: rows.filter((r) => !r.impressions && r.impressionsPrev >= 3).sort((x, y) => y.impressionsPrev - x.impressionsPrev).slice(0, 10),
    suben: moved.filter((r) => r.position < r.positionPrev - 2).sort((x, y) => (x.position - x.positionPrev) - (y.position - y.positionPrev)).slice(0, 8),
    bajan: moved.filter((r) => r.position > r.positionPrev + 2).sort((x, y) => (y.position - y.positionPrev) - (x.position - x.positionPrev)).slice(0, 8),
    // Casi en la primera página: muchas impresiones, posición 8-20
    oportunidades: rows.filter((r) => r.position >= 8 && r.position <= 20 && r.impressions >= 3).sort((x, y) => y.impressions - x.impressions).slice(0, 8),
  };
}

async function collect() {
  const { gsc: G, ga: A } = RANGES;
  const [gTotCur, gTotPrev, qCur, qPrev, pCur, qpCur, qpPrev] = await Promise.all([
    gsc(G.cur, ['date']), gsc(G.prev, ['date']),
    gsc(G.cur, ['query'], 500), gsc(G.prev, ['query'], 500),
    gsc(G.cur, ['page'], 100),
    gsc(G.cur, ['query', 'page'], 1000), gsc(G.prev, ['query', 'page'], 1000),
  ]);

  // Búsquedas que solo llevan a páginas borradas: se cuentan aparte
  const pagesByQuery = new Map();
  for (const r of [...qpCur, ...qpPrev]) {
    const [q, page] = r.keys;
    if (!pagesByQuery.has(q)) pagesByQuery.set(q, []);
    pagesByQuery.get(q).push(page);
  }
  const obsolete = new Set([...pagesByQuery].filter(([, pages]) => pages.every(isObsoletePage)).map(([q]) => q));
  const obsoleteImpressions = (rows) => rows.filter((r) => obsolete.has(r.keys[0])).reduce((s, r) => s + r.impressions, 0);

  const searchTotals = (rows) => ({
    clicks: sum(rows, 'clicks'),
    impressions: sum(rows, 'impressions'),
    position: avgPosition(rows) && +avgPosition(rows).toFixed(1),
  });

  const sessionMetrics = ['sessions', 'engagedSessions', 'activeUsers'];
  const eventFilter = (names) => ({ filter: { fieldName: 'eventName', inListFilter: { values: names } } });
  const CHAT_EVENTS = ['chat_open', 'chat_message', 'chat_handoff_offer', 'chat_booking_offer', 'chat_calendar_open'];

  const [chCur, chPrev, spamCur, contactsCur, contactsPrev, chatCur, chatPrev, landing] = await Promise.all([
    ga(A.cur, ['sessionDefaultChannelGroup'], sessionMetrics, notSpam),
    ga(A.prev, ['sessionDefaultChannelGroup'], sessionMetrics, notSpam),
    ga(A.cur, ['sessionSource'], ['sessions'], { filter: { fieldName: 'sessionSource', inListFilter: { values: SPAM_SOURCES } } }),
    ga(A.cur, ['customEvent:channel'], ['eventCount'], eventFilter(['contact_click'])),
    ga(A.prev, ['customEvent:channel'], ['eventCount'], eventFilter(['contact_click'])),
    ga(A.cur, ['eventName'], ['eventCount'], eventFilter(CHAT_EVENTS)),
    ga(A.prev, ['eventName'], ['eventCount'], eventFilter(CHAT_EVENTS)),
    ga(A.cur, ['landingPage', 'sessionDefaultChannelGroup'], ['sessions', 'engagedSessions', 'keyEvents'], notSpam),
  ]);

  const channels = (rows) => Object.fromEntries(rows.map((r) => [r.dims[0], { sesiones: r.vals[0], conInteraccion: r.vals[1], usuarios: r.vals[2] }]));
  const byName = (rows) => Object.fromEntries(rows.map((r) => [r.dims[0], r.vals[0]]));
  const total = (rows, i) => rows.reduce((s, r) => s + r.vals[i], 0);

  return {
    periodos: {
      searchConsole: { actual: G.cur.join(' a '), anterior: G.prev.join(' a ') },
      analytics: { actual: A.cur.join(' a '), anterior: A.prev.join(' a ') },
    },
    google: {
      actual: searchTotals(gTotCur),
      anterior: searchTotals(gTotPrev),
      consultas: compareQueries(qCur, qPrev, obsolete),
      impresionesDeArticulosBorrados: { actual: obsoleteImpressions(qCur), anterior: obsoleteImpressions(qPrev) },
      paginas: pCur.filter((r) => !isObsoletePage(r.keys[0])).slice(0, 12).map((r) => ({
        pagina: r.keys[0].replace('https://darwincd.com', '') || '/',
        clics: r.clicks, impresiones: r.impressions, posicion: +r.position.toFixed(1),
      })),
    },
    visitas: {
      sesiones: { actual: total(chCur, 0), anterior: total(chPrev, 0) },
      conInteraccion: { actual: total(chCur, 1), anterior: total(chPrev, 1) },
      porCanal: { actual: channels(chCur), anterior: channels(chPrev) },
      spamDescartado: total(spamCur, 0),
      paginasDeEntradaDesdeGoogle: landing
        .filter((r) => r.dims[1] === 'Organic Search')
        .sort((a, b) => b.vals[0] - a.vals[0]).slice(0, 10)
        .map((r) => ({ pagina: r.dims[0], sesiones: r.vals[0], conInteraccion: r.vals[1], contactos: r.vals[2] })),
    },
    contactos: {
      actual: { total: total(contactsCur, 0), porCanal: byName(contactsCur) },
      anterior: { total: total(contactsPrev, 0), porCanal: byName(contactsPrev) },
    },
    asistente: { actual: byName(chatCur), anterior: byName(chatPrev) },
  };
}

// ---------------------------------------------------------------------------
// Análisis con Gemini
// ---------------------------------------------------------------------------

const PROMPT = `Eres un consultor de SEO y captación de clientes. Analiza los datos semanales de darwincd.com, la web de Darwin Cedeño, desarrollador freelance en Venezuela que hace webs, sistemas, tiendas con Pago Móvil, apps y asistentes con IA. Su objetivo es conseguir clientes: lo que más importa son los contactos (contact_click, por canal: whatsapp, form, calendly, chat, calendly_chat) y las búsquedas de gente que quiere contratar (p. ej. "desarrollo web caracas", "páginas web venezuela"), no el tráfico en sí.

Contexto: el 29 de octubre de 2026 se publicó una web nueva, se borraron 187 artículos automáticos sobre IA (redirigen al blog; sus búsquedas irán desapareciendo y eso es esperado) y se añadieron páginas para Caracas y Venezuela. Los números son pequeños: no saques conclusiones fuertes de 1 o 2 clics, dilo cuando algo no sea significativo. El spam de referencia ya está descontado.
Del 29 al 31 de octubre de 2026 se probó la web a mano: las visitas directas y los contactos de esos días son pruebas, no clientes. Si el periodo anterior incluye esas fechas, no lo trates como una caída real.
Las búsquedas que solo llevan a artículos borrados ya están quitadas de las listas; "impresionesDeArticulosBorrados" indica cuánto queda de ellas y es normal que baje.
El usuario solo puede editar su web y sus perfiles: no recomiendes cosas fuera de su alcance.
Búsquedas como "meridiano.net", "portal meridiano" o "poligono valencia" vienen de sus casos de éxito publicados en la web: son buenas, no basura.

Escribe en español, tuteando a Darwin, en HTML simple (solo <h3>, <p>, <ul>, <li>, <strong>), sin tablas, con estas secciones:
<h3>Resumen</h3> 2-3 frases: ¿la semana fue mejor, igual o peor, y por qué?
<h3>Qué mejoró</h3>
<h3>Qué empeoró o hay que vigilar</h3>
<h3>En qué trabajar esta semana</h3> 2 a 4 acciones concretas y priorizadas (por ejemplo: una página o artículo para una búsqueda en posición 8-20, mejorar el título de una página con impresiones y sin clics). Nada genérico.
Usa solo los datos dados; no inventes cifras.`;

async function analyze(data) {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: JSON.stringify(data) }] }],
        // El razonamiento también consume tokens: margen amplio para que no se corte
        generationConfig: { temperature: 0.3, maxOutputTokens: 12000, thinkingConfig: { thinkingLevel: 'low' } },
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || res.status);
    if (json.candidates?.[0]?.finishReason === 'MAX_TOKENS') console.warn('Aviso: el análisis llegó al límite de longitud');
    const text = (json.candidates?.[0]?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text).join('');
    return text.replace(/^```html\s*|\s*```$/g, '').trim() || null;
  } catch (error) {
    console.error('Gemini no respondió:', error.message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Correo
// ---------------------------------------------------------------------------

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function delta(cur, prev, { lowerIsBetter = false } = {}) {
  if (cur == null || prev == null) return '';
  const diff = +(cur - prev).toFixed(1);
  if (diff === 0) return '<span style="color:#64748b">=</span>';
  const good = lowerIsBetter ? diff < 0 : diff > 0;
  const p = pct(cur, prev);
  return `<span style="color:${good ? '#15803d' : '#b91c1c'}">${diff > 0 ? '▲' : '▼'} ${Math.abs(diff)}${p != null && !lowerIsBetter ? ` (${p > 0 ? '+' : ''}${p}%)` : ''}</span>`;
}

function kpi(label, cur, prev, opts) {
  return `<td style="padding:10px 14px;border:1px solid #e2e8f0">
    <div style="font-size:12px;color:#64748b">${label}</div>
    <div style="font-size:22px;font-weight:700">${cur ?? '—'}</div>
    <div style="font-size:12px">${delta(cur, prev, opts)} <span style="color:#94a3b8">vs ${prev ?? '—'}</span></div></td>`;
}

function table(title, rows, cols) {
  if (!rows.length) return '';
  return `<h4 style="margin:22px 0 6px">${title}</h4>
  <table style="border-collapse:collapse;width:100%;font-size:13px">
    <tr>${cols.map(([h]) => `<th style="text-align:left;padding:5px 8px;background:#f1f5f9;border:1px solid #e2e8f0">${h}</th>`).join('')}</tr>
    ${rows.map((r) => `<tr>${cols.map(([, f]) => `<td style="padding:5px 8px;border:1px solid #e2e8f0">${esc(f(r))}</td>`).join('')}</tr>`).join('')}
  </table>`;
}

const pos = (r) => `${r.positionPrev ?? '—'} → ${r.position ?? '—'}`;

function buildHtml(d, analysis) {
  const g = d.google, v = d.visitas, c = d.contactos;
  const chat = (k) => d.asistente.actual[k] ?? 0;
  const channels = Object.entries(c.actual.porCanal).map(([k, n]) => `${k}: ${n}`).join(' · ') || 'ninguno';
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Segoe UI,Arial,sans-serif;color:#0f172a">
  <div style="max-width:720px;margin:0 auto;padding:24px;background:#fff">
    <h2 style="margin:0">Informe semanal · darwincd.com</h2>
    <p style="margin:4px 0 18px;color:#64748b;font-size:13px">Google: ${d.periodos.searchConsole.actual} (vs ${d.periodos.searchConsole.anterior}) · Visitas: ${d.periodos.analytics.actual} (vs ${d.periodos.analytics.anterior})</p>

    <table style="border-collapse:collapse;width:100%"><tr>
      ${kpi('Contactos', c.actual.total, c.anterior.total)}
      ${kpi('Clics desde Google', g.actual.clicks, g.anterior.clicks)}
      ${kpi('Impresiones en Google', g.actual.impressions, g.anterior.impressions)}
    </tr><tr>
      ${kpi('Posición media', g.actual.position, g.anterior.position, { lowerIsBetter: true })}
      ${kpi('Visitas reales', v.sesiones.actual, v.sesiones.anterior)}
      ${kpi('Visitas con interacción', v.conInteraccion.actual, v.conInteraccion.anterior)}
    </tr></table>
    <p style="font-size:13px;color:#475569">Contactos por canal: ${esc(channels)} · Asistente: ${chat('chat_open')} aperturas, ${chat('chat_message')} mensajes, ${chat('chat_handoff_offer')} pases a WhatsApp ofrecidos, ${chat('chat_calendar_open')} agendas abiertas. Spam descartado: ${v.spamDescartado} visitas. Impresiones de artículos borrados (fuera de las tablas): ${g.impresionesDeArticulosBorrados.actual}, antes ${g.impresionesDeArticulosBorrados.anterior}.</p>

    <div style="margin-top:18px;padding:4px 18px;border-left:4px solid #1d4ed8;background:#eff6ff">${analysis || '<p><em>El análisis automático no estuvo disponible esta semana; las cifras de abajo sí son correctas.</em></p>'}</div>

    ${table('Búsquedas principales', g.consultas.top, [['Búsqueda', (r) => r.query], ['Clics', (r) => r.clicks], ['Impresiones', (r) => `${r.impressions} (antes ${r.impressionsPrev})`], ['Posición', pos]])}
    ${table('Búsquedas nuevas', g.consultas.nuevas, [['Búsqueda', (r) => r.query], ['Impresiones', (r) => r.impressions], ['Posición', (r) => r.position]])}
    ${table('Suben en Google', g.consultas.suben, [['Búsqueda', (r) => r.query], ['Posición', pos], ['Impresiones', (r) => r.impressions]])}
    ${table('Bajan en Google', g.consultas.bajan, [['Búsqueda', (r) => r.query], ['Posición', pos], ['Impresiones', (r) => r.impressions]])}
    ${table('Oportunidades (posición 8-20)', g.consultas.oportunidades, [['Búsqueda', (r) => r.query], ['Posición', (r) => r.position], ['Impresiones', (r) => r.impressions]])}
    ${table('Páginas en Google', g.paginas, [['Página', (r) => r.pagina], ['Clics', (r) => r.clics], ['Impresiones', (r) => r.impresiones], ['Posición', (r) => r.posicion]])}
    ${table('Por dónde entran desde Google', v.paginasDeEntradaDesdeGoogle, [['Página', (r) => r.pagina], ['Visitas', (r) => r.sesiones], ['Con interacción', (r) => r.conInteraccion], ['Contactos', (r) => r.contactos]])}

    <p style="margin-top:24px;font-size:12px;color:#94a3b8">Generado automáticamente cada lunes. Search Console va unos 3 días atrasado, por eso sus fechas no coinciden con las de Analytics.</p>
  </div></body></html>`;
}

async function send(html, subject) {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, REPORT_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !REPORT_TO) throw new Error('Faltan GMAIL_USER, GMAIL_APP_PASSWORD o REPORT_TO');
  const transport = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
  await transport.sendMail({ from: `Informe darwincd.com <${GMAIL_USER}>`, to: REPORT_TO, subject, html });
}

// ---------------------------------------------------------------------------

const data = await collect();
const analysis = await analyze(data);
const html = buildHtml(data, analysis);
const c = data.contactos;
const subject = `Informe semanal darwincd.com · ${c.actual.total} contactos · ${data.google.actual.clicks} clics desde Google`;

if (DRY_RUN) {
  fs.writeFileSync('informe.html', html);
  fs.writeFileSync('datos.json', JSON.stringify(data, null, 2));
  console.log(`Guardado informe.html (${analysis ? 'con' : 'sin'} análisis). Asunto: ${subject}`);
} else {
  await send(html, subject);
  console.log(`Enviado a ${process.env.REPORT_TO}: ${subject}`);
}
