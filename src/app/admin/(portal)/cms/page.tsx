import { CmsSectionToggle } from "@/components/admin/cms-section-toggle";
import { requireAdmin } from "@/lib/admin/session";
import { getCmsSections } from "@/lib/admin/data";

export default async function AdminCmsPage() {
  await requireAdmin();
  const sections = await getCmsSections();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Homepage CMS</h1>
      <p className="text-muted mb-8 text-sm">
        Enable or disable homepage sections. Content editing will be available after CMS tables are migrated.
      </p>

      <div className="space-y-3">
        {sections.map((section) => (
          <CmsSectionToggle key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
