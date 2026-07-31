import { notFound } from "next/navigation";
import { ReturnRequestForm } from "@/components/commerce/return-request-form";
import { OrderStatusBadge } from "@/components/seller/status-badge";
import { getOrderByNumber } from "@/lib/commerce/orders";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">{order.orderNumber}</h1>
          <p className="text-muted mt-1 text-sm">Placed {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="bg-surface mb-6 rounded-xl border border-border p-4 text-sm">
        <p className="font-medium">Delivery address</p>
        <p className="text-muted mt-1">
          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          <br />
          {order.shippingAddress.line1}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.postalCode}
        </p>
      </div>

      <div className="mb-4 flex justify-between text-sm">
        <span className="text-muted">Order total</span>
        <span className="font-semibold">{formatCurrency(order.total)}</span>
      </div>

      <div className="space-y-6">
        {order.sellerSubOrders.map((sub) => (
          <section
            key={sub.id}
            className="bg-surface rounded-xl border border-border p-4"
            aria-labelledby={`sub-${sub.id}-heading`}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 id={`sub-${sub.id}-heading`} className="font-medium">
                {sub.sellerName}
              </h2>
              <OrderStatusBadge status={sub.status} />
            </div>

            <ul className="divide-border divide-y text-sm">
              {sub.items.map((item) => (
                <li key={item.id} className="flex justify-between py-2">
                  <span>
                    {item.title}
                    {item.variantName ? ` (${item.variantName})` : ""} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.totalPrice)}</span>
                </li>
              ))}
            </ul>

            <div className="text-muted mt-3 flex justify-between border-t border-border pt-3 text-xs">
              <span>Subtotal</span>
              <span>{formatCurrency(sub.subtotal)}</span>
            </div>

            <ReturnRequestForm orderNumber={order.orderNumber} subOrder={sub} />
          </section>
        ))}
      </div>
    </div>
  );
}
