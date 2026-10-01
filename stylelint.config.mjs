/**
 * CSS-level enforcement.
 *
 * Narrow on purpose: almost all CSS in this repo is GENERATED into src/styles/theme.css,
 * which is ignored here because raw hex and px are legitimate in a token definition file.
 * Value-level rules for hand-written CSS live in scripts/contract-rules.ts, which also
 * covers .tsx. Stylelint's job is syntax and structure.
 */
const config = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: [
    // Generated from tokens/ — the one place literals belong.
    "src/styles/theme.css",
    ".next/**",
    "node_modules/**",
  ],
  rules: {
    // Tailwind v4 at-rules.
    "at-rule-no-unknown": [
      true,
      { ignoreAtRules: ["theme", "layer", "apply", "variant", "utility", "custom-variant", "source", "plugin"] },
    ],
    // Our class convention for any hand-written CSS.
    "selector-class-pattern": [
      "^smsp-[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?$",
      {
        message: "Hand-written classes are prefixed smsp- (block__element--modifier).",
      },
    ],
    // Primitives define the semantic layer; they are never consumed directly.
    "declaration-property-value-disallowed-list": {
      "/.*/": [
        "/var\\(\\s*--color-(red|neutral|blue|green|orange)-\\d{2,3}/",
      ],
    },
    // The ring is restyled, never removed.
    "declaration-property-value-no-unknown": true,
    // Tailwind v4 uses bare-string imports (@import "tailwindcss"); url() is not its idiom.
    "import-notation": null,
    // Generated files carry their own banner comment style.
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
  },
};

export default config;
