import { CATEGORIES, CONDITIONS, INITIAL_FILTERS, REGIONS } from "../data/constants";
import { SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY } from "../data/contact";
import type { CategoryId, Condition, FilterPatch, FilterState, Product, RegionId, SortKey } from "../types";
import { applyFilters } from "./catalog";
import { formatUGX, parseUgxInput } from "./format";

/**
 * A small, deterministic "shopping assistant". It turns a sentence such as
 * "Find fashion items under UGX 500,000" into catalog filters and answers from the
 * live listings. There is no network call: replies are simulated, but every
 * product, price and location it quotes comes from real data.
 */

/* ------------------------------------------------------------------ */
/* Query understanding                                                 */
/* ------------------------------------------------------------------ */

export interface AssistantQuery {
  category: CategoryId | null;
  regions: RegionId[];
  minPrice: number | null;
  maxPrice: number | null;
  conditions: Condition[];
  keywords: string[];
  sort: SortKey | null;
  wantsVerified: boolean;
}

const STOPWORDS: ReadonlySet<string> = new Set([
  "a", "an", "the", "i", "me", "my", "we", "you", "please", "can", "could", "do", "does", "have", "has", "got",
  "show", "find", "search", "list", "give", "get", "want", "need", "looking", "look", "for", "in", "at", "near",
  "nearby", "around", "from", "to", "and", "or", "with", "of", "on", "is", "are", "there", "any", "some", "what",
  "which", "where", "under", "below", "over", "above", "than", "less", "more", "between", "max", "min", "up",
  "item", "items", "deal", "deals", "stuff", "things", "best", "good", "great", "cheap", "cheapest", "affordable",
  "ugx", "shs", "shillings", "budget", "price", "priced", "costing", "trending", "popular", "hot", "top", "rated",
  "trusted", "trust", "verified", "sellers", "seller", "new", "brand", "used", "second", "hand", "secondhand",
  "refurbished", "most", "expensive", "luxury", "premium", "latest", "newest", "recent", "it", "its", "this", "that",
  "am", "be", "so", "how", "much", "does", "cost", "sell", "selling",
]);

/** Words that merely name a category, so they must not also be required as a search keyword. */
const EXTRA_GENERIC_WORDS: readonly string[] = [
  "car", "cars", "vehicle", "vehicles", "phone", "phones", "shoe", "shoes", "cloth", "clothes", "clothing", "motorbike", "bikes",
];
const GENERIC_CATEGORY_WORDS: ReadonlySet<string> = new Set([
  ...CATEGORIES.flatMap((category) => [category.id, ...category.label.toLowerCase().split(/[^a-z]+/), category.shortLabel.toLowerCase()]).flatMap(
    (word) => [word, word.replace(/s$/, "")],
  ),
  ...EXTRA_GENERIC_WORDS,
]);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function singular(word: string): string {
  return word.length > 3 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word;
}

function detectCategory(text: string): CategoryId | null {
  let best: { id: CategoryId; hits: number } | null = null;
  for (const category of CATEGORIES) {
    const words = [category.id.replace("-", " "), category.shortLabel.toLowerCase(), ...category.keywords];
    const hits = words.filter((word) => new RegExp(`\\b${escapeRegExp(word)}`).test(text)).length;
    if (hits > 0 && (best === null || hits > best.hits)) best = { id: category.id, hits };
  }
  return best?.id ?? null;
}

interface PriceBounds {
  min: number | null;
  max: number | null;
  /** The text with price phrases removed, so their digits are not mistaken for keywords. */
  remainder: string;
}

const AMOUNT = String.raw`((?:ugx|shs?\.?)?\s*\d[\d,]*(?:\.\d+)?\s*(?:k|m|thousand|million)?)`;

function extractPrice(text: string): PriceBounds {
  let remainder = text;
  let min: number | null = null;
  let max: number | null = null;

  const between = new RegExp(String.raw`between\s+${AMOUNT}\s+(?:and|to)\s+${AMOUNT}`).exec(remainder);
  if (between?.[1] && between[2]) {
    const low = parseUgxInput(between[1]);
    const high = parseUgxInput(between[2]);
    if (low !== null && high !== null) {
      min = Math.min(low, high);
      max = Math.max(low, high);
      remainder = remainder.replace(between[0], " ");
    }
  }

  const upper = new RegExp(String.raw`(?:under|below|less than|cheaper than|max(?:imum)?|up to|within|not more than)\s+${AMOUNT}`).exec(remainder);
  if (upper?.[1]) {
    const value = parseUgxInput(upper[1]);
    if (value !== null) {
      max = value;
      remainder = remainder.replace(upper[0], " ");
    }
  }

  const lower = new RegExp(String.raw`(?:over|above|more than|from|min(?:imum)?|at least|starting at)\s+${AMOUNT}`).exec(remainder);
  if (lower?.[1]) {
    const value = parseUgxInput(lower[1]);
    if (value !== null) {
      min = value;
      remainder = remainder.replace(lower[0], " ");
    }
  }

  return { min, max, remainder };
}

export function parseQuery(input: string): AssistantQuery {
  const text = input.toLowerCase();
  const price = extractPrice(text);

  const regions = REGIONS.filter((region) => new RegExp(`\\b${region.label.toLowerCase()}\\b`).test(text)).map((region) => region.id);
  const category = detectCategory(price.remainder);

  const conditions: Condition[] = [];
  if (/\b(brand new|sealed|unused)\b/.test(text) || /\bnew\b/.test(price.remainder.replace(/brand new/g, ""))) conditions.push("new");
  if (/\b(refurb\w*|renewed)\b/.test(text)) conditions.push("refurbished");
  if (/\b(used|second hand|secondhand|pre-?owned)\b/.test(text)) conditions.push("used");

  const regionWords = new Set(REGIONS.map((region) => region.label.toLowerCase()));
  const keywords = price.remainder
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .filter((word) => !STOPWORDS.has(word) && !regionWords.has(word) && !GENERIC_CATEGORY_WORDS.has(word))
    .map(singular);

  let sort: SortKey | null = null;
  if (/\b(cheap|cheapest|lowest|affordable|budget)\b/.test(text)) sort = "price-asc";
  else if (/\b(most expensive|luxury|premium|highest)\b/.test(text)) sort = "price-desc";
  else if (/\b(trending|popular|hot)\b/.test(text)) sort = "trending";
  else if (/\b(best rated|top rated|highest rated|trusted)\b/.test(text)) sort = "top-rated";
  else if (/\b(latest|newest|recent|just posted)\b/.test(text)) sort = "newest";

  return {
    category,
    regions,
    minPrice: price.min,
    maxPrice: price.max,
    conditions,
    keywords,
    sort,
    wantsVerified: /\b(trusted|verified)\b/.test(text),
  };
}

/** True when the sentence names a category, place, budget, condition, sort or trust requirement. */
function hasStructuredSignal(query: AssistantQuery): boolean {
  return (
    query.category !== null ||
    query.regions.length > 0 ||
    query.minPrice !== null ||
    query.maxPrice !== null ||
    query.conditions.length > 0 ||
    query.sort !== null ||
    query.wantsVerified
  );
}

/* ------------------------------------------------------------------ */
/* Reply generation                                                    */
/* ------------------------------------------------------------------ */

export interface AssistantReply {
  text: string;
  products: Product[];
  totalMatches: number;
  patch: FilterPatch | null;
}

const MAX_RECOMMENDATIONS = 3;

function toPatch(query: AssistantQuery, overrides: Partial<Pick<FilterState, "keyword" | "priceMin" | "priceMax">> = {}): FilterPatch {
  const patch: FilterPatch = {
    keyword: overrides.keyword ?? query.keywords.join(" "),
    regions: query.regions,
    category: query.category ?? "all",
    conditions: query.conditions,
    priceMin: overrides.priceMin ?? query.minPrice ?? 0,
    priceMax: overrides.priceMax === undefined ? query.maxPrice : overrides.priceMax,
    verifications: query.wantsVerified ? ["verified"] : [],
    sort: query.sort ?? "trending",
  };
  return patch;
}

function runPatch(products: readonly Product[], patch: FilterPatch): Product[] {
  return applyFilters(products, { ...INITIAL_FILTERS, ...patch });
}

function joinWords(words: readonly string[]): string {
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

function describeSearch(query: AssistantQuery, includeKeywords: boolean): string {
  const categoryLabel = CATEGORIES.find((item) => item.id === query.category)?.shortLabel.toLowerCase() ?? "items";
  const conditionLabel = joinWords(query.conditions.map((id) => CONDITIONS.find((item) => item.id === id)?.label.toLowerCase() ?? id));
  const subject = [conditionLabel, categoryLabel].filter((part) => part.length > 0).join(" ");
  const matching = includeKeywords && query.keywords.length > 0 ? ` matching “${query.keywords.join(" ")}”` : "";
  const where =
    query.regions.length > 0 ? ` in ${joinWords(REGIONS.filter((item) => query.regions.includes(item.id)).map((item) => item.label))}` : "";
  let budget = "";
  if (query.minPrice !== null && query.maxPrice !== null) budget = ` between ${formatUGX(query.minPrice)} and ${formatUGX(query.maxPrice)}`;
  else if (query.maxPrice !== null) budget = ` under ${formatUGX(query.maxPrice)}`;
  else if (query.minPrice !== null) budget = ` over ${formatUGX(query.minPrice)}`;
  return `${subject}${where}${budget}${matching}`;
}

function highlight(products: readonly Product[]): string {
  const first = products[0];
  if (!first) return "";
  const cheapest = [...products].sort((a, b) => a.priceUgx - b.priceUgx)[0] ?? first;
  const sellerNote = first.seller.tier === "standard" ? "" : ` from ${first.seller.name}, a ${first.seller.tier === "top-rated" ? "Top Rated" : "Verified"} seller`;
  return cheapest.id === first.id
    ? ` My pick is the ${first.title} at ${formatUGX(first.priceUgx)} in ${first.locationLabel}${sellerNote}.`
    : ` My pick is the ${first.title} at ${formatUGX(first.priceUgx)} in ${first.locationLabel}${sellerNote}. The cheapest is the ${cheapest.title} at ${formatUGX(cheapest.priceUgx)}.`;
}

function smallTalk(text: string): AssistantReply | null {
  const lower = text.toLowerCase();
  const reply = (message: string): AssistantReply => ({ text: message, products: [], totalMatches: 0, patch: null });

  if (/\b(hi|hello|hey|hallo|oli otya|good (morning|afternoon|evening)|mulimu)\b/.test(lower)) {
    return reply("Hello! I can search E-Buy Uganda for you. Tell me what you want, where, and your budget, for example “laptops in Entebbe under UGX 2,000,000”.");
  }
  if (/\b(thanks|thank you|webale|asante)\b/.test(lower)) {
    return reply("You're welcome! Remember to meet sellers in a public place and inspect the item before you pay.");
  }
  if (/\b(safe|safety|scam|fraud|trust|verify|legit)\b/.test(lower) && !/\b(show|find|list)\b/.test(lower)) {
    return reply(
      "Look for the Verified Seller and Top Rated badges, chat on WhatsApp first, meet in a public place, inspect the item, and pay with Mobile Money only once you are happy. Never send money to someone you haven't met.",
    );
  }
  if (/\b(pay|payment|momo|mobile money|airtel)\b/.test(lower)) {
    return reply("E-Buy supports MTN MoMo and Airtel Money. Agree the price on WhatsApp, inspect the item, then pay the seller directly once you're satisfied.");
  }
  if (/\b(contact|support|help|call|phone number|email|whatsapp)\b/.test(lower) && !/\b(seller)\b/.test(lower)) {
    return reply(`You can reach the E-Buy team on ${SUPPORT_PHONE_DISPLAY} (call or WhatsApp) or email ${SUPPORT_EMAIL}.`);
  }
  if (/\b(sell|selling|post|list my|start selling)\b/.test(lower) && !/\b(show|find)\b/.test(lower)) {
    return reply("To sell, tap “Start Selling” in the header, create a free shop, and add your item with photos, price and your WhatsApp number.");
  }
  return null;
}

export function answer(input: string, products: readonly Product[]): AssistantReply {
  const query = parseQuery(input);
  const structured = hasStructuredSignal(query);

  // Greetings, safety, payment and contact questions are answered directly, unless the
  // sentence also names something to search for.
  if (!structured) {
    const chat = smallTalk(input);
    if (chat) return chat;
    if (query.keywords.length === 0) {
      return {
        text: "I'm not sure I understood that. Try something like “Show vehicles in Kampala”, “phones under UGX 1,000,000” or “refurbished laptops in Entebbe”.",
        products: [],
        totalMatches: 0,
        patch: null,
      };
    }
  }

  // 1. Exact match.
  const exactPatch = toPatch(query);
  const exact = runPatch(products, exactPatch);
  if (exact.length > 0) {
    const noun = exact.length === 1 ? "listing" : "listings";
    return {
      text: `I found ${exact.length} ${noun} for ${describeSearch(query, true)}.${highlight(exact)}`,
      products: exact.slice(0, MAX_RECOMMENDATIONS),
      totalMatches: exact.length,
      patch: exactPatch,
    };
  }

  // 2. Drop the free-text keywords, which are the most likely to be too specific.
  //    Skipped when keywords were the only thing asked for, since that would match everything.
  if (structured && query.keywords.length > 0) {
    const relaxedPatch = toPatch(query, { keyword: "" });
    const relaxed = runPatch(products, relaxedPatch);
    if (relaxed.length > 0) {
      return {
        text: `I couldn't find an exact match for “${query.keywords.join(" ")}”, but here ${relaxed.length === 1 ? "is 1 close listing" : `are ${relaxed.length} close listings`} for ${describeSearch(query, false)}.${highlight(relaxed)}`,
        products: relaxed.slice(0, MAX_RECOMMENDATIONS),
        totalMatches: relaxed.length,
        patch: relaxedPatch,
      };
    }
  }

  // 3. Drop the budget and show the closest alternatives, cheapest first.
  if (query.minPrice !== null || query.maxPrice !== null) {
    const noBudgetQuery: AssistantQuery = { ...query, minPrice: null, maxPrice: null };
    const noBudgetPatch: FilterPatch = { ...toPatch(noBudgetQuery, { keyword: "" }), sort: "price-asc" };
    const noBudget = runPatch(products, noBudgetPatch);
    const cheapest = noBudget[0];
    if (cheapest) {
      return {
        text: `Nothing fits that budget. The lowest price for ${describeSearch(noBudgetQuery, false)} is ${formatUGX(cheapest.priceUgx)}. Here are the cheapest options.`,
        products: noBudget.slice(0, MAX_RECOMMENDATIONS),
        totalMatches: noBudget.length,
        patch: noBudgetPatch,
      };
    }
  }

  // 4. Nothing relevant: point at what is trending instead.
  const trending = [...products].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, MAX_RECOMMENDATIONS);
  return {
    text: `I couldn't find ${describeSearch(query, true)} right now. Here is what's trending on E-Buy instead.`,
    products: trending,
    totalMatches: 0,
    patch: null,
  };
}
