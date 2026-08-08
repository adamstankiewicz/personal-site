import { expect, test } from "@playwright/test";

/**
 * Regression: WebKit 26.0 resolved aspect-ratio-derived widths to zero
 * inside the gallery strip's flex intrinsic sizing, collapsing every
 * slide to a 2px sliver of borders with all captions piled on top of
 * each other. Slides now carry an explicit width; this pins it.
 */
test("every work gallery slide has real width", async ({ page }) => {
  await page.goto("/");
  const slides = page.locator(".gallery-slide");
  const count = await slides.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const box = await slides.nth(i).boundingBox();
    expect(box, `slide ${i} has no box`).not.toBeNull();
    expect(box!.width, `slide ${i} collapsed (${box!.width}px wide)`).toBeGreaterThan(100);
  }
});

test("gallery captions sit under their own slides, not each other", async ({
  page,
}) => {
  await page.goto("/");
  const captions = page.locator(".gallery-caption");
  const count = await captions.count();
  const lefts: number[] = [];
  for (let i = 0; i < count; i++) {
    const box = await captions.nth(i).boundingBox();
    if (box) lefts.push(box.x);
  }
  // Collapsed strips stack every caption at the same x; healthy strips
  // spread them out. Compare within each strip's set of captions.
  const distinct = new Set(lefts.map((x) => Math.round(x / 50)));
  expect(distinct.size).toBeGreaterThan(1);
});
