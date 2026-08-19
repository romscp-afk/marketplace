import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { UserRole } from "@/types";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
}

export const getSession = cache(async () => {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
});

export const getUser = cache(async (): Promise<AuthUser | null> => {
  if (!isSupabaseConfigured()) {
    const { getBootstrapUserFromCookie } = await import("@/lib/auth/bootstrap");
    return getBootstrapUserFromCookie();
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  return {
    id: user.id,
    email: user.email ?? "",
    firstName: profile?.first_name ?? undefined,
    lastName: profile?.last_name ?? undefined,
    roles: (roles?.map((r) => r.role) ?? ["customer"]) as UserRole[],
  };
});

export async function requireAuth(redirectTo = "/account/login"): Promise<AuthUser> {
  const user = await getUser();
  if (!user) redirect(redirectTo);
  return user;
}

export function hasRole(user: AuthUser, role: UserRole): boolean {
  return user.roles.includes(role);
}

export function isAdmin(user: AuthUser): boolean {
  return user.roles.some((r) =>
    ["marketplace_admin", "super_admin"].includes(r),
  );
}

export function isSeller(user: AuthUser): boolean {
  return user.roles.some((r) =>
    ["seller_owner", "seller_staff", "seller_applicant"].includes(r),
  );
}
