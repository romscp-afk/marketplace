import {
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getDeals,
} from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { getStorefrontSellers } from "@/lib/data/sellers";
import { brand } from "@/config/brand";
import { marketplaceUi } from "@/config/marketplace-ui";
import {
  mobileJsonResponse,
  mobileOptionsResponse,
} from "@/lib/api/mobile";

export async function OPTIONS() {
  return mobileOptionsResponse();
}

export async function GET() {
  const featured = await getFeaturedProducts();
  const featuredIds = featured.map((p) => p.id);
  const trending = await getTrendingProducts(featuredIds);
  const trendingIds = [...featuredIds, ...trending.map((p) => p.id)];
  const newArrivals = await getNewArrivals(trendingIds);
  const dealExclude = [...trendingIds, ...newArrivals.map((p) => p.id)];
  const deals = await getDeals(dealExclude);
  const categories = await getCategories();

  return mobileJsonResponse({
    brand: {
      name: brand.name,
      tagline: brand.tagline,
      locale: brand.locale,
      delivery: brand.delivery,
      theme: brand.theme,
      announcement: brand.announcement,
    },
    ui: marketplaceUi,
    sections: {
      featured,
      trending,
      newArrivals,
      deals,
    },
    categories,
    sellers: (await getStorefrontSellers()).slice(0, 3),
  });
}
