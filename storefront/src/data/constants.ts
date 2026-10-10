import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Award,
  BadgeCheck,
  Briefcase,
  Car,
  Clock,
  Flame,
  House,
  Shirt,
  Smartphone,
  Sofa,
  Star,
  Truck,
  Tv,
  Wheat,
} from "lucide-react";
import type {
  CategoryOption,
  CategoryTone,
  ConditionOption,
  FilterState,
  PriceBracket,
  RegionOption,
  SortOption,
  VerificationOption,
} from "../types";

export const REGIONS: readonly RegionOption[] = [
  { id: "kampala", label: "Kampala", subregion: "Central" },
  { id: "wakiso", label: "Wakiso", subregion: "Central" },
  { id: "mukono", label: "Mukono", subregion: "Central" },
  { id: "jinja", label: "Jinja", subregion: "Eastern" },
  { id: "mbale", label: "Mbale", subregion: "Eastern" },
  { id: "mbarara", label: "Mbarara", subregion: "Western" },
  { id: "gulu", label: "Gulu", subregion: "Northern" },
];

export const CATEGORIES: readonly CategoryOption[] = [
  {
    id: "phones",
    label: "Phones & Tablets",
    icon: Smartphone,
    tone: "sky",
    keywords: ["phone", "iphone", "samsung", "tecno", "infinix", "itel", "xiaomi", "redmi", "tablet", "ipad", "airpods"],
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: Tv,
    tone: "violet",
    keywords: ["tv", "television", "laptop", "macbook", "computer", "speaker", "playstation", "ps5", "camera", "fridge", "microwave", "printer", "decoder"],
  },
  {
    id: "vehicles",
    label: "Vehicles",
    icon: Car,
    tone: "rose",
    keywords: ["car", "toyota", "subaru", "honda", "motorcycle", "boda", "bike", "truck", "rav4", "premio", "vitz", "noah"],
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: Shirt,
    tone: "pink",
    keywords: ["shirt", "dress", "shoe", "sneaker", "jacket", "kitenge", "gomesi", "suit", "handbag", "bag", "watch", "jeans"],
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: House,
    tone: "orange",
    keywords: ["house", "land", "plot", "apartment", "rental", "acre", "bedroom", "mailo", "hostel"],
  },
  {
    id: "furniture",
    label: "Home & Furniture",
    icon: Sofa,
    tone: "amber",
    keywords: ["sofa", "bed", "mattress", "wardrobe", "table", "chair", "cabinet", "couch", "shelf", "carpet"],
  },
  {
    id: "agriculture",
    label: "Agriculture",
    icon: Wheat,
    tone: "lime",
    keywords: ["seed", "seedling", "fertilizer", "tractor", "goat", "cow", "chicken", "poultry", "maize", "coffee", "farm", "irrigation"],
  },
  {
    id: "services",
    label: "Jobs & Services",
    icon: Briefcase,
    tone: "teal",
    keywords: ["service", "repair", "cleaning", "tutor", "plumber", "electrician", "catering", "photography", "job", "hire"],
  },
];

export const CONDITIONS: readonly ConditionOption[] = [
  { id: "new", label: "Brand New", description: "Sealed or never used" },
  { id: "refurbished", label: "Refurbished", description: "Tested and restored" },
  { id: "used", label: "Used", description: "Pre-owned, working" },
];

export const VERIFICATIONS: readonly VerificationOption[] = [
  {
    id: "verified",
    label: "Verified sellers",
    description: "ID and phone number checked",
    icon: BadgeCheck,
  },
  {
    id: "top-rated",
    label: "Top rated sellers",
    description: "4.5+ stars from many buyers",
    icon: Award,
  },
  {
    id: "delivery",
    label: "Delivery available",
    description: "Seller can deliver to you",
    icon: Truck,
  },
];

export const SORT_OPTIONS: readonly SortOption[] = [
  { id: "newest", label: "Newest first", icon: Clock },
  { id: "trending", label: "Trending now", icon: Flame },
  { id: "price-asc", label: "Price: Low to High", icon: ArrowUpNarrowWide },
  { id: "price-desc", label: "Price: High to Low", icon: ArrowDownWideNarrow },
  { id: "top-rated", label: "Best rated sellers", icon: Star },
];

/** Upper bound of the price slider. A slider value at this bound means "no limit". */
export const PRICE_CEILING = 20_000_000;

export const PRICE_BRACKETS: readonly PriceBracket[] = [
  { id: "any", label: "Any price", min: 0, max: null },
  { id: "under-100k", label: "Under UGX 100,000", min: 0, max: 100_000 },
  { id: "100k-500k", label: "UGX 100,000 – 500,000", min: 100_000, max: 500_000 },
  { id: "500k-2m", label: "UGX 500,000 – 2M", min: 500_000, max: 2_000_000 },
  { id: "2m-10m", label: "UGX 2M – 10M", min: 2_000_000, max: 10_000_000 },
  { id: "10m-plus", label: "Over UGX 10M", min: 10_000_000, max: null },
];

export const INITIAL_FILTERS: FilterState = {
  keyword: "",
  region: "all",
  category: "all",
  conditions: [],
  priceMin: 0,
  priceMax: null,
  verifications: [],
  sort: "newest",
};

/** Number of listings revealed at a time before the "Show more" button. */
export const PAGE_SIZE = 9;

/**
 * Tailwind needs complete class names at build time, so each tone lists them in full.
 * `badge` styles the icon tile, `active` styles it when its category is selected.
 */
export const CATEGORY_TONE_CLASSES: Record<CategoryTone, { badge: string; active: string; glow: string }> = {
  sky: {
    badge: "bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30",
    active: "bg-sky-600 text-white ring-sky-600 dark:bg-sky-500 dark:text-sky-950 dark:ring-sky-400",
    glow: "from-sky-500/25 to-sky-500/0",
  },
  violet: {
    badge: "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/30",
    active: "bg-violet-600 text-white ring-violet-600 dark:bg-violet-500 dark:text-violet-950 dark:ring-violet-400",
    glow: "from-violet-500/25 to-violet-500/0",
  },
  rose: {
    badge: "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30",
    active: "bg-rose-600 text-white ring-rose-600 dark:bg-rose-500 dark:text-rose-950 dark:ring-rose-400",
    glow: "from-rose-500/25 to-rose-500/0",
  },
  pink: {
    badge: "bg-pink-100 text-pink-700 ring-pink-200 dark:bg-pink-500/15 dark:text-pink-300 dark:ring-pink-500/30",
    active: "bg-pink-600 text-white ring-pink-600 dark:bg-pink-500 dark:text-pink-950 dark:ring-pink-400",
    glow: "from-pink-500/25 to-pink-500/0",
  },
  orange: {
    badge: "bg-orange-100 text-orange-700 ring-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-500/30",
    active: "bg-orange-600 text-white ring-orange-600 dark:bg-orange-500 dark:text-orange-950 dark:ring-orange-400",
    glow: "from-orange-500/25 to-orange-500/0",
  },
  amber: {
    badge: "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
    active: "bg-amber-500 text-amber-950 ring-amber-500 dark:bg-amber-400 dark:text-amber-950 dark:ring-amber-300",
    glow: "from-amber-500/25 to-amber-500/0",
  },
  lime: {
    badge: "bg-lime-100 text-lime-800 ring-lime-200 dark:bg-lime-500/15 dark:text-lime-300 dark:ring-lime-500/30",
    active: "bg-lime-600 text-white ring-lime-600 dark:bg-lime-500 dark:text-lime-950 dark:ring-lime-400",
    glow: "from-lime-500/25 to-lime-500/0",
  },
  teal: {
    badge: "bg-teal-100 text-teal-700 ring-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:ring-teal-500/30",
    active: "bg-teal-600 text-white ring-teal-600 dark:bg-teal-500 dark:text-teal-950 dark:ring-teal-400",
    glow: "from-teal-500/25 to-teal-500/0",
  },
};
