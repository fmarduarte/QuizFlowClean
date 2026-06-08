-- 004: Lead capture columns + hardened public access.
-- Run after 003_funnel_analytics.sql (Supabase SQL Editor or `supabase db push`).

-- 1) Lead contact details on responses.
alter table public.funnel_responses add column if not exists lead_email text;
alter table public.funnel_responses add column if not exists lead_name text;

create index if not exists funnel_responses_lead_email_idx
  on public.funnel_responses (lead_email);

-- 2) Security-definer helpers so anon access does not require a broad SELECT
--    policy on the funnels table (which previously exposed draft_data/user_id).

-- Read a single published funnel by slug, returning ONLY public-safe columns.
create or replace function public.get_published_funnel(p_slug text)
returns table (
  id uuid,
  public_slug text,
  title text,
  description text,
  published_snapshot jsonb,
  published_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select f.id, f.public_slug, f.title, f.description, f.published_snapshot, f.published_at
  from public.funnels f
  where f.public_slug = p_slug
    and f.status = 'published'
    and f.published_snapshot is not null
$$;

grant execute on function public.get_published_funnel(text) to anon, authenticated;

-- Used by event/response insert policies so they don't depend on anon SELECT.
create or replace function public.is_published_funnel(p_funnel_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.funnels f
    where f.id = p_funnel_id and f.status = 'published'
  )
$$;

grant execute on function public.is_published_funnel(uuid) to anon, authenticated;

-- 3) Remove the broad anon read policy that exposed full published rows.
drop policy if exists "Anyone can read published funnels" on public.funnels;

-- 4) Recreate event/response insert policies using the definer helper
--    (no longer rely on anon being able to SELECT funnels).
drop policy if exists "Anyone can record events on published funnels" on public.funnel_events;
create policy "Anyone can record events on published funnels"
  on public.funnel_events for insert
  to anon, authenticated
  with check (public.is_published_funnel(funnel_id));

drop policy if exists "Anyone can submit responses on published funnels" on public.funnel_responses;
create policy "Anyone can submit responses on published funnels"
  on public.funnel_responses for insert
  to anon, authenticated
  with check (public.is_published_funnel(funnel_id));

notify pgrst, 'reload schema';
