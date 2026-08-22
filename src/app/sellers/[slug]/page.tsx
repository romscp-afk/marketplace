import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStorefrontProductsBySeller,
  getStorefrontSellerBySlug,
} from "@/lib/data/sellers";
import { ProductCard } from "@/components/product/product-card";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { sellerLogoUrl } from "@/lib/images";
import Image from "next/image";

interface SellerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SellerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seller = await getStorefrontSellerBySlug(slug);
  if (!seller) return { title: "Supplier not found" };
  return {
    title: seller.storeName,
    description: seller.description,
  };
}

export default async function SellerStorePage({ params }: SellerPageProps) {
  const { slug } = await params;
  const seller = await getStorefrontSellerBySlug(slug);
  if (!seller) notFound();

  const products = await getStorefrontProductsBySeller(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-muted mb-6 text-sm">
        <Link href="/sellers" className="hover:text-primary">
          Sellers
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-foreground">{seller.storeName}</span>
      </nav>

      <header className="bg-surface mb-10 flex flex-col gap-4 rounded-xl border border-border p-6 sm:flex-row sm:items-center">
        <Image
          src={seller.logoUrl ?? sellerLogoUrl(seller.slug, 120, 120)}
          alt=""
          width={72}
          height={72}
          className="rounded-full object-cover"
        />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-semibold">{seller.storeName}</h1>
            {seller.isVerified ? <Badge variant="accent">Verified seller</Badge> : null}
          </div>
          <Rating
            rating={seller.rating}
            reviewCount={seller.reviewCount}
            showValue
            size="md"
            className="mt-2"
          />
          <p className="text-muted mt-3 max-w-2xl text-sm">{seller.description}</p>
          <p className="text-muted mt-2 text-xs">Delivers within Singapore · Prices in SGD</p>
        </div>
      </header>

      {products.length === 0 ? (
        <EmptyState
          title="No products listed"
          description="This seller has not published any products yet."
          action={{ label: "Browse marketplace", href: "/search" }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
