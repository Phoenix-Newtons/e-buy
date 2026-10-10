import { useMemo, useState, type Dispatch, type FormEvent, type ReactElement } from "react";
import { Banknote, Compass, LayoutGrid, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { PRICE_BRACKETS, REGIONS } from "../../data/constants";
import { useIsStuck } from "../../hooks/useIsStuck";
import { describePriceRange } from "../../lib/catalog";
import { cn } from "../../lib/cn";
import type { CategoryId, CategoryOption, FilterAction, FilterState, RegionId } from "../../types";
import { Select, type SelectOption } from "../ui/Select";

export interface StickySearchBarProps {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
  resultCount: number;
  /** Categories that have listings. */
  categories: readonly CategoryOption[];
  /** Called after the form is submitted, e.g. to scroll to the results. */
  onSubmit: () => void;
}

const HEADER_HEIGHT = 64;
const CUSTOM_PRICE_ID = "custom";
const MULTIPLE_REGIONS_ID = "multiple";

type RegionChoice = RegionId | "all" | typeof MULTIPLE_REGIONS_ID;

const BASE_REGION_OPTIONS: readonly SelectOption<RegionChoice>[] = [
  { value: "all", label: "All of Uganda", description: "Every district", icon: Compass },
  ...REGIONS.map((region): SelectOption<RegionChoice> => ({
    value: region.id,
    label: region.label,
    description: `${region.subregion} Region`,
    icon: MapPin,
  })),
];

export function StickySearchBar({ filters, dispatch, resultCount, categories, onSubmit }: StickySearchBarProps): ReactElement {
  const { ref, isStuck } = useIsStuck<HTMLDivElement>(HEADER_HEIGHT);
  const [expanded, setExpanded] = useState(false);

  const matchingBracket = PRICE_BRACKETS.find((bracket) => bracket.min === filters.priceMin && bracket.max === filters.priceMax);

  const priceOptions = useMemo((): readonly SelectOption<string>[] => {
    const options: SelectOption<string>[] = PRICE_BRACKETS.map((bracket) => ({ value: bracket.id, label: bracket.label }));
    if (!matchingBracket) {
      options.push({ value: CUSTOM_PRICE_ID, label: describePriceRange(filters.priceMin, filters.priceMax), description: "Custom range" });
    }
    return options;
  }, [matchingBracket, filters.priceMin, filters.priceMax]);

  const categoryOptions = useMemo(
    (): readonly SelectOption<CategoryId | "all">[] => [
      { value: "all", label: "All categories", icon: LayoutGrid },
      ...categories.map((category): SelectOption<CategoryId | "all"> => ({ value: category.id, label: category.label, icon: category.icon })),
    ],
    [categories],
  );

  // The sidebar allows several districts at once; the quick select shows "N locations" in that case.
  const regionOptions = useMemo((): readonly SelectOption<RegionChoice>[] => {
    if (filters.regions.length < 2) return BASE_REGION_OPTIONS;
    return [...BASE_REGION_OPTIONS, { value: MULTIPLE_REGIONS_ID, label: `${filters.regions.length} locations`, description: "Chosen in filters", icon: MapPin }];
  }, [filters.regions.length]);

  const regionValue: RegionChoice = filters.regions.length === 0 ? "all" : filters.regions.length === 1 ? (filters.regions[0] ?? "all") : MULTIPLE_REGIONS_ID;

  const handleRegionChange = (choice: RegionChoice): void => {
    if (choice === MULTIPLE_REGIONS_ID) return;
    dispatch({ type: "setRegions", regions: choice === "all" ? [] : [choice] });
  };

  const handlePriceChange = (id: string): void => {
    const bracket = PRICE_BRACKETS.find((item) => item.id === id);
    if (bracket) dispatch({ type: "setPriceRange", min: bracket.min, max: bracket.max });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setExpanded(false);
    onSubmit();
  };

  const advancedFilterCount =
    (filters.regions.length > 0 ? 1 : 0) + (filters.category !== "all" ? 1 : 0) + (matchingBracket?.id === "any" ? 0 : 1);

  return (
    <div
      ref={ref}
      className={cn(
        "sticky top-16 z-30 -mt-10 px-4 transition-[background-color,box-shadow,padding] duration-200 sm:px-6",
        isStuck ? "border-b border-line bg-surface/90 py-3 shadow-card backdrop-blur-md" : "py-0",
      )}
    >
      <form
        role="search"
        aria-label="Search listings"
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl rounded-2xl border border-line bg-surface p-2 shadow-float"
      >
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 lg:flex-[1.4]">
            <label htmlFor="keyword-search" className="sr-only">
              Search for items, brands or locations
            </label>
            <div className="relative flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-content-subtle" />
              <input
                id="keyword-search"
                type="search"
                value={filters.keyword}
                onChange={(event) => dispatch({ type: "setKeyword", keyword: event.target.value })}
                placeholder="Search phones, cars, sofas, land…"
                autoComplete="off"
                enterKeyHint="search"
                className="h-12 w-full rounded-xl bg-surface-muted pl-11 pr-10 text-[15px] font-medium text-content placeholder:text-content-subtle focus-visible:ring-offset-0 [&::-webkit-search-cancel-button]:hidden"
              />
              {filters.keyword.length > 0 && (
                <button
                  type="button"
                  aria-label="Clear search text"
                  onClick={() => dispatch({ type: "setKeyword", keyword: "" })}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-content-subtle hover:bg-line hover:text-content"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile: reveal the quick filters */}
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="quick-filters"
              onClick={() => setExpanded((value) => !value)}
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-content hover:bg-surface-muted lg:hidden"
            >
              <SlidersHorizontal aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Quick filters</span>
              {advancedFilterCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-brand-contrast">
                  {advancedFilterCount}
                </span>
              )}
            </button>
          </div>

          <div
            id="quick-filters"
            className={cn(
              "grid-cols-1 gap-1 sm:grid-cols-3 lg:flex lg:flex-[2] lg:items-center lg:divide-x lg:divide-line",
              expanded ? "grid" : "hidden lg:flex",
            )}
          >
            <Select<RegionChoice>
              label="Region"
              icon={MapPin}
              options={regionOptions}
              value={regionValue}
              onChange={handleRegionChange}
              className="lg:flex-1 lg:pl-1"
            />
            <Select<CategoryId | "all">
              label="Category"
              icon={LayoutGrid}
              options={categoryOptions}
              value={filters.category}
              onChange={(category) => dispatch({ type: "setCategory", category })}
              className="lg:flex-1 lg:pl-1"
            />
            <Select<string>
              label="Price range"
              icon={Banknote}
              options={priceOptions}
              value={matchingBracket?.id ?? CUSTOM_PRICE_ID}
              onChange={handlePriceChange}
              align="right"
              className="lg:flex-1 lg:pl-1"
            />
          </div>

          <button
            type="submit"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-7 text-[15px] font-bold text-brand-contrast shadow-card transition-colors hover:bg-brand-hover lg:shrink-0"
          >
            <Search aria-hidden="true" className="h-[18px] w-[18px]" />
            <span>Search</span>
            <span className="sr-only">, {resultCount} results currently match</span>
          </button>
        </div>
      </form>
    </div>
  );
}
