import type { ScaleStep } from "./types";

/**
 * Focus and motion.
 *
 * Every transition must respect `prefers-reduced-motion: reduce`, and motion is never the
 * only cue for a state change. Both are Tier 1 — enforced, not advised.
 */

export const focus = {
  ringWidth: { name: "focus-ring-width", value: "2px" },
  ringOffset: { name: "focus-ring-offset", value: "2px" },
  /** The ring colour is a semantic token (`focus-ring`), not defined here. */
  implementation: [
    "outline: var(--focus-ring-width) solid var(--color-focus-ring);",
    "outline-offset: var(--focus-ring-offset);",
  ].join("\n"),
  /** `action-primary` was an interim stand-in and must not be used as the ring. */
  forbiddenRingColour: "action-primary",
} as const;

export const durations: ScaleStep[] = [
  { name: "duration-instant", value: "0ms" },
  { name: "duration-fast", value: "100ms" },
  { name: "duration-base", value: "150ms" },
  { name: "duration-slow", value: "200ms" },
  { name: "duration-slower", value: "300ms" },
];

export const easings: ScaleStep[] = [
  { name: "easing-standard", value: "cubic-bezier(0.2, 0, 0, 1)" },
];

export const MOTION_RULES = [
  "Every transition and animation must respect `prefers-reduced-motion: reduce` — remove transforms and parallax, keep at most an opacity cross-fade. Motion a user cannot turn off does not ship.",
  "Never hardcode a millisecond value or an easing curve. Use the tokens.",
  "Motion is never the only cue. A state change signalled by movement alone disappears under reduced motion — pair it with a token, text, or icon change that survives.",
] as const;
