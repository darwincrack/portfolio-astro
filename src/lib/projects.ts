import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { renderMarkdown } from './markdown';
import { resolveProjectImage } from './projectImages';
import { getSupabasePublic, isSupabaseReadable, type DbProject } from './supabase';

export type ProjectType = 'fullstack' | 'plugins' | 'tools' | 'support' | 'mobile';

export type ResolvedProject = {
  slug: string;
  title: string;
  description: string;
  priority: number;
  type: ProjectType;
  link: string;
  github: string;
  tags: string[];
  coverImage: string;
  gallery: string[];
  body: string;
  bodyHtml: string;
  image?: ImageMetadata;
  additionalImages: ImageMetadata[];
  source: 'supabase' | 'content';
};

function resolveGallery(coverImage: string, gallery: string[]): ImageMetadata[] {
  const keys = gallery.length > 0 ? gallery : [coverImage];
  return keys.map((key) => resolveProjectImage(key)).filter((img): img is ImageMetadata => Boolean(img));
}

function mapDbProject(row: DbProject): ResolvedProject {
  const gallery = row.gallery ?? [];
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    priority: row.priority,
    type: row.type,
    link: row.link ?? '',
    github: row.github ?? '',
    tags: row.tags ?? [],
    coverImage: row.cover_image,
    gallery,
    body: row.body ?? '',
    bodyHtml: renderMarkdown(row.body ?? ''),
    image: resolveProjectImage(row.cover_image),
    additionalImages: resolveGallery(row.cover_image, gallery),
    source: 'supabase',
  };
}

async function getProjectsFromSupabase(): Promise<ResolvedProject[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('priority', { ascending: true });

  if (error) {
    console.error('[projects] Supabase:', error.message);
    return [];
  }

  return (data as DbProject[]).map(mapDbProject);
}

async function getProjectsFromContent(): Promise<ResolvedProject[]> {
  const entries = await getCollection('projects');

  return entries
    .map((entry) => {
      const gallery = entry.data.gallery ?? [];
      const body = entry.body?.trim() ?? '';
      return {
        slug: entry.slug,
        title: entry.data.title,
        description: entry.data.description,
        priority: entry.data.priority,
        type: entry.data.type,
        link: entry.data.link,
        github: entry.data.github,
        tags: entry.data.tags,
        coverImage: entry.data.coverImage,
        gallery,
        body,
        bodyHtml: renderMarkdown(body),
        image: resolveProjectImage(entry.data.coverImage),
        additionalImages: resolveGallery(entry.data.coverImage, gallery),
        source: 'content' as const,
      };
    })
    .sort((a, b) => a.priority - b.priority);
}

export async function getAllProjects(): Promise<ResolvedProject[]> {
  if (isSupabaseReadable()) {
    const fromDb = await getProjectsFromSupabase();
    if (fromDb.length > 0) return fromDb;
  }
  return getProjectsFromContent();
}

export async function getProjectBySlug(slug: string): Promise<ResolvedProject | undefined> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug);
}

export function getProjectTypeLabel(type: ProjectType): string {
  switch (type) {
    case 'support':
      return 'Soporte';
    case 'tools':
      return 'Herramienta';
    case 'mobile':
      return 'Movil';
    case 'plugins':
      return 'Plugins';
    default:
      return 'Web/App Web';
  }
}
