import { describe, expect, it } from "vitest";
import {
  AA,
  composite,
  contrastRatio,
  formatRatio,
  meetsAA,
  parseHex,
  relativeLuminance,
} from "./contrast";

describe("parseHex", () => {
  it("parses 6-digit hex", () => {
    expect(parseHex("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("expands 3-digit shorthand", () => {
    expect(parseHex("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("tolerates a missing hash and surrounding space", () => {
    expect(parseHex("  1B191A ")).toEqual({ r: 27, g: 25, b: 26 });
  });

  it("rejects anything that is not a hex colour", () => {
    expect(() => parseHex("rebeccapurple")).toThrow(/hex/);
    expect(() => parseHex("#12345")).toThrow(/hex/);
  });
});

describe("relativeLuminance", () => {
  it("anchors at 0 for black and 1 for white", () => {
    expect(relativeLuminance(parseHex("#000000"))).toBeCloseTo(0, 6);
    expect(relativeLuminance(parseHex("#FFFFFF"))).toBeCloseTo(1, 6);
  });
});

describe("contrastRatio", () => {
  it("returns the WCAG maximum for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 4);
  });

  it("returns 1 for a colour against itself", () => {
    expect(contrastRatio("#D70100", "#D70100")).toBeCloseTo(1, 6);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#C1121F", "#FEFEFE")).toBeCloseTo(contrastRatio("#FEFEFE", "#C1121F"), 10);
  });

  it("reproduces the brand document's published ratios", () => {
    // These four numbers appear in the brand reference; they are measured, not asserted.
    expect(formatRatio(contrastRatio("#FEFEFE", "#D70100"))).toBe("5.35:1");
    expect(formatRatio(contrastRatio("#C1121F", "#FEFEFE"))).toBe("6.17:1");
    expect(formatRatio(contrastRatio("#A4A3A3", "#FEFEFE"))).toBe("2.49:1");
    expect(formatRatio(contrastRatio("#767576", "#1B191A"))).toBe("3.81:1");
  });
});

describe("composite", () => {
  it("flattens the modal scrim over white the way the document reports", () => {
    const scrim = composite(parseHex("#1B191A"), 0.6, parseHex("#FEFEFE"));
    expect(formatRatio(contrastRatio(scrim, "#FEFEFE"))).toBe("4.55:1");
  });

  it("confirms the scrim cannot dim the dark canvas, at any alpha", () => {
    // The documented reason dark relies on a border ring instead of the scrim.
    const overDark = composite(parseHex("#1B191A"), 0.6, parseHex("#131112"));
    expect(contrastRatio(overDark, "#131112")).toBeLessThan(1.1);

    const pureBlackAt85 = composite(parseHex("#000000"), 0.85, parseHex("#131112"));
    expect(contrastRatio(pureBlackAt85, "#131112")).toBeLessThan(1.2);
  });
});

describe("meetsAA", () => {
  it("passes a ratio that rounds to exactly the threshold", () => {
    // 4.4996 reports as "4.50:1", so failing it would contradict the published figure.
    expect(meetsAA(4.4996, AA.text)).toBe(true);
  });

  it("fails a ratio below the threshold", () => {
    expect(meetsAA(4.49, AA.text)).toBe(false);
  });

  it("defaults to the body-text threshold", () => {
    expect(meetsAA(3.5)).toBe(false);
    expect(meetsAA(3.5, AA.largeTextAndUi)).toBe(true);
  });
});
