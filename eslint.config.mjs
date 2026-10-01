import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";

/**
 * Standard correctness linting. The design-system contract is NOT enforced here — it lives
 * in scripts/contract-rules.ts, which is plain TypeScript so the same rules run from the
 * CLI, pre-commit, and the Claude Code hook without an ESLint process in the loop.
 */
export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**", "src/styles/theme.css", "playwright-report/**", "test-results/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      // consistent-type-imports needs typed linting, which eslint-config-next's parser does
      // not forward. Not worth the lint-time cost for a style preference.
      // react/no-unescaped-entities fires on Indonesian copy; the content is authored, not injected.
      "react/no-unescaped-entities": "off",
    },
  },
);
