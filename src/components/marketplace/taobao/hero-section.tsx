import type { Category } from "@/types";
import { CategorySidebar } from "./category-sidebar";
import { HeroBanner } from "./hero-banner";
import { UserPanel } from "./user-panel";

export function TaobaoHeroSection({ categories }: { categories: Category[] }) {
  return (
    <section className="flex gap-2 py-3" aria-label="Featured promotions">
      <CategorySidebar categories={categories} />
      <HeroBanner />
      <UserPanel />
    </section>
  );
}
