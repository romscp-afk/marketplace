"use client";

import { useTransition } from "react";
import { requestReturn } from "@/lib/commerce/actions";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";
import type { SellerSubOrder } from "@/types";

export function ReturnRequestForm({
  orderNumber,
  subOrder,
}: {
  orderNumber: string;
  subOrder: SellerSubOrder;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const reason = (form.elements.namedItem("reason") as HTMLTextAreaElement).value;
    if (!reason.trim()) return;

    startTransition(async () => {
      await requestReturn({ orderNumber, subOrderId: subOrder.id, reason });
      form.reset();
    });
  };

  if (!["shipped", "delivered"].includes(subOrder.status)) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface mt-4 rounded-xl border border-border p-4">
      <p className="mb-2 text-sm font-medium">Request a return</p>
      <p className="text-muted mb-3 text-xs">
        Returns accepted within {brand.returns.windowDays} days of delivery.
      </p>
      <textarea
        name="reason"
        required
        rows={3}
        placeholder="Why are you returning this item?"
        className="border-border bg-background mb-3 w-full rounded-lg border px-3 py-2 text-sm"
      />
      <Button type="submit" size="sm" isLoading={isPending}>
        Submit return request
      </Button>
    </form>
  );
}
