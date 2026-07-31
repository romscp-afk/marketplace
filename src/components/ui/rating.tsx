import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

export function Rating({
  rating,
  reviewCount,
  size = "sm",
  showValue = false,
  className,
}: RatingProps) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div
        className="flex items-center"
        role="img"
        aria-label={`${rating.toFixed(1)} out of 5 stars${reviewCount ? `, ${reviewCount} reviews` : ""}`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i < fullStars
                ? "fill-accent text-accent"
                : i === fullStars && hasHalf
                  ? "fill-accent/50 text-accent"
                  : "text-border",
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      {showValue ? (
        <span className="text-foreground text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      ) : null}
      {reviewCount !== undefined ? (
        <span className="text-muted text-xs">({reviewCount})</span>
      ) : null}
    </div>
  );
}
