"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

export function ProductViewTracker({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  useEffect(() => {
    analytics.productViewed(productId, productName);
  }, [productId, productName]);

  return null;
}
