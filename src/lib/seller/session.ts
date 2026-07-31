import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { getUser, requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { SellerPortalContext, SellerApplication, SellerRecord } from "@/types/seller";
import * as mock from "@/lib/seller/mock-data";
import type { SellerApplicationStatus } from "@/types";

function mapApplication(row: Record<string, unknown>): SellerApplication {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    status: row.status as SellerApplicationStatus,
    storeName: row.store_name as string,
    storeDescription: (row.store_description as string) ?? undefined,
    businessName: (row.business_name as string) ?? undefined,
    businessRegistration: (row.business_registration as string) ?? undefined,
    categories: (row.categories as string[]) ?? [],
    adminNotes: (row.admin_notes as string) ?? undefined,
    submittedAt: (row.submitted_at as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapSeller(row: Record<string, unknown>): SellerRecord {
  const store = row.stores as Record<string, unknown> | null;
  return {
    id: row.id as string,
    ownerId: row.owner_id as string,
    status: row.status as SellerRecord["status"],
    commissionRate: Number(row.commission_rate),
    isVerified: Boolean(row.is_verified),
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    productCount: Number(row.product_count),
    store: {
      id: (store?.id as string) ?? "",
      name: (store?.name as string) ?? "",
      slug: (store?.slug as string) ?? "",
      description: (store?.description as string) ?? undefined,
      logoUrl: (store?.logo_url as string) ?? undefined,
      bannerUrl: (store?.banner_url as string) ?? undefined,
    },
  };
}

export async function getSellerPortalContext(): Promise<SellerPortalContext | null> {
  if (!isSupabaseConfigured()) {
    const user = await getUser();
    if (!user) return null;
    return mock.getMockSellerContext(user.id);
  }

  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data: application } = await supabase
    .from("seller_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: seller } = await supabase
    .from("sellers")
    .select("*, stores(*)")
    .eq("owner_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  const isApprovedSeller =
    seller?.status === "active" ||
    user.roles.includes("seller_owner") ||
    user.roles.includes("seller_staff");

  return {
    userId: user.id,
    email: user.email,
    isSeller: isApprovedSeller || !!application,
    isApprovedSeller,
    application: application ? mapApplication(application) : undefined,
    seller: seller ? mapSeller(seller as Record<string, unknown>) : undefined,
  };
}

export async function requireSellerPortal() {
  const user = await requireAuth("/account/login?redirect=/seller");
  const ctx = await getSellerPortalContext();

  if (!ctx) {
    if (!isSupabaseConfigured()) {
      return { user, context: mock.getMockSellerContext(user.id) };
    }
    redirect("/seller/apply");
  }

  return { user, context: ctx };
}

export async function requireApprovedSeller() {
  const { user, context } = await requireSellerPortal();

  if (!context.isApprovedSeller) {
    redirect("/seller/apply/status");
  }

  if (!context.seller) {
    if (!isSupabaseConfigured()) {
      return { user, context: { ...context, seller: mock.MOCK_SELLER } };
    }
    redirect("/seller/apply/status");
  }

  return { user, context: context as SellerPortalContext & { seller: SellerRecord } };
}

export async function getSellerApplication(userId: string): Promise<SellerApplication | undefined> {
  if (!isSupabaseConfigured()) return mock.getMockApplication(userId);

  const supabase = await createClient();
  const { data } = await supabase
    .from("seller_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ? mapApplication(data) : undefined;
}
