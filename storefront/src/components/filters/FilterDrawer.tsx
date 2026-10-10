import { useEffect, useRef, type Dispatch, type ReactElement } from "react";
import { RotateCcw, X } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { cn } from "../../lib/cn";
import { pluralize } from "../../lib/format";
import type { CategoryOption, FacetCounts, FilterAction, FilterState } from "../../types";
import { FilterPanels } from "./FilterPanels";

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
  facetCounts: FacetCounts;
  categories: readonly CategoryOption[];
  activeCount: number;
  resultCount: number;
}

/**
 * Mobile / tablet filter modal. Slides in from the left, traps Escape, locks body scroll
 * and returns focus to the element that opened it. Filters apply live, so the footer
 * button simply shows the result count and closes the drawer.
 */
export function FilterDrawer({
  open,
  onClose,
  filters,
  dispatch,
  facetCounts,
  categories,
  activeCount,
  resultCount,
}: FilterDrawerProps): ReactElement {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-[60] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")} inert={!open}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn("absolute inset-0 bg-black/55 transition-opacity duration-300", open ? "opacity-100 backdrop-blur-sm" : "opacity-0")}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-heading"
        className={cn(
          "absolute inset-y-0 left-0 flex w-[min(24rem,92vw)] flex-col bg-surface-raised shadow-float transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id="drawer-heading" className="text-lg font-extrabold text-content">
            Filters
            {activeCount > 0 && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-brand-contrast">{activeCount}</span>}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-content-muted hover:bg-surface-muted"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5">
          <FilterPanels filters={filters} dispatch={dispatch} facetCounts={facetCounts} categories={categories} idPrefix="drawer" />
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-line bg-surface-raised p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => dispatch({ type: "reset" })}
            disabled={activeCount === 0}
            className="flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-bold text-content transition hover:bg-surface-muted disabled:opacity-40"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-brand px-4 py-3 text-sm font-bold text-brand-contrast shadow-card transition hover:bg-brand-hover"
          >
            Show {resultCount} {pluralize(resultCount, "item")}
          </button>
        </div>
      </aside>
    </div>
  );
}
