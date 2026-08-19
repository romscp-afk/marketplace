"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import {
  flashSaleEndsAt,
  formatCountdown,
} from "@/lib/marketplace/helpers";

export function FlashSaleSection({ products }: { products: Product[] }) {
  const [endsAt] = useState(() => flashSaleEndsAt());
  const [countdown, setCountdown] = useState(() =>
    formatCountdown(endsAt.getTime() - Date.now()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatCountdown(endsAt.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  if (!products.length) return null;

  return (
    <section className="bg-surface mt-2" aria-label="Flash sale">
      <div className="bg-header flex items-center gap-2.5 px-3 py-2.5">
        <Zap className="h-4 w-4 text-white" aria-hidden="true" />
        <span className="text-base font-extrabold text-white italic">Flash Sale</span>
        <span className="text-[11px] text-white">Ends in</span>
        <span className="rounded bg-[#222] px-1.5 py-0.5 font-mono text-xs font-bold text-white tabular-nums">
          {countdown}
        </span>
        <Link href="/search?sort=deals" className="ml-auto text-xs text-white">
          See all ›
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto p-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.slice(0, 10).map((product) => (
          <div key={product.id} className="w-[130px] shrink-0">
            <ProductCard product={product} variant="flash" />
          </div>
        ))}
      </div>
    </section>
  );
}
