import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Store } from "lucide-react";
import { getStorefrontSellers } from "@/lib/data/sellers";
import { sellerLogoUrl } from "@/lib/images";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default async function SellersDirectoryPage() {
  const sellers = await getStorefrontSellers();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Suppliers</h1>
        <p className="text-muted mt-2 max-w-2xl text-sm">
          Shop independent suppliers on Aromza. All stores deliver within Singapore.
        </p>
      </header>

      {sellers.length === 0 ? (
        <EmptyState
          icon={<Store className="h-12 w-12" />}
          title="Suppliers coming soon"
          description="Create a supplier account to publish products on Aromza."
          action={{ label: "Become a supplier", href: "/sell" }}
        />
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sellers.map((seller) => (
          <Link
            key={seller.id}
            href={`/sellers/${seller.slug}`}
            className="bg-surface group flex flex-col rounded-xl border border-border p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <Image
                src={seller.logoUrl ?? sellerLogoUrl(seller.slug, 112, 112)}
                alt=""
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-medium group-hover:text-primary">{seller.storeName}</p>
                <Rating rating={seller.rating} reviewCount={seller.reviewCount} />
              </div>
            </div>
            <p className="text-muted mt-4 line-clamp-2 flex-1 text-sm">{seller.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted">{seller.productCount} products</span>
              {seller.isVerified ? <Badge variant="accent">Verified</Badge> : null}
            </div>
            <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium">
              View store <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}
