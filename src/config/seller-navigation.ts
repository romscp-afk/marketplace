import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  Boxes,
  BarChart3,
  Wallet,
  Settings,
  FileText,
  type LucideIcon,
} from "lucide-react";

export interface SellerNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const sellerNavigation = {
  main: [
    { label: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
    { label: "Store profile", href: "/seller/store", icon: Store },
    { label: "Products", href: "/seller/products", icon: Package },
    { label: "Inventory", href: "/seller/inventory", icon: Boxes },
    { label: "Orders", href: "/seller/orders", icon: ShoppingBag },
    { label: "Sales", href: "/seller/sales", icon: BarChart3 },
    { label: "Payouts", href: "/seller/payouts", icon: Wallet },
    { label: "Settings", href: "/seller/settings", icon: Settings },
  ] satisfies SellerNavItem[],

  apply: [
    { label: "Application", href: "/seller/apply", icon: FileText },
    { label: "Status", href: "/seller/apply/status", icon: LayoutDashboard },
  ] satisfies SellerNavItem[],
};

export const sellerApplicationStatuses = {
  draft: { label: "Draft", color: "default" as const },
  submitted: { label: "Submitted", color: "accent" as const },
  under_review: { label: "Under review", color: "warning" as const },
  more_info_required: { label: "More info required", color: "warning" as const },
  approved: { label: "Approved", color: "success" as const },
  rejected: { label: "Rejected", color: "error" as const },
  suspended: { label: "Suspended", color: "error" as const },
};

export const sellerProductStatuses = {
  draft: { label: "Draft", color: "default" as const },
  review: { label: "In review", color: "warning" as const },
  active: { label: "Active", color: "success" as const },
  rejected: { label: "Rejected", color: "error" as const },
  archived: { label: "Archived", color: "default" as const },
  out_of_stock: { label: "Out of stock", color: "promotional" as const },
};

export const sellerOrderStatuses = {
  pending: { label: "Pending", color: "warning" as const },
  accepted: { label: "Accepted", color: "accent" as const },
  processing: { label: "Processing", color: "accent" as const },
  shipped: { label: "Shipped", color: "success" as const },
  delivered: { label: "Delivered", color: "success" as const },
  cancelled: { label: "Cancelled", color: "error" as const },
  returned: { label: "Returned", color: "error" as const },
};
