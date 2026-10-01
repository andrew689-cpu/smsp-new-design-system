/**
 * The single source of truth for the SMS Perkasa design system.
 *
 * Two artifacts are generated from this directory and neither may be hand-edited:
 *   - src/styles/theme.css      (npm run tokens)
 *   - smsp-brand-identity.md    (npm run tokens)
 *
 * `npm run tokens:verify` fails if either is stale, so the document can never drift from
 * the code. See docs/adr/0001-tokens-are-the-source-of-truth.md.
 */

export * from "./types";
export * from "./primitives";
export * from "./semantic";
export * from "./components";
export * from "./typography";
export * from "./space";
export * from "./elevation";
export * from "./motion";
export * from "./layout";

/** Bumped when the token source changes in a way consumers must notice. */
export const TOKEN_VERSION = "1.0.0";
