import Link from "next/link";
import { FileCheck, Package, ShoppingBag, Store } from "lucide-react";
import { StatCard } from "@/components/seller/stat-card";
import { OrderStatusBadge } from "@/components/seller/status-badge";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminStats, getAdminOrders, getAuditLogs } from "@/lib/admin/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [stats, orders, auditLogs] = await Promise.all([
    getAdminStats(),
    getAdminOrders(),
    getAuditLogs(),
  ]);

  const recentOrders = orders.slice(0, 5);
  const recentAudit = auditLogs.slice(0, 5);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Admin dashboard</h1>
      <p className="text-muted mb-8 text-sm">Platform overview and pending actions</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Pending applications"
          value={stats.pendingApplications}
          variant={stats.pendingApplications > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Products in review"
          value={stats.productsInReview}
          variant={stats.productsInReview > 0 ? "warning" : "default"}
        />
        <StatCard label="Orders today" value={stats.ordersToday} />
        <StatCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} />
        <StatCard label="Active sellers" value={stats.activeSellers} />
        <StatCard
          label="Open disputes"
          value={stats.openDisputes}
          variant={stats.openDisputes > 0 ? "warning" : "default"}
        />
      </div>

      {(stats.pendingApplications > 0 || stats.productsInReview > 0) ? (
        <div className="mb-8 space-y-2">
          {stats.pendingApplications > 0 ? (
            <Link
              href="/admin/applications"
              className="bg-warning/10 flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
            >
              <FileCheck className="text-warning h-4 w-4" />
              {stats.pendingApplications} seller application
              {stats.pendingApplications > 1 ? "s" : ""} awaiting review
            </Link>
          ) : null}
          {stats.productsInReview > 0 ? (
            <Link
              href="/admin/products"
              className="bg-primary/5 flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
            >
              <Package className="text-primary h-4 w-4" />
              {stats.productsInReview} product{stats.productsInReview > 1 ? "s" : ""} pending moderation
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="recent-orders-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-orders-heading" className="text-lg font-semibold">
              Recent orders
            </h2>
            <Link href="/admin/orders" className="text-primary text-sm font-medium hover:underline">
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
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-border border-b last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-muted text-xs">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-labelledby="recent-audit-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-audit-heading" className="text-lg font-semibold">
              Recent activity
            </h2>
            <Link href="/admin/audit-logs" className="text-primary text-sm font-medium hover:underline">
              View all
            </Link>
          </div>

          {recentAudit.length === 0 ? (
            <p className="text-muted text-sm">No audit entries yet.</p>
          ) : (
            <ul className="bg-surface divide-border divide-y rounded-xl border border-border">
              {recentAudit.map((entry) => (
                <li key={entry.id} className="px-4 py-3">
                  <p className="text-sm">{entry.summary}</p>
                  <p className="text-muted mt-1 text-xs">
                    {entry.actorEmail} · {formatDate(entry.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/sellers"
          className="bg-surface hover:border-primary/30 flex items-center gap-3 rounded-xl border border-border p-4 transition-colors"
        >
          <Store className="text-primary h-5 w-5" />
          <div>
            <p className="font-medium">Manage sellers</p>
            <p className="text-muted text-xs">View and suspend seller accounts</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-surface hover:border-primary/30 flex items-center gap-3 rounded-xl border border-border p-4 transition-colors"
        >
          <ShoppingBag className="text-primary h-5 w-5" />
          <div>
            <p className="font-medium">Platform orders</p>
            <p className="text-muted text-xs">Monitor marketplace transactions</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
