import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/types";
import { navigation } from "@/config/navigation";

export function CategorySidebar({ categories }: { categories: Category[] }) {
  const items = categories.length > 0 ? categories : navigation.categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <aside
      className="bg-surface flex h-full w-[200px] shrink-0 flex-col overflow-hidden rounded-sm border border-border"
      aria-label="Product categories"
    >
      <div className="bg-header px-3 py-2 text-sm font-semibold text-white">
        All Categories
      </div>
      <ul className="flex-1 overflow-y-auto py-1">
        {items.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/categories/${cat.slug}`}
              className="hover:bg-primary/5 hover:text-primary flex items-center justify-between px-3 py-2 text-sm text-foreground transition-colors"
            >
              <span className="truncate">{cat.name}</span>
              <ChevronRight className="text-muted h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
