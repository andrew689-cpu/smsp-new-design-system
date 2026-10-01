import { describe, expect, it } from "vitest";
import * as T from "./index";
import { AA, contrastRatio, formatRatio, meetsAA, parseHex } from "../src/lib/contrast";

/**
 * Token-level contract tests.
 *
 * These assert the rules that can be checked from the token source alone, before any
 * component exists. An accessibility failure caught here is a failure in the SYSTEM, which
 * is cheaper to find than the same failure surfacing once per screen.
 */

function semanticValue(token: T.SemanticToken, theme: "light" | "dark"): string {
  return token.literal ? token[theme] : T.resolve(token[theme]);
}

function backdrop(token: T.SemanticToken, theme: "light" | "dark"): string {
  const role = T.allSemanticTokens.find((s) => s.name === (token.on ?? "bg-surface"));
  if (!role) throw new Error(`${token.name} declares an unknown backdrop`);
  return semanticValue(role, theme);
}

const THEMES = ["light", "dark"] as const;

describe("token integrity", () => {
  it("has no duplicate semantic token names", () => {
    const names = T.allSemanticTokens.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("has no duplicate primitive names", () => {
    const names = T.allPrimitives.map((p) => p.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("resolves every semantic token to a defined primitive", () => {
    for (const token of T.allSemanticTokens) {
      if (token.literal) continue;
      for (const theme of THEMES) {
        expect(() => T.resolve(token[theme]), `${token.name} (${theme})`).not.toThrow();
      }
    }
  });

  it("points every component token at a real semantic role", () => {
    const roles = new Set(T.allSemanticTokens.map((t) => t.name));
    for (const token of T.allComponentTokens) {
      expect(roles.has(token.references), `${token.name} -> ${token.references}`).toBe(true);
    }
  });

  it("points every elevation role at a defined elevation step", () => {
    const steps = new Set(T.elevations.map((e) => e.name));
    for (const role of T.elevationRoles) {
      expect(steps.has(role.references), `${role.name} -> ${role.references}`).toBe(true);
    }
  });

  it("declares every primitive as a valid 6-digit hex", () => {
    for (const p of T.allPrimitives) {
      expect(() => parseHex(p.hex), `${p.name} = ${p.hex}`).not.toThrow();
    }
  });
});

describe("WCAG 2.2 AA — text roles, both themes", () => {
  const textRoles = T.semanticGroups.find((g) => g.title === "Text")!.tokens;

  for (const token of textRoles) {
    if (token.exemptFromTextContrast) {
      it(`${token.name} is documented as exempt and is not asserted`, () => {
        expect(token.usage).toMatch(/exempt/i);
      });
      continue;
    }

    for (const theme of THEMES) {
      it(`${token.name} clears ${AA.text}:1 on ${token.on ?? "bg-surface"} (${theme})`, () => {
        const ratio = contrastRatio(semanticValue(token, theme), backdrop(token, theme));
        expect(meetsAA(ratio, AA.text), `measured ${formatRatio(ratio)}`).toBe(true);
      });
    }
  }
});

describe("WCAG 2.2 AA — non-text contrast", () => {
  const role = (name: string) => T.allSemanticTokens.find((t) => t.name === name)!;

  for (const theme of THEMES) {
    it(`border-strong clears ${AA.largeTextAndUi}:1 on bg-surface (${theme})`, () => {
      const ratio = contrastRatio(
        semanticValue(role("border-strong"), theme),
        semanticValue(role("bg-surface"), theme),
      );
      expect(meetsAA(ratio, AA.largeTextAndUi), `measured ${formatRatio(ratio)}`).toBe(true);
    });

    for (const surface of ["bg-surface", "bg-canvas"] as const) {
      it(`focus-ring clears ${AA.largeTextAndUi}:1 on ${surface} (${theme})`, () => {
        const ratio = contrastRatio(
          semanticValue(role("focus-ring"), theme),
          semanticValue(role(surface), theme),
        );
        expect(meetsAA(ratio, AA.largeTextAndUi), `measured ${formatRatio(ratio)}`).toBe(true);
      });
    }

    it(`action-primary's label clears ${AA.text}:1 on the button fill (${theme})`, () => {
      const ratio = contrastRatio(
        semanticValue(role("text-on-brand"), theme),
        semanticValue(role("action-primary"), theme),
      );
      expect(meetsAA(ratio, AA.text), `measured ${formatRatio(ratio)}`).toBe(true);
    });
  }

  it("brand-hero fails body-text contrast, which is WHY it is decorative-only", () => {
    // Not a bug: this asserts the documented reason #FF0000 may never carry readable text.
    const ratio = contrastRatio(
      semanticValue(T.allSemanticTokens.find((t) => t.name === "brand-hero")!, "light"),
      T.resolve("neutral-0"),
    );
    expect(meetsAA(ratio, AA.text)).toBe(false);
  });
});

describe("scales", () => {
  it("converts every spacing step by dividing px by 10, never 16", () => {
    for (const step of T.spacing) {
      expect(step.value, step.name).toBe(`${step.px! / T.ROOT_FONT_SIZE_PX}rem`);
    }
  });

  it("converts every type step by dividing px by 10", () => {
    for (const step of T.fontSizes) {
      expect(step.value, step.name).toBe(`${step.px! / T.ROOT_FONT_SIZE_PX}rem`);
    }
  });

  it("defines only the three real Lato weights", () => {
    expect(T.weights.map((w) => w.value)).toEqual(["400", "700", "900"]);
  });

  it("keeps the h1 -> display golden leap at 1.6x", () => {
    const h1 = T.fontSizes.find((f) => f.name === T.GOLDEN_LEAP.from)!.px!;
    const display = T.fontSizes.find((f) => f.name === T.GOLDEN_LEAP.to)!.px!;
    expect(display / h1).toBeCloseTo(T.GOLDEN_LEAP.ratio, 5);
  });

  it("declares breakpoints in px, because media-query rem resolves against 16px", () => {
    for (const bp of T.breakpoints) {
      expect(bp.value, bp.name).toMatch(/px$/);
    }
  });

  it("keeps the radius scale biased square — no container role above 8px", () => {
    for (const role of T.radiusRoles) {
      expect(parseInt(role.value, 10), role.name).toBeLessThanOrEqual(8);
    }
  });

  it("gives every z-index a unique, ordered value", () => {
    const values = T.zIndices.map((z) => Number(z.value));
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("the dark theme's elevation strategy", () => {
  it("replaces every shadow with a hairline ring, because shadows do not read on dark", () => {
    for (const e of T.elevations) {
      expect(e.dark, e.name).toMatch(/0 0 0 1px|0 -1px 0 0/);
      expect(e.dark, e.name).not.toMatch(/rgba/);
    }
  });

  it("gives the dark ring at least 3:1 against the dark surface", () => {
    const ratio = contrastRatio(T.resolve("neutral-500"), T.resolve("neutral-900"));
    expect(meetsAA(ratio, AA.largeTextAndUi), `measured ${formatRatio(ratio)}`).toBe(true);
  });
});
