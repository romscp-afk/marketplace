"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { marketplaceUi } from "@/config/marketplace-ui";
import { SafeImage } from "@/components/ui/safe-image";

export function HeroMosaic() {
  const [active, setActive] = useState(0);
  const banners = marketplaceUi.banners;
  const sideBanners = marketplaceUi.sideBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const current = banners[active]!;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Link
        href="/search?sort=deals"
        className="from-header to-primary relative flex h-11 items-center justify-between overflow-hidden rounded-sm bg-gradient-to-r px-4 text-white"
      >
        <div className="flex min-w-0 items-center gap-4 text-xs sm:text-sm">
          <span className="shrink-0 font-bold tracking-wide">Aromza Season</span>
          <span className="hidden truncate opacity-90 sm:inline">
            Fast shipping · Trusted sellers · Curated finds
          </span>
        </div>
        <span className="bg-surface/15 hover:bg-surface/25 shrink-0 rounded px-3 py-1 text-xs font-semibold transition-colors">
          Shop now
        </span>
      </Link>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_160px] gap-2 lg:grid-cols-[1fr_180px]">
        <div className="relative min-h-[260px] overflow-hidden rounded-sm lg:min-h-[300px]">
          <Link href="/search?sort=deals" className="absolute inset-0 block">
            <SafeImage
              src={current.image}
              alt={current.title}
              fill
              sizes="(max-width: 1024px) 50vw, 540px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-5">
              <p className="text-2xl font-extrabold text-white drop-shadow-sm">
                {current.title}
              </p>
              <p className="mt-1 text-sm text-white/90">{current.subtitle}</p>
            </div>
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

        <div className="flex flex-col gap-2">
          {sideBanners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.href}
              className="relative min-h-0 flex-1 overflow-hidden rounded-sm"
            >
              <SafeImage
                src={banner.image}
                alt={banner.title}
                fill
                sizes="180px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-2.5">
                <p className="text-xs font-bold text-white">{banner.title}</p>
                <p className="text-[10px] text-white/85">{banner.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
