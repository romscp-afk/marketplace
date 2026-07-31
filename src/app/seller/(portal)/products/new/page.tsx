import { requireApprovedSeller } from "@/lib/seller/session";
import { getCategories } from "@/lib/data/categories";
import { ProductForm } from "@/components/seller/product-form";

export default async function NewProductPage() {
  await requireApprovedSeller();
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display mb-8 text-2xl font-semibold">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
