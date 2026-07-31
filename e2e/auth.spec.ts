import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("login page renders and validates without Supabase", async ({ page }) => {
    await page.goto("/account/login");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

    await page.getByLabel("Email address").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText(/not configured|Invalid email or password/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("register page renders required fields", async ({ page }) => {
    await page.goto("/account/register");
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("protected admin and seller routes redirect to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/account\/login/);

    await page.goto("/seller/dashboard");
    await expect(page).toHaveURL(/\/account\/login/);
  });
});
