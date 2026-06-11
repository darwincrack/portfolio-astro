-- Ejecutar en el SQL Editor de Supabase (Dashboard → SQL → New query)

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  priority integer not null default 10,
  type text not null default 'fullstack'
    check (type in ('fullstack', 'plugins', 'tools', 'support', 'mobile')),
  link text not null default '',
  github text not null default '',
  tags text[] not null default '{}',
  cover_image text not null,
  gallery text[] not null default '{}',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_priority_idx on public.projects (priority);
create index if not exists projects_slug_idx on public.projects (slug);

alter table public.projects enable row level security;

drop policy if exists "Lectura pública de proyectos" on public.projects;
create policy "Lectura pública de proyectos"
  on public.projects for select
  using (true);

-- Escrituras solo vía service_role (API admin del servidor)

create or replace function public.set_projects_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_projects_updated_at();
