import { marketplaceUi } from "@/config/marketplace-ui";

export function BannerCarousel() {
  return (
    <div className="flex gap-2 overflow-x-auto px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {marketplaceUi.banners.map((banner) => (
        <div
          key={banner.id}
          className="mr-2 flex h-[100px] w-[280px] shrink-0 flex-col justify-center rounded px-4"
          style={{ backgroundColor: banner.color }}
        >
          <p className="text-xl font-extrabold text-white">{banner.title}</p>
          <p className="mt-1 text-sm text-white/90">{banner.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
