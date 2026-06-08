#!/usr/bin/env node
/** Delete verified backup/copy files and generated cache. */
import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function isCopyFile(rel) {
  return rel.includes(" - Copy") || /Copy\s*\d*\./.test(path.basename(rel));
}

const ROOT_COPY_FILES = [
  " - Copy.gitignore",
  ".env - Copy.example",
  "index - Copy.html",
  "package - Copy.json",
  "package-lock - Copy.json",
  "vite.config - Copy.ts",
  "vercel - Copy.json",
  "tsconfig - Copy.json",
];

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      await walk(full, files);
    } else if (isCopyFile(rel)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const toDelete = [...(await walk(ROOT))];
  for (const rel of ROOT_COPY_FILES) {
    toDelete.push(path.join(ROOT, rel));
  }
  toDelete.push(path.join(ROOT, ".vite"));

  const deleted = [];
  for (const full of toDelete) {
    try {
      await stat(full);
      await rm(full, { recursive: true, force: true });
      deleted.push(path.relative(ROOT, full).replace(/\\/g, "/"));
    } catch {
      // missing
    }
  }

  console.log(JSON.stringify({ deletedCount: deleted.length, deleted }, null, 2));
}

main();
