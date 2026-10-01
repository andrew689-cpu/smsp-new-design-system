/**
 * WCAG 2.2 relative luminance and contrast ratio.
 *
 * Used in two places: the token build, so the generated brand document reports MEASURED
 * ratios rather than asserted ones, and the token test suite, which fails if any text role
 * drops below its required threshold in either theme.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** WCAG 2.2 AA thresholds. */
export const AA = {
  /** Body text and any text below 24px (or 18.66px bold). */
  text: 4.5,
  /** Large text, icons, and the boundaries of UI components. */
  largeTextAndUi: 3,
} as const;

export function parseHex(hex: string): Rgb {
  const clean = hex.trim().replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Not a 6-digit hex colour: "${hex}"`);
  }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Flatten a translucent colour over an opaque backdrop. */
export function composite(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  const mix = (f: number, b: number) => Math.round(f * alpha + b * (1 - alpha));
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b) };
}

export function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (raw: number) => {
    const s = raw / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two opaque colours, 1..21. */
export function contrastRatio(a: string | Rgb, b: string | Rgb): number {
  const rgbA = typeof a === "string" ? parseHex(a) : a;
  const rgbB = typeof b === "string" ? parseHex(b) : b;
  const lumA = relativeLuminance(rgbA);
  const lumB = relativeLuminance(rgbB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Ratio rounded the way the brand document reports it. */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

export function meetsAA(ratio: number, threshold: number = AA.text): boolean {
  // Round to 2dp first: a measured 4.4996 reports as "4.50:1" and must not then fail.
  return Number(ratio.toFixed(2)) >= threshold;
}
