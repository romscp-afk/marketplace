import { OrderStatusBadge } from "@/components/seller/status-badge";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminOrders } from "@/lib/admin/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Orders</h1>
      <p className="text-muted mb-8 text-sm">{orders.length} platform orders</p>

      {orders.length === 0 ? (
        <p className="text-muted text-sm">No orders yet.</p>
      ) : (
        <div className="bg-surface overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Sellers</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-border border-b last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-muted text-xs">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">{order.customerEmail}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">{order.sellerCount || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
