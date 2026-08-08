import { expect, test, type Page } from "@playwright/test";

test("first experience row starts open", async ({ page }) => {
  await page.goto("/");
  const rows = page.locator(".ledger-row");
  await expect(rows.first()).toHaveAttribute("data-open", "true");
});

/**
 * The scrubber only runs while its section is near the viewport, and
 * only after hydration. Waiting for its transform to be written proves
 * the arrival machinery is alive before the test starts scrolling —
 * on slow CI runners the alternative is racing hydration.
 */
async function scrollToSectionAndWaitForScrubber(page: Page) {
  await page.locator("section#route").scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () => {
      const flyer = document.querySelector<HTMLElement>(".route-flyer");
      return !!flyer && flyer.style.transform !== "";
    },
    undefined,
    { timeout: 15000 }
  );
}

/**
 * Touch behavior, state only. Pixel-level physics (the tapped header
 * holding still, the scrubber not drifting) were verified by hand on
 * real WebKit; asserting them on emulated CI runners is pure flake.
 */
test("scroll reveals rows additively and taps toggle only their own row", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "additive reveal is the touch layout");

  await page.goto("/");
  await scrollToSectionAndWaitForScrubber(page);
  // Reading scroll: walk the viewport down through the whole section.
  // The section grows as rows open, so the bottom is re-measured every
  // step rather than captured once.
  await page.evaluate(async () => {
    const el = document.querySelector("section#route")!;
    for (let i = 0; i < 300; i++) {
      if (el.getBoundingClientRect().bottom < window.innerHeight * 0.4) break;
      window.scrollBy({ top: 80, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 40));
    }
  });

  const rows = page.locator(".ledger-row");
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    // Generous timeout: trailing animation frames may still be
    // backfilling crossed waypoints on a slow runner.
    await expect(rows.nth(i)).toHaveAttribute("data-open", "true", {
      timeout: 10000,
    });
  }

  // Tap-close one row: only that row changes. (Dispatched in-page so
  // no scrolling is involved.)
  const toggle = (i: number) =>
    page.evaluate((index) => {
      document
        .querySelectorAll<HTMLElement>(".ledger-row button")
        [index]!.click();
    }, i);
  await toggle(2);
  await expect(rows.nth(2)).toHaveAttribute("data-open", "false");
  for (const i of [0, 1, 3, 4].filter((i) => i < count)) {
    await expect(rows.nth(i)).toHaveAttribute("data-open", "true");
  }
  // Tap again: reopens, still touching nothing else.
  await toggle(2);
  await expect(rows.nth(2)).toHaveAttribute("data-open", "true");
  for (let i = 0; i < count; i++) {
    await expect(rows.nth(i)).toHaveAttribute("data-open", "true");
  }
});
