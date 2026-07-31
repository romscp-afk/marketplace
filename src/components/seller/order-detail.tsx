"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { updateOrderStatus } from "@/lib/seller/actions";
import { OrderStatusBadge } from "@/components/seller/status-badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SellerOrderDetail } from "@/types/seller";

const FulfilmentActions: Record<string, { label: string; next: "accepted" | "processing" | "shipped" | "delivered" }[]> = {
  pending: [{ label: "Accept order", next: "accepted" }],
  accepted: [{ label: "Mark processing", next: "processing" }],
  processing: [{ label: "Mark shipped", next: "shipped" }],
  shipped: [{ label: "Mark delivered", next: "delivered" }],
};

export function OrderDetailView({ order }: { order: SellerOrderDetail }) {
  const [isPending, startTransition] = useTransition();
  const actions = FulfilmentActions[order.status] ?? [];

  const handleAction = (status: "accepted" | "processing" | "shipped" | "delivered") => {
    startTransition(async () => {
      await updateOrderStatus(order.subOrderId, status);
    });
  };

  return (
    <div>
      <Link href="/seller/orders" className="text-primary mb-6 inline-block text-sm hover:underline">
        ← Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">{order.orderNumber}</h1>
          <p className="text-muted mt-1 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {actions.length > 0 ? (
        <div className="mb-6 flex gap-2">
          {actions.map(({ label, next }) => (
            <Button
              key={next}
              size="sm"
              isLoading={isPending}
              onClick={() => handleAction(next)}
            >
              {label}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-surface rounded-xl border border-border p-4">
          <h2 className="mb-3 font-medium">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt="" width={48} height={48} className="rounded-lg object-cover" />
                ) : (
                  <div className="bg-background h-12 w-12 rounded-lg" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.variantName ? (
                    <p className="text-muted text-xs">{item.variantName}</p>
                  ) : null}
                  <p className="text-muted text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatCurrency(item.totalPrice)}</p>
              </div>
            ))}
          </div>
          <div className="border-border mt-4 space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Commission</span>
              <span className="text-error">-{formatCurrency(order.commission)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Your earnings</span>
              <span>{formatCurrency(order.subtotal - order.commission)}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <h2 className="mb-3 font-medium">Ship to</h2>
          <address className="text-muted text-sm not-italic">
            {order.shippingAddress.line1}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </address>
        </div>
      </div>
    </div>
  );
}
