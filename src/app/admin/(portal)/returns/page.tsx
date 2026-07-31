import { ReturnReviewCard } from "@/components/admin/return-review-card";
import { requireAdmin } from "@/lib/admin/session";
import { getReturnRequests } from "@/lib/commerce/actions";

export default async function AdminReturnsPage() {
  await requireAdmin();
  const returns = await getReturnRequests();
  const pending = returns.filter((r) => r.status === "pending");

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Returns & refunds</h1>
      <p className="text-muted mb-8 text-sm">
        {pending.length} pending · {returns.length} total
      </p>

      {returns.length === 0 ? (
        <p className="text-muted text-sm">No return requests yet.</p>
      ) : (
        <div className="space-y-4">
          {returns.map((item) => (
            <ReturnReviewCard key={item.id} returnRequest={item} />
          ))}
        </div>
      )}
    </div>
  );
}
