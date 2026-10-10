import type { ReactElement } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { CATEGORIES, CATEGORY_TONE_CLASSES } from "../../data/constants";
import { useHorizontalScroller } from "../../hooks/useHorizontalScroller";
import { cn } from "../../lib/cn";
import { pluralize } from "../../lib/format";
import type { CategoryId } from "../../types";

export interface PopularCategoriesProps {
  selected: CategoryId | "all";
  counts: Readonly<Record<CategoryId, number>>;
  totalCount: number;
  onSelect: (category: CategoryId | "all") => void;
}

export function PopularCategories({ selected, counts, totalCount, onSelect }: PopularCategoriesProps): ReactElement {
  const { ref, canScrollPrev, canScrollNext, scrollByPage } = useHorizontalScroller<HTMLUListElement>();

  return (
    <section id="categories" aria-labelledby="categories-heading" className="mx-auto max-w-7xl scroll-mt-32 px-4 pt-14 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="categories-heading" className="text-2xl font-extrabold tracking-tight text-content sm:text-3xl">
            Popular categories
          </h2>
          <p className="mt-1 text-sm text-content-muted">Jump straight to what Ugandans are buying right now.</p>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            aria-label="Scroll categories left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-content shadow-card transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            aria-label="Scroll categories right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-content shadow-card transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative mt-6">
        {/* Edge fades hint that the row scrolls */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-canvas to-transparent transition-opacity",
            canScrollPrev ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-canvas to-transparent transition-opacity",
            canScrollNext ? "opacity-100" : "opacity-0",
          )}
        />

        <ul
          ref={ref}
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 py-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          <li className="snap-start">
            <button
              type="button"
              onClick={() => onSelect("all")}
              aria-pressed={selected === "all"}
              className={cn(
                "group flex w-32 flex-col items-center gap-3 rounded-3xl border p-4 text-center transition duration-200 hover:-translate-y-1 hover:shadow-card-hover sm:w-36",
                selected === "all" ? "border-brand bg-brand-soft" : "border-line bg-surface shadow-card",
              )}
            >
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-colors",
                  selected === "all"
                    ? "bg-brand text-brand-contrast ring-brand"
                    : "bg-surface-muted text-content-muted ring-line group-hover:bg-brand-soft group-hover:text-brand-soft-content",
                )}
              >
                <LayoutGrid aria-hidden="true" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-bold text-content">All items</span>
                <span className="mt-0.5 block text-xs text-content-subtle">
                  {totalCount} {pluralize(totalCount, "listing")}
                </span>
              </span>
            </button>
          </li>

          {CATEGORIES.map((category) => {
            const isActive = selected === category.id;
            const tone = CATEGORY_TONE_CLASSES[category.tone];
            const Icon = category.icon;
            const count = counts[category.id];
            return (
              <li key={category.id} className="snap-start">
                <button
                  type="button"
                  onClick={() => onSelect(isActive ? "all" : category.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "group flex w-32 flex-col items-center gap-3 rounded-3xl border p-4 text-center transition duration-200 hover:-translate-y-1 hover:shadow-card-hover sm:w-36",
                    isActive ? "border-brand bg-brand-soft" : "border-line bg-surface shadow-card",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl ring-1 transition-transform duration-200 group-hover:scale-110",
                      isActive ? tone.active : tone.badge,
                    )}
                  >
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold leading-tight text-content">{category.label}</span>
                    <span className="mt-0.5 block text-xs text-content-subtle">
                      {count} {pluralize(count, "listing")}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
