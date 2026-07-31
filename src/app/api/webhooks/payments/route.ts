import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { serverEnv } from "@/lib/env";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")
    ?? request.headers.get("paypal-transmission-sig")
    ?? "";

  const payload = await request.text();
  const payment = getPaymentProvider();
  const result = await payment.verifyWebhook(payload, signature);

  if (!result.valid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (serverEnv.PAYMENT_PROVIDER === "mock") {
    return NextResponse.json({ received: true, provider: "mock" });
  }

  return NextResponse.json({ received: true });
}
