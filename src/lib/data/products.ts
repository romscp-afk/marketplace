import type { Product, PaginatedResult, SearchFilters } from "@/types";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import * as seed from "@/data/seed";

function mapDbProduct(row: Record<string, unknown>): Product {
  const store = row.stores as Record<string, unknown> | null;
  const seller = row.sellers as Record<string, unknown> | null;
  const category = row.categories as Record<string, unknown> | null;
  const images = (row.product_images as { url: string; sort_order: number }[] | null) ?? [];

  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: (row.description as string) ?? "",
    shortDescription: (row.short_description as string) ?? undefined,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    currency: (row.currency as string) ?? "USD",
    images: images.sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url),
    categoryId: row.category_id as string,
    categoryName: (category?.name as string) ?? "",
    categorySlug: (category?.slug as string) ?? "",
    sellerId: row.seller_id as string,
    seller: {
      id: (seller?.id as string) ?? "",
      storeName: (store?.name as string) ?? "",
      slug: (store?.slug as string) ?? "",
      rating: Number(seller?.rating ?? 0),
      reviewCount: Number(seller?.review_count ?? 0),
      isVerified: Boolean(seller?.is_verified),
    },
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    stock: Number(row.stock ?? 0),
    status: row.status as Product["status"],
    isReturnEligible: Boolean(row.is_return_eligible),
    deliveryEstimateDays: {
      min: Number(row.delivery_estimate_min ?? 3),
      max: Number(row.delivery_estimate_max ?? 7),
    },
    deliveryFee: row.delivery_fee ? Number(row.delivery_fee) : undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getProducts(
  filters: SearchFilters = {},
): Promise<PaginatedResult<Product>> {
  if (!isSupabaseConfigured()) {
    const result = seed.searchProducts(filters.query ?? "", filters);
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories(name, slug),
      sellers(id, rating, review_count, is_verified),
      stores(name, slug),
      product_images(url, sort_order)
    `,
      { count: "exact" },
    )
    .eq("status", "active")
    .is("deleted_at", null);

  if (filters.query) {
    query = query.ilike("title", `%${filters.query}%`);
  }
  if (filters.category) {
    query = query.eq("categories.slug", filters.category);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters.inStock) {
    query = query.gt("stock", 0);
  }

  const sort = filters.sort ?? "newest";
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "popularity":
      query = query.order("review_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data, count, error } = await query;

  if (error || !data) {
    const fallback = seed.searchProducts(filters.query ?? "", filters);
    return {
      data: fallback.data,
      total: fallback.total,
      page: fallback.page,
      limit: fallback.limit,
      totalPages: fallback.totalPages,
    };
  }

  const total = count ?? 0;
  return {
    data: data.map((row) => mapDbProduct(row as Record<string, unknown>)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return seed.getProductBySlug(slug);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(name, slug),
      sellers(id, rating, review_count, is_verified),
      stores(name, slug),
      product_images(url, sort_order),
      product_variants(*)
    `,
    )
    .eq("slug", slug)
    .eq("status", "active")
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    return seed.getProductBySlug(slug);
  }

  const product = mapDbProduct(data as Record<string, unknown>);
  const variants = (data as { product_variants?: Record<string, unknown>[] }).product_variants;

  if (variants?.length) {
    product.variants = variants.map((v) => ({
      id: v.id as string,
      productId: v.product_id as string,
      name: v.name as string,
      sku: v.sku as string,
      price: Number(v.price),
      compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
      stock: Number(v.stock),
      attributes: (v.attributes as Record<string, string>) ?? {},
      imageUrl: v.image_url as string | undefined,
    }));
  }

  return product;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return seed.getFeaturedProducts();
  const { data } = await getProducts({ sort: "rating", limit: 8 });
  return data;
}

export async function getTrendingProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return seed.getTrendingProducts();
  const { data } = await getProducts({ sort: "popularity", limit: 8 });
  return data;
}

export async function getNewArrivals(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return seed.getNewArrivals();
  const { data } = await getProducts({ sort: "newest", limit: 8 });
  return data;
}

export async function getDeals(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return seed.getDeals();
  const { data } = await getProducts({ sort: "deals", limit: 8 });
  return data.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!isSupabaseConfigured()) return seed.getRelatedProducts(product, limit);
  const { data } = await getProducts({ category: product.categorySlug, limit });
  return data.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) return seed.getProductsByCategory(categorySlug);
  const { data } = await getProducts({ category: categorySlug, limit: 48 });
  return data;
}
