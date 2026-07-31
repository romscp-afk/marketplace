import { test, expect } from "@playwright/test";
import { addProductToCart } from "./helpers";

test.describe("Storefront", () => {
  test("homepage loads with product sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Featured products")).toBeVisible();
    await expect(page.getByText("Trending now")).toBeVisible();
  });

  test("guest can browse and add product to cart", async ({ page }) => {
    await addProductToCart(page);
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /Shopping cart/i })).toBeVisible();
  });

  test("search filters work", async ({ page }) => {
    await page.goto("/search?q=cotton");
    await expect(page.getByText(/\d+ product(s)? found/i)).toBeVisible();
  });

  test("mobile navigation is visible on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByLabel("Mobile bottom navigation")).toBeVisible();
  });
});
