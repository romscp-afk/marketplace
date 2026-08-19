import { describe, it, expect } from "vitest";
import { searchProducts, getProductBySlug } from "@/data/seed";

describe("searchProducts", () => {
  it("returns an empty catalog when no seed products exist", () => {
    const result = searchProducts("");
    expect(result.total).toBe(0);
    expect(result.data).toEqual([]);
  });

  it("returns no matches for a search query on an empty catalog", () => {
    const result = searchProducts("cotton");
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("paginates an empty result set safely", () => {
    const page1 = searchProducts("", { page: 1, limit: 5 });
    expect(page1.data).toEqual([]);
    expect(page1.totalPages).toBe(1);
  });
});

describe("getProductBySlug", () => {
  it("returns undefined when the catalog is empty", () => {
    expect(getProductBySlug("organic-cotton-linen-blend-shirt")).toBeUndefined();
  });

  it("returns undefined for unknown slug", () => {
    expect(getProductBySlug("nonexistent-product")).toBeUndefined();
  });
});
