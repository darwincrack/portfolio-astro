import slugify from 'slugify';
import { getSupabaseAdmin, type DbProject, type DbProjectInput } from './supabase';

export type ProjectPayload = {
  slug?: string;
  title: string;
  description: string;
  priority: number;
  type: DbProject['type'];
  link?: string;
  github?: string;
  tags?: string[];
  cover_image: string;
  gallery?: string[];
  body?: string;
};

function toDbInput(payload: ProjectPayload, slug: string): DbProjectInput {
  return {
    slug,
    title: payload.title.trim(),
    description: payload.description.trim(),
    priority: Number(payload.priority) || 10,
    type: payload.type,
    link: payload.link?.trim() ?? '',
    github: payload.github?.trim() ?? '',
    tags: payload.tags ?? [],
    cover_image: payload.cover_image,
    gallery: payload.gallery?.length ? payload.gallery : [payload.cover_image],
    body: payload.body?.trim() ?? '',
  };
}

export function buildSlug(title: string, customSlug?: string): string {
  if (customSlug?.trim()) {
    return slugify(customSlug.trim(), { lower: true, strict: true });
  }
  return slugify(title, { lower: true, strict: true });
}

export async function listProjectsAdmin(): Promise<DbProject[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase no configurado');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('priority', { ascending: true });

  if (error) throw error;
  return data as DbProject[];
}

export async function getProjectAdmin(slug: string): Promise<DbProject | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase no configurado');

  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as DbProject | null;
}

export async function createProjectAdmin(payload: ProjectPayload): Promise<DbProject> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase no configurado');

  const slug = buildSlug(payload.title, payload.slug);
  const input = toDbInput(payload, slug);

  const { data, error } = await supabase.from('projects').insert(input).select().single();
  if (error) throw error;
  return data as DbProject;
}

export async function updateProjectAdmin(slug: string, payload: ProjectPayload): Promise<DbProject> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase no configurado');

  const nextSlug = payload.slug?.trim() ? buildSlug(payload.slug, payload.slug) : slug;
  const input = toDbInput(payload, nextSlug);

  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('slug', slug)
    .select()
    .single();

  if (error) throw error;
  return data as DbProject;
}

export async function deleteProjectAdmin(slug: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error('Supabase no configurado');

  const { error } = await supabase.from('projects').delete().eq('slug', slug);
  if (error) throw error;
}
