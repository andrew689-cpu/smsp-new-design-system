/**
 * The Tier 1 contract rule set, as an importable module.
 *
 * Separated from the CLI so the rules themselves are unit-testable. A lint rule nobody has
 * proven catches its violation is decoration; see scripts/contract-rules.test.ts.
 */
import { extname } from "node:path";
import * as T from "../tokens/index";

export type Severity = "error" | "warn";

export interface Finding {
  file: string;
  line: number;
  rule: string;
  severity: Severity;
  message: string;
  excerpt: string;
}


/* ------------------------------------------------- valid utility vocabulary */

const colorNames = new Set<string>([
  ...T.allSemanticTokens.map((t) => t.name),
  ...T.allComponentTokens.map((t) => t.name),
]);
const spacingNames = new Set([...T.spacing, ...T.sizes].map((s) => s.name.replace(/^space-/, "")));
const textSizeNames = new Set(T.fontSizes.map((s) => s.name.replace(/^font-size-/, "")));
const weightNames = new Set(T.weights.map((w) => w.name.replace(/^font-weight-/, "")));
const familyNames = new Set(T.families.map((f) => f.role.replace(/^font-/, "")));
const leadingNames = new Set(T.lineHeights.map((s) => s.name.replace(/^line-height-/, "")));
const trackingNames = new Set(T.letterSpacings.map((s) => s.name.replace(/^letter-spacing-/, "")));
const radiusNames = new Set([
  ...T.radius.map((s) => s.name.replace(/^radius-/, "")),
  ...T.radiusRoles.map((r) => r.name.replace(/^radius-/, "")),
]);
const shadowNames = new Set(T.elevationRoles.map((r) => r.name.replace(/^elevation-/, "")));
const easeNames = new Set(T.easings.map((e) => e.name.replace(/^easing-/, "")));
const containerNames = new Set(T.containers.map((c) => c.name.replace(/^container-/, "")));
const breakpointNames = new Set(T.breakpoints.map((b) => b.name.replace(/^breakpoint-/, "")));

/** Core Tailwind keywords that survive a namespace reset because they are not theme values. */
const CORE: Record<string, Set<string>> = {
  sizing: new Set(["full", "auto", "fit", "min", "max", "screen", "px", "0", "none", "svh", "lvh", "dvh", "svw", "lvw", "dvw"]),
  spacing: new Set(["0", "auto", "px"]),
  text: new Set(["left", "center", "right", "justify", "start", "end", "wrap", "nowrap", "balance", "pretty", "ellipsis", "clip"]),
  border: new Set(["0", "2", "4", "8", "solid", "dashed", "dotted", "double", "none", "hidden", "collapse", "separate", "x", "y", "t", "r", "b", "l", "s", "e"]),
  rounded: new Set(["none", "full"]),
  shadow: new Set(["none", "inner"]),
  ease: new Set(["linear", "initial"]),
  leading: new Set(["none"]),
  tracking: new Set([]),
  font: new Set([]),
};

/** Prefix -> the suffix vocabularies it may draw from. Longest prefix wins. */
const PREFIXES: { prefix: string; allowed: Set<string>[]; label: string }[] = [
  // Colour-bearing prefixes.
  { prefix: "bg-", allowed: [colorNames], label: "colour token" },
  { prefix: "ring-", allowed: [colorNames, CORE.border!], label: "colour token" },
  { prefix: "fill-", allowed: [colorNames, CORE.sizing!], label: "colour token" },
  { prefix: "stroke-", allowed: [colorNames, CORE.border!], label: "colour token" },
  { prefix: "divide-", allowed: [colorNames, CORE.border!], label: "colour token" },
  { prefix: "outline-", allowed: [colorNames, CORE.border!], label: "colour token" },
  { prefix: "decoration-", allowed: [colorNames, CORE.border!], label: "colour token" },
  { prefix: "placeholder-", allowed: [colorNames], label: "colour token" },
  { prefix: "accent-", allowed: [colorNames], label: "colour token" },
  { prefix: "caret-", allowed: [colorNames], label: "colour token" },
  // `text-` is overloaded: colour, font size, and alignment keywords.
  { prefix: "text-", allowed: [colorNames, textSizeNames, CORE.text!], label: "colour, text size or alignment" },
  // `border-` is overloaded: colour, width, style, side.
  { prefix: "border-", allowed: [colorNames, CORE.border!], label: "colour, width, style or side" },
  // Scales.
  { prefix: "max-w-", allowed: [spacingNames, containerNames, CORE.sizing!], label: "spacing, container or keyword" },
  { prefix: "max-h-", allowed: [spacingNames, CORE.sizing!], label: "spacing or keyword" },
  { prefix: "min-w-", allowed: [spacingNames, containerNames, CORE.sizing!], label: "spacing, container or keyword" },
  { prefix: "min-h-", allowed: [spacingNames, CORE.sizing!], label: "spacing or keyword" },
  { prefix: "space-x-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "space-y-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "gap-x-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "gap-y-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "gap-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "rounded-", allowed: [radiusNames, CORE.rounded!], label: "radius token" },
  { prefix: "shadow-", allowed: [shadowNames, colorNames, CORE.shadow!], label: "elevation role" },
  { prefix: "leading-", allowed: [leadingNames, CORE.leading!], label: "line-height token" },
  { prefix: "tracking-", allowed: [trackingNames], label: "letter-spacing token" },
  { prefix: "ease-", allowed: [easeNames, CORE.ease!], label: "easing token" },
  { prefix: "font-", allowed: [weightNames, familyNames], label: "font weight or family" },
  // Spacing/sizing shorthands. Keep after the longer prefixes above.
  { prefix: "px-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "py-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "pt-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "pr-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "pb-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "pl-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "p-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "mx-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "my-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "mt-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "mr-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "mb-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "ml-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "m-", allowed: [spacingNames, CORE.spacing!], label: "spacing step" },
  { prefix: "w-", allowed: [spacingNames, containerNames, CORE.sizing!], label: "spacing, container or keyword" },
  { prefix: "h-", allowed: [spacingNames, CORE.sizing!], label: "spacing or keyword" },
  { prefix: "size-", allowed: [spacingNames, CORE.sizing!], label: "spacing or keyword" },
];

const KNOWN_VARIANTS = new Set([
  ...breakpointNames,
  "hover", "focus", "focus-visible", "focus-within", "active", "disabled", "visited",
  "first", "last", "odd", "even", "group-hover", "group-focus", "peer-focus", "peer-checked",
  "dark", "print", "motion-safe", "motion-reduce", "rtl", "ltr", "aria-checked", "aria-expanded",
  "data-numeric", "not-first", "not-last", "md", "sm", "lg",
]);

/** Fractions like w-1/2 are core Tailwind and unaffected by the reset. */
const FRACTION = /^\d+\/\d+$/;

function checkUtility(
  raw: string,
  file: string,
  line: number,
  excerpt: string,
  report: (f: Finding) => void,
) {
  let cls = raw;

  // Strip leading `!` (important) and any variants.
  cls = cls.replace(/^!+/, "");
  const parts = cls.split(":");
  cls = parts.pop() ?? "";
  for (const variant of parts) {
    const v = variant.replace(/^(group|peer)-/, "").replace(/^\[.*\]$/, "arbitrary");
    if (v === "arbitrary") continue;
    if (!KNOWN_VARIANTS.has(variant) && !KNOWN_VARIANTS.has(v)) {
      report({
        file, line, rule: "unknown-variant", severity: "warn",
        message: `Unrecognised variant "${variant}:". Breakpoint variants are limited to ${[...breakpointNames].join(", ")}.`,
        excerpt,
      });
    }
  }
  cls = cls.replace(/^-/, ""); // negative margins

  if (!cls || cls.includes("[")) return; // arbitrary values handled by their own rule

  for (const { prefix, allowed, label } of PREFIXES) {
    if (!cls.startsWith(prefix)) continue;
    const suffix = cls.slice(prefix.length);
    if (!suffix) return; // bare `border`, `rounded` etc. handled below
    if (FRACTION.test(suffix)) return;
    if (allowed.some((set) => set.has(suffix))) return;
    // Hint ordering matters: this message is the one teaching moment the rule gets. Our own
    // token vocabulary comes first (PREFIXES lists it first), named entries before numeric
    // steps, and Tailwind's surviving keywords last — so `min-h-11` is answered by
    // `min-h-touch`, not by a wall of viewport units.
    const byNamedFirst = (set: Set<string>) =>
      [...set].sort((a, b) => {
        const numeric = (v: string) => /^\d/.test(v);
        if (numeric(a) !== numeric(b)) return numeric(a) ? 1 : -1;
        return a.localeCompare(b, "en", { numeric: true });
      });
    const vocabulary = [...new Set(allowed.flatMap(byNamedFirst))];
    report({
      file, line, rule: "dead-utility", severity: "error",
      message: `"${cls}" does not resolve to any ${label}. Tailwind silently drops it, so the style is missing rather than wrong. Valid: ${vocabulary.slice(0, 14).join(", ")}${vocabulary.length > 14 ? "…" : ""}`,
      excerpt,
    });
    return;
  }
}

/* ------------------------------------------------------------- text rules */

interface TextRule {
  rule: string;
  severity: Severity;
  pattern: RegExp;
  message: string;
  /** Only apply to these extensions. */
  ext?: string[];
  /**
   * Skip test files. Used only by `raw-hex`: a test that asserts colour maths must name
   * concrete colours, and test files ship nothing. Every other rule still applies to tests.
   */
  skipTests?: boolean;
}

const TEXT_RULES: TextRule[] = [
  {
    rule: "raw-hex",
    severity: "error",
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    message: "Raw hex colour. Use a semantic or component token; if none fits, extend tokens/.",
    skipTests: true,
  },
  {
    rule: "primitive-token",
    severity: "error",
    pattern: /var\(\s*--color-(red|neutral|blue|green|orange)-\d{2,3}\s*\)/g,
    message: "Primitive token referenced directly. Primitives define the semantic layer; product UI uses tier 2 or 3.",
  },
  {
    rule: "primitive-utility",
    severity: "error",
    pattern: /\b(?:bg|text|border|ring|fill|stroke)-(?:red|neutral|blue|green|orange)-\d{2,3}\b/g,
    message: "Primitive colour utility. These are not exposed by the theme, so this class is dead as well as off-contract.",
  },
  {
    rule: "arbitrary-value",
    severity: "error",
    pattern: /\b(?:bg|text|border|ring|fill|stroke|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|w|h|size|min-w|min-h|max-w|max-h|gap|rounded|shadow|leading|tracking|duration|ease|z)-\[[^\]]+\]/g,
    message: "Arbitrary value. This is the leak the namespace resets exist to close — add a token instead.",
  },
  {
    rule: "raw-duration",
    severity: "error",
    pattern: /(?<![\w-])\d+ms\b|cubic-bezier\s*\(/g,
    message: "Hardcoded duration or easing curve. Use var(--duration-*) and var(--easing-standard).",
  },
  {
    rule: "focus-removed",
    severity: "error",
    pattern: /outline:\s*(?:none|0)|\boutline-none\b/g,
    message: "Focus styling removed. The ring is never hidden or obscured — restyle it instead.",
  },
  {
    rule: "faux-weight",
    severity: "error",
    pattern: /\bfont-(?:thin|extralight|light|medium|semibold|extrabold)\b|font-weight:\s*(?:100|200|300|500|600|800)\b/g,
    message: "Lato ships 400 / 700 / 900 only. Anything else is browser-synthesised and visibly inconsistent.",
  },
  {
    rule: "raw-px",
    severity: "error",
    pattern: /(?<![\w-])\d+(?:\.\d+)?px\b/g,
    message: "Raw pixel value. Convert by dividing by 10 and use a token (1rem = 10px).",
    ext: [".css"],
  },
  {
    rule: "cart-vocabulary",
    severity: "warn",
    pattern: /\b(?:Add to Cart|Keranjang|Beli Sekarang|Checkout|Tambah ke Keranjang)\b/gi,
    message: "SMS Perkasa has no cart. The conversion action is Hubungi Sales — see CONTEXT.md.",
  },
  {
    rule: "divide-by-sixteen",
    severity: "warn",
    pattern: /\/\s*16\b/g,
    message: "Possible px -> rem conversion by 16. This system's root is 10px.",
  },
];


/* ----------------------------------------------------------------- scanning */

/** Spans of every className value, so utility checks never read prose or props. */
export function classNameSpans(source: string): { span: string; index: number }[] {
  const spans: { span: string; index: number }[] = [];
  const re = /className\s*=\s*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    let i = m.index + m[0].length;
    if (source[i] === '"' || source[i] === "'") {
      const quote = source[i]!;
      const end = source.indexOf(quote, i + 1);
      if (end === -1) continue;
      spans.push({ span: source.slice(i + 1, end), index: i + 1 });
      re.lastIndex = end;
    } else if (source[i] === "{") {
      let depth = 0;
      const start = i;
      for (; i < source.length; i++) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") {
          depth--;
          if (depth === 0) break;
        }
      }
      spans.push({ span: source.slice(start, i + 1), index: start });
      re.lastIndex = i;
    }
  }
  return spans;
}

/** Blank out comments so a rule never fires on a note explaining that rule. */
export function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(Math.max(0, m.length - p1.length)));
}

function lineOf(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

export interface ScanOptions {
  /** Relative path, used for reporting and to decide test-file exemptions. */
  file: string;
  source: string;
}

/** Run every Tier 1/2 rule against one file's source. */
export function scanSource({ file, source: original }: ScanOptions): Finding[] {
  const findings: Finding[] = [];
  const report = (f: Finding) => findings.push(f);

  const source = stripComments(original);
  const ext = extname(file);
  const isTest = file.includes(".test.") || file.startsWith("e2e/");

  for (const tr of TEXT_RULES) {
    if (tr.ext && !tr.ext.includes(ext)) continue;
    if (tr.skipTests && isTest) continue;
    const re = new RegExp(tr.pattern.source, tr.pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(source))) {
      report({
        file,
        line: lineOf(source, m.index),
        rule: tr.rule,
        severity: tr.severity,
        message: tr.message,
        excerpt: m[0].trim().slice(0, 60),
      });
    }
  }

  if (ext === ".tsx") {
    for (const { span, index } of classNameSpans(source)) {
      const line = lineOf(source, index);
      const literals = span.match(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g) ?? [span];
      for (const literal of literals) {
        const inner = literal.replace(/^["'`]|["'`]$/g, "");
        for (const word of inner.split(/\s+/)) {
          if (word && /^[-!a-z[]/.test(word)) checkUtility(word, file, line, word, report);
        }
      }
    }
  }

  return findings;
}
