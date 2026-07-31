import { notFound } from "next/navigation";
import { ApplicationReviewCard } from "@/components/admin/application-review-card";
import { ApplicationStatusBadge } from "@/components/seller/status-badge";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminApplication } from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const application = await getAdminApplication(id);

  if (!application) notFound();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">{application.storeName}</h1>
          <p className="text-muted mt-1 text-sm">
            Application from {application.applicantName}
          </p>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>

      <dl className="bg-surface mb-8 grid gap-4 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted text-xs font-medium uppercase">Applicant email</dt>
          <dd className="mt-1">{application.applicantEmail}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium uppercase">Business name</dt>
          <dd className="mt-1">{application.businessName ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium uppercase">Categories</dt>
          <dd className="mt-1">{application.categories.join(", ") || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium uppercase">Submitted</dt>
          <dd className="mt-1">
            {application.submittedAt ? formatDate(application.submittedAt) : "—"}
          </dd>
        </div>
        {application.storeDescription ? (
          <div className="sm:col-span-2">
            <dt className="text-muted text-xs font-medium uppercase">Description</dt>
            <dd className="mt-1">{application.storeDescription}</dd>
          </div>
        ) : null}
      </dl>

      <ApplicationReviewCard application={application} />
    </div>
  );
}
