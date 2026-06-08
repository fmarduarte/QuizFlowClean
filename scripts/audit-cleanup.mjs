#!/usr/bin/env node
/**
 * Project cleanup audit — scans files and counts references.
 * Output: JSON report to stdout.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  ".vite",
  ".vercel",
]);

const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css", ".html"]);
const ENTRY_FILES = new Set([
  "src/main.tsx",
  "src/App.tsx",
  "index.html",
  "vite.config.ts",
]);

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(full, files);
    } else {
      files.push(rel);
    }
  }
  return files;
}

function isCopyFile(rel) {
  return /(?:\s-\sCopy(?:\s\d+)?\.|Copy\.)/.test(path.basename(rel)) || rel.includes(" - Copy");
}

function isGenerated(rel) {
  return (
    rel.startsWith("dist/") ||
    rel.startsWith(".vite/") ||
    rel.endsWith(".timestamp-") ||
    false
  );
}

function basenameWithoutExt(rel) {
  const base = path.basename(rel, path.extname(rel));
  return base.replace(/\s-\sCopy(?:\s\d+)?$/, "");
}

function importPatterns(rel) {
  const ext = path.extname(rel);
  const noExt = rel.replace(/\.(tsx?|jsx?|mjs)$/, "");
  const base = path.basename(noExt);
  const dirImport = `@/${noExt.replace(/^src\//, "")}`;
  const patterns = [
    rel,
    noExt,
    `./${base}`,
    `/${noExt}`,
    dirImport,
    `@/${noExt.replace(/^src\//, "")}`,
  ];
  if (ext === ".tsx" || ext === ".ts") {
    patterns.push(noExt + ".tsx", noExt + ".ts");
    patterns.push(`@/${noExt.replace(/^src\//, "")}.tsx`);
    patterns.push(`@/${noExt.replace(/^src\//, "")}.ts`);
  }
  return [...new Set(patterns)];
}

async function main() {
  const allFiles = await walk(ROOT);
  const textFiles = allFiles.filter((f) => {
    const ext = path.extname(f);
    return SOURCE_EXT.has(ext) || f.endsWith(".gitignore") || f.includes("env");
  });

  const corpus = await Promise.all(
    textFiles.map(async (f) => {
      try {
        return [f, await readFile(path.join(ROOT, f), "utf8")];
      } catch {
        return [f, ""];
      }
    })
  );
  const corpusText = corpus.map(([, t]) => t).join("\n");

  const report = [];

  for (const rel of allFiles) {
    const ext = path.extname(rel);
    const isSource = /^src\/.+\.(tsx?|jsx?)$/.test(rel);
    const copy = isCopyFile(rel);
    const generated = isGenerated(rel);

    let refCount = 0;
    const refs = [];

    if (isSource && !copy) {
      const patterns = importPatterns(rel);
      for (const [file, content] of corpus) {
        if (file === rel) continue;
        for (const p of patterns) {
          if (
            content.includes(`from "${p}"`) ||
            content.includes(`from '${p}'`) ||
            content.includes(`import("${p}"`) ||
            content.includes(`import('${p}'`) ||
            content.includes(`require("${p}"`) ||
            content.includes(`/${path.basename(p)}`)
          ) {
            refCount++;
            refs.push(file);
            break;
          }
        }
      }
    }

    let reason = "";
    let safeToDelete = false;
    let category = "active";

    if (copy) {
      category = "duplicate-backup";
      reason = 'Windows duplicate backup file (" - Copy" in filename); not imported anywhere';
      safeToDelete = true;
      refCount = 0;
    } else if (generated || rel.startsWith(".vite/")) {
      category = "generated";
      reason = "Vite/build cache or dist artifact";
      safeToDelete = rel.startsWith(".vite/") || rel.startsWith("dist/");
    } else if (
      ["package - Copy.json", "package-lock - Copy.json", "index - Copy.html", " - Copy.gitignore", ".env - Copy.example", "vite.config - Copy.ts", "vercel - Copy.json", "tsconfig - Copy.json"].includes(rel)
    ) {
      category = "duplicate-backup";
      reason = "Duplicate root config backup";
      safeToDelete = true;
    } else if (isSource && !ENTRY_FILES.has(rel) && refCount === 0) {
      category = "orphan-candidate";
      reason = "No import/reference found in scanned source files";
      safeToDelete = false; // manual review
    }

    if (copy || generated || category === "duplicate-backup" || (isSource && category === "orphan-candidate")) {
      report.push({
        path: rel,
        category,
        reason,
        referencesCount: refCount,
        referencedBy: refs.slice(0, 5),
        safeToDelete,
      });
    }
  }

  // Duplicate implementation pairs (non-copy vs copy)
  const copyFiles = allFiles.filter(isCopyFile);
  const nonCopySources = allFiles.filter(
    (f) => /^src\/.+\.(tsx?)$/.test(f) && !isCopyFile(f)
  );

  const duplicates = [];
  for (const copy of copyFiles) {
    const originalGuess = copy.replace(/\s-\sCopy(?:\s\d+)?(?=\.)/, "");
    if (nonCopySources.includes(originalGuess)) {
      duplicates.push({ copy, original: originalGuess, safeToDelete: true });
    }
  }

  console.log(
    JSON.stringify(
      {
        summary: {
          totalFiles: allFiles.length,
          copyFiles: copyFiles.length,
          duplicatePairs: duplicates.length,
          orphanCandidates: report.filter((r) => r.category === "orphan-candidate").length,
          safeToDelete: report.filter((r) => r.safeToDelete).length,
        },
        duplicatePairs: duplicates,
        files: report.sort((a, b) => a.path.localeCompare(b.path)),
      },
      null,
      2
    )
  );

  const { writeFileSync } = await import("node:fs");
  writeFileSync(
    path.join(ROOT, "scripts", "audit-report.json"),
    JSON.stringify(
      {
        summary: {
          totalFiles: allFiles.length,
          copyFiles: copyFiles.length,
          duplicatePairs: duplicates.length,
          orphanCandidates: report.filter((r) => r.category === "orphan-candidate").length,
          safeToDelete: report.filter((r) => r.safeToDelete).length,
        },
        duplicatePairs: duplicates,
        files: report.sort((a, b) => a.path.localeCompare(b.path)),
      },
      null,
      2
    ),
    "utf8"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
