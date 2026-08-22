import { isSupabaseConfigured } from "@/lib/env";
import {
  BOOTSTRAP_ADMIN_EMAIL,
  BOOTSTRAP_SUPPLIER_EMAIL,
} from "@/lib/auth/bootstrap-credentials";

export function LoginNotice() {
  if (isSupabaseConfigured()) return null;

  return (
    <div
      className="border-border bg-background mt-6 rounded-xl border p-4 text-sm"
      role="status"
    >
      <p className="font-medium">Portal access (Supabase not connected)</p>
      <p className="text-muted mt-2">
        Admin: <span className="text-foreground font-medium">{BOOTSTRAP_ADMIN_EMAIL}</span>
      </p>
      <p className="text-muted mt-1">
        Supplier: <span className="text-foreground font-medium">{BOOTSTRAP_SUPPLIER_EMAIL}</span>
      </p>
      <p className="text-muted mt-2 text-xs">
        Use the launch passwords, or create a new supplier account from Sell on Aromza.
      </p>
    </div>
  );
}
