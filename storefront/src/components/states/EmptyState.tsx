import type { Dispatch, ReactElement } from "react";
import { MapPin, PackageSearch, RotateCcw, Search, Tag } from "lucide-react";
import { getActiveChips } from "../../lib/catalog";
import type { ActiveFilterChip, FilterAction, FilterState, Product } from "../../types";
import { ActiveFilterChips } from "../catalog/ActiveFilterChips";
import { TrendingCarousel } from "./TrendingCarousel";

export interface EmptyStateProps {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
  trendingItems: readonly Product[];
  trendingRegionLabel: string;
  isSaved: (id: string) => boolean;
  onToggleSaved: (id: string) => void;
}

/** Layered icon illustration. Purely decorative, so it is hidden from assistive tech. */
function EmptyIllustration(): ReactElement {
  return (
    <div aria-hidden="true" className="relative mx-auto h-44 w-44">
      <div className="absolute inset-0 rounded-full bg-brand-soft" />
      <div className="absolute inset-3 rounded-full border-2 border-dashed border-brand/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-24 w-24 -rotate-6 items-center justify-center rounded-3xl bg-surface shadow-float ring-1 ring-line">
          <PackageSearch className="h-12 w-12 text-brand" strokeWidth={1.6} />
        </div>
      </div>
      <span className="absolute -left-1 top-6 flex h-10 w-10 animate-float items-center justify-center rounded-2xl bg-info-soft text-info shadow-card">
        <Search className="h-5 w-5" />
      </span>
      <span className="absolute -right-2 top-14 flex h-9 w-9 animate-float items-center justify-center rounded-xl bg-accent-soft text-accent-soft-content shadow-card [animation-delay:-2s]">
        <Tag className="h-4 w-4" />
      </span>
      <span className="absolute bottom-3 left-3 flex h-9 w-9 animate-float items-center justify-center rounded-xl bg-danger-soft text-danger shadow-card [animation-delay:-3.5s]">
        <MapPin className="h-4 w-4" />
      </span>
    </div>
  );
}

function suggestionFor(chips: readonly ActiveFilterChip[], filters: FilterState): string {
  if (chips.length === 0) return "There are no listings yet. Check back soon or be the first to post an item.";
  if (filters.regions.length > 0) return "Try widening your search to all of Uganda, or remove a few filters.";
  return "Try different keywords, a wider price range, or fewer filters.";
}

export function EmptyState({
  filters,
  dispatch,
  trendingItems,
  trendingRegionLabel,
  isSaved,
  onToggleSaved,
}: EmptyStateProps): ReactElement {
  const chips = getActiveChips(filters);

  return (
    <section aria-labelledby="empty-heading">
      <div className="rounded-3xl border border-line bg-surface px-6 py-12 text-center shadow-card sm:py-14">
        <EmptyIllustration />
        <h2 id="empty-heading" className="mt-8 text-2xl font-extrabold tracking-tight text-content">
          No matches found
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-content-muted">{suggestionFor(chips, filters)}</p>

        {chips.length > 0 && (
          <div className="mx-auto mt-6 flex max-w-xl justify-center">
            <ActiveFilterChips chips={chips} dispatch={dispatch} />
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {chips.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch({ type: "reset" })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-[15px] font-bold text-brand-contrast shadow-card transition hover:bg-brand-hover active:scale-[0.98] sm:w-auto"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Clear All Filters
            </button>
          )}
          {filters.regions.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch({ type: "setRegions", regions: [] })}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-6 py-3.5 text-[15px] font-bold text-content transition hover:bg-surface-muted sm:w-auto"
            >
              <MapPin aria-hidden="true" className="h-4 w-4" />
              Search all of Uganda
            </button>
          )}
        </div>
      </div>

      <TrendingCarousel items={trendingItems} regionLabel={trendingRegionLabel} isSaved={isSaved} onToggleSaved={onToggleSaved} />
    </section>
  );
}
