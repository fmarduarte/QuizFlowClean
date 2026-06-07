-- Funnels: draft + published snapshots (source of truth for publish workflow).
-- Run via Supabase SQL Editor or: supabase db push

create table if not exists public.funnels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_quiz_id text not null,
  public_slug text not null,
  title text not null,
  description text,
  draft_data jsonb not null default '{}'::jsonb,
  published_snapshot jsonb,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint funnels_user_client_quiz_unique unique (user_id, client_quiz_id),
  constraint funnels_public_slug_unique unique (public_slug)
);

create index if not exists funnels_user_id_idx on public.funnels (user_id);
create index if not exists funnels_public_slug_idx on public.funnels (public_slug);
create index if not exists funnels_status_idx on public.funnels (status);

alter table public.funnels enable row level security;

create policy "Users can insert own funnels"
  on public.funnels for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own funnels"
  on public.funnels for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Anyone can read published funnels"
  on public.funnels for select
  to anon, authenticated
  using (status = 'published' and published_snapshot is not null);

create policy "Users can update own funnels"
  on public.funnels for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own funnels"
  on public.funnels for delete
  to authenticated
  using (auth.uid() = user_id);
