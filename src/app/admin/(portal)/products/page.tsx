import { ProductModerationCard } from "@/components/admin/product-moderation-card";
import { ProductStatusBadge } from "@/components/seller/status-badge";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminProducts } from "@/lib/admin/data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  await requireAdmin();
  const [inReview, allProducts] = await Promise.all([
    getAdminProducts("review"),
    getAdminProducts(),
  ]);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Product moderation</h1>
      <p className="text-muted mb-8 text-sm">
        {inReview.length} pending review · {allProducts.length} total
      </p>

      {inReview.length > 0 ? (
        <section aria-labelledby="review-queue-heading" className="mb-10">
          <h2 id="review-queue-heading" className="mb-4 text-lg font-semibold">
            Review queue
          </h2>
          <div className="space-y-4">
            {inReview.map((product) => (
              <ProductModerationCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <p className="text-muted mb-10 text-sm">No products awaiting review.</p>
      )}

      <section aria-labelledby="all-products-heading">
        <h2 id="all-products-heading" className="mb-4 text-lg font-semibold">
          All products
        </h2>
        <div className="bg-surface overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Seller</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <tr key={product.id} className="border-border border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{product.title}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{product.sellerName}</td>
                  <td className="px-4 py-3">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
