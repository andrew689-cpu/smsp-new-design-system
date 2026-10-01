import type { ThemedValue } from "./types";

/**
 * Elevation communicates stacking order, not decoration.
 *
 * The two themes work differently BY DESIGN. Light uses soft layered shadows. Dark cannot —
 * a near-black shadow is invisible on a near-black surface — so dark substitutes a 1px
 * hairline ring in `border-strong` (3.81:1 on the dark surface). In dark the ring is the
 * only separator, which makes it meaningful rather than decorative; depth comes from the
 * surface step (`bg-surface` vs `bg-canvas`), not from ring weight.
 *
 * Do not "fix" the dark values by adding a shadow. There is no shadow that reads there.
 */

const DARK_RING = "0 0 0 1px #767576";

export interface ElevationToken extends ThemedValue {
  name: string;
  note?: string;
}

export const elevations: ElevationToken[] = [
  {
    name: "elevation-1",
    light: "0 1px 2px rgba(27,25,26,0.06), 0 1px 3px rgba(27,25,26,0.10)",
    dark: DARK_RING,
    literal: true,
  },
  {
    name: "elevation-2",
    light: "0 2px 4px rgba(27,25,26,0.06), 0 4px 8px rgba(27,25,26,0.10)",
    dark: DARK_RING,
    literal: true,
  },
  {
    name: "elevation-3",
    light: "0 4px 8px rgba(27,25,26,0.08), 0 8px 16px rgba(27,25,26,0.12)",
    dark: DARK_RING,
    literal: true,
  },
  {
    name: "elevation-4",
    light: "0 8px 16px rgba(27,25,26,0.10), 0 16px 32px rgba(27,25,26,0.16)",
    dark: DARK_RING,
    literal: true,
  },
  {
    name: "elevation-up-1",
    light: "0 -4px 12px rgba(27,25,26,0.08)",
    dark: "0 -1px 0 0 #767576",
    literal: true,
  },
];

/** Semantic roles. Prefer these over the numeric ladder, exactly as semantic colours beat primitives. */
export const elevationRoles: { name: string; references: string; note?: string }[] = [
  { name: "elevation-card", references: "elevation-1" },
  { name: "elevation-dropdown", references: "elevation-2" },
  { name: "elevation-popover", references: "elevation-3" },
  { name: "elevation-modal", references: "elevation-4" },
  { name: "elevation-sticky", references: "elevation-up-1", note: "Sticky bottom bars." },
];

/**
 * The scrim does not dim on dark and no value can: composited over the near-black canvas
 * it measures 1.04:1 (black at 85% still only reaches 1.10:1). On dark, an overlaid
 * surface is separated by its border ring, never by the scrim.
 */
export const SCRIM_CAVEAT =
  "`--color-overlay` does **not** dim on dark. Don't raise its alpha expecting it to help.";
