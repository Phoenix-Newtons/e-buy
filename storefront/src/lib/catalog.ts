import { CATEGORIES, INITIAL_FILTERS, PRICE_BRACKETS, REGIONS, VERIFICATIONS, CONDITIONS } from "../data/constants";
import type {
  ActiveFilterChip,
  FacetCounts,
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
    case "setRegions":
      return { ...state, regions: action.regions };
    case "toggleRegion":
      return { ...state, regions: toggle(state.regions, action.region) };
    case "apply":
      // A patch always starts from a clean slate so old filters never linger invisibly.
      return { ...INITIAL_FILTERS, sort: state.sort, ...action.patch };
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
  if (filters.regions.length > 0 && !(product.region !== "other" && filters.regions.includes(product.region))) return false;
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

/**
 * Listing counts for every option of the category, region and condition facets.
 * Each facet ignores its own filter, so selecting "Kampala" does not zero out the other cities.
 */
export function computeFacetCounts(products: readonly Product[], filters: FilterState): FacetCounts {
  const counts: FacetCounts = {
    category: Object.fromEntries(CATEGORIES.map((item) => [item.id, 0])) as FacetCounts["category"],
    region: Object.fromEntries(REGIONS.map((item) => [item.id, 0])) as FacetCounts["region"],
    condition: Object.fromEntries(CONDITIONS.map((item) => [item.id, 0])) as FacetCounts["condition"],
  };
  const withoutCategory: FilterState = { ...filters, category: "all" };
  const withoutRegion: FilterState = { ...filters, regions: [] };
  const withoutCondition: FilterState = { ...filters, conditions: [] };

  for (const product of products) {
    if (matchesFilters(product, withoutCategory)) counts.category[product.category] += 1;
    if (product.region !== "other" && matchesFilters(product, withoutRegion)) counts.region[product.region] += 1;
    if (matchesFilters(product, withoutCondition)) counts.condition[product.condition] += 1;
  }
  return counts;
}

/** Items to suggest when nothing matches: trending first, boosted if in the user's region. */
export function trendingNearby(
  products: readonly Product[],
  regions: readonly RegionId[],
  limit = 10,
): { items: Product[]; regionLabel: string } {
  const homeRegion: RegionId = regions[0] ?? "kampala";
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
  for (const regionId of filters.regions) {
    const region = REGIONS.find((item) => item.id === regionId);
    chips.push({
      key: `region-${regionId}`,
      label: region?.label ?? regionId,
      action: { type: "toggleRegion", region: regionId },
    });
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
