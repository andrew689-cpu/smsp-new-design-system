<!--
GENERATED FILE — DO NOT EDIT.
Source of truth: tokens/
Regenerate: npm run tokens
Edit smsp-brand-identity.md and your change will be overwritten.
-->

# SMS Perkasa — Brand Identity Reference

**PT. Sumber Makmur Surya Perkasa** · Indonesian B2B structural-steel distributor

*Every value below is generated from `tokens/`, and every contrast ratio is measured at build
time rather than asserted. Token version 1.0.0.*

---

## 1. Identity at a glance

|  |  |
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
| **Conversion action** | **Hubungi Sales** — there is no cart and no checkout |

### The Fibonacci story, made visible

- **In type:** the step from `--font-size-h1` (40px) to `--font-size-display` (64px) is a deliberate **1.6× golden leap**, not a linear step.
- **In graphics:** the circle-cluster device grows small circles into larger ones, echoing compounding growth from a small, disciplined base. All logo marks share one set of eight circles (radii 98, 60, 37.5, 23, 14, 9.5, 6.5, 4 in a 420×420 viewBox).

### Why the restraint

Squared-off corners, firm borders, and generous-but-purposeful whitespace all reinforce "built to last." **Generous whitespace reads as restraint, and restraint reads as credibility** for an industrial-B2B brand. Nothing should feel decorative for its own sake.

---

## 2. Color — the three tiers

| Tier | Examples | Who may use it |
|---|---|---|
| **1. Primitive** | `--color-red-500`, `--color-neutral-400` | **Nothing in product UI.** Not exposed as Tailwind utilities at all. |
| **2. Semantic** | `--color-text-default`, `--color-action-primary` | ✅ Screens are built from these. They resolve light/dark automatically. |
| **3. Component** | `--button-primary-bg`, `--card-border` | ✅ A narrower layer for specific components, built on tier 2. |

**The rule that keeps the system coherent:** consumers use **semantic or component tokens only**. A change that introduces `--color-red-500` — or a raw hex like `#D70100` — into component styling is a regression, *even if the color happens to match a semantic token's current value*.

If a screen needs a value that isn't already a semantic or component token, that is a signal to **extend the token layer**, not to reach for a primitive or a literal.

---

## 3. Color — primitives (palette + print inks)

> ⛔ **Never reference these in UI.** The Tailwind theme resets the `--color-*` namespace, so
> `bg-red-500` does not compile. Listed here for brand reference and print production.

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

## 4. Color — semantic roles (light + dark)

✅ **These are the tokens you build screens from.** Every ratio below is measured at
build time against the backdrop named in the "Measured on" column — `bg-surface`
(#FEFEFE light, #1B191A dark) unless the role declares another.

### Text

| Token | Light | Dark | Resolves from (light → dark) | Measured on | Contrast L / D | Usage rule |
|---|---|---|---|---|---|---|
| `--color-text-default` | #1B191A | #FBFBFB | `neutral-900` → `neutral-50` | `bg-surface` | 17.34:1 / 16.90:1 | Primary body text. |
| `--color-text-muted` | #5D5F61 | #D1D1D1 | `neutral-600` → `neutral-300` | `bg-surface` | 6.36:1 / 11.45:1 |  |
| `--color-text-subtle` | #767576 | #A4A3A3 | `neutral-500` → `neutral-400` | `bg-surface` | 4.55:1 / 6.95:1 |  |
| `--color-text-link` | #C1121F | #FE6766 | `red-700` → `red-300` | `bg-surface` | 6.17:1 / 6.12:1 | Accessible red link (6.17:1). |
| `--color-text-on-brand` | #FEFEFE | #FEFEFE | `neutral-0` → `neutral-0` | `action-primary` | 5.35:1 / 5.35:1 | Text on red/brand fills. White only. |
| `--color-text-disabled` | #A4A3A3 | #A4A3A3 | `neutral-400` → `neutral-400` | `bg-surface` | 2.49:1 / 6.95:1 (exempt) | Disabled control text; non-interactive, so exempt from the 4.5:1 body rule. |
| `--color-text-inverse` | #FEFEFE | #FEFEFE | `neutral-0` → `neutral-0` | `bg-inverse` | 17.34:1 / 17.34:1 | Body text on an inverted surface — footer, dark CTA banners. |
| `--color-text-inverse-muted` | #D1D1D1 | #D1D1D1 | `neutral-300` → `neutral-300` | `bg-inverse` | 11.45:1 / 11.45:1 | Secondary text on an inverted surface. |

### Background

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-bg-canvas` | #FEFEFE | #131112 | `neutral-0` → `neutral-950` |  |
| `--color-bg-surface` | #FEFEFE | #1B191A | `neutral-0` → `neutral-900` |  |
| `--color-bg-subtle` | #F3F3F3 | #2E2C2D | `neutral-100` → `neutral-800` |  |
| `--color-bg-brand-subtle` | #FFF2F2 | #7A0A13 | `red-50` → `red-900` |  |
| `--color-bg-inverse` | #1B191A | #1B191A | `neutral-900` → `neutral-900` | Inverted surface: footer and dark CTA banners. |
| `--color-bg-inverse-raised` | #2E2C2D | #2E2C2D | `neutral-800` → `neutral-800` | Raised panel on an inverted surface. |

### Border

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-border-default` | #D1D1D1 | #494748 | `neutral-300` → `neutral-700` | Decorative dividers. |
| `--color-border-strong` | #767576 | #767576 | `neutral-500` → `neutral-500` | Meaningful borders (>=3:1). |
| `--color-border-inverse` | #494748 | #494748 | `neutral-700` → `neutral-700` | Divider on an inverted surface. |

### Action

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-action-primary` | #D70100 | #D70100 | `red-600` → `red-600` | Primary CTA fill, white label, use sparingly. |
| `--color-action-primary-hover` | #C1121F | #FF0000 | `red-700` → `red-500` |  |
| `--color-action-primary-active` | #A00E19 | #C1121F | `red-800` → `red-700` |  |

### Feedback

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-feedback-danger` | #A00E19 | #FE3433 | `red-800` → `red-400` | Errors/destructive. Pair with icon + label; never color alone. |
| `--color-feedback-success` | #087C08 | #4CC24C | `green-700` → `green-300` |  |
| `--color-feedback-warning` | #F6953C | #F8A857 | `orange-500` → `orange-400` | Fill only; text uses orange.700. |
| `--color-feedback-info` | #1E6FC8 | #66A3E8 | `blue-700` → `blue-300` |  |

Every feedback color must be paired with an **icon + text label**.

### Brand & focus

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-brand-hero` | #FF0000 | #FF0000 | `red-500` → `red-500` | Vivid red for large decorative/hero fills only. |
| `--color-focus-ring` | #C1121F | #FE6766 | `red-700` → `red-300` | Focus ring color; clears >=3:1 on every surface (6.17:1 on white). |

### Overlay

| Token | Light | Dark | Resolves from (light → dark) | Usage rule |
|---|---|---|---|---|
| `--color-overlay` | rgba(27, 25, 26, 0.6) | rgba(27, 25, 26, 0.6) | literal | Modal/drawer scrim: dark neutral at ~60% alpha. On light it dims the backdrop by 4.55:1 and is the separator. On dark it cannot dim at all, so it is decorative there and the ring does the work. |

---

## 5. Color — component tokens

### Button

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--button-primary-bg` | #D70100 | #D70100 | `action-primary` |  |
| `--button-primary-bg-hover` | #C1121F | #FF0000 | `action-primary-hover` |  |
| `--button-primary-label` | #FEFEFE | #FEFEFE | `text-on-brand` |  |
| `--button-primary-radius` | → | → | `radius-control` | Non-colour role. |

### Input

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--input-bg` | #FEFEFE | #1B191A | `bg-surface` |  |
| `--input-border` | #767576 | #767576 | `border-strong` |  |
| `--input-text` | #1B191A | #FBFBFB | `text-default` |  |
| `--input-radius` | → | → | `radius-control` | Non-colour role. |

### Card

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--card-bg` | #FEFEFE | #1B191A | `bg-surface` |  |
| `--card-border` | #D1D1D1 | #494748 | `border-default` |  |
| `--card-radius` | → | → | `radius-container` | Non-colour role. |
| `--card-shadow` | → | → | `elevation-card` | Non-colour role. |

### Table / spec-table

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--table-header-bg` | #F3F3F3 | #2E2C2D | `bg-subtle` |  |
| `--table-header-text` | #1B191A | #FBFBFB | `text-default` | Pairs with the neutral header-bg; not white, because the header is not a brand fill. |
| `--table-border` | #D1D1D1 | #494748 | `border-default` |  |
| `--table-numeric-font` | → | → | `font-numeric` | Non-colour role. |

### Badge

| Token | Light | Dark | References | Note |
|---|---|---|---|---|
| `--badge-danger-bg` | #F3F3F3 | #2E2C2D | `bg-subtle` | Neutral subtle chip. A same-hue fill is not used: solid danger is ~3.6:1 in dark, and white on the light success fill fails AA. |
| `--badge-danger-accent` | #A00E19 | #FE3433 | `feedback-danger` | The status dot/icon. This carries the meaning, always paired with the text label — never colour alone. |
| `--badge-danger-text` | #1B191A | #FBFBFB | `text-default` | Explicit label colour: 15.76:1 light, 13.40:1 dark on the subtle chip. |
| `--badge-success-bg` | #F3F3F3 | #2E2C2D | `bg-subtle` |  |
| `--badge-success-accent` | #087C08 | #4CC24C | `feedback-success` |  |
| `--badge-success-text` | #1B191A | #FBFBFB | `text-default` |  |

---

## 6. Typography

### Families

| Role token | Family | Use |
|---|---|---|
| `--font-body` | **Lato, 'Helvetica Neue', Arial, sans-serif** | Body copy **and** headings |
| `--font-numeric` | **Inter, 'Helvetica Neue', Arial, sans-serif** | Tabular figures only — measurements, prices, quantities |

Consumers reference the **semantic roles**. **Never use Inter for prose.**

### Weights

| Token | Value | Name |
|---|---|---|
| `--font-weight-regular` | 400 | Lato Regular |
| `--font-weight-bold` | 700 | Lato Bold |
| `--font-weight-black` | 900 | Lato Black |

**Real weights only — 400 / 700 / 900.** Lato does not ship 500 / 600 / 800; browsers fake-bold them and the result is visibly inconsistent. The theme resets `--font-weight-*`, so `font-medium` does not compile.

**Headings are Lato Black (900), uppercase** — this is what gives headlines their "engineered, stamped" feel.

### Type scale

`1rem = 10px`, so every rem value is **px ÷ 10**, not ÷ 16.

| Token | px | rem @ 1rem = 10px | Tailwind utility | Typical use |
|---|---|---|---|---|
| `--font-size-caption` | 12 | 1.2rem | `text-caption` | Captions, fine print |
| `--font-size-small` | 14 | 1.4rem | `text-small` | Secondary / help text |
| `--font-size-body` | 16 | 1.6rem | `text-body` | Default body copy |
| `--font-size-body-lg` | 18 | 1.8rem | `text-body-lg` | Lead paragraphs |
| `--font-size-h4` | 20 | 2rem | `text-h4` | Smallest heading level |
| `--font-size-h3` | 24 | 2.4rem | `text-h3` | Sub-section headings |
| `--font-size-h2` | 32 | 3.2rem | `text-h2` | Section headings |
| `--font-size-h1` | 40 | 4rem | `text-h1` | Page headings |
| `--font-size-display` | 64 | 6.4rem | `text-display` | Hero / display headlines |

The h1 → display step is the system's **golden leap** (1.6×) — see §1.

### Line height

| Token | Value | Use |
|---|---|---|
| `--line-height-tight` | 1.15 | Large headings |
| `--line-height-snug` | 1.25 | Headings |
| `--line-height-normal` | 1.5 | Body copy |

### Letter spacing

| Token | Value | Use |
|---|---|---|
| `--letter-spacing-tight` | -0.01em | Display sizes, where default tracking reads loose |
| `--letter-spacing-normal` | 0 | Default — body and headings |
| `--letter-spacing-wide` | 0.04em | Small uppercase labels and badges. Required by the composition guide; tight uppercase is hard to read. |

**Measure:** keep line lengths at roughly **45–75 characters**.

### Numerics

Anywhere a number is a measurement, quantity or price:

- set it in `var(--font-numeric)` (Inter)
- **right-aligned**
- `font-variant-numeric: tabular-nums` so digits align in a column
- **always with an explicit unit** — kg, mm, batang

A bare number with no unit is ambiguous in an industrial-hardware catalog and must be avoided. The `<Spec>` component requires a `unit` prop, so this is unrepresentable rather than merely discouraged.

---

## 7. Spacing & radius

### Spacing scale (4 / 8px rhythm)

| Token | px | rem | Tailwind utility |
|---|---|---|---|
| `--space-1` | 4 | 0.4rem | `p-1` |
| `--space-2` | 8 | 0.8rem | `p-2` |
| `--space-3` | 12 | 1.2rem | `p-3` |
| `--space-4` | 16 | 1.6rem | `p-4` |
| `--space-5` | 24 | 2.4rem | `p-5` |
| `--space-6` | 32 | 3.2rem | `p-6` |
| `--space-7` | 48 | 4.8rem | `p-7` |
| `--space-8` | 64 | 6.4rem | `p-8` |
| `--space-9` | 96 | 9.6rem | `p-9` |
| `--space-10` | 128 | 12.8rem | `p-10` |

The `--spacing-*` namespace is **reset, not rebased**. A multiplier scale would also mint off-system values (`p-5` = 20px), so only these ten steps exist.

### Named dimensions

| Token | px | rem | Use |
|---|---|---|---|
| `--space-target-min` | 24 | 2.4rem | WCAG 2.2 AA minimum interactive target. min-h-target-min / min-w-target-min. |
| `--space-touch` | 44 | 4.4rem | Preferred primary touch target, and required in the mobile bottom nav. min-h-touch. |

Resetting `--spacing-*` also removes Tailwind's numeric **sizing** vocabulary: `min-h-11` stops compiling and `w-10` becomes 128px rather than 40px. Measured dimensions therefore get a NAME, not a number — `min-h-touch`, not `min-h-11`.

### Radius

| Token | Value |
|---|---|
| `--radius-none` | 0px |
| `--radius-sm` | 2px |
| `--radius-md` | 4px |
| `--radius-lg` | 6px |
| `--radius-xl` | 8px |
| `--radius-pill` | 9999px |
| `--radius-full` | 50% |

| Semantic role | Value | References | Use |
|---|---|---|---|
| `--radius-control` | 4px | `radius-md` | Buttons, inputs, controls |
| `--radius-container` | 6px | `radius-lg` | Cards, panels |
| `--radius-overlay` | 8px | `radius-xl` | Modals, drawers, popovers |

Radius is biased toward **squarer corners** — a deliberate part of the "engineered / solid" read.

---

## 8. Elevation & depth

Elevation communicates **stacking order**, not decoration.

| Token | Light | Dark |
|---|---|---|
| `--elevation-1` | `0 1px 2px rgba(27,25,26,0.06), 0 1px 3px rgba(27,25,26,0.10)` | `0 0 0 1px #767576` |
| `--elevation-2` | `0 2px 4px rgba(27,25,26,0.06), 0 4px 8px rgba(27,25,26,0.10)` | `0 0 0 1px #767576` |
| `--elevation-3` | `0 4px 8px rgba(27,25,26,0.08), 0 8px 16px rgba(27,25,26,0.12)` | `0 0 0 1px #767576` |
| `--elevation-4` | `0 8px 16px rgba(27,25,26,0.10), 0 16px 32px rgba(27,25,26,0.16)` | `0 0 0 1px #767576` |
| `--elevation-up-1` | `0 -4px 12px rgba(27,25,26,0.08)` | `0 -1px 0 0 #767576` |
| `--elevation-card` | → `elevation-1` | → `elevation-1` |
| `--elevation-dropdown` | → `elevation-2` | → `elevation-2` |
| `--elevation-popover` | → `elevation-3` | → `elevation-3` |
| `--elevation-modal` | → `elevation-4` | → `elevation-4` |
| `--elevation-sticky` | → `elevation-up-1` | → `elevation-up-1` |

**The two themes work differently, by design.** Light uses soft layered shadows. **Dark cannot** — a near-black shadow is invisible on a dark surface — so dark substitutes a **1px hairline ring** in `--color-border-strong` (3.81:1 on the dark surface). In dark the ring is the *only* separator, which makes it meaningful rather than decorative.

**Scrim caveat:** `--color-overlay` does **not** dim on dark. Don't raise its alpha expecting it to help.

---

## 9. Focus & motion

### Focus

| Token | Value |
|---|---|
| `--focus-ring-width` | 2px |
| `--focus-ring-offset` | 2px |

Implement it exactly as:

```css
outline: var(--focus-ring-width) solid var(--color-focus-ring);
outline-offset: var(--focus-ring-offset);
```

**Never** remove or hide focus styles, and don't use `--color-action-primary` as the ring — that was an interim stand-in.

### Duration & easing

| Token | Value |
|---|---|
| `--duration-instant` | 0ms |
| `--duration-fast` | 100ms |
| `--duration-base` | 150ms |
| `--duration-slow` | 200ms |
| `--duration-slower` | 300ms |
| `--easing-standard` | cubic-bezier(0.2, 0, 0, 1) |

**Motion rules (non-negotiable):**

- Every transition and animation must respect `prefers-reduced-motion: reduce` — remove transforms and parallax, keep at most an opacity cross-fade. Motion a user cannot turn off does not ship.
- Never hardcode a millisecond value or an easing curve. Use the tokens.
- Motion is never the only cue. A state change signalled by movement alone disappears under reduced motion — pair it with a token, text, or icon change that survives.

---

## 10. Layout & responsive

| Token | Value | Note |
|---|---|---|
| `--breakpoint-md` | 860px | The single breakpoint. Below: mobile. At or above: desktop. |
| `--container-page` | 1200px | Max content width, centered. |
| `--container-sidebar` | 280px | Fixed desktop filter sidebar. |
| `--container-measure` | 70ch | Max line length for body copy — the top of the 45-75ch measure range. Use max-w-measure rather than an arbitrary value. |

**Breakpoints are declared in px, not rem.** Inside a media query `rem` resolves against the browser's 16px root, not our 10px — `86rem` would fire at 1376px. This is the one place a px literal is correct.

### Z-index ladder

| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 |  |
| `--z-raised` | 10 | Cards lifted on hover, sticky table headers. |
| `--z-sticky` | 20 | Sticky bottom action bar, sticky section headers. |
| `--z-navbar` | 30 | Top navbar and bottom navigation. |
| `--z-dropdown` | 40 |  |
| `--z-overlay` | 50 | Modal and drawer scrim. |
| `--z-modal` | 60 |  |
| `--z-toast` | 70 | Above everything; never blocks the layer beneath. |

### The breakpoint switches three things at once

**Design mobile-first.** At ~860px, all three change together — moving one without the others is incomplete:

1. **Layout** — the hero collapses from two columns (copy + graphic) to one; multi-column grids drop from three/four to one or two.
2. **Navigation** — Navbar above, Bottom Navigation below. **Never both.**
3. **Filtering** — a persistent sidebar above, filters inline in the list header below. **A filter surface is never an overlay at either width.**

Above the breakpoint the sidebar is a fixed 280px, so **the narrow end of the desktop range is the constrained case**: a spec table beside it must still fit without the *page body* scrolling sideways — the table gets its own `overflow-x` container instead.

---

## 11. Accessibility rules (WCAG 2.2 AA)

Both themes, always. Asserted by `npm run test:e2e` with axe-core, not left to review.

| Rule | Requirement |
|---|---|
| **Text contrast** | ≥ **4.5:1** |
| **Large text / UI contrast** | ≥ **3:1** |
| **Interactive target size** | ≥ **24×24px**; prefer **44×44px** for primary touch — **pad, don't shrink** |
| **Focus** | Visible **2px ring, 2px offset, ≥3:1**. Never hidden or obscured. |
| **Sliders / drag** | Every one needs a keyboard alternative |
| **Component states** | Every interactive component defines **default, hover, focus, active, disabled, error**. Skipping one is incomplete work. |

### Never convey state by color alone

Errors, success, and warnings need an **icon + text label**. `<Alert>` and `<Badge>` require both props, so a colour-only state does not typecheck.

### Disabled states

Built from `--color-neutral-400`-backed roles, decorative and inert. They must not be the only way a user learns **why** something is disabled — pair with helper text where the reason isn't obvious. (`--color-text-disabled` is non-interactive, so it is exempt from the 4.5:1 body rule.)

---

## 12. Language & copy

- **Token names in English. All user-facing copy in Bahasa Indonesia.**
- **Bahasa strings run ~20–30% longer than English.** Never build a button, tab, or label around a tight fixed-width container sized for the English string — they must wrap or resize gracefully, never truncate or overflow. Asserted by the Bahasa overflow test.
- Where display type uses `clamp()`, verify the fluid range still accommodates the longer Indonesian string at the smallest viewport tested.
- Use a single **`Nama Lengkap`** field — not split first/last name.
- There is no cart. The conversion action is **Hubungi Sales**, everywhere.

---

## 13. Do's & Don'ts

| ✅ Do | ⛔ Don't |
|---|---|
| Use semantic / component tokens for every colour, space, radius and elevation value. | Hardcode hex colours or raw pixel values in component styles. |
| Use red sparingly — CTAs, key accents, the logo. | Reference primitive tokens (e.g. `--color-red-500`) directly in UI. |
| Pair every status / feedback indicator with an icon **and** a label. | Convey state by colour alone. |
| Set numerics in `--font-numeric` with `tabular-nums` and explicit units. | Use faux Lato weights (500 / 600 / 800) that don't exist in the real font. |
| Write user-facing copy in Bahasa Indonesia, sized for ~20–30% growth. | Set body text in `#FF0000` / `--color-brand-hero` — it fails AA. |
| Test every screen in both light and dark before shipping. | Ship a screen checked in one theme only. |
| Convert px → rem by dividing by **10**. | Divide by 16. |
| Respect `prefers-reduced-motion: reduce` on every transition. | Hardcode a duration or easing value. |
| Point every CTA at **Hubungi Sales**. | Build a cart, a checkout, or an Add to Cart button. |

