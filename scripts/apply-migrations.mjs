/**
 * Apply Supabase SQL migrations in order via direct Postgres connection.
 *
 * Requires one of:
 *   DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
 *   SUPABASE_DB_PASSWORD=[your database password]
 *
 * Run: node scripts/apply-migrations.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const { Client } = pg;

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
  for (const [key, value] of Object.entries(process.env)) {
    if (value) env[key] = value;
  }
  return env;
}

function getConnectionString(env) {
  if (env.DATABASE_URL) return env.DATABASE_URL;

  const url = env.VITE_SUPABASE_URL ?? env.SUPABASE_URL;
  const password = env.SUPABASE_DB_PASSWORD ?? env.DB_PASSWORD;
  if (!url || !password) return null;

  const ref = url.replace(/^https?:\/\//, "").replace(/\.supabase\.co\/?$/, "");
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
}

const env = loadEnv();
const connectionString = getConnectionString(env);

if (!connectionString) {
  console.error(
    "Missing database credentials. Add to .env:\n" +
      "  SUPABASE_DB_PASSWORD=your-database-password\n" +
      "or DATABASE_URL=postgresql://postgres:...@db.[ref].supabase.co:5432/postgres"
  );
  process.exit(1);
}

const migrationsDir = join(process.cwd(), "supabase", "migrations");
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

console.log(`Connecting to Supabase Postgres (${files.length} migration files)…`);

try {
  await client.connect();
  console.log("Connected.\n");

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`Applying ${file}… `);
    try {
      await client.query(sql);
      console.log("OK");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists") || msg.includes("duplicate key")) {
        console.log("SKIP (already applied)");
      } else {
        console.log("FAIL");
        throw err;
      }
    }
  }

  console.log("\nAll migrations applied successfully.");
} finally {
  await client.end().catch(() => {});
}
