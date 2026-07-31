import type { Address, Order, OrderItem } from "@/types";

export interface CheckoutLineItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  title: string;
  variantName?: string;
  sellerId: string;
  sellerName: string;
  imageUrl?: string;
  isReturnEligible: boolean;
}

export interface CheckoutContact {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface CheckoutInput {
  items: CheckoutLineItem[];
  contact: CheckoutContact;
  address: Omit<Address, "id">;
  shippingMethod: "standard" | "express";
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
}

export interface SplitSubOrder {
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  commission: number;
  commissionRate: number;
}

export interface SplitOrderResult {
  subOrders: SplitSubOrder[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  totalCommission: number;
}

export interface StoredOrder extends Order {
  userId?: string;
  guestEmail?: string;
  paymentIntentId?: string;
}

export type ReturnStatus = "pending" | "approved" | "rejected" | "refunded";

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  subOrderId: string;
  sellerId: string;
  customerEmail: string;
  reason: string;
  status: ReturnStatus;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
}

export type CheckoutResult =
  | { success: true; orderId: string; orderNumber: string; paymentIntentId: string }
  | { success: false; error: string };

export type ReturnActionResult =
  | { success: true }
  | { success: false; error: string };
