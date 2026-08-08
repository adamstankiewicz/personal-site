import { expect, test } from "@playwright/test";

/**
 * Regression: WebKit 26.0 resolved aspect-ratio-derived widths to zero
 * inside the gallery strip's flex intrinsic sizing, collapsing every
 * slide to a 2px sliver of borders with all captions piled on top of
 * each other. Slides now carry an explicit width; this pins it.
 */
test("every work gallery slide has real width", async ({ page }) => {
  // Iterates every slide across every Work gallery sequentially; on a
  // cold CI runner that cumulative time can outrun the default 30s
  // budget even though each slide settles fast once warm.
  test.setTimeout(90_000);
  await page.goto("/");
  const slides = page.locator(".gallery-slide");
  await slides.first().waitFor({ state: "attached", timeout: 15000 });
  const count = await slides.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    // Poll: cold CI runners can still be in first layout when the
    // page settles enough for goto to resolve.
    await expect
      .poll(async () => (await slides.nth(i).boundingBox())?.width ?? 0, {
        message: `slide ${i} collapsed`,
        timeout: 10000,
      })
      .toBeGreaterThan(100);
  }
});

test("gallery arrows reach both ends of the strip", async ({ page }) => {
  await page.goto("/");
  // The first gallery whose controls are visible (i.e. it overflows at
  // this viewport). Center-nearest indexing used to make "1 / N"
  // unreachable at the left edge whenever several slides fit at once.
  // The overflow flag is set by a ResizeObserver after hydration, so
  // wait for it rather than sampling the initial server HTML.
  const overflowed = await page
    .locator("figcaption.flex")
    .first()
    .waitFor({ state: "visible", timeout: 10000 })
    .then(() => true)
    .catch(() => false);
  test.skip(!overflowed, "no gallery overflows at this viewport");

  const gallery = page
    .locator("figure")
    .filter({ has: page.locator("figcaption.flex") })
    .first();
  await gallery.scrollIntoViewIfNeeded();
  // The morphing counter renders characters individually with
  // non-breaking spaces; normalize before matching.
  const counter = gallery.locator("figcaption span[aria-hidden]");
  const read = async () =>
    (await counter.textContent())!.replace(/\s+/g, " ").trim();
  await expect.poll(read).toMatch(/^1 \/ \d+$/);

  const next = gallery.getByRole("button", { name: "Next screenshot" });
  const prev = gallery.getByRole("button", { name: "Previous screenshot" });
  await next.click();
  await expect.poll(read, { timeout: 5000 }).toMatch(/^2 \/ \d+$/);
  await prev.click();
  await expect.poll(read, { timeout: 5000 }).toMatch(/^1 \/ \d+$/);
});

test("gallery captions sit under their own slides, not each other", async ({
  page,
}) => {
  // Same cross-gallery iteration as above; same cold-runner headroom.
  test.setTimeout(90_000);
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
