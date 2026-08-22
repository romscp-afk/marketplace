import { brand } from "@/config/brand";
import { seedCategories } from "@/data/seed";
import { productImageUrl } from "@/lib/images";
import { generateId, slugify } from "@/lib/utils";
import type { Product, Seller } from "@/types";
import type { SellerApplication, SellerProduct, SellerRecord } from "@/types/seller";
import type { AuthUser } from "@/lib/auth/session";

interface SupplierWorkspace {
  seller: SellerRecord;
  application: SellerApplication;
  products: SellerProduct[];
}

const workspaces = new Map<string, SupplierWorkspace>();

function nowIso(): string {
  return new Date().toISOString();
}

function categoryById(id: string) {
  return seedCategories.find((c) => c.id === id || c.slug === id);
}

export function uniqueProductSlug(title: string, excludeId?: string): string {
  const base = slugify(title) || "product";
  const taken = new Set(
    [...workspaces.values()]
      .flatMap((space) => space.products)
      .filter((product) => product.id !== excludeId)
      .map((product) => product.slug),
  );

  if (!taken.has(base)) return base;
  let index = 2;
  while (taken.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

export function uniqueStoreSlug(name: string, ownerId: string): string {
  const base = slugify(name) || "store";
  const taken = new Set(
    [...workspaces.values()]
      .filter((space) => space.seller.ownerId !== ownerId)
      .map((space) => space.seller.store.slug),
  );
  if (!taken.has(base)) return base;
  let index = 2;
  while (taken.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function createWorkspace(user: AuthUser, storeName?: string): SupplierWorkspace {
  const timestamp = nowIso();
  const name = storeName?.trim() || `${user.firstName ?? "Supplier"} Store`;
  const sellerId = `seller-${user.id}`;

  const seller: SellerRecord = {
    id: sellerId,
    ownerId: user.id,
    status: "active",
    commissionRate: brand.commission.defaultRate,
    isVerified: true,
    rating: 0,
    reviewCount: 0,
    productCount: 0,
    store: {
      id: `store-${user.id}`,
      name,
      slug: uniqueStoreSlug(name, user.id),
      description: "Independent supplier on Aromza",
    },
  };

  const application: SellerApplication = {
    id: `app-${user.id}`,
    userId: user.id,
    status: "approved",
    storeName: name,
    storeDescription: seller.store.description,
    businessName: name,
    categories: seedCategories.map((c) => c.slug),
    submittedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const workspace: SupplierWorkspace = { seller, application, products: [] };
  workspaces.set(user.id, workspace);
  return workspace;
}

export function getWorkspaceByUserId(userId: string): SupplierWorkspace | undefined {
  return workspaces.get(userId);
}

export function getWorkspaceBySellerId(sellerId: string): SupplierWorkspace | undefined {
  return [...workspaces.values()].find((space) => space.seller.id === sellerId);
}

export function getOrCreateWorkspace(user: AuthUser, storeName?: string): SupplierWorkspace {
  const existing = workspaces.get(user.id);
  if (existing) return existing;
  return createWorkspace(user, storeName);
}

export function getSellerPortalFromWorkspace(user: AuthUser) {
  const workspace = getOrCreateWorkspace(user);
  return {
    userId: user.id,
    email: user.email,
    isSeller: true,
    isApprovedSeller: true,
    application: workspace.application,
    seller: workspace.seller,
  };
}

export function saveWorkspaceApplication(
  user: AuthUser,
  application: Omit<SellerApplication, "id" | "userId" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  },
): SupplierWorkspace {
  const workspace = getOrCreateWorkspace(user, application.storeName);
  const timestamp = nowIso();
  workspace.application = {
    ...workspace.application,
    ...application,
    id: application.id ?? workspace.application.id,
    userId: user.id,
    status: "approved",
    createdAt: application.createdAt ?? workspace.application.createdAt,
    updatedAt: timestamp,
  };
  workspace.seller.store.name = application.storeName;
  workspace.seller.store.slug = uniqueStoreSlug(application.storeName, user.id);
  workspace.seller.store.description = application.storeDescription;
  workspace.seller.status = "active";
  return workspace;
}

export function updateWorkspaceStore(
  userId: string,
  name: string,
  description: string,
): SupplierWorkspace | undefined {
  const workspace = workspaces.get(userId);
  if (!workspace) return undefined;
  workspace.seller.store.name = name;
  workspace.seller.store.description = description;
  workspace.seller.store.slug = uniqueStoreSlug(name, userId);
  workspace.application.storeName = name;
  workspace.application.storeDescription = description;
  workspace.application.updatedAt = nowIso();
  return workspace;
}

export function saveWorkspaceProduct(sellerId: string, product: SellerProduct): SellerProduct {
  const workspace = getWorkspaceBySellerId(sellerId);
  if (!workspace) throw new Error("Supplier store not found");

  const category = categoryById(product.categoryId);
  const next: SellerProduct = {
    ...product,
    sellerId,
    categoryName: category?.name ?? product.categoryName,
    currency: brand.locale.currency,
    slug: uniqueProductSlug(product.title, product.id),
    updatedAt: nowIso(),
  };

  const index = workspace.products.findIndex((item) => item.id === next.id);
  if (index >= 0) workspace.products[index] = next;
  else workspace.products.push(next);

  workspace.seller.productCount = workspace.products.filter((item) => item.status === "active").length;
  return next;
}

export function getWorkspaceProducts(sellerId: string): SellerProduct[] {
  return [...(getWorkspaceBySellerId(sellerId)?.products ?? [])];
}

export function getWorkspaceProduct(sellerId: string, productId: string): SellerProduct | undefined {
  return getWorkspaceBySellerId(sellerId)?.products.find((product) => product.id === productId);
}

export function toStorefrontSeller(seller: SellerRecord): Seller {
  const workspace = getWorkspaceBySellerId(seller.id);
  return {
    id: seller.id,
    storeName: seller.store.name,
    slug: seller.store.slug,
    description: seller.store.description ?? "",
    logoUrl: seller.store.logoUrl,
    bannerUrl: seller.store.bannerUrl,
    rating: seller.rating,
    reviewCount: seller.reviewCount,
    productCount:
      workspace?.products.filter((product) => product.status === "active").length ??
      seller.productCount,
    isVerified: seller.isVerified,
  };
}

export function toStorefrontProduct(product: SellerProduct, seller: SellerRecord): Product {
  const category = categoryById(product.categoryId);
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description ?? "",
    shortDescription: product.description?.slice(0, 140),
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    currency: brand.locale.currency,
    images: product.imageUrl
      ? [product.imageUrl]
      : [productImageUrl(product.slug, 600, 600, category?.slug)],
    categoryId: category?.id ?? product.categoryId,
    categoryName: category?.name ?? product.categoryName,
    categorySlug: category?.slug ?? "",
    sellerId: seller.id,
    seller: {
      id: seller.id,
      storeName: seller.store.name,
      slug: seller.store.slug,
      rating: seller.rating,
      reviewCount: seller.reviewCount,
      isVerified: seller.isVerified,
    },
    rating: seller.rating,
    reviewCount: seller.reviewCount,
    stock: product.stock,
    status: product.status,
    isReturnEligible: true,
    deliveryEstimateDays: brand.delivery.defaultEstimateDays,
    deliveryFee: brand.delivery.defaultFee,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function getPublishedSellers(): Seller[] {
  return [...workspaces.values()]
    .filter((space) => space.seller.status === "active")
    .map((space) => ({
      ...toStorefrontSeller(space.seller),
      productCount: space.products.filter((product) => product.status === "active").length,
    }));
}

export function getPublishedProducts(): Product[] {
  return [...workspaces.values()].flatMap((space) =>
    space.products
      .filter((product) => product.status === "active" && product.stock >= 0)
      .map((product) => toStorefrontProduct(product, space.seller)),
  );
}

export function getPublishedSellerBySlug(slug: string): Seller | undefined {
  return getPublishedSellers().find((seller) => seller.slug === slug);
}

export function getPublishedProductsBySellerSlug(slug: string): Product[] {
  return getPublishedProducts().filter((product) => product.seller.slug === slug);
}

export function createDraftProduct(sellerId: string): Pick<SellerProduct, "id" | "sellerId" | "createdAt"> {
  return {
    id: generateId(),
    sellerId,
    createdAt: nowIso(),
  };
}
