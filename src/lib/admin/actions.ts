"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { requireAdmin, requireSuperAdmin } from "@/lib/admin/session";
import { createClient } from "@/lib/supabase/server";
import { createServiceClientSafe } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import * as mock from "@/lib/admin/mock-data";
import type { CommissionSettings } from "@/types/admin";

export type AdminActionResult =
  | { success: true }
  | { success: false; error: string };

async function recordAuditLog(params: {
  actorId: string;
  actorEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  summary: string;
  oldValue?: unknown;
  newValue?: unknown;
}) {
  if (!isSupabaseConfigured()) {
    mock.addMockAuditLog({
      actorEmail: params.actorEmail,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      summary: params.summary,
    });
    return;
  }

  const service = createServiceClientSafe();
  const client = service ?? await createClient();

  await client.from("audit_logs").insert({
    actor_id: params.actorId,
    action: params.action,
    resource: params.resource,
    resource_id: params.resourceId,
    old_value: params.oldValue ?? null,
    new_value: params.newValue ?? null,
  });
}

export async function approveApplication(applicationId: string): Promise<AdminActionResult> {
  const { user, context } = await requireAdmin();

  if (!isSupabaseConfigured()) {
    mock.updateMockApplication(applicationId, { status: "approved" });
    mock.addMockAuditLog({
      actorEmail: context.email,
      action: "seller_application.approved",
      resource: "seller_applications",
      resourceId: applicationId,
      summary: `Approved seller application ${applicationId}`,
    });
    revalidatePath("/admin/applications");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: app } = await supabase
    .from("seller_applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (!app) return { success: false, error: "Application not found" };

  await supabase
    .from("seller_applications")
    .update({ status: "approved", reviewed_at: new Date().toISOString(), reviewed_by: user.id })
    .eq("id", applicationId);

  const { data: seller } = await supabase
    .from("sellers")
    .insert({
      owner_id: app.user_id,
      application_id: app.id,
      status: "active",
      is_verified: true,
    })
    .select("id")
    .single();

  if (seller) {
    await supabase.from("stores").insert({
      seller_id: seller.id,
      name: app.store_name,
      slug: slugify(app.store_name),
      description: app.store_description,
    });

    await supabase.from("user_roles").upsert({
      user_id: app.user_id,
      role: "seller_owner",
      seller_id: seller.id,
      granted_by: user.id,
    });
  }

  await recordAuditLog({
    actorId: user.id,
    actorEmail: context.email,
    action: "seller_application.approved",
    resource: "seller_applications",
    resourceId: applicationId,
    summary: `Approved application for ${app.store_name}`,
    oldValue: { status: app.status },
    newValue: { status: "approved" },
  });

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function rejectApplication(
  applicationId: string,
  reason: string,
): Promise<AdminActionResult> {
  const { user, context } = await requireAdmin();

  if (!reason.trim()) return { success: false, error: "Rejection reason required" };

  if (!isSupabaseConfigured()) {
    mock.updateMockApplication(applicationId, { status: "rejected" });
    mock.addMockAuditLog({
      actorEmail: context.email,
      action: "seller_application.rejected",
      resource: "seller_applications",
      resourceId: applicationId,
      summary: `Rejected application: ${reason}`,
    });
    revalidatePath("/admin/applications");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: app } = await supabase
    .from("seller_applications")
    .select("status, store_name")
    .eq("id", applicationId)
    .single();

  await supabase
    .from("seller_applications")
    .update({
      status: "rejected",
      admin_notes: reason,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", applicationId);

  await recordAuditLog({
    actorId: user.id,
    actorEmail: context.email,
    action: "seller_application.rejected",
    resource: "seller_applications",
    resourceId: applicationId,
    summary: `Rejected application for ${app?.store_name}: ${reason}`,
    oldValue: { status: app?.status },
    newValue: { status: "rejected", reason },
  });

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function moderateProduct(
  productId: string,
  decision: "approved" | "rejected",
  reason?: string,
): Promise<AdminActionResult> {
  const { user, context } = await requireAdmin();

  const newStatus = decision === "approved" ? "active" : "rejected";

  if (!isSupabaseConfigured()) {
    mock.updateMockProduct(productId, newStatus);
    mock.addMockAuditLog({
      actorEmail: context.email,
      action: `product.${decision}`,
      resource: "products",
      resourceId: productId,
      summary: `Product ${decision}${reason ? `: ${reason}` : ""}`,
    });
    revalidatePath("/admin/products");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("status, title")
    .eq("id", productId)
    .single();

  await supabase.from("products").update({ status: newStatus }).eq("id", productId);

  await recordAuditLog({
    actorId: user.id,
    actorEmail: context.email,
    action: `product.${decision}`,
    resource: "products",
    resourceId: productId,
    summary: `${decision === "approved" ? "Approved" : "Rejected"} product: ${product?.title}`,
    oldValue: { status: product?.status },
    newValue: { status: newStatus, reason },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateSellerStatus(
  sellerId: string,
  status: "active" | "suspended" | "closed",
): Promise<AdminActionResult> {
  const { user, context } = await requireAdmin();

  if (!isSupabaseConfigured()) {
    mock.updateMockSeller(sellerId, { status });
    mock.addMockAuditLog({
      actorEmail: context.email,
      action: "seller.status_updated",
      resource: "sellers",
      resourceId: sellerId,
      summary: `Updated seller status to ${status}`,
    });
    revalidatePath("/admin/sellers");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: seller } = await supabase
    .from("sellers")
    .select("status")
    .eq("id", sellerId)
    .single();

  await supabase.from("sellers").update({ status }).eq("id", sellerId);

  await recordAuditLog({
    actorId: user.id,
    actorEmail: context.email,
    action: "seller.status_updated",
    resource: "sellers",
    resourceId: sellerId,
    summary: `Changed seller status to ${status}`,
    oldValue: { status: seller?.status },
    newValue: { status },
  });

  revalidatePath("/admin/sellers");
  return { success: true };
}

const commissionSchema = z.object({
  defaultRate: z.coerce.number().min(0).max(1),
  minimumPayout: z.coerce.number().min(0),
});

export async function updateCommissionSettings(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const { user, context } = await requireSuperAdmin();

  const parsed = commissionSchema.safeParse({
    defaultRate: formData.get("defaultRate"),
    minimumPayout: formData.get("minimumPayout"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const settings: CommissionSettings = {
    defaultRate: parsed.data.defaultRate,
    minimumPayout: parsed.data.minimumPayout,
  };

  if (!isSupabaseConfigured()) {
    mock.updateMockCommission(settings);
    mock.addMockAuditLog({
      actorEmail: context.email,
      action: "commission.updated",
      resource: "platform_settings",
      summary: `Updated commission rate to ${(settings.defaultRate * 100).toFixed(0)}%`,
    });
    revalidatePath("/admin/commissions");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", "commission")
    .single();

  await supabase.from("platform_settings").upsert({
    key: "commission",
    value: {
      default_rate: settings.defaultRate,
      minimum_payout: settings.minimumPayout,
    },
    updated_by: user.id,
  });

  await recordAuditLog({
    actorId: user.id,
    actorEmail: context.email,
    action: "commission.updated",
    resource: "platform_settings",
    summary: `Updated default commission to ${(settings.defaultRate * 100).toFixed(0)}%`,
    oldValue: existing?.value,
    newValue: settings,
  });

  revalidatePath("/admin/commissions");
  return { success: true };
}

export async function toggleCmsSection(
  sectionId: string,
  enabled: boolean,
): Promise<AdminActionResult> {
  const { context } = await requireAdmin();

  if (!isSupabaseConfigured()) {
    mock.updateMockCmsSection(sectionId, { enabled });
    mock.addMockAuditLog({
      actorEmail: context.email,
      action: "cms.section_toggled",
      resource: "cms_sections",
      resourceId: sectionId,
      summary: `${enabled ? "Enabled" : "Disabled"} CMS section`,
    });
    revalidatePath("/admin/cms");
    revalidatePath("/");
    return { success: true };
  }

  revalidatePath("/admin/cms");
  return { success: true };
}

export async function saveCategory(
  _prev: AdminActionResult | null,
  formData: FormData,
): Promise<AdminActionResult> {
  const { context } = await requireAdmin();

  const name = formData.get("name") as string;
  const slug = slugify(name);
  const categoryId = formData.get("categoryId") as string | null;
  const isActive = formData.get("isActive") === "true";

  if (!name?.trim()) return { success: false, error: "Category name required" };

  if (!isSupabaseConfigured()) {
    if (categoryId) {
      const cats = mock.getMockCategories();
      const cat = cats.find((c) => c.id === categoryId);
      if (cat) mock.saveMockCategory({ ...cat, name, slug, isActive });
    } else {
      mock.saveMockCategory({
        id: `cat-${Date.now()}`,
        name,
        slug,
        productCount: 0,
        isActive,
        sortOrder: mock.getMockCategories().length + 1,
      });
    }
    mock.addMockAuditLog({
      actorEmail: context.email,
      action: categoryId ? "category.updated" : "category.created",
      resource: "categories",
      summary: `${categoryId ? "Updated" : "Created"} category: ${name}`,
    });
    revalidatePath("/admin/categories");
    return { success: true };
  }

  const supabase = await createClient();
  if (categoryId) {
    await supabase.from("categories").update({ name, slug, is_active: isActive }).eq("id", categoryId);
  } else {
    await supabase.from("categories").insert({ name, slug, is_active: isActive });
  }

  revalidatePath("/admin/categories");
  return { success: true };
}
