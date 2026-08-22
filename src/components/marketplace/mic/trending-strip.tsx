import Link from "next/link";
import type { Category } from "@/types";
import { SafeImage } from "@/components/ui/safe-image";

interface TrendingStripProps {
  categories: Category[];
}

export function TrendingStrip({ categories }: TrendingStripProps) {
  return (
    <section
      className="bg-surface rounded-sm border border-border px-4 py-4"
      aria-label="Selected trending categories"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Selected Trending</h2>
        <Link href="/search" className="text-primary text-xs font-medium hover:underline">
          View all ›
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col items-center gap-2"
          >
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full border border-border bg-background transition-transform group-hover:scale-[1.03]">
              <SafeImage
                src={cat.imageUrl ?? "/images/placeholder-product.svg"}
                alt=""
                fill
                sizes="72px"
                className="object-cover"
              />
            </div>
            <span className="line-clamp-2 text-center text-[11px] leading-tight text-foreground">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
