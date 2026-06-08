/**
 * Pinpoints why anon INSERT into funnel_responses is rejected.
 * Signs in as the E2E owner, publishes a funnel, then as anon:
 *   - calls is_published_funnel(funnel_id) and prints the result
 *   - attempts the insert and prints the full error
 *   - lists the live policies on funnel_responses (pg_policies is world-readable)
 * Cleans up afterwards. Run: node scripts/diagnose-response-insert.mjs
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

function loadEnv() {
  const env = {};
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  for (const [k, v] of Object.entries(process.env)) if (v && !env[k]) env[k] = v;
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

const owner = createClient(url, anonKey);
const anon = createClient(url, anonKey);

const { data: signIn, error: signInErr } = await owner.auth.signInWithPassword({
  email: env.E2E_TEST_EMAIL,
  password: env.E2E_TEST_PASSWORD,
});
if (signInErr || !signIn.session) {
  console.error("sign-in failed:", signInErr?.message);
  process.exit(1);
}
const userId = signIn.user.id;
console.log("owner:", userId);

const clientQuizId = randomUUID();
const slug = clientQuizId;
const snapshot = {
  title: "Diag Funnel",
  questions: [{ id: "q1", title: "Q?", options: [{ id: "o1", label: "A" }] }],
  result: { thankYouTitle: "ty", thankYouMessage: "", ctaLabel: "", ctaUrl: "" },
};

const { data: funnel, error: createErr } = await owner
  .from("funnels")
  .insert({
    user_id: userId,
    client_quiz_id: clientQuizId,
    public_slug: slug,
    title: "Diag Funnel",
    draft_data: snapshot,
    published_snapshot: snapshot,
    published_at: new Date().toISOString(),
    status: "published",
    updated_at: new Date().toISOString(),
  })
  .select("id, status")
  .single();

if (createErr) {
  console.error("create failed:", createErr.message);
  process.exit(1);
}
const funnelId = funnel.id;
console.log("published funnel:", funnelId, "status:", funnel.status);

// A) What does is_published_funnel return for anon?
const { data: isPub, error: isPubErr } = await anon.rpc("is_published_funnel", {
  p_funnel_id: funnelId,
});
console.log("\nanon is_published_funnel(funnelId) =>", isPub, isPubErr ? `ERR: ${isPubErr.message}` : "");

// A2) And for the authenticated owner?
const { data: isPubOwner } = await owner.rpc("is_published_funnel", { p_funnel_id: funnelId });
console.log("owner is_published_funnel(funnelId) =>", isPubOwner);

// B) Attempt the anon insert WITHOUT select (how the real app does it).
const { error: insErr } = await anon.from("funnel_responses").insert({
  funnel_id: funnelId,
  session_id: "diag-" + randomUUID(),
  answers: { q1: "o1" },
  completed_at: new Date().toISOString(),
});
console.log("\n[no .select()] anon insert =>", insErr ? `REJECTED: ${insErr.message} (code ${insErr.code})` : "OK");

// B2) Attempt the anon insert WITH .select().single() (how the E2E script does it).
const { error: insSelErr } = await anon
  .from("funnel_responses")
  .insert({
    funnel_id: funnelId,
    session_id: "diag2-" + randomUUID(),
    answers: { q1: "o1" },
    completed_at: new Date().toISOString(),
  })
  .select("*")
  .single();
console.log("[with .select()] anon insert =>", insSelErr ? `REJECTED: ${insSelErr.message} (code ${insSelErr.code})` : "OK");

// C) Inspect live policies (pg_policies is readable).
const { data: policies, error: polErr } = await anon
  .from("pg_policies")
  .select("policyname, cmd, roles, with_check, qual")
  .eq("schemaname", "public")
  .eq("tablename", "funnel_responses");
console.log("\nfunnel_responses policies:");
if (polErr) console.log("  (could not read pg_policies:", polErr.message + ")");
else for (const p of policies) console.log("  -", JSON.stringify(p));

// Cleanup
await owner.from("funnel_responses").delete().eq("funnel_id", funnelId);
await owner.from("funnels").delete().eq("id", funnelId);
console.log("\ncleanup done");
