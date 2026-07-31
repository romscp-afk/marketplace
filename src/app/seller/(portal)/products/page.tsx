import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { requireApprovedSeller } from "@/lib/seller/session";
import { getSellerProducts } from "@/lib/seller/data";
import { ProductStatusBadge } from "@/components/seller/status-badge";
import { formatCurrency } from "@/lib/utils";

export default async function SellerProductsPage() {
  const { context } = await requireApprovedSeller();
  const products = await getSellerProducts(context.seller.id);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Products</h1>
          <p className="text-muted mt-1 text-sm">{products.length} products</p>
        </div>
        <Link
          href="/seller/products/new"
          className="bg-primary text-primary-foreground hover:bg-primary-dark inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <p className="text-muted text-sm">No products yet.</p>
          <Link
            href="/seller/products/new"
            className="text-primary mt-2 inline-block text-sm font-medium hover:underline"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="bg-surface overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border border-b text-left">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">SKU</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-border border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/seller/products/${product.id}/edit`}
                      className="flex items-center gap-3 hover:text-primary"
                    >
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="bg-background h-10 w-10 rounded-lg" />
                      )}
                      <span className="font-medium">{product.title}</span>
                    </Link>
                  </td>
                  <td className="text-muted hidden px-4 py-3 md:table-cell">
                    {product.sku ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className={`px-4 py-3 ${product.stock <= 5 && product.stock > 0 ? "text-warning font-medium" : ""}`}>
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(product.price, product.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
