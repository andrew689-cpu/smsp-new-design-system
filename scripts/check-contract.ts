/**
 * CLI for the Tier 1 contract rules.
 *
 * Walks src/ and e2e/, applies scripts/contract-rules.ts, and exits non-zero on any error.
 * Invoked from three places so a violation surfaces within a second of the edit:
 * `npm run check`, the pre-commit hook, and the Claude Code PostToolUse hook.
 *
 * Pass file paths to scan only those (the hook does this).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve as resolvePath } from "node:path";
import { scanSource, type Finding } from "./contract-rules";

const ROOT = resolvePath(import.meta.dirname, "..");
const SCAN_DIRS = ["src", "e2e"];
/** Generated — its content is the token source's business, not the linter's. */
const SKIP_FILES = new Set(["src/styles/theme.css"]);
const SCANNABLE = [".ts", ".tsx", ".css"];

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCANNABLE.includes(extname(full))) out.push(full);
  }
  return out;
}

const argPaths = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets =
  argPaths.length > 0
    ? argPaths.map((p) => resolvePath(ROOT, p)).filter((p) => SCANNABLE.includes(extname(p)))
    : SCAN_DIRS.flatMap((d) => walk(resolvePath(ROOT, d)));

const findings: Finding[] = [];
for (const path of targets) {
  const rel = relative(ROOT, path);
  if (SKIP_FILES.has(rel)) continue;
  let source: string;
  try {
    source = readFileSync(path, "utf8");
  } catch {
    continue; // deleted between staging and scanning
  }
  findings.push(...scanSource({ file: rel, source }));
}

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warn");

if (findings.length === 0) {
  console.log(`✔ contract: no violations (${targets.length} file${targets.length === 1 ? "" : "s"})`);
} else {
  const byFile = new Map<string, Finding[]>();
  for (const f of findings) {
    const list = byFile.get(f.file) ?? [];
    list.push(f);
    byFile.set(f.file, list);
  }
  for (const [file, list] of [...byFile.entries()].sort()) {
    console.log(`\n${file}`);
    for (const f of list.sort((a, b) => a.line - b.line)) {
      console.log(`  ${f.severity === "error" ? "✘" : "▲"} ${f.line}:${f.rule}  ${f.excerpt}`);
      console.log(`      ${f.message}`);
    }
  }
  console.log(
    `\n${errors.length} error${errors.length === 1 ? "" : "s"}, ${warnings.length} warning${warnings.length === 1 ? "" : "s"}`,
  );
}

process.exit(errors.length > 0 ? 1 : 0);
