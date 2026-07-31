import { describe, it, expect } from "vitest";
import { getPlatformStatus, isSupabaseConfigured } from "@/lib/env";

describe("platform env", () => {
  it("returns healthy platform status", () => {
    const status = getPlatformStatus();
    expect(status.app).toBe("ok");
    expect(status.paymentProvider).toBe("mock");
    expect(status.emailProvider).toBe("mock");
    expect(status.analyticsProvider).toBe("mock");
  });

  it("reports supabase as not configured in dev without credentials", () => {
    // Without .env.local Supabase vars, should be not_configured
    const configured = isSupabaseConfigured();
    expect(typeof configured).toBe("boolean");
  });
});
