import type { Category } from "@/types";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import * as seed from "@/data/seed";

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return seed.seedCategories;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data?.length) return seed.seedCategories;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
    parentId: row.parent_id ?? undefined,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  if (!isSupabaseConfigured()) return seed.getCategoryBySlug(slug);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return seed.getCategoryBySlug(slug);

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description ?? undefined,
    imageUrl: data.image_url ?? undefined,
    parentId: data.parent_id ?? undefined,
  };
}
