import { CategoryForm } from "@/components/admin/category-form";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminCategories } from "@/lib/admin/data";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getAdminCategories();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Categories</h1>
      <p className="text-muted mb-8 text-sm">Manage storefront categories</p>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="bg-surface overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Slug</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-border border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{cat.slug}</td>
                  <td className="px-4 py-3">{cat.productCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={cat.isActive ? "success" : "default"}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold">Add category</h2>
            <CategoryForm />
          </div>
          {categories.slice(0, 3).map((cat) => (
            <div key={cat.id}>
              <h2 className="mb-3 text-sm font-semibold">Edit: {cat.name}</h2>
              <CategoryForm category={cat} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
