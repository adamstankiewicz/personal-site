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

/** Reading scroll: walk the viewport down through the whole section.
 *  The section grows as rows open, so the bottom is re-measured every
 *  step rather than captured once. */
const readThroughSection = (page: Page) =>
  page.evaluate(async () => {
    const el = document.querySelector("section#route")!;
    for (let i = 0; i < 300; i++) {
      if (el.getBoundingClientRect().bottom < window.innerHeight * 0.4) break;
      window.scrollBy({ top: 80, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 40));
    }
  });

test("tapping toggles only that row and holds its header still", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "touch behavior: additive toggling is mobile-only");

  await page.goto("/");
  // Read through the section first, the way a visitor reaches a row:
  // every row opens on arrival and the layout settles. Toggling is
  // then measured against a resting page, not a mid-cascade one.
  await scrollToSectionAndWaitForScrubber(page);
  await readThroughSection(page);

  const rows = page.locator(".ledger-row");
  const count = await rows.count();
  const index = 2;
  const target = rows.nth(index);
  // Park the row's header at 60% of the viewport — in view, below the
  // scrubber's 45% arrival anchor — and let transitions finish.
  await page.evaluate((i) => {
    const row = document.querySelectorAll(".ledger-row")[i]!;
    window.scrollBy({
      top: row.getBoundingClientRect().top - window.innerHeight * 0.6,
      behavior: "instant",
    });
  }, index);
  await expect(target).toHaveAttribute("data-open", "true", { timeout: 10000 });
  await page.waitForTimeout(600);

  const others = () =>
    Promise.all(
      Array.from({ length: count }, (_, i) =>
        i === index ? "-" : rows.nth(i).getAttribute("data-open")
      )
    );

  // Close: collapses below its own header; nothing else changes.
  let before = await target.boundingBox();
  let othersBefore = await others();
  await target.locator("button").first().click();
  await expect(target).toHaveAttribute("data-open", "false");
  await page.waitForTimeout(500);
  let after = await target.boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
  expect(await others()).toEqual(othersBefore);

  // Reopen — the reported bug: opening must not shift the page or
  // close the other rows (the old collapse-and-compensate dance
  // dragged the scrubber dot to the previous row).
  before = after;
  othersBefore = await others();
  await target.locator("button").first().click();
  await expect(target).toHaveAttribute("data-open", "true");
  await page.waitForTimeout(500);
  after = await target.boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
  expect(await others()).toEqual(othersBefore);
});

test("scrolling through the section reveals rows on touch", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "scroll-arrival opening is driven by touch layout");

  await page.goto("/");
  await scrollToSectionAndWaitForScrubber(page);
  await readThroughSection(page);
  const rows = page.locator(".ledger-row");
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    // Generous timeout: trailing animation frames may still be
    // backfilling crossed waypoints on a slow runner.
    await expect(rows.nth(i)).toHaveAttribute("data-open", "true", {
      timeout: 10000,
    });
  }
});
