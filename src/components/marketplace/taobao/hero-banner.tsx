"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { marketplaceUi } from "@/config/marketplace-ui";

export function HeroBanner() {
  const [active, setActive] = useState(0);
  const banners = marketplaceUi.banners;

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const current = banners[active]!;

  return (
    <div className="relative h-full min-h-[280px] flex-1 overflow-hidden rounded-sm">
      <Link
        href="/search?sort=deals"
        className="flex h-full flex-col justify-end p-6 transition-opacity duration-500"
        style={{ backgroundColor: current.color }}
      >
        <p className="text-3xl font-extrabold text-white">{current.title}</p>
        <p className="mt-2 text-base text-white/90">{current.subtitle}</p>
      </Link>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Show banner ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-5 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
