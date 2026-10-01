import type { SemanticGroup } from "./types";

/**
 * Tier 2 — the tokens screens are built from. These resolve light/dark automatically.
 *
 * `light` and `dark` name a primitive unless `literal: true`, which is reserved for
 * values no primitive can express (the overlay's alpha).
 */

export const semanticGroups: SemanticGroup[] = [
  {
    title: "Text",
    tokens: [
      { name: "text-default", light: "neutral-900", dark: "neutral-50", usage: "Primary body text." },
      { name: "text-muted", light: "neutral-600", dark: "neutral-300" },
      { name: "text-subtle", light: "neutral-500", dark: "neutral-400" },
      { name: "text-link", light: "red-700", dark: "red-300", usage: "Accessible red link (6.17:1)." },
      {
        name: "text-on-brand",
        light: "neutral-0",
        dark: "neutral-0",
        on: "action-primary",
        usage: "Text on red/brand fills. White only.",
      },
      {
        name: "text-disabled",
        light: "neutral-400",
        dark: "neutral-400",
        exemptFromTextContrast: true,
        usage: "Disabled control text; non-interactive, so exempt from the 4.5:1 body rule.",
      },
      {
        name: "text-inverse",
        light: "neutral-0",
        dark: "neutral-0",
        on: "bg-inverse",
        usage: "Body text on an inverted surface — footer, dark CTA banners.",
      },
      {
        name: "text-inverse-muted",
        light: "neutral-300",
        dark: "neutral-300",
        on: "bg-inverse",
        usage: "Secondary text on an inverted surface.",
      },
    ],
  },
  {
    title: "Background",
    tokens: [
      { name: "bg-canvas", light: "neutral-0", dark: "neutral-950" },
      { name: "bg-surface", light: "neutral-0", dark: "neutral-900" },
      { name: "bg-subtle", light: "neutral-100", dark: "neutral-800" },
      { name: "bg-brand-subtle", light: "red-50", dark: "red-900" },
      {
        name: "bg-inverse",
        light: "neutral-900",
        dark: "neutral-900",
        usage: "Inverted surface: footer and dark CTA banners.",
      },
      {
        name: "bg-inverse-raised",
        light: "neutral-800",
        dark: "neutral-800",
        usage: "Raised panel on an inverted surface.",
      },
    ],
  },
  {
    title: "Border",
    tokens: [
      { name: "border-default", light: "neutral-300", dark: "neutral-700", usage: "Decorative dividers." },
      {
        name: "border-strong",
        light: "neutral-500",
        dark: "neutral-500",
        usage: "Meaningful borders (>=3:1).",
      },
      {
        name: "border-inverse",
        light: "neutral-700",
        dark: "neutral-700",
        usage: "Divider on an inverted surface.",
      },
    ],
  },
  {
    title: "Action",
    tokens: [
      {
        name: "action-primary",
        light: "red-600",
        dark: "red-600",
        usage: "Primary CTA fill, white label, use sparingly.",
      },
      { name: "action-primary-hover", light: "red-700", dark: "red-500" },
      { name: "action-primary-active", light: "red-800", dark: "red-700" },
    ],
  },
  {
    title: "Feedback",
    tokens: [
      {
        name: "feedback-danger",
        light: "red-800",
        dark: "red-400",
        usage: "Errors/destructive. Pair with icon + label; never color alone.",
      },
      { name: "feedback-success", light: "green-700", dark: "green-300" },
      {
        name: "feedback-warning",
        light: "orange-500",
        dark: "orange-400",
        usage: "Fill only; text uses orange.700.",
      },
      { name: "feedback-info", light: "blue-700", dark: "blue-300" },
    ],
    note: "Every feedback color must be paired with an **icon + text label**.",
  },
  {
    title: "Brand & focus",
    tokens: [
      {
        name: "brand-hero",
        light: "red-500",
        dark: "red-500",
        usage: "Vivid red for large decorative/hero fills only.",
      },
      {
        name: "focus-ring",
        light: "red-700",
        dark: "red-300",
        usage: "Focus ring color; clears >=3:1 on every surface (6.17:1 on white).",
      },
    ],
  },
  {
    title: "Overlay",
    tokens: [
      {
        name: "overlay",
        light: "rgba(27, 25, 26, 0.6)",
        dark: "rgba(27, 25, 26, 0.6)",
        literal: true,
        usage:
          "Modal/drawer scrim: dark neutral at ~60% alpha. On light it dims the backdrop by 4.55:1 and is the separator. On dark it cannot dim at all, so it is decorative there and the ring does the work.",
      },
    ],
  },
];

export const allSemanticTokens = semanticGroups.flatMap((g) => g.tokens);

/** Every semantic token name, for the lint rule that bans primitives in product code. */
export const semanticTokenNames = allSemanticTokens.map((t) => t.name);
