/**
 * Revisión básica de una web: lo que toda web debería tener y que las webs
 * hechas con IA o con constructores suelen olvidar.
 *
 * Descarga la página de forma segura (sin redes privadas, con límites de
 * tiempo y tamaño) y evalúa el HTML. La velocidad se mide aparte con PageSpeed.
 */
import dns from 'node:dns/promises';
import net from 'node:net';

export type Status = 'ok' | 'warn' | 'fail';
export type Check = {
  id: string;
  group: 'google' | 'compartir' | 'movil' | 'contacto' | 'tecnico';
  title: string;
  status: Status;
  detail: string;
  fix?: string;
  weight: number;
};
export type AuditResult = {
  url: string;
  finalUrl: string;
  builder: string | null;
  score: number;
  checks: Check[];
};

export class AuditError extends Error {}

const MAX_BYTES = 2_500_000;
const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 4;
// Navegador normal + identificación de la herramienta: algunas webs bloquean agentes desconocidos
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 RevisorWeb/1.0 (+https://darwincd.com/revisa-tu-web/)';

// ---------------------------------------------------------------------------
// Descarga segura
// ---------------------------------------------------------------------------

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith('::ffff:')) return isPrivateIp(v6.slice(7));
  return v6 === '::' || v6 === '::1' || v6.startsWith('fc') || v6.startsWith('fd') || v6.startsWith('fe80');
}

async function assertPublicHost(url: URL) {
  if (!['http:', 'https:'].includes(url.protocol)) throw new AuditError('La dirección debe empezar por http o https.');
  if (url.port && !['80', '443'].includes(url.port)) throw new AuditError('Solo se pueden revisar webs en los puertos normales.');
  if (url.username || url.password) throw new AuditError('La dirección no puede llevar usuario ni contraseña.');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || !host.includes('.')) {
    throw new AuditError('Esa dirección no es una web pública.');
  }
  let addresses: { address: string }[];
  try {
    addresses = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
  } catch {
    throw new AuditError('No encontré esa web. Revisa que la dirección esté bien escrita.');
  }
  if (!addresses.length || addresses.some((a) => isPrivateIp(a.address))) {
    throw new AuditError('Esa dirección no es una web pública.');
  }
}

type Fetched = { url: URL; status: number; headers: Headers; body: string; redirects: URL[] };

async function readLimited(res: Response): Promise<string> {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BYTES) {
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
}

/** Sigue las redirecciones a mano para revisar cada salto. */
export async function safeFetch(start: URL, { method = 'GET', readBody = true } = {}): Promise<Fetched> {
  let url = start;
  const redirects: URL[] = [];
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicHost(url);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, {
        method,
        redirect: 'manual',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'Accept-Language': 'es,en;q=0.8' },
      });
    } catch {
      clearTimeout(timer);
      throw new AuditError('La web no respondió a tiempo. Puede estar caída o bloquear revisiones automáticas.');
    }
    const location = res.headers.get('location');
    if (res.status >= 300 && res.status < 400 && location) {
      clearTimeout(timer);
      redirects.push(url);
      url = new URL(location, url);
      continue;
    }
    const body = readBody ? await readLimited(res).finally(() => clearTimeout(timer)) : '';
    clearTimeout(timer);
    return { url, status: res.status, headers: res.headers, body, redirects };
  }
  throw new AuditError('La web redirige demasiadas veces.');
}

async function exists(url: URL): Promise<{ ok: boolean; body: string }> {
  try {
    const r = await safeFetch(url);
    return { ok: r.status >= 200 && r.status < 300, body: r.body.slice(0, 50_000) };
  } catch {
    return { ok: false, body: '' };
  }
}

// ---------------------------------------------------------------------------
// Lectura del HTML (sin dependencias: expresiones sencillas)
// ---------------------------------------------------------------------------

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

function tags(html: string, name: string): string[] {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
}

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? '') : null;
}

function meta(html: string, key: string): string | null {
  for (const t of tags(html, 'meta')) {
    const k = (attr(t, 'name') ?? attr(t, 'property') ?? '').toLowerCase();
    if (k === key) return attr(t, 'content');
  }
  return null;
}

function links(html: string, rel: string): string[] {
  return tags(html, 'link')
    .filter((t) => (attr(t, 'rel') ?? '').toLowerCase().split(/\s+/).includes(rel))
    .map((t) => attr(t, 'href') ?? '');
}

function visibleText(html: string): string {
  return decode(
    html
      .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  );
}

function detectBuilder(html: string, headers: Headers): string | null {
  const h = html.slice(0, 200_000).toLowerCase();
  const gen = (meta(html, 'generator') ?? '').toLowerCase();
  if (h.includes('lovable') || h.includes('gpt-engineer')) return 'Lovable';
  if (h.includes('bolt.new') || h.includes('stackblitz')) return 'Bolt';
  if (h.includes('v0.dev') || h.includes('v0.app')) return 'v0';
  if (gen.includes('wix') || h.includes('static.wixstatic.com')) return 'Wix';
  if (h.includes('framerusercontent.com') || gen.includes('framer')) return 'Framer';
  if (h.includes('webflow')) return 'Webflow';
  if (gen.includes('wordpress') || h.includes('/wp-content/')) return 'WordPress';
  if (h.includes('cdn.shopify.com')) return 'Shopify';
  if (h.includes('squarespace')) return 'Squarespace';
  if (h.includes('hostinger') && h.includes('builder')) return 'Hostinger';
  if ((headers.get('x-powered-by') ?? '').toLowerCase().includes('next')) return null;
  return null;
}

// ---------------------------------------------------------------------------
// Revisión
// ---------------------------------------------------------------------------

export function normalizeUrl(input: string): URL {
  const raw = input.trim();
  if (!raw || raw.length > 300) throw new AuditError('Escribe la dirección de tu web.');
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new AuditError('Esa dirección no parece válida. Ejemplo: minegocio.com');
  }
}

export async function auditSite(input: string): Promise<AuditResult> {
  const start = normalizeUrl(input);
  const page = await safeFetch(start);
  if ([401, 403, 429, 503].includes(page.status)) {
    throw new AuditError('La web bloqueó la revisión automática (tiene una protección contra robots). No es un fallo tuyo: prueba desde pagespeed.web.dev o escríbeme y la reviso a mano.');
  }
  if (page.status === 404) throw new AuditError('Esa página no existe (error 404). Revisa que la dirección esté bien escrita.');
  if (page.status >= 400) throw new AuditError(`La web respondió con un error (${page.status}). Puede estar caída en este momento.`);
  const ctype = page.headers.get('content-type') ?? '';
  if (!ctype.includes('html')) throw new AuditError('Esa dirección no es una página web (no devuelve HTML).');

  const html = page.body;
  const finalUrl = page.url;
  const origin = new URL('/', finalUrl);
  const head = html.match(/<head\b[\s\S]*?<\/head>/i)?.[0] ?? html.slice(0, 60_000);

  // Comprobaciones que requieren otras peticiones, en paralelo
  const httpUrl = new URL(finalUrl.href);
  httpUrl.protocol = 'http:';
  const [robots, sitemap, faviconIco, httpVersion] = await Promise.all([
    exists(new URL('/robots.txt', origin)),
    exists(new URL('/sitemap.xml', origin)),
    exists(new URL('/favicon.ico', origin)),
    finalUrl.protocol === 'https:' ? safeFetch(httpUrl, { readBody: false }).catch(() => null) : Promise.resolve(null),
  ]);

  const checks: Check[] = [];
  const add = (c: Check) => checks.push(c);

  // --- Google -------------------------------------------------------------
  const title = decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  add({
    id: 'title', group: 'google', weight: 10,
    title: 'Título de la página',
    ...(!title
      ? { status: 'fail', detail: 'La página no tiene título. Es lo primero que se ve en los resultados de Google y en la pestaña del navegador.', fix: 'Añade un título que diga qué haces y dónde, por ejemplo "Panadería artesanal en Valencia | Nombre".' }
      : title.length < 15 || title.length > 70
        ? { status: 'warn', detail: `El título tiene ${title.length} caracteres: «${title.slice(0, 80)}». Lo ideal es entre 30 y 65.`, fix: 'Ajusta el largo para que Google no lo corte y diga qué haces y dónde.' }
        : { status: 'ok', detail: `«${title}»` }),
  });

  const description = meta(head, 'description');
  add({
    id: 'description', group: 'google', weight: 10,
    title: 'Descripción para Google (meta description)',
    ...(!description
      ? { status: 'fail', detail: 'No tiene descripción. Google mostrará un trozo de texto cualquiera de la página bajo tu título.', fix: 'Añade una descripción de 1 o 2 frases (unos 120-155 caracteres) que invite a entrar.' }
      : description.length < 50 || description.length > 170
        ? { status: 'warn', detail: `La descripción tiene ${description.length} caracteres. Lo ideal es entre 70 y 160.`, fix: 'Ajústala para que se lea completa en Google.' }
        : { status: 'ok', detail: `«${description}»` }),
  });

  const robotsMeta = `${meta(head, 'robots') ?? ''} ${page.headers.get('x-robots-tag') ?? ''}`.toLowerCase();
  add({
    id: 'noindex', group: 'google', weight: 15,
    title: 'Google puede mostrar la web',
    ...(robotsMeta.includes('noindex')
      ? { status: 'fail', detail: 'La web le pide a Google que NO la muestre en los resultados (noindex). Es habitual que quede así desde la fase de pruebas.', fix: 'Quita la indicación "noindex" de la página o del servidor.' }
      : { status: 'ok', detail: 'La web no le prohíbe a Google mostrarla.' }),
  });

  const text = visibleText(html.replace(/<head\b[\s\S]*?<\/head>/i, ''));
  const words = text.split(' ').filter((w) => w.length > 1).length;
  // Aplicación que pinta el contenido en el navegador: contenedor vacío o muchos scripts y casi nada de texto
  const emptyAppRoot = /<div[^>]+id=["'](root|app|__next|___gatsby|svelte)["'][^>]*>\s*<\/div>/i.test(html);
  const scriptCount = (html.match(/<script\b/gi) ?? []).length;
  const builtWithJs = emptyAppRoot || (scriptCount >= 3 && words < 40);
  const wordsLabel = `${words} ${words === 1 ? 'palabra' : 'palabras'}`;
  add({
    id: 'content', group: 'google', weight: 12,
    title: 'Google puede leer el contenido',
    ...(words < 60 && builtWithJs
      ? { status: 'fail', detail: `Al descargar la página solo hay ${wordsLabel}: el contenido se arma con JavaScript en el navegador. Muchas webs hechas con IA funcionan así, y a Google le cuesta más leerlas y posicionarlas.`, fix: 'Usa renderizado en el servidor o generación estática (por ejemplo, Astro o Next.js con SSR) para que el texto venga en el HTML.' }
      : words < 60
        ? { status: 'fail', detail: `La página tiene muy poco texto (${wordsLabel}). Con tan poco, Google no sabe qué ofreces ni para qué búsquedas mostrarte.`, fix: 'Explica tus servicios, tu zona y tus preguntas frecuentes con texto real.' }
      : words < 200
        ? { status: 'warn', detail: `La página tiene poco texto (${words} palabras). Google necesita algo de contenido para entender qué ofreces.`, fix: 'Explica tus servicios, tu zona y tus preguntas frecuentes con texto real.' }
        : { status: 'ok', detail: `Google ve ${words} palabras de contenido en la página.` }),
  });

  const h1s = (html.match(/<h1\b[\s\S]*?<\/h1>/gi) ?? []).map((h) => visibleText(h)).filter(Boolean);
  add({
    id: 'h1', group: 'google', weight: 6,
    title: 'Encabezado principal (H1)',
    ...(h1s.length === 0
      ? { status: 'fail', detail: 'No tiene un encabezado principal (H1). Es la señal más clara de qué trata la página.', fix: 'Pon un único H1 con lo que haces, por ejemplo "Diseño de interiores en Caracas".' }
      : h1s.length > 1
        ? { status: 'warn', detail: `Tiene ${h1s.length} encabezados principales. Lo normal es uno por página.`, fix: 'Deja un solo H1 y convierte los demás en H2.' }
        : { status: 'ok', detail: `«${h1s[0].slice(0, 90)}»` }),
  });

  const imgs = tags(html, 'img');
  const noAlt = imgs.filter((t) => attr(t, 'alt') === null).length;
  if (imgs.length) {
    add({
      id: 'alt', group: 'google', weight: 4,
      title: 'Texto alternativo en las imágenes',
      ...(noAlt / imgs.length > 0.3
        ? { status: 'warn', detail: `${noAlt} de ${imgs.length} imágenes no tienen texto alternativo. Google no puede saber qué muestran.`, fix: 'Describe cada imagen en su atributo alt.' }
        : { status: 'ok', detail: `${imgs.length - noAlt} de ${imgs.length} imágenes tienen texto alternativo.` }),
    });
  }

  const robotsBlocksAll = /user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*(\n|$)/i.test(robots.body);
  add({
    id: 'robots', group: 'google', weight: 4,
    title: 'Archivo robots.txt',
    ...(robotsBlocksAll
      ? { status: 'fail', detail: 'El robots.txt bloquea toda la web a los buscadores (Disallow: /).', fix: 'Cambia la regla para permitir el acceso, salvo a las zonas privadas.' }
      : robots.ok
        ? { status: 'ok', detail: 'Tiene robots.txt.' }
        : { status: 'warn', detail: 'No tiene robots.txt. No es grave, pero ayuda a indicarle a Google qué revisar y dónde está el mapa del sitio.', fix: 'Crea /robots.txt con la dirección de tu sitemap.' }),
  });

  const sitemapInRobots = /sitemap:/i.test(robots.body);
  add({
    id: 'sitemap', group: 'google', weight: 4,
    title: 'Mapa del sitio (sitemap)',
    ...(sitemap.ok || sitemapInRobots
      ? { status: 'ok', detail: 'Tiene mapa del sitio para que Google encuentre todas las páginas.' }
      : { status: 'warn', detail: 'No encontré un mapa del sitio. Google puede tardar más en descubrir tus páginas.', fix: 'Genera /sitemap.xml y envíalo en Google Search Console.' }),
  });

  const canonical = links(head, 'canonical')[0];
  add({
    id: 'canonical', group: 'google', weight: 3,
    title: 'Dirección oficial (canonical)',
    ...(canonical
      ? { status: 'ok', detail: 'Indica cuál es su dirección oficial y evita contenido duplicado.' }
      : { status: 'warn', detail: 'No indica su dirección oficial (canonical). Si la página se abre con varias direcciones, Google puede verlas como duplicadas.', fix: 'Añade <link rel="canonical"> con la dirección principal de cada página.' }),
  });

  const jsonLd = /<script[^>]+application\/ld\+json/i.test(html);
  add({
    id: 'schema', group: 'google', weight: 3,
    title: 'Datos estructurados para Google',
    ...(jsonLd
      ? { status: 'ok', detail: 'Tiene datos estructurados (schema), que ayudan a Google a mostrar más información.' }
      : { status: 'warn', detail: 'No tiene datos estructurados. Son los que permiten que Google muestre tu negocio, horario o preguntas frecuentes de forma destacada.', fix: 'Añade un bloque JSON-LD de tipo LocalBusiness u Organization.' }),
  });

  // --- Compartir en redes -------------------------------------------------
  const ogTitle = meta(head, 'og:title');
  const ogDesc = meta(head, 'og:description');
  const ogImage = meta(head, 'og:image');
  add({
    id: 'og-image', group: 'compartir', weight: 7,
    title: 'Imagen al compartir en WhatsApp y redes',
    ...(ogImage
      ? { status: 'ok', detail: 'Al compartir el enlace se muestra una imagen.' }
      : { status: 'fail', detail: 'Al compartir tu web por WhatsApp, Facebook o LinkedIn sale sin imagen, solo el enlace. Se ve poco profesional y se toca menos.', fix: 'Añade og:image con una imagen de 1200×630 píxeles.' }),
  });
  add({
    id: 'og-text', group: 'compartir', weight: 3,
    title: 'Título y texto al compartir',
    ...(ogTitle && ogDesc
      ? { status: 'ok', detail: 'Tiene título y descripción para la vista previa en redes.' }
      : { status: 'warn', detail: 'Falta el título o la descripción para la vista previa en redes (Open Graph).', fix: 'Añade og:title y og:description.' }),
  });

  // --- Celular y apariencia ----------------------------------------------
  const viewport = meta(head, 'viewport');
  add({
    id: 'viewport', group: 'movil', weight: 10,
    title: 'Adaptada al celular',
    ...(viewport?.includes('width=device-width')
      ? { status: 'ok', detail: 'La web está configurada para verse bien en el celular.' }
      : { status: 'fail', detail: 'Falta la configuración para celulares (viewport). En el teléfono se verá diminuta o habrá que hacer zoom.', fix: 'Añade <meta name="viewport" content="width=device-width, initial-scale=1">.' }),
  });

  const iconLinks = [...links(head, 'icon'), ...links(head, 'shortcut')];
  add({
    id: 'favicon', group: 'movil', weight: 5,
    title: 'Favicon (icono de la pestaña)',
    ...(iconLinks.length || faviconIco.ok
      ? { status: 'ok', detail: 'Tiene icono para la pestaña del navegador.' }
      : { status: 'fail', detail: 'No tiene favicon: en la pestaña y en los favoritos aparece un icono genérico.', fix: 'Añade tu logo como favicon (32×32 y 180×180 para iPhone).' }),
  });
  add({
    id: 'apple-icon', group: 'movil', weight: 2,
    title: 'Icono para iPhone',
    ...(links(head, 'apple-touch-icon').length
      ? { status: 'ok', detail: 'Tiene icono para cuando la guardan en la pantalla de inicio de un iPhone.' }
      : { status: 'warn', detail: 'Si alguien guarda tu web en la pantalla de inicio de un iPhone, saldrá una captura en vez de tu logo.', fix: 'Añade apple-touch-icon de 180×180.' }),
  });

  const lang = html.match(/<html\b[^>]*\slang\s*=\s*["']?([a-z-]+)/i)?.[1];
  add({
    id: 'lang', group: 'movil', weight: 2,
    title: 'Idioma declarado',
    ...(lang
      ? { status: lang.toLowerCase().startsWith('es') || !/[áéíóúñ¿¡]/i.test(text) ? 'ok' : 'warn', detail: lang.toLowerCase().startsWith('es') || !/[áéíóúñ¿¡]/i.test(text) ? `La página indica su idioma (${lang}).` : `La página dice estar en «${lang}», pero el texto parece estar en español. Muchas plantillas vienen en inglés por defecto.`, fix: 'Cambia el atributo lang a "es".' }
      : { status: 'warn', detail: 'La página no indica en qué idioma está.', fix: 'Añade lang="es" a la etiqueta <html>.' }),
  });

  const htmlKb = Math.round(Buffer.byteLength(html) / 1024);
  add({
    id: 'weight', group: 'movil', weight: 3,
    title: 'Peso del HTML',
    ...(htmlKb > 900
      ? { status: 'warn', detail: `El HTML de la página pesa ${htmlKb} KB, bastante para una sola página. En datos móviles tarda en cargar.`, fix: 'Revisa scripts y estilos incrustados innecesarios.' }
      : { status: 'ok', detail: `El HTML pesa ${htmlKb} KB.` }),
  });

  // --- Contacto y confianza ----------------------------------------------
  const lower = html.toLowerCase();
  const hasWhatsapp = /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\//.test(lower);
  const hasPhone = /href=["']tel:/.test(lower);
  const hasEmail = /href=["']mailto:/.test(lower);
  const hasForm = /<form\b/.test(lower);
  const contactCount = [hasWhatsapp, hasPhone, hasEmail, hasForm].filter(Boolean).length;
  add({
    id: 'contact', group: 'contacto', weight: 10,
    title: 'Forma de contactarte',
    ...(contactCount === 0
      ? { status: 'fail', detail: 'No encontré ningún botón de WhatsApp, teléfono, correo ni formulario en la página. Quien quiera contratarte no sabrá cómo escribirte.', fix: 'Pon un botón de WhatsApp visible y un formulario.' }
      : !hasWhatsapp
        ? { status: 'warn', detail: `Tiene ${[hasPhone && 'teléfono', hasEmail && 'correo', hasForm && 'formulario'].filter(Boolean).join(', ')}, pero no un botón de WhatsApp, que es como prefiere escribir la mayoría de la gente.`, fix: 'Añade un botón de WhatsApp con un mensaje ya escrito (wa.me).' }
        : { status: 'ok', detail: `Tiene ${[hasWhatsapp && 'WhatsApp', hasPhone && 'teléfono', hasEmail && 'correo', hasForm && 'formulario'].filter(Boolean).join(', ')}.` }),
  });

  const hasPrivacy = /href=["'][^"']*(privac|privacy|politica|legal|aviso-legal|cookies)/i.test(html);
  add({
    id: 'privacy', group: 'contacto', weight: 3,
    title: 'Política de privacidad',
    ...(hasPrivacy
      ? { status: 'ok', detail: 'Enlaza una política de privacidad o aviso legal.' }
      : { status: 'warn', detail: 'No encontré un enlace a política de privacidad. Si tienes formulario o estadísticas, conviene tenerla, y da confianza.', fix: 'Crea una página de privacidad y enlázala en el pie.' }),
  });

  const hasAnalytics = /googletagmanager\.com|google-analytics\.com|gtag\(|clarity\.ms|plausible\.io|umami|matomo|fbq\(/.test(lower);
  add({
    id: 'analytics', group: 'contacto', weight: 3,
    title: 'Estadísticas de visitas',
    ...(hasAnalytics
      ? { status: 'ok', detail: 'Tiene una herramienta para medir las visitas.' }
      : { status: 'warn', detail: 'No encontré ninguna herramienta de estadísticas. No puedes saber cuánta gente entra ni de dónde llega.', fix: 'Instala Google Analytics (gratis) y mide los clics en WhatsApp.' }),
  });

  // --- Técnico ------------------------------------------------------------
  add({
    id: 'https', group: 'tecnico', weight: 10,
    title: 'Conexión segura (HTTPS)',
    ...(finalUrl.protocol === 'https:'
      ? { status: 'ok', detail: 'La web usa conexión segura (candado en el navegador).' }
      : { status: 'fail', detail: 'La web no usa conexión segura. Los navegadores la marcan como "No segura" y Google la penaliza.', fix: 'Activa un certificado SSL (gratis con Let\'s Encrypt o Cloudflare).' }),
  });
  if (finalUrl.protocol === 'https:' && httpVersion) {
    const redirectsToHttps = httpVersion.redirects.length > 0 && httpVersion.url.protocol === 'https:';
    add({
      id: 'http-redirect', group: 'tecnico', weight: 3,
      title: 'Redirección a la versión segura',
      ...(redirectsToHttps
        ? { status: 'ok', detail: 'Si alguien entra por http://, se le lleva a la versión segura.' }
        : { status: 'warn', detail: 'Entrando por http:// la web no redirige a https://. Hay dos versiones de la misma web.', fix: 'Redirige todo el tráfico http a https.' }),
    });
  }

  // --- Nota ---------------------------------------------------------------
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.reduce((s, c) => s + (c.status === 'ok' ? c.weight : c.status === 'warn' ? c.weight * 0.5 : 0), 0);

  return {
    url: start.href,
    finalUrl: finalUrl.href,
    builder: detectBuilder(html, page.headers),
    score: Math.round((earned / total) * 100),
    checks,
  };
}
