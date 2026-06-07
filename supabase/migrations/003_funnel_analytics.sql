-- Funnel analytics: archived status, events (views/starts), responses.
-- Run after 002_funnels.sql

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
