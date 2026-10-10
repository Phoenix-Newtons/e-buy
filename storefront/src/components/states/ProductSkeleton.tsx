import type { ReactElement } from "react";

/** Mirrors the real card's structure so the layout does not jump when data arrives. */
export function ProductCardSkeleton(): ReactElement {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      <div className="skeleton aspect-video w-full" />
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-28 rounded-full" />
          <div className="skeleton h-4 w-14 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-11/12 rounded-md" />
          <div className="skeleton h-4 w-7/12 rounded-md" />
        </div>
        <div className="skeleton h-7 w-40 rounded-lg" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded-md" />
          <div className="skeleton h-3 w-9/12 rounded-md" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="skeleton h-11 w-full rounded-xl" />
          <div className="flex gap-2">
            <div className="skeleton h-10 flex-1 rounded-xl" />
            <div className="skeleton h-10 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 6 }: ProductGridSkeletonProps): ReactElement {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading listings…</span>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
