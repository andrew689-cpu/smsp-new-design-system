import { describe, expect, it } from "vitest";
import { scanSource, stripComments, classNameSpans } from "./contract-rules";

/**
 * Proof that each rule catches its violation AND leaves the legitimate form alone.
 *
 * Both halves matter. A rule that only fires is as useless as one that never does: false
 * positives are what teach a team to pass `--no-verify`.
 */

const tsx = (source: string) => scanSource({ file: "src/x.tsx", source });
const css = (source: string) => scanSource({ file: "src/x.css", source });
const rules = (source: string, scan = tsx) => scan(source).map((f) => f.rule);

describe("dead-utility", () => {
  it("catches a spacing class outside the ten-step scale", () => {
    // min-h-11 was real in the showcase: a 44px touch target that silently did not exist.
    expect(rules('<div className="min-h-11" />')).toContain("dead-utility");
  });

  it("catches font-normal, because our 400 token is named regular", () => {
    expect(rules('<th className="font-normal" />')).toContain("dead-utility");
  });

  it("catches a Tailwind default that the reset removed", () => {
    expect(rules('<div className="max-w-7xl rounded-2xl shadow-lg" />')).toContain("dead-utility");
  });

  it("accepts the named dimension tokens", () => {
    expect(rules('<div className="min-h-touch min-w-target-min" />')).toEqual([]);
  });

  it("accepts on-scale spacing, colour, radius and elevation", () => {
    expect(
      rules('<div className="p-5 gap-2 bg-action-primary text-text-muted rounded-control shadow-card" />'),
    ).toEqual([]);
  });

  it("accepts core keywords that survive the reset", () => {
    expect(rules('<div className="w-full h-auto max-w-none text-center border-2 border-solid" />')).toEqual([]);
  });

  it("accepts fractions and the measure container", () => {
    expect(rules('<div className="w-1/2 max-w-measure" />')).toEqual([]);
  });

  it("looks through variants to the utility underneath", () => {
    expect(rules('<div className="md:p-6 hover:bg-action-primary-hover focus:ring-focus-ring" />')).toEqual([]);
    expect(rules('<div className="md:p-99" />')).toContain("dead-utility");
  });

  it("flags a breakpoint variant the system does not define", () => {
    expect(rules('<div className="xl:p-5" />')).toContain("unknown-variant");
  });

  it("reads classes out of an array-join expression", () => {
    const source = `<button className={["p-5", active ? "bg-action-primary" : "min-h-11"].join(" ")} />`;
    expect(rules(source)).toContain("dead-utility");
  });

  it("ignores prose that merely looks like a class", () => {
    // Indonesian copy and ordinary props must never trip the utility scanner.
    expect(rules('<p title="harga-per-batang">Hubungi Sales untuk harga</p>')).toEqual([]);
  });
});

describe("colour rules", () => {
  it("catches a raw hex in a component", () => {
    expect(rules('<div style={{ color: "#D70100" }} />')).toContain("raw-hex");
  });

  it("catches a primitive referenced through var()", () => {
    expect(rules('<div style={{ color: "var(--color-red-500)" }} />')).toContain("primitive-token");
  });

  it("catches a primitive utility class", () => {
    expect(rules('<div className="bg-red-500" />')).toContain("primitive-utility");
  });

  it("leaves semantic and component tokens alone", () => {
    expect(rules('<div style={{ color: "var(--color-text-link)" }} className="bg-card-bg" />')).toEqual([]);
  });

  it("allows hex in a test file, which asserts colour maths and ships nothing", () => {
    const found = scanSource({ file: "src/lib/contrast.test.ts", source: 'expect(f("#FF0000"))' });
    expect(found.map((f) => f.rule)).not.toContain("raw-hex");
  });
});

describe("arbitrary values", () => {
  it("catches an arbitrary colour, spacing and size", () => {
    const found = rules('<div className="bg-[#FF0000] p-[13px] max-w-[70ch]" />');
    expect(found.filter((r) => r === "arbitrary-value")).toHaveLength(3);
  });
});

describe("motion and focus", () => {
  it("catches a hardcoded duration", () => {
    expect(rules('<div style={{ transition: "opacity 200ms" }} />')).toContain("raw-duration");
  });

  it("catches a hardcoded easing curve", () => {
    expect(rules('<div style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 1, 1)" }} />')).toContain(
      "raw-duration",
    );
  });

  it("catches a removed focus ring in both spellings", () => {
    expect(rules('<div className="outline-none" />')).toContain("focus-removed");
    expect(css("a:focus { outline: none; }")).toEqual(
      expect.arrayContaining([expect.objectContaining({ rule: "focus-removed" })]),
    );
  });

  it("accepts token-driven motion", () => {
    expect(rules('<div style={{ transitionDuration: "var(--duration-base)" }} />')).toEqual([]);
  });
});

describe("typography", () => {
  it("catches every faux Lato weight", () => {
    for (const cls of ["font-medium", "font-semibold", "font-extrabold", "font-light"]) {
      expect(rules(`<div className="${cls}" />`), cls).toContain("faux-weight");
    }
  });

  it("catches a numeric faux weight in CSS", () => {
    expect(rules("h1 { font-weight: 600; }", css)).toContain("faux-weight");
  });

  it("accepts the three real weights", () => {
    expect(rules('<div className="font-regular" />')).toEqual([]);
    expect(rules('<div className="font-bold" />')).toEqual([]);
    expect(rules('<div className="font-black" />')).toEqual([]);
  });
});

describe("px literals", () => {
  it("catches a raw px value in CSS", () => {
    expect(rules(".x { padding: 12px; }", css)).toContain("raw-px");
  });

  it("does not police px inside tsx, where Tailwind classes carry the values", () => {
    expect(rules('<div className="p-3" />')).toEqual([]);
  });
});

describe("domain vocabulary", () => {
  it("warns on cart language, which this domain does not have", () => {
    const found = tsx('<button>Tambah ke Keranjang</button>');
    expect(found.map((f) => f.rule)).toContain("cart-vocabulary");
    expect(found.every((f) => f.severity === "warn")).toBe(true);
  });

  it("accepts the real conversion action", () => {
    expect(rules("<button>Hubungi Sales</button>")).toEqual([]);
  });

  it("warns on a px-to-rem conversion that divides by 16", () => {
    expect(rules("const r = px / 16;", (s) => scanSource({ file: "src/x.ts", source: s }))).toContain(
      "divide-by-sixteen",
    );
  });
});

describe("comment handling", () => {
  it("does not fire on a comment that names the violation it forbids", () => {
    const source = `// Never write #FF0000 or font-medium here.\n<div className="p-5" />`;
    expect(rules(source)).toEqual([]);
  });

  it("blanks block comments while preserving line numbers", () => {
    const stripped = stripComments("/* a\nb */\nconst x = 1;");
    expect(stripped.split("\n")).toHaveLength(3);
    expect(stripped).not.toContain("a");
  });
});

describe("classNameSpans", () => {
  it("extracts both quoted and braced className values", () => {
    const spans = classNameSpans('<a className="p-5" /><b className={cx("m-2")} />');
    expect(spans).toHaveLength(2);
    expect(spans[0]!.span).toBe("p-5");
    expect(spans[1]!.span).toContain("m-2");
  });
});
