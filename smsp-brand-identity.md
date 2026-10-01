# SMS Perkasa — Brand Identity Reference

**PT. Sumber Makmur Surya Perkasa** · Indonesian B2B structural-steel distributor

*Colour, type, spacing and elevation values below are generated directly from the design tokens, so
they are exact as of 2026-10-01 (`5d0829a`).*

---

## Contents

1. [Identity at a glance](#1-identity-at-a-glance)
2. [Logo & brand assets](#2-logo--brand-assets)
3. [Color — the three tiers](#3-color--the-three-tiers)
4. [Color — primitives](#4-color--primitives-palette--print-inks)
5. [Color — semantic roles](#5-color--semantic-roles-light--dark)
6. [Color — component tokens](#6-color--component-tokens)
7. [Typography](#7-typography)
8. [Spacing & radius](#8-spacing--radius)
9. [Elevation & depth](#9-elevation--depth)
10. [Focus & motion](#10-focus--motion)
11. [Layout & responsive](#11-layout--responsive)
12. [Accessibility rules](#12-accessibility-rules-wcag-22-aa)
13. [Language & copy](#13-language--copy)
14. [Do's & Don'ts](#14-dos--donts)

---

## 1. Identity at a glance

| | |
|---|---|
| **Company** | PT. Sumber Makmur Surya Perkasa (SMS Perkasa) |
| **Sector** | B2B structural steel distribution, Indonesia |
| **Visual read** | Industrial-B2B, engineered, solid — but *ramah* (friendly), not cold or corporate |
| **Brand colors** | Red + steel-gray **only**. Blue / green / orange are **status only**. No purple. |
| **Brand story** | **Fibonacci: start small, grow consistently** |
| **Body & heading font** | Lato — real weights 400 / 700 / 900 only |
| **Numeric font** | Inter, tabular figures |
| **Root sizing** | `html { font-size: 10px }` → **1rem = 10px** |
| **Themes** | Light + dark, both WCAG 2.2 AA |
| **Copy language** | Bahasa Indonesia (token names stay English) |

### The Fibonacci story, made visible

The brand's narrative isn't only a tagline — it is encoded in the system twice:

- **In type:** the step from `--font-size-h1` (40px) to `--font-size-display` (64px) is a
  deliberate **1.6× golden leap**, not a linear step. The scale grows steadily, then visibly
  accelerates at display size — a Fibonacci sequence approaching its golden ratio.
- **In graphics:** the circle-cluster device (`brand/graphics/fibonacci-cluster.svg`) grows small
  circles into larger ones, echoing compounding growth from a small, disciplined base.

### Why the restraint

Squared-off corners, firm borders, and generous-but-purposeful whitespace all reinforce "built to
last." **Generous whitespace reads as restraint, and restraint reads as credibility** for an
industrial-B2B brand. Nothing should feel decorative for its own sake.

---

## 2. Logo & brand assets

### Files

| Asset | Path | Use |
|---|---|---|
| Mark | `brand/logo/smsp-mark.svg` | Standalone mark, full color |
| Mark (black) | `brand/logo/smsp-mark-black.svg` | Single-color dark placement |
| Mark (white) | `brand/logo/smsp-mark-white.svg` | Single-color light placement / on red |
| Horizontal lockup | `brand/logo/smsp-logo-horizontal.svg` | Wider header / footer placements |
| Fibonacci cluster | `brand/graphics/fibonacci-cluster.svg` | Marketing / brand device |
| Fibonacci spinner | `brand/graphics/fibonacci-spinner.svg` | Loading state |

### Rules

- **Clear space** — keep space around the mark equal to at least **the radius of the largest circle
  in the mark**. Never let text, edges, or other graphics intrude inside that radius.
- **Minimum size** — the mark must never render below **~24px wide**; the horizontal lockup never
  below **~120px wide**. Below these the mark loses legibility.
- **Composed lockup ratio** — when building a lockup from mark + live wordmark text (for
  theme-adaptive headers), size the mark **~2× the wordmark's cap height**. The mark carries ~23%
  internal padding, so equal heights render it visually smaller and the seed-dots blur. The official
  horizontal lockup sets the mark ~2.4× the wordmark for the same reason.
- **Color** — never recolor the mark outside the provided red, black, and white variants. No tints,
  gradients, or filters on the logo files.

---

## 3. Color — the three tiers

Color is organized in three tiers, each with exactly one job:

| Tier | Examples | Who may use it |
|---|---|---|
| **1. Primitive** | `--color-red-500`, `--color-neutral-400` | **Nothing in product UI.** They exist only to *define* semantics. |
| **2. Semantic** | `--color-text-default`, `--color-action-primary` | ✅ Screens are built from these. They resolve light/dark automatically. |
| **3. Component** | `--button-primary-bg`, `--card-border` | ✅ A narrower layer for specific components, built on tier 2. |

**The rule that keeps the system coherent:** consumers use **semantic or component tokens only**.
A change that introduces `--color-red-500` — or a raw hex like `#D70100` — into component styling
is a regression, *even if the color happens to match a semantic token's current value*.

If a screen needs a color, spacing, radius, or shadow that isn't already a semantic or component
token, that is a signal to **extend the token layer**, not to reach for a primitive or a literal.

### The tiered reds

Red is the signature color, deliberately split into four roles so no single red does every job:

| Red | Token | Role |
|---|---|---|
| **#FF0000** | `red.500` / `--color-brand-hero` | The vivid logo red. Logo, large decorative fills, hero graphics only. **Fails AA for body text** — never for text, small UI, or fills hosting readable content. |
| **#D70100** | `--color-action-primary` | Primary button fill, always with a white `--color-text-on-brand` label. This is what "an SMS Perkasa red button" looks like. (5.35:1) |
| **#C1121F** | `--color-text-link` | The accessible red — text, links, small UI accents, focus ring. (6.17:1) |
| **#A00E19** | `--color-feedback-danger` | A distinct, darker danger red, kept visually separate from brand red so an error never reads as "the brand color, but something's wrong with it." |

**Use red sparingly.** Primary CTAs, key accents, the logo. **Never** a large background fill, never
body copy. Blue, green, and orange are **status only** (info / success / warning) and must not be
repurposed as decorative accents. Purple is dropped from the palette entirely.

---

## 4. Color — primitives (palette + print inks)

> ⛔ **Never reference these in UI.** Listed for brand reference, print production, and to show what
> the semantic roles resolve to.

### Red

| Token | HEX | CMYK | Pantone | Note |
|---|---|---|---|---|
| `--color-red-50` | #FFF2F2 | 0,5,5,0 | — |  |
| `--color-red-100` | #FFCCCC | 0,20,20,0 | — |  |
| `--color-red-200` | #FF9999 | 0,40,40,0 | — |  |
| `--color-red-300` | #FE6766 | 0,59,60,0 | — | Dark-mode link/text red. |
| `--color-red-400` | #FE3433 | 0,80,80,0 | — | Large/decorative; dark-mode danger. |
| `--color-red-500` | #FF0000 | 0,100,100,0 | 485 C | Vivid brand red (logo). Large >=24px & decorative only; fails AA body. |
| `--color-red-600` | #D70100 | 0,100,100,16 | 485 C | Primary button FILL + white label (5.35:1 AA). |
| `--color-red-700` | #C1121F | 0,91,84,24 | — | Accessible red text/link/small UI (6.17:1 AA). |
| `--color-red-800` | #A00E19 | 0,91,84,37 | — | Danger/error, distinct from brand. |
| `--color-red-900` | #7A0A13 | 0,92,84,52 | — |  |

### Neutral (steel-gray)

| Token | HEX | CMYK | Pantone | Note |
|---|---|---|---|---|
| `--color-neutral-0` | #FEFEFE | 0,0,0,0 | — |  |
| `--color-neutral-50` | #FBFBFB | 0,0,0,2 | — |  |
| `--color-neutral-100` | #F3F3F3 | 0,0,0,5 | — |  |
| `--color-neutral-200` | #D7D6D4 | 0,0,1,16 | — |  |
| `--color-neutral-300` | #D1D1D1 | 0,0,0,18 | — |  |
| `--color-neutral-400` | #A4A3A3 | 0,1,1,36 | — | Decorative/disabled only (2.49:1). |
| `--color-neutral-500` | #767576 | 0,1,0,54 | — |  |
| `--color-neutral-600` | #5D5F61 | 4,2,0,62 | — |  |
| `--color-neutral-700` | #494748 | 0,3,1,71 | — |  |
| `--color-neutral-800` | #2E2C2D | 0,4,2,82 | — |  |
| `--color-neutral-900` | #1B191A | 0,7,4,89 | Black 6 C |  |
| `--color-neutral-950` | #131112 | 0,11,5,93 | — |  |

### Status — blue (info)

| Token | HEX | CMYK | Pantone | Note |
|---|---|---|---|---|
| `--color-blue-300` | #66A3E8 | 56,30,0,9 | — |  |
| `--color-blue-500` | #408CE2 | 72,38,0,11 | — |  |
| `--color-blue-700` | #1E6FC8 | 85,45,0,22 | — |  |

### Status — green (success)

| Token | HEX | CMYK | Pantone | Note |
|---|---|---|---|---|
| `--color-green-300` | #4CC24C | 61,0,61,24 | — |  |
| `--color-green-500` | #0B9A0B | 93,0,93,40 | — |  |
| `--color-green-700` | #087C08 | 94,0,94,51 | — |  |

### Status — orange (warning)

| Token | HEX | CMYK | Pantone | Note |
|---|---|---|---|---|
| `--color-orange-400` | #F8A857 | 0,32,65,3 | — |  |
| `--color-orange-500` | #F6953C | 0,39,76,4 | — |  |
| `--color-orange-700` | #B5620F | 0,46,92,29 | — |  |

**Print inks:** brand red is **Pantone 485 C**; the near-black neutral is **Pantone Black 6 C**.

---

## 5. Color — semantic roles (light + dark)

✅ **These are the tokens you build screens from.**

### Text

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-text-default` | #1B191A | #FBFBFB | `color.neutral.900` → `color.neutral.50` | Primary body text. |
| `--color-text-muted` | #5D5F61 | #D1D1D1 | `color.neutral.600` → `color.neutral.300` |  |
| `--color-text-subtle` | #767576 | #A4A3A3 | `color.neutral.500` → `color.neutral.400` |  |
| `--color-text-link` | #C1121F | #FE6766 | `color.red.700` → `color.red.300` | Accessible red link (6.17:1). |
| `--color-text-on-brand` | #FEFEFE | #FEFEFE | `color.neutral.0` → `color.neutral.0` | Text on red/brand fills. White only. |
| `--color-text-disabled` | #A4A3A3 | #A4A3A3 | `color.neutral.400` → `color.neutral.400` | Disabled control text; non-interactive, so exempt from the 4.5:1 body rule. |
| `--color-text-inverse` | #FEFEFE | #FEFEFE | `color.neutral.0` → `color.neutral.0` | Body text on an inverted surface — footer, dark CTA banners. |
| `--color-text-inverse-muted` | #D1D1D1 | #D1D1D1 | `color.neutral.300` → `color.neutral.300` | Secondary text on an inverted surface. |

### Background

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-bg-canvas` | #FEFEFE | #131112 | `color.neutral.0` → `color.neutral.950` |  |
| `--color-bg-surface` | #FEFEFE | #1B191A | `color.neutral.0` → `color.neutral.900` |  |
| `--color-bg-subtle` | #F3F3F3 | #2E2C2D | `color.neutral.100` → `color.neutral.800` |  |
| `--color-bg-brand-subtle` | #FFF2F2 | #7A0A13 | `color.red.50` → `color.red.900` |  |
| `--color-bg-inverse` | #1B191A | #1B191A | `color.neutral.900` → `color.neutral.900` | Inverted surface: footer and dark CTA banners. |
| `--color-bg-inverse-raised` | #2E2C2D | #2E2C2D | `color.neutral.800` → `color.neutral.800` | Raised panel on an inverted surface. |

### Border

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-border-default` | #D1D1D1 | #494748 | `color.neutral.300` → `color.neutral.700` | Decorative dividers. |
| `--color-border-strong` | #767576 | #767576 | `color.neutral.500` → `color.neutral.500` | Meaningful borders (>=3:1). |
| `--color-border-inverse` | #494748 | #494748 | `color.neutral.700` → `color.neutral.700` | Divider on an inverted surface. |

### Action

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-action-primary` | #D70100 | #D70100 | `color.red.600` → `color.red.600` | Primary CTA fill, white label, use sparingly. |
| `--color-action-primary-hover` | #C1121F | #FF0000 | `color.red.700` → `color.red.500` |  |
| `--color-action-primary-active` | #A00E19 | #C1121F | `color.red.800` → `color.red.700` |  |

### Feedback

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-feedback-danger` | #A00E19 | #FE3433 | `color.red.800` → `color.red.400` | Errors/destructive. Pair with icon + label; never color alone. |
| `--color-feedback-success` | #087C08 | #4CC24C | `color.green.700` → `color.green.300` |  |
| `--color-feedback-warning` | #F6953C | #F8A857 | `color.orange.500` → `color.orange.400` | Fill only; text uses orange.700. |
| `--color-feedback-info` | #1E6FC8 | #66A3E8 | `color.blue.700` → `color.blue.300` |  |

Every feedback color must be paired with an **icon + text label**.

### Brand & focus

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-brand-hero` | #FF0000 | #FF0000 | `color.red.500` → `color.red.500` | Vivid red for large decorative/hero fills only. |

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-focus-ring` | #C1121F | #FE6766 | `color.red.700` → `color.red.300` | Focus ring color; clears >=3:1 on every surface (6.17:1 on white). |

### Overlay

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-overlay` | rgba(27, 25, 26, 0.6) | rgba(27, 25, 26, 0.6) | `#1B191A99` → `#1B191A99` | Modal/drawer scrim: dark neutral at ~60% alpha. On light it dims the backdrop by 4.55:1 and is the separator. On dark it cannot dim at all - see the dark file - so it is decorative there and the ring does the work. |

---

## 6. Color — component tokens

### Button

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--button-primary-bg` | #D70100 | #D70100 | `color.action.primary` |  |
| `--button-primary-bg-hover` | #C1121F | #FF0000 | `color.action.primary-hover` |  |
| `--button-primary-label` | #FEFEFE | #FEFEFE | `color.text.on-brand` |  |
| `--button-primary-radius` | 4px | 4px | `radius.control` |  |

### Input

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--input-bg` | #FEFEFE | #1B191A | `color.bg.surface` |  |
| `--input-border` | #767576 | #767576 | `color.border.strong` |  |
| `--input-text` | #1B191A | #FBFBFB | `color.text.default` |  |
| `--input-radius` | 4px | 4px | `radius.control` |  |

### Card

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--card-bg` | #FEFEFE | #1B191A | `color.bg.surface` |  |
| `--card-border` | #D1D1D1 | #494748 | `color.border.default` |  |
| `--card-radius` | 6px | 6px | `radius.container` |  |
| `--card-shadow` | 0 1px 2px rgba(27,25,26,0.06), 0 1px 3px rgba(27,25,26,0.10) | 0 0 0 1px #767576 | `elevation.card` |  |

### Table / spec-table

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--table-header-bg` | #F3F3F3 | #2E2C2D | `color.bg.subtle` |  |
| `--table-header-text` | #1B191A | #FBFBFB | `color.text.default` | Pairs with the neutral header-bg; not white, because the header is not a brand fill. |
| `--table-border` | #D1D1D1 | #494748 | `color.border.default` |  |
| `--table-numeric-font` | Inter, 'Helvetica Neue', Arial, sans-serif | Inter, 'Helvetica Neue', Arial, sans-serif | `font.numeric` | References the semantic numeric font role Inter, 'Helvetica Neue', Arial, sans-serif. |

### Badge

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--badge-danger-bg` | #F3F3F3 | #2E2C2D | `color.bg.subtle` | Neutral subtle chip. A same-hue fill is not used: solid danger is ~3.6:1 in dark, and white on the light success fill fails AA. |
| `--badge-danger-accent` | #A00E19 | #FE3433 | `color.feedback.danger` | The status dot/icon. This carries the meaning, always paired with the text label - never colour alone. |
| `--badge-danger-text` | #1B191A | #FBFBFB | `color.text.default` | Explicit label colour: 15.76:1 light, 13.40:1 dark on the subtle chip. |
| `--badge-success-bg` | #F3F3F3 | #2E2C2D | `color.bg.subtle` |  |
| `--badge-success-accent` | #087C08 | #4CC24C | `color.feedback.success` |  |
| `--badge-success-text` | #1B191A | #FBFBFB | `color.text.default` |  |

---

## 7. Typography

### Families

| Role token | Primitive | Family | Use |
|---|---|---|---|
| `--font-body` | `--font-family-base` | **Lato, 'Helvetica Neue', Arial, sans-serif** | Body copy **and** headings |
| `--font-numeric` | `--font-family-numeric` | **Inter, 'Helvetica Neue', Arial, sans-serif** | Tabular figures only — measurements, prices, quantities |

Consumers reference the **semantic roles** (`--font-body`, `--font-numeric`), not the primitives.
**Never use Inter for prose.**

### Weights

| Token | Value | Name |
|---|---|---|
| `--font-weight-regular` | 400 | Lato Regular |
| `--font-weight-bold` | 700 | Lato Bold |
| `--font-weight-black` | 900 | Lato Black |

**Real weights only — 400 / 700 / 900.** Do not synthesize faux 500 / 600 / 800: Lato doesn't ship
them, browsers will fake-bold, and the result is visibly inconsistent.

**Headings are Lato Black (900), uppercase** — this is what gives headlines their "engineered,
stamped" feel rather than a soft editorial one.

### Type scale

`1rem = 10px`, so every rem value is **px ÷ 10**, not ÷ 16.

| Token | px | rem @ 1rem = 10px | Typical use |
|---|---|---|---|
| `--font-size-caption` | 12px | 1.2rem | Captions, fine print |
| `--font-size-small` | 14px | 1.4rem | Secondary / help text |
| `--font-size-body` | 16px | 1.6rem | Default body copy |
| `--font-size-body-lg` | 18px | 1.8rem | Lead paragraphs |
| `--font-size-h4` | 20px | 2.0rem | Smallest heading level |
| `--font-size-h3` | 24px | 2.4rem | Sub-section headings |
| `--font-size-h2` | 32px | 3.2rem | Section headings |
| `--font-size-h1` | 40px | 4.0rem | Page headings |
| `--font-size-display` | 64px | 6.4rem | Hero / display headlines |

The h1 → display step is the system's **golden leap** (1.6×) — see §1.

### Line height

| Token | Value | Use |
|---|---|---|
| `--line-height-tight` | 1.15 | Large headings |
| `--line-height-snug` | 1.25 | Headings |
| `--line-height-normal` | 1.5 | Body copy |

Body copy uses `--line-height-normal` (1.5); headings use the tighter 1.15–1.25 range so large
type doesn't look loose.

**Measure:** keep line lengths at roughly **45–75 characters**. Avoid full-bleed paragraphs on wide
layouts.

### Numerics

Anywhere a number is a measurement or quantity — table cells, spec sheets, the calculator:

- set it in `var(--font-numeric)` (Inter)
- **right-aligned**
- `font-variant-numeric: tabular-nums` so digits align in a column
- **always with an explicit unit** — kg, mm, batang

A bare number with no unit is ambiguous in an industrial-hardware catalog and must be avoided.

---

## 8. Spacing & radius

### Spacing scale (4 / 8px rhythm)

| Token | px | rem |
|---|---|---|
| `--space-1` | 4px | 0.4rem |
| `--space-2` | 8px | 0.8rem |
| `--space-3` | 12px | 1.2rem |
| `--space-4` | 16px | 1.6rem |
| `--space-5` | 24px | 2.4rem |
| `--space-6` | 32px | 3.2rem |
| `--space-7` | 48px | 4.8rem |
| `--space-8` | 64px | 6.4rem |
| `--space-9` | 96px | 9.6rem |
| `--space-10` | 128px | 12.8rem |

### Radius

| Token | Value | Note |
|---|---|---|
| `--radius-none` | 0px | |
| `--radius-sm` | 2px | |
| `--radius-md` | 4px | |
| `--radius-lg` | 6px | |
| `--radius-xl` | 8px | |
| `--radius-pill` | 9999px | |
| `--radius-full` | 50% | |
| `--radius-control` | 4px | Semantic role → `radius.md` |
| `--radius-container` | 6px | Semantic role → `radius.lg` |
| `--radius-overlay` | 8px | Semantic role → `radius.xl` |

Radius is biased toward **squarer corners** rather than heavily rounded ones — a deliberate part of
the "engineered / solid" read. Prefer the semantic roles (`--radius-control`, `--radius-container`,
`--radius-overlay`) over numbered steps.

---

## 9. Elevation & depth

Elevation communicates **stacking order**, not decoration. Prefer the semantic roles
(`--elevation-card`, `-dropdown`, `-popover`, `-modal`) over the numeric ladder, exactly as
semantic colors are preferred over primitives.

| Token | Light | Dark |
|---|---|---|
| `--elevation-1` | `0 1px 2px rgba(27,25,26,0.06), 0 1px 3px rgba(27,25,26,0.10)` | `0 0 0 1px #767576` |
| `--elevation-2` | `0 2px 4px rgba(27,25,26,0.06), 0 4px 8px rgba(27,25,26,0.10)` | `0 0 0 1px #767576` |
| `--elevation-3` | `0 4px 8px rgba(27,25,26,0.08), 0 8px 16px rgba(27,25,26,0.12)` | `0 0 0 1px #767576` |
| `--elevation-4` | `0 8px 16px rgba(27,25,26,0.10), 0 16px 32px rgba(27,25,26,0.16)` | `0 0 0 1px #767576` |
| `--elevation-up-1` | `0 -4px 12px rgba(27,25,26,0.08)` | `0 -1px 0 0 #767576` |
| `--elevation-card` | `0 1px 2px rgba(27,25,26,0.06), 0 1px 3px rgba(27,25,26,0.10)` | `0 0 0 1px #767576` |
| `--elevation-dropdown` | `0 2px 4px rgba(27,25,26,0.06), 0 4px 8px rgba(27,25,26,0.10)` | `0 0 0 1px #767576` |
| `--elevation-popover` | `0 4px 8px rgba(27,25,26,0.08), 0 8px 16px rgba(27,25,26,0.12)` | `0 0 0 1px #767576` |
| `--elevation-modal` | `0 8px 16px rgba(27,25,26,0.10), 0 16px 32px rgba(27,25,26,0.16)` | `0 0 0 1px #767576` |
| `--elevation-sticky` | `0 -4px 12px rgba(27,25,26,0.08)` | `0 -1px 0 0 #767576` |

**The two themes work differently, by design.** Light uses soft layered shadows. **Dark cannot** — a
near-black shadow is invisible on a dark surface — so dark substitutes a **1px hairline ring** in
`--color-border-strong` (3.81:1 on the dark surface). In dark the ring is the *only* separator,
which makes it meaningful rather than decorative; depth is carried by the surface step
(`--color-bg-surface` vs `--color-bg-canvas`), not by ring weight.

**Scrim caveat:** `--color-overlay` does **not** dim on dark, and no value can — composited over
the near-black canvas it measures 1.04:1 (black at 85% still only reaches 1.10:1). On dark, an
overlaid surface is separated by its border ring, never by the scrim. Don't raise its alpha
expecting it to help.

---

## 10. Focus & motion

### Focus

| Token | Light | Dark |
|---|---|---|
| `--focus-ring-width` | 2px | 2px |
| `--focus-ring-offset` | 2px | 2px |
| `--color-focus-ring` | #C1121F (6.17:1 on white) | #FE6766 (6.12:1 on the dark surface) |

Implement it exactly as:

```css
outline: var(--focus-ring-width) solid var(--color-focus-ring);
outline-offset: var(--focus-ring-offset);
```

**Never** remove or hide focus styles, and don't use `--color-action-primary` as the ring — that was
an interim stand-in.

### Duration & easing

| Token | Value |
|---|---|
| `--duration-instant` | 0ms |
| `--duration-fast` | 100ms |
| `--duration-base` | 150ms |
| `--duration-slow` | 200ms |
| `--duration-slower` | 300ms |
| `--easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` |

**Motion rules (non-negotiable):**

- Every transition and animation must respect **`prefers-reduced-motion: reduce`** — remove
  transforms and parallax, keep at most an opacity cross-fade. Motion a user cannot turn off does
  not ship.
- Never hardcode a millisecond value or an easing curve. Use the tokens.
- **Motion is never the only cue.** A state change signalled by movement alone disappears under
  reduced motion — pair it with a token, text, or icon change that survives.

---

## 11. Layout & responsive

| | |
|---|---|
| **Container max-width** | ~1200px, centered |
| **Grid mental model** | 12 columns (even where implemented in CSS Grid / Flexbox) |
| **Section rhythm** | The `--space-*` scale — tight in-card through generous hero |
| **Breakpoint** | **~860px** |
| **Desktop filter sidebar** | fixed **280px** |
| **Mobile touch targets** | ≥ **44px** |

**Design mobile-first.** The ~860px breakpoint switches **three things at once**, not just the grid:

1. **Layout** — the hero collapses from two columns (copy + graphic) to one; multi-column grids drop
   from three/four to one or two.
2. **Navigation** — `Navbar` above, Bottom Navigation below. **Never both**.
3. **Filtering** — a persistent sidebar above, filters inline in the list header below. **A filter
   surface is never an overlay at either width.**

Above the breakpoint the sidebar is a fixed 280px, so **the narrow end of the desktop range is the
constrained case**: the spec table beside it must still fit its columns without the *page body* ever
scrolling sideways — the table gets its own `overflow-x` container instead.

---

## 12. Accessibility rules (WCAG 2.2 AA)

Both themes, always.

| Rule | Requirement |
|---|---|
| **Text contrast** | ≥ **4.5:1** |
| **Large text / UI contrast** | ≥ **3:1** |
| **Interactive target size** | ≥ **24×24px**; prefer **44×44px** for primary touch — **pad, don't shrink** |
| **Focus** | Visible **2px ring, 2px offset, ≥3:1**. Never hidden or obscured. |
| **Sliders / drag** | Every one needs a keyboard alternative |
| **Component states** | Every interactive component defines **default, hover, focus, active, disabled, error**. Skipping one (usually `focus` or `error`) is incomplete work. |

### Never convey state by color alone

Errors, success, and warnings need an **icon + text label**. `--color-feedback-danger` is *always*
paired with an icon and a label. A red border with no icon or text is not an accessible error state
and must not ship. This applies to inline field errors exactly as to alert banners.

### Disabled states

Built from `--color-neutral-400`-backed roles, decorative and inert. They must not be the only way
a user learns **why** something is disabled — pair with helper text where the reason isn't obvious.
(`--color-text-disabled` is non-interactive, so it is exempt from the 4.5:1 body rule.)

---

## 13. Language & copy

- **Token names in English. All user-facing copy in Bahasa Indonesia.**
- **Bahasa strings run ~20–30% longer than English.** Never build a button, tab, or label around a
  tight fixed-width container sized for the English string — they must wrap or resize gracefully,
  never truncate or overflow.
- Where display type uses `clamp()`, verify the fluid range still accommodates the longer
  Indonesian string at the smallest viewport tested.
- Use a single **`Nama Lengkap`** field — not split first/last name.

---

## 14. Do's & Don'ts

| ✅ Do | ⛔ Don't |
|---|---|
| Use semantic / component tokens for every color, space, radius, and elevation value. | Hardcode hex colors or raw pixel values in component styles. |
| Use red sparingly — CTAs, key accents, the logo. | Reference primitive tokens (e.g. `--color-red-500`) directly in UI. |
| Pair every status / feedback indicator with an icon **and** a label. | Convey state by color alone. |
| Set numerics in `--font-numeric` with `tabular-nums` and explicit units. | Use faux Lato weights (500 / 600 / 800) that don't exist in the real font. |
| Write user-facing copy in Bahasa Indonesia, sized for ~20–30% growth. | Set body text in `#FF0000` / `--color-brand-hero` — it fails AA. |
| Test every screen in both light and dark before shipping. | Ship a screen checked in one theme only. |
| Convert px → rem by dividing by **10**. | Divide by 16. |
| Respect `prefers-reduced-motion: reduce` on every transition. | Hardcode a duration or easing value. |

