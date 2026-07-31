import Link from "next/link";
import { OrderStatusBadge } from "@/components/seller/status-badge";
import { getCustomerOrders } from "@/lib/commerce/orders";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display mb-2 text-2xl font-semibold">Orders</h1>
      <p className="text-muted mb-8 text-sm">
        {orders.length === 0
          ? "No orders yet. Purchases will appear here after checkout."
          : `${orders.length} order${orders.length > 1 ? "s" : ""}`}
      </p>

      {orders.length === 0 ? (
        <Link
          href="/search"
          className="text-primary text-sm font-medium hover:underline"
        >
          Start shopping
        </Link>
      ) : (
        <div className="bg-surface overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Sellers</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-border border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/account/orders/${order.orderNumber}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                    <p className="text-muted text-xs">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {order.sellerSubOrders.map((s) => s.sellerName).join(", ")}
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
    </div>
  );
}
