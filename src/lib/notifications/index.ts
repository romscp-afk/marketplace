import { serverEnv } from "@/lib/env";
import type { NotificationProvider } from "@/lib/notifications/types";
import { MockNotificationProvider } from "@/lib/notifications/mock";

let provider: NotificationProvider | null = null;

export function getNotificationProvider(): NotificationProvider {
  if (provider) return provider;

  switch (serverEnv.EMAIL_PROVIDER) {
    case "sendgrid":
    case "resend":
      console.warn(
        `[Notifications] ${serverEnv.EMAIL_PROVIDER} is not configured — using mock provider`,
      );
      provider = new MockNotificationProvider();
      break;
    case "mock":
    default:
      provider = new MockNotificationProvider();
  }

  return provider;
}

export function setNotificationProvider(newProvider: NotificationProvider): void {
  provider = newProvider;
}

export async function notifyOrderConfirmation(params: {
  email: string;
  orderNumber: string;
  total: number;
  userId?: string;
}) {
  const notifications = getNotificationProvider();
  await notifications.sendEmail({
    to: params.email,
    subject: `Order confirmed — ${params.orderNumber}`,
    text: `Your order ${params.orderNumber} has been confirmed. Total: $${params.total.toFixed(2)}.`,
    template: "order_confirmation",
    metadata: { order_number: params.orderNumber },
  });

  if (params.userId) {
    await notifications.createInAppNotification({
      userId: params.userId,
      type: "order_confirmed",
      title: "Order confirmed",
      message: `Order ${params.orderNumber} is confirmed.`,
      href: `/account/orders/${params.orderNumber}`,
    });
  }
}

export async function notifySellerNewOrder(params: {
  sellerId: string;
  orderNumber: string;
  subtotal: number;
}) {
  const notifications = getNotificationProvider();
  await notifications.createInAppNotification({
    type: "seller_new_order",
    title: "New order received",
    message: `Order ${params.orderNumber} — $${params.subtotal.toFixed(2)}`,
    href: "/seller/orders",
  });
}

export async function notifyReturnUpdate(params: {
  email: string;
  orderNumber: string;
  status: string;
  userId?: string;
}) {
  const notifications = getNotificationProvider();
  await notifications.sendEmail({
    to: params.email,
    subject: `Return update — ${params.orderNumber}`,
    text: `Your return request for order ${params.orderNumber} is now ${params.status}.`,
    template: "return_update",
  });

  if (params.userId) {
    await notifications.createInAppNotification({
      userId: params.userId,
      type: "return_update",
      title: "Return update",
      message: `Return for ${params.orderNumber}: ${params.status}`,
      href: `/account/orders/${params.orderNumber}`,
    });
  }
}

export * from "@/lib/notifications/types";
