import { defineConfig, devices } from "@playwright/test";

/**
 * Two viewports, and every a11y spec runs in both themes.
 *
 * Visual snapshots are deliberately absent: they fail on font rendering and antialiasing
 * differences between a developer's machine and CI, and the usual response is to stop
 * trusting the suite. The specs here assert written rules instead, so a failure is real.
 * Snapshots get added once components stop moving.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      // 390px: the narrow end of real phones, below the 860px breakpoint.
      name: "mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
    {
      // The constrained desktop case: sidebar at 280px leaves the least room for a spec table.
      name: "narrow-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 860, height: 900 } },
    },
  ],
  webServer: {
    command: "npm run build && npx next start --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
