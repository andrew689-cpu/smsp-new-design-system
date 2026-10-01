---
name: smsp-design-system
description: The SMS Perkasa token reference and component rules. Use when building, styling or reviewing any UI in this repo — a component, a screen, a Tailwind class, a colour, a spacing value, a theme, a focus state, or anything touching src/ or tokens/.
---

# SMS Perkasa Design System

Pull this when you are about to write UI. `AGENTS.md` carries the short non-negotiable list;
this carries the vocabulary you need to actually build.

## The one rule that generates all the others

`tokens/` is the source of truth. `src/styles/theme.css` and `smsp-brand-identity.md` are
generated from it by `npm run tokens`, and `npm run tokens:verify` fails if either is stale.

**Never edit a generated file.** If a screen needs a value that does not exist, extend
`tokens/` and regenerate. Reaching for a literal is always the wrong branch.

## Tailwind here is not Tailwind as you know it

Every theme namespace is **reset** (`--color-*: initial`, `--spacing-*: initial`, …), so
off-system classes **do not compile**. They are not errors — they are *nothing*, and the
style silently disappears. This is the single most common way to get it wrong.

| You would normally write | Here it is | Why |
|---|---|---|
| `min-h-11` | `min-h-touch` | Numeric sizing died with the spacing reset |
| `font-normal` | `font-regular` | Our 400 token is named `regular` |
| `font-medium` / `font-semibold` | *nothing* | Lato ships 400/700/900 only |
| `bg-red-500` | `bg-action-primary` | Primitives are not exposed |
| `max-w-7xl` | `max-w-page` | Container tokens replace the default ladder |
| `rounded-2xl` | `rounded-container` | Radius is biased square |
| `shadow-lg` | `shadow-card` | Elevation is a role, not a size |
| `p-[13px]` | a token | Arbitrary values are the leak the resets closed |

`w-10` is the dangerous one: it *does* compile, as `--spacing-10` = **128px**, not 40px.

Run `npm run lint:contract` after any UI edit. The PostToolUse hook does this automatically.

## Vocabulary

**Spacing** (padding, margin, gap): `1`–`10` → 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
**Dimensions** (measured sizes): `touch` (44px), `target-min` (24px).
**Type**: `caption` 12, `small` 14, `body` 16, `body-lg` 18, `h4` 20, `h3` 24, `h2` 32,
`h1` 40, `display` 64. `1rem = 10px`, so rem = px ÷ 10 — **never ÷ 16**.
**Weights**: `regular` 400, `bold` 700, `black` 900. Headings are `black`, uppercase.
**Families**: `font-body` (Lato) for all prose; `font-numeric` (Inter) for numbers only.
**Leading**: `tight` 1.15, `snug` 1.25, `normal` 1.5. **Tracking**: `tight`, `normal`, `wide`.
**Radius roles**: `control` 4px, `container` 6px, `overlay` 8px.
**Elevation roles**: `card`, `dropdown`, `popover`, `modal`, `sticky`.
**Containers**: `page` 1200px, `sidebar` 280px, `measure` 70ch.
**Breakpoint**: `md` at 860px — the only one.

Colour: use semantic roles (`text-default`, `bg-surface`, `border-strong`, `action-primary`,
`feedback-danger`, `focus-ring`, …) or component tokens (`button-primary-bg`, `card-border`,
`table-header-bg`, `badge-danger-accent`, …). Run `npm run tokens` and read
`smsp-brand-identity.md` §4–5 for the full table with measured contrast.

## Rules that are not about tokens

**Both themes, always.** Light uses layered shadows; dark substitutes a 1px hairline ring,
because a near-black shadow is invisible on a near-black surface. Do not "fix" dark by adding
a shadow, and do not raise the overlay alpha hoping it will dim — it measures 1.04:1 there and
no value helps.

**State is never colour alone.** Every feedback indicator pairs an icon *and* a text label.
`<Alert>` and `<Badge>` require both props so this cannot be skipped.

**Every number carries a unit.** mm, kg, batang. `<Spec>` requires a `unit` prop. Numbers are
`font-numeric`, `tabular-nums`, right-aligned.

**Six states or it is unfinished**: default, hover, focus, active, disabled, error. The one
usually missing is `focus` or `error`.

**Focus is never removed.** `outline: var(--focus-ring-width) solid var(--color-focus-ring)`
with `outline-offset: var(--focus-ring-offset)`. Not `action-primary` — that was an interim
stand-in.

**Motion must be refusable.** Respect `prefers-reduced-motion: reduce`; never hardcode a
duration or curve; never let motion be the only cue for a state change.

**The breakpoint switches three things at once** at 860px: layout columns, Navbar ↔ Bottom
Navigation (never both), and sidebar ↔ inline filters (never an overlay). Moving one without
the others is incomplete.

**The page body never scrolls sideways.** A spec table that cannot fit gets its own
`overflow-x` container. The narrow desktop end (860px, minus a 280px sidebar) is the
constrained case, not mobile.

## Domain

No cart. No checkout. The single conversion action is **Hubungi Sales**. Prices are
**Indicative Price** — displayed for orientation, never transacted, subordinate to the CTA,
formatted with an `id-ID` formatter. User-facing copy is Bahasa Indonesia; token names stay
English. Bahasa runs 20–30% longer than English, so nothing is sized to an English string.

See `CONTEXT.md` for the glossary and the terms to avoid.

## What you must not claim to have checked

These are real rules and they are **not machine-checkable**. Say you have not verified them
rather than implying you have:

- Is red used *sparingly*?
- Does the whitespace read as *restraint*?
- Is this *ramah* (friendly) rather than cold and corporate?
- Do the icons share one visual language?

## Before you say you are done

```
npm run check        # tokens current, types, lint, contract, unit tests
npm run check:full   # the above plus Playwright in both themes at three viewports
```
