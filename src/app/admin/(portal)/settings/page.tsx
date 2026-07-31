import { requireSuperAdmin } from "@/lib/admin/session";
import { brand } from "@/config/brand";

export default async function AdminSettingsPage() {
  const { context } = await requireSuperAdmin();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Platform settings</h1>
      <p className="text-muted mb-8 text-sm">Super-admin configuration for {brand.name}</p>

      <div className="bg-surface max-w-lg space-y-4 rounded-xl border border-border p-6 text-sm">
        <div>
          <p className="text-muted text-xs font-medium uppercase">Platform name</p>
          <p className="mt-1 font-medium">{brand.name}</p>
        </div>
        <div>
          <p className="text-muted text-xs font-medium uppercase">Signed in as</p>
          <p className="mt-1">{context.email}</p>
        </div>
        <div>
          <p className="text-muted text-xs font-medium uppercase">Support email</p>
          <p className="mt-1">{brand.contact.supportEmail}</p>
        </div>
        <p className="text-muted border-border border-t pt-4 text-xs">
          Additional platform settings (maintenance mode, feature flags, email templates) will be added in a future milestone.
        </p>
      </div>
    </div>
  );
}
