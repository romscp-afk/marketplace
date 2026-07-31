import type { SellerApplicationStatus, ProductStatus, OrderStatus } from "@/types";

export interface AdminStats {
  pendingApplications: number;
  productsInReview: number;
  ordersToday: number;
  totalRevenue: number;
  activeSellers: number;
  openDisputes: number;
}

export interface AdminApplication {
  id: string;
  userId: string;
  applicantEmail: string;
  applicantName: string;
  status: SellerApplicationStatus;
  storeName: string;
  storeDescription?: string;
  businessName?: string;
  categories: string[];
  submittedAt?: string;
  createdAt: string;
}

export interface AdminSeller {
  id: string;
  storeName: string;
  slug: string;
  ownerEmail: string;
  status: "pending" | "active" | "suspended" | "closed";
  isVerified: boolean;
  productCount: number;
  commissionRate: number;
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  sellerName: string;
  sellerId: string;
  status: ProductStatus;
  price: number;
  stock: number;
  submittedAt: string;
  imageUrl?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  sellerCount: number;
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface CmsSection {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  sortOrder: number;
}

export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  summary: string;
  createdAt: string;
}

export interface CommissionSettings {
  defaultRate: number;
  minimumPayout: number;
}

export interface AdminPortalContext {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
}
