import { useCallback, useMemo, useReducer, useState, type ReactElement } from "react";
import { AssistantDrawer } from "./components/assistant/AssistantDrawer";
import { AssistantLauncher } from "./components/assistant/AssistantLauncher";
import { CatalogSection } from "./components/catalog/CatalogSection";
import { PopularCategories } from "./components/categories/PopularCategories";
import { Hero } from "./components/hero/Hero";
import { StickySearchBar } from "./components/hero/StickySearchBar";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { InfoDialog } from "./components/ui/InfoDialog";
import { CATEGORIES, INITIAL_FILTERS } from "./data/constants";
import { LEGAL_DOCUMENTS } from "./data/legal";
import { useAssistant } from "./hooks/useAssistant";
import { useProducts } from "./hooks/useProducts";
import { useSavedItems } from "./hooks/useSavedItems";
import { useTheme } from "./hooks/useTheme";
import { applyFilters, computeFacetCounts, filterReducer, trendingNearby } from "./lib/catalog";
import type { CategoryId, FilterPatch, LegalDocumentId, RegionId } from "./types";

function scrollToCatalog(): void {
  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App(): ReactElement {
  const [filters, dispatch] = useReducer(filterReducer, INITIAL_FILTERS);
  const { status, products, errorMessage, isDemoData, refetch } = useProducts();
  const { theme, toggleTheme } = useTheme();
  const { savedCount, isSaved, toggleSaved } = useSavedItems();
  const assistant = useAssistant(products);

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [legalDocumentId, setLegalDocumentId] = useState<LegalDocumentId | null>(null);

  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const overallCounts = useMemo(() => computeFacetCounts(products, INITIAL_FILTERS), [products]);
  const facetCounts = useMemo(() => computeFacetCounts(products, filters), [products, filters]);
  const trending = useMemo(() => trendingNearby(products, filters.regions), [products, filters.regions]);

  // Only offer categories that actually have listings, so the UI never leads to a dead end.
  const categories = useMemo(
    () => CATEGORIES.filter((category) => overallCounts.category[category.id] > 0 || filters.category === category.id),
    [overallCounts, filters.category],
  );

  const legalDocument = useMemo(
    () => LEGAL_DOCUMENTS.find((document) => document.id === legalDocumentId) ?? null,
    [legalDocumentId],
  );

  const openAssistant = useCallback(() => setAssistantOpen(true), []);
  const closeAssistant = useCallback(() => setAssistantOpen(false), []);
  const closeLegalDocument = useCallback(() => setLegalDocumentId(null), []);

  // Wait one frame after changing filters so the section has re-rendered before scrolling to it.
  const afterFilterChange = useCallback(() => window.requestAnimationFrame(scrollToCatalog), []);

  const pickCategory = useCallback(
    (category: CategoryId | "all") => {
      dispatch({ type: "setCategory", category });
      afterFilterChange();
    },
    [afterFilterChange],
  );

  const pickRegion = useCallback(
    (region: RegionId) => {
      dispatch({ type: "setRegions", regions: [region] });
      afterFilterChange();
    },
    [afterFilterChange],
  );

  const applyAssistantSearch = useCallback(
    (patch: FilterPatch) => {
      dispatch({ type: "apply", patch });
      setAssistantOpen(false);
      afterFilterChange();
    },
    [afterFilterChange],
  );

  return (
    <div className="min-h-screen bg-canvas text-content">
      <Header theme={theme} onToggleTheme={toggleTheme} savedCount={savedCount} onOpenAssistant={openAssistant} />
      <main>
        <Hero categoryCounts={overallCounts.category} onPickCategory={pickCategory} />
        <StickySearchBar
          filters={filters}
          dispatch={dispatch}
          resultCount={results.length}
          categories={categories}
          onSubmit={scrollToCatalog}
        />
        <PopularCategories
          selected={filters.category}
          categories={categories}
          counts={overallCounts.category}
          totalCount={products.length}
          onSelect={pickCategory}
        />
        <CatalogSection
          status={status}
          errorMessage={errorMessage}
          onRetry={refetch}
          isDemoData={isDemoData}
          filters={filters}
          dispatch={dispatch}
          results={results}
          facetCounts={facetCounts}
          categories={categories}
          trendingItems={trending.items}
          trendingRegionLabel={trending.regionLabel}
          isSaved={isSaved}
          onToggleSaved={toggleSaved}
        />
      </main>
      <Footer
        categories={categories}
        onPickCategory={pickCategory}
        onPickRegion={pickRegion}
        onOpenAssistant={openAssistant}
        onOpenDocument={setLegalDocumentId}
      />

      <AssistantLauncher onOpen={openAssistant} hidden={assistantOpen} />
      <AssistantDrawer open={assistantOpen} onClose={closeAssistant} chat={assistant} onApplyPatch={applyAssistantSearch} />
      <InfoDialog document={legalDocument} onClose={closeLegalDocument} />
    </div>
  );
}
