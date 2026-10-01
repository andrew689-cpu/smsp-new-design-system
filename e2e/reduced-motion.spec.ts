import { expect, test } from "@playwright/test";
import { gotoWithTheme } from "./helpers";

/**
 * Motion a user cannot turn off does not ship.
 *
 * The base layer collapses every duration under `prefers-reduced-motion: reduce`. This
 * asserts the rule actually reaches elements, rather than trusting that it was written.
 */
test("every transition and animation collapses under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoWithTheme(page, "/showcase", "light");

  const moving = await page.evaluate(() => {
    const offenders: { tag: string; transition: string; animation: string }[] = [];
    for (const el of document.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      const transition = s.transitionDuration;
      const animation = s.animationDuration;
      const live = (value: string) =>
        value.split(",").some((v) => parseFloat(v) > 0);
      if (live(transition) || live(animation)) {
        offenders.push({ tag: el.nodeName.toLowerCase(), transition, animation });
      }
    }
    return offenders;
  });

  expect(moving, JSON.stringify(moving, null, 2)).toEqual([]);
});

test("the guard is conditional, not a blanket removal of all motion", async ({ page }) => {
  // Injects a probe element that transitions on a token duration, then measures it under
  // both media states. Asserting a token's value would not prove the guard is conditional.
  const probeDuration = async (reducedMotion: "reduce" | "no-preference") => {
    await page.emulateMedia({ reducedMotion });
    await gotoWithTheme(page, "/showcase", "light");
    return page.evaluate(() => {
      const probe = document.createElement("div");
      probe.id = "motion-probe";
      probe.style.transitionProperty = "opacity";
      probe.style.transitionDuration = "var(--duration-base)";
      document.body.append(probe);
      const measured = getComputedStyle(probe).transitionDuration;
      probe.remove();
      return measured;
    });
  };

  const whenAllowed = await probeDuration("no-preference");
  const whenReduced = await probeDuration("reduce");

  expect(parseFloat(whenAllowed), "token-driven motion should run normally").toBeGreaterThan(0);
  expect(parseFloat(whenReduced), "the same motion must collapse under reduce").toBe(0);
});
