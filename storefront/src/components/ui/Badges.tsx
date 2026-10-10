import type { ReactElement } from "react";
import { Award, BadgeCheck, MapPin, UserRound, type LucideIcon } from "lucide-react";
import { CONDITIONS } from "../../data/constants";
import { cn } from "../../lib/cn";
import type { Condition, SellerTier } from "../../types";

const CONDITION_STYLES: Record<Condition, string> = {
  new: "bg-brand-soft text-brand-soft-content",
  refurbished: "bg-info-soft text-info",
  used: "bg-warning-soft text-warning",
};

export function ConditionBadge({ condition, className }: { condition: Condition; className?: string }): ReactElement {
  const label = CONDITIONS.find((item) => item.id === condition)?.label ?? condition;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-card",
        CONDITION_STYLES[condition],
        className,
      )}
    >
      {label}
    </span>
  );
}

export function LocationBadge({ label, className }: { label: string; className?: string }): ReactElement {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-content shadow-card backdrop-blur-sm",
        className,
      )}
    >
      <MapPin aria-hidden="true" className="h-3 w-3 shrink-0 text-brand" />
      <span className="truncate">{label}</span>
    </span>
  );
}

interface TierPresentation {
  label: string;
  icon: LucideIcon;
  className: string;
}

const TIER_PRESENTATION: Record<SellerTier, TierPresentation> = {
  "top-rated": { label: "Top Rated", icon: Award, className: "bg-accent-soft text-accent-soft-content" },
  verified: { label: "Verified Seller", icon: BadgeCheck, className: "bg-brand-soft text-brand-soft-content" },
  standard: { label: "Community Seller", icon: UserRound, className: "bg-surface-muted text-content-muted" },
};

export function SellerTierBadge({ tier, className }: { tier: SellerTier; className?: string }): ReactElement {
  const { label, icon: Icon, className: tone } = TIER_PRESENTATION[tier];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold", tone, className)}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
