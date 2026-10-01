/**
 * Renders the Showcase into one self-contained HTML file for publishing as a Claude Artifact.
 *
 * It does NOT re-author the gallery. It reads the PRERENDERED output of `next build` and the
 * compiled CSS, so the artifact cannot drift from the app — there is one Showcase, with three
 * consumers. Re-authoring it by hand would create a second design system.
 *
 * Three things must change for the Artifact sandbox:
 *   1. next/font emits @font-face pointing at /_next/static/media/*.woff2, which will not
 *      exist. Those rules are stripped and Google Fonts is linked instead — it serves the same
 *      family names (Lato, Inter) and is on the Artifact CSP allowlist.
 *   2. React never hydrates, so the theme control needs a plain inline script.
 *   3. The logo is inlined as markup, because an artifact cannot fetch a relative .svg.
 *
 * Run `npm run build` first; this reads its output.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve as resolvePath } from "node:path";

const ROOT = resolvePath(import.meta.dirname, "..");
const PRERENDERED = join(ROOT, ".next/server/app/showcase.html");
const CSS_DIR = join(ROOT, ".next/static/css");
const OUT = join(ROOT, "showcase-artifact.html");

if (!existsSync(PRERENDERED)) {
  console.error(`✘ ${PRERENDERED} is missing. Run \`npm run build\` first.`);
  process.exit(1);
}

/* ------------------------------------------------------------------- inputs */

const html = readFileSync(PRERENDERED, "utf8");

const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
if (!mainMatch) {
  console.error("✘ Could not find <main> in the prerendered Showcase.");
  process.exit(1);
}
let main = mainMatch[0];

// React attributes that mean nothing in a static page.
main = main.replace(/\s(?:data-reactroot|data-nextjs[a-z-]*)="[^"]*"/g, "");

const cssFiles = readdirSync(CSS_DIR).filter((f) => f.endsWith(".css"));
if (cssFiles.length === 0) {
  console.error(`✘ No compiled CSS in ${CSS_DIR}.`);
  process.exit(1);
}
let css = cssFiles.map((f) => readFileSync(join(CSS_DIR, f), "utf8")).join("\n");

// Strip @font-face blocks: their src URLs are Next.js-local and unreachable from an artifact.
const fontFaceCount = (css.match(/@font-face\s*\{[^}]*\}/g) ?? []).length;
css = css.replace(/@font-face\s*\{[^}]*\}/g, "");

const logo = readFileSync(join(ROOT, "logo/smsp-mark.svg"), "utf8")
  .replace(/<\?xml[^>]*\?>/, "")
  .replace(/<svg/, '<svg width="40" height="40" aria-hidden="true" focusable="false"')
  .trim();

/* ------------------------------------------------------------------ assembly */

const themeScript = `
(function () {
  var root = document.documentElement;
  function apply(next) {
    if (next === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', next);
    document.querySelectorAll('[data-theme-option]').forEach(function (btn) {
      var active = btn.getAttribute('data-theme-option') === next;
      btn.setAttribute('aria-checked', String(active));
      // Mirror the React component: the check mark is a second cue, never colour alone.
      var label = btn.getAttribute('data-label') || '';
      btn.textContent = (active ? '\\u2713 ' : '') + label;
      btn.className = active
        ? 'text-small rounded-control min-h-touch px-4 font-bold bg-action-primary text-text-on-brand'
        : 'text-small rounded-control min-h-touch px-4 font-bold border-border-strong text-text-default border';
    });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-option]');
    if (btn) apply(btn.getAttribute('data-theme-option'));
  });
  apply('system');
})();
`.trim();

// Rewire the prerendered radio buttons to the static script above.
main = main.replace(
  /<button([^>]*?)role="radio"([^>]*?)>([\s\S]*?)<\/button>/g,
  (_full, before: string, after: string, inner: string) => {
    const label = inner.replace(/<[^>]*>/g, "").replace(/^✓\s*/, "").trim();
    const value = /Terang/.test(label) ? "light" : /Gelap/.test(label) ? "dark" : "system";
    return `<button${before}role="radio"${after} data-theme-option="${value}" data-label="${label}">${label}</button>`;
  },
);

const out = `<title>SMS Perkasa Showcase</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Inter:wght@400;700&display=swap">
<style>
/*
 * Compiled from src/styles/theme.css (generated from tokens/) plus the Showcase's utilities.
 * @font-face rules were stripped: ${fontFaceCount} of them pointed at Next.js-local files.
 */
${css}
</style>
<div style="padding:var(--spacing-5) var(--spacing-5) 0">
  <div style="display:flex;align-items:center;gap:var(--spacing-3)">
    ${logo}
    <strong class="text-h4">SMS Perkasa</strong>
  </div>
</div>
${main}
<script>
${themeScript}
</script>
`;

writeFileSync(OUT, out, "utf8");
console.log(
  `✔ wrote showcase-artifact.html (${(out.length / 1024).toFixed(0)} KB, ${fontFaceCount} @font-face rules replaced by Google Fonts)`,
);
