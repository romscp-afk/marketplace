import { brand } from "@/config/brand";
import { isSupabaseConfigured, isServiceRoleConfigured } from "@/lib/env";
import { createServiceClientSafe } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/session";
import { generateId } from "@/lib/utils";
import type { StoredOrder } from "@/lib/commerce/types";
import type { Address, OrderItem, SellerSubOrder } from "@/types";
import * as mock from "@/lib/commerce/mock-orders";

function mapStoredOrder(row: Record<string, unknown>, subOrders: SellerSubOrder[]): StoredOrder {
  const shipping = row.shipping_address as Record<string, string> | null;
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    userId: (row.user_id as string) ?? undefined,
    guestEmail: (row.guest_email as string) ?? undefined,
    status: row.status as StoredOrder["status"],
    paymentStatus: row.payment_status as StoredOrder["paymentStatus"],
    items: subOrders.flatMap((s) => s.items),
    sellerSubOrders: subOrders,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    deliveryFee: Number(row.delivery_fee),
    tax: Number(row.tax),
    total: Number(row.total),
    currency: row.currency as string,
    shippingAddress: {
      id: "shipping",
      firstName: shipping?.firstName ?? "",
      lastName: shipping?.lastName ?? "",
      line1: shipping?.line1 ?? "",
      line2: shipping?.line2,
      city: shipping?.city ?? "",
      state: shipping?.state ?? "",
      postalCode: shipping?.postalCode ?? "",
      country: shipping?.country ?? "US",
      phone: shipping?.phone,
    },
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function fetchSubOrders(orderId: string, client: ReturnType<typeof createServiceClientSafe>) {
  if (!client) return [];

  const { data: subRows } = await client
    .from("seller_sub_orders")
    .select("*, sellers(stores(name)), order_items(*)")
    .eq("order_id", orderId);

  if (!subRows) return [];

  return subRows.map((row) => {
    const seller = row.sellers as { stores: { name: string } } | null;
    const items = (row.order_items as Record<string, unknown>[]) ?? [];
    return {
      id: row.id as string,
      sellerId: row.seller_id as string,
      sellerName: seller?.stores?.name ?? "Seller",
      status: row.status as SellerSubOrder["status"],
      items: items.map(
        (item): OrderItem => ({
          id: item.id as string,
          productId: item.product_id as string,
          variantId: (item.variant_id as string) ?? undefined,
          title: item.title as string,
          variantName: (item.variant_name as string) ?? undefined,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unit_price),
          totalPrice: Number(item.total_price),
          imageUrl: (item.image_url as string) ?? undefined,
        }),
      ),
      subtotal: Number(row.subtotal),
      deliveryFee: Number(row.delivery_fee),
      commission: Number(row.commission),
    };
  });
}

export function canPersistOrders(): boolean {
  return isSupabaseConfigured() && isServiceRoleConfigured();
}

export async function getCustomerOrders(): Promise<StoredOrder[]> {
  const user = await getUser();

  if (!canPersistOrders()) {
    return mock.getMockOrdersForCustomer({
      userId: user?.id,
      email: user?.email,
    });
  }

  const supabase = await createClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

  if (user) {
    query = query.eq("user_id", user.id);
  } else {
    return [];
  }

  const { data } = await query;
  if (!data) return [];

  const service = createServiceClientSafe();
  const orders: StoredOrder[] = [];

  for (const row of data) {
    const subOrders = await fetchSubOrders(row.id as string, service);
    orders.push(mapStoredOrder(row as Record<string, unknown>, subOrders));
  }

  return orders;
}

export async function getOrderByNumber(orderNumber: string): Promise<StoredOrder | undefined> {
  if (!canPersistOrders()) {
    return mock.getMockOrderByNumber(orderNumber);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (!data) return undefined;

  const service = createServiceClientSafe();
  const subOrders = await fetchSubOrders(data.id as string, service);
  return mapStoredOrder(data as Record<string, unknown>, subOrders);
}

export async function persistOrder(params: {
  orderId: string;
  orderNumber: string;
  userId?: string;
  guestEmail: string;
  split: import("@/lib/commerce/types").SplitOrderResult;
  address: Omit<Address, "id">;
  paymentIntentId: string;
}): Promise<StoredOrder> {
  const now = new Date().toISOString();

  const sellerSubOrders: SellerSubOrder[] = params.split.subOrders.map((sub) => ({
    id: generateId(),
    sellerId: sub.sellerId,
    sellerName: sub.sellerName,
    status: "pending",
    items: sub.items,
    subtotal: sub.subtotal,
    deliveryFee: sub.deliveryFee,
    commission: sub.commission,
  }));

  const stored: StoredOrder = {
    id: params.orderId,
    orderNumber: params.orderNumber,
    userId: params.userId,
    guestEmail: params.guestEmail,
    status: "confirmed",
    paymentStatus: "succeeded",
    paymentIntentId: params.paymentIntentId,
    items: sellerSubOrders.flatMap((s) => s.items),
    sellerSubOrders,
    subtotal: params.split.subtotal,
    discount: params.split.discount,
    deliveryFee: params.split.deliveryFee,
    tax: params.split.tax,
    total: params.split.total,
    currency: brand.locale.currency,
    shippingAddress: { id: "shipping", ...params.address },
    createdAt: now,
    updatedAt: now,
  };

  if (!canPersistOrders()) {
    return mock.createMockOrder(stored);
  }

  const service = createServiceClientSafe()!;

  const { data: orderRow, error: orderError } = await service
    .from("orders")
    .insert({
      id: params.orderId,
      order_number: params.orderNumber,
      user_id: params.userId ?? null,
      guest_email: params.guestEmail,
      status: "confirmed",
      payment_status: "succeeded",
      subtotal: params.split.subtotal,
      discount: params.split.discount,
      delivery_fee: params.split.deliveryFee,
      tax: params.split.tax,
      total: params.split.total,
      currency: brand.locale.currency,
      shipping_address: params.address,
    })
    .select("*")
    .single();

  if (orderError || !orderRow) {
    throw new Error(orderError?.message ?? "Failed to create order");
  }

  for (const sub of sellerSubOrders) {
    const split = params.split.subOrders.find((s) => s.sellerId === sub.sellerId)!;
    const { data: subRow, error: subError } = await service
      .from("seller_sub_orders")
      .insert({
        id: sub.id,
        order_id: params.orderId,
        seller_id: sub.sellerId,
        status: "pending",
        subtotal: sub.subtotal,
        delivery_fee: sub.deliveryFee,
        commission: sub.commission,
      })
      .select("id")
      .single();

    if (subError || !subRow) {
      throw new Error(subError?.message ?? "Failed to create sub-order");
    }

    for (const item of sub.items) {
      await service.from("order_items").insert({
        id: item.id,
        seller_sub_order_id: sub.id,
        product_id: item.productId,
        variant_id: item.variantId ?? null,
        title: item.title,
        variant_name: item.variantName ?? null,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        image_url: item.imageUrl ?? null,
      });
    }

    void split;
  }

  await service.from("payments").insert({
    order_id: params.orderId,
    provider: "mock",
    provider_payment_id: params.paymentIntentId,
    amount: params.split.total,
    currency: brand.locale.currency,
    status: "succeeded",
  });

  return stored;
}
