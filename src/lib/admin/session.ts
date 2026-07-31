import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { getUser, requireAuth, isAdmin } from "@/lib/auth/session";
import type { AdminPortalContext } from "@/types/admin";
import * as mock from "@/lib/admin/mock-data";

export async function getAdminContext(): Promise<AdminPortalContext | null> {
  if (!isSupabaseConfigured()) {
    const user = await getUser();
    if (!user) return null;
    return mock.MOCK_ADMIN;
  }

  const user = await getUser();
  if (!user || !isAdmin(user)) return null;

  return {
    userId: user.id,
    email: user.email,
    isSuperAdmin: user.roles.includes("super_admin"),
  };
}

export async function requireAdmin() {
  const user = await requireAuth("/account/login?redirect=/admin");

  if (!isSupabaseConfigured()) {
    return { user, context: mock.MOCK_ADMIN };
  }

  if (!isAdmin(user)) {
    redirect("/");
  }

  return {
    user,
    context: {
      userId: user.id,
      email: user.email,
      isSuperAdmin: user.roles.includes("super_admin"),
    } satisfies AdminPortalContext,
  };
}

export async function requireSuperAdmin() {
  const { user, context } = await requireAdmin();

  if (!context.isSuperAdmin && isSupabaseConfigured()) {
    redirect("/admin/dashboard");
  }

  return { user, context };
}
