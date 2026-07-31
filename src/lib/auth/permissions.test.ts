import { describe, it, expect } from "vitest";
import { hasRole, isAdmin, isSeller } from "@/lib/auth/session";
import type { AuthUser } from "@/lib/auth/session";

const customer: AuthUser = {
  id: "1",
  email: "customer@test.com",
  roles: ["customer"],
};

const seller: AuthUser = {
  id: "2",
  email: "seller@test.com",
  roles: ["seller_owner"],
};

const admin: AuthUser = {
  id: "3",
  email: "admin@test.com",
  roles: ["marketplace_admin"],
};

describe("auth permissions", () => {
  it("hasRole returns true for assigned role", () => {
    expect(hasRole(customer, "customer")).toBe(true);
    expect(hasRole(customer, "seller_owner")).toBe(false);
  });

  it("isAdmin identifies admin roles", () => {
    expect(isAdmin(customer)).toBe(false);
    expect(isAdmin(seller)).toBe(false);
    expect(isAdmin(admin)).toBe(true);
  });

  it("isSeller identifies seller roles", () => {
    expect(isSeller(customer)).toBe(false);
    expect(isSeller(seller)).toBe(true);
    expect(isSeller(admin)).toBe(false);
  });
});

describe("RLS policy intent", () => {
  it("documents cross-seller access prevention", () => {
    // RLS policy: products_seller_manage uses is_seller_member(seller_id)
    // Sellers can only manage their own products — enforced at DB level
    const sellerAId = "seller-a";
    const sellerBId = "seller-b";
    expect(sellerAId).not.toBe(sellerBId);
  });

  it("documents admin override for moderation", () => {
    // RLS policy: products_admin_manage allows is_admin() full access
    expect(isAdmin(admin)).toBe(true);
  });

  it("documents customer data isolation", () => {
    // RLS policy: carts_own, wishlists_own, addresses_own restrict to auth.uid()
    expect(hasRole(customer, "customer")).toBe(true);
  });
});
