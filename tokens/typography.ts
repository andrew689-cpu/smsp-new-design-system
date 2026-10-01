import type { ScaleStep } from "./types";

/**
 * Root sizing is `html { font-size: 10px }`, so every rem value here is px / 10.
 * Dividing by 16 is a Tier 1 contract violation.
 */
export const ROOT_FONT_SIZE_PX = 10;

/** px -> rem at this system's root size. */
export function rem(px: number): string {
  const value = px / ROOT_FONT_SIZE_PX;
  return `${Number(value.toFixed(4))}rem`;
}

export const families = [
  {
    role: "font-body",
    primitive: "font-family-base",
    stack: "Lato, 'Helvetica Neue', Arial, sans-serif",
    use: "Body copy **and** headings",
  },
  {
    role: "font-numeric",
    primitive: "font-family-numeric",
    stack: "Inter, 'Helvetica Neue', Arial, sans-serif",
    use: "Tabular figures only — measurements, prices, quantities",
  },
] as const;

/**
 * Lato ships 400 / 700 / 900 only. 500 / 600 / 800 are faux weights the browser
 * synthesises, and they render visibly inconsistent — so the Tailwind theme resets the
 * `--font-weight-*` namespace and defines only these three. `font-medium` does not compile.
 */
export const weights: ScaleStep[] = [
  { name: "font-weight-regular", value: "400", note: "Lato Regular" },
  { name: "font-weight-bold", value: "700", note: "Lato Bold" },
  { name: "font-weight-black", value: "900", note: "Lato Black" },
];

export const fontSizes: ScaleStep[] = [
  { name: "font-size-caption", value: rem(12), px: 12, note: "Captions, fine print" },
  { name: "font-size-small", value: rem(14), px: 14, note: "Secondary / help text" },
  { name: "font-size-body", value: rem(16), px: 16, note: "Default body copy" },
  { name: "font-size-body-lg", value: rem(18), px: 18, note: "Lead paragraphs" },
  { name: "font-size-h4", value: rem(20), px: 20, note: "Smallest heading level" },
  { name: "font-size-h3", value: rem(24), px: 24, note: "Sub-section headings" },
  { name: "font-size-h2", value: rem(32), px: 32, note: "Section headings" },
  { name: "font-size-h1", value: rem(40), px: 40, note: "Page headings" },
  { name: "font-size-display", value: rem(64), px: 64, note: "Hero / display headlines" },
];

export const lineHeights: ScaleStep[] = [
  { name: "line-height-tight", value: "1.15", note: "Large headings" },
  { name: "line-height-snug", value: "1.25", note: "Headings" },
  { name: "line-height-normal", value: "1.5", note: "Body copy" },
];

/**
 * NEW in this implementation. `ui-ux-design-principles.md` (P1 #6) requires subtle
 * letter spacing on small uppercase labels, and `smsp-brand-identity.md` defines no
 * token for it. Added here rather than left to per-component literals.
 */
export const letterSpacings: ScaleStep[] = [
  { name: "letter-spacing-tight", value: "-0.01em", note: "Display sizes, where default tracking reads loose" },
  { name: "letter-spacing-normal", value: "0", note: "Default — body and headings" },
  {
    name: "letter-spacing-wide",
    value: "0.04em",
    note: "Small uppercase labels and badges. Required by the composition guide; tight uppercase is hard to read.",
  },
];

/** The h1 -> display step is a deliberate 1.6x golden leap, not a linear one. */
export const GOLDEN_LEAP = { from: "font-size-h1", to: "font-size-display", ratio: 1.6 } as const;

/** Measure: body copy should sit in this character range. Enforced as a Tier 2 warning. */
export const MEASURE_RANGE_CH = { min: 45, max: 75 } as const;
