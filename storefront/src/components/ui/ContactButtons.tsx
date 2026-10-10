import type { ReactElement } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatPhoneDisplay } from "../../lib/format";
import { telUrl, whatsappUrl } from "../../lib/links";
import type { Seller } from "../../types";

export interface ContactButtonsProps {
  seller: Seller;
  productTitle: string;
  /** `full` shows "Chat via WhatsApp" and "Call"; `compact` shortens the labels for narrow cards. */
  size?: "full" | "compact";
  className?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition active:scale-[0.98]";

/**
 * Regional communication shortcuts. Most Ugandan buyers negotiate over WhatsApp or a quick
 * phone call, so both are first-class actions. They degrade to disabled buttons when the
 * seller has not provided a valid number.
 */
export function ContactButtons({ seller, productTitle, size = "full", className }: ContactButtonsProps): ReactElement {
  const compact = size === "compact";
  const sizing = compact ? "px-3 py-2 text-xs" : "px-3.5 py-2.5 text-[13px]";

  // Full size wraps the Call button under WhatsApp when the card is too narrow for both.
  const layout = compact ? "grid grid-cols-[1fr_auto] gap-2" : "flex flex-wrap gap-2";
  const grow = compact ? "" : "flex-1 whitespace-nowrap";

  if (!seller.phone) {
    return (
      <div className={cn(layout, className)}>
        <span aria-disabled="true" className={cn(BASE, sizing, grow, "cursor-not-allowed bg-surface-muted text-content-subtle")}>
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          No contact number
        </span>
      </div>
    );
  }

  return (
    <div className={cn(layout, className)}>
      <a
        href={whatsappUrl(seller.phone, productTitle)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${seller.name} via WhatsApp about ${productTitle}`}
        className={cn(BASE, sizing, grow, "bg-whatsapp text-white shadow-card hover:bg-whatsapp-hover")}
      >
        <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="truncate">{compact ? "WhatsApp" : "Chat via WhatsApp"}</span>
      </a>
      <a
        href={telUrl(seller.phone)}
        aria-label={`Call Seller ${seller.name} on ${formatPhoneDisplay(seller.phone)}`}
        className={cn(BASE, sizing, grow, "border border-line bg-surface text-content hover:bg-surface-muted")}
      >
        <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span>Call{compact ? "" : " Seller"}</span>
      </a>
    </div>
  );
}
