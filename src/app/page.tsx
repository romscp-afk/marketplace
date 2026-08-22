import Link from "next/link";
import type { Product } from "@/types";
import {
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getDeals,
} from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { getStorefrontSellers } from "@/lib/data/sellers";
import { ProductCard } from "@/components/product/product-card";
import { QuickActions } from "@/components/marketplace/quick-actions";
import { CategoryCarousel } from "@/components/marketplace/category-carousel";
import { BannerCarousel } from "@/components/marketplace/banner-carousel";
import { FlashSaleSection } from "@/components/marketplace/flash-sale-section";
import { MarketplaceHomeHeader } from "@/components/marketplace/home-header";
import { MicHeroSection } from "@/components/marketplace/mic/hero-section";
import { TrendingStrip } from "@/components/marketplace/mic/trending-strip";
import { SupplierStrip } from "@/components/marketplace/mic/supplier-strip";
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
  const sellers = await getStorefrontSellers();

  const feedProducts = mergeFeedProducts([deals, trending, newArrivals, featured]);
  const recommendations = mergeFeedProducts([featured, trending, deals]).slice(0, 6);

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
        {feedProducts.length === 0 ? (
          <p className="text-muted px-6 py-12 text-center text-sm">
            Products are coming soon. Check back shortly.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-0 px-1 pb-4">
            {feedProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop — Made-in-China style filling layout */}
      <div className="hidden md:block">
        <TaobaoSearchHeader />
        <div className="bg-[#F3F4F6]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-3 py-3">
            <MicHeroSection categories={categories} recommendations={recommendations} />
            <TrendingStrip categories={categories} />
            <SupplierStrip sellers={sellers} />
          </div>
        </div>
        <TaobaoPromoGrid />
        <div className="bg-[#F3F4F6]">
          <div className="mx-auto max-w-[1200px] px-3 pb-6">
            <FlashSaleSection products={deals} />
            <div className="bg-surface mt-3 rounded-sm border border-border">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-base font-bold text-foreground">Recommended For You</h2>
                <Link href="/search" className="text-primary text-xs font-medium hover:underline">
                  More ›
                </Link>
              </div>
              {feedProducts.length === 0 ? (
                <p className="text-muted py-16 text-center text-sm">
                  Products are coming soon. Sellers are being onboarded to Aromza.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 p-2 lg:grid-cols-4 xl:grid-cols-5">
                  {feedProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={i < 10}
                      className="m-0 rounded-sm border border-border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
