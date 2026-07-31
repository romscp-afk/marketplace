"use client";

import { useActionState } from "react";
import { updateStoreProfile, type ActionResult } from "@/lib/seller/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { SellerRecord } from "@/types/seller";

const initialState: ActionResult | null = null;

export function StoreProfileForm({ seller }: { seller: SellerRecord }) {
  const [state, formAction, isPending] = useActionState(updateStoreProfile, initialState);

  return (
    <form action={formAction} className="bg-surface max-w-xl space-y-4 rounded-xl border border-border p-6">
      <Input
        label="Store name"
        name="name"
        defaultValue={seller.store.name}
        required
      />
      <Textarea
        label="Store description"
        name="description"
        defaultValue={seller.store.description ?? ""}
        rows={4}
      />
      <Input
        label="Store URL slug"
        name="slug"
        defaultValue={seller.store.slug}
        hint="Read-only in this version"
        disabled
      />

      {state?.success ? (
        <p className="text-success text-sm" role="status">Store profile updated.</p>
      ) : null}
      {state && !state.success ? (
        <p className="text-error text-sm" role="alert">{state.error}</p>
      ) : null}

      <Button type="submit" isLoading={isPending}>
        Save changes
      </Button>
    </form>
  );
}
