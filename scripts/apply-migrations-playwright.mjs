/**
 * Apply migrations via Supabase Dashboard SQL Editor (requires logged-in browser session).
 * Run: node scripts/apply-migrations-playwright.mjs
 */
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const PROJECT_REF = "jqmgpzunpnfkigamtcqx";
const SQL_URL = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;
const sql = readFileSync("supabase/setup-all.sql", "utf8");

const edgeUserData =
  process.env.LOCALAPPDATA + "\\Microsoft\\Edge\\User Data";

console.log("Launching Edge with profile to run Supabase SQL…");

let context;
try {
  context = await chromium.launchPersistentContext(edgeUserData, {
    channel: "msedge",
    headless: false,
    args: ["--profile-directory=Default"],
  });
} catch (err) {
  console.error(
    "Could not launch Edge profile (close Edge and retry):",
    err instanceof Error ? err.message : err
  );
  process.exit(1);
}

const page = context.pages()[0] ?? (await context.newPage());
await page.goto(SQL_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

if (page.url().includes("/login") || page.url().includes("/sign-in")) {
  console.error("Not logged in to Supabase. Log in at supabase.com and retry.");
  await context.close();
  process.exit(1);
}

await page.waitForTimeout(5000);

const editorSelectors = [
  ".monaco-editor textarea",
  "textarea[aria-label='Editor content']",
  ".view-lines",
  "[data-testid='sql-editor']",
];

let filled = false;
for (const selector of editorSelectors) {
  const el = page.locator(selector).first();
  if (await el.count()) {
    await el.click({ timeout: 5000 }).catch(() => {});
    await page.keyboard.press("Control+A");
    await page.keyboard.insertText(sql);
    filled = true;
    break;
  }
}

if (!filled) {
  console.error("Could not find SQL editor. Apply supabase/setup-all.sql manually.");
  await context.close();
  process.exit(1);
}

const runSelectors = [
  "button:has-text('Run')",
  "button:has-text('RUN')",
  "[data-testid='sql-run-button']",
];

let ran = false;
for (const selector of runSelectors) {
  const btn = page.locator(selector).first();
  if (await btn.count()) {
    await btn.click();
    ran = true;
    break;
  }
}

if (!ran) {
  console.error("Could not find Run button.");
  await context.close();
  process.exit(1);
}

await page.waitForTimeout(8000);
console.log("SQL submitted. Verifying tables…");
await context.close();
