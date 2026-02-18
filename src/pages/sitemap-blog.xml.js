/**
 * Sitemap solo para el blog. Incluye todos los posts (incluidos los generados automáticamente).
 * Así los buscadores indexan bien cada artículo.
 */
import { getCollection } from 'astro:content';

const SITE = 'https://darwincd.com';

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getCollection('blog');
  const entries = posts.map((post) => {
    const loc = `${SITE}/blog/${post.slug}/`;
    const lastmod = post.data.pubDate.toISOString().slice(0, 10);
    return `  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
