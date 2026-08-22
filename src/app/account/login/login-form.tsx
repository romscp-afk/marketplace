"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionResult } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: AuthActionResult | null = null;

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <>
      <form action={formAction} className="mt-8 space-y-4">
        {redirectTo ? <input type="hidden" name="redirect" value={redirectTo} /> : null}
        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        {state && !state.success ? (
          <p className="text-error text-sm" role="alert">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" fullWidth isLoading={isPending}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p>
          <Link href="/seller/register" className="text-primary font-medium hover:underline">
            Create a supplier account
          </Link>
        </p>
        <p>
          <Link href="/account/register" className="text-primary font-medium hover:underline">
            Create a customer account
          </Link>
        </p>
        <p>
          <Link href="/account/forgot-password" className="text-muted hover:text-primary">
            Forgot password?
          </Link>
        </p>
      </div>
    </>
  );
}
