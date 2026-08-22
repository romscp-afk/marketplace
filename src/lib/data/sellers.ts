import { seedSellers } from "@/data/seed";
import { isSupabaseConfigured } from "@/lib/env";
import { getPublishedSellerBySlug, getPublishedSellers, getPublishedProductsBySellerSlug } from "@/lib/seller/workspace";
import type { Product, Seller } from "@/types";

export async function getStorefrontSellers(): Promise<Seller[]> {
  if (isSupabaseConfigured()) return seedSellers;
  return [...seedSellers, ...getPublishedSellers()];
}

export async function getStorefrontSellerBySlug(slug: string): Promise<Seller | undefined> {
  if (isSupabaseConfigured()) return seedSellers.find((seller) => seller.slug === slug);
  return seedSellers.find((seller) => seller.slug === slug) ?? getPublishedSellerBySlug(slug);
}

export async function getStorefrontProductsBySeller(slug: string): Promise<Product[]> {
  if (isSupabaseConfigured()) return [];
  return getPublishedProductsBySellerSlug(slug);
}
