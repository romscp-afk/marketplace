import { requireApprovedSeller } from "@/lib/seller/session";
import { getSellerPayouts } from "@/lib/seller/data";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { brand } from "@/config/brand";

const payoutStatusVariant = {
  pending: "warning" as const,
  processing: "accent" as const,
  paid: "success" as const,
  failed: "error" as const,
};

export default async function PayoutsPage() {
  const { context } = await requireApprovedSeller();
  const payouts = await getSellerPayouts(context.seller.id);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Payouts</h1>
      <p className="text-muted mb-8 text-sm">
        Minimum payout threshold: {formatCurrency(brand.commission.minimumPayout)}
      </p>

      {payouts.length === 0 ? (
        <p className="text-muted text-sm">No payouts yet.</p>
      ) : (
        <div className="bg-surface overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} className="border-border border-b last:border-0">
                  <td className="px-4 py-3">
                    {formatDate(payout.periodStart)} – {formatDate(payout.periodEnd)}
                    {payout.paidAt ? (
                      <p className="text-muted text-xs">Paid {formatDate(payout.paidAt)}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={payoutStatusVariant[payout.status]}>
                      {payout.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(payout.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-muted mt-6 text-xs">
        Payout schedule and provider not yet configured. See docs/OPEN_DECISIONS.md.
      </p>
    </div>
  );
}
