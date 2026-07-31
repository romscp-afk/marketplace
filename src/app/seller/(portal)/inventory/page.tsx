import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { requireApprovedSeller } from "@/lib/seller/session";
import { getSellerProducts, getLowStockProducts } from "@/lib/seller/data";
import { ProductStatusBadge } from "@/components/seller/status-badge";

export default async function InventoryPage() {
  const { context } = await requireApprovedSeller();
  const [products, lowStock] = await Promise.all([
    getSellerProducts(context.seller.id),
    getLowStockProducts(context.seller.id),
  ]);

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Inventory</h1>
      <p className="text-muted mb-8 text-sm">Monitor stock levels across your products</p>

      {lowStock.length > 0 ? (
        <div className="bg-warning/10 mb-6 flex items-start gap-3 rounded-xl p-4">
          <AlertTriangle className="text-warning mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Low stock alert</p>
            <p className="text-muted mt-1 text-sm">
              {lowStock.length} product{lowStock.length > 1 ? "s have" : " has"} 5 or fewer units remaining.
            </p>
          </div>
        </div>
      ) : null}

      <div className="bg-surface overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b text-left">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-border border-b last:border-0">
                <td className="px-4 py-3 font-medium">{product.title}</td>
                <td className="px-4 py-3">
                  <ProductStatusBadge status={product.status} />
                </td>
                <td className={`px-4 py-3 ${product.stock <= 5 && product.stock > 0 ? "text-warning font-semibold" : product.stock === 0 ? "text-error font-semibold" : ""}`}>
                  {product.stock === 0 ? "Out of stock" : product.stock}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    Update
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
