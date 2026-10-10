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

* No `.env`: the app runs on 24 demo listings (with a simulated 1.2 s load so the skeleton is visible).
* With `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`): it reads the existing `products` table through Supabase REST.
* The legacy table has no category, condition or seller-trust columns. `src/lib/productAdapter.ts` infers category and condition from the text and the region from `location`. Locations in Kampala, Entebbe, Jinja, Mbarara and Gulu map to those regions; anything else (for example the legacy Wakiso or Mukono) maps to `other` and still appears when no region is selected. If you add any of these optional columns, they take precedence:
  `category`, `condition`, `seller_name`, `seller_tier` (`standard | verified | top-rated`), `seller_rating`, `review_count`, `negotiable`, `views`.
  Until `seller_tier` exists, every live seller shows as "Community Seller".
* `whatsapp` numbers are normalised to `256XXXXXXXXX` and drive the "Chat via WhatsApp" (wa.me) and "Call Seller" (tel:) buttons.

## Features (round 2)

* **Regional filters:** Kampala, Entebbe, Jinja, Mbarara and Gulu are multi-select, with live counts that ignore their own facet. Category, condition and verification facets show counts too. The hero select, filter sidebar, footer links and assistant all drive the same reducer state.
* **Price range:** UGX 180,000 to UGX 42,000,000. The slider is cubic so cheap items are not squashed into one end. The two inputs accept `500000`, `500,000`, `500k`, `1.5m` or `UGX 2 million`, validate on blur or Enter and show an error message. Bracket chips set common ranges.
* **Product cards:** `MapPin` + city, `Tag` + category, stateful `Heart` favourite (persisted in `localStorage`), `hover:shadow-lg transition-all duration-300`, WhatsApp and Call buttons.
* **Shopping Assistant:** opened from the header "Assistant" link, the footer or the floating button. It is a **rule-based, simulated assistant** (no network, no LLM): `src/lib/assistant.ts` parses region, category, condition, budget and keywords from the message and ranks the live listings. Suggestion chips are built from the loaded data. "See all N results" applies the same filters to the catalogue.
* **Footer:** navigation columns (marketplace, category, location, support), contact chips (`tel:`, WhatsApp, MoMo), the `mailto:phoenixnewtons.com@gmail.com` anchor and Terms, Privacy, Safety and Prohibited Items dialogs.
  The legal text in `src/data/legal.ts` is a plain-language summary and **must be reviewed by counsel** before launch.
* Demo sellers use the support line `0774803543` (`src/data/contact.ts`).

## Structure

```
src/
  types/            all shared interfaces and union types
  data/             constants (regions, categories, sort, price brackets), demo listings
  lib/              pure logic: filter reducer, filtering/sorting, formatting, adapter, API, links
  hooks/            useProducts, useSavedItems, useAssistant, useTheme, useIsStuck, useHorizontalScroller, ...
  components/
    layout/         Header, Footer
    hero/           Hero (split layout + visual grid), StickySearchBar
    categories/     PopularCategories (horizontal scroller)
    assistant/      AssistantDrawer, AssistantLauncher, AssistantProductRow
    filters/        FilterPanels (5 accordions), FilterSidebar (desktop), FilterDrawer (mobile)
    catalog/        CatalogSection, ProductCard, SortDropdown, ActiveFilterChips
    states/         ProductSkeleton (shimmer), EmptyState, TrendingCarousel, ErrorState
    ui/             Select (ARIA combobox), Accordion, PriceRangeSlider, ChoiceRow, Badges, ...
```

## Design tokens

Components use semantic Tailwind names only (`bg-surface`, `text-content-muted`, `border-line`, `bg-brand`, `bg-whatsapp`, ...). Values are CSS variables in `src/index.css` with a `.dark` override, and `tailwind.config.ts` maps them with alpha support. To rebrand, change the variables in one place. The theme follows the system setting until the user toggles it.

## Linking to the legacy pages

"View Details", login and similar links point to `../product-detail.html?id=...` and so on. Change `VITE_LEGACY_SITE_BASE` if you deploy the storefront somewhere else.
