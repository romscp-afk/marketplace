import { describe, it, expect } from "vitest";
import {
  getMockAdminStats,
  getMockApplications,
  getMockProductsForReview,
  getMockCommission,
  updateMockApplication,
  updateMockProduct,
  addMockAuditLog,
  getMockAuditLogs,
} from "@/lib/admin/mock-data";

describe("admin mock data", () => {
  it("returns dashboard stats", () => {
    const stats = getMockAdminStats();
    expect(stats.pendingApplications).toBeGreaterThan(0);
    expect(stats.activeSellers).toBeGreaterThan(0);
  });

  it("returns seller applications", () => {
    const apps = getMockApplications();
    expect(apps.length).toBeGreaterThan(0);
    expect(apps.some((a) => a.status === "under_review")).toBe(true);
  });

  it("returns products pending review", () => {
    const products = getMockProductsForReview();
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.status === "review")).toBe(true);
  });

  it("updates application status", () => {
    const apps = getMockApplications();
    const target = apps.find((a) => a.status === "submitted");
    expect(target).toBeTruthy();
    updateMockApplication(target!.id, { status: "approved" });
    const updated = getMockApplications().find((a) => a.id === target!.id);
    expect(updated?.status).toBe("approved");
  });

  it("moderates products and records audit logs", () => {
    const product = getMockProductsForReview()[0];
    expect(product).toBeTruthy();
    updateMockProduct(product!.id, "active");
    addMockAuditLog({
      actorEmail: "admin@example.com",
      action: "product.approved",
      resource: "products",
      resourceId: product!.id,
      summary: "Test approval",
    });
    const logs = getMockAuditLogs();
    expect(logs[0]?.action).toBe("product.approved");
  });

  it("returns commission settings", () => {
    const commission = getMockCommission();
    expect(commission.defaultRate).toBeGreaterThan(0);
    expect(commission.minimumPayout).toBeGreaterThan(0);
  });
});
