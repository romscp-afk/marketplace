import Link from "next/link";
import { marketplaceUi } from "@/config/marketplace-ui";
import { SafeImage } from "@/components/ui/safe-image";

export function BannerCarousel() {
  return (
    <div className="flex gap-2 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {marketplaceUi.banners.map((banner) => (
        <Link
          key={banner.id}
          href="/search?sort=deals"
          className="relative mr-1 flex h-[110px] w-[280px] shrink-0 flex-col justify-end overflow-hidden rounded px-4 pb-3"
        >
          <SafeImage
            src={banner.image}
            alt=""
            fill
            sizes="280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
          <p className="relative text-lg font-extrabold text-white">{banner.title}</p>
          <p className="relative mt-0.5 text-xs text-white/90">{banner.subtitle}</p>
        </Link>
      ))}
    </div>
  );
}
