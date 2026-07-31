import { describe, it, expect } from "vitest";
import {
  getMockStats,
  getMockProducts,
  getMockOrders,
  getMockPayouts,
  getMockApplication,
} from "@/lib/seller/mock-data";

describe("seller mock data", () => {
  it("returns dashboard stats", () => {
    const stats = getMockStats();
    expect(stats.activeProducts).toBeGreaterThan(0);
    expect(stats.rating).toBeGreaterThan(0);
  });

  it("returns seller products", () => {
    const products = getMockProducts();
    expect(products.length).toBeGreaterThanOrEqual(3);
    expect(products[0]?.title).toBeTruthy();
  });

  it("returns orders with commission", () => {
    const orders = getMockOrders();
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0]?.commission).toBeGreaterThan(0);
  });

  it("returns payout history", () => {
    const payouts = getMockPayouts();
    expect(payouts.some((p) => p.status === "paid")).toBe(true);
  });

  it("returns application for user", () => {
    const app = getMockApplication("test-user");
    expect(app?.status).toBe("approved");
    expect(app?.storeName).toBeTruthy();
  });
});
