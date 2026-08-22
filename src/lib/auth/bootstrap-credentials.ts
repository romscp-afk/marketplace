import { createHmac, timingSafeEqual } from "node:crypto";
import type { AuthUser } from "@/lib/auth/session";

/** Launch bootstrap accounts — used only while Supabase auth is not configured. */
export const BOOTSTRAP_ADMIN_EMAIL =
  process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() || "admin@aromza.store";
export const BOOTSTRAP_ADMIN_PASSWORD =
  process.env.BOOTSTRAP_ADMIN_PASSWORD || "AromzaPortal#2026";

export const BOOTSTRAP_SUPPLIER_EMAIL =
  process.env.BOOTSTRAP_SUPPLIER_EMAIL?.trim() || "supplier@aromza.store";
export const BOOTSTRAP_SUPPLIER_PASSWORD =
  process.env.BOOTSTRAP_SUPPLIER_PASSWORD || "AromzaSupplier#2026";

export function bootstrapSessionSecret(): string {
  return (
    process.env.BOOTSTRAP_SESSION_SECRET ||
    `aromza-bootstrap:${BOOTSTRAP_ADMIN_EMAIL}:${BOOTSTRAP_ADMIN_PASSWORD}`
  );
}

export function signBootstrapPayload(value: string, secret = bootstrapSessionSecret()): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function hashBootstrapPassword(password: string): string {
  return signBootstrapPayload(`password:${password}`);
}

export function safeEqual(a: string, b: string): boolean {
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

export function isBootstrapSupplierCredentials(email: string, password: string): boolean {
  return (
    safeEqual(email.trim().toLowerCase(), BOOTSTRAP_SUPPLIER_EMAIL.toLowerCase()) &&
    safeEqual(password, BOOTSTRAP_SUPPLIER_PASSWORD)
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

export function getBootstrapSupplierUser(): AuthUser {
  return {
    id: "bootstrap-supplier",
    email: BOOTSTRAP_SUPPLIER_EMAIL,
    firstName: "Aromza",
    lastName: "Supplier",
    roles: ["seller_owner"],
  };
}

export function getBuiltInBootstrapUser(email: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  if (normalized === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) return getBootstrapAdminUser();
  if (normalized === BOOTSTRAP_SUPPLIER_EMAIL.toLowerCase()) return getBootstrapSupplierUser();
  return null;
}

export function verifyBootstrapToken(token: string): AuthUser | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [email, expiresAt, signature] = parts;
  if (!email || !expiresAt || !signature) return null;

  const payload = `${email}.${expiresAt}`;
  if (!safeEqual(signBootstrapPayload(payload), signature)) return null;
  if (Number(expiresAt) < Date.now()) return null;

  return getBuiltInBootstrapUser(email) ?? lookupRegisteredBootstrapUser(email);
}

type RegisteredAccount = {
  passwordHash: string;
  user: AuthUser;
};

const registeredAccounts = new Map<string, RegisteredAccount>();

export function lookupRegisteredBootstrapUser(email: string): AuthUser | null {
  return registeredAccounts.get(email.trim().toLowerCase())?.user ?? null;
}

export function authenticateBootstrapUser(email: string, password: string): AuthUser | null {
  if (isBootstrapAdminCredentials(email, password)) return getBootstrapAdminUser();
  if (isBootstrapSupplierCredentials(email, password)) return getBootstrapSupplierUser();

  const account = registeredAccounts.get(email.trim().toLowerCase());
  if (!account) return null;
  if (!safeEqual(account.passwordHash, hashBootstrapPassword(password))) return null;
  return account.user;
}

export function registerBootstrapSupplier(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): AuthUser | { error: string } {
  const email = input.email.trim().toLowerCase();
  if (getBuiltInBootstrapUser(email) || registeredAccounts.has(email)) {
    return { error: "An account with this email already exists" };
  }

  const user: AuthUser = {
    id: `supplier-${hashBootstrapPassword(email).slice(0, 12)}`,
    email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    roles: ["seller_owner"],
  };

  registeredAccounts.set(email, {
    passwordHash: hashBootstrapPassword(input.password),
    user,
  });

  return user;
}
