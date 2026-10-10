import type { ReactElement } from "react";
import { MapPin, MessageCircle, Phone, Tag } from "lucide-react";
import { CATEGORIES } from "../../data/constants";
import { formatPhoneDisplay, formatUGX } from "../../lib/format";
import { productDetailUrl, telUrl, whatsappUrl } from "../../lib/links";
import type { Product } from "../../types";
import { ProductImage } from "../ui/ProductImage";

export interface AssistantProductRowProps {
  product: Product;
}

/** Compact recommendation shown inside an assistant message bubble. */
export function AssistantProductRow({ product }: AssistantProductRowProps): ReactElement {
  const categoryLabel = CATEGORIES.find((item) => item.id === product.category)?.shortLabel ?? product.category;
  const { phone, name } = product.seller;

  return (
    <article className="flex gap-3 rounded-2xl border border-line bg-surface p-2.5 shadow-card transition-all duration-300 hover:shadow-lg">
      <a href={productDetailUrl(product)} className="block h-16 w-16 shrink-0 overflow-hidden rounded-xl" tabIndex={-1} aria-hidden="true">
        <ProductImage src={product.imageUrl} alt="" category={product.category} className="h-full w-full object-cover" />
      </a>
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="truncate text-sm font-bold text-content">
          <a href={productDetailUrl(product)} className="rounded hover:text-brand-soft-content">
            {product.title}
          </a>
        </h4>
        <p className="text-sm font-extrabold text-brand-soft-content">{formatUGX(product.priceUgx)}</p>
        <p className="mt-0.5 flex items-center gap-2 text-[11px] font-medium text-content-subtle">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin aria-hidden="true" className="h-3 w-3 shrink-0 text-brand" />
            <span className="truncate">{product.locationLabel}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Tag aria-hidden="true" className="h-3 w-3" />
            {categoryLabel}
          </span>
        </p>
      </div>
      {phone && (
        <div className="flex shrink-0 flex-col justify-center gap-1.5">
          <a
            href={whatsappUrl(phone, product.title)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with ${name} via WhatsApp about ${product.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-whatsapp text-white transition hover:bg-whatsapp-hover"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href={telUrl(phone)}
            aria-label={`Call Seller ${name} on ${formatPhoneDisplay(phone)}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-content transition hover:bg-surface-muted"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      )}
    </article>
  );
}
