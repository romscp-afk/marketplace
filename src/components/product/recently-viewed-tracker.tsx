"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/contexts/cart-context";
import { trackPwaEngagement } from "@/components/pwa/install-prompt";

export function RecentlyViewedTracker({ productId }: { productId: string }) {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    addRecentlyViewed(productId);
    trackPwaEngagement();
  }, [productId, addRecentlyViewed]);

  return null;
}
