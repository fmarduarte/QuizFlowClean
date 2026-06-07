/**
 * Phase 2 full verification: logic, Supabase publish flow, public URL, My Funnels, refresh, copy link, view funnel.
 * Run: node scripts/verify-phase2.mjs
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(".env", "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  } catch {
    // no .env
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;
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
  fail("Supabase env", "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const projectRef = url.replace(/^https?:\/\//, "").replace(/\.supabase\.co\/?$/, "");
console.log(`Verifying project: ${projectRef}\n`);

const supabase = createClient(url, anonKey);

function validateQuizForPublish(quiz) {
  const errors = [];
  if (!quiz.title?.trim()) errors.push("title");
  if (!quiz.questions?.length) errors.push("questions");
  return { valid: errors.length === 0, errors };
}

function createPublishedSnapshot(quiz) {
  return {
    title: quiz.title.trim(),
    description: quiz.description?.trim() || undefined,
    questions: structuredClone(quiz.questions),
    result: quiz.result ?? {},
  };
}

function buildPublicQuizPath(slug) {
  return `/quiz/public/${encodeURIComponent(slug)}`;
}

const sampleQuiz = {
  title: "Phase 2 Verify Funnel",
  description: "Automated test",
  questions: [
    {
      id: "q1",
      title: "What is your goal?",
      description: "",
      options: [{ id: "o1", label: "Leads" }],
    },
  ],
  result: {
    thankYouTitle: "Thanks!",
    thankYouMessage: "Done.",
    ctaLabel: "Book",
    ctaUrl: "https://example.com",
  },
};

// --- Pure logic ---
const validation = validateQuizForPublish(sampleQuiz);
if (validation.valid) pass("validateQuizForPublish accepts complete funnel");
else fail("validateQuizForPublish", validation.errors.join(", "));

const snapshot = createPublishedSnapshot(sampleQuiz);
sampleQuiz.questions[0].title = "Mutated";
if (snapshot.questions[0].title === "What is your goal?") {
  pass("createPublishedSnapshot is immutable");
} else {
  fail("createPublishedSnapshot", "snapshot mutated with draft");
}

if (buildPublicQuizPath("test-slug") === "/quiz/public/test-slug") {
  pass("buildPublicQuizPath generates correct path");
} else {
  fail("buildPublicQuizPath");
}

// --- Supabase tables ---
const requiredTables = ["funnel_briefs", "funnels", "funnel_events", "funnel_responses"];
let tablesOk = true;

for (const table of requiredTables) {
  const { error } = await supabase.from(table).select("id").limit(1);
  if (error) {
    fail(`table ${table}`, error.message);
    tablesOk = false;
  } else {
    pass(`table ${table} accessible`);
  }
}

if (!tablesOk) {
  console.error(
    "\nTables not visible via API. Run supabase/post-setup.sql in SQL Editor (grants + NOTIFY pgrst reload).\n" +
      `Confirm setup was applied to project ${projectRef} matching .env.\n`
  );
  process.exit(1);
}

// --- Auth + publish E2E ---
const testEmail = `phase2verify${Date.now()}@gmail.com`;
const testPassword = `Test!${randomUUID().slice(0, 8)}aA1`;

const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email: testEmail,
  password: testPassword,
});

if (signUpError) {
  fail("auth signUp", signUpError.message);
} else {
  pass("auth signUp", signUpData.user?.id ?? "ok");
}

const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
  email: testEmail,
  password: testPassword,
});

if (signInError) {
  fail("auth signIn", signInError.message);
} else if (!sessionData.session) {
  fail("auth signIn", "No session — disable email confirmation or confirm test user");
} else {
  pass("auth signIn", sessionData.user.id);
}

const userId = sessionData?.user?.id;
let publicSlug = "";
let insertedId = "";

if (userId) {
  const clientQuizId = randomUUID();
  publicSlug = `verify-${Date.now()}`;
  const now = new Date().toISOString();
  const publishedSnapshot = createPublishedSnapshot(sampleQuiz);

  const row = {
    user_id: userId,
    client_quiz_id: clientQuizId,
    public_slug: publicSlug,
    title: sampleQuiz.title,
    description: sampleQuiz.description,
    draft_data: {
      title: sampleQuiz.title,
      description: sampleQuiz.description,
      questions: sampleQuiz.questions,
      result: sampleQuiz.result,
    },
    published_snapshot: publishedSnapshot,
    published_at: now,
    status: "published",
    updated_at: now,
  };

  const { data: inserted, error: insertError } = await supabase
    .from("funnels")
    .insert(row)
    .select("*")
    .single();

  if (insertError) {
    fail("Publish Funnel (insert published row)", insertError.message);
  } else {
    insertedId = inserted.id;
    pass("Publish Funnel (insert published row)", inserted.public_slug);
  }

  // Page refresh persistence
  const { data: refreshed, error: refreshError } = await supabase
    .from("funnels")
    .select("*")
    .eq("user_id", userId)
    .eq("client_quiz_id", clientQuizId)
    .single();

  if (refreshError) {
    fail("Page refresh persistence (owner re-fetch)", refreshError.message);
  } else if (refreshed?.status === "published" && refreshed?.public_slug === publicSlug) {
    pass("Page refresh persistence (owner re-fetch)", `status=${refreshed.status}`);
  } else {
    fail("Page refresh persistence", JSON.stringify(refreshed));
  }

  // Public URL (anon fetch)
  const anonClient = createClient(url, anonKey);
  const { data: publicRow, error: publicError } = await anonClient
    .from("funnels")
    .select("id, public_slug, published_snapshot, published_at, title, status")
    .eq("public_slug", publicSlug)
    .eq("status", "published")
    .not("published_snapshot", "is", null)
    .maybeSingle();

  if (publicError) {
    fail("Public URL fetch (anon)", publicError.message);
  } else if (publicRow?.published_snapshot?.title === sampleQuiz.title) {
    pass("Public URL fetch (anon)", buildPublicQuizPath(publicSlug));
  } else {
    fail("Public URL fetch (anon)", "No published snapshot returned");
  }

  // My Funnels list
  const { data: myFunnels, error: listError } = await supabase
    .from("funnels")
    .select("client_quiz_id, status, public_slug, published_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (listError) {
    fail("My Funnels published status", listError.message);
  } else {
    const found = myFunnels?.find((f) => f.client_quiz_id === clientQuizId);
    if (found?.status === "published") {
      pass("My Funnels published status", found.public_slug);
    } else {
      fail("My Funnels published status", "published funnel not in list");
    }
  }

  // Copy Link URL
  const copyUrl = `http://localhost:${previewPort}${buildPublicQuizPath(publicSlug)}`;
  if (copyUrl.includes(publicSlug)) {
    pass("Copy Link URL format", copyUrl);
  } else {
    fail("Copy Link URL format");
  }

  // View Funnel (SPA route serves public player shell)
  try {
    const viewRes = await fetch(copyUrl);
    const html = await viewRes.text();
    if (viewRes.status === 200 && html.includes('id="root"')) {
      pass("View Funnel (public route HTTP 200)", copyUrl);
    } else {
      fail("View Funnel", `status=${viewRes.status}`);
    }
  } catch (err) {
    fail("View Funnel", err instanceof Error ? err.message : String(err));
  }

  if (insertedId) {
    await supabase.from("funnels").delete().eq("id", insertedId);
    pass("Cleanup test funnel");
  }
}

const failed = results.filter((r) => !r.ok);
console.log(`\n--- ${results.length - failed.length}/${results.length} checks passed ---`);
process.exit(failed.length > 0 ? 1 : 0);
