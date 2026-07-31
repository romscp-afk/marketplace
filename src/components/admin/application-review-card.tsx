"use client";

import { useTransition } from "react";
import { approveApplication, rejectApplication } from "@/lib/admin/actions";
import { ApplicationStatusBadge } from "@/components/seller/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { AdminApplication } from "@/types/admin";

export function ApplicationReviewCard({ application }: { application: AdminApplication }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    if (!confirm(`Approve "${application.storeName}"?`)) return;
    startTransition(async () => {
      await approveApplication(application.id);
    });
  };

  const handleReject = () => {
    const reason = prompt("Rejection reason (required):");
    if (!reason) return;
    startTransition(async () => {
      await rejectApplication(application.id, reason);
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{application.storeName}</h3>
          <p className="text-muted text-sm">
            {application.applicantName} · {application.applicantEmail}
          </p>
          {application.submittedAt ? (
            <p className="text-muted mt-1 text-xs">
              Submitted {formatDate(application.submittedAt)}
            </p>
          ) : null}
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      {application.storeDescription ? (
        <p className="text-muted mt-3 text-sm">{application.storeDescription}</p>
      ) : null}

      <dl className="text-muted mt-3 grid gap-1 text-xs sm:grid-cols-2">
        <div><dt className="inline font-medium text-foreground">Business: </dt>{application.businessName}</div>
        <div><dt className="inline font-medium text-foreground">Categories: </dt>{application.categories.join(", ")}</div>
      </dl>

      {["submitted", "under_review", "more_info_required"].includes(application.status) ? (
        <div className="mt-4 flex gap-2">
          <Button size="sm" isLoading={isPending} onClick={handleApprove}>
            Approve
          </Button>
          <Button size="sm" variant="destructive" isLoading={isPending} onClick={handleReject}>
            Reject
          </Button>
        </div>
      ) : null}
    </div>
  );
}
