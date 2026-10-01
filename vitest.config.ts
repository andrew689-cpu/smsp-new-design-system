import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
      "@tokens": resolve(import.meta.dirname, "tokens"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tokens/**/*.test.ts", "scripts/**/*.test.ts"],
    // e2e lives in Playwright, which has its own runner.
    exclude: ["node_modules", "e2e"],
  },
});
