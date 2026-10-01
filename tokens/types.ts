/**
 * Token model for the SMS Perkasa design system.
 *
 * These types exist so the token source can carry everything BOTH consumers need:
 * the CSS build (values, theme resolution) and the generated brand document
 * (CMYK, Pantone, contrast ratios, usage prose). Neither consumer is authoritative —
 * `tokens/` is. See docs/adr/0001-tokens-are-the-source-of-truth.md.
 */

export type Hex = `#${string}`;

/** Tier 1: raw palette values. Never referenced from product UI. */
export interface Primitive {
  /** Token suffix, e.g. "red-500" -> --color-red-500 */
  name: string;
  hex: Hex;
  /** Print specification, as "c,m,y,k". */
  cmyk: string;
  pantone?: string;
  note?: string;
}

/**
 * Tier 2/3 values resolve differently per theme. A value is either a reference to a
 * primitive's `name`, or a literal for the handful of cases (overlay alpha, shadow
 * stacks) that no primitive can express.
 */
export interface ThemedValue {
  light: string;
  dark: string;
  /** True when light/dark hold literals rather than primitive names. */
  literal?: boolean;
}

/** Tier 2: the tokens screens are built from. */
export interface SemanticToken extends ThemedValue {
  name: string;
  /** Usage prose, reproduced verbatim in the generated brand document. */
  usage?: string;
  /**
   * The semantic role this colour is measured against, for contrast reporting and tests.
   * Defaults to `bg-surface`. Naming the real backdrop matters: `text-on-brand` is white on
   * a RED fill, so measuring it against the surface would report 1:1 and look like a failure.
   */
  on?: string;
  /**
   * True for roles that are non-interactive by definition and so exempt from the 4.5:1 body
   * rule. Only `text-disabled` qualifies; the flag exists so the test suite skips it
   * explicitly rather than by a name check.
   */
  exemptFromTextContrast?: boolean;
}

/** Tier 3: a narrower layer scoped to one component, built on tier 2. */
export interface ComponentToken extends ThemedValue {
  name: string;
  /** The tier-2 role this is built from, for the doc's "References" column. */
  references: string;
  note?: string;
}

export interface SemanticGroup {
  /** Heading in the generated document, e.g. "Text". */
  title: string;
  tokens: SemanticToken[];
  /** Prose emitted under the group's table. */
  note?: string;
}

export interface ComponentGroup {
  title: string;
  tokens: ComponentToken[];
}

/** A plain scale with no theme dimension: spacing, radius, type sizes. */
export interface ScaleStep {
  name: string;
  value: string;
  /** Pixel equivalent, for the generated document's px column. */
  px?: number;
  note?: string;
}
