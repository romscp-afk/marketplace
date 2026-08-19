import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { Grid3X3 } from "lucide-react";
import type { Category } from "@/types";
import { categoryImageUrl } from "@/lib/images";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-surface flex flex-wrap px-2 py-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          className="mb-2 flex w-1/5 flex-col items-center px-1"
        >
          <span className="border-border bg-background h-12 w-12 overflow-hidden rounded-full border">
            <SafeImage
              src={cat.imageUrl ?? categoryImageUrl(cat.slug)}
              alt=""
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="mt-1.5 line-clamp-2 text-center text-[11px] text-foreground">
            {cat.name}
          </span>
        </Link>
      ))}
      <Link href="/search" className="mb-2 flex w-1/5 flex-col items-center px-1">
        <span className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
          <Grid3X3 className="text-primary h-5 w-5" aria-hidden="true" />
        </span>
        <span className="mt-1.5 text-center text-[11px] text-foreground">More</span>
      </Link>
    </div>
  );
}
