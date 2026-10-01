import type { Page } from "@playwright/test";

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/** Every page the Showcase contract covers. Add a route here and it is tested in both themes. */
export const ROUTES = ["/", "/showcase"] as const;

/**
 * Pin the theme explicitly rather than relying on the system preference, so a failure names
 * one theme instead of "whatever the runner was set to".
 */
export async function gotoWithTheme(page: Page, path: string, theme: Theme) {
  await page.emulateMedia({ colorScheme: theme });
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("smsp-theme", t as string);
    } catch {
      /* Blocked storage: the attribute below still pins the theme. */
    }
  }, theme);
  await page.goto(path);
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t as string), theme);
  // Webfonts shift layout; wait for them before measuring anything.
  await page.evaluate(() => document.fonts.ready);
}

/** True when the page body scrolls sideways — never acceptable; only tables may scroll. */
export async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth > el.clientWidth + 1;
  });
}
