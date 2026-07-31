import { Badge } from "@/components/ui/badge";
import { requireSuperAdmin } from "@/lib/admin/session";

const platformRoles = [
  {
    role: "super_admin",
    label: "Super admin",
    description: "Full platform access including commission and role management",
    permissions: ["All permissions"],
  },
  {
    role: "admin",
    label: "Admin",
    description: "Day-to-day platform operations",
    permissions: [
      "Review seller applications",
      "Moderate products",
      "Manage categories",
      "View orders and audit logs",
      "Toggle CMS sections",
    ],
  },
  {
    role: "seller_owner",
    label: "Seller owner",
    description: "Full access to their seller portal",
    permissions: ["Manage store", "Products", "Orders", "Inventory", "Payouts"],
  },
  {
    role: "customer",
    label: "Customer",
    description: "Standard buyer account",
    permissions: ["Browse", "Purchase", "Manage account"],
  },
];

export default async function AdminRolesPage() {
  await requireSuperAdmin();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">User roles</h1>
      <p className="text-muted mb-8 text-sm">
        Role definitions and permissions. User assignment is managed via Supabase when configured.
      </p>

      <div className="space-y-4">
        {platformRoles.map((item) => (
          <div key={item.role} className="bg-surface rounded-xl border border-border p-4">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium">{item.label}</h2>
              <Badge variant="default">{item.role}</Badge>
            </div>
            <p className="text-muted mb-3 text-sm">{item.description}</p>
            <ul className="text-muted list-inside list-disc text-sm">
              {item.permissions.map((perm) => (
                <li key={perm}>{perm}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
