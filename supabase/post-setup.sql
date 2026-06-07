-- Run in Supabase SQL Editor AFTER setup-all.sql if tables aren't visible via the app.
-- 1) Confirm tables exist
-- 2) Grant API access
-- 3) Reload PostgREST schema cache

-- Verify (should return funnel_briefs, funnels, funnel_events, funnel_responses)
select tablename from pg_tables where schemaname = 'public' order by tablename;

-- Grants for Data API (required on newer Supabase projects)
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.funnel_briefs to authenticated;
grant select, insert, update, delete on public.funnels to authenticated;
grant select, insert, update, delete on public.funnel_events to authenticated, anon;
grant select, insert, update, delete on public.funnel_responses to authenticated, anon;

grant select on public.funnels to anon;

-- Reload PostgREST schema cache so /rest/v1 sees new tables immediately
notify pgrst, 'reload schema';
