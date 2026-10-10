# E-Buy Uganda Storefront

React 19 + TypeScript (strict) + Tailwind CSS 3 + Lucide React. It is a self-contained Vite app that sits next to the legacy static pages and does not change them.

```bash
cd storefront
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # outputs storefront/dist (relative asset paths)
```

## Data

* No `.env`: the app runs on 22 demo listings (with a simulated 1.2 s load so the skeleton is visible).
* With `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`): it reads the existing `products` table through Supabase REST.
* The legacy table has no category, condition or seller-trust columns. `src/lib/productAdapter.ts` infers category and condition from the text and the region from `location`. If you add any of these optional columns, they take precedence:
  `category`, `condition`, `seller_name`, `seller_tier` (`standard | verified | top-rated`), `seller_rating`, `review_count`, `negotiable`, `views`.
  Until `seller_tier` exists, every live seller shows as "Community Seller".
* `whatsapp` numbers are normalised to `256XXXXXXXXX` and drive the "Chat via WhatsApp" (wa.me) and "Call Seller" (tel:) buttons.

## Structure

```
src/
  types/            all shared interfaces and union types
  data/             constants (regions, categories, sort, price brackets), demo listings
  lib/              pure logic: filter reducer, filtering/sorting, formatting, adapter, API, links
  hooks/            useProducts, useSavedItems, useTheme, useIsStuck, useHorizontalScroller, ...
  components/
    layout/         Header, Footer
    hero/           Hero (split layout + visual grid), StickySearchBar
    categories/     PopularCategories (horizontal scroller)
    filters/        FilterPanels (4 accordions), FilterSidebar (desktop), FilterDrawer (mobile)
    catalog/        CatalogSection, ProductCard, SortDropdown, ActiveFilterChips
    states/         ProductSkeleton (shimmer), EmptyState, TrendingCarousel, ErrorState
    ui/             Select (ARIA combobox), Accordion, PriceRangeSlider, ChoiceRow, Badges, ...
```

## Design tokens

Components use semantic Tailwind names only (`bg-surface`, `text-content-muted`, `border-line`, `bg-brand`, `bg-whatsapp`, ...). Values are CSS variables in `src/index.css` with a `.dark` override, and `tailwind.config.ts` maps them with alpha support. To rebrand, change the variables in one place. The theme follows the system setting until the user toggles it.

## Linking to the legacy pages

"View Details", login and similar links point to `../product-detail.html?id=...` and so on. Change `VITE_LEGACY_SITE_BASE` if you deploy the storefront somewhere else.
