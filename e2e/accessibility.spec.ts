import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { gotoWithTheme, ROUTES, THEMES } from "./helpers";

/**
 * WCAG 2.2 AA, asserted in both themes on every route.
 *
 * The token suite already proves the palette can pass; this proves the pages actually do —
 * contrast as composited, target sizes as laid out, landmarks and names as rendered.
 */
for (const route of ROUTES) {
  for (const theme of THEMES) {
    test(`${route} has no axe violations in ${theme}`, async ({ page }) => {
      await gotoWithTheme(page, route, theme);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      // Name the rule and the element, so a failure is actionable without opening the report.
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target.join(" ")),
      }));
      expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
    });
  }
}

test("the document declares Bahasa Indonesia", async ({ page }) => {
  // All user-facing copy is Indonesian; a wrong lang attribute mispronounces every word
  // in a screen reader.
  await gotoWithTheme(page, "/showcase", "light");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
});
