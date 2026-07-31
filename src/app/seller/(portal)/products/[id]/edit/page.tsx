import { notFound } from "next/navigation";
import { requireApprovedSeller } from "@/lib/seller/session";
import { getSellerProduct } from "@/lib/seller/data";
import { getCategories } from "@/lib/data/categories";
import { ProductForm } from "@/components/seller/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const { context } = await requireApprovedSeller();
  const [product, categories] = await Promise.all([
    getSellerProduct(context.seller.id, id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Edit product</h1>
      <p className="text-muted mb-8 text-sm">{product.title}</p>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
