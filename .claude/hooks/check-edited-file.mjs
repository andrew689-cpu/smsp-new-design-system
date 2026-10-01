#!/usr/bin/env node
/**
 * PostToolUse hook: lint the file that was just edited.
 *
 * This is the mechanism that actually corrects drift. Re-injecting the rules into every
 * prompt burns context and models skim repeated preambles exactly like humans do; a failure
 * arriving one second after the bad edit, naming the file and the rule, does not get skimmed.
 *
 * Exit 2 so stderr is fed back to the agent rather than shown only to the user.
 */
import { spawnSync } from "node:child_process";
import { resolve, relative, extname } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const SCANNABLE = new Set([".ts", ".tsx", ".css"]);

let payload = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) payload += chunk;

let input;
try {
  input = JSON.parse(payload || "{}");
} catch {
  process.exit(0); // Malformed payload is not the agent's problem to fix.
}

const filePath = input?.tool_input?.file_path ?? input?.tool_input?.filePath;
if (!filePath) process.exit(0);

const rel = relative(ROOT, resolve(filePath));
// Outside the scanned tree, or not a file the contract governs.
if (rel.startsWith("..") || !SCANNABLE.has(extname(rel))) process.exit(0);
if (!rel.startsWith("src/") && !rel.startsWith("e2e/")) process.exit(0);
if (rel === "src/styles/theme.css") process.exit(0); // generated

const result = spawnSync("npx", ["tsx", "scripts/check-contract.ts", rel], {
  cwd: ROOT,
  encoding: "utf8",
});

if (result.status === 0) process.exit(0);

process.stderr.write(
  [
    `Design-system contract violation in ${rel}:`,
    "",
    (result.stdout || "").trim(),
    (result.stderr || "").trim(),
    "",
    "Fix this before continuing. A dead-utility finding means the class does not exist at all,",
    "so the style is silently MISSING — see AGENTS.md and smsp-brand-identity.md.",
  ]
    .filter(Boolean)
    .join("\n"),
);
process.exit(2);
