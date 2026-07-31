import Link from "next/link";
import { requireApprovedSeller } from "@/lib/seller/session";
import { getSellerOrders } from "@/lib/seller/data";
import { OrderStatusBadge } from "@/components/seller/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function SellerOrdersPage() {
  const { context } = await requireApprovedSeller();
  const orders = await getSellerOrders(context.seller.id);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Orders</h1>
      <p className="text-muted mb-8 text-sm">{orders.length} orders</p>

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
                <th className="hidden px-4 py-3 font-medium md:table-cell">Items</th>
                <th className="px-4 py-3 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
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
                  <td className="hidden px-4 py-3 md:table-cell">{order.itemCount}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(order.subtotal)}
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
