import { describe, it, expect } from "vitest";
import {
  SECURITY_HEADERS,
  buildContentSecurityPolicy,
  getSecurityHeadersForPath,
} from "@/lib/security/headers";

describe("security headers", () => {
  it("includes baseline security headers", () => {
    expect(SECURITY_HEADERS["X-Frame-Options"]).toBe("DENY");
    expect(SECURITY_HEADERS["X-Content-Type-Options"]).toBe("nosniff");
    expect(SECURITY_HEADERS["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("builds CSP without frame ancestors", () => {
    const csp = buildContentSecurityPolicy();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("default-src 'self'");
  });

  it("adds HSTS in production", () => {
    const headers = getSecurityHeadersForPath("/", true);
    expect(headers["Strict-Transport-Security"]).toContain("max-age=");
  });

  it("omits HSTS in development", () => {
    const headers = getSecurityHeadersForPath("/", false);
    expect(headers["Strict-Transport-Security"]).toBeUndefined();
  });

  it("skips CSP on API routes", () => {
    const headers = getSecurityHeadersForPath("/api/health", true);
    expect(headers["Content-Security-Policy"]).toBeUndefined();
  });

  it("includes CSP on page routes", () => {
    const headers = getSecurityHeadersForPath("/search", true);
    expect(headers["Content-Security-Policy"]).toBeDefined();
  });
});
