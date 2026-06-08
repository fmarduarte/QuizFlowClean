# QuizFlow AI — Permanent Project Handbook

> Single source of truth for restarting this project with zero prior context.
> Last validated: production end-to-end (16/16 automated checks).
> Repository: https://github.com/fmarduarte/QuizFlowClean.git (branch: `main`)
> Supabase project ref: `jqmgpzunpnfkigamtcqx`

---

## 1. Executive Summary

QuizFlow AI is a lead-capture funnel builder: an authenticated user creates a multi-step quiz/funnel, publishes it, and shares a public URL. Anonymous visitors answer the questions, submit their contact details (lead), and their responses are stored for the owner to review in a dashboard.

The MVP is **complete and validated live in production**. All MVP-critical flows pass an automated end-to-end suite against the live Supabase project. There are **no remaining P0 blockers**. AI generation and billing are intentionally mocked and are the main items required before monetization.

- **MVP completion:** 100% of MVP-critical flows
- **Production readiness:** 90/100
- **Launchable today as:** a lead-capture MVP

## 2. Current Product Status

| Area | Status |
|---|---|
| Authentication (Supabase) | Validated |
| Quiz CRUD | Validated |
| Publishing (immutable snapshot) | Validated |
| Public funnel URL + access | Validated |
| Lead capture | Validated |
| Response storage | Validated |
| Dashboard visibility + CSV export | Validated |
| RLS security | Validated (hardened) |
| RPC functions | Validated |
| AI generation | Mock (clearly marked) |
| Billing / Credits | Mock (clearly marked) |

## 3. MVP Features Implemented

- Email/password auth with enforced email confirmation, protected routes, password reset.
- Funnel builder: questions + options, drag reorder, live preview, debounced autosave.
- Draft vs. published model with an immutable published snapshot.
- Public funnel page served via a security-definer RPC (only public-safe fields).
- Lead capture form (email required, name optional) before completion.
- Response + event storage (views, starts, completions).
- Dashboard: funnel list, status management, analytics (views/starts/completions/rate), per-response view with lead details, CSV export.
- Durable client-side retry queue so a captured lead is never lost on a transient failure.

## 4. Architecture Overview

Single-page React application talking directly to Supabase (no custom server). Supabase provides Postgres, Auth, and Row-Level Security. The browser uses the **anon** key only; all access control is enforced by RLS policies and security-definer RPCs. Hosting is on Vercel as a static SPA with a catch-all rewrite to `index.html`.

```
Browser (React SPA, anon key)
   |  supabase-js
   v
Supabase
   - Auth (email/password)
   - Postgres + RLS
   - RPC: get_published_funnel(), is_published_funnel()
```

- Owners are authenticated; their data is scoped by `auth.uid() = user_id`.
- Anonymous visitors can read a published funnel only via the RPC, and can insert responses/events only for published funnels (never read them back).

## 5. Frontend Architecture

- **Stack:** React 19, Vite 7, TypeScript 5.8, Tailwind CSS 4, shadcn/Radix UI, lucide-react, date-fns, @dnd-kit (reorder), react-hook-form + zod.
- **Routing:** `react-router-dom` v7 via `createBrowserRouter` in `src/routes/router.tsx`. (Note: `@tanstack/*` packages appear in `package.json` but the live app uses `react-router-dom`; the TanStack deps are vestigial.)
- **State:** React Context — `AuthContext` (session/user) and `QuizzesContext` (funnel CRUD + autosave).
- **Path alias:** `@` → `src` (configured in `vite.config.ts` and `tsconfig.json`).
- **Key directories:**
  - `src/pages/*` — route components (`app/`, `auth/`, `public/`, `marketing/`)
  - `src/components/*` — `builder/`, `quiz/`, `dashboard/`, `funnel/`, `ui/`
  - `src/context/*` — `AuthContext.tsx`, `QuizzesContext.tsx`
  - `src/lib/*` — data access (`funnel-store.ts`, `response-store.ts`, `supabase.ts`), utilities
  - `src/hooks/*` — `use-autosave.ts`, `use-page-meta.ts`, etc.
  - `src/types/quiz.ts` — core domain types

### Routes
| Path | Component | Access |
|---|---|---|
| `/` | LandingPage | Public |
| `/quiz/public/:slug` | PublicQuizPage | Public |
| `/login`, `/signup`, `/forgot-password` | Auth pages | Guests only |
| `/reset-password` | ResetPasswordPage | Public (token) |
| `/app` | AppHomePage | Protected |
| `/app/create` | CreateFunnelPage | Protected |
| `/app/funnels` | MyFunnelsPage | Protected |
| `/app/settings` | AppSettingsPage | Protected |
| `/app/billing` | AppBillingPage | Protected (mock) |
| `/app/quiz/:quizId` | QuizBuilderPage | Protected |
| `/app/funnel/:quizId/responses` | FunnelResponsesPage | Protected |
| `*` | NotFoundPage | Public |

## 6. Backend Architecture

There is **no custom backend service**. The "backend" is Supabase:
- **Postgres** stores all domain data.
- **RLS policies** are the authorization layer.
- **Security-definer RPCs** provide controlled anonymous read and policy helpers.
- **Auth** issues JWTs; the SPA attaches them automatically via `supabase-js`.

Any future server-only logic (real AI generation, Stripe webhooks, email-on-lead) should be implemented as **Supabase Edge Functions** that validate the JWT before acting, and must use the service-role key **only** server-side (never in the client).

## 7. Supabase Configuration

- **Project ref:** `jqmgpzunpnfkigamtcqx`
- **URL:** `https://jqmgpzunpnfkigamtcqx.supabase.co`
- **Client:** `src/lib/supabase.ts` creates a single client with the anon key; `persistSession`, `autoRefreshToken`, and `detectSessionInUrl` enabled.
- **Auth settings:** Email confirmation is ENABLED. Add redirect URLs for password reset: `https://<prod-domain>/reset-password` and `http://localhost:5173/reset-password`.
- **Exposed schema:** `public`.

## 8. Authentication Model

- Email/password via Supabase Auth.
- Email confirmation enforced — new signups must confirm before sign-in succeeds.
- `ProtectedRoute` guards `/app/*`; `GuestRoute` blocks authenticated users from auth pages.
- Session persisted in browser storage; auto-refreshed.
- Owner identity (`auth.uid()`) is the basis for all data-access policies.

## 9. Database Structure

Active tables (the `funnel-*` stack — the source of truth used by the app):

- **`public.funnels`** — one row per funnel.
  - `id uuid pk`, `user_id uuid (auth.users)`, `client_quiz_id text`, `public_slug text unique`, `title`, `description`, `draft_data jsonb`, `published_snapshot jsonb`, `published_at timestamptz`, `status text check (draft|published|archived)`, `created_at`, `updated_at`.
  - Unique constraint: `(user_id, client_quiz_id)` — enables idempotent upserts.
- **`public.funnel_events`** — `id`, `funnel_id (fk)`, `session_id`, `event_type (view|start)`, `created_at`.
- **`public.funnel_responses`** — `id`, `funnel_id (fk)`, `session_id`, `answers jsonb`, `lead_email text`, `lead_name text`, `completed_at`, `created_at`.
- **`public.funnel_briefs`** — stores the generation brief per funnel (used by the create flow).

Legacy/unused tables (created by an early migration, NOT used by the funnel stack): `public.published_quizzes`, `public.quiz_responses`. Safe to ignore; do not build on them.

## 10. RLS Security Model

All tables have RLS enabled.

- **`funnels`:**
  - Owner can `select/insert/update/delete` where `auth.uid() = user_id`.
  - The previous broad `"Anyone can read published funnels"` anon policy was **DROPPED** (it leaked `draft_data`/`user_id`). Anonymous users have **no direct read** on `funnels`.
- **`funnel_events`:** anon+authenticated may `insert` where `public.is_published_funnel(funnel_id)`; owners may `select` their funnels' events.
- **`funnel_responses`:** anon+authenticated may `insert` where `public.is_published_funnel(funnel_id)`; **no anon select**; owners may `select` their funnels' responses.

Net effect (validated live): anonymous users can submit to published funnels but cannot read any funnel rows or any responses. Owners see only their own data.

## 11. RPC Functions

Both are `language sql`, `security definer`, `set search_path = public`, `stable`, with `execute` granted to `anon, authenticated`.

- **`public.get_published_funnel(p_slug text)`** → `table(id uuid, public_slug text, title text, description text, published_snapshot jsonb, published_at timestamptz)`. Returns the single published funnel for a slug, exposing only public-safe columns. Called by `fetchPublishedFunnelBySlug` for every public page.
- **`public.is_published_funnel(p_funnel_id uuid)`** → `boolean`. Used inside the `funnel_events` / `funnel_responses` insert policies so anon writes don't require any select on `funnels`.

Canonical definitions live in `supabase/migrations/006_repair_public_access.sql`.

## 12. Public Funnel Flow

1. Owner publishes → `funnels.status = 'published'`, `published_snapshot` written, `public_slug` set.
2. Visitor opens `/quiz/public/:slug`.
3. `PublicQuizPage` calls `fetchPublishedFunnelBySlug(slug)` → RPC `get_published_funnel` → renders the snapshot (NOT the draft).
4. On mount, `flushPendingResponses()` retries any previously-failed submissions.
5. `view` event recorded once; `start` event recorded on first interaction.
6. After the last question, the lead form is shown (email required).
7. On submit, the response + lead are inserted into `funnel_responses` (insert WITHOUT select — anon cannot read back).

## 13. Dashboard Flow

- `/app/funnels` (`MyFunnelsPage` → `SavedQuizzesSection`) lists funnels with status and actions.
- Builder at `/app/quiz/:quizId` edits the draft; autosave persists changes; the toolbar publishes/updates and copies the public URL.
- `/app/funnel/:quizId/responses` (`FunnelResponsesPage`) loads analytics via `fetchFunnelAnalytics(supabaseId)`: totals + recent responses + CSV export. Waits for the quizzes context to hydrate before deciding "not found".

## 14. Lead Capture Flow

- `QuizLeadCaptureForm` validates a non-empty email containing `@`.
- `QuizPlayer` collects the lead when `collectLead` is true, then calls `onComplete` with `{ answers, lead, completedAt }`.
- `saveFunnelResponse` inserts the row; on failure it enqueues to `localStorage` (`qf_pending_responses`, capped at 25) and returns false.
- `flushPendingResponses` retries the queue on the next public-page load → leads are not lost on transient errors.

## 15. Deployment Architecture

- **Vercel** static SPA. `vercel.json`: `buildCommand: npm run build`, `outputDirectory: dist`, catch-all rewrite `/(.*) → /index.html`.
- Security headers set: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`; long cache on `/assets/*`.
- Build = `vite build` (Vite tree-shakes; only files reachable from the entry are bundled — stray local files are excluded).

## 16. GitHub Workflow

- **Remote:** `https://github.com/fmarduarte/QuizFlowClean.git`, default branch `main`.
- Commit and push to `main`; Vercel auto-deploys from `main` (production) and builds preview deployments for other branches/PRs.
- Before pushing, run `npm run validate:predeploy` (= `npm run test && npm run build`). Note: `npx tsc --noEmit` currently reports errors ONLY from OneDrive duplicate/orphan files (see Section 22); the production `vite build` is unaffected.
- Database migrations are NOT auto-applied by GitHub/Vercel — they must be applied to Supabase manually (see Sections 19 and 24–27).

## 17. Vercel Workflow

- Connected to the GitHub repo; pushes to `main` trigger production deploys.
- Build command `npm run build`, output `dist`.
- **Environment variables must be set in Vercel project settings** (see Section 18) — they are NOT taken from local `.env`.
- Rollback: use Vercel's "Promote previous deployment" if a deploy regresses.

## 18. Environment Variables Required

Client (must be set in Vercel AND in local `.env` for dev):
- `VITE_SUPABASE_URL` = `https://jqmgpzunpnfkigamtcqx.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = the project's anon/publishable key
- `VITE_SITE_URL` = production site URL (optional; used for SEO/canonical)

Testing/scripts only (local `.env`, never in the client bundle):
- `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD` = a confirmed Supabase account for `scripts/verify-e2e-phase2.mjs`
- `SUPABASE_SERVICE_ROLE_KEY` = optional; lets E2E auto-provision a throwaway user. NEVER expose with a `VITE_` prefix; NEVER ship to the client.

`.env.example` documents the client vars. `.env` is gitignored.

## 19. Applied Migrations

Location: `supabase/migrations/`. Apply in order via Supabase SQL Editor (or `supabase db push`):

1. `001_funnel_briefs.sql` — `funnel_briefs` table + RLS.
2. `002_funnels.sql` — `funnels` table, indexes, RLS (incl. the original broad anon read policy, later dropped).
3. `003_funnel_analytics.sql` — `funnel_events`, `funnel_responses`, status check, RLS.
4. `004_leads_and_public_access.sql` — lead columns, first cut of RPCs + hardened policies.
5. `005_fix_get_published_funnel.sql` — (re)create `get_published_funnel`.
6. `006_repair_public_access.sql` — **canonical, idempotent, self-contained repair**: lead columns, both RPCs (drop+create for the table-returning one), grants, drops broad anon read policy, recreates anon insert policies, reloads schema cache, and verifies. **If unsure of DB state, run 006.**

Note: `002_published_quizzes_and_responses.sql` is a legacy migration creating unused tables. Ignore `002_published_quizzes_and_responses - Copy.sql` (a OneDrive duplicate). The applied/validated state corresponds to migrations 001–006 with 006 as the authoritative public-access definition.

## 20. Validation Results (current validated state)

- **`scripts/verify-public-access.mjs`** → 3/3: `get_published_funnel` callable by anon, `is_published_funnel` present, raw `funnels` blocked for anon.
- **`scripts/verify-e2e-phase2.mjs`** → 16/16: login, create, save draft, edit, publish, immutable snapshot, public URL, public RPC read, anon-read-blocked, HTTP 200, response+lead insert, owner dashboard read, persistence, new-session visibility, cleanup.
- **`scripts/diagnose-response-insert.mjs`** → confirms anon insert succeeds (without select) and is correctly rejected when reading back.
- **`npm run test`** → core suite passes (the funnel/response/preview tests). `npm run build` → green.

How to re-validate later: ensure `.env` has the client vars + confirmed `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD`, then run the three scripts above.

## 21. Known Technical Debt

| Priority | Item |
|---|---|
| P1 | No managed migration pipeline (schema applied by hand → drift risk). Adopt linked Supabase CLI + `supabase db push` + CI `supabase db diff`. |
| P1 | Repository under OneDrive (duplicate/orphan files; see Section 22). |
| P1 | AI generation is a mock (`generateMockFunnelQuestions`). |
| P1 | Billing & credits are mock UI only. |
| P2 | Analytics aggregated client-side; no `complete` event / step drop-off. |
| P2 | No rate-limiting on anonymous inserts. |
| P3 | Single ~875 kB JS chunk; add route-level code-splitting. |
| P3 | `removeQuiz` has no confirmation dialog. |
| P3 | Vestigial `@tanstack/*` dependencies; app uses react-router-dom. |

## 22. OneDrive Risks and Repository Cleanup Plan

**Risk:** The repo lives in `C:\Users\fmduarte\OneDrive - Nokia\Documents\GitHub\QuizFlowClean`. OneDrive periodically creates `… - Copy.tsx/.ts` duplicates of the entire `src/` tree and can resurrect previously-deleted files. These break local `tsc --noEmit` and add stray tests, but do NOT affect the production build (Vite ignores unreferenced files) or Vercel.

**Cleanup plan (recommended):**
1. **Move the repo out of OneDrive** (e.g., `C:\dev\QuizFlowClean`) — the durable fix.
2. Delete all `* - Copy.*` files and the resurrected orphan `quiz-*` stack (e.g., `QuizAnalyticsPanel.tsx`, `QuizSharePanel.tsx`, `QuizStatusBadge.tsx`, `quiz-analytics.ts`, `quiz-responses.ts`, `quiz-status.ts`, `quiz-url.ts`, `QuizPublishPage.tsx`, `QuizResponsesPage.tsx`, `QuizReviewPage.tsx`, `QuizSharePage.tsx`, `use-active-section.ts`). They are provably unused (build excludes them).
3. Re-run `npx tsc --noEmit` and `npm run test` to confirm green.
4. Commit the cleaned tree to `main`.

(As of this handbook, no files were deleted — per owner instruction.)

## 23. What Must Not Be Changed

- **RPC signature `get_published_funnel(p_slug text)`** and its returned column set — the public page depends on it exactly.
- **`is_published_funnel(p_funnel_id uuid)`** — referenced by insert policies; replace only with `create or replace` (never drop while policies depend on it).
- **The dropped broad anon read policy** on `funnels` — do NOT re-add it (it leaks `draft_data`/`user_id`).
- **Insert-without-select pattern** in `response-store.ts` — anon has no select policy on `funnel_responses`; adding `.select()` will fail with an RLS error.
- **Immutable published snapshot** — the public page must read `published_snapshot`, never `draft_data`.
- **Unique constraint `(user_id, client_quiz_id)`** — autosave/publish upserts rely on it.
- **Anon key only in the client** — never embed the service-role key in frontend code.

## 24. Recovery Procedure If Local Files Are Lost

1. Install Node.js 20+ and Git.
2. `git clone https://github.com/fmarduarte/QuizFlowClean.git` (outside OneDrive).
3. `npm install`.
4. Create `.env` from `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (from Supabase → Project Settings → API).
5. `npm run dev` to run locally; `npm run build` to verify the production build.
6. The database already exists in Supabase (see Section 27) — no migration needed unless restoring a fresh project.

## 25. Recovery Procedure From GitHub

- The full source of truth is `origin/main` at `https://github.com/fmarduarte/QuizFlowClean.git`.
- To restore: clone, `npm install`, add `.env`, build. Migrations are in `supabase/migrations/` within the repo.
- To restore a previous state: `git log`, then `git checkout <commit>` or revert as needed.

## 26. Recovery Procedure From Vercel

- Vercel holds the deployment history and the production environment variables.
- To restore production: reconnect the GitHub repo in Vercel, set env vars (Section 18), trigger a deploy from `main`.
- To roll back: Vercel dashboard → Deployments → promote a previous successful deployment.
- Vercel is NOT a source of truth for code or DB — use GitHub for code and Supabase for data.

## 27. Recovery Procedure From Supabase

- **Data lives in Supabase** (`jqmgpzunpnfkigamtcqx`). Code recovery does not recreate data.
- To rebuild schema on a fresh project: run migrations `001 → 006` in order in the SQL Editor; running `006_repair_public_access.sql` guarantees the public-access functions/policies are correct (idempotent).
- After applying functions, if the public RPC 404s, reload the API: `notify pgrst, 'reload schema';` or Dashboard → Project Settings → API → Reload schema cache.
- Verify with `scripts/verify-public-access.mjs` (expect 3/3) and `scripts/verify-e2e-phase2.mjs` (expect 16/16).
- For backups, enable Supabase scheduled backups / PITR on the project (recommended before scaling).

## 28. Production Readiness Assessment

- **Score: 90/100.** Core lead-capture product is correct, persistent, and secure; build is green; flows validated live.
- Deductions: mock AI (−), mock billing (−), client-side analytics, no anon rate-limiting, dev-environment hygiene (OneDrive), no migration CI.
- **Verdict:** Launchable now as a lead-capture MVP. Add backups/PITR and basic rate-limiting before a high-traffic launch.

## 29. Monetization Readiness Assessment

- **Not ready.** Billing UI (`BillingSection`) is hardcoded; there is no Stripe integration and no credits/usage metering.
- Required before charging: real Stripe billing, a usage/credits ledger, plan gating, and real (metered) AI generation.
- Effort estimate: a focused sprint for Stripe + credits once AI generation is real.

## 30. Recommended Future Roadmap

1. Harden the DB delivery pipeline (linked CLI + CI drift check) — eliminates the top operational risk.
2. Lead delivery — email-on-new-lead + webhook/Zapier — converts captured leads into value.
3. Real AI generation — Supabase Edge Function (JWT-validated) → OpenAI.
4. Scoring/outcomes engine — weighted results/segmentation (core differentiator).
5. Branding + embeds — appearance, custom domain, inline/popup embed.
6. Server-side analytics — aggregate RPC + per-step drop-off + `complete` event.
7. Stripe billing + usage credits — monetization.

---

# RESUME GUIDE

### Where development stopped
At a fully validated lead-capture MVP. The last work hardened public access (migrations 005/006), fixed a test-script bug, made lead storage durable, and ran the full live E2E (16/16). No code changes were pending; no P0 blockers remain.

### What is complete
Auth, funnel CRUD, autosave, publishing with immutable snapshot, public funnel page via RPC, lead capture, response/event storage, owner dashboard with analytics + CSV export, hardened RLS, and validated RPCs — all confirmed live.

### What remains
- Real AI generation (currently mock).
- Billing + credits (currently mock).
- Operational hardening: migration CI, Supabase backups/PITR, anon rate-limiting.
- Repo hygiene: move out of OneDrive; purge duplicate/orphan files.
- Analytics: server-side aggregation + step drop-off.

### Next sprint (first thing to do on resume)
1. Move the repo out of OneDrive; purge `* - Copy.*` and orphan `quiz-*` files; confirm `tsc` + tests green; commit.
2. Link the Supabase CLI to the project; commit the schema; add a CI drift check.
3. Re-run the three validation scripts to confirm the live state is unchanged.

### Next 30 days roadmap
- Week 1: Repo hygiene + DB pipeline hardening + backups/PITR enabled.
- Week 2: Lead delivery (email-on-lead + one webhook).
- Week 3–4: Real AI generation via Edge Function (JWT-validated → OpenAI), with usage logging.

### Priority order of future development
DB pipeline & backups → Lead delivery → Real AI → Scoring engine → Branding/embeds → Server-side analytics → Billing/credits.

### Technical risks
- **Schema/code drift** (manual migrations) — highest risk; mitigated by CLI + CI.
- **OneDrive duplication** — breaks local tooling; mitigated by relocating the repo.
- **No anonymous rate-limiting** — spam exposure at scale.
- **Client-side analytics** — won't scale with volume.
- **No DB backups configured** — enable PITR before scaling.

### Business risks
- Mock AI/billing means no monetization yet and a thin differentiation vs. Typeform/ScoreApp/Involve.me/Bucket.io until scoring + real AI ship.
- Leads are currently trapped in-app (no delivery) — reduces immediate customer value until lead delivery ships.

### Launch recommendations
- **Safe to launch now** as a free/beta lead-capture tool to gather users and feedback.
- Before a paid or high-traffic launch: enable Supabase backups/PITR, add anon rate-limiting, ship lead delivery (so leads are actionable), and replace mock AI with the real Edge Function.
- Keep the security invariants in Section 23 intact at all times.

---

*End of handbook. Re-validate with the three scripts in Section 20 before resuming feature work.*
