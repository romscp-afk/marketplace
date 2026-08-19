import { cookies } from "next/headers";
import {
  BOOTSTRAP_ADMIN_EMAIL,
  getBootstrapAdminUser,
  isBootstrapAdminCredentials,
  signBootstrapPayload,
  verifyBootstrapToken,
} from "@/lib/auth/bootstrap-credentials";
import type { AuthUser } from "@/lib/auth/session";

export {
  BOOTSTRAP_ADMIN_EMAIL,
  BOOTSTRAP_ADMIN_PASSWORD,
  getBootstrapAdminUser,
  isBootstrapAdminCredentials,
} from "@/lib/auth/bootstrap-credentials";

const COOKIE_NAME = "aromza_portal_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function setBootstrapSession(email: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `${email.toLowerCase()}.${expiresAt}`;
  const token = `${payload}.${signBootstrapPayload(payload)}`;
  const store = await cookies();

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearBootstrapSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getBootstrapUserFromCookie(): Promise<AuthUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyBootstrapToken(token);
}
