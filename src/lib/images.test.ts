import { describe, it, expect } from "vitest";
import { seedProducts } from "@/data/seed";
import { productImageUrl, sellerLogoUrl } from "@/lib/images";

describe("productImageUrl", () => {
  it("uses Unsplash product photos, not random placeholders", () => {
    for (const product of seedProducts) {
      const url = productImageUrl(product.slug, 600, 600, product.categorySlug);
      expect(url).toMatch(/^https:\/\/images\.unsplash\.com\//);
      expect(url).not.toContain("picsum.photos");
    }
  });

  it("maps known products to stable photo ids", () => {
    expect(productImageUrl("wireless-noise-cancelling-earbuds")).toContain(
      "photo-1572569511254-d8f925fe2cbb",
    );
    expect(productImageUrl("botanical-face-serum")).toContain(
      "photo-1612817288484-6f916006177a",
    );
  });
});

describe("sellerLogoUrl", () => {
  it("returns category-relevant store imagery", () => {
    expect(sellerLogoUrl("tech-haven")).toContain("photo-1505740420928");
    expect(sellerLogoUrl("gourmet-pantry")).toContain("photo-1559056199");
    expect(sellerLogoUrl("tech-haven")).not.toContain("picsum.photos");
  });
});
