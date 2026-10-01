# 3. Tailwind v4 with theme namespace resets

Date: 2026-10-01

## Status

Accepted

## Context

The brief was a contract an agent must obey, not merely read. That requires violations to
*fail*, not to be noticed in review.

Tailwind initially looked like the wrong tool for it. Its default scale assumes `1rem = 16px`
while this system sets `html { font-size: 10px }`, and utility classes like `p-4` smuggle raw
values past exactly the "no hardcoded values" rule we were trying to enforce. Plain CSS plus
Stylelint looked stronger.

Tailwind **v4** changes that. Its CSS-first `@theme` block generates utilities *from* the
tokens, and a namespace reset removes the defaults entirely:

```css
@theme {
  --color-*: initial;
  --spacing-*: initial;
}
```

After that, `bg-red-500` does not compile. Not "is caught by a linter" — it does not exist.
That is stronger than catching a violation after the fact, and it is the inverse of the
original objection.

A third option, authoring plain prefixed CSS consumed by both Next.js and a published
Artifact, was considered and rejected once Tailwind v4's resets proved to enforce more.

## Decision

Tailwind v4, with every theme namespace reset and redefined from `tokens/`:
`--color-*`, `--shadow-*`, `--spacing-*`, `--text-*`, `--font-*`, `--font-weight-*`,
`--leading-*`, `--tracking-*`, `--radius-*`, `--breakpoint-*`, `--container-*`, `--ease-*`.

Theme-aware tokens are mapped through `@theme inline` onto runtime custom properties, so one
utility class resolves correctly in both themes.

Two leaks are closed separately, because the resets do not reach them:

1. **Arbitrary values** (`bg-[#FF0000]`, `p-[13px]`) always compile. Banned by
   `scripts/contract-rules.ts`.
2. **The spacing multiplier** is cleared rather than rebased. Rebasing `--spacing` to `0.4rem`
   would give the right answer for `p-1` and also mint `p-5` = 20px, a value not on the scale.

Breakpoints are declared in **px**, not rem: inside a media query `rem` resolves against the
browser's 16px root, not our 10px, so `86rem` would fire at 1376px.

## Consequences

Off-system utilities cannot ship, and arbitrary values are a lint error.

**The cost, and it is real: a wrong class is silent.** Tailwind drops what it cannot resolve,
so the style goes missing rather than erroring. Resetting `--spacing-*` also removes
Tailwind's numeric *sizing* vocabulary, because one namespace serves both spacing and
dimensions. We hit this immediately: `min-h-11` was dead in three files, taking the 44px touch
targets with it, and `font-normal` was dead on a table header. Neither failed any build.

Two mitigations. Measured dimensions get **names**, not numbers (`min-h-touch`,
`min-w-target-min`). And the `dead-utility` rule checks every class against the generated
theme, runs from pre-commit and from a PostToolUse hook, and names the valid vocabulary in its
message — our tokens first, Tailwind's surviving keywords last.

`w-10` remains the sharpest edge: it *does* compile, as `--spacing-10` = 128px rather than
Tailwind's habitual 40px. No check can catch a class that resolves to a wrong-but-valid value.
