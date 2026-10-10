import { useCallback, useEffect, useState, type Dispatch, type ReactElement } from "react";
import { ChevronDown, Info, SlidersHorizontal } from "lucide-react";
import { PAGE_SIZE } from "../../data/constants";
import { getActiveChips } from "../../lib/catalog";
import { pluralize } from "../../lib/format";
import type { CategoryOption, FacetCounts, FilterAction, FilterState, LoadStatus, Product } from "../../types";
import { FilterDrawer } from "../filters/FilterDrawer";
import { FilterSidebar } from "../filters/FilterSidebar";
import { EmptyState } from "../states/EmptyState";
import { ErrorState } from "../states/ErrorState";
import { ProductGridSkeleton } from "../states/ProductSkeleton";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { ProductCard } from "./ProductCard";
import { SortDropdown } from "./SortDropdown";

export interface CatalogSectionProps {
  status: LoadStatus;
  errorMessage: string | null;
  onRetry: () => void;
  isDemoData: boolean;
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
  results: readonly Product[];
  /** Counts for the category, location and condition facets (each ignores its own filter). */
  facetCounts: FacetCounts;
  categories: readonly CategoryOption[];
  trendingItems: readonly Product[];
  trendingRegionLabel: string;
  isSaved: (id: string) => boolean;
  onToggleSaved: (id: string) => void;
}

export function CatalogSection({
  status,
  errorMessage,
  onRetry,
  isDemoData,
  filters,
  dispatch,
  results,
  facetCounts,
  categories,
  trendingItems,
  trendingRegionLabel,
  isSaved,
  onToggleSaved,
}: CatalogSectionProps): ReactElement {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Any change to the filters starts the list again from the first page.
  useEffect(() => setVisibleCount(PAGE_SIZE), [filters]);

  const chips = getActiveChips(filters);
  const visible = results.slice(0, visibleCount);
  const remaining = results.length - visible.length;

  return (
    <section id="catalog" aria-labelledby="catalog-heading" className="mx-auto max-w-7xl scroll-mt-40 px-4 pt-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <FilterSidebar filters={filters} dispatch={dispatch} facetCounts={facetCounts} categories={categories} activeCount={chips.length} />

        <div className="min-w-0">
          {/* Results toolbar */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="catalog-heading" className="text-2xl font-extrabold tracking-tight text-content sm:text-3xl">
                Fresh listings
              </h2>
              <p className="mt-1 text-sm text-content-muted" aria-live="polite">
                {status === "loading" && "Finding the best deals for you…"}
                {status === "error" && "Listings are unavailable right now."}
                {status === "success" && (
                  <>
                    <span className="font-bold text-content">{results.length}</span> {pluralize(results.length, "item")} found
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-haspopup="dialog"
                className="relative flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold text-content shadow-card hover:border-line-strong lg:hidden"
              >
                <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-content-subtle" />
                Filters
                {chips.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-contrast">
                    {chips.length}
                  </span>
                )}
              </button>
              <SortDropdown value={filters.sort} onChange={(sort) => dispatch({ type: "setSort", sort })} />
            </div>
          </div>

          {isDemoData && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-info/30 bg-info-soft px-3.5 py-2.5 text-xs font-medium text-info">
              <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              Showing demo listings. Add your Supabase credentials in <code className="font-mono">.env</code> to load live items.
            </p>
          )}

          {status === "success" && chips.length > 0 && results.length > 0 && (
            <div className="mt-4">
              <ActiveFilterChips chips={chips} dispatch={dispatch} />
            </div>
          )}

          <div className="mt-6">
            {status === "loading" && <ProductGridSkeleton count={6} />}

            {status === "error" && <ErrorState message={errorMessage ?? "Something went wrong."} onRetry={onRetry} />}

            {status === "success" && results.length === 0 && (
              <EmptyState
                filters={filters}
                dispatch={dispatch}
                trendingItems={trendingItems}
                trendingRegionLabel={trendingRegionLabel}
                isSaved={isSaved}
                onToggleSaved={onToggleSaved}
              />
            )}

            {status === "success" && results.length > 0 && (
              <>
                <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visible.map((product) => (
                    <li key={product.id}>
                      <ProductCard product={product} saved={isSaved(product.id)} onToggleSaved={onToggleSaved} />
                    </li>
                  ))}
                </ul>

                {remaining > 0 && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                      className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-6 py-3 text-sm font-bold text-content shadow-card transition hover:bg-surface-muted"
                    >
                      Show more
                      <span className="font-medium text-content-subtle">({remaining} remaining)</span>
                      <ChevronDown aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        filters={filters}
        dispatch={dispatch}
        facetCounts={facetCounts} categories={categories}
        activeCount={chips.length}
        resultCount={results.length}
      />
    </section>
  );
}
