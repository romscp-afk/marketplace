import type { Product } from "@/types";
import {
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getDeals,
} from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { ProductCard } from "@/components/product/product-card";
import { QuickActions } from "@/components/marketplace/quick-actions";
import { CategoryCarousel } from "@/components/marketplace/category-carousel";
import { BannerCarousel } from "@/components/marketplace/banner-carousel";
import { FlashSaleSection } from "@/components/marketplace/flash-sale-section";
import { MarketplaceHomeHeader } from "@/components/marketplace/home-header";
import { TaobaoHeroSection } from "@/components/marketplace/taobao/hero-section";
import {
  TaobaoPromoGrid,
  TaobaoSearchHeader,
} from "@/components/marketplace/taobao/search-header";

function mergeFeedProducts(lists: Product[][]): Product[] {
  const seen = new Set<string>();
  const merged: Product[] = [];
  for (const list of lists) {
    for (const product of list) {
      if (!seen.has(product.id)) {
        seen.add(product.id);
        merged.push(product);
      }
    }
  }
  return merged;
}

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const featuredIds = featured.map((p) => p.id);
  const trending = await getTrendingProducts(featuredIds);
  const trendingIds = [...featuredIds, ...trending.map((p) => p.id)];
  const newArrivals = await getNewArrivals(trendingIds);
  const dealExclude = [...trendingIds, ...newArrivals.map((p) => p.id)];
  const deals = await getDeals(dealExclude);
  const categories = await getCategories();

  const feedProducts = mergeFeedProducts([deals, trending, newArrivals, featured]);

  return (
    <div className="bg-background min-h-full">
      {/* Mobile — marketplace app layout */}
      <div className="md:hidden">
        <MarketplaceHomeHeader />
        <QuickActions />
        <CategoryCarousel categories={categories} />
        <BannerCarousel />
        <FlashSaleSection products={deals} />
        <div className="bg-surface mt-2 border-b border-border px-3 py-2.5">
          <h2 className="text-header text-[15px] font-bold tracking-wide uppercase">
            Daily Discover
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-0 px-1 pb-4">
          {feedProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      </div>

      {/* Desktop — Taobao-style layout */}
      <div className="hidden md:block">
        <TaobaoSearchHeader />
        <div className="mx-auto max-w-7xl px-4">
          <TaobaoHeroSection categories={categories} />
        </div>
        <TaobaoPromoGrid />
        <div className="mx-auto max-w-7xl px-4">
          <FlashSaleSection products={deals} />
          <div className="bg-surface mt-4 border-b border-border px-4 py-3">
            <h2 className="text-header text-base font-bold tracking-wide">
              Guess You Like
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3 py-4 lg:grid-cols-4 xl:grid-cols-5">
            {feedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 10} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
