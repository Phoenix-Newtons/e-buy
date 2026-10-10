import type { Product } from "../types";

/** Base URL of the legacy static pages (login.html, product-detail.html, ...). */
const LEGACY_BASE: string = (import.meta.env.VITE_LEGACY_SITE_BASE ?? "../").replace(/\/?$/, "/");

export function legacyPage(page: string): string {
  return `${LEGACY_BASE}${page}`;
}

export function productDetailUrl(product: Pick<Product, "id">): string {
  return `${LEGACY_BASE}product-detail.html?id=${encodeURIComponent(product.id)}`;
}

/** Pre-filled WhatsApp chat link (wa.me) with a polite opening message. */
export function whatsappUrl(phone: string, productTitle: string): string {
  const message = `Hello, I'm interested in your item "${productTitle}" listed on E-Buy Uganda. Is it still available?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function telUrl(phone: string): string {
  return `tel:+${phone}`;
}
