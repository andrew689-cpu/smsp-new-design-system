import { expect, test } from "@playwright/test";
import { gotoWithTheme, THEMES } from "./helpers";

/**
 * The focus ring is never removed, never hidden, and never the interim brand red.
 *
 * Tabbing the real page is the only way to catch a ring that a stylesheet reset elsewhere
 * has quietly suppressed.
 */
for (const theme of THEMES) {
  test(`every interactive element on the showcase shows a focus ring in ${theme}`, async ({ page }) => {
    await gotoWithTheme(page, "/showcase", theme);

    const interactive = page.locator(
      "main a[href], main button:not([disabled]), main input:not([disabled])",
    );
    const count = await interactive.count();
    expect(count, "the showcase should expose interactive elements to test").toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const el = interactive.nth(i);
      await el.focus();

      const ring = await el.evaluate((node) => {
        const s = getComputedStyle(node);
        return {
          width: s.outlineWidth,
          style: s.outlineStyle,
          color: s.outlineColor,
        };
      });

      const label = (await el.evaluate((n) => n.textContent?.trim() || (n as HTMLElement).getAttribute("aria-label") || n.nodeName)) ?? "?";

      expect(ring.style, `${label}: outline-style`).not.toBe("none");
      expect(parseFloat(ring.width), `${label}: outline-width`).toBeGreaterThanOrEqual(2);
    }
  });
}

test("the focus ring is not the interim action-primary red", async ({ page }) => {
  await gotoWithTheme(page, "/showcase", "light");
  const [ringColour, actionPrimary] = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return [
      s.getPropertyValue("--color-focus-ring").trim(),
      s.getPropertyValue("--color-action-primary").trim(),
    ];
  });
  expect(ringColour).not.toBe("");
  expect(ringColour).not.toBe(actionPrimary);
});
