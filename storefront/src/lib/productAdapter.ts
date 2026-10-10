import { CATEGORIES, CONDITIONS, REGIONS } from "../data/constants";
import type {
  CategoryId,
  Condition,
  DeliveryMode,
  Product,
  ProductRegion,
  ProductRow,
  SellerTier,
} from "../types";
import { normalizeUgandanPhone } from "./format";

/**
 * Converts raw Supabase `products` rows into the strictly typed `Product` the UI uses.
 *
 * The legacy table stores only title, description, price, location, whatsapp,
 * delivery_mode and image_url. Everything else (category, condition, region,
 * seller trust) is taken from optional columns when they exist, and otherwise
 * inferred conservatively, so older listings still render sensibly.
 */

const CATEGORY_IDS: readonly string[] = CATEGORIES.map((category) => category.id);
const CONDITION_IDS: readonly string[] = CONDITIONS.map((condition) => condition.id);

function toNumber(value: number | string | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const parsed = typeof value === "number" ? value : Number.parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function inferCondition(text: string, explicit?: string | null): Condition {
  const normalized = explicit?.toLowerCase().trim().replace(/\s+/g, "-");
  if (normalized === "brand-new") return "new";
  if (normalized && CONDITION_IDS.includes(normalized)) return normalized as Condition;

  const lower = text.toLowerCase();
  if (/\b(refurb|refurbished|renewed|restored)\b/.test(lower)) return "refurbished";
  if (/\b(new|brand new|sealed|unopened)\b/.test(lower) && !/\b(like new|almost new|nearly new)\b/.test(lower)) {
    return "new";
  }
  return "used";
}

export function inferCategory(text: string, explicit?: string | null): CategoryId {
  const normalized = explicit?.toLowerCase().trim().replace(/[\s_&]+/g, "-");
  if (normalized && CATEGORY_IDS.includes(normalized)) return normalized as CategoryId;

  const lower = text.toLowerCase();
  let best: { id: CategoryId; hits: number } | null = null;
  for (const category of CATEGORIES) {
    const hits = category.keywords.filter((keyword) => new RegExp(`\\b${escapeRegExp(keyword)}`).test(lower)).length;
    if (hits > 0 && (best === null || hits > best.hits)) best = { id: category.id, hits };
  }
  return best?.id ?? "electronics";
}

export function parseLocation(raw: string | null | undefined): {
  region: ProductRegion;
  area: string;
  locationLabel: string;
} {
  const location = (raw ?? "").trim();
  const lower = location.toLowerCase();
  const region = REGIONS.find((item) => lower.includes(item.label.toLowerCase()));

  if (!region) {
    return { region: "other", area: location, locationLabel: location.length > 0 ? location : "Uganda" };
  }

  const area = location
    .replace(new RegExp(escapeRegExp(region.label), "i"), "")
    .replace(/^[\s,\-–—/]+|[\s,\-–—/]+$/g, "");
  return { region: region.id, area, locationLabel: `${region.label}, ${region.subregion}` };
}

function parseImage(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      const first = parsed.find((entry): entry is string => typeof entry === "string" && entry.length > 0);
      return first ?? null;
    }
    if (typeof parsed === "string" && parsed.startsWith("http")) return parsed;
  } catch {
    // Not JSON: fall through and treat it as a plain URL.
  }
  return trimmed.startsWith("http") ? trimmed : null;
}

function parseDelivery(raw: string | null | undefined): DeliveryMode {
  const lower = (raw ?? "").toLowerCase();
  const hasPickup = /pick/.test(lower);
  const hasDelivery = /deliver/.test(lower);
  if (hasPickup && hasDelivery) return "both";
  if (hasPickup) return "pickup";
  return "delivery";
}

function parseTier(raw: string | null | undefined): SellerTier {
  const normalized = raw?.toLowerCase().trim().replace(/[\s_]+/g, "-");
  if (normalized === "verified" || normalized === "top-rated") return normalized;
  return "standard";
}

export function rowToProduct(row: ProductRow): Product {
  const title = (row.title ?? "").trim() || "Untitled listing";
  const description = (row.description ?? "").trim();
  const searchable = `${title} ${description}`;
  const location = parseLocation(row.location);
  const rating = toNumber(row.seller_rating, Number.NaN);

  return {
    id: String(row.id),
    title,
    description,
    priceUgx: Math.max(0, toNumber(row.price)),
    negotiable: row.negotiable ?? /negotiable|nego\b/i.test(searchable),
    category: inferCategory(searchable, row.category),
    condition: inferCondition(searchable, row.condition),
    region: location.region,
    area: location.area,
    locationLabel: location.locationLabel,
    imageUrl: parseImage(row.image_url),
    delivery: parseDelivery(row.delivery_mode),
    seller: {
      id: row.user_id ?? `seller-${row.id}`,
      name: row.seller_name?.trim() || "E-Buy seller",
      tier: parseTier(row.seller_tier),
      rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : null,
      reviewCount: Math.max(0, Math.round(toNumber(row.review_count))),
      phone: normalizeUgandanPhone(row.whatsapp),
    },
    createdAt: row.created_at ?? new Date(0).toISOString(),
    trendingScore: Math.max(0, Math.round(toNumber(row.views))),
  };
}
