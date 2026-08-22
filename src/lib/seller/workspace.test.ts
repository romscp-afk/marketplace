import { describe, it, expect } from "vitest";
import {
  getOrCreateWorkspace,
  getPublishedProducts,
  saveWorkspaceProduct,
} from "@/lib/seller/workspace";
import type { AuthUser } from "@/lib/auth/session";

const supplier: AuthUser = {
  id: "test-supplier-1",
  email: "supplier-test@aromza.store",
  firstName: "Test",
  lastName: "Supplier",
  roles: ["seller_owner"],
};

describe("supplier workspace", () => {
  it("creates an approved store for a new supplier", () => {
    const workspace = getOrCreateWorkspace(supplier, "Harbour Goods");
    expect(workspace.seller.status).toBe("active");
    expect(workspace.seller.store.name).toBe("Harbour Goods");
    expect(workspace.application.status).toBe("approved");
    expect(workspace.products).toHaveLength(0);
  });

  it("publishes an active product to the storefront catalog", () => {
    const workspace = getOrCreateWorkspace(supplier, "Harbour Goods");
    saveWorkspaceProduct(workspace.seller.id, {
      id: "prod-harbour-tea",
      sellerId: workspace.seller.id,
      title: "Jasmine Tea Tin",
      slug: "jasmine-tea-tin",
      description: "Fragrant jasmine green tea from a Singapore supplier.",
      price: 18,
      currency: "SGD",
      stock: 12,
      status: "active",
      categoryId: "cat-food",
      categoryName: "Food & Gourmet",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const published = getPublishedProducts();
    expect(published.some((product) => product.title === "Jasmine Tea Tin")).toBe(true);
    expect(published.find((product) => product.title === "Jasmine Tea Tin")?.seller.storeName).toBe(
      "Harbour Goods",
    );
  });
});
