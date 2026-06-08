/**
 * Anon-only validation of the public access surface (migration 004).
 * Runs without auth. Verifies:
 *   - get_published_funnel RPC exists and is callable by anon
 *   - RPC returns no row for an unknown slug (no error/leak)
 *   - anon SELECT on raw funnels returns nothing (RLS hardened)
 * Run: node scripts/verify-public-access.mjs
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
  for (const [k, v] of Object.entries(process.env)) if (v && !env[k]) env[k] = v;
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

const results = [];
const pass = (n, d = "") => { results.push(true); console.log(`✓ ${n}${d ? `: ${d}` : ""}`); };
const fail = (n, d = "") => { results.push(false); console.error(`✗ ${n}${d ? `: ${d}` : ""}`); };

if (!url || !anonKey) { fail("env", "Missing Supabase URL/anon key"); process.exit(1); }

console.log(`Public access probe — ${url.replace(/^https?:\/\//, "")}\n`);
const anon = createClient(url, anonKey);

const MISSING_FN = /schema cache|does not exist|could not find the function/i;

// 0. Informational: inspect the OpenAPI spec. NOTE: Supabase's anon OpenAPI listing
//    often omits /rpc/ paths even when the functions are callable, so this is a hint
//    only — the authoritative checks are the functional RPC calls below.
try {
  const specRes = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  const spec = await specRes.json();
  const rpcs = Object.keys(spec.paths || {})
    .filter((p) => p.startsWith("/rpc/"))
    .map((p) => p.replace("/rpc/", ""));
  console.log(`· OpenAPI lists ${rpcs.length} RPC path(s)${rpcs.length ? `: ${rpcs.join(", ")}` : " (not authoritative)"}`);
} catch {
  console.log("· OpenAPI introspection unavailable (non-fatal)");
}

// 1. RPC exists & callable by anon
const unknownSlug = `nonexistent-${randomUUID()}`;
const { data: rpcData, error: rpcError } = await anon
  .rpc("get_published_funnel", { p_slug: unknownSlug })
  .maybeSingle();

if (rpcError && MISSING_FN.test(rpcError.message)) {
  fail("get_published_funnel RPC", "missing/not in schema cache — apply 005 + reload schema");
} else if (rpcError && /permission denied/i.test(rpcError.message)) {
  fail("get_published_funnel RPC", "anon lacks EXECUTE grant");
} else if (rpcError) {
  fail("get_published_funnel RPC", rpcError.message);
} else if (rpcData === null) {
  pass("get_published_funnel RPC callable by anon (unknown slug → null)");
} else {
  fail("get_published_funnel RPC", "unexpected row for random slug");
}

// 2. is_published_funnel helper callable (used by RLS insert policies)
const { error: helperError } = await anon.rpc("is_published_funnel", { p_funnel_id: randomUUID() });
if (helperError && MISSING_FN.test(helperError.message)) {
  fail("is_published_funnel helper", "missing/not in schema cache — apply 004/005 + reload schema");
} else if (helperError) {
  fail("is_published_funnel helper", helperError.message);
} else {
  pass("is_published_funnel helper present");
}

// 3. Raw funnels table is not readable by anon (RLS hardening)
const { data: rawRows, error: rawError } = await anon.from("funnels").select("id").limit(1);
if (rawError && /permission denied/i.test(rawError.message)) {
  pass("Raw funnels table blocked for anon (permission denied)");
} else if (!rawRows || rawRows.length === 0) {
  pass("Raw funnels table returns no rows for anon (RLS hardened)");
} else {
  fail("RLS leak", `anon read ${rawRows.length} raw funnel row(s)`);
}

const failed = results.filter((r) => !r).length;
console.log(`\n--- Public access: ${results.length - failed}/${results.length} checks passed ---`);
process.exit(failed > 0 ? 1 : 0);
