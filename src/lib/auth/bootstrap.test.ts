import { describe, it, expect } from "vitest";
import {
  authenticateBootstrapUser,
  getBootstrapAdminUser,
  getBootstrapSupplierUser,
  isBootstrapAdminCredentials,
  isBootstrapSupplierCredentials,
  registerBootstrapSupplier,
} from "@/lib/auth/bootstrap-credentials";

describe("bootstrap accounts", () => {
  it("accepts the launch admin credentials", () => {
    expect(isBootstrapAdminCredentials("admin@aromza.store", "AromzaPortal#2026")).toBe(true);
  });

  it("accepts the launch supplier credentials", () => {
    expect(isBootstrapSupplierCredentials("supplier@aromza.store", "AromzaSupplier#2026")).toBe(true);
    const user = authenticateBootstrapUser("supplier@aromza.store", "AromzaSupplier#2026");
    expect(user?.roles).toEqual(["seller_owner"]);
    expect(user?.email).toBe("supplier@aromza.store");
  });

  it("rejects other credentials", () => {
    expect(isBootstrapAdminCredentials("admin@aromza.store", "wrong-password")).toBe(false);
    expect(authenticateBootstrapUser("other@aromza.store", "AromzaPortal#2026")).toBeNull();
  });

  it("assigns portal roles", () => {
    const user = getBootstrapAdminUser();
    expect(user.roles).toContain("super_admin");
    expect(user.roles).toContain("seller_owner");
    expect(getBootstrapSupplierUser().roles).toContain("seller_owner");
  });

  it("registers a unique supplier account", () => {
    const created = registerBootstrapSupplier({
      email: "studio@example.com",
      password: "SupplierPass#1",
      firstName: "Mei",
      lastName: "Tan",
    });
    expect("error" in created).toBe(false);
    if ("error" in created) return;
    expect(created.roles).toContain("seller_owner");
    expect(authenticateBootstrapUser("studio@example.com", "SupplierPass#1")?.id).toBe(created.id);
  });
});
