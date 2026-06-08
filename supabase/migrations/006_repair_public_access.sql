-- 006: Self-contained repair of the public-access surface.
--
-- Safe to run MULTIPLE TIMES. Re-establishes everything the public quiz flow needs,
-- regardless of how much of migrations 002/003/004/005 actually succeeded:
--   * lead-capture columns on funnel_responses
--   * get_published_funnel(text) + is_published_funnel(uuid)  [SECURITY DEFINER]
--   * EXECUTE grants for anon + authenticated
--   * removal of the broad anon SELECT policy that leaked draft_data/user_id
--   * anon INSERT policies for events/responses, gated by is_published_funnel()
--   * PostgREST schema-cache reload
--
-- Run in: Supabase SQL Editor (paste whole file) or `supabase db push`.

begin;

-- 1) Lead-capture columns (idempotent).
alter table public.funnel_responses add column if not exists lead_email text;
alter table public.funnel_responses add column if not exists lead_name  text;

create index if not exists funnel_responses_lead_email_idx
  on public.funnel_responses (lead_email);

-- 2) Functions. DROP first so a differing prior return-type cannot block creation
--    ("cannot change return type of existing function").
drop function if exists public.get_published_funnel(text);

create function public.get_published_funnel(p_slug text)
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

-- create or replace (NOT drop): RLS policies below depend on this function, and a
-- scalar return type can be replaced in place without a dependency conflict.
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

-- 3) Remove the broad anon read policy (idempotent).
drop policy if exists "Anyone can read published funnels" on public.funnels;

-- 4) Anon insert policies, gated by the definer helper (idempotent).
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

commit;

-- 5) Reload the PostgREST schema cache (runs after COMMIT).
notify pgrst, 'reload schema';
select pg_notify('pgrst', 'reload schema');

-- 6) PROOF — must return exactly 2 rows. If 0 rows, creation failed above.
select n.nspname as schema, p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('get_published_funnel', 'is_published_funnel')
order by p.proname;
