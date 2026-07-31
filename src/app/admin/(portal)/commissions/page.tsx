import { CommissionForm } from "@/components/admin/commission-form";
import { requireAdmin } from "@/lib/admin/session";
import { getCommissionSettings } from "@/lib/admin/data";
import { brand } from "@/config/brand";

export default async function AdminCommissionsPage() {
  await requireAdmin();
  const settings = await getCommissionSettings();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Commission settings</h1>
      <p className="text-muted mb-8 text-sm">
        Platform-wide commission defaults for {brand.name}
      </p>

      <CommissionForm settings={settings} />

      <div className="text-muted mt-8 max-w-md text-sm">
        <p className="font-medium text-foreground">How commissions work</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Default rate applies to new sellers unless overridden</li>
          <li>Sellers receive payouts when balance exceeds the minimum threshold</li>
          <li>Changes are recorded in the audit log</li>
        </ul>
      </div>
    </div>
  );
}
