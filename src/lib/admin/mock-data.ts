/**
 * Development mock data for admin portal when Supabase is not configured.
 */

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

export const MOCK_ADMIN = {
  userId: "mock-admin",
  email: "admin@example.com",
  isSuperAdmin: true,
};

export function getMockAdminStats(): AdminStats {
  return {
    pendingApplications: 3,
    productsInReview: 5,
    ordersToday: 12,
    totalRevenue: 48250,
    activeSellers: 5,
    openDisputes: 1,
  };
}

const MOCK_APPLICATIONS: AdminApplication[] = [
  {
    id: "app-1",
    userId: "user-1",
    applicantEmail: "jane@example.com",
    applicantName: "Jane Cooper",
    status: "under_review",
    storeName: "Urban Threads",
    storeDescription: "Contemporary streetwear and accessories",
    businessName: "Urban Threads LLC",
    categories: ["fashion"],
    submittedAt: "2025-07-28T00:00:00Z",
    createdAt: "2025-07-25T00:00:00Z",
  },
  {
    id: "app-2",
    userId: "user-2",
    applicantEmail: "marcus@example.com",
    applicantName: "Marcus Chen",
    status: "submitted",
    storeName: "Green Leaf Botanicals",
    storeDescription: "Organic skincare and wellness products",
    businessName: "Green Leaf Co.",
    categories: ["beauty"],
    submittedAt: "2025-07-30T00:00:00Z",
    createdAt: "2025-07-30T00:00:00Z",
  },
  {
    id: "app-3",
    userId: "user-3",
    applicantEmail: "priya@example.com",
    applicantName: "Priya Sharma",
    status: "more_info_required",
    storeName: "Spice Route Kitchen",
    businessName: "Spice Route Foods",
    categories: ["food-gourmet"],
    submittedAt: "2025-07-20T00:00:00Z",
    createdAt: "2025-07-18T00:00:00Z",
  },
];

const mockApplications = [...MOCK_APPLICATIONS];

const MOCK_SELLERS: AdminSeller[] = [
  {
    id: "seller-1",
    storeName: "Artisan Collective",
    slug: "artisan-collective",
    ownerEmail: "seller1@example.com",
    status: "active",
    isVerified: true,
    productCount: 12,
    commissionRate: 0.1,
    createdAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "seller-2",
    storeName: "Modern Living Co.",
    slug: "modern-living-co",
    ownerEmail: "seller2@example.com",
    status: "active",
    isVerified: true,
    productCount: 8,
    commissionRate: 0.1,
    createdAt: "2025-04-15T00:00:00Z",
  },
  {
    id: "seller-3",
    storeName: "Tech Haven",
    slug: "tech-haven",
    ownerEmail: "seller3@example.com",
    status: "suspended",
    isVerified: false,
    productCount: 6,
    commissionRate: 0.12,
    createdAt: "2025-05-01T00:00:00Z",
  },
];

const mockSellers = [...MOCK_SELLERS];

const MOCK_PRODUCTS: AdminProduct[] = [
  {
    id: "prod-review-1",
    title: "Hand-Stamped Gold Ring",
    slug: "hand-stamped-gold-ring",
    sellerName: "Artisan Collective",
    sellerId: "seller-1",
    status: "review",
    price: 185,
    stock: 8,
    submittedAt: "2025-07-29T00:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop",
  },
  {
    id: "prod-review-2",
    title: "Vitamin C Brightening Mask",
    slug: "vitamin-c-brightening-mask",
    sellerName: "Pure Botanicals",
    sellerId: "seller-3",
    status: "review",
    price: 28,
    stock: 50,
    submittedAt: "2025-07-30T00:00:00Z",
  },
];

const mockProducts = [...MOCK_PRODUCTS];

const MOCK_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-2025-00142",
    customerEmail: "customer@example.com",
    status: "confirmed",
    total: 234.5,
    sellerCount: 2,
    createdAt: "2025-07-30T10:00:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2025-00138",
    customerEmail: "sarah@example.com",
    status: "processing",
    total: 89,
    sellerCount: 1,
    createdAt: "2025-07-29T14:30:00Z",
  },
];

const mockCategories: AdminCategory[] = [
  { id: "cat-1", name: "Fashion", slug: "fashion", productCount: 12, isActive: true, sortOrder: 1 },
  { id: "cat-2", name: "Home & Living", slug: "home-living", productCount: 8, isActive: true, sortOrder: 2 },
  { id: "cat-3", name: "Beauty", slug: "beauty", productCount: 10, isActive: true, sortOrder: 3 },
  { id: "cat-4", name: "Electronics", slug: "electronics", productCount: 6, isActive: true, sortOrder: 4 },
  { id: "cat-5", name: "Food & Gourmet", slug: "food-gourmet", productCount: 8, isActive: true, sortOrder: 5 },
  { id: "cat-6", name: "Jewelry", slug: "jewelry", productCount: 4, isActive: false, sortOrder: 6 },
];

const mockCmsSections: CmsSection[] = [
  { id: "cms-1", key: "hero", title: "Hero banner", enabled: true, sortOrder: 1 },
  { id: "cms-2", key: "featured", title: "Featured products", subtitle: "Curated picks", enabled: true, sortOrder: 2 },
  { id: "cms-3", key: "trending", title: "Trending now", enabled: true, sortOrder: 3 },
  { id: "cms-4", key: "new_arrivals", title: "New arrivals", enabled: true, sortOrder: 4 },
  { id: "cms-5", key: "deals", title: "Deals", enabled: true, sortOrder: 5 },
  { id: "cms-6", key: "sellers", title: "Featured sellers", enabled: true, sortOrder: 6 },
  { id: "cms-7", key: "trust", title: "Trust benefits", enabled: true, sortOrder: 7 },
  { id: "cms-8", key: "seller_recruitment", title: "Seller recruitment", enabled: true, sortOrder: 8 },
];

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "audit-1",
    actorEmail: "admin@example.com",
    action: "seller.approved",
    resource: "seller_applications",
    resourceId: "app-prev-1",
    summary: "Approved seller application for Artisan Collective",
    createdAt: "2025-07-25T09:00:00Z",
  },
  {
    id: "audit-2",
    actorEmail: "admin@example.com",
    action: "product.approved",
    resource: "products",
    resourceId: "prod-1",
    summary: "Approved product: Organic Cotton Linen Blend Shirt",
    createdAt: "2025-07-28T14:30:00Z",
  },
  {
    id: "audit-3",
    actorEmail: "admin@example.com",
    action: "commission.updated",
    resource: "platform_settings",
    summary: "Updated default commission rate from 8% to 10%",
    createdAt: "2025-07-20T11:00:00Z",
  },
];

let mockCommission: CommissionSettings = {
  defaultRate: 0.1,
  minimumPayout: 25,
};

export function getMockApplications() {
  return [...mockApplications];
}

export function getMockApplication(id: string) {
  return mockApplications.find((a) => a.id === id);
}

export function updateMockApplication(id: string, updates: Partial<AdminApplication>) {
  const idx = mockApplications.findIndex((a) => a.id === id);
  if (idx >= 0) {
    mockApplications[idx] = { ...mockApplications[idx]!, ...updates };
    return mockApplications[idx];
  }
  return undefined;
}

export function getMockSellers() {
  return [...mockSellers];
}

export function updateMockSeller(id: string, updates: Partial<AdminSeller>) {
  const idx = mockSellers.findIndex((s) => s.id === id);
  if (idx >= 0) {
    mockSellers[idx] = { ...mockSellers[idx]!, ...updates };
    return mockSellers[idx];
  }
  return undefined;
}

export function getMockProductsForReview() {
  return mockProducts.filter((p) => p.status === "review");
}

export function getMockAllProducts() {
  return [...mockProducts];
}

export function updateMockProduct(id: string, status: AdminProduct["status"]) {
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx >= 0) {
    mockProducts[idx] = { ...mockProducts[idx]!, status };
    return mockProducts[idx];
  }
  return undefined;
}

export function getMockOrders() {
  return [...MOCK_ORDERS];
}

export function getMockCategories() {
  return [...mockCategories];
}

export function saveMockCategory(cat: AdminCategory) {
  const idx = mockCategories.findIndex((c) => c.id === cat.id);
  if (idx >= 0) mockCategories[idx] = cat;
  else mockCategories.push(cat);
  return cat;
}

export function getMockCmsSections() {
  return [...mockCmsSections];
}

export function updateMockCmsSection(id: string, updates: Partial<CmsSection>) {
  const idx = mockCmsSections.findIndex((s) => s.id === id);
  if (idx >= 0) {
    mockCmsSections[idx] = { ...mockCmsSections[idx]!, ...updates };
    return mockCmsSections[idx];
  }
  return undefined;
}

export function getMockAuditLogs() {
  return [...mockAuditLogs];
}

export function addMockAuditLog(entry: Omit<AuditLogEntry, "id" | "createdAt">) {
  const log: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  mockAuditLogs.unshift(log);
  return log;
}

export function getMockCommission(): CommissionSettings {
  return { ...mockCommission };
}

export function updateMockCommission(settings: CommissionSettings) {
  mockCommission = settings;
  return mockCommission;
}
