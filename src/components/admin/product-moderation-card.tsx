"use client";

import { useTransition } from "react";
import Image from "next/image";
import { moderateProduct } from "@/lib/admin/actions";
import { ProductStatusBadge } from "@/components/seller/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { AdminProduct } from "@/types/admin";

export function ProductModerationCard({ product }: { product: AdminProduct }) {
  const [isPending, startTransition] = useTransition();

  const handleDecision = (decision: "approved" | "rejected") => {
    const reason =
      decision === "rejected" ? prompt("Rejection reason (optional):") ?? undefined : undefined;
    if (decision === "rejected" && reason === undefined) return;

    startTransition(async () => {
      await moderateProduct(product.id, decision, reason);
    });
  };

  return (
    <div className="bg-surface flex gap-4 rounded-xl border border-border p-4">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt=""
          width={64}
          height={64}
          className="rounded-lg object-cover"
        />
      ) : (
        <div className="bg-background h-16 w-16 shrink-0 rounded-lg" />
      )}
      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-medium">{product.title}</h3>
            <p className="text-muted text-sm">{product.sellerName}</p>
          </div>
          <ProductStatusBadge status={product.status} />
        </div>
        <p className="mt-2 text-sm font-medium">{formatCurrency(product.price)}</p>
        {product.status === "review" ? (
          <div className="mt-3 flex gap-2">
            <Button size="sm" isLoading={isPending} onClick={() => handleDecision("approved")}>
              Approve
            </Button>
            <Button size="sm" variant="destructive" isLoading={isPending} onClick={() => handleDecision("rejected")}>
              Reject
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
