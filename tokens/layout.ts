import type { ScaleStep } from "./types";

/**
 * Layout tokens. Several of these are NEW: `smsp-brand-identity.md` specifies them in
 * prose (a ~860px breakpoint, a ~1200px container, a 280px sidebar) but defines no token,
 * which left every consumer to retype the literal. They are tokens here.
 */

/**
 * IMPORTANT, and the reason these are declared in px rather than rem.
 *
 * Inside a media query, `rem` resolves against the BROWSER's root font size (16px), not
 * against `html { font-size: 10px }`. A breakpoint written as `86rem` would therefore fire
 * at 1376px, not 860px. px is correct here, and this is the one place in the system where a
 * px literal is right. Everywhere else, divide by 10.
 */
export const BREAKPOINT_PX = 860;

export const breakpoints: ScaleStep[] = [
  {
    name: "breakpoint-md",
    value: `${BREAKPOINT_PX}px`,
    px: BREAKPOINT_PX,
    note: "The single breakpoint. Below: mobile. At or above: desktop.",
  },
];

export const containers: ScaleStep[] = [
  { name: "container-page", value: "1200px", px: 1200, note: "Max content width, centered." },
  { name: "container-sidebar", value: "280px", px: 280, note: "Fixed desktop filter sidebar." },
  {
    name: "container-measure",
    value: "70ch",
    note: "Max line length for body copy — the top of the 45-75ch measure range. Use max-w-measure rather than an arbitrary value.",
  },
];

/**
 * Z-index as a named ladder. Without one, every overlay invents a number and the stack
 * becomes unreadable. Values are sparse so a layer can be inserted without renumbering.
 */
export const zIndices: ScaleStep[] = [
  { name: "z-base", value: "0" },
  { name: "z-raised", value: "10", note: "Cards lifted on hover, sticky table headers." },
  { name: "z-sticky", value: "20", note: "Sticky bottom action bar, sticky section headers." },
  { name: "z-navbar", value: "30", note: "Top navbar and bottom navigation." },
  { name: "z-dropdown", value: "40" },
  { name: "z-overlay", value: "50", note: "Modal and drawer scrim." },
  { name: "z-modal", value: "60" },
  { name: "z-toast", value: "70", note: "Above everything; never blocks the layer beneath." },
];

/** Touch target minimums. `pad, don't shrink` — grow the hit area, never the icon. */
export const TARGET_SIZE = {
  /** WCAG 2.2 AA floor. */
  minPx: 24,
  /** Preferred for primary touch targets, and required in the mobile bottom nav. */
  preferredPx: 44,
} as const;

/**
 * The breakpoint switches three things at once, not just the grid. A change that moves one
 * without the others is incomplete.
 */
export const BREAKPOINT_SWITCHES = [
  "**Layout** — the hero collapses from two columns (copy + graphic) to one; multi-column grids drop from three/four to one or two.",
  "**Navigation** — Navbar above, Bottom Navigation below. **Never both.**",
  "**Filtering** — a persistent sidebar above, filters inline in the list header below. **A filter surface is never an overlay at either width.**",
] as const;

/**
 * Above the breakpoint the sidebar is a fixed 280px, so the NARROW end of the desktop
 * range is the constrained case: a spec table beside it must still fit without the page
 * body scrolling sideways. The table gets its own overflow-x container instead.
 */
export const NARROW_DESKTOP_PX = BREAKPOINT_PX;

/**
 * WCAG 2.2 AA thresholds, as numbers so tests and the generated document cite one source.
 * `src/lib/contrast.ts` mirrors these for runtime use.
 */
export const AA_TEXT = 4.5;
export const AA_UI = 3;
