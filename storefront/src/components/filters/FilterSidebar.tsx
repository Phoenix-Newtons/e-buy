import type { Dispatch, ReactElement } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { CategoryId, FilterAction, FilterState } from "../../types";
import { FilterPanels } from "./FilterPanels";

export interface FilterSidebarProps {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
  categoryCounts: Readonly<Record<CategoryId, number>>;
  activeCount: number;
}

/** Desktop filter column. Hidden below `lg`, where the drawer takes over. */
export function FilterSidebar({ filters, dispatch, categoryCounts, activeCount }: FilterSidebarProps): ReactElement {
  return (
    <aside
      aria-labelledby="filters-heading"
      className="sticky top-44 hidden max-h-[calc(100vh-12rem)] overflow-y-auto rounded-3xl border border-line bg-surface p-5 shadow-card lg:block"
    >
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h2 id="filters-heading" className="flex items-center gap-2 text-base font-extrabold text-content">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-brand" />
          Filters
        </h2>
        <button
          type="button"
          onClick={() => dispatch({ type: "reset" })}
          disabled={activeCount === 0}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-brand-soft-content transition hover:bg-brand-soft disabled:pointer-events-none disabled:opacity-40"
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>
      <FilterPanels filters={filters} dispatch={dispatch} categoryCounts={categoryCounts} idPrefix="desktop" />
    </aside>
  );
}
