/**
 * In-memory order store for development when Supabase is not configured.
 */

import { generateId } from "@/lib/utils";
import type { ReturnRequest, StoredOrder } from "@/lib/commerce/types";
import type { OrderStatus, PaymentStatus, SellerSubOrderStatus } from "@/types";

const mockOrders: StoredOrder[] = [];
const mockReturns: ReturnRequest[] = [];

const SEED_ORDERS: StoredOrder[] = [
  {
    id: "ord-seed-1",
    orderNumber: "ORD-2025-00142",
    status: "confirmed",
    paymentStatus: "succeeded",
    items: [],
    sellerSubOrders: [
      {
        id: "sub-seed-1",
        sellerId: "seller-1",
        sellerName: "Artisan Collective",
        status: "accepted",
        items: [
          {
            id: "oi-1",
            productId: "prod-1",
            title: "Organic Cotton Linen Blend Shirt",
            quantity: 1,
            unitPrice: 89,
            totalPrice: 89,
          },
        ],
        subtotal: 89,
        deliveryFee: 0,
        commission: 8.9,
      },
    ],
    subtotal: 234.5,
    discount: 0,
    deliveryFee: 5.99,
    tax: 0,
    total: 240.49,
    currency: "USD",
    shippingAddress: {
      id: "addr-1",
      firstName: "Alex",
      lastName: "Rivera",
      line1: "123 Main St",
      city: "Brooklyn",
      state: "NY",
      postalCode: "11201",
      country: "SG",
    },
    guestEmail: "customer@example.com",
    createdAt: "2025-07-30T10:00:00Z",
    updatedAt: "2025-07-30T10:00:00Z",
  },
];

for (const order of SEED_ORDERS) {
  mockOrders.push(order);
}

export function createMockOrder(order: StoredOrder): StoredOrder {
  mockOrders.unshift(order);
  return order;
}

export function getMockOrders(): StoredOrder[] {
  return [...mockOrders];
}

export function getMockOrderByNumber(orderNumber: string): StoredOrder | undefined {
  return mockOrders.find((o) => o.orderNumber === orderNumber);
}

export function getMockOrderById(orderId: string): StoredOrder | undefined {
  return mockOrders.find((o) => o.id === orderId);
}

export function getMockOrdersForCustomer(params: {
  userId?: string;
  email?: string;
}): StoredOrder[] {
  return mockOrders.filter((order) => {
    if (params.userId && order.userId === params.userId) return true;
    if (params.email && order.guestEmail?.toLowerCase() === params.email.toLowerCase()) {
      return true;
    }
    return false;
  });
}

export function getMockSubOrdersForSeller(sellerId: string) {
  return mockOrders.flatMap((order) =>
    order.sellerSubOrders
      .filter((sub) => sub.sellerId === sellerId)
      .map((sub) => ({ order, subOrder: sub })),
  );
}

export function updateMockOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus,
): StoredOrder | undefined {
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) return undefined;
  order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();
  return order;
}

export function updateMockSubOrderStatus(
  subOrderId: string,
  status: SellerSubOrderStatus,
): StoredOrder | undefined {
  for (const order of mockOrders) {
    const sub = order.sellerSubOrders.find((s) => s.id === subOrderId);
    if (sub) {
      sub.status = status;
      order.updatedAt = new Date().toISOString();
      return order;
    }
  }
  return undefined;
}

export function createMockReturnRequest(
  data: Omit<ReturnRequest, "id" | "createdAt" | "updatedAt">,
): ReturnRequest {
  const entry: ReturnRequest = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockReturns.unshift(entry);
  return entry;
}

export function getMockReturnRequests(): ReturnRequest[] {
  return [...mockReturns];
}

export function getMockReturnById(id: string): ReturnRequest | undefined {
  return mockReturns.find((r) => r.id === id);
}

export function updateMockReturn(
  id: string,
  updates: Partial<ReturnRequest>,
): ReturnRequest | undefined {
  const idx = mockReturns.findIndex((r) => r.id === id);
  if (idx < 0) return undefined;
  mockReturns[idx] = {
    ...mockReturns[idx]!,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockReturns[idx];
}
