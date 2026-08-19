"use client";

import { useRouter } from "next/navigation";
import { Camera, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketplaceSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function MarketplaceSearchBar({
  placeholder = "Search products, brands and more",
  value,
  onChange,
  readOnly = false,
  className,
}: MarketplaceSearchBarProps) {
  const router = useRouter();

  if (readOnly) {
    return (
      <button
        type="button"
        onClick={() => router.push("/search")}
        className={cn(
          "bg-surface flex h-9 w-full items-center gap-2 rounded px-3 text-left",
          className,
        )}
      >
        <Search className="text-muted h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="text-muted flex-1 text-sm">{placeholder}</span>
        <Camera className="text-muted h-5 w-5 shrink-0" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "bg-surface flex h-9 w-full items-center gap-2 rounded px-3",
        className,
      )}
    >
      <Search className="text-muted h-4 w-4 shrink-0" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="text-foreground placeholder:text-muted flex-1 bg-transparent text-sm outline-none"
      />
      <Camera className="text-muted h-5 w-5 shrink-0" aria-hidden="true" />
    </div>
  );
}
