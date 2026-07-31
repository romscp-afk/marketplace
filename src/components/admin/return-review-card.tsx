"use client";

import { useTransition } from "react";
import { processReturnApproval } from "@/lib/commerce/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ReturnRequest } from "@/lib/commerce/types";

const statusColors: Record<ReturnRequest["status"], "warning" | "success" | "error" | "default"> = {
  pending: "warning",
  approved: "default",
  rejected: "error",
  refunded: "success",
};

export function ReturnReviewCard({ returnRequest }: { returnRequest: ReturnRequest }) {
  const [isPending, startTransition] = useTransition();

  const handleDecision = (decision: "approved" | "rejected") => {
    if (!confirm(`${decision === "approved" ? "Approve" : "Reject"} this return?`)) return;
    startTransition(async () => {
      await processReturnApproval(returnRequest.id, decision);
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{returnRequest.orderNumber}</h3>
          <p className="text-muted text-sm">{returnRequest.customerEmail}</p>
          <p className="text-muted mt-1 text-xs">{formatDate(returnRequest.createdAt)}</p>
        </div>
        <Badge variant={statusColors[returnRequest.status]}>{returnRequest.status}</Badge>
      </div>
      <p className="mt-3 text-sm">{returnRequest.reason}</p>
      <p className="mt-2 text-sm font-medium">
        Refund amount: {formatCurrency(returnRequest.refundAmount)}
      </p>
      {returnRequest.status === "pending" ? (
        <div className="mt-4 flex gap-2">
          <Button size="sm" isLoading={isPending} onClick={() => handleDecision("approved")}>
            Approve & refund
          </Button>
          <Button
            size="sm"
            variant="destructive"
            isLoading={isPending}
            onClick={() => handleDecision("rejected")}
          >
            Reject
          </Button>
        </div>
      ) : null}
    </div>
  );
}
