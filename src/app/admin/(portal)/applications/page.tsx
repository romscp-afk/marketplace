import Link from "next/link";
import { ApplicationReviewCard } from "@/components/admin/application-review-card";
import { ApplicationStatusBadge } from "@/components/seller/status-badge";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminApplications } from "@/lib/admin/data";

export default async function AdminApplicationsPage() {
  await requireAdmin();
  const applications = await getAdminApplications();
  const pending = applications.filter((a) =>
    ["submitted", "under_review", "more_info_required"].includes(a.status),
  );

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Seller applications</h1>
      <p className="text-muted mb-8 text-sm">
        {pending.length} pending · {applications.length} total
      </p>

      {pending.length > 0 ? (
        <section aria-labelledby="pending-heading" className="mb-10">
          <h2 id="pending-heading" className="mb-4 text-lg font-semibold">
            Pending review
          </h2>
          <div className="space-y-4">
            {pending.map((app) => (
              <ApplicationReviewCard key={app.id} application={app} />
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="all-applications-heading">
        <h2 id="all-applications-heading" className="mb-4 text-lg font-semibold">
          All applications
        </h2>
        <div className="bg-surface overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 font-medium">Store</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Applicant</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-border border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{app.storeName}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{app.applicantEmail}</td>
                  <td className="px-4 py-3">
                    <ApplicationStatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
