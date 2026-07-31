"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionResult } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";

const initialState: AuthActionResult | null = null;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">Sign in</h1>
      <p className="text-muted mt-2 text-sm">
        Welcome back to {brand.name}
      </p>

      <form action={formAction} className="mt-8 space-y-4">
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
          <Link href="/account/register" className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </p>
        <p>
          <Link href="/account/forgot-password" className="text-muted hover:text-primary">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}
