import { useState, type ReactElement } from "react";
import { ImageOff } from "lucide-react";
import { CATEGORIES, CATEGORY_TONE_CLASSES } from "../../data/constants";
import { cn } from "../../lib/cn";
import type { CategoryId } from "../../types";

export interface ProductImageProps {
  src: string | null;
  alt: string;
  category: CategoryId;
  className?: string;
}

/** Lazy image with a tinted category-icon placeholder for missing or broken photos. */
export function ProductImage({ src, alt, category, className }: ProductImageProps): ReactElement {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const categoryOption = CATEGORIES.find((item) => item.id === category);
  const Icon = categoryOption?.icon ?? ImageOff;
  const tone = categoryOption ? CATEGORY_TONE_CLASSES[categoryOption.tone] : null;

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} (no photo available)`}
        className={cn("flex items-center justify-center bg-gradient-to-br from-surface-muted to-line", className)}
      >
        <span className={cn("flex h-16 w-16 items-center justify-center rounded-3xl ring-1", tone?.badge ?? "bg-surface text-content-subtle ring-line")}>
          <Icon aria-hidden="true" className="h-8 w-8" />
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cn("bg-surface-muted transition-[transform,opacity] duration-500", loaded ? "opacity-100" : "opacity-0", className)}
    />
  );
}
