"use client";

import { useActionState } from "react";
import { updateCommissionSettings, type AdminActionResult } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CommissionSettings } from "@/types/admin";

const initialState: AdminActionResult | null = null;

export function CommissionForm({ settings }: { settings: CommissionSettings }) {
  const [state, formAction, isPending] = useActionState(updateCommissionSettings, initialState);

  return (
    <form action={formAction} className="bg-surface max-w-md space-y-4 rounded-xl border border-border p-6">
      <Input
        label="Default commission rate"
        id="defaultRate"
        name="defaultRate"
        type="number"
        step="0.01"
        min="0"
        max="1"
        defaultValue={settings.defaultRate}
        hint="Decimal (e.g. 0.10 = 10%)"
        required
      />

      <Input
        label="Minimum payout threshold"
        id="minimumPayout"
        name="minimumPayout"
        type="number"
        step="1"
        min="0"
        defaultValue={settings.minimumPayout}
        hint="Minimum balance before seller payout"
        required
      />

      {state && !state.success ? (
        <p className="text-error text-sm" role="alert">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="text-success text-sm" role="status">Commission settings saved.</p>
      ) : null}

      <Button type="submit" isLoading={isPending}>
        Save settings
      </Button>
    </form>
  );
}
