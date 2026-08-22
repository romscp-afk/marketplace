import type { Category, Product } from "@/types";
import { CategorySidebar } from "@/components/marketplace/taobao/category-sidebar";
import { HeroMosaic } from "./hero-mosaic";
import { YouMayLike } from "./you-may-like";

interface MicHeroSectionProps {
  categories: Category[];
  recommendations: Product[];
}

export function MicHeroSection({ categories, recommendations }: MicHeroSectionProps) {
  return (
    <section
      className="flex gap-2"
      aria-label="Marketplace showcase"
      style={{ minHeight: 360 }}
    >
      <CategorySidebar categories={categories} />
      <HeroMosaic />
      <YouMayLike products={recommendations} />
    </section>
  );
}
