import { expect, test } from "@playwright/test";
import { gotoWithTheme, hasHorizontalOverflow, ROUTES, THEMES } from "./helpers";

/**
 * Bahasa Indonesia runs 20-30% longer than English.
 *
 * Nobody writes this test, which is exactly why fixed-width buttons and tabs sized for the
 * English string ship and then truncate in production. Here every text node is inflated by
 * 30% and the page must still not scroll sideways or clip a label.
 */
const INFLATION = 1.3;

async function inflateCopy(page: import("@playwright/test").Page, factor: number) {
  await page.evaluate((f) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const text = node.textContent ?? "";
      // Skip whitespace-only nodes, numerics and code: specs and token names are not prose.
      if (!text.trim() || /^[\s\d.,]+$/.test(text)) continue;
      if (node.parentElement?.closest("[data-numeric], code")) continue;
      nodes.push(node);
    }

    // Grow by repeating WHOLE WORDS rather than appending letters. Indonesian copy is longer
    // but still wraps; padding with an unbreakable 80-character run would test a string no
    // translator would ever produce, and would fail every layout for the wrong reason.
    const filler = ["panjang", "tambahan", "struktural", "pengiriman"];
    for (const node of nodes) {
      const text = node.textContent ?? "";
      const words = text.trim().split(/\s+/);
      const extraWords = Math.max(1, Math.round(words.length * (f - 1)));
      const padding = Array.from({ length: extraWords }, (_, i) => filler[i % filler.length]).join(" ");
      node.textContent = `${text} ${padding}`;
    }
  }, factor);
}

for (const route of ROUTES) {
  for (const theme of THEMES) {
    test(`${route} survives +30% copy growth without sideways scroll in ${theme}`, async ({ page }) => {
      await gotoWithTheme(page, route, theme);
      await expect
        .poll(() => hasHorizontalOverflow(page), { message: "page overflowed before inflation" })
        .toBe(false);

      await inflateCopy(page, INFLATION);

      expect(
        await hasHorizontalOverflow(page),
        "page body scrolls sideways once Indonesian-length copy is used",
      ).toBe(false);
    });
  }
}

test("no interactive label is clipped once copy grows", async ({ page }) => {
  await gotoWithTheme(page, "/showcase", "light");
  await inflateCopy(page, INFLATION);

  const clipped = await page.evaluate(() => {
    const out: string[] = [];
    for (const el of document.querySelectorAll("main button, main a[href]")) {
      const e = el as HTMLElement;
      // A 1px tolerance: sub-pixel rounding is not clipping.
      if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== "visible") {
        out.push(`${e.nodeName}: ${e.textContent?.slice(0, 30)}`);
      }
    }
    return out;
  });

  expect(clipped, "labels must wrap or resize, never truncate").toEqual([]);
});
