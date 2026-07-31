import { describe, it, expect } from "vitest";
import { formatCurrency, slugify, clamp, pluralize } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats USD amounts", () => {
    expect(formatCurrency(99.99)).toBe("$99.99");
  });
});

describe("slugify", () => {
  it("converts text to URL-safe slug", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  Organic Cotton Shirt  ")).toBe("organic-cotton-shirt");
  });
});

describe("clamp", () => {
  it("clamps values within range", () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(0, 1, 10)).toBe(1);
    expect(clamp(15, 1, 10)).toBe(10);
  });
});

describe("pluralize", () => {
  it("returns singular for count of 1", () => {
    expect(pluralize(1, "item")).toBe("item");
  });

  it("returns plural for other counts", () => {
    expect(pluralize(3, "item")).toBe("items");
    expect(pluralize(0, "product", "products")).toBe("products");
  });
});
