import { test, expect } from "@playwright/test";
import { addFirstProductToCart, completeCheckout } from "./helpers";

test.describe("Checkout", () => {
  test("guest completes mock checkout and sees confirmation", async ({ page }) => {
    await addFirstProductToCart(page);
    await completeCheckout(page);
    await expect(page.getByRole("heading", { name: /Order confirmed/i })).toBeVisible();
    await expect(page.getByText(/ORD-/)).toBeVisible();
  });
});
