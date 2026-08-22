import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type {
  SellerProduct,
  SellerOrder,
  SellerOrderDetail,
  SellerStats,
  SellerPayout,
} from "@/types/seller";
import type { ProductStatus, SellerSubOrderStatus } from "@/types";
import * as mock from "@/lib/seller/mock-data";
import * as commerceMock from "@/lib/commerce/mock-orders";

function mapProduct(row: Record<string, unknown>): SellerProduct {
  const category = row.categories as { name: string } | null;
  const images = row.product_images as { url: string }[] | null;

  return {
    id: row.id as string,
    sellerId: row.seller_id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: (row.description as string) ?? undefined,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    costPrice: row.cost_price ? Number(row.cost_price) : undefined,
    currency: (row.currency as string) ?? "USD",
    sku: (row.sku as string) ?? undefined,
    stock: Number(row.stock),
    status: row.status as ProductStatus,
    categoryId: row.category_id as string,
    categoryName: category?.name ?? "",
    imageUrl: images?.[0]?.url,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function getSellerStats(sellerId: string): Promise<SellerStats> {
  if (!isSupabaseConfigured()) {
    const { getWorkspaceBySellerId } = await import("@/lib/seller/workspace");
    const workspace = getWorkspaceBySellerId(sellerId);
    const products = workspace?.products ?? [];
    return {
      totalSales: 0,
      ordersThisMonth: 0,
      activeProducts: products.filter((product) => product.status === "active").length,
      lowStockCount: products.filter((product) => product.stock > 0 && product.stock <= 5).length,
      pendingOrders: 0,
      rating: workspace?.seller.rating ?? 0,
    };
  }

  const supabase = await createClient();

  const [{ count: activeProducts }, { count: lowStock }, { count: pendingOrders }] =
    await Promise.all([
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", sellerId)
        .eq("status", "active"),
      supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", sellerId)
        .gt("stock", 0)
        .lte("stock", 5),
      supabase
        .from("seller_sub_orders")
        .select("*", { count: "exact", head: true })
        .eq("seller_id", sellerId)
        .eq("status", "pending"),
    ]);

  const { data: seller } = await supabase
    .from("sellers")
    .select("rating")
    .eq("id", sellerId)
    .single();

  return {
    totalSales: 0,
    ordersThisMonth: 0,
    activeProducts: activeProducts ?? 0,
    lowStockCount: lowStock ?? 0,
    pendingOrders: pendingOrders ?? 0,
    rating: Number(seller?.rating ?? 0),
  };
}

export async function getSellerProducts(sellerId: string): Promise<SellerProduct[]> {
  if (!isSupabaseConfigured()) {
    const { getWorkspaceProducts } = await import("@/lib/seller/workspace");
    return getWorkspaceProducts(sellerId);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name), product_images(url)")
    .eq("seller_id", sellerId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error || !data) return mock.getMockProducts();
  return data.map((row) => mapProduct(row as Record<string, unknown>));
}

export async function getSellerProduct(
  sellerId: string,
  productId: string,
): Promise<SellerProduct | undefined> {
  if (!isSupabaseConfigured()) {
    const { getWorkspaceProduct } = await import("@/lib/seller/workspace");
    return getWorkspaceProduct(sellerId, productId);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(name), product_images(url)")
    .eq("seller_id", sellerId)
    .eq("id", productId)
    .single();

  return data ? mapProduct(data as Record<string, unknown>) : mock.getMockProduct(productId);
}

export async function getSellerOrders(sellerId: string): Promise<SellerOrder[]> {
  if (!isSupabaseConfigured()) {
    return commerceMock.getMockSubOrdersForSeller(sellerId).map(({ order, subOrder }) => ({
      id: subOrder.id,
      orderNumber: order.orderNumber,
      subOrderId: subOrder.id,
      status: subOrder.status,
      customerName: order.shippingAddress.firstName
        ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.trim()
        : "Customer",
      itemCount: subOrder.items.length,
      subtotal: subOrder.subtotal,
      commission: subOrder.commission,
      createdAt: order.createdAt,
    }));
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("seller_sub_orders")
    .select("*, orders(order_number, created_at, shipping_address)")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (!data) return mock.getMockOrders();

  return data.map((row) => {
    const order = row.orders as Record<string, unknown>;
    const address = order.shipping_address as Record<string, string> | null;
    return {
      id: row.id as string,
      orderNumber: order.order_number as string,
      subOrderId: row.id as string,
      status: row.status as SellerSubOrderStatus,
      customerName: address
        ? `${address.firstName ?? ""} ${address.lastName ?? ""}`.trim() || "Customer"
        : "Customer",
      itemCount: 0,
      subtotal: Number(row.subtotal),
      commission: Number(row.commission),
      createdAt: row.created_at as string,
    };
  });
}

export async function getSellerOrderDetail(
  sellerId: string,
  subOrderId: string,
): Promise<SellerOrderDetail | undefined> {
  if (!isSupabaseConfigured()) return undefined;

  const supabase = await createClient();
  const { data } = await supabase
    .from("seller_sub_orders")
    .select("*, orders(order_number, shipping_address), order_items(*)")
    .eq("seller_id", sellerId)
    .eq("id", subOrderId)
    .single();

  if (!data) return mock.getMockOrder(subOrderId);

  const order = data.orders as Record<string, unknown>;
  const address = (order.shipping_address as Record<string, string>) ?? {};
  const items = (data.order_items as Record<string, unknown>[]) ?? [];

  return {
    id: data.id as string,
    orderNumber: order.order_number as string,
    subOrderId: data.id as string,
    status: data.status as SellerSubOrderStatus,
    customerName: "Customer",
    itemCount: items.length,
    subtotal: Number(data.subtotal),
    commission: Number(data.commission),
    createdAt: data.created_at as string,
    items: items.map((item) => ({
      id: item.id as string,
      title: item.title as string,
      variantName: (item.variant_name as string) ?? undefined,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
      totalPrice: Number(item.total_price),
      imageUrl: (item.image_url as string) ?? undefined,
    })),
    shippingAddress: {
      line1: address.line1 ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      postalCode: address.postalCode ?? address.postal_code ?? "",
      country: address.country ?? "SG",
    },
  };
}

export async function getSellerPayouts(_sellerId: string): Promise<SellerPayout[]> {
  return [];
}

export async function getLowStockProducts(sellerId: string): Promise<SellerProduct[]> {
  const products = await getSellerProducts(sellerId);
  return products.filter((p) => p.stock > 0 && p.stock <= 5);
}
