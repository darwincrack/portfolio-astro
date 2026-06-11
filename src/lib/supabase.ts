import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type DbProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priority: number;
  type: 'fullstack' | 'plugins' | 'tools' | 'support' | 'mobile';
  link: string;
  github: string;
  tags: string[];
  cover_image: string;
  gallery: string[];
  body: string;
  created_at: string;
  updated_at: string;
};

export type DbProjectInput = Omit<DbProject, 'id' | 'created_at' | 'updated_at'>;

function getSupabaseUrl(): string | undefined {
  return import.meta.env.PUBLIC_SUPABASE_URL;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && import.meta.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isSupabaseReadable(): boolean {
  return Boolean(getSupabaseUrl() && (import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY));
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function getSupabasePublic(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
