import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/env";

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display mb-4 text-2xl font-semibold">Security</h1>
      <div className="bg-surface max-w-lg rounded-xl border border-border p-6">
        <h2 className="font-medium">Password</h2>
        <p className="text-muted mt-2 text-sm">
          Reset your password via email.
        </p>
        {isSupabaseConfigured() ? (
          <Link
            href="/account/forgot-password"
            className="text-primary mt-4 inline-block text-sm font-medium hover:underline"
          >
            Reset password
          </Link>
        ) : (
          <p className="text-muted mt-4 text-xs">
            Available once Supabase authentication is configured.
          </p>
        )}
      </div>
    </div>
  );
}
