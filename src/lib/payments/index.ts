import type { PaymentProvider } from "@/lib/payments/types";
import { MockPaymentProvider } from "@/lib/payments/mock";
import { serverEnv } from "@/lib/env";

let provider: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (provider) return provider;

  switch (serverEnv.PAYMENT_PROVIDER) {
    case "stripe":
    case "paypal":
      console.warn(
        `[Payments] ${serverEnv.PAYMENT_PROVIDER} is not configured — using mock provider`,
      );
      provider = new MockPaymentProvider();
      break;
    case "mock":
    default:
      provider = new MockPaymentProvider();
  }

  return provider;
}

export function setPaymentProvider(newProvider: PaymentProvider): void {
  provider = newProvider;
}

export * from "@/lib/payments/types";
export { MockPaymentProvider } from "@/lib/payments/mock";
