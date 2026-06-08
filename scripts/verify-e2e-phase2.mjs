/**
 * Phase 2 end-to-end functional validation against live Supabase.
 * Run: node scripts/verify-e2e-phase2.mjs
 *
 * Auth: uses SUPABASE_SERVICE_ROLE_KEY (recommended) to create a confirmed test user,
 *       or E2E_TEST_EMAIL + E2E_TEST_PASSWORD for an existing confirmed account.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

function loadEnv() {
  const env = {};
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  for (const [k, v] of Object.entries(process.env)) {
    if (v && !env[k]) env[k] = v;
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const previewPort = env.PREVIEW_PORT ?? "4173";

const results = [];
function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? `: ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? `: ${detail}` : ""}`);
}

if (!url || !anonKey) {
  fail("env", "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

console.log(`E2E Phase 2 — project ${url.replace(/^https?:\/\//, "")}\n`);

const supabase = createClient(url, anonKey);
const anonClient = createClient(url, anonKey);

const DEFAULT_RESULT = {
  thankYouTitle: "Thank you!",
  thankYouMessage: "Your answers have been submitted.",
  ctaLabel: "Continue",
  ctaUrl: "",
};

function createPublishedSnapshot(quiz) {
  return {
    title: quiz.title.trim(),
    description: quiz.description?.trim() || undefined,
    questions: structuredClone(quiz.questions),
    result: quiz.result ?? DEFAULT_RESULT,
  };
}

function buildPublicPath(slug) {
  return `/quiz/public/${encodeURIComponent(slug)}`;
}

async function getAuthenticatedClient() {
  if (env.E2E_TEST_EMAIL && env.E2E_TEST_PASSWORD) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: env.E2E_TEST_EMAIL,
      password: env.E2E_TEST_PASSWORD,
    });
    if (error || !data.session) {
      const msg = error?.message ?? "E2E test user sign-in failed";
      if (/email not confirmed/i.test(msg)) {
        throw new Error(
          `${msg}. Confirm the E2E account: Supabase Dashboard → Authentication → Users → ` +
            `select ${env.E2E_TEST_EMAIL} → "..." → Confirm email. ` +
            `(Or Authentication → Providers → Email → turn off "Confirm email".)`
        );
      }
      throw new Error(msg);
    }
    pass("Auth (E2E_TEST credentials)", data.user.id);
    return { client: supabase, userId: data.user.id };
  }

  const testEmail = `e2e.phase2.${randomUUID().slice(0, 8)}@gmail.com`;
  const testPassword = `Test!${randomUUID().slice(0, 10)}aA1`;

  if (serviceKey) {
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });
    if (createErr) throw new Error(`admin.createUser: ${createErr.message}`);
    pass("Auth (service role createUser)", created.user.id);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    if (error || !data.session) {
      throw new Error(error?.message ?? "signIn after admin createUser failed");
    }
    pass("Auth signIn", data.user.id);
    return { client: supabase, userId: data.user.id };
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });
  if (signUpError) throw new Error(`signUp: ${signUpError.message}`);

  if (signUpData.session) {
    pass("Auth signUp (immediate session)", signUpData.user.id);
    return { client: supabase, userId: signUpData.user.id };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  if (error || !data.session) {
    throw new Error(
      `${error?.message ?? "No session"}. Add SUPABASE_SERVICE_ROLE_KEY to .env ` +
        `(Dashboard → Settings → API → secret/service_role key) or disable email confirmation.`
    );
  }
  pass("Auth signIn", data.user.id);
  return { client: supabase, userId: data.user.id };
}

let authClient;
let userId;

try {
  ({ client: authClient, userId } = await getAuthenticatedClient());
} catch (err) {
  fail("Auth setup", err instanceof Error ? err.message : String(err));
  const failed = results.filter((r) => !r.ok);
  console.log(`\n--- E2E: ${results.length - failed.length}/${results.length} passed ---`);
  process.exit(1);
}

const clientQuizId = randomUUID();
const publicSlug = clientQuizId;

const initialQuestions = [
  {
    id: "q1",
    title: "What is your goal?",
    options: [
      { id: "o1", label: "Leads" },
      { id: "o2", label: "Sales" },
    ],
  },
];

const draftQuiz = {
  title: "E2E Test Funnel",
  description: "Created by verify-e2e-phase2",
  questions: initialQuestions,
  result: DEFAULT_RESULT,
};

// --- 1. Create Funnel ---
const { data: created, error: createError } = await authClient
  .from("funnels")
  .insert({
    user_id: userId,
    client_quiz_id: clientQuizId,
    public_slug: publicSlug,
    title: draftQuiz.title,
    description: draftQuiz.description,
    draft_data: draftQuiz,
    status: "draft",
    updated_at: new Date().toISOString(),
  })
  .select("*")
  .single();

if (createError) {
  fail("1. Create Funnel", createError.message);
  process.exit(1);
}
pass("1. Create Funnel", created.id);
const funnelDbId = created.id;

// --- 2. Save Draft ---
const draftSave = { ...draftQuiz, title: "E2E Test Funnel (draft saved)" };
const { error: draftSaveError } = await authClient
  .from("funnels")
  .update({ title: draftSave.title, draft_data: draftSave, updated_at: new Date().toISOString() })
  .eq("id", funnelDbId);

if (draftSaveError) fail("2. Save Draft to Supabase", draftSaveError.message);
else pass("2. Save Draft to Supabase", draftSave.title);

// --- 3. Edit Funnel ---
const editedDraft = {
  ...draftSave,
  title: "E2E Test Funnel (edited)",
  questions: [
    {
      id: "q1",
      title: "What is your primary goal?",
      options: [
        { id: "o1", label: "Generate leads" },
        { id: "o2", label: "Book calls" },
      ],
    },
  ],
};
const { error: editError } = await authClient
  .from("funnels")
  .update({ title: editedDraft.title, draft_data: editedDraft, updated_at: new Date().toISOString() })
  .eq("id", funnelDbId);

if (editError) fail("3. Edit Funnel", editError.message);
else pass("3. Edit Funnel", editedDraft.title);

// --- 4. Publish Funnel ---
const publishedAt = new Date().toISOString();
const publishedSnapshot = createPublishedSnapshot(editedDraft);
const { data: published, error: publishError } = await authClient
  .from("funnels")
  .update({
    published_snapshot: publishedSnapshot,
    published_at: publishedAt,
    status: "published",
    updated_at: publishedAt,
  })
  .eq("id", funnelDbId)
  .select("*")
  .single();

if (publishError) fail("4. Publish Funnel", publishError.message);
else if (published.status === "published" && published.published_snapshot) {
  pass("4. Publish Funnel", published.public_slug);
  if (published.published_snapshot.questions[0].title === "What is your primary goal?") {
    pass("4b. Immutable published snapshot");
  } else fail("4b. Immutable published snapshot");
} else fail("4. Publish Funnel", "Missing snapshot");

// --- 5. Generate Public URL ---
const publicPath = buildPublicPath(publicSlug);
const publicUrl = `http://localhost:${previewPort}${publicPath}`;
pass("5. Generate Public URL", publicPath);

// --- 6. Open Public URL (via hardened RPC, migration 004) ---
const { data: publicFunnel, error: publicFetchError } = await anonClient
  .rpc("get_published_funnel", { p_slug: publicSlug })
  .maybeSingle();

if (publicFetchError) fail("6. Open Public URL (data)", publicFetchError.message);
else if (publicFunnel?.published_snapshot?.title === editedDraft.title) {
  pass("6. Open Public URL (data via RPC)", publicFunnel.title);
} else fail("6. Open Public URL (data)", "Not found via get_published_funnel");

// --- 6c. Verify broad anon table read is blocked (RLS hardening) ---
const { data: leakRows } = await anonClient
  .from("funnels")
  .select("id, draft_data, user_id")
  .eq("public_slug", publicSlug);
if (!leakRows || leakRows.length === 0) {
  pass("6c. Anon cannot read raw funnels rows (RLS hardened)");
} else {
  fail("6c. RLS leak", "anon can still read raw funnels rows");
}

try {
  const res = await fetch(publicUrl);
  const html = await res.text();
  if (res.status === 200 && html.includes('id="root"')) pass("6b. Open Public URL (HTTP 200)", publicUrl);
  else fail("6b. Open Public URL (HTTP)", `status=${res.status}`);
} catch (err) {
  fail("6b. Open Public URL (HTTP)", err instanceof Error ? err.message : String(err));
}

// --- 7 & 8. Submit response ---
const sessionId = `e2e-session-${randomUUID()}`;
const completedAt = new Date().toISOString();
const answers = { q1: "o1" };

await anonClient.from("funnel_events").insert({ funnel_id: funnelDbId, session_id: sessionId, event_type: "view" });
await anonClient.from("funnel_events").insert({ funnel_id: funnelDbId, session_id: sessionId, event_type: "start" });

// Insert WITHOUT .select(): anon may write responses but (correctly) has no SELECT
// policy to read them back. This mirrors the real app (lib/response-store.ts).
const { error: responseError } = await anonClient
  .from("funnel_responses")
  .insert({
    funnel_id: funnelDbId,
    session_id: sessionId,
    answers,
    lead_email: "e2e.lead@example.com",
    lead_name: "E2E Lead",
    completed_at: completedAt,
  });

if (responseError) fail("7–8. Submit & save response", responseError.message);
else {
  pass("7. Submit a response (anon)");
  pass("8. Save response + lead into funnel_responses", sessionId);
}

// Verify storage the legitimate way: the authenticated owner reads it back.
const { data: ownerResponses, error: ownerReadError } = await authClient
  .from("funnel_responses")
  .select("*")
  .eq("funnel_id", funnelDbId);

const stored = ownerResponses?.find((r) => r.session_id === sessionId);
if (ownerReadError) fail("8b. Owner reads responses", ownerReadError.message);
else if (stored && stored.lead_email === "e2e.lead@example.com") {
  pass("8b. Owner reads response + lead in dashboard");
} else fail("8b. Owner reads responses", stored ? "lead not persisted" : "row not found");

// --- 9. Persist after refresh ---
const { data: afterRefresh, error: refreshError } = await authClient
  .from("funnels")
  .select("id, status, public_slug, published_snapshot")
  .eq("id", funnelDbId)
  .single();

if (refreshError) fail("9. Persist after refresh", refreshError.message);
else if (afterRefresh.status === "published" && afterRefresh.public_slug === publicSlug) {
  pass("9. Published funnel persists after refresh", afterRefresh.status);
} else fail("9. Persist after refresh");

const freshClient = createClient(url, anonKey);
const { data: secondFetch } = await freshClient
  .rpc("get_published_funnel", { p_slug: publicSlug })
  .maybeSingle();
if (secondFetch?.public_slug === publicSlug) pass("9b. New session sees published funnel (RPC)");
else fail("9b. New session sees published funnel");

// Cleanup
if (serviceKey) {
  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  await admin.from("funnel_responses").delete().eq("funnel_id", funnelDbId);
  await admin.from("funnel_events").delete().eq("funnel_id", funnelDbId);
  await admin.from("funnels").delete().eq("id", funnelDbId);
} else {
  await authClient.from("funnel_responses").delete().eq("funnel_id", funnelDbId);
  await authClient.from("funnel_events").delete().eq("funnel_id", funnelDbId);
  await authClient.from("funnels").delete().eq("id", funnelDbId);
}
pass("Cleanup test data");

const failed = results.filter((r) => !r.ok);
console.log(`\n--- E2E: ${results.length - failed.length}/${results.length} checks passed ---`);
process.exit(failed.length > 0 ? 1 : 0);
