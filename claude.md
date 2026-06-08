# claude.md — Project Memory: QuizFlow AI

> Working memory for AI assistants and engineers. Read this first.
> Full reference: see `PROJECT_HANDBOOK.md`. This file = quick context + hard-won lessons.

## What this project is
QuizFlow AI: a lead-capture funnel builder. Authenticated users create/edit/publish a multi-step quiz, share a public URL, anonymous visitors answer + submit a lead (email), responses are stored, owner reviews them in a dashboard.

- **Status:** MVP complete + validated live (16/16 E2E). Production readiness 90/100. No P0 blockers.
- **Repo:** https://github.com/fmarduarte/QuizFlowClean.git (branch `main`)
- **Supabase ref:** `jqmgpzunpnfkigamtcqx` (URL `https://jqmgpzunpnfkigamtcqx.supabase.co`)

## Stack (don't be surprised)
- React 19 + Vite 7 + TypeScript, Tailwind 4, shadcn/Radix UI, lucide, @dnd-kit, react-hook-form+zod.
- Routing: **react-router-dom v7** (`src/routes/router.tsx`). NOTE: `@tanstack/*` deps exist in package.json but are **vestigial** — the app does NOT use TanStack Router/Start.
- Backend: **Supabase only** (Postgres + Auth + RLS + RPCs). No custom server. Client uses the **anon key only**.
- Path alias `@` → `src`.

## Key files
- `src/lib/supabase.ts` — single anon client.
- `src/lib/funnel-store.ts` — funnel CRUD + `fetchPublishedFunnelBySlug` (calls RPC).
- `src/lib/response-store.ts` — events/responses + durable retry queue (`flushPendingResponses`).
- `src/context/QuizzesContext.tsx` — funnel state + autosave (debounced, flush-on-navigate).
- `src/context/AuthContext.tsx` — session.
- `src/pages/public/PublicQuizPage.tsx`, `src/components/quiz/QuizPlayer.tsx`, `QuizLeadCaptureForm.tsx`.
- `src/pages/app/FunnelResponsesPage.tsx` — dashboard analytics.
- `supabase/migrations/` — 001..006. **006 is the canonical idempotent public-access repair.**

## CRITICAL INVARIANTS — do not break
1. **RPC `get_published_funnel(p_slug text)`** returns only public-safe columns; the public page depends on this exact signature. Anon has NO direct read on `funnels`.
2. **`is_published_funnel(p_funnel_id uuid)`** gates anon inserts on `funnel_events`/`funnel_responses`. Replace ONLY via `create or replace` (policies depend on it; dropping it fails).
3. **Never re-add the broad anon read policy** `"Anyone can read published funnels"` on `funnels` — it leaks `draft_data` + `user_id`.
4. **Anon inserts must NOT use `.select()`** — anon has no SELECT policy on `funnel_responses`. Adding `.select()` → `42501 RLS violation`. (`response-store.ts` inserts without select.)
5. **Public page reads `published_snapshot`, never `draft_data`** — published snapshot is immutable.
6. **Unique `(user_id, client_quiz_id)`** on `funnels` — upserts rely on it.
7. **Anon key only in client.** Service-role key NEVER in frontend / never `VITE_`-prefixed.

## Validation (how to prove the system works)
Requires `.env` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and a confirmed `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD`.
- `node scripts/verify-public-access.mjs` → expect 3/3.
- `node scripts/verify-e2e-phase2.mjs` → expect 16/16 (full auth journey + cleanup).
- `node scripts/diagnose-response-insert.mjs` → root-cause probe for anon response inserts.
- `npm run test` (vitest) + `npm run build` (vite) for code gates.

## Env vars
- Client (Vercel + local `.env`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL` (optional).
- Scripts/testing only (local `.env`): `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`, optional `SUPABASE_SERVICE_ROLE_KEY`.

## HARD-WON LESSONS (this is why this file exists)
- **DB ≠ code.** Migrations were applied by hand and drifted. Symptoms looked like app bugs but were missing functions/policies. ALWAYS verify the live DB with the scripts, not assumptions. Adopt linked Supabase CLI + `supabase db push` + CI drift check.
- **`create or replace` on a `RETURNS TABLE` function silently fails** if the column set differs ("cannot change return type"). Use `drop function if exists` then `create` (done in 006 for `get_published_funnel`).
- **PostgREST schema cache.** New functions may 404 (`PGRST202`) until the cache reloads: `notify pgrst, 'reload schema';` or Dashboard → Settings → API → Reload schema cache. The OpenAPI `/rest/v1/` RPC listing is NOT authoritative on Supabase (it showed 0 RPCs while calls worked) — trust functional RPC calls.
- **"RLS leak passed" can be a false negative** if no published row exists at probe time. Test the leak WITH a published funnel present.
- **The response-insert "RLS violation" was a TEST BUG**, not an app bug: the E2E used `.insert().select().single()` (anon can't read back). The real app inserts without select and works. Diagnose with the probe before "fixing" app code.
- **Email confirmation is ON.** Sign-in fails with "Email not confirmed" for unconfirmed users. Confirm via SQL `update auth.users set email_confirmed_at = now() where email = '...'` or disable in Auth → Providers → Email.
- **OneDrive hazard.** Repo is under `OneDrive - Nokia`. OneDrive spawns `… - Copy.tsx/.ts` duplicates of all of `src/` and resurrects deleted files → breaks `tsc`/tests locally. Production `vite build` is UNAFFECTED (tree-shakes unreferenced files). Fix: move repo out of OneDrive; purge `* - Copy.*` + orphan `quiz-*` files. (Owner asked to NOT delete files — respect that unless told otherwise.)

## Known mocks (NOT bugs)
- AI generation: `src/lib/quiz-generation.ts` → `generateMockFunnelQuestions` (2s fake delay). Real version = JWT-validated Supabase Edge Function → OpenAI.
- Billing/credits: `src/components/dashboard/BillingSection.tsx` is hardcoded UI. No Stripe.

## Deployment
- Vercel static SPA: `vercel.json` (build `npm run build`, output `dist`, SPA rewrite, security headers). Env vars set in Vercel (not from local `.env`). Push to `main` → auto-deploy.

## Next on resume (short list)
1. Move repo out of OneDrive + purge duplicates; confirm `tsc`/tests green; commit.
2. Link Supabase CLI; commit schema; add migration drift CI; enable backups/PITR.
3. Re-run the 3 validation scripts.
4. Then features: lead delivery (email/webhook) → real AI → scoring engine → branding/embed → server-side analytics → Stripe billing.

## Owner working style (observed)
- Wants autonomous ownership, fixes applied automatically when safe, and to NOT manually hunt for issues.
- For destructive/large actions (mass deletes), ASK first.
- Provide validated state, not work-in-progress, in final reports.
