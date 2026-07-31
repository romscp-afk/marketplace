import Link from "next/link";
import { Package, ShoppingBag, AlertTriangle, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/seller/stat-card";
import { OrderStatusBadge } from "@/components/seller/status-badge";
import { requireApprovedSeller } from "@/lib/seller/session";
import { getSellerStats, getSellerOrders } from "@/lib/seller/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function SellerDashboardPage() {
  const { context } = await requireApprovedSeller();
  const [stats, orders] = await Promise.all([
    getSellerStats(context.seller.id),
    getSellerOrders(context.seller.id),
  ]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted mb-8 text-sm">
        Welcome back, {context.seller.store.name}
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total sales"
          value={formatCurrency(stats.totalSales)}
          hint="All time"
        />
        <StatCard
          label="Orders this month"
          value={stats.ordersThisMonth}
        />
        <StatCard label="Active products" value={stats.activeProducts} />
        <StatCard
          label="Pending orders"
          value={stats.pendingOrders}
          variant={stats.pendingOrders > 0 ? "warning" : "default"}
        />
      </div>

      {(stats.lowStockCount > 0 || stats.pendingOrders > 0) ? (
        <div className="mb-8 space-y-2">
          {stats.lowStockCount > 0 ? (
            <Link
              href="/seller/inventory"
              className="bg-warning/10 flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
            >
              <AlertTriangle className="text-warning h-4 w-4" />
              {stats.lowStockCount} product{stats.lowStockCount > 1 ? "s" : ""} low on stock
            </Link>
          ) : null}
          {stats.pendingOrders > 0 ? (
            <Link
              href="/seller/orders"
              className="bg-primary/5 flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
            >
              <ShoppingBag className="text-primary h-4 w-4" />
              {stats.pendingOrders} order{stats.pendingOrders > 1 ? "s" : ""} awaiting action
            </Link>
          ) : null}
        </div>
      ) : null}

      <section aria-labelledby="recent-orders-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recent-orders-heading" className="text-lg font-semibold">
            Recent orders
          </h2>
          <Link href="/seller/orders" className="text-primary text-sm font-medium hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-muted text-sm">No orders yet.</p>
        ) : (
          <div className="bg-surface overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border border-b text-left">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.subOrderId} className="border-border border-b last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/seller/orders/${order.subOrderId}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-muted text-xs">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">{order.customerName}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(order.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/seller/products/new"
          className="bg-surface hover:border-primary/30 flex items-center gap-3 rounded-xl border border-border p-4 transition-colors"
        >
          <Package className="text-primary h-5 w-5" />
          <div>
            <p className="font-medium">Add product</p>
            <p className="text-muted text-xs">Create a new listing</p>
          </div>
        </Link>
        <Link
          href="/seller/store"
          className="bg-surface hover:border-primary/30 flex items-center gap-3 rounded-xl border border-border p-4 transition-colors"
        >
          <TrendingUp className="text-primary h-5 w-5" />
          <div>
            <p className="font-medium">Edit store</p>
            <p className="text-muted text-xs">Update your storefront</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
