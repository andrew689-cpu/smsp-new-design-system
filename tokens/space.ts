import type { ScaleStep } from "./types";
import { rem } from "./typography";

/**
 * Spacing follows a 4 / 8px rhythm. The scale is deliberately non-linear at the top end.
 *
 * Tailwind's `--spacing-*` namespace is RESET rather than rebased: a multiplier-based
 * scale would also mint off-system values (`p-5` = 20px, `p-7` = 28px), which is exactly
 * the leak the contract exists to close. Only these ten steps compile.
 */
export const spacing: ScaleStep[] = [
  { name: "space-1", value: rem(4), px: 4 },
  { name: "space-2", value: rem(8), px: 8 },
  { name: "space-3", value: rem(12), px: 12 },
  { name: "space-4", value: rem(16), px: 16 },
  { name: "space-5", value: rem(24), px: 24 },
  { name: "space-6", value: rem(32), px: 32 },
  { name: "space-7", value: rem(48), px: 48 },
  { name: "space-8", value: rem(64), px: 64 },
  { name: "space-9", value: rem(96), px: 96 },
  { name: "space-10", value: rem(128), px: 128 },
];

/**
 * Named sizing steps, kept in the same Tailwind namespace as spacing because Tailwind has
 * only one.
 *
 * These exist because resetting `--spacing-*` removes Tailwind's entire NUMERIC sizing
 * vocabulary along with its spacing scale: `min-h-11` (44px by default) stops compiling, and
 * `w-10` silently becomes `--spacing-10` = 128px rather than 40px. The ten steps above are a
 * spacing rhythm, not a dimension scale, so anything that is a measured DIMENSION gets a
 * name here instead of a number.
 */
export const sizes: ScaleStep[] = [
  {
    name: "space-target-min",
    value: rem(24),
    px: 24,
    note: "WCAG 2.2 AA minimum interactive target. min-h-target-min / min-w-target-min.",
  },
  {
    name: "space-touch",
    value: rem(44),
    px: 44,
    note: "Preferred primary touch target, and required in the mobile bottom nav. min-h-touch.",
  },
];

/**
 * Radius is biased toward squarer corners — part of the "engineered / solid" read.
 * Prefer the semantic roles over the numbered steps.
 */
export const radius: ScaleStep[] = [
  { name: "radius-none", value: "0px", px: 0 },
  { name: "radius-sm", value: "2px", px: 2 },
  { name: "radius-md", value: "4px", px: 4 },
  { name: "radius-lg", value: "6px", px: 6 },
  { name: "radius-xl", value: "8px", px: 8 },
  { name: "radius-pill", value: "9999px" },
  { name: "radius-full", value: "50%" },
];

export const radiusRoles: { name: string; references: string; value: string; note: string }[] = [
  { name: "radius-control", references: "radius-md", value: "4px", note: "Buttons, inputs, controls" },
  { name: "radius-container", references: "radius-lg", value: "6px", note: "Cards, panels" },
  { name: "radius-overlay", references: "radius-xl", value: "8px", note: "Modals, drawers, popovers" },
];
