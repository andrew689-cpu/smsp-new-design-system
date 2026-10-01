import type { ComponentGroup } from "./types";

/**
 * Tier 3 — a narrower layer scoped to one component, built on tier 2.
 *
 * `references` names the tier-2 role. Values are resolved through the semantic layer at
 * build time, so a component token can never silently diverge from the role it claims.
 */

export const componentGroups: ComponentGroup[] = [
  {
    title: "Button",
    tokens: [
      { name: "button-primary-bg", references: "action-primary", light: "", dark: "" },
      { name: "button-primary-bg-hover", references: "action-primary-hover", light: "", dark: "" },
      { name: "button-primary-label", references: "text-on-brand", light: "", dark: "" },
    ],
  },
  {
    title: "Input",
    tokens: [
      { name: "input-bg", references: "bg-surface", light: "", dark: "" },
      { name: "input-border", references: "border-strong", light: "", dark: "" },
      { name: "input-text", references: "text-default", light: "", dark: "" },
    ],
  },
  {
    title: "Card",
    tokens: [
      { name: "card-bg", references: "bg-surface", light: "", dark: "" },
      { name: "card-border", references: "border-default", light: "", dark: "" },
    ],
  },
  {
    title: "Table / spec-table",
    tokens: [
      { name: "table-header-bg", references: "bg-subtle", light: "", dark: "" },
      {
        name: "table-header-text",
        references: "text-default",
        light: "",
        dark: "",
        note: "Pairs with the neutral header-bg; not white, because the header is not a brand fill.",
      },
      { name: "table-border", references: "border-default", light: "", dark: "" },
    ],
  },
  {
    title: "Badge",
    tokens: [
      {
        name: "badge-danger-bg",
        references: "bg-subtle",
        light: "",
        dark: "",
        note: "Neutral subtle chip. A same-hue fill is not used: solid danger is ~3.6:1 in dark, and white on the light success fill fails AA.",
      },
      {
        name: "badge-danger-accent",
        references: "feedback-danger",
        light: "",
        dark: "",
        note: "The status dot/icon. This carries the meaning, always paired with the text label — never colour alone.",
      },
      {
        name: "badge-danger-text",
        references: "text-default",
        light: "",
        dark: "",
        note: "Explicit label colour: 15.76:1 light, 13.40:1 dark on the subtle chip.",
      },
      { name: "badge-success-bg", references: "bg-subtle", light: "", dark: "" },
      { name: "badge-success-accent", references: "feedback-success", light: "", dark: "" },
      { name: "badge-success-text", references: "text-default", light: "", dark: "" },
    ],
  },
];

/**
 * Component tokens that point at a non-colour role (radius, elevation, font). Kept
 * separate because they resolve through a different scale.
 */
export const componentAliases: { name: string; references: string; group: string }[] = [
  { name: "button-primary-radius", references: "radius-control", group: "Button" },
  { name: "input-radius", references: "radius-control", group: "Input" },
  { name: "card-radius", references: "radius-container", group: "Card" },
  { name: "card-shadow", references: "elevation-card", group: "Card" },
  { name: "table-numeric-font", references: "font-numeric", group: "Table / spec-table" },
];

export const allComponentTokens = componentGroups.flatMap((g) => g.tokens);
