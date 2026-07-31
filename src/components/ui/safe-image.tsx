"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { PRODUCT_IMAGE_FALLBACK } from "@/lib/images";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src: string;
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  fallbackSrc = PRODUCT_IMAGE_FALLBACK,
  alt,
  className,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
