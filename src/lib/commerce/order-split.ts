import { brand } from "@/config/brand";
import { generateId } from "@/lib/utils";
import type { CheckoutLineItem, SplitOrderResult, SplitSubOrder } from "@/lib/commerce/types";
import type { OrderItem } from "@/types";

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const suffix = Math.floor(Math.random() * 90000 + 10000);
  return `ORD-${year}-${suffix}`;
}

export function splitOrderBySeller(
  items: CheckoutLineItem[],
  options: {
    discount: number;
    deliveryFee: number;
    sellerCommissionRates?: Record<string, number>;
    defaultCommissionRate?: number;
  },
): SplitOrderResult {
  const defaultRate = options.defaultCommissionRate ?? brand.commission.defaultRate;
  const grouped = new Map<string, CheckoutLineItem[]>();

  for (const item of items) {
    const existing = grouped.get(item.sellerId) ?? [];
    existing.push(item);
    grouped.set(item.sellerId, existing);
  }

  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );

  const subOrders: SplitSubOrder[] = [];
  let totalCommission = 0;

  for (const [sellerId, sellerItems] of grouped) {
    const orderItems: OrderItem[] = sellerItems.map((item) => ({
      id: generateId(),
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      variantName: item.variantName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: roundMoney(item.unitPrice * item.quantity),
      imageUrl: item.imageUrl,
    }));

    const sellerSubtotal = roundMoney(
      orderItems.reduce((sum, item) => sum + item.totalPrice, 0),
    );
    const share = subtotal > 0 ? sellerSubtotal / subtotal : 0;
    const sellerDeliveryFee = roundMoney(options.deliveryFee * share);
    const commissionRate = options.sellerCommissionRates?.[sellerId] ?? defaultRate;
    const commission = roundMoney(sellerSubtotal * commissionRate);

    totalCommission += commission;

    subOrders.push({
      sellerId,
      sellerName: sellerItems[0]?.sellerName ?? "Seller",
      items: orderItems,
      subtotal: sellerSubtotal,
      deliveryFee: sellerDeliveryFee,
      commission,
      commissionRate,
    });
  }

  const tax = 0;
  const total = roundMoney(subtotal - options.discount + options.deliveryFee + tax);

  return {
    subOrders,
    subtotal,
    discount: options.discount,
    deliveryFee: options.deliveryFee,
    tax,
    total,
    totalCommission: roundMoney(totalCommission),
  };
}

export function isWithinReturnWindow(deliveredAt: string, windowDays = 30): boolean {
  const delivered = new Date(deliveredAt).getTime();
  const deadline = delivered + windowDays * 24 * 60 * 60 * 1000;
  return Date.now() <= deadline;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
