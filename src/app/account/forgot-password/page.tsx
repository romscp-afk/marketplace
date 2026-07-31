"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPassword, type AuthActionResult } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthActionResult | null = null;

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">Reset password</h1>
      <p className="text-muted mt-2 text-sm">
        Enter your email and we&apos;ll send a reset link
      </p>

      {state?.success ? (
        <div className="bg-success/10 mt-8 rounded-lg p-4 text-sm" role="status">
          Check your email for a password reset link.
        </div>
      ) : (
        <form action={formAction} className="mt-8 space-y-4">
          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
          />

          {state && !state.success ? (
            <p className="text-error text-sm" role="alert">
              {state.error}
            </p>
          ) : null}

          <Button type="submit" fullWidth isLoading={isPending}>
            Send reset link
          </Button>
        </form>
      )}

      <p className="text-muted mt-6 text-center text-sm">
        <Link href="/account/login" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
