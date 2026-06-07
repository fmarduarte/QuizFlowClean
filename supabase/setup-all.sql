-- QuizFlow Supabase setup (run once in SQL Editor)
-- Project: https://supabase.com/dashboard/project/jqmgpzunpnfkigamtcqx/sql/new
-- Migrations: 001 → 002 → 003

-- === 001_funnel_briefs.sql ===
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

-- === 002_funnels.sql ===
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

-- === 003_funnel_analytics.sql ===
alter table public.funnels drop constraint if exists funnels_status_check;
alter table public.funnels add constraint funnels_status_check
  check (status in ('draft', 'published', 'archived'));

create table if not exists public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  funnel_id uuid not null references public.funnels (id) on delete cascade,
  session_id text not null,
  event_type text not null check (event_type in ('view', 'start')),
  created_at timestamptz not null default now()
);

create index if not exists funnel_events_funnel_id_idx on public.funnel_events (funnel_id);
create index if not exists funnel_events_type_idx on public.funnel_events (funnel_id, event_type);

create table if not exists public.funnel_responses (
  id uuid primary key default gen_random_uuid(),
  funnel_id uuid not null references public.funnels (id) on delete cascade,
  session_id text not null,
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists funnel_responses_funnel_id_idx on public.funnel_responses (funnel_id);
create index if not exists funnel_responses_completed_at_idx on public.funnel_responses (completed_at desc);

alter table public.funnel_events enable row level security;
alter table public.funnel_responses enable row level security;

create policy "Anyone can record events on published funnels"
  on public.funnel_events for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.funnels f
      where f.id = funnel_id and f.status = 'published'
    )
  );

create policy "Funnel owners can read events"
  on public.funnel_events for select
  to authenticated
  using (
    exists (
      select 1 from public.funnels f
      where f.id = funnel_id and f.user_id = auth.uid()
    )
  );

create policy "Anyone can submit responses on published funnels"
  on public.funnel_responses for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.funnels f
      where f.id = funnel_id and f.status = 'published'
    )
  );

create policy "Funnel owners can read responses"
  on public.funnel_responses for select
  to authenticated
  using (
    exists (
      select 1 from public.funnels f
      where f.id = funnel_id and f.user_id = auth.uid()
    )
  );

-- === API grants + schema cache reload (required for app access) ===
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.funnel_briefs to authenticated;
grant select, insert, update, delete on public.funnels to authenticated;
grant select, insert, update, delete on public.funnel_events to authenticated, anon;
grant select, insert, update, delete on public.funnel_responses to authenticated, anon;
grant select on public.funnels to anon;

notify pgrst, 'reload schema';
