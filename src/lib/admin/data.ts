import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type {
  AdminStats,
  AdminApplication,
  AdminSeller,
  AdminProduct,
  AdminOrder,
  AdminCategory,
  CmsSection,
  AuditLogEntry,
  CommissionSettings,
} from "@/types/admin";
import type { SellerApplicationStatus, ProductStatus } from "@/types";
import * as mock from "@/lib/admin/mock-data";

export async function getAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured()) return mock.getMockAdminStats();

  const supabase = await createClient();
  const [{ count: pendingApps }, { count: inReview }, { count: activeSellers }] =
    await Promise.all([
      supabase
        .from("seller_applications")
        .select("*", { count: "exact", head: true })
        .in("status", ["submitted", "under_review"]),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "review"),
      supabase
        .from("sellers")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
    ]);

  return {
    pendingApplications: pendingApps ?? 0,
    productsInReview: inReview ?? 0,
    ordersToday: 0,
    totalRevenue: 0,
    activeSellers: activeSellers ?? 0,
    openDisputes: 0,
  };
}

export async function getAdminApplications(): Promise<AdminApplication[]> {
  if (!isSupabaseConfigured()) return mock.getMockApplications();

  const supabase = await createClient();
  const { data } = await supabase
    .from("seller_applications")
    .select("*, profiles(email, first_name, last_name)")
    .order("created_at", { ascending: false });

  if (!data) return mock.getMockApplications();

  return data.map((row) => {
    const profile = row.profiles as Record<string, string> | null;
    return {
      id: row.id,
      userId: row.user_id,
      applicantEmail: profile?.email ?? "",
      applicantName: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Unknown",
      status: row.status as SellerApplicationStatus,
      storeName: row.store_name,
      storeDescription: row.store_description ?? undefined,
      businessName: row.business_name ?? undefined,
      categories: (row.categories as string[]) ?? [],
      submittedAt: row.submitted_at ?? undefined,
      createdAt: row.created_at,
    };
  });
}

export async function getAdminApplication(id: string): Promise<AdminApplication | undefined> {
  if (!isSupabaseConfigured()) return mock.getMockApplication(id);

  const apps = await getAdminApplications();
  return apps.find((a) => a.id === id);
}

export async function getAdminSellers(): Promise<AdminSeller[]> {
  if (!isSupabaseConfigured()) return mock.getMockSellers();

  const supabase = await createClient();
  const { data } = await supabase
    .from("sellers")
    .select("*, stores(name, slug), profiles!sellers_owner_id_fkey(email)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (!data) return mock.getMockSellers();

  return data.map((row) => {
    const store = row.stores as Record<string, string> | null;
    const profile = row.profiles as Record<string, string> | null;
    return {
      id: row.id,
      storeName: store?.name ?? "",
      slug: store?.slug ?? "",
      ownerEmail: profile?.email ?? "",
      status: row.status,
      isVerified: row.is_verified,
      productCount: row.product_count,
      commissionRate: Number(row.commission_rate),
      createdAt: row.created_at,
    };
  });
}

export async function getAdminProducts(status?: ProductStatus): Promise<AdminProduct[]> {
  if (!isSupabaseConfigured()) {
    return status === "review" ? mock.getMockProductsForReview() : mock.getMockAllProducts();
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, sellers(stores(name)), product_images(url)")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data } = await query;
  if (!data) return mock.getMockAllProducts();

  return data.map((row) => {
    const seller = row.sellers as { stores: { name: string } } | null;
    const images = row.product_images as { url: string }[] | null;
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      sellerName: seller?.stores?.name ?? "",
      sellerId: row.seller_id,
      status: row.status as ProductStatus,
      price: Number(row.price),
      stock: row.stock,
      submittedAt: row.updated_at,
      imageUrl: images?.[0]?.url,
    };
  });
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured()) return mock.getMockOrders();

  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (!data) return mock.getMockOrders();

  return data.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    customerEmail: row.guest_email ?? "—",
    status: row.status,
    total: Number(row.total),
    sellerCount: 0,
    createdAt: row.created_at,
  }));
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  if (!isSupabaseConfigured()) return mock.getMockCategories();

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (!data) return mock.getMockCategories();

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    productCount: 0,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  }));
}

export async function getCmsSections(): Promise<CmsSection[]> {
  if (!isSupabaseConfigured()) return mock.getMockCmsSections();
  return mock.getMockCmsSections();
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  if (!isSupabaseConfigured()) return mock.getMockAuditLogs();

  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*, profiles(email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!data) return mock.getMockAuditLogs();

  return data.map((row) => {
    const profile = row.profiles as { email: string } | null;
    return {
      id: row.id,
      actorEmail: profile?.email ?? "system",
      action: row.action,
      resource: row.resource,
      resourceId: row.resource_id ?? undefined,
      summary: `${row.action} on ${row.resource}`,
      createdAt: row.created_at,
    };
  });
}

export async function getCommissionSettings(): Promise<CommissionSettings> {
  if (!isSupabaseConfigured()) return mock.getMockCommission();

  const supabase = await createClient();
  const { data } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "commission")
    .single();

  if (!data?.value) return mock.getMockCommission();

  const val = data.value as { default_rate?: number; minimum_payout?: number };
  return {
    defaultRate: val.default_rate ?? 0.1,
    minimumPayout: val.minimum_payout ?? 25,
  };
}
