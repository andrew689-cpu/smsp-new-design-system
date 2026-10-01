import type { Hex, Primitive } from "./types";

/**
 * Tier 1 — the palette and print inks.
 *
 * NOTHING in product UI may reference these. They exist only to define the semantic
 * layer and to specify print production. The Tailwind theme deliberately does not
 * expose them as utilities, so `bg-red-500` does not compile.
 */

export const red: Primitive[] = [
  { name: "red-50", hex: "#FFF2F2", cmyk: "0,5,5,0" },
  { name: "red-100", hex: "#FFCCCC", cmyk: "0,20,20,0" },
  { name: "red-200", hex: "#FF9999", cmyk: "0,40,40,0" },
  { name: "red-300", hex: "#FE6766", cmyk: "0,59,60,0", note: "Dark-mode link/text red." },
  { name: "red-400", hex: "#FE3433", cmyk: "0,80,80,0", note: "Large/decorative; dark-mode danger." },
  {
    name: "red-500",
    hex: "#FF0000",
    cmyk: "0,100,100,0",
    pantone: "485 C",
    note: "Vivid brand red (logo). Large >=24px & decorative only; fails AA body.",
  },
  {
    name: "red-600",
    hex: "#D70100",
    cmyk: "0,100,100,16",
    pantone: "485 C",
    note: "Primary button FILL + white label (5.35:1 AA).",
  },
  {
    name: "red-700",
    hex: "#C1121F",
    cmyk: "0,91,84,24",
    note: "Accessible red text/link/small UI (6.17:1 AA).",
  },
  { name: "red-800", hex: "#A00E19", cmyk: "0,91,84,37", note: "Danger/error, distinct from brand." },
  { name: "red-900", hex: "#7A0A13", cmyk: "0,92,84,52" },
];

export const neutral: Primitive[] = [
  { name: "neutral-0", hex: "#FEFEFE", cmyk: "0,0,0,0" },
  { name: "neutral-50", hex: "#FBFBFB", cmyk: "0,0,0,2" },
  { name: "neutral-100", hex: "#F3F3F3", cmyk: "0,0,0,5" },
  { name: "neutral-200", hex: "#D7D6D4", cmyk: "0,0,1,16" },
  { name: "neutral-300", hex: "#D1D1D1", cmyk: "0,0,0,18" },
  { name: "neutral-400", hex: "#A4A3A3", cmyk: "0,1,1,36", note: "Decorative/disabled only (2.49:1)." },
  { name: "neutral-500", hex: "#767576", cmyk: "0,1,0,54" },
  { name: "neutral-600", hex: "#5D5F61", cmyk: "4,2,0,62" },
  { name: "neutral-700", hex: "#494748", cmyk: "0,3,1,71" },
  { name: "neutral-800", hex: "#2E2C2D", cmyk: "0,4,2,82" },
  { name: "neutral-900", hex: "#1B191A", cmyk: "0,7,4,89", pantone: "Black 6 C" },
  { name: "neutral-950", hex: "#131112", cmyk: "0,11,5,93" },
];

export const blue: Primitive[] = [
  { name: "blue-300", hex: "#66A3E8", cmyk: "56,30,0,9" },
  { name: "blue-500", hex: "#408CE2", cmyk: "72,38,0,11" },
  { name: "blue-700", hex: "#1E6FC8", cmyk: "85,45,0,22" },
];

export const green: Primitive[] = [
  { name: "green-300", hex: "#4CC24C", cmyk: "61,0,61,24" },
  { name: "green-500", hex: "#0B9A0B", cmyk: "93,0,93,40" },
  { name: "green-700", hex: "#087C08", cmyk: "94,0,94,51" },
];

export const orange: Primitive[] = [
  { name: "orange-400", hex: "#F8A857", cmyk: "0,32,65,3" },
  { name: "orange-500", hex: "#F6953C", cmyk: "0,39,76,4" },
  { name: "orange-700", hex: "#B5620F", cmyk: "0,46,92,29" },
];

export const primitiveGroups = [
  { title: "Red", primitives: red },
  { title: "Neutral (steel-gray)", primitives: neutral },
  { title: "Status — blue (info)", primitives: blue },
  { title: "Status — green (success)", primitives: green },
  { title: "Status — orange (warning)", primitives: orange },
] as const;

export const allPrimitives: Primitive[] = [...red, ...neutral, ...blue, ...green, ...orange];

/** Resolve a primitive name to its hex. Throws rather than emitting a broken stylesheet. */
export function resolve(name: string): Hex {
  const found = allPrimitives.find((p) => p.name === name);
  if (!found) {
    throw new Error(
      `Unknown primitive "${name}". Semantic tokens may only reference a primitive defined in tokens/primitives.ts, or set literal: true.`,
    );
  }
  return found.hex;
}

export const printInks = {
  brandRed: "Pantone 485 C",
  nearBlack: "Pantone Black 6 C",
} as const;
