import Link from "next/link";
import { SellerStatusActions } from "@/components/admin/seller-status-actions";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminSellers } from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";

export default async function AdminSellersPage() {
  await requireAdmin();
  const sellers = await getAdminSellers();

  return (
    <div>
      <h1 className="font-display mb-2 text-2xl font-semibold">Sellers</h1>
      <p className="text-muted mb-8 text-sm">{sellers.length} seller accounts</p>

      <div className="bg-surface overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b text-left">
              <th className="px-4 py-3 font-medium">Store</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Owner</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Products</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Commission</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id} className="border-border border-b last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/sellers/${seller.slug}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {seller.storeName}
                  </Link>
                  <p className="text-muted text-xs">Joined {formatDate(seller.createdAt)}</p>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">{seller.ownerEmail}</td>
                <td className="hidden px-4 py-3 sm:table-cell">{seller.productCount}</td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {(seller.commissionRate * 100).toFixed(0)}%
                </td>
                <td className="px-4 py-3">
                  <SellerStatusActions seller={seller} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
