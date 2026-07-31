"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const displayImages =
    images.length > 0 ? images : ["/images/placeholder-product.svg"];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        <Image
          src={displayImages[selectedIndex]!}
          alt={`${title} - image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {displayImages.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto" role="tablist" aria-label="Product images">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`View image ${i + 1}`}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === selectedIndex ? "border-primary" : "border-transparent",
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
