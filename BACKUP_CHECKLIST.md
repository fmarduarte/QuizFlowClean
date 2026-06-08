# BACKUP CHECKLIST — QuizFlow AI

> Run through this before stepping away. Reflects the actual git state at time of writing.
> Companion docs: `START_HERE.md`, `claude.md`, `PROJECT_HANDBOOK.md`.

## ⚠️ Critical gaps found in current git state (fix before you leave)

1. **Database migrations are NOT committed.** `001_funnel_briefs.sql`, `004_leads_and_public_access.sql`, `005_fix_get_published_funnel.sql`, `006_repair_public_access.sql` are **untracked**. These define the live DB (RPCs + RLS). If the laptop is lost now, they are gone. **Commit them.**
2. **Backup/handbook docs are untracked:** `START_HERE.md`, `claude.md`, `PROJECT_HANDBOOK.md`, `BACKUP_CHECKLIST.md`. **Commit them.**
3. **`dist/` is tracked but should not be** (it's in `.gitignore` yet still in the index). Run `git rm -r --cached dist` once, then commit.
4. **OneDrive `… - Copy.*` files** — some are already tracked in git (e.g. `BuilderToolbar - Copy.tsx`). These should be removed from the repo (`git rm`) and never committed. (Owner asked not to delete files in the working tree — but they should at least be untracked from git.)

Branch status: `main` is **even with `origin/main`** (0 ahead / 0 behind) — all *committed* work is pushed, but the items above are uncommitted/untracked and therefore NOT backed up.

---

## 1. Files that MUST be committed

**Database (highest priority — currently untracked):**
- `supabase/migrations/001_funnel_briefs.sql`
- `supabase/migrations/004_leads_and_public_access.sql`
- `supabase/migrations/005_fix_get_published_funnel.sql`
- `supabase/migrations/006_repair_public_access.sql`
- (already tracked: `002_funnels.sql`, `003_funnel_analytics.sql`)

**Documentation:**
- `START_HERE.md`, `claude.md`, `PROJECT_HANDBOOK.md`, `BACKUP_CHECKLIST.md`

**Application source changes (this session's reliability/security fixes):**
- `src/lib/funnel-store.ts`, `src/lib/response-store.ts`, `src/lib/quiz-utils.ts`, `src/lib/auth-redirect.ts`
- `src/context/QuizzesContext.tsx`
- `src/components/quiz/QuizPlayer.tsx`, `src/components/auth/AuthRequiredModal.tsx`
- `src/components/builder/BuilderToolbar.tsx`, `src/components/builder/QuizBuilder.tsx`, `src/components/builder/QuizLivePreview.test.tsx`
- `src/pages/app/FunnelResponsesPage.tsx`, `src/pages/app/QuizBuilderPage.tsx`
- `src/pages/auth/SignupPage.tsx`, `src/pages/public/PublicQuizPage.tsx`
- `src/hooks/use-autosave.ts`, `src/types/quiz.ts`
- `src/lib/response-store.test.ts` (new test)
- New real components: `src/components/app/onboarding/ConversationalInputStep.tsx`, `src/components/app/onboarding/GoalOptionList.tsx`

**Validation scripts:**
- `scripts/verify-public-access.mjs`, `scripts/verify-e2e-phase2.mjs`, `scripts/diagnose-response-insert.mjs`

**Public assets:**
- `public/` (e.g. `site.webmanifest`, `sitemap.xml`)

## 2. Files that must NOT be committed

- **`.env`** (contains secrets) — gitignored. Keep a private copy elsewhere (password manager).
- **`node_modules/`** — gitignored.
- **`dist/`** — build output; gitignored (also remove from index: `git rm -r --cached dist`).
- **`.vite/`, `.vercel/`** — caches/local config; gitignored.
- **All `… - Copy.tsx/.ts/.css/.sql` files** — OneDrive duplicates (junk). Includes `supabase/migrations/002_published_quizzes_and_responses - Copy.sql`.
- **Transient script outputs:** `scripts/audit-report.json`, `scripts/deletion-log.json` (optional — regenerable; skip).
- **Orphan/dead `quiz-*` files** if they reappear (unused; build excludes them).

## 3. Environment variables to preserve

Store these securely (password manager) — `.env` is not in git.

| Variable | Where used | Value source |
|---|---|---|
| `VITE_SUPABASE_URL` | client + scripts | `https://jqmgpzunpnfkigamtcqx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | client + scripts | Supabase → Settings → API (anon/publishable) |
| `VITE_SITE_URL` | client (optional, SEO) | production domain |
| `E2E_TEST_EMAIL` | test scripts only | a confirmed Supabase account |
| `E2E_TEST_PASSWORD` | test scripts only | that account's password |
| `SUPABASE_SERVICE_ROLE_KEY` | optional, scripts only | Supabase → Settings → API (secret) — NEVER in client / NEVER `VITE_`-prefixed |

These must ALSO be set in **Vercel → Project → Settings → Environment Variables** (Vercel does not read local `.env`): at minimum `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`.

## 4. Supabase project identifiers

- **Project ref:** `jqmgpzunpnfkigamtcqx`
- **URL:** `https://jqmgpzunpnfkigamtcqx.supabase.co`
- **Exposed schema:** `public`
- **Auth:** email/password, **email confirmation ENABLED**; add reset redirect URLs for prod + `http://localhost:5173/reset-password`
- **Live objects:** tables `funnels`, `funnel_events`, `funnel_responses`, `funnel_briefs`; RPCs `get_published_funnel(text)`, `is_published_funnel(uuid)` (canonical SQL in `006`)
- **Recommended:** enable scheduled backups / PITR before scaling.

## 5. Vercel project identifiers

- Connected to GitHub repo `fmarduarte/QuizFlowClean`, deploys from `main`.
- Build command: `npm run build` · Output directory: `dist` · SPA rewrite `/(.*) → /index.html` (see `vercel.json`).
- Environment variables configured in Vercel project settings (see §3).
- Rollback: Vercel → Deployments → promote a previous successful deployment.

## 6. GitHub branch status

- **Remote:** `https://github.com/fmarduarte/QuizFlowClean.git`
- **Default branch:** `main`
- **Current:** `main` even with `origin/main` (committed work is pushed).
- **Action required:** commit + push the untracked items in §1 (especially migrations 004/005/006) so they are backed up remotely.

### Suggested one-time commit (review first)
```
git rm -r --cached dist
git add supabase/migrations/001_funnel_briefs.sql supabase/migrations/004_leads_and_public_access.sql \
        supabase/migrations/005_fix_get_published_funnel.sql supabase/migrations/006_repair_public_access.sql
git add START_HERE.md claude.md PROJECT_HANDBOOK.md BACKUP_CHECKLIST.md
git add scripts/verify-public-access.mjs scripts/verify-e2e-phase2.mjs scripts/diagnose-response-insert.mjs
git add src/ public/
git commit -m "Backup: public-access migrations, reliability fixes, handbook docs"
git push origin main
```
Do NOT `git add .` blindly — it would stage the OneDrive `… - Copy` junk. Stage explicitly or clean those first.

## 7. Recovery steps if the laptop is lost

1. New machine: install **Node.js 20+** and **Git**.
2. `git clone https://github.com/fmarduarte/QuizFlowClean.git` into a NON-OneDrive path (e.g. `C:\dev\QuizFlowClean`).
3. `npm install`.
4. Recreate `.env` from your password manager (the §3 variables); or copy `.env.example` and fill `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` from Supabase → Settings → API.
5. `npm run dev` to run locally; `npm run build` to verify production build.
6. **Code** = GitHub. **Data** = Supabase (`jqmgpzunpnfkigamtcqx`) — already live; nothing to restore unless rebuilding a fresh project (then run migrations `001 → 006`, with `006` guaranteeing correct RPCs/RLS; reload schema cache).
7. **Deploy** = reconnect repo in Vercel, set env vars, deploy from `main`.
8. Verify: `node scripts/verify-public-access.mjs` (3/3) and `node scripts/verify-e2e-phase2.mjs` (16/16).

---

*Backup is only real once §1 is committed and pushed to `origin/main`. Until then, the public-access migrations exist solely on this laptop.*
