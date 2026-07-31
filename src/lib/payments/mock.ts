import type {
  PaymentIntent,
  PaymentProvider,
  PaymentResult,
  RefundResult,
} from "@/lib/payments/types";

export class MockPaymentProvider implements PaymentProvider {
  private intents = new Map<string, PaymentIntent>();

  async createPaymentIntent(params: {
    orderId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    const id = `pi_mock_${crypto.randomUUID().slice(0, 8)}`;
    const intent: PaymentIntent = {
      id,
      orderId: params.orderId,
      amount: params.amount,
      currency: params.currency,
      status: "pending",
      clientSecret: `mock_secret_${id}`,
      metadata: params.metadata,
    };
    this.intents.set(id, intent);
    return intent;
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentResult> {
    const intent = this.intents.get(paymentIntentId);
    if (!intent) {
      return {
        success: false,
        paymentIntentId,
        status: "failed",
        errorMessage: "Payment intent not found",
      };
    }

    intent.status = "succeeded";
    return {
      success: true,
      paymentIntentId,
      status: "succeeded",
    };
  }

  async cancelPayment(paymentIntentId: string): Promise<PaymentResult> {
    const intent = this.intents.get(paymentIntentId);
    if (!intent) {
      return {
        success: false,
        paymentIntentId,
        status: "failed",
        errorMessage: "Payment intent not found",
      };
    }

    intent.status = "cancelled";
    return {
      success: true,
      paymentIntentId,
      status: "cancelled",
    };
  }

  async refundPayment(params: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
  }): Promise<RefundResult> {
    const intent = this.intents.get(params.paymentIntentId);
    if (!intent) {
      return {
        success: false,
        refundId: "",
        amount: 0,
        status: "failed",
        errorMessage: "Payment intent not found",
      };
    }

    const refundAmount = params.amount ?? intent.amount;
    intent.status =
      refundAmount < intent.amount ? "partially_refunded" : "refunded";

    return {
      success: true,
      refundId: `re_mock_${crypto.randomUUID().slice(0, 8)}`,
      amount: refundAmount,
      status: intent.status,
    };
  }

  async verifyWebhook(): Promise<{ valid: boolean; event?: unknown }> {
    return { valid: true, event: { type: "mock.event" } };
  }
}
