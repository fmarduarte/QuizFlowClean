-- 005: Corrective migration — (re)create get_published_funnel RPC.
--
-- WHY THIS IS NEEDED:
-- Live validation (scripts/verify-public-access.mjs) showed that the database has
-- `is_published_funnel` and the dropped broad anon SELECT policy from migration 004,
-- but `public.get_published_funnel(text)` is MISSING from the PostgREST schema cache.
-- That means an earlier/partial version of 004 was applied before the RPC was added.
--
-- IMPACT: src/lib/funnel-store.ts -> fetchPublishedFunnelBySlug() calls this RPC for
-- every public quiz page. With the anon table-read policy already removed, the public
-- funnel page returns "not found" for ALL published quizzes until this function exists.
--
-- This migration is idempotent and safe to run repeatedly.
-- Run in Supabase SQL Editor or `supabase db push`.

-- DROP first: Postgres refuses `create or replace` on a RETURNS TABLE function whose
-- output columns differ from a pre-existing definition ("cannot change return type of
-- existing function"). A silent failure here is the most likely reason the RPC was
-- reported as applied yet is still absent from the PostgREST schema cache.
drop function if exists public.get_published_funnel(text);

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

-- Ensure the analytics-insert helper exists too (defensive; no-op if already present).
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

-- Force PostgREST to refresh its schema cache so the RPC is callable immediately.
notify pgrst, 'reload schema';
