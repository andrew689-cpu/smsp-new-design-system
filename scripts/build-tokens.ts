/**
 * Generates both downstream artifacts from tokens/:
 *   - src/styles/theme.css   the Tailwind theme + runtime theme variables
 *   - smsp-brand-identity.md the brand reference document
 *
 * Run `npm run tokens` to regenerate, `npm run tokens:verify` to assert they are current.
 * The verify form runs in `check` and in pre-commit, which is what makes the document
 * structurally incapable of drifting from the code.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import * as T from "../tokens/index";
import { contrastRatio, formatRatio } from "../src/lib/contrast";

const ROOT = resolvePath(import.meta.dirname, "..");
const CSS_OUT = resolvePath(ROOT, "src/styles/theme.css");
const DOC_OUT = resolvePath(ROOT, "smsp-brand-identity.md");
const VERIFY = process.argv.includes("--verify");

const BANNER = (file: string) =>
  `GENERATED FILE — DO NOT EDIT.\nSource of truth: tokens/\nRegenerate: npm run tokens\nEdit ${file} and your change will be overwritten.`;

/* ------------------------------------------------------------------ helpers */

/** Resolve a semantic token's value for one theme to a concrete CSS value. */
function semanticValue(token: T.SemanticToken, theme: "light" | "dark"): string {
  const raw = token[theme];
  return token.literal ? raw : T.resolve(raw);
}

/**
 * The opaque colour a text role is actually read against, per theme. Defaults to
 * `bg-surface`; `on` overrides it (white-on-brand is measured against the red fill).
 */
function backdropFor(token: T.SemanticToken, theme: "light" | "dark"): string {
  const roleName = token.on ?? "bg-surface";
  const role = T.allSemanticTokens.find((s) => s.name === roleName);
  if (!role) {
    throw new Error(`Token "${token.name}" declares on: "${roleName}", which is not a semantic role.`);
  }
  return semanticValue(role, theme);
}

/** The component layer resolves THROUGH the semantic layer, never around it. */
function componentValue(token: T.ComponentToken, theme: "light" | "dark"): string {
  const role = T.allSemanticTokens.find((s) => s.name === token.references);
  if (!role) {
    throw new Error(
      `Component token "${token.name}" references unknown semantic role "${token.references}".`,
    );
  }
  return semanticValue(role, theme);
}

function elevationValue(token: T.ElevationToken, theme: "light" | "dark"): string {
  return token[theme];
}

/* ---------------------------------------------------------------------- CSS */

function buildCss(): string {
  const L: string[] = [];
  const p = (s = "") => L.push(s);

  p(`/*\n${BANNER("src/styles/theme.css")}\n*/`);
  p();
  p(`@import "tailwindcss";`);
  p();
  p(`/* ============================================================`);
  p(`   1. Runtime theme variables`);
  p(``);
  p(`   Declared here rather than inside @theme so they can be swapped at runtime.`);
  p(`   @theme inline (section 2) maps Tailwind's namespaces onto these, which is what`);
  p(`   makes a single utility class resolve correctly in both themes.`);
  p(`   ============================================================ */`);
  p();

  const themeVars = (theme: "light" | "dark"): string[] => {
    const out: string[] = [];
    out.push(`  color-scheme: ${theme};`);
    out.push(``);
    out.push(`  /* Semantic colour roles */`);
    for (const group of T.semanticGroups) {
      for (const token of group.tokens) {
        out.push(`  --smsp-color-${token.name}: ${semanticValue(token, theme)};`);
      }
    }
    out.push(``);
    out.push(`  /* Component colour tokens */`);
    for (const group of T.componentGroups) {
      for (const token of group.tokens) {
        out.push(`  --smsp-${token.name}: ${componentValue(token, theme)};`);
      }
    }
    out.push(``);
    out.push(`  /* Elevation — light uses layered shadows, dark a hairline ring. By design. */`);
    for (const e of T.elevations) {
      out.push(`  --smsp-${e.name}: ${elevationValue(e, theme)};`);
    }
    for (const role of T.elevationRoles) {
      out.push(`  --smsp-${role.name}: var(--smsp-${role.references});`);
    }
    return out;
  };

  p(`:root {`);
  p(themeVars("light").join("\n"));
  p(`}`);
  p();
  p(`/* Explicit choice wins in both directions. */`);
  p(`:root[data-theme="dark"] {`);
  p(themeVars("dark").join("\n"));
  p(`}`);
  p();
  p(`/* System preference, but never overriding an explicit light choice. */`);
  p(`@media (prefers-color-scheme: dark) {`);
  p(`  :root:not([data-theme="light"]) {`);
  p(
    themeVars("dark")
      .map((l) => (l ? `  ${l}` : l))
      .join("\n"),
  );
  p(`  }`);
  p(`}`);
  p();

  p(`/* ============================================================`);
  p(`   2. Tailwind theme — namespace RESETS`);
  p(``);
  p(`   Every reset below is load-bearing. Clearing a namespace means an off-system`);
  p(`   utility does not compile at all, which is stronger enforcement than a linter`);
  p(`   catching it afterwards: bg-red-500, p-7 and font-medium are not errors, they`);
  p(`   are nothing. See docs/adr/0003-tailwind-v4-with-namespace-resets.md.`);
  p(`   ============================================================ */`);
  p();
  p(`@theme {`);
  p(`  --color-*: initial;`);
  p(`  --shadow-*: initial;`);
  p(`  --spacing-*: initial;`);
  p(`  --text-*: initial;`);
  p(`  --font-*: initial;`);
  p(`  --font-weight-*: initial;`);
  p(`  --leading-*: initial;`);
  p(`  --tracking-*: initial;`);
  p(`  --radius-*: initial;`);
  p(`  --breakpoint-*: initial;`);
  p(`  --container-*: initial;`);
  p(`  --ease-*: initial;`);
  p(`}`);
  p();

  p(`/* ============================================================`);
  p(`   3. Tailwind theme — theme-aware mappings (inline, so they stay var() refs)`);
  p(`   ============================================================ */`);
  p();
  p(`@theme inline {`);
  for (const group of T.semanticGroups) {
    p(`  /* ${group.title} */`);
    for (const token of group.tokens) {
      p(`  --color-${token.name}: var(--smsp-color-${token.name});`);
    }
  }
  p();
  p(`  /* Component tokens */`);
  for (const group of T.componentGroups) {
    for (const token of group.tokens) {
      p(`  --color-${token.name}: var(--smsp-${token.name});`);
    }
  }
  p();
  p(`  /* Elevation as shadow utilities: shadow-card, shadow-modal, ... */`);
  for (const role of T.elevationRoles) {
    const util = role.name.replace(/^elevation-/, "");
    p(`  --shadow-${util}: var(--smsp-${role.name});`);
  }
  p(`}`);
  p();

  p(`/* ============================================================`);
  p(`   4. Tailwind theme — static scales`);
  p(`   ============================================================ */`);
  p();
  p(`@theme {`);
  p(`  /* Families. Never set Inter on prose. */`);
  for (const f of T.families) {
    p(`  --${f.role}: ${f.stack};`);
  }
  p();
  p(`  /* Lato ships 400/700/900 only. font-medium and font-semibold do not exist. */`);
  for (const w of T.weights) {
    const util = w.name.replace(/^font-weight-/, "");
    p(`  --font-weight-${util}: ${w.value};`);
  }
  p();
  p(`  /* Type scale. 1rem = 10px, so every value is px / 10. */`);
  for (const s of T.fontSizes) {
    const util = s.name.replace(/^font-size-/, "");
    p(`  --text-${util}: ${s.value};`);
  }
  p();
  p(`  /* Line height */`);
  for (const s of T.lineHeights) {
    const util = s.name.replace(/^line-height-/, "");
    p(`  --leading-${util}: ${s.value};`);
  }
  p();
  p(`  /* Letter spacing */`);
  for (const s of T.letterSpacings) {
    const util = s.name.replace(/^letter-spacing-/, "");
    p(`  --tracking-${util}: ${s.value};`);
  }
  p();
  p(`  /* Spacing — exactly ten steps, no multiplier scale. */`);
  for (const s of T.spacing) {
    const util = s.name.replace(/^space-/, "");
    p(`  --spacing-${util}: ${s.value};`);
  }
  p();
  p(`  /* Named DIMENSIONS. Numeric sizing (w-10, min-h-11) is gone with the reset, so`);
  p(`     anything measured gets a name. See tokens/space.ts. */`);
  for (const s of T.sizes) {
    const util = s.name.replace(/^space-/, "");
    p(`  --spacing-${util}: ${s.value};`);
  }
  p();
  p(`  /* Radius — biased square. Prefer the roles over the steps. */`);
  for (const s of T.radius) {
    const util = s.name.replace(/^radius-/, "");
    p(`  --radius-${util}: ${s.value};`);
  }
  for (const r of T.radiusRoles) {
    const util = r.name.replace(/^radius-/, "");
    p(`  --radius-${util}: ${r.value};`);
  }
  p();
  p(`  /* Breakpoint in px, NOT rem: media-query rem resolves against 16px, not our 10px. */`);
  for (const b of T.breakpoints) {
    const util = b.name.replace(/^breakpoint-/, "");
    p(`  --breakpoint-${util}: ${b.value};`);
  }
  p();
  p(`  /* Containers */`);
  for (const c of T.containers) {
    const util = c.name.replace(/^container-/, "");
    p(`  --container-${util}: ${c.value};`);
  }
  p();
  p(`  /* Easing */`);
  for (const e of T.easings) {
    const util = e.name.replace(/^easing-/, "");
    p(`  --ease-${util}: ${e.value};`);
  }
  p(`}`);
  p();

  p(`/* ============================================================`);
  p(`   5. Non-namespaced custom properties`);
  p(``);
  p(`   Durations and z-index have no Tailwind namespace, so they are plain custom`);
  p(`   properties. Reference them with var(); never write a raw ms value or a bare`);
  p(`   z-index number.`);
  p(`   ============================================================ */`);
  p();
  p(`:root {`);
  for (const d of T.durations) {
    p(`  --${d.name}: ${d.value};`);
  }
  for (const e of T.easings) {
    p(`  --${e.name}: ${e.value};`);
  }
  p(`  --focus-ring-width: ${T.focus.ringWidth.value};`);
  p(`  --focus-ring-offset: ${T.focus.ringOffset.value};`);
  for (const z of T.zIndices) {
    p(`  --${z.name}: ${z.value};`);
  }
  p(`}`);
  p();

  p(`/* ============================================================`);
  p(`   6. Base layer`);
  p(`   ============================================================ */`);
  p();
  p(`@layer base {`);
  p(`  html {`);
  p(`    /* The whole rem scale depends on this. Changing it silently rescales the system. */`);
  p(`    font-size: ${T.ROOT_FONT_SIZE_PX}px;`);
  p(`  }`);
  p();
  p(`  body {`);
  p(`    background-color: var(--color-bg-canvas);`);
  p(`    color: var(--color-text-default);`);
  p(`    font-family: var(--font-body);`);
  p(`    font-size: var(--text-body);`);
  p(`    line-height: var(--leading-normal);`);
  p(`  }`);
  p();
  p(`  /* Headings are Lato Black, uppercase — the "engineered, stamped" read. */`);
  p(`  h1, h2, h3, h4 {`);
  p(`    font-weight: var(--font-weight-black);`);
  p(`    line-height: var(--leading-snug);`);
  p(`    text-transform: uppercase;`);
  p(`  }`);
  p();
  p(`  /* Never removed, never obscured. */`);
  p(`  :focus-visible {`);
  p(`    outline: var(--focus-ring-width) solid var(--color-focus-ring);`);
  p(`    outline-offset: var(--focus-ring-offset);`);
  p(`  }`);
  p();
  p(`  /* A bare number is ambiguous in a steel catalogue: specs always carry a unit. */`);
  p(`  [data-numeric] {`);
  p(`    font-family: var(--font-numeric);`);
  p(`    font-variant-numeric: tabular-nums;`);
  p(`    text-align: right;`);
  p(`  }`);
  p();
  p(`  /* Motion a user cannot turn off does not ship. */`);
  p(`  @media (prefers-reduced-motion: reduce) {`);
  p(`    *, *::before, *::after {`);
  p(`      animation-duration: var(--duration-instant) !important;`);
  p(`      animation-iteration-count: 1 !important;`);
  p(`      transition-duration: var(--duration-instant) !important;`);
  p(`      scroll-behavior: auto !important;`);
  p(`    }`);
  p(`  }`);
  p(`}`);

  return L.join("\n") + "\n";
}

/* ---------------------------------------------------------------- Markdown */

function mdTable(headers: string[], rows: string[][]): string {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `|${headers.map(() => "---").join("|")}|`;
  const body = rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
  return [head, sep, body].join("\n");
}

function buildDoc(): string {
  const L: string[] = [];
  const p = (s = "") => L.push(s);
  const bgLight = T.resolve("neutral-0");
  const bgDark = T.resolve("neutral-900");

  p(`<!--`);
  p(BANNER("smsp-brand-identity.md"));
  p(`-->`);
  p();
  p(`# SMS Perkasa — Brand Identity Reference`);
  p();
  p(`**PT. Sumber Makmur Surya Perkasa** · Indonesian B2B structural-steel distributor`);
  p();
  p(
    `*Every value below is generated from \`tokens/\`, and every contrast ratio is measured at build`,
  );
  p(`time rather than asserted. Token version ${T.TOKEN_VERSION}.*`);
  p();
  p(`---`);
  p();

  p(`## 1. Identity at a glance`);
  p();
  p(
    mdTable(
      ["", ""],
      [
        ["**Company**", "PT. Sumber Makmur Surya Perkasa (SMS Perkasa)"],
        ["**Sector**", "B2B structural steel distribution, Indonesia"],
        ["**Visual read**", "Industrial-B2B, engineered, solid — but *ramah* (friendly), not cold or corporate"],
        ["**Brand colors**", "Red + steel-gray **only**. Blue / green / orange are **status only**. No purple."],
        ["**Brand story**", "**Fibonacci: start small, grow consistently**"],
        ["**Body & heading font**", "Lato — real weights 400 / 700 / 900 only"],
        ["**Numeric font**", "Inter, tabular figures"],
        ["**Root sizing**", `\`html { font-size: ${T.ROOT_FONT_SIZE_PX}px }\` → **1rem = ${T.ROOT_FONT_SIZE_PX}px**`],
        ["**Themes**", "Light + dark, both WCAG 2.2 AA"],
        ["**Copy language**", "Bahasa Indonesia (token names stay English)"],
        ["**Conversion action**", "**Hubungi Sales** — there is no cart and no checkout"],
      ],
    ),
  );
  p();
  p(`### The Fibonacci story, made visible`);
  p();
  p(
    `- **In type:** the step from \`--font-size-h1\` (${T.fontSizes.find((f) => f.name === "font-size-h1")?.px}px) to \`--font-size-display\` (${T.fontSizes.find((f) => f.name === "font-size-display")?.px}px) is a deliberate **${T.GOLDEN_LEAP.ratio}× golden leap**, not a linear step.`,
  );
  p(
    `- **In graphics:** the circle-cluster device grows small circles into larger ones, echoing compounding growth from a small, disciplined base. All logo marks share one set of eight circles (radii 98, 60, 37.5, 23, 14, 9.5, 6.5, 4 in a 420×420 viewBox).`,
  );
  p();
  p(`### Why the restraint`);
  p();
  p(
    `Squared-off corners, firm borders, and generous-but-purposeful whitespace all reinforce "built to last." **Generous whitespace reads as restraint, and restraint reads as credibility** for an industrial-B2B brand. Nothing should feel decorative for its own sake.`,
  );
  p();
  p(`---`);
  p();

  p(`## 2. Color — the three tiers`);
  p();
  p(
    mdTable(
      ["Tier", "Examples", "Who may use it"],
      [
        ["**1. Primitive**", "`--color-red-500`, `--color-neutral-400`", "**Nothing in product UI.** Not exposed as Tailwind utilities at all."],
        ["**2. Semantic**", "`--color-text-default`, `--color-action-primary`", "✅ Screens are built from these. They resolve light/dark automatically."],
        ["**3. Component**", "`--button-primary-bg`, `--card-border`", "✅ A narrower layer for specific components, built on tier 2."],
      ],
    ),
  );
  p();
  p(
    `**The rule that keeps the system coherent:** consumers use **semantic or component tokens only**. A change that introduces \`--color-red-500\` — or a raw hex like \`#D70100\` — into component styling is a regression, *even if the color happens to match a semantic token's current value*.`,
  );
  p();
  p(
    `If a screen needs a value that isn't already a semantic or component token, that is a signal to **extend the token layer**, not to reach for a primitive or a literal.`,
  );
  p();
  p(`---`);
  p();

  p(`## 3. Color — primitives (palette + print inks)`);
  p();
  p(`> ⛔ **Never reference these in UI.** The Tailwind theme resets the \`--color-*\` namespace, so`);
  p(`> \`bg-red-500\` does not compile. Listed here for brand reference and print production.`);
  p();
  for (const group of T.primitiveGroups) {
    p(`### ${group.title}`);
    p();
    p(
      mdTable(
        ["Token", "HEX", "CMYK", "Pantone", "Note"],
        group.primitives.map((pr) => [
          `\`--color-${pr.name}\``,
          pr.hex,
          pr.cmyk,
          pr.pantone ?? "—",
          pr.note ?? "",
        ]),
      ),
    );
    p();
  }
  p(`**Print inks:** brand red is **${T.printInks.brandRed}**; the near-black neutral is **${T.printInks.nearBlack}**.`);
  p();
  p(`---`);
  p();

  p(`## 4. Color — semantic roles (light + dark)`);
  p();
  p(`✅ **These are the tokens you build screens from.** Every ratio below is measured at`);
  p(`build time against the backdrop named in the "Measured on" column — \`bg-surface\``);
  p(`(${bgLight} light, ${bgDark} dark) unless the role declares another.`);
  p();
  for (const group of T.semanticGroups) {
    p(`### ${group.title}`);
    p();
    const isText = group.title === "Text";
    const headers = isText
      ? ["Token", "Light", "Dark", "Resolves from (light → dark)", "Measured on", "Contrast L / D", "Usage rule"]
      : ["Token", "Light", "Dark", "Resolves from (light → dark)", "Usage rule"];
    p(
      mdTable(
        headers,
        group.tokens.map((t) => {
          const lv = semanticValue(t, "light");
          const dv = semanticValue(t, "dark");
          const from = t.literal ? "literal" : `\`${t.light}\` → \`${t.dark}\``;
          const base = [`\`--color-${t.name}\``, lv, dv, from];
          if (isText) {
            const onRole = t.on ?? "bg-surface";
            const cl = formatRatio(contrastRatio(lv, backdropFor(t, "light")));
            const cd = formatRatio(contrastRatio(dv, backdropFor(t, "dark")));
            base.push(`\`${onRole}\``);
            base.push(t.exemptFromTextContrast ? `${cl} / ${cd} (exempt)` : `${cl} / ${cd}`);
          }
          base.push(t.usage ?? "");
          return base;
        }),
      ),
    );
    p();
    if (group.note) {
      p(group.note);
      p();
    }
  }
  p(`---`);
  p();

  p(`## 5. Color — component tokens`);
  p();
  for (const group of T.componentGroups) {
    p(`### ${group.title}`);
    p();
    const aliases = T.componentAliases.filter((a) => a.group === group.title);
    p(
      mdTable(
        ["Token", "Light", "Dark", "References", "Note"],
        [
          ...group.tokens.map((t) => [
            `\`--${t.name}\``,
            componentValue(t, "light"),
            componentValue(t, "dark"),
            `\`${t.references}\``,
            t.note ?? "",
          ]),
          ...aliases.map((a) => [`\`--${a.name}\``, "→", "→", `\`${a.references}\``, "Non-colour role."]),
        ],
      ),
    );
    p();
  }
  p(`---`);
  p();

  p(`## 6. Typography`);
  p();
  p(`### Families`);
  p();
  p(
    mdTable(
      ["Role token", "Family", "Use"],
      T.families.map((f) => [`\`--${f.role}\``, `**${f.stack}**`, f.use]),
    ),
  );
  p();
  p(`Consumers reference the **semantic roles**. **Never use Inter for prose.**`);
  p();
  p(`### Weights`);
  p();
  p(mdTable(["Token", "Value", "Name"], T.weights.map((w) => [`\`--${w.name}\``, w.value, w.note ?? ""])));
  p();
  p(
    `**Real weights only — 400 / 700 / 900.** Lato does not ship 500 / 600 / 800; browsers fake-bold them and the result is visibly inconsistent. The theme resets \`--font-weight-*\`, so \`font-medium\` does not compile.`,
  );
  p();
  p(`**Headings are Lato Black (900), uppercase** — this is what gives headlines their "engineered, stamped" feel.`);
  p();
  p(`### Type scale`);
  p();
  p(`\`1rem = ${T.ROOT_FONT_SIZE_PX}px\`, so every rem value is **px ÷ ${T.ROOT_FONT_SIZE_PX}**, not ÷ 16.`);
  p();
  p(
    mdTable(
      ["Token", "px", `rem @ 1rem = ${T.ROOT_FONT_SIZE_PX}px`, "Tailwind utility", "Typical use"],
      T.fontSizes.map((s) => [
        `\`--${s.name}\``,
        String(s.px),
        s.value,
        `\`text-${s.name.replace(/^font-size-/, "")}\``,
        s.note ?? "",
      ]),
    ),
  );
  p();
  p(`The h1 → display step is the system's **golden leap** (${T.GOLDEN_LEAP.ratio}×) — see §1.`);
  p();
  p(`### Line height`);
  p();
  p(mdTable(["Token", "Value", "Use"], T.lineHeights.map((s) => [`\`--${s.name}\``, s.value, s.note ?? ""])));
  p();
  p(`### Letter spacing`);
  p();
  p(mdTable(["Token", "Value", "Use"], T.letterSpacings.map((s) => [`\`--${s.name}\``, s.value, s.note ?? ""])));
  p();
  p(`**Measure:** keep line lengths at roughly **${T.MEASURE_RANGE_CH.min}–${T.MEASURE_RANGE_CH.max} characters**.`);
  p();
  p(`### Numerics`);
  p();
  p(`Anywhere a number is a measurement, quantity or price:`);
  p();
  p(`- set it in \`var(--font-numeric)\` (Inter)`);
  p(`- **right-aligned**`);
  p(`- \`font-variant-numeric: tabular-nums\` so digits align in a column`);
  p(`- **always with an explicit unit** — kg, mm, batang`);
  p();
  p(
    `A bare number with no unit is ambiguous in an industrial-hardware catalog and must be avoided. The \`<Spec>\` component requires a \`unit\` prop, so this is unrepresentable rather than merely discouraged.`,
  );
  p();
  p(`---`);
  p();

  p(`## 7. Spacing & radius`);
  p();
  p(`### Spacing scale (4 / 8px rhythm)`);
  p();
  p(
    mdTable(
      ["Token", "px", "rem", "Tailwind utility"],
      T.spacing.map((s) => [`\`--${s.name}\``, String(s.px), s.value, `\`p-${s.name.replace(/^space-/, "")}\``]),
    ),
  );
  p();
  p(
    `The \`--spacing-*\` namespace is **reset, not rebased**. A multiplier scale would also mint off-system values (\`p-5\` = 20px), so only these ten steps exist.`,
  );
  p();
  p(`### Named dimensions`);
  p();
  p(
    mdTable(
      ["Token", "px", "rem", "Use"],
      T.sizes.map((s) => [`\`--${s.name}\``, String(s.px), s.value, s.note ?? ""]),
    ),
  );
  p();
  p(
    `Resetting \`--spacing-*\` also removes Tailwind's numeric **sizing** vocabulary: \`min-h-11\` stops compiling and \`w-10\` becomes 128px rather than 40px. Measured dimensions therefore get a NAME, not a number — \`min-h-touch\`, not \`min-h-11\`.`,
  );
  p();
  p(`### Radius`);
  p();
  p(mdTable(["Token", "Value"], T.radius.map((s) => [`\`--${s.name}\``, s.value])));
  p();
  p(
    mdTable(
      ["Semantic role", "Value", "References", "Use"],
      T.radiusRoles.map((r) => [`\`--${r.name}\``, r.value, `\`${r.references}\``, r.note]),
    ),
  );
  p();
  p(`Radius is biased toward **squarer corners** — a deliberate part of the "engineered / solid" read.`);
  p();
  p(`---`);
  p();

  p(`## 8. Elevation & depth`);
  p();
  p(`Elevation communicates **stacking order**, not decoration.`);
  p();
  p(
    mdTable(
      ["Token", "Light", "Dark"],
      [
        ...T.elevations.map((e) => [`\`--${e.name}\``, `\`${e.light}\``, `\`${e.dark}\``]),
        ...T.elevationRoles.map((r) => [`\`--${r.name}\``, `→ \`${r.references}\``, `→ \`${r.references}\``]),
      ],
    ),
  );
  p();
  p(
    `**The two themes work differently, by design.** Light uses soft layered shadows. **Dark cannot** — a near-black shadow is invisible on a dark surface — so dark substitutes a **1px hairline ring** in \`--color-border-strong\` (${formatRatio(contrastRatio(T.resolve("neutral-500"), bgDark))} on the dark surface). In dark the ring is the *only* separator, which makes it meaningful rather than decorative.`,
  );
  p();
  p(`**Scrim caveat:** ${T.SCRIM_CAVEAT}`);
  p();
  p(`---`);
  p();

  p(`## 9. Focus & motion`);
  p();
  p(`### Focus`);
  p();
  p(
    mdTable(
      ["Token", "Value"],
      [
        [`\`--${T.focus.ringWidth.name}\``, T.focus.ringWidth.value],
        [`\`--${T.focus.ringOffset.name}\``, T.focus.ringOffset.value],
      ],
    ),
  );
  p();
  p(`Implement it exactly as:`);
  p();
  p("```css");
  p(T.focus.implementation);
  p("```");
  p();
  p(
    `**Never** remove or hide focus styles, and don't use \`--color-action-primary\` as the ring — that was an interim stand-in.`,
  );
  p();
  p(`### Duration & easing`);
  p();
  p(mdTable(["Token", "Value"], [...T.durations, ...T.easings].map((d) => [`\`--${d.name}\``, d.value])));
  p();
  p(`**Motion rules (non-negotiable):**`);
  p();
  for (const rule of T.MOTION_RULES) {
    p(`- ${rule}`);
  }
  p();
  p(`---`);
  p();

  p(`## 10. Layout & responsive`);
  p();
  p(
    mdTable(
      ["Token", "Value", "Note"],
      [...T.breakpoints, ...T.containers].map((s) => [`\`--${s.name}\``, s.value, s.note ?? ""]),
    ),
  );
  p();
  p(
    `**Breakpoints are declared in px, not rem.** Inside a media query \`rem\` resolves against the browser's 16px root, not our 10px — \`86rem\` would fire at 1376px. This is the one place a px literal is correct.`,
  );
  p();
  p(`### Z-index ladder`);
  p();
  p(mdTable(["Token", "Value", "Use"], T.zIndices.map((z) => [`\`--${z.name}\``, z.value, z.note ?? ""])));
  p();
  p(`### The breakpoint switches three things at once`);
  p();
  p(`**Design mobile-first.** At ~${T.BREAKPOINT_PX}px, all three change together — moving one without the others is incomplete:`);
  p();
  T.BREAKPOINT_SWITCHES.forEach((s, i) => p(`${i + 1}. ${s}`));
  p();
  p(
    `Above the breakpoint the sidebar is a fixed ${T.containers.find((c) => c.name === "container-sidebar")?.value}, so **the narrow end of the desktop range is the constrained case**: a spec table beside it must still fit without the *page body* scrolling sideways — the table gets its own \`overflow-x\` container instead.`,
  );
  p();
  p(`---`);
  p();

  p(`## 11. Accessibility rules (WCAG 2.2 AA)`);
  p();
  p(`Both themes, always. Asserted by \`npm run test:e2e\` with axe-core, not left to review.`);
  p();
  p(
    mdTable(
      ["Rule", "Requirement"],
      [
        ["**Text contrast**", `≥ **${T.AA_TEXT}:1**`],
        ["**Large text / UI contrast**", `≥ **${T.AA_UI}:1**`],
        [
          "**Interactive target size**",
          `≥ **${T.TARGET_SIZE.minPx}×${T.TARGET_SIZE.minPx}px**; prefer **${T.TARGET_SIZE.preferredPx}×${T.TARGET_SIZE.preferredPx}px** for primary touch — **pad, don't shrink**`,
        ],
        ["**Focus**", "Visible **2px ring, 2px offset, ≥3:1**. Never hidden or obscured."],
        ["**Sliders / drag**", "Every one needs a keyboard alternative"],
        [
          "**Component states**",
          "Every interactive component defines **default, hover, focus, active, disabled, error**. Skipping one is incomplete work.",
        ],
      ],
    ),
  );
  p();
  p(`### Never convey state by color alone`);
  p();
  p(
    `Errors, success, and warnings need an **icon + text label**. \`<Alert>\` and \`<Badge>\` require both props, so a colour-only state does not typecheck.`,
  );
  p();
  p(`### Disabled states`);
  p();
  p(
    `Built from \`--color-neutral-400\`-backed roles, decorative and inert. They must not be the only way a user learns **why** something is disabled — pair with helper text where the reason isn't obvious. (\`--color-text-disabled\` is non-interactive, so it is exempt from the ${T.AA_TEXT}:1 body rule.)`,
  );
  p();
  p(`---`);
  p();

  p(`## 12. Language & copy`);
  p();
  p(`- **Token names in English. All user-facing copy in Bahasa Indonesia.**`);
  p(
    `- **Bahasa strings run ~20–30% longer than English.** Never build a button, tab, or label around a tight fixed-width container sized for the English string — they must wrap or resize gracefully, never truncate or overflow. Asserted by the Bahasa overflow test.`,
  );
  p(`- Where display type uses \`clamp()\`, verify the fluid range still accommodates the longer Indonesian string at the smallest viewport tested.`);
  p(`- Use a single **\`Nama Lengkap\`** field — not split first/last name.`);
  p(`- There is no cart. The conversion action is **Hubungi Sales**, everywhere.`);
  p();
  p(`---`);
  p();

  p(`## 13. Do's & Don'ts`);
  p();
  p(
    mdTable(
      ["✅ Do", "⛔ Don't"],
      [
        ["Use semantic / component tokens for every colour, space, radius and elevation value.", "Hardcode hex colours or raw pixel values in component styles."],
        ["Use red sparingly — CTAs, key accents, the logo.", "Reference primitive tokens (e.g. `--color-red-500`) directly in UI."],
        ["Pair every status / feedback indicator with an icon **and** a label.", "Convey state by colour alone."],
        ["Set numerics in `--font-numeric` with `tabular-nums` and explicit units.", "Use faux Lato weights (500 / 600 / 800) that don't exist in the real font."],
        ["Write user-facing copy in Bahasa Indonesia, sized for ~20–30% growth.", "Set body text in `#FF0000` / `--color-brand-hero` — it fails AA."],
        ["Test every screen in both light and dark before shipping.", "Ship a screen checked in one theme only."],
        [`Convert px → rem by dividing by **${T.ROOT_FONT_SIZE_PX}**.`, "Divide by 16."],
        ["Respect `prefers-reduced-motion: reduce` on every transition.", "Hardcode a duration or easing value."],
        ["Point every CTA at **Hubungi Sales**.", "Build a cart, a checkout, or an Add to Cart button."],
      ],
    ),
  );
  p();

  return L.join("\n") + "\n";
}

/* ------------------------------------------------------------------- write */

function emit(path: string, content: string, label: string): boolean {
  if (VERIFY) {
    const current = existsSync(path) ? readFileSync(path, "utf8") : "";
    if (current !== content) {
      console.error(
        `✘ ${label} is stale.\n  ${path}\n  The token source changed without regenerating. Run: npm run tokens`,
      );
      return false;
    }
    console.log(`✔ ${label} is current`);
    return true;
  }
  writeFileSync(path, content, "utf8");
  console.log(`✔ wrote ${label} (${content.split("\n").length} lines)`);
  return true;
}

const ok = [
  emit(CSS_OUT, buildCss(), "src/styles/theme.css"),
  emit(DOC_OUT, buildDoc(), "smsp-brand-identity.md"),
].every(Boolean);

if (!ok) process.exit(1);
