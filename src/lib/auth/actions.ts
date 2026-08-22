"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { publicEnv } from "@/lib/env";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
});

export type AuthActionResult =
  | { success: true }
  | { success: false; error: string };

function supabaseNotConfigured(): AuthActionResult {
  return {
    success: false,
    error: "Authentication is not configured. Add Supabase credentials to .env.local.",
  };
}

export async function signIn(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  if (!isSupabaseConfigured()) {
    const { authenticateBootstrapUser, setBootstrapSession } = await import("@/lib/auth/bootstrap");
    const { isAdmin, isSeller } = await import("@/lib/auth/session");

    const user = authenticateBootstrapUser(parsed.data.email, parsed.data.password);
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    await setBootstrapSession(user.email);
    revalidatePath("/", "layout");

    const redirectTo = safeInternalPath(formData.get("redirect"));
    if (redirectTo) redirect(redirectTo);
    if (isAdmin(user)) redirect("/admin/dashboard");
    if (isSeller(user)) redirect("/seller/dashboard");
    redirect("/account");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: "Invalid email or password" };
  }

  revalidatePath("/", "layout");

  const redirectTo = safeInternalPath(formData.get("redirect"));
  if (redirectTo) redirect(redirectTo);

  const { getUser, isAdmin, isSeller } = await import("@/lib/auth/session");
  const user = await getUser();
  if (user && isAdmin(user)) redirect("/admin/dashboard");
  if (user && isSeller(user)) redirect("/seller/dashboard");
  redirect("/account");
}

export async function signUp(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const asSupplier = formData.get("asSupplier") === "true";
  const storeName = String(formData.get("storeName") ?? "").trim();

  if (!isSupabaseConfigured()) {
    if (!asSupplier) {
      return {
        success: false,
        error: "Customer accounts need Supabase. Create a supplier account to publish products.",
      };
    }

    const { registerBootstrapSupplier, setBootstrapSession } = await import("@/lib/auth/bootstrap");
    const { getOrCreateWorkspace } = await import("@/lib/seller/workspace");

    const created = registerBootstrapSupplier(parsed.data);
    if ("error" in created) return { success: false, error: created.error };

    getOrCreateWorkspace(created, storeName || `${parsed.data.firstName} Store`);
    await setBootstrapSession(created.email);
    revalidatePath("/", "layout");
    redirect("/seller/dashboard");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        ...(asSupplier ? { intended_role: "seller_owner" } : {}),
      },
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(asSupplier ? "/seller/apply" : "/account?registered=true");
}

function safeInternalPath(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured()) {
    const { clearBootstrapSession } = await import("@/lib/auth/bootstrap");
    await clearBootstrapSession();
    revalidatePath("/", "layout");
    redirect("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(
  _prev: AuthActionResult | null,
  formData: FormData,
): Promise<AuthActionResult> {
  if (!isSupabaseConfigured()) return supabaseNotConfigured();

  const email = formData.get("email");
  if (typeof email !== "string" || !z.string().email().safeParse(email).success) {
    return { success: false, error: "Valid email required" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/account/security`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

