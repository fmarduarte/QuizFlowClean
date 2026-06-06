-- Funnel briefs: stores the complete generation brief per user funnel.
-- Run in Supabase SQL Editor or via CLI: supabase db push

create table if not exists public.funnel_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_id text,
  funnel_type text not null,
  business_niche text not null,
  product_offer text not null,
  target_audience text not null,
  goal text not null,
  detected_language text not null default 'en',
  language_mode text not null default 'original' check (language_mode in ('original', 'translated')),
  quality_score integer not null default 0,
  quality_label text not null default 'Incomplete',
  title text not null,
  brief_json jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists funnel_briefs_user_id_idx on public.funnel_briefs (user_id);
create index if not exists funnel_briefs_quiz_id_idx on public.funnel_briefs (quiz_id);

alter table public.funnel_briefs enable row level security;

create policy "Users can insert own funnel briefs"
  on public.funnel_briefs for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can read own funnel briefs"
  on public.funnel_briefs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own funnel briefs"
  on public.funnel_briefs for update
  to authenticated
  using (auth.uid() = user_id);
