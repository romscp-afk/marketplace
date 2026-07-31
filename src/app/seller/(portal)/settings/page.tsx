import { requireApprovedSeller } from "@/lib/seller/session";
import { formatCurrency } from "@/lib/utils";
import { brand } from "@/config/brand";

export default async function SellerSettingsPage() {
  const { context } = await requireApprovedSeller();

  return (
    <div>
      <h1 className="font-display mb-8 text-2xl font-semibold">Settings</h1>

      <div className="max-w-xl space-y-6">
        <section className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-medium">Commission</h2>
          <p className="text-muted mt-2 text-sm">
            Platform commission rate: {(context.seller.commissionRate * 100).toFixed(0)}%
          </p>
          <p className="text-muted mt-1 text-xs">
            Contact support to discuss custom rates.
          </p>
        </section>

        <section className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-medium">Payouts</h2>
          <p className="text-muted mt-2 text-sm">
            Minimum payout: {formatCurrency(brand.commission.minimumPayout)}
          </p>
          <p className="text-muted mt-1 text-xs">
            Payout provider and bank details will be configured after application approval.
          </p>
        </section>

        <section className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-medium">Notifications</h2>
          <p className="text-muted mt-2 text-sm">
            Email notifications for orders, low stock, and payouts will be available in Milestone 6.
          </p>
        </section>
      </div>
    </div>
  );
}
