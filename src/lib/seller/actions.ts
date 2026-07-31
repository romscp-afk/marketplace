"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { slugify, generateId } from "@/lib/utils";
import { getSellerApplication } from "@/lib/seller/session";
import * as mock from "@/lib/seller/mock-data";
import type { SellerProduct } from "@/types/seller";
import type { ProductStatus } from "@/types";

export type ActionResult =
  | { success: true; id?: string }
  | { success: false; error: string };

const applicationSchema = z.object({
  storeName: z.string().min(2, "Store name required"),
  storeDescription: z.string().min(20, "Description must be at least 20 characters"),
  businessName: z.string().min(2, "Business name required"),
  businessRegistration: z.string().optional(),
  ownerFirstName: z.string().min(1, "Owner first name required"),
  ownerLastName: z.string().min(1, "Owner last name required"),
  contactEmail: z.string().email("Valid contact email required"),
  contactPhoneCountryCode: z.string().min(1),
  contactPhone: z.string().min(6, "Contact phone required"),
  addressLine1: z.string().min(1, "Business address required"),
  addressCity: z.string().min(1, "City required"),
  addressPostalCode: z.string().min(1, "Postal code required"),
  addressCountry: z.string().min(1),
  payoutMethod: z.enum(["bank_transfer", "paynow"]),
  payoutAccountName: z.string().min(2, "Payout account name required"),
  payoutAccountReference: z.string().min(4, "Payout reference required"),
  termsVersion: z.string().min(1),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

const productSchema = z.object({
  title: z.string().min(2, "Title required"),
  description: z.string().min(10, "Description required"),
  categoryId: z.string().min(1, "Category required"),
  price: z.coerce.number().min(0.01, "Price required"),
  compareAtPrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  status: z.enum(["draft", "review", "active", "archived", "out_of_stock"]),
});

export async function submitSellerApplication(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireAuth("/account/login?redirect=/seller/apply");

  const categories = formData.getAll("categories") as string[];
  const parsed = applicationSchema.safeParse({
    storeName: formData.get("storeName"),
    storeDescription: formData.get("storeDescription"),
    businessName: formData.get("businessName"),
    businessRegistration: formData.get("businessRegistration") || undefined,
    ownerFirstName: formData.get("ownerFirstName"),
    ownerLastName: formData.get("ownerLastName"),
    contactEmail: formData.get("contactEmail"),
    contactPhoneCountryCode: formData.get("contactPhoneCountryCode"),
    contactPhone: formData.get("contactPhone"),
    addressLine1: formData.get("addressLine1"),
    addressCity: formData.get("addressCity"),
    addressPostalCode: formData.get("addressPostalCode"),
    addressCountry: formData.get("addressCountry"),
    payoutMethod: formData.get("payoutMethod"),
    payoutAccountName: formData.get("payoutAccountName"),
    payoutAccountReference: formData.get("payoutAccountReference"),
    termsVersion: formData.get("termsVersion"),
    categories,
    termsAccepted: formData.get("termsAccepted") === "true",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  if (!isSupabaseConfigured()) {
    mock.saveMockApplication({
      id: "mock-app-1",
      userId: user.id,
      status: "submitted",
      storeName: parsed.data.storeName,
      storeDescription: parsed.data.storeDescription,
      businessName: parsed.data.businessName,
      businessRegistration: parsed.data.businessRegistration,
      categories: parsed.data.categories,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    revalidatePath("/seller/apply/status");
    redirect("/seller/apply/status");
  }

  const supabase = await createClient();
  const existing = await getSellerApplication(user.id);

  const payload = {
    user_id: user.id,
    status: "submitted" as const,
    store_name: parsed.data.storeName,
    store_description: parsed.data.storeDescription,
    business_name: parsed.data.businessName,
    business_registration: parsed.data.businessRegistration,
    categories: parsed.data.categories,
    submitted_at: new Date().toISOString(),
  };

  const { error } = existing
    ? await supabase.from("seller_applications").update(payload).eq("id", existing.id)
    : await supabase.from("seller_applications").insert(payload);

  if (error) return { success: false, error: error.message };

  await supabase.from("user_roles").upsert(
    { user_id: user.id, role: "seller_applicant" },
    { onConflict: "user_id,role,seller_id" },
  );

  revalidatePath("/seller/apply/status");
  redirect("/seller/apply/status");
}

export async function saveSellerProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireAuth();
  const productId = formData.get("productId") as string | null;

  const parsed = productSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    costPrice: formData.get("costPrice") || undefined,
    sku: formData.get("sku") || undefined,
    stock: formData.get("stock"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const slug = slugify(parsed.data.title);
  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const product: SellerProduct = {
      id: productId ?? generateId(),
      sellerId: mock.MOCK_SELLER.id,
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      price: parsed.data.price,
      compareAtPrice: parsed.data.compareAtPrice,
      costPrice: parsed.data.costPrice,
      currency: "USD",
      sku: parsed.data.sku,
      stock: parsed.data.stock,
      status: parsed.data.status as ProductStatus,
      categoryId: parsed.data.categoryId,
      categoryName: "Fashion",
      createdAt: now,
      updatedAt: now,
    };
    mock.saveMockProduct(product);
    revalidatePath("/seller/products");
    redirect(productId ? `/seller/products/${productId}/edit` : "/seller/products");
  }

  // Supabase path — requires approved seller
  const supabase = await createClient();
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!seller) return { success: false, error: "Seller account not found" };

  const payload = {
    seller_id: seller.id,
    category_id: parsed.data.categoryId,
    title: parsed.data.title,
    slug,
    description: parsed.data.description,
    price: parsed.data.price,
    compare_at_price: parsed.data.compareAtPrice ?? null,
    cost_price: parsed.data.costPrice ?? null,
    sku: parsed.data.sku ?? null,
    stock: parsed.data.stock,
    status: parsed.data.status,
    updated_at: now,
  };

  if (productId) {
    const { error } = await supabase.from("products").update(payload).eq("id", productId);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/seller/products");
  redirect("/seller/products");
}

export async function updateOrderStatus(
  subOrderId: string,
  status: "accepted" | "processing" | "shipped" | "delivered" | "cancelled",
): Promise<ActionResult> {
  await requireAuth();

  if (!isSupabaseConfigured()) {
    revalidatePath("/seller/orders");
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("seller_sub_orders")
    .update({ status })
    .eq("id", subOrderId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/seller/orders");
  revalidatePath(`/seller/orders/${subOrderId}`);
  return { success: true };
}

export async function updateStoreProfile(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) return { success: false, error: "Store name required" };

  if (!isSupabaseConfigured()) {
    mock.MOCK_SELLER.store.name = name;
    mock.MOCK_SELLER.store.description = description;
    revalidatePath("/seller/store");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: seller } = await supabase
    .from("sellers")
    .select("id, stores(id)")
    .eq("owner_id", (await requireAuth()).id)
    .single();

  if (!seller) return { success: false, error: "Seller not found" };

  const store = seller.stores as { id: string } | { id: string }[] | null;
  const storeId = Array.isArray(store) ? store[0]?.id : store?.id;

  if (!storeId) return { success: false, error: "Store not found" };

  const { error } = await supabase
    .from("stores")
    .update({ name, description, slug: slugify(name) })
    .eq("id", storeId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/seller/store");
  return { success: true };
}
