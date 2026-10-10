import { useCallback, useMemo, useReducer, type ReactElement } from "react";
import { CatalogSection } from "./components/catalog/CatalogSection";
import { PopularCategories } from "./components/categories/PopularCategories";
import { Hero } from "./components/hero/Hero";
import { StickySearchBar } from "./components/hero/StickySearchBar";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { INITIAL_FILTERS } from "./data/constants";
import { useProducts } from "./hooks/useProducts";
import { useSavedItems } from "./hooks/useSavedItems";
import { useTheme } from "./hooks/useTheme";
import { applyFilters, countByCategory, filterReducer, trendingNearby } from "./lib/catalog";
import type { CategoryId } from "./types";

function scrollToCatalog(): void {
  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App(): ReactElement {
  const [filters, dispatch] = useReducer(filterReducer, INITIAL_FILTERS);
  const { status, products, errorMessage, isDemoData, refetch } = useProducts();
  const { theme, toggleTheme } = useTheme();
  const { savedCount, isSaved, toggleSaved } = useSavedItems();

  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const overallCounts = useMemo(() => countByCategory(products, INITIAL_FILTERS), [products]);
  const sidebarCounts = useMemo(() => countByCategory(products, filters), [products, filters]);
  const trending = useMemo(() => trendingNearby(products, filters.region), [products, filters.region]);

  const pickCategory = useCallback((category: CategoryId | "all") => {
    dispatch({ type: "setCategory", category });
    // Wait one frame so the section has re-rendered before measuring the scroll target.
    window.requestAnimationFrame(scrollToCatalog);
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-content">
      <Header theme={theme} onToggleTheme={toggleTheme} savedCount={savedCount} />
      <main>
        <Hero categoryCounts={overallCounts} onPickCategory={pickCategory} />
        <StickySearchBar filters={filters} dispatch={dispatch} resultCount={results.length} onSubmit={scrollToCatalog} />
        <PopularCategories selected={filters.category} counts={overallCounts} totalCount={products.length} onSelect={pickCategory} />
        <CatalogSection
          status={status}
          errorMessage={errorMessage}
          onRetry={refetch}
          isDemoData={isDemoData}
          filters={filters}
          dispatch={dispatch}
          results={results}
          categoryCounts={sidebarCounts}
          trendingItems={trending.items}
          trendingRegionLabel={trending.regionLabel}
          isSaved={isSaved}
          onToggleSaved={toggleSaved}
        />
      </main>
      <Footer />
    </div>
  );
}
