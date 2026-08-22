"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthActionResult } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";

const initialState: AuthActionResult | null = null;

export default function SupplierRegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">Create a supplier account</h1>
      <p className="text-muted mt-2 text-sm">
        Open a store on {brand.name} and publish products from your dashboard.
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        <input type="hidden" name="asSupplier" value="true" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" name="firstName" autoComplete="given-name" required />
          <Input label="Last name" name="lastName" autoComplete="family-name" required />
        </div>
        <Input
          label="Store name"
          name="storeName"
          required
          placeholder="Your brand or shop name"
        />
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
          autoComplete="new-password"
          hint="At least 8 characters"
          required
        />

        {state && !state.success ? (
          <p className="text-error text-sm" role="alert">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" fullWidth isLoading={isPending}>
          Create supplier account
        </Button>
      </form>

      <p className="text-muted mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/account/login?redirect=/seller/dashboard"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
