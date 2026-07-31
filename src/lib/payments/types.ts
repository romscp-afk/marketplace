export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  redirectUrl?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId: string;
  status: PaymentStatus;
  errorMessage?: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  status: PaymentStatus;
  errorMessage?: string;
}

export interface PaymentProvider {
  createPaymentIntent(params: {
    orderId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent>;

  confirmPayment(paymentIntentId: string): Promise<PaymentResult>;

  cancelPayment(paymentIntentId: string): Promise<PaymentResult>;

  refundPayment(params: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
  }): Promise<RefundResult>;

  verifyWebhook(
    payload: string,
    signature: string,
  ): Promise<{ valid: boolean; event?: unknown }>;
}
