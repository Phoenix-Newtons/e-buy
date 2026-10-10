import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Domain primitives                                                   */
/* ------------------------------------------------------------------ */

export type RegionId = "kampala" | "entebbe" | "jinja" | "mbarara" | "gulu";

/** `other` is used when a listing's free-text location matches no known district. */
export type ProductRegion = RegionId | "other";

export type CategoryId =
  | "phones"
  | "electronics"
  | "vehicles"
  | "fashion"
  | "real-estate"
  | "furniture"
  | "agriculture"
  | "services";

export type Condition = "new" | "refurbished" | "used";

export type SellerTier = "standard" | "verified" | "top-rated";

export type VerificationKey = "verified" | "top-rated" | "delivery";

export type DeliveryMode = "delivery" | "pickup" | "both";

export type SortKey = "newest" | "price-asc" | "price-desc" | "top-rated" | "trending";

export type CategoryTone =
  | "sky"
  | "violet"
  | "rose"
  | "pink"
  | "orange"
  | "amber"
  | "lime"
  | "teal";

/* ------------------------------------------------------------------ */
/* Reference data                                                      */
/* ------------------------------------------------------------------ */

export interface RegionOption {
  id: RegionId;
  label: string;
  /** Uganda's administrative region, shown on cards as "Kampala, Central". */
  subregion: "Central" | "Eastern" | "Western" | "Northern";
}

export interface CategoryOption {
  id: CategoryId;
  label: string;
  /** One-word label for compact badges, e.g. "Phones". */
  shortLabel: string;
  icon: LucideIcon;
  tone: CategoryTone;
  /** Lower-case keywords used to infer a category for legacy listings. */
  keywords: readonly string[];
}

export interface ConditionOption {
  id: Condition;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface VerificationOption {
  id: VerificationKey;
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface SortOption {
  id: SortKey;
  label: string;
  icon: LucideIcon;
}

export interface PriceBracket {
  id: string;
  label: string;
  min: number;
  /** `null` means "no upper limit". */
  max: number | null;
}

/* ------------------------------------------------------------------ */
/* Listings                                                            */
/* ------------------------------------------------------------------ */

export interface Seller {
  id: string;
  name: string;
  tier: SellerTier;
  /** 0 to 5. `null` when the seller has no reviews yet. */
  rating: number | null;
  reviewCount: number;
  /** E.164 digits without a plus sign, e.g. "256700123456". `null` if absent. */
  phone: string | null;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  /** Price in Ugandan Shillings (whole shillings). */
  priceUgx: number;
  negotiable: boolean;
  category: CategoryId;
  condition: Condition;
  region: ProductRegion;
  /** Neighbourhood or town, e.g. "Kisaasi". */
  area: string;
  /** Human readable badge text, e.g. "Kampala, Central". */
  locationLabel: string;
  imageUrl: string | null;
  delivery: DeliveryMode;
  seller: Seller;
  /** ISO timestamp. */
  createdAt: string;
  /** Rolling interest score used for "Trending" ordering. */
  trendingScore: number;
}

/** Row shape of the existing Supabase `products` table (plus optional new columns). */
export interface ProductRow {
  id: string | number;
  title: string | null;
  description: string | null;
  price: number | string | null;
  location: string | null;
  whatsapp: string | null;
  delivery_mode: string | null;
  image_url: string | null;
  created_at: string | null;
  user_id?: string | null;
  // Optional columns. When present they override the inferred values.
  category?: string | null;
  condition?: string | null;
  seller_name?: string | null;
  seller_tier?: string | null;
  seller_rating?: number | string | null;
  review_count?: number | string | null;
  negotiable?: boolean | null;
  views?: number | string | null;
}

/* ------------------------------------------------------------------ */
/* Filters                                                             */
/* ------------------------------------------------------------------ */

export interface FilterState {
  keyword: string;
  /** Selected districts. An empty list means "all of Uganda". */
  regions: readonly RegionId[];
  category: CategoryId | "all";
  conditions: readonly Condition[];
  priceMin: number;
  /** `null` means "no upper limit". */
  priceMax: number | null;
  verifications: readonly VerificationKey[];
  sort: SortKey;
}

/** Any subset of the filters, used by the shopping assistant to apply a search in one step. */
export type FilterPatch = Partial<FilterState>;

export type FilterAction =
  | { type: "setKeyword"; keyword: string }
  | { type: "setRegions"; regions: readonly RegionId[] }
  | { type: "toggleRegion"; region: RegionId }
  | { type: "apply"; patch: FilterPatch }
  | { type: "setCategory"; category: CategoryId | "all" }
  | { type: "toggleCondition"; condition: Condition }
  | { type: "setPriceRange"; min: number; max: number | null }
  | { type: "toggleVerification"; verification: VerificationKey }
  | { type: "setSort"; sort: SortKey }
  | { type: "reset" };

/** A removable summary of one active filter, rendered as a chip. */
export interface ActiveFilterChip {
  key: string;
  label: string;
  action: FilterAction;
}

/** Number of listings per option of each facet, each ignoring that facet's own filter. */
export interface FacetCounts {
  category: Record<CategoryId, number>;
  region: Record<RegionId, number>;
  condition: Record<Condition, number>;
}

/* ------------------------------------------------------------------ */
/* Shopping assistant                                                  */
/* ------------------------------------------------------------------ */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  /** Listings the assistant is recommending (assistant messages only). */
  products: readonly Product[];
  /** Total matches, which may exceed `products.length`. */
  totalMatches: number;
  /** Filters that reproduce this search in the main catalog. */
  patch: FilterPatch | null;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Legal documents                                                     */
/* ------------------------------------------------------------------ */

export type LegalDocumentId = "terms" | "privacy" | "safety";

export interface LegalSection {
  heading: string;
  body: readonly string[];
}

export interface LegalDocument {
  id: LegalDocumentId;
  title: string;
  summary: string;
  sections: readonly LegalSection[];
}

/* ------------------------------------------------------------------ */
/* Data loading                                                        */
/* ------------------------------------------------------------------ */

export type LoadStatus = "loading" | "success" | "error";

export interface ProductsResult {
  status: LoadStatus;
  products: readonly Product[];
  errorMessage: string | null;
  /** True when demo listings are shown because Supabase is not configured. */
  isDemoData: boolean;
  refetch: () => void;
}
