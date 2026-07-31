import type { AnalyticsEvent } from "@/types";
import { publicEnv } from "@/lib/env";

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  pageView(path: string): void;
}

class MockAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (process.env.NODE_ENV === "development") {
      console.debug("[Analytics]", event.name, event.properties);
    }
  }

  pageView(path: string): void {
    if (process.env.NODE_ENV === "development") {
      console.debug("[Analytics] page_view", path);
    }
  }
}

class PlausibleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (typeof window !== "undefined" && publicEnv.NEXT_PUBLIC_ANALYTICS_ID) {
      (window as Window & { plausible?: (name: string, opts?: { props: Record<string, unknown> }) => void }).plausible?.(
        event.name,
        { props: event.properties ?? {} },
      );
    }
  }

  pageView(path: string): void {
    this.track({ name: "page_view", properties: { path } });
  }
}

class GoogleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    if (typeof window !== "undefined" && publicEnv.NEXT_PUBLIC_ANALYTICS_ID) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.(
        "event",
        event.name,
        event.properties,
      );
    }
  }

  pageView(path: string): void {
    if (typeof window !== "undefined" && publicEnv.NEXT_PUBLIC_ANALYTICS_ID) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.(
        "config",
        publicEnv.NEXT_PUBLIC_ANALYTICS_ID,
        { page_path: path },
      );
    }
  }
}

function createAnalyticsProvider(): AnalyticsProvider {
  switch (publicEnv.NEXT_PUBLIC_ANALYTICS_PROVIDER) {
    case "plausible":
      return new PlausibleAnalyticsProvider();
    case "google":
      return new GoogleAnalyticsProvider();
    case "mock":
    default:
      return new MockAnalyticsProvider();
  }
}

let provider: AnalyticsProvider = createAnalyticsProvider();

export function setAnalyticsProvider(newProvider: AnalyticsProvider): void {
  provider = newProvider;
}

export const analytics = {
  track: (event: AnalyticsEvent) => provider.track(event),
  pageView: (path: string) => provider.pageView(path),

  productViewed: (productId: string, productName: string) =>
    provider.track({
      name: "product_viewed",
      properties: { product_id: productId, product_name: productName },
    }),

  searchSubmitted: (query: string, resultCount: number) =>
    provider.track({
      name: "search_submitted",
      properties: { query, result_count: resultCount },
    }),

  filterApplied: (filterType: string, filterValue: string) =>
    provider.track({
      name: "filter_applied",
      properties: { filter_type: filterType, filter_value: filterValue },
    }),

  addToCart: (productId: string, quantity: number) =>
    provider.track({
      name: "product_added_to_cart",
      properties: { product_id: productId, quantity },
    }),

  removeFromCart: (productId: string) =>
    provider.track({
      name: "product_removed_from_cart",
      properties: { product_id: productId },
    }),

  checkoutStarted: (itemCount: number) =>
    provider.track({
      name: "checkout_started",
      properties: { item_count: itemCount },
    }),

  checkoutStepCompleted: (step: string) =>
    provider.track({
      name: "checkout_step_completed",
      properties: { step },
    }),

  paymentAttempted: (orderId: string) =>
    provider.track({
      name: "payment_attempted",
      properties: { order_id: orderId },
    }),

  purchaseCompleted: (orderId: string, total: number) =>
    provider.track({
      name: "purchase_completed",
      properties: { order_id: orderId, total },
    }),

  wishlistAction: (productId: string, action: "add" | "remove") =>
    provider.track({
      name: "wishlist_action",
      properties: { product_id: productId, action },
    }),

  pwaInstallOffered: () => provider.track({ name: "pwa_install_offered" }),
  pwaInstallAccepted: () => provider.track({ name: "pwa_install_accepted" }),
  pwaInstallDismissed: () => provider.track({ name: "pwa_install_dismissed" }),
};
