import { expect, test } from "@playwright/test";

test("home page renders every section", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto("/");
  await expect(page).toHaveTitle(/Adam Stankiewicz/);

  for (const id of ["about", "experience", "work", "research", "lab"]) {
    await expect(page.locator(`section#${id}`)).toBeAttached();
  }

  // The strip below the hero and the footer bracket the page; if both
  // are present and populated, hydration made it all the way down.
  await expect(page.locator("section#about p").first()).not.toBeEmpty();
  await expect(page.locator("footer")).toBeAttached();

  expect(errors).toEqual([]);
});

test("theme toggle cycles the color mode", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /cycle theme/i });
  const before = await toggle.getAttribute("aria-label");
  await toggle.click();
  await expect(toggle).not.toHaveAttribute("aria-label", before ?? "");
});
