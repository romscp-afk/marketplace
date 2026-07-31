"use client";

import { useTransition } from "react";
import { updateSellerStatus } from "@/lib/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminSeller } from "@/types/admin";

const statusColors: Record<AdminSeller["status"], "success" | "warning" | "error" | "default"> = {
  active: "success",
  pending: "warning",
  suspended: "error",
  closed: "default",
};

export function SellerStatusActions({ seller }: { seller: AdminSeller }) {
  const [isPending, startTransition] = useTransition();

  const handleStatus = (status: "active" | "suspended" | "closed") => {
    const label = status === "suspended" ? "suspend" : status;
    if (!confirm(`${label.charAt(0).toUpperCase()}${label.slice(1)} "${seller.storeName}"?`)) return;
    startTransition(async () => {
      await updateSellerStatus(seller.id, status);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={statusColors[seller.status]}>{seller.status}</Badge>
      {seller.status === "active" ? (
        <Button
          size="sm"
          variant="destructive"
          isLoading={isPending}
          onClick={() => handleStatus("suspended")}
        >
          Suspend
        </Button>
      ) : null}
      {seller.status === "suspended" ? (
        <Button size="sm" isLoading={isPending} onClick={() => handleStatus("active")}>
          Reactivate
        </Button>
      ) : null}
    </div>
  );
}
