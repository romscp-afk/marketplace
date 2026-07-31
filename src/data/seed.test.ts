import { describe, it, expect } from "vitest";
import { searchProducts, getProductBySlug } from "@/data/seed";

describe("searchProducts", () => {
  it("returns all products with no query", () => {
    const result = searchProducts("");
    expect(result.total).toBeGreaterThanOrEqual(30);
  });

  it("filters by search query", () => {
    const result = searchProducts("cotton");
    expect(result.data.length).toBeGreaterThan(0);
    expect(
      result.data.every(
        (p) =>
          p.title.toLowerCase().includes("cotton") ||
          p.description.toLowerCase().includes("cotton"),
      ),
    ).toBe(true);
  });

  it("filters by price range", () => {
    const result = searchProducts("", { minPrice: 100, maxPrice: 200 });
    expect(result.data.every((p) => p.price >= 100 && p.price <= 200)).toBe(true);
  });

  it("sorts by price ascending", () => {
    const result = searchProducts("", { sort: "price_asc", limit: 10 });
    for (let i = 1; i < result.data.length; i++) {
      expect(result.data[i]!.price).toBeGreaterThanOrEqual(
        result.data[i - 1]!.price,
      );
    }
  });

  it("paginates results", () => {
    const page1 = searchProducts("", { page: 1, limit: 5 });
    const page2 = searchProducts("", { page: 2, limit: 5 });
    expect(page1.data.length).toBe(5);
    expect(page1.data[0]!.id).not.toBe(page2.data[0]!.id);
  });
});

describe("getProductBySlug", () => {
  it("finds product by slug", () => {
    const product = getProductBySlug("organic-cotton-linen-blend-shirt");
    expect(product).toBeDefined();
    expect(product!.title).toContain("Cotton");
  });

  it("returns undefined for unknown slug", () => {
    expect(getProductBySlug("nonexistent-product")).toBeUndefined();
  });
});
