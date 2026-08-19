import type { Category, Product, Review, Seller } from "@/types";
import { categoryImageUrl } from "@/lib/images";

/**
 * Catalog seed — empty for live aromza.store.
 * Categories remain as storefront structure until products are added via Supabase/admin.
 * Product, seller, and review arrays stay empty so demo inventory never appears in production.
 */
export const seedCategories: Category[] = [
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Apparel and accessories",
    imageUrl: categoryImageUrl("fashion"),
  },
  {
    id: "cat-home",
    name: "Home & Living",
    slug: "home-living",
    description: "Home essentials and decor",
    imageUrl: categoryImageUrl("home-living"),
  },
  {
    id: "cat-beauty",
    name: "Beauty",
    slug: "beauty",
    description: "Skincare and cosmetics",
    imageUrl: categoryImageUrl("beauty"),
  },
  {
    id: "cat-electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Tech and accessories",
    imageUrl: categoryImageUrl("electronics"),
  },
  {
    id: "cat-food",
    name: "Food & Gourmet",
    slug: "food-gourmet",
    description: "Foods and beverages",
    imageUrl: categoryImageUrl("food-gourmet"),
  },
  {
    id: "cat-jewelry",
    name: "Jewelry",
    slug: "jewelry",
    description: "Fine jewelry",
    imageUrl: categoryImageUrl("jewelry"),
  },
];

export const seedSellers: Seller[] = [];

export const seedProducts: Product[] = [];

export const seedReviews: Review[] = [];

export function getProductBySlug(slug: string): Product | undefined {
  return seedProducts.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return seedProducts.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return seedProducts.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsBySeller(sellerSlug: string): Product[] {
  const seller = seedSellers.find((s) => s.slug === sellerSlug);
  if (!seller) return [];
  return seedProducts.filter((p) => p.sellerId === seller.id);
}

export function searchProducts(
  query: string,
  filters: {
    category?: string;
    seller?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  } = {},
): { data: Product[]; total: number; page: number; limit: number; totalPages: number } {
  let results = [...seedProducts];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.seller.storeName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }

  if (filters.category) {
    results = results.filter((p) => p.categorySlug === filters.category);
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.minRating !== undefined) {
    results = results.filter((p) => p.rating >= filters.minRating!);
  }

  if (filters.inStock) {
    results = results.filter((p) => p.stock > 0);
  }

  if (filters.seller) {
    results = results.filter((p) => p.seller.slug === filters.seller);
  }

  switch (filters.sort) {
    case "newest":
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "popularity":
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "deals":
      results = results.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
      results.sort(
        (a, b) =>
          (b.compareAtPrice! - b.price) / b.compareAtPrice! -
          (a.compareAtPrice! - a.price) / a.compareAtPrice!,
      );
      break;
    default:
      break;
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = results.slice(start, start + limit);

  return { data, total, page, limit, totalPages };
}

function excludeIds(products: Product[], ids: Set<string>): Product[] {
  return products.filter((p) => !ids.has(p.id));
}

export function getFeaturedProducts(): Product[] {
  return seedProducts.filter((p) => p.rating >= 4.7).slice(0, 8);
}

export function getTrendingProducts(exclude: string[] = []): Product[] {
  const excluded = new Set(exclude);
  return excludeIds([...seedProducts].sort((a, b) => b.reviewCount - a.reviewCount), excluded)
    .slice(0, 8);
}

export function getNewArrivals(exclude: string[] = []): Product[] {
  const excluded = new Set(exclude);
  return excludeIds(
    [...seedProducts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
    excluded,
  ).slice(0, 8);
}

export function getDeals(exclude: string[] = []): Product[] {
  const excluded = new Set(exclude);
  return excludeIds(
    seedProducts.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price),
    excluded,
  ).slice(0, 8);
}

export function getProductReviewStats(productId: string): { count: number; average: number } {
  const reviews = seedReviews.filter((r) => r.productId === productId);
  if (reviews.length === 0) return { count: 0, average: 0 };
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { count: reviews.length, average };
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return seedProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categoryId === product.categoryId || p.sellerId === product.sellerId),
    )
    .slice(0, limit);
}

export function getReviewsForProduct(productId: string): Review[] {
  return seedReviews.filter((r) => r.productId === productId);
}

export function getSellerBySlug(slug: string): Seller | undefined {
  return seedSellers.find((s) => s.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return seedCategories.find((c) => c.slug === slug);
}

export function getSearchSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const suggestions = new Set<string>();

  seedProducts.forEach((p) => {
    if (p.title.toLowerCase().includes(q)) suggestions.add(p.title);
    if (p.categoryName.toLowerCase().includes(q)) suggestions.add(p.categoryName);
  });

  seedCategories.forEach((c) => {
    if (c.name.toLowerCase().includes(q)) suggestions.add(c.name);
  });

  return Array.from(suggestions).slice(0, 6);
}
