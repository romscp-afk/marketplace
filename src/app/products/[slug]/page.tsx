import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/products";
import { getReviewsForProduct, getProductReviewStats } from "@/data/seed";
import { formatCurrency } from "@/lib/utils";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { ProductActions } from "@/components/product/product-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { RecentlyViewedTracker } from "@/components/product/recently-viewed-tracker";
import { ProductViewTracker } from "@/components/product/product-view-tracker";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.shortDescription ?? product.description,
    openGraph: {
      title: product.title,
      description: product.shortDescription ?? product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const reviews = getReviewsForProduct(product.id);
  const reviewStats = getProductReviewStats(product.id);
  const displayReviewCount = reviewStats.count;
  const displayRating = reviewStats.count > 0 ? reviewStats.average : product.rating;
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(displayReviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: displayRating,
            reviewCount: displayReviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecentlyViewedTracker productId={product.id} />
      <ProductViewTracker productId={product.id} productName={product.title} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-muted mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/categories/${product.categorySlug}`}
                className="hover:text-primary"
              >
                {product.categoryName}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium">{product.title}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />

          <div>
            <h1 className="font-display text-2xl font-semibold text-product-title md:text-3xl">
              {product.title}
            </h1>

            <div className="mt-2 flex items-center gap-3">
              <Link
                href={`/sellers/${product.seller.slug}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                {product.seller.storeName}
              </Link>
              {product.seller.isVerified ? (
                <Badge variant="accent">Verified</Badge>
              ) : null}
            </div>

            <Rating
              rating={displayRating}
              reviewCount={displayReviewCount}
              showValue
              size="md"
              className="mt-3"
            />

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-price">
                {formatCurrency(product.price, product.currency)}
              </span>
              {hasDiscount ? (
                <>
                  <span className="text-lg text-discount line-through">
                    {formatCurrency(product.compareAtPrice!, product.currency)}
                  </span>
                  <Badge variant="promotional">
                    Save{" "}
                    {Math.round(
                      ((product.compareAtPrice! - product.price) /
                        product.compareAtPrice!) *
                        100,
                    )}
                    %
                  </Badge>
                </>
              ) : null}
            </div>

            <ProductActions product={product} />

            <div className="border-border mt-6 space-y-3 border-t pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Delivery estimate</span>
                <span>
                  {product.deliveryEstimateDays.min}–
                  {product.deliveryEstimateDays.max} business days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery fee</span>
                <span>
                  {product.deliveryFee
                    ? formatCurrency(product.deliveryFee, product.currency)
                    : "Free"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Returns</span>
                <span>
                  {product.isReturnEligible ? "Eligible for return" : "Not eligible"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Availability</span>
                <span className={product.stock > 0 ? "text-success" : "text-error"}>
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & specs */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="mb-4 text-lg font-semibold">
              Description
            </h2>
            <p className="text-muted leading-relaxed">{product.description}</p>
          </section>

          {product.specifications ? (
            <section aria-labelledby="specs-heading">
              <h2 id="specs-heading" className="mb-4 text-lg font-semibold">
                Specifications
              </h2>
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <dt className="text-muted">{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>

        {/* Reviews */}
        <section className="mt-12" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="mb-6 text-lg font-semibold">
            Customer reviews ({displayReviewCount})
          </h2>
          {reviews.length === 0 ? (
            <p className="text-muted text-sm">No reviews yet. Be the first to review!</p>
          ) : (
            <>
              <p className="text-muted mb-4 text-sm">
                Showing {reviews.length} of {displayReviewCount} review
                {displayReviewCount === 1 ? "" : "s"}
              </p>
            <div className="space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="bg-surface rounded-xl border border-border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{review.userName}</p>
                    <Rating rating={review.rating} />
                  </div>
                  {review.title ? (
                    <p className="mt-1 text-sm font-medium">{review.title}</p>
                  ) : null}
                  <p className="text-muted mt-1 text-sm">{review.comment}</p>
                  {review.isVerifiedPurchase ? (
                    <Badge variant="success" className="mt-2">
                      Verified purchase
                    </Badge>
                  ) : null}
                </article>
              ))}
            </div>
            </>
          )}
        </section>

        {/* Related products */}
        {related.length > 0 ? (
          <section className="mt-12" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display mb-6 text-xl font-semibold">
              Related products
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
