import { createHmac, timingSafeEqual } from "node:crypto";
import type { AuthUser } from "@/lib/auth/session";

/** Launch bootstrap account — used only while Supabase auth is not configured. */
export const BOOTSTRAP_ADMIN_EMAIL =
  process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() || "admin@aromza.store";
export const BOOTSTRAP_ADMIN_PASSWORD =
  process.env.BOOTSTRAP_ADMIN_PASSWORD || "AromzaPortal#2026";

export function bootstrapSessionSecret(): string {
  return (
    process.env.BOOTSTRAP_SESSION_SECRET ||
    `aromza-bootstrap:${BOOTSTRAP_ADMIN_EMAIL}:${BOOTSTRAP_ADMIN_PASSWORD}`
  );
}

export function signBootstrapPayload(value: string, secret = bootstrapSessionSecret()): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function isBootstrapAdminCredentials(email: string, password: string): boolean {
  return (
    safeEqual(email.trim().toLowerCase(), BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) &&
    safeEqual(password, BOOTSTRAP_ADMIN_PASSWORD)
  );
}

export function getBootstrapAdminUser(): AuthUser {
  return {
    id: "bootstrap-super-admin",
    email: BOOTSTRAP_ADMIN_EMAIL,
    firstName: "Aromza",
    lastName: "Admin",
    roles: ["super_admin", "marketplace_admin", "seller_owner"],
  };
}

export function verifyBootstrapToken(token: string): AuthUser | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [email, expiresAt, signature] = parts;
  if (!email || !expiresAt || !signature) return null;

  const payload = `${email}.${expiresAt}`;
  if (!safeEqual(signBootstrapPayload(payload), signature)) return null;
  if (Number(expiresAt) < Date.now()) return null;
  if (email.toLowerCase() !== BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) return null;

  return getBootstrapAdminUser();
}
