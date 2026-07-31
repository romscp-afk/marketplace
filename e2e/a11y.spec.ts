import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { addProductToCart } from "./helpers";

const KEY_PAGES = [
  { name: "Search", path: "/search" },
  { name: "Cart", path: "/cart" },
  { name: "Login", path: "/account/login" },
];

for (const { name, path } of KEY_PAGES) {
  test(`${name} has no critical accessibility violations`, async ({ page }) => {
    await page.goto(path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");

    expect(
      critical,
      critical.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toEqual([]);
  });
}

test("Homepage has no critical accessibility violations", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .disableRules(["color-contrast"])
    .analyze();

  const critical = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );

  expect(
    critical,
    critical.map((v) => `${v.id}: ${v.description}`).join("\n"),
  ).toEqual([]);
});

test("checkout page has labeled form fields", async ({ page }) => {
  await addProductToCart(page);
  await page.goto("/checkout");

  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("First name")).toBeVisible();
  await expect(page.getByLabel("Last name")).toBeVisible();
});
