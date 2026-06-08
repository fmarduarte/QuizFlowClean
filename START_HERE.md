# START HERE — QuizFlow AI

> First file to read. Zero context assumed. Then: `claude.md` (working memory) and `PROJECT_HANDBOOK.md` (full reference).

## Current status
- **What it is:** Lead-capture funnel builder. Users create/edit/publish multi-step quizzes, share a public URL; anonymous visitors answer + submit a lead (email); responses are stored; owner reviews them in a dashboard.
- **MVP completion:** 100% of MVP-critical flows — **validated live (16/16 end-to-end).**
- **Production readiness:** **90/100.** No P0 blockers. Launchable as a lead-capture MVP.
- **Intentional mocks (not bugs):** AI generation and billing/credits.

## Locations
- **Local repo:** `C:\Users\fmduarte\OneDrive - Nokia\Documents\GitHub\QuizFlowClean` (⚠️ under OneDrive — see warning)
- **GitHub:** https://github.com/fmarduarte/QuizFlowClean.git (branch `main`)
- **Vercel:** static SPA, auto-deploys from `main` (build `npm run build`, output `dist`)
- **Supabase:** project ref `jqmgpzunpnfkigamtcqx` — `https://jqmgpzunpnfkigamtcqx.supabase.co`

## Stack (1 line)
React 19 + Vite 7 + TypeScript, Tailwind 4, react-router-dom v7, Supabase (Postgres+Auth+RLS+RPC). Anon key only in client. (`@tanstack/*` deps are vestigial — not used.)

## Critical files
- `src/lib/supabase.ts` — anon client
- `src/lib/funnel-store.ts` — funnel CRUD + `fetchPublishedFunnelBySlug` (RPC)
- `src/lib/response-store.ts` — events/responses + durable lead retry queue
- `src/context/QuizzesContext.tsx` — funnel state + autosave
- `src/pages/public/PublicQuizPage.tsx`, `src/components/quiz/QuizPlayer.tsx`
- `src/routes/router.tsx` — routes

## Critical migrations (`supabase/migrations/`)
- Apply in order `001 → 006`. **`006_repair_public_access.sql` is the canonical, idempotent public-access fix** (functions + RLS). If the DB state is ever unclear, run 006.
- Ignore `002_published_quizzes_and_responses*.sql` (legacy/unused) and any `… - Copy` file.

## Important RPCs (do not change signatures)
- `get_published_funnel(p_slug text)` → public-safe funnel for the public page.
- `is_published_funnel(p_funnel_id uuid)` → gates anonymous inserts on events/responses.

## Environment variables
- **Client (Vercel + local `.env`):** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL` (optional).
- **Scripts/testing only (local `.env`):** `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`, optional `SUPABASE_SERVICE_ROLE_KEY` (never `VITE_`-prefixed, never in client).

## Validate it works
```
node scripts/verify-public-access.mjs   # expect 3/3
node scripts/verify-e2e-phase2.mjs       # expect 16/16
npm run test && npm run build            # code gates
```

## Current roadmap (priority order)
1. DB pipeline hardening (Supabase CLI link + migration CI + backups/PITR)
2. Lead delivery (email-on-lead + webhook/Zapier)
3. Real AI generation (JWT-validated Edge Function → OpenAI)
4. Scoring/outcomes engine
5. Branding + embeds
6. Server-side analytics
7. Stripe billing + usage credits

## Known risks
- **Schema/code drift** — migrations were hand-applied; always verify the live DB with the scripts.
- **No anon rate-limiting** — spam risk at scale.
- **No DB backups configured** — enable PITR before scaling.
- **Mock AI/billing** — no monetization yet.

## ⚠️ OneDrive warning
The repo lives in a OneDrive-synced folder. OneDrive creates `… - Copy.tsx/.ts` duplicates of `src/` and resurrects deleted files, which **break local `tsc`/tests**. The **production build is unaffected** (Vite ignores unreferenced files). Fix: **move the repo out of OneDrive** (e.g., `C:\dev\QuizFlowClean`) and purge `* - Copy.*` + orphan `quiz-*` files.

## Recovery (lost local files)
1. Install Node 20+ and Git. 2. `git clone https://github.com/fmarduarte/QuizFlowClean.git` (outside OneDrive). 3. `npm install`. 4. Create `.env` from `.env.example` (anon key from Supabase → Settings → API). 5. `npm run dev`. Data already lives in Supabase; only run migrations `001→006` if rebuilding a fresh project. Full procedures in `PROJECT_HANDBOOK.md` §24–27.

## First actions when resuming
1. Read `claude.md` (invariants + hard-won lessons) and `PROJECT_HANDBOOK.md`.
2. Move repo out of OneDrive; purge duplicate/orphan files; confirm `tsc` + tests green; commit.
3. Run the 3 validation scripts to confirm the live state is unchanged.
4. Then start the roadmap at #1 (DB pipeline hardening).

## Do NOT break (security invariants)
Never re-add the broad anon read policy on `funnels`; anon inserts must not use `.select()`; public page reads `published_snapshot` (never `draft_data`); keep the RPC signatures; anon key only in the client. (Details in `claude.md`.)
