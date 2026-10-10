import { useId, type ReactElement } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useHorizontalScroller } from "../../hooks/useHorizontalScroller";
import { formatUGX } from "../../lib/format";
import { productDetailUrl } from "../../lib/links";
import type { Product } from "../../types";
import { ConditionBadge, LocationBadge } from "../ui/Badges";
import { ContactButtons } from "../ui/ContactButtons";
import { ProductImage } from "../ui/ProductImage";
import { SaveButton } from "../ui/SaveButton";

export interface TrendingCarouselProps {
  items: readonly Product[];
  regionLabel: string;
  isSaved: (id: string) => boolean;
  onToggleSaved: (id: string) => void;
}

export function TrendingCarousel({ items, regionLabel, isSaved, onToggleSaved }: TrendingCarouselProps): ReactElement | null {
  const headingId = useId();
  const { ref, canScrollPrev, canScrollNext, scrollByPage } = useHorizontalScroller<HTMLUListElement>(items.length);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 id={headingId} className="flex items-center gap-2 text-xl font-extrabold text-content">
            <Flame aria-hidden="true" className="h-5 w-5 text-warning" />
            Trending Items Nearby
          </h3>
          <p className="mt-1 text-sm text-content-muted">Popular right now around {regionLabel}.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            aria-label="Previous trending items"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-content shadow-card transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            aria-label="Next trending items"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-content shadow-card transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ul
        ref={ref}
        aria-roledescription="carousel"
        className="scrollbar-none -mx-1 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 py-3"
      >
        {items.map((product) => (
          <li key={product.id} className="w-64 shrink-0 snap-start sm:w-72">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
              <div className="relative aspect-video overflow-hidden">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.title}
                  category={product.category}
                  className="h-full w-full object-cover group-hover:scale-110"
                />
                <ConditionBadge condition={product.condition} className="absolute left-2.5 top-2.5" />
                <SaveButton
                  saved={isSaved(product.id)}
                  onToggle={() => onToggleSaved(product.id)}
                  itemTitle={product.title}
                  className="absolute right-2.5 top-2.5 h-8 w-8"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <LocationBadge label={product.locationLabel} className="w-fit bg-surface-muted shadow-none" />
                <h4 className="mt-2.5 line-clamp-1 text-sm font-bold text-content">
                  <a href={productDetailUrl(product)} className="rounded-md hover:text-brand-soft-content">
                    {product.title}
                  </a>
                </h4>
                <p className="mt-1 text-lg font-extrabold text-brand-soft-content">{formatUGX(product.priceUgx)}</p>
                <ContactButtons seller={product.seller} productTitle={product.title} size="compact" className="mt-auto pt-4" />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
