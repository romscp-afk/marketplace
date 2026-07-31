import Link from "next/link";
import { SellerSidebar } from "@/components/seller/sidebar";
import { ApplicationStatusBadge } from "@/components/seller/status-badge";
import { sellerNavigation, sellerApplicationStatuses } from "@/config/seller-navigation";
import { requireAuth } from "@/lib/auth/session";
import { getSellerApplication, getSellerPortalContext } from "@/lib/seller/session";
import { formatDate } from "@/lib/utils";

export default async function ApplicationStatusPage() {
  const user = await requireAuth("/account/login?redirect=/seller/apply/status");
  const [application, context] = await Promise.all([
    getSellerApplication(user.id),
    getSellerPortalContext(),
  ]);

  const statusConfig = application
    ? sellerApplicationStatuses[application.status]
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <SellerSidebar items={sellerNavigation.apply} />

        <div className="max-w-xl">
          <h1 className="font-display mb-8 text-2xl font-semibold">Application status</h1>

          {!application ? (
            <div className="bg-surface rounded-xl border border-border p-6">
              <p className="text-muted text-sm">You haven&apos;t submitted an application yet.</p>
              <Link
                href="/seller/apply"
                className="bg-primary text-primary-foreground hover:bg-primary-dark mt-4 inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium"
              >
                Start application
              </Link>
            </div>
          ) : (
            <div className="bg-surface space-y-4 rounded-xl border border-border p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{application.storeName}</h2>
                <ApplicationStatusBadge status={application.status} />
              </div>

              {statusConfig ? (
                <p className="text-muted text-sm">
                  {application.status === "submitted" && "Your application is in the queue for review."}
                  {application.status === "under_review" && "Our team is reviewing your application."}
                  {application.status === "more_info_required" && "We need additional information. Check your email."}
                  {application.status === "approved" && "Congratulations! Your seller account is active."}
                  {application.status === "rejected" && "Unfortunately your application was not approved."}
                  {application.status === "draft" && "Complete and submit your application."}
                </p>
              ) : null}

              {application.adminNotes ? (
                <div className="bg-background rounded-lg p-3 text-sm">
                  <p className="font-medium">Note from reviewer</p>
                  <p className="text-muted mt-1">{application.adminNotes}</p>
                </div>
              ) : null}

              <dl className="space-y-2 text-sm">
                {application.submittedAt ? (
                  <div className="flex justify-between">
                    <dt className="text-muted">Submitted</dt>
                    <dd>{formatDate(application.submittedAt)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-muted">Business</dt>
                  <dd>{application.businessName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Categories</dt>
                  <dd>{application.categories.join(", ")}</dd>
                </div>
              </dl>

              {context?.isApprovedSeller ? (
                <Link
                  href="/seller/dashboard"
                  className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium"
                >
                  Go to seller dashboard
                </Link>
              ) : application.status === "rejected" || application.status === "more_info_required" ? (
                <Link
                  href="/seller/apply"
                  className="border-border hover:bg-background inline-flex h-11 w-full items-center justify-center rounded-lg border text-sm font-medium"
                >
                  Update application
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
