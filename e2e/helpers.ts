import { type Page, expect } from "@playwright/test";

/** Seed product without variants — reliable for cart/checkout E2E */
export const E2E_PRODUCT_SLUG = "handwoven-merino-wool-scarf";

export async function addProductToCart(page: Page, slug = E2E_PRODUCT_SLUG) {
  await page.goto(`/products/${slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const addButton = page.getByRole("button", { name: "Add to Cart" });
  await expect(addButton).toBeEnabled();
  await addButton.click();
}

export async function addFirstProductToCart(page: Page) {
  await addProductToCart(page);
}

export async function completeCheckout(page: Page) {
  await page.goto("/checkout");
  await expect(page.getByLabel("Email address")).toBeVisible({ timeout: 10_000 });

  await page.getByLabel("Email address").fill("e2e@example.com");
  await page.getByLabel("First name").fill("E2E");
  await page.getByLabel("Last name").fill("Tester");
  await page.getByLabel("Phone number").fill("91234567");
  await page.getByRole("button", { name: "Continue to delivery" }).click();

  await page.getByLabel("Address line 1").fill("123 Orchard Road");
  await page.getByLabel("City").fill("Singapore");
  await page.getByLabel("State / Province").fill("Central");
  await page.getByLabel("Postal code").fill("238858");
  await page.getByLabel("Country").selectOption("SG");
  await page.getByRole("button", { name: "Continue to shipping" }).click();

  await page.getByRole("button", { name: "Continue to payment" }).click();
  await page.getByRole("button", { name: "Review order" }).click();

  await page.getByRole("button", { name: /Place order/i }).click();
  await expect(page).toHaveURL(/\/checkout\/confirmation\?order=ORD-/);
}
