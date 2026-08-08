import { defineConfig, devices } from "@playwright/test";

/**
 * @playwright/test is pinned exactly (1.57.0) because its bundled
 * WebKit is 26.0 — the oldest engine generation the site supports and
 * the one that shipped real rendering bugs (aspect-ratio-derived
 * widths collapsing to zero in flex intrinsic sizing, fixed upstream
 * by 26.5). Testing against the buggy floor is the point; bump the pin
 * only when iOS 26.0-era usage has faded.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // The experience section's scroll-arrival machinery bails under
    // reduced motion; pin the emulated preference so CI runners can't
    // flip it out from under the tests.
    reducedMotion: "no-preference",
  },
  // Port 3000 on purpose: locally a running `npm run dev` is reused
  // as-is (never run `next build` while the dev server is up — the
  // prod build corrupts the dev .next). In CI, or with no dev server
  // running, this builds the static export and serves it.
  webServer: {
    command: "npm run build && npx serve out -l 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "iphone-webkit", use: { ...devices["iPhone 13"] } },
    { name: "android-chromium", use: { ...devices["Pixel 7"] } },
  ],
});
