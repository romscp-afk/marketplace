import { describe, it, expect } from "vitest";
import { isBootstrapAdminCredentials, getBootstrapAdminUser } from "@/lib/auth/bootstrap-credentials";

describe("bootstrap super admin", () => {
  it("accepts the launch bootstrap credentials", () => {
    expect(isBootstrapAdminCredentials("admin@aromza.store", "AromzaPortal#2026")).toBe(true);
  });

  it("rejects other credentials", () => {
    expect(isBootstrapAdminCredentials("admin@aromza.store", "wrong-password")).toBe(false);
    expect(isBootstrapAdminCredentials("other@aromza.store", "AromzaPortal#2026")).toBe(false);
  });

  it("assigns portal roles", () => {
    const user = getBootstrapAdminUser();
    expect(user.roles).toContain("super_admin");
    expect(user.roles).toContain("seller_owner");
  });
});
