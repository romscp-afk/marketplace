import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Store } from "lucide-react";
import { seedSellers } from "@/data/seed";
import { productImageUrl } from "@/lib/images";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function SellersDirectoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Featured sellers</h1>
        <p className="text-muted mt-2 max-w-2xl text-sm">
          Discover independent sellers curated for quality, reliability, and customer satisfaction.
          All sellers deliver within Singapore.
        </p>
      </header>

      {seedSellers.length === 0 ? (
        <EmptyState
          icon={<Store className="h-12 w-12" />}
          title="Sellers coming soon"
          description="We're onboarding trusted sellers to Aromza. Check back shortly, or apply to sell on our marketplace."
          action={{ label: "Sell on Aromza", href: "/sell" }}
        />
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {seedSellers.map((seller) => (
          <Link
            key={seller.id}
            href={`/sellers/${seller.slug}`}
            className="bg-surface group flex flex-col rounded-xl border border-border p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <Image
                src={productImageUrl(`seller-${seller.slug}`, 112, 112)}
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
