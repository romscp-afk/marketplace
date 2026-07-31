import { test, expect } from "@playwright/test";
import { E2E_PRODUCT_SLUG } from "./helpers";

test.describe("Catalog", () => {
  test("category page lists products", async ({ page }) => {
    await page.goto("/categories/fashion");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("wishlist persists product from product page", async ({ page }) => {
    await page.goto(`/products/${E2E_PRODUCT_SLUG}`);
    await page.getByRole("button", { name: "Add to wishlist" }).click();

    await page.goto("/account/wishlist");
    await expect(page.getByRole("heading", { name: /Wishlist/i })).toBeVisible();
    await expect(page.getByText(/Merino Wool Scarf/i)).toBeVisible();
  });
});
