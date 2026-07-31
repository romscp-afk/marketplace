import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, RotateCcw, Award } from "lucide-react";
import { brand } from "@/config/brand";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Product } from "@/types";
import {
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getDeals,
} from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { seedSellers } from "@/data/seed";

const trustBenefits = [
  {
    icon: Truck,
    title: "Free delivery",
    description: `On orders over $${brand.delivery.freeShippingThreshold}`,
  },
  {
    icon: Shield,
    title: "Secure checkout",
    description: "Your payment information is always protected",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    description: "Hassle-free returns on eligible items",
  },
  {
    icon: Award,
    title: "Verified sellers",
    description: "Every seller is reviewed and approved",
  },
];

export default async function HomePage() {
  const [featured, trending, newArrivals, deals, categories] = await Promise.all([
    getFeaturedProducts(),
    getTrendingProducts(),
    getNewArrivals(),
    getDeals(),
    getCategories(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="max-w-xl">
            <h1 className="font-display text-primary-foreground text-4xl leading-tight font-semibold md:text-5xl">
              Discover premium products from trusted sellers
            </h1>
            <p className="text-primary-foreground/80 mt-4 text-lg">
              {brand.tagline}. Shop curated collections with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="bg-accent text-foreground hover:bg-accent/90 inline-flex h-12 items-center justify-center rounded-lg px-6 text-base font-medium transition-colors"
              >
                Shop now
              </Link>
              <Link
                href="/sell"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 inline-flex h-12 items-center justify-center rounded-lg border px-6 text-base font-medium transition-colors"
              >
                Become a seller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="font-display mb-6 text-2xl font-semibold">
          Shop by category
        </h2>
        {categories.length === 0 ? (
          <EmptyState title="No categories yet" description="Categories will appear here once added." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group overflow-hidden rounded-xl bg-surface shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 16vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <p className="p-3 text-center text-sm font-medium">{cat.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <ProductSection title="Featured products" products={featured} href="/search?sort=popularity" />
      <ProductSection title="Trending now" products={trending} href="/search?sort=popularity" />
      <ProductSection title="New arrivals" products={newArrivals} href="/search?sort=newest" />
      <ProductSection title="Deals" products={deals} href="/search?sort=deals" variant="promotional" />

      {/* Featured sellers */}
      <section className="mx-auto max-w-7xl px-4 py-12" aria-labelledby="sellers-heading">
        <div className="mb-6 flex items-center justify-between">
          <h2 id="sellers-heading" className="font-display text-2xl font-semibold">
            Featured sellers
          </h2>
          <Link href="/sellers" className="text-primary flex items-center gap-1 text-sm font-medium">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {seedSellers.slice(0, 3).map((seller) => (
            <Link
              key={seller.id}
              href={`/sellers/${seller.slug}`}
              className="bg-surface flex items-center gap-4 rounded-xl border border-border p-4 transition-shadow hover:shadow-md"
            >
              {seller.logoUrl ? (
                <Image
                  src={seller.logoUrl}
                  alt={seller.storeName}
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />
              ) : null}
              <div>
                <p className="font-medium">{seller.storeName}</p>
                <p className="text-muted text-sm">
                  {seller.rating} ★ · {seller.productCount} products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust benefits */}
      <section className="bg-surface border-y border-border py-12" aria-labelledby="trust-heading">
        <div className="mx-auto max-w-7xl px-4">
          <h2 id="trust-heading" className="sr-only">
            Why shop with us
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustBenefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-3">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="text-primary h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-muted text-sm">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller recruitment */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">
          Start selling on {brand.name}
        </h2>
        <p className="text-muted mx-auto mt-3 max-w-lg text-sm">
          Join our community of independent sellers. Reach customers nationwide with our
          easy-to-use seller portal.
        </p>
        <Link
          href="/sell"
          className="bg-primary text-primary-foreground hover:bg-primary-dark mt-6 inline-flex h-12 items-center justify-center rounded-lg px-6 text-base font-medium transition-colors"
        >
          Apply to sell
        </Link>
      </section>
    </>
  );
}

function ProductSection({
  title,
  products,
  href,
  variant,
}: {
  title: string;
  products: Product[];
  href: string;
  variant?: "promotional";
}) {
  return (
    <section
      className={variant === "promotional" ? "bg-promotional/5 py-12" : "mx-auto max-w-7xl px-4 py-12"}
      aria-labelledby={`section-${title.replace(/\s/g, "-").toLowerCase()}`}
    >
      <div className={variant === "promotional" ? "mx-auto max-w-7xl px-4" : ""}>
        <div className="mb-6 flex items-center justify-between">
          <h2
            id={`section-${title.replace(/\s/g, "-").toLowerCase()}`}
            className="font-display text-2xl font-semibold"
          >
            {title}
          </h2>
          <Link href={href} className="text-primary flex items-center gap-1 text-sm font-medium">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {products.length === 0 ? (
          <EmptyState title="No products yet" description="Check back soon for new items." />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
