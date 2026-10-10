import { memo, type ReactElement } from "react";
import { ArrowRight, Clock, Star, Truck } from "lucide-react";
import { formatRelativeTime, formatUGX } from "../../lib/format";
import { productDetailUrl } from "../../lib/links";
import type { Product } from "../../types";
import { ConditionBadge, LocationBadge, SellerTierBadge } from "../ui/Badges";
import { ContactButtons } from "../ui/ContactButtons";
import { ProductImage } from "../ui/ProductImage";
import { SaveButton } from "../ui/SaveButton";

export interface ProductCardProps {
  product: Product;
  saved: boolean;
  onToggleSaved: (id: string) => void;
}

function ProductCardBase({ product, saved, onToggleSaved }: ProductCardProps): ReactElement {
  const { seller } = product;
  const detailUrl = productDetailUrl(product);
  const headingId = `product-${product.id}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className="group flex h-full animate-fade-up flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <figure className="relative aspect-video overflow-hidden">
        <ProductImage
          src={product.imageUrl}
          alt={product.title}
          category={product.category}
          className="h-full w-full object-cover group-hover:scale-110"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

        <ConditionBadge condition={product.condition} className="absolute left-3 top-3" />
        <SaveButton
          saved={saved}
          onToggle={() => onToggleSaved(product.id)}
          itemTitle={product.title}
          className="absolute right-3 top-3"
        />
        <LocationBadge label={product.locationLabel} className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)]" />
      </figure>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <SellerTierBadge tier={seller.tier} />
          {seller.rating !== null && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-content-muted">
              <Star aria-hidden="true" className="h-3.5 w-3.5 fill-accent text-accent" />
              <span>
                {seller.rating.toFixed(1)}
                <span className="sr-only"> out of 5 stars</span>
              </span>
              <span className="font-normal text-content-subtle">({seller.reviewCount})</span>
            </span>
          )}
        </div>

        <h3 id={headingId} className="mt-3 line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-content">
          <a href={detailUrl} className="rounded-md hover:text-brand-soft-content">
            {product.title}
          </a>
        </h3>

        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="text-xl font-extrabold tracking-tight text-brand-soft-content">{formatUGX(product.priceUgx)}</span>
          {product.negotiable && <span className="text-xs font-semibold text-content-subtle">Negotiable</span>}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-content-muted">{product.description}</p>

        <p className="mt-3 flex items-center gap-3 text-xs text-content-subtle">
          <span className="flex min-w-0 items-center gap-1">
            <span className="truncate font-medium text-content-muted">{seller.name}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <Clock aria-hidden="true" className="h-3 w-3" />
            <time dateTime={product.createdAt}>{formatRelativeTime(product.createdAt)}</time>
          </span>
          {product.delivery !== "pickup" && (
            <span className="flex shrink-0 items-center gap-1">
              <Truck aria-hidden="true" className="h-3 w-3" />
              Delivers
            </span>
          )}
        </p>

        <div className="mt-auto space-y-2 pt-5">
          <a
            href={detailUrl}
            className="group/cta flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-brand-contrast shadow-card transition hover:bg-brand-hover active:scale-[0.98]"
          >
            View Details
            <span className="sr-only"> for {product.title}</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
          </a>
          <ContactButtons seller={seller} productTitle={product.title} />
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);
