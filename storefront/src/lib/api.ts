import { MOCK_PRODUCTS } from "../data/mockProducts";
import type { Product, ProductRow } from "../types";
import { rowToProduct } from "./productAdapter";

const SUPABASE_URL: string | undefined = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** True when live Supabase credentials were provided at build time. */
export const hasLiveBackend: boolean = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function isProductRowArray(value: unknown): value is ProductRow[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "object" && entry !== null && "id" in entry);
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

/**
 * Loads listings from the Supabase REST endpoint (PostgREST) of the existing
 * `products` table. Falls back to demo listings when no credentials are set,
 * with a short delay so the loading skeleton is visible during development.
 */
export async function fetchProducts(signal: AbortSignal): Promise<Product[]> {
  if (!hasLiveBackend || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    await wait(1200, signal);
    return [...MOCK_PRODUCTS];
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=created_at.desc`, {
    signal,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`The marketplace returned an error (${response.status}).`);
  }

  const payload: unknown = await response.json();
  if (!isProductRowArray(payload)) {
    throw new Error("The marketplace returned data in an unexpected format.");
  }
  return payload.map(rowToProduct);
}
