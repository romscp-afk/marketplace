import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/admin/session";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { context } = await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AdminSidebar isSuperAdmin={context.isSuperAdmin} />
        <div>{children}</div>
      </div>
    </div>
  );
}
