import { test, expect } from "@playwright/test";

test.describe("Platform", () => {
  test("health API returns healthy status", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body.platform.app).toBe("ok");
  });

  test("security headers are present on pages", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  });

  test("PWA manifest and icons are served", async ({ request, page }) => {
    const manifestResponse = await request.get("/manifest.json");
    expect(manifestResponse.ok()).toBeTruthy();

    const manifest = await manifestResponse.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.icons?.length).toBeGreaterThan(0);

    const iconResponse = await request.get("/icons/icon-192x192");
    expect(iconResponse.ok()).toBeTruthy();

    await page.goto("/offline");
    await expect(page.getByRole("heading", { name: /offline/i })).toBeVisible();
  });

  test("service worker file is available", async ({ request }) => {
    const response = await request.get("/sw.js");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("addEventListener");
  });
});
