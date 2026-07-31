import { describe, it, expect } from "vitest";
import { splitOrderBySeller, generateOrderNumber } from "@/lib/commerce/order-split";
import type { CheckoutLineItem } from "@/lib/commerce/types";

const sampleItems: CheckoutLineItem[] = [
  {
    productId: "p1",
    quantity: 2,
    unitPrice: 50,
    title: "Product A",
    sellerId: "seller-1",
    sellerName: "Store A",
    isReturnEligible: true,
  },
  {
    productId: "p2",
    quantity: 1,
    unitPrice: 30,
    title: "Product B",
    sellerId: "seller-2",
    sellerName: "Store B",
    isReturnEligible: true,
  },
  {
    productId: "p3",
    quantity: 1,
    unitPrice: 20,
    title: "Product C",
    sellerId: "seller-1",
    sellerName: "Store A",
    isReturnEligible: false,
  },
];

describe("order split", () => {
  it("generates order numbers with year prefix", () => {
    const number = generateOrderNumber();
    expect(number).toMatch(/^ORD-\d{4}-\d+$/);
  });

  it("splits items by seller", () => {
    const result = splitOrderBySeller(sampleItems, {
      discount: 0,
      deliveryFee: 10,
      defaultCommissionRate: 0.1,
    });

    expect(result.subOrders).toHaveLength(2);
    expect(result.subtotal).toBe(150);
    expect(result.total).toBe(160);
    expect(result.totalCommission).toBe(15);
  });

  it("allocates delivery fee proportionally", () => {
    const result = splitOrderBySeller(sampleItems, {
      discount: 0,
      deliveryFee: 10,
      defaultCommissionRate: 0.1,
    });

    const seller1 = result.subOrders.find((s) => s.sellerId === "seller-1");
    const seller2 = result.subOrders.find((s) => s.sellerId === "seller-2");

    expect(seller1?.subtotal).toBe(120);
    expect(seller2?.subtotal).toBe(30);
    expect(seller1!.deliveryFee + seller2!.deliveryFee).toBeCloseTo(10, 1);
  });

  it("applies discount to total", () => {
    const result = splitOrderBySeller(sampleItems, {
      discount: 15,
      deliveryFee: 5,
      defaultCommissionRate: 0.1,
    });

    expect(result.total).toBe(140);
  });
});
