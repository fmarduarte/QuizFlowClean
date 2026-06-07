import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const key = env.VITE_SUPABASE_ANON_KEY;
const base = env.VITE_SUPABASE_URL;

console.log("Project:", base);

const r = await fetch(`${base}/rest/v1/`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const spec = await r.text();
console.log("OpenAPI status:", r.status);
console.log("OpenAPI snippet:", spec.slice(0, 1500));
const paths = [...spec.matchAll(/"\/([a-z_]+)"/g)].map((m) => m[1]);
const unique = [...new Set(paths)].filter((p) => !p.includes("{"));
console.log("REST-exposed tables:", unique.length ? unique.join(", ") : "(none found in spec)");

const supabase = createClient(base, key);
for (const t of ["funnel_briefs", "funnels", "funnel_events", "funnel_responses"]) {
  const { error } = await supabase.from(t).select("id").limit(1);
  console.log(`${t}:`, error ? error.message : "OK");
}
