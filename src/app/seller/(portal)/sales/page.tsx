import { requireApprovedSeller } from "@/lib/seller/session";
import { getSellerStats, getSellerOrders } from "@/lib/seller/data";
import { StatCard } from "@/components/seller/stat-card";
import { formatCurrency } from "@/lib/utils";

export default async function SalesPage() {
  const { context } = await requireApprovedSeller();
  const [stats, orders] = await Promise.all([
    getSellerStats(context.seller.id),
    getSellerOrders(context.seller.id),
  ]);

  const totalCommission = orders.reduce((sum, o) => sum + o.commission, 0);
  const netEarnings = orders.reduce((sum, o) => sum + o.subtotal - o.commission, 0);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Sales analytics</h1>
      <p className="text-muted mb-8 text-sm">
        Commission rate: {(context.seller.commissionRate * 100).toFixed(0)}%
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total sales" value={formatCurrency(stats.totalSales)} />
        <StatCard label="Net earnings" value={formatCurrency(netEarnings)} hint="After commission" />
        <StatCard label="Platform commission" value={formatCurrency(totalCommission)} />
        <StatCard label="Orders this month" value={stats.ordersThisMonth} />
        <StatCard label="Average rating" value={stats.rating.toFixed(1)} variant="success" />
        <StatCard label="Active products" value={stats.activeProducts} />
      </div>

      <div className="bg-background rounded-xl border border-dashed border-border p-6 text-center">
        <p className="text-muted text-sm">
          Detailed charts and export will be available once analytics provider is selected.
        </p>
        <p className="text-muted mt-1 text-xs">See docs/OPEN_DECISIONS.md</p>
      </div>
    </div>
  );
}
