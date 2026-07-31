import {
  LayoutDashboard,
  FileCheck,
  Store,
  Package,
  FolderTree,
  ShoppingBag,
  Percent,
  Layout,
  ScrollText,
  Settings,
  Users,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
}

export const adminNavigation = {
  main: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Seller applications", href: "/admin/applications", icon: FileCheck },
    { label: "Sellers", href: "/admin/sellers", icon: Store },
    { label: "Product moderation", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Returns", href: "/admin/returns", icon: RotateCcw },
    { label: "Commissions", href: "/admin/commissions", icon: Percent },
    { label: "Homepage CMS", href: "/admin/cms", icon: Layout },
    { label: "Audit logs", href: "/admin/audit-logs", icon: ScrollText },
    { label: "Platform settings", href: "/admin/settings", icon: Settings, superAdminOnly: true },
    { label: "User roles", href: "/admin/roles", icon: Users, superAdminOnly: true },
  ] satisfies AdminNavItem[],
};
