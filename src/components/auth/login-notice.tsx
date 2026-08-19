import { isSupabaseConfigured } from "@/lib/env";

export function LoginNotice() {
  if (isSupabaseConfigured()) return null;

  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() || "admin@aromza.store";

  return (
    <div
      className="border-border bg-background mt-6 rounded-xl border p-4 text-sm"
      role="status"
    >
      <p className="font-medium">Portal access (Supabase not connected)</p>
      <p className="text-muted mt-1">
        Sign in with <span className="text-foreground font-medium">{email}</span> and your
        bootstrap admin password to open the admin portal.
      </p>
    </div>
  );
}
