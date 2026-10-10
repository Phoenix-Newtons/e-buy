import { CATEGORIES, INITIAL_FILTERS, PRICE_BRACKETS, REGIONS, VERIFICATIONS, CONDITIONS } from "../data/constants";
import type {
  ActiveFilterChip,
  CategoryId,
  FilterAction,
  FilterState,
  Product,
  RegionId,
  SortKey,
} from "../types";
import { formatUGXCompact } from "./format";

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

function toggle<T>(list: readonly T[], value: T): readonly T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "setKeyword":
      return { ...state, keyword: action.keyword };
    case "setRegion":
      return { ...state, region: action.region };
    case "setCategory":
      return { ...state, category: action.category };
    case "toggleCondition":
      return { ...state, conditions: toggle(state.conditions, action.condition) };
    case "setPriceRange":
      return { ...state, priceMin: action.min, priceMax: action.max };
    case "toggleVerification":
      return { ...state, verifications: toggle(state.verifications, action.verification) };
    case "setSort":
      return { ...state, sort: action.sort };
    case "reset":
      // Sorting is a view preference, not a filter, so it survives a reset.
      return { ...INITIAL_FILTERS, sort: state.sort };
  }
}

/* ------------------------------------------------------------------ */
/* Filtering & sorting                                                 */
/* ------------------------------------------------------------------ */

function matchesKeyword(product: Product, keyword: string): boolean {
  const needle = keyword.trim().toLowerCase();
  if (needle.length === 0) return true;
  const haystack = [
    product.title,
    product.description,
    product.locationLabel,
    product.area,
    product.seller.name,
  ]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

function matchesVerification(product: Product, filters: FilterState): boolean {
  return filters.verifications.every((key) => {
    switch (key) {
      case "verified":
        return product.seller.tier === "verified" || product.seller.tier === "top-rated";
      case "top-rated":
        return product.seller.tier === "top-rated";
      case "delivery":
        return product.delivery !== "pickup";
    }
  });
}

export function matchesFilters(product: Product, filters: FilterState): boolean {
  if (filters.region !== "all" && product.region !== filters.region) return false;
  if (filters.category !== "all" && product.category !== filters.category) return false;
  if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) return false;
  if (product.priceUgx < filters.priceMin) return false;
  if (filters.priceMax !== null && product.priceUgx > filters.priceMax) return false;
  if (!matchesVerification(product, filters)) return false;
  return matchesKeyword(product, filters.keyword);
}

const compareBy: Record<SortKey, (a: Product, b: Product) => number> = {
  newest: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  trending: (a, b) => b.trendingScore - a.trendingScore,
  "price-asc": (a, b) => a.priceUgx - b.priceUgx,
  "price-desc": (a, b) => b.priceUgx - a.priceUgx,
  "top-rated": (a, b) => (b.seller.rating ?? 0) - (a.seller.rating ?? 0) || b.seller.reviewCount - a.seller.reviewCount,
};

export function applyFilters(products: readonly Product[], filters: FilterState): Product[] {
  return products.filter((product) => matchesFilters(product, filters)).sort(compareBy[filters.sort]);
}

/** Per-category listing counts, ignoring the category filter itself so counts stay stable. */
export function countByCategory(products: readonly Product[], filters: FilterState): Record<CategoryId, number> {
  const counts = Object.fromEntries(CATEGORIES.map((category) => [category.id, 0])) as Record<CategoryId, number>;
  const withoutCategory: FilterState = { ...filters, category: "all" };
  for (const product of products) {
    if (matchesFilters(product, withoutCategory)) counts[product.category] += 1;
  }
  return counts;
}

/** Items to suggest when nothing matches: trending first, boosted if in the user's region. */
export function trendingNearby(
  products: readonly Product[],
  region: RegionId | "all",
  limit = 10,
): { items: Product[]; regionLabel: string } {
  const homeRegion: RegionId = region === "all" ? "kampala" : region;
  const regionLabel = REGIONS.find((item) => item.id === homeRegion)?.label ?? "Kampala";
  const score = (product: Product): number => product.trendingScore + (product.region === homeRegion ? 10_000 : 0);
  const items = [...products].sort((a, b) => score(b) - score(a)).slice(0, limit);
  return { items, regionLabel };
}

/* ------------------------------------------------------------------ */
/* Active filter summaries                                             */
/* ------------------------------------------------------------------ */

export function describePriceRange(min: number, max: number | null): string {
  const bracket = PRICE_BRACKETS.find((item) => item.min === min && item.max === max);
  if (bracket) return bracket.label;
  if (max === null) return `Over ${formatUGXCompact(min)}`;
  if (min === 0) return `Under ${formatUGXCompact(max)}`;
  return `${formatUGXCompact(min)} – ${formatUGXCompact(max)}`;
}

export function isPriceFilterActive(filters: Pick<FilterState, "priceMin" | "priceMax">): boolean {
  return filters.priceMin > 0 || filters.priceMax !== null;
}

export function getActiveChips(filters: FilterState): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  if (filters.keyword.trim().length > 0) {
    chips.push({ key: "keyword", label: `“${filters.keyword.trim()}”`, action: { type: "setKeyword", keyword: "" } });
  }
  if (filters.region !== "all") {
    const region = REGIONS.find((item) => item.id === filters.region);
    chips.push({ key: "region", label: region?.label ?? filters.region, action: { type: "setRegion", region: "all" } });
  }
  if (filters.category !== "all") {
    const category = CATEGORIES.find((item) => item.id === filters.category);
    chips.push({
      key: "category",
      label: category?.label ?? filters.category,
      action: { type: "setCategory", category: "all" },
    });
  }
  for (const condition of filters.conditions) {
    const option = CONDITIONS.find((item) => item.id === condition);
    chips.push({
      key: `condition-${condition}`,
      label: option?.label ?? condition,
      action: { type: "toggleCondition", condition },
    });
  }
  if (isPriceFilterActive(filters)) {
    chips.push({
      key: "price",
      label: describePriceRange(filters.priceMin, filters.priceMax),
      action: { type: "setPriceRange", min: 0, max: null },
    });
  }
  for (const verification of filters.verifications) {
    const option = VERIFICATIONS.find((item) => item.id === verification);
    chips.push({
      key: `verification-${verification}`,
      label: option?.label ?? verification,
      action: { type: "toggleVerification", verification },
    });
  }
  return chips;
}
