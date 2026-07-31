"use server";

import { z } from "zod";
import { brand } from "@/config/brand";
import { getUser } from "@/lib/auth/session";
import { generateId } from "@/lib/utils";
import { splitOrderBySeller, generateOrderNumber } from "@/lib/commerce/order-split";
import { persistOrder, getOrderByNumber } from "@/lib/commerce/orders";
import type { CheckoutResult, ReturnActionResult } from "@/lib/commerce/types";
import { getPaymentProvider } from "@/lib/payments";
import { notifyOrderConfirmation, notifySellerNewOrder, notifyReturnUpdate } from "@/lib/notifications";
import * as mock from "@/lib/commerce/mock-orders";
import { canPersistOrders } from "@/lib/commerce/orders";
import { createServiceClientSafe } from "@/lib/supabase/admin";
import { getCommissionSettings } from "@/lib/admin/data";

const lineItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().min(1),
  unitPrice: z.coerce.number().min(0),
  title: z.string().min(1),
  variantName: z.string().optional(),
  sellerId: z.string().min(1),
  sellerName: z.string().min(1),
  imageUrl: z.string().optional(),
  isReturnEligible: z.boolean(),
});

const checkoutSchema = z.object({
  items: z.array(lineItemSchema).min(1),
  contact: z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
  }),
  address: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().optional(),
  }),
  shippingMethod: z.enum(["standard", "express"]),
  subtotal: z.coerce.number().min(0),
  discount: z.coerce.number().min(0),
  deliveryFee: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
  couponCode: z.string().optional(),
});

export async function placeOrder(input: z.infer<typeof checkoutSchema>): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid checkout data" };
  }

  const data = parsed.data;
  const user = await getUser();

  const computedSubtotal = data.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  if (Math.abs(computedSubtotal - data.subtotal) > 0.02) {
    return { success: false, error: "Cart totals are out of date. Please refresh and try again." };
  }

  const commissionSettings = await getCommissionSettings();
  const split = splitOrderBySeller(data.items, {
    discount: data.discount,
    deliveryFee: data.deliveryFee,
    defaultCommissionRate: commissionSettings.defaultRate,
  });

  if (Math.abs(split.total - data.total) > 0.02) {
    return { success: false, error: "Order total mismatch. Please refresh and try again." };
  }

  const orderNumber = generateOrderNumber();
  const orderId = generateId();
  const payment = getPaymentProvider();

  const intent = await payment.createPaymentIntent({
    orderId,
    amount: split.total,
    currency: brand.locale.currency,
    metadata: { order_number: orderNumber },
  });

  const paymentResult = await payment.confirmPayment(intent.id);
  if (!paymentResult.success) {
    return { success: false, error: paymentResult.errorMessage ?? "Payment failed" };
  }

  const address = {
    ...data.address,
    firstName: data.contact.firstName,
    lastName: data.contact.lastName,
    phone: data.contact.phone ?? data.address.phone,
  };

  const order = await persistOrder({
    orderId,
    orderNumber,
    userId: user?.id,
    guestEmail: data.contact.email,
    split,
    address,
    paymentIntentId: intent.id,
  });

  await notifyOrderConfirmation({
    email: data.contact.email,
    orderNumber: order.orderNumber,
    total: order.total,
    userId: user?.id,
  });

  for (const sub of split.subOrders) {
    await notifySellerNewOrder({
      sellerId: sub.sellerId,
      orderNumber: order.orderNumber,
      subtotal: sub.subtotal,
    });
  }

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    paymentIntentId: intent.id,
  };
}

export async function requestReturn(params: {
  orderNumber: string;
  subOrderId: string;
  reason: string;
}): Promise<ReturnActionResult> {
  if (!params.reason.trim()) {
    return { success: false, error: "Return reason is required" };
  }

  const order = await getOrderByNumber(params.orderNumber);
  if (!order) return { success: false, error: "Order not found" };

  const sub = order.sellerSubOrders.find((s) => s.id === params.subOrderId);
  if (!sub) return { success: false, error: "Sub-order not found" };

  if (!["delivered", "shipped"].includes(sub.status)) {
    return { success: false, error: "This order is not eligible for return yet" };
  }

  const refundAmount = sub.subtotal;

  if (!canPersistOrders()) {
    mock.createMockReturnRequest({
      orderId: order.id,
      orderNumber: order.orderNumber,
      subOrderId: sub.id,
      sellerId: sub.sellerId,
      customerEmail: order.guestEmail ?? "",
      reason: params.reason,
      status: "pending",
      refundAmount,
    });
    return { success: true };
  }

  const service = createServiceClientSafe();
  if (!service) return { success: false, error: "Order service unavailable" };

  await service.from("returns").insert({
    order_id: order.id,
    seller_sub_order_id: sub.id,
    customer_email: order.guestEmail,
    reason: params.reason,
    status: "pending",
    refund_amount: refundAmount,
  });

  return { success: true };
}

export async function processReturnApproval(
  returnId: string,
  decision: "approved" | "rejected",
): Promise<ReturnActionResult> {
  if (!canPersistOrders()) {
    const existing = mock.getMockReturnById(returnId);
    if (!existing) return { success: false, error: "Return not found" };

    if (decision === "rejected") {
      mock.updateMockReturn(returnId, { status: "rejected" });
      await notifyReturnUpdate({
        email: existing.customerEmail,
        orderNumber: existing.orderNumber,
        status: "rejected",
      });
      return { success: true };
    }

    const order = mock.getMockOrderById(existing.orderId);
    if (!order?.paymentIntentId) {
      return { success: false, error: "Payment record not found" };
    }

    const payment = getPaymentProvider();
    const refund = await payment.refundPayment({
      paymentIntentId: order.paymentIntentId,
      amount: existing.refundAmount,
      reason: existing.reason,
    });

    if (!refund.success) {
      return { success: false, error: refund.errorMessage ?? "Refund failed" };
    }

    mock.updateMockReturn(returnId, { status: "refunded" });
    mock.updateMockSubOrderStatus(existing.subOrderId, "returned");
    mock.updateMockOrderStatus(existing.orderId, "partially_refunded", "partially_refunded");

    await notifyReturnUpdate({
      email: existing.customerEmail,
      orderNumber: existing.orderNumber,
      status: "refunded",
    });

    return { success: true };
  }

  const service = createServiceClientSafe();
  if (!service) return { success: false, error: "Order service unavailable" };

  const { data: returnRow } = await service
    .from("returns")
    .select("*")
    .eq("id", returnId)
    .single();

  if (!returnRow) return { success: false, error: "Return not found" };

  if (decision === "rejected") {
    await service.from("returns").update({ status: "rejected" }).eq("id", returnId);
    await notifyReturnUpdate({
      email: returnRow.customer_email as string,
      orderNumber: "",
      status: "rejected",
    });
    return { success: true };
  }

  const { data: paymentRow } = await service
    .from("payments")
    .select("provider_payment_id")
    .eq("order_id", returnRow.order_id)
    .single();

  if (!paymentRow?.provider_payment_id) {
    return { success: false, error: "Payment record not found" };
  }

  const payment = getPaymentProvider();
  const refund = await payment.refundPayment({
    paymentIntentId: paymentRow.provider_payment_id as string,
    amount: Number(returnRow.refund_amount),
    reason: returnRow.reason as string,
  });

  if (!refund.success) {
    return { success: false, error: refund.errorMessage ?? "Refund failed" };
  }

  await service.from("returns").update({ status: "refunded" }).eq("id", returnId);
  await service.from("refunds").insert({
    return_id: returnId,
    provider_refund_id: refund.refundId,
    amount: refund.amount,
    status: refund.status,
  });
  await service
    .from("seller_sub_orders")
    .update({ status: "returned" })
    .eq("id", returnRow.seller_sub_order_id);

  return { success: true };
}

export async function getReturnRequests() {
  if (!canPersistOrders()) {
    return mock.getMockReturnRequests();
  }

  const service = createServiceClientSafe();
  if (!service) return mock.getMockReturnRequests();

  const { data } = await service
    .from("returns")
    .select("*, orders(order_number)")
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((row) => {
    const order = row.orders as { order_number: string } | null;
    return {
      id: row.id as string,
      orderId: row.order_id as string,
      orderNumber: order?.order_number ?? "",
      subOrderId: row.seller_sub_order_id as string,
      sellerId: "",
      customerEmail: row.customer_email as string,
      reason: row.reason as string,
      status: row.status as import("@/lib/commerce/types").ReturnStatus,
      refundAmount: Number(row.refund_amount),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  });
}
