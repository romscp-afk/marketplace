export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export const HSTS_HEADER = "max-age=63072000; includeSubDomains; preload";

export function buildContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export function getSecurityHeadersForPath(
  pathname: string,
  isProduction = process.env.NODE_ENV === "production",
): Record<string, string> {
  const headers: Record<string, string> = { ...SECURITY_HEADERS };

  if (isProduction) {
    headers["Strict-Transport-Security"] = HSTS_HEADER;
  }

  if (!pathname.startsWith("/api/")) {
    headers["Content-Security-Policy"] = buildContentSecurityPolicy();
  }

  return headers;
}
