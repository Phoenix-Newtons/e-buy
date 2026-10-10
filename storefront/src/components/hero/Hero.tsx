import type { ReactElement } from "react";
import { ArrowRight, BadgeCheck, Lock, MessageCircle, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { CATEGORIES, CATEGORY_TONE_CLASSES } from "../../data/constants";
import { cn } from "../../lib/cn";
import { legacyPage } from "../../lib/links";
import type { CategoryId } from "../../types";

export interface HeroProps {
  /** Total live listings per category, shown on the visual grid tiles. */
  categoryCounts: Readonly<Record<CategoryId, number>>;
  onPickCategory: (category: CategoryId) => void;
}

interface TrustPoint {
  icon: typeof ShieldCheck;
  label: string;
}

const TRUST_POINTS: readonly TrustPoint[] = [
  { icon: BadgeCheck, label: "ID-checked sellers" },
  { icon: Wallet, label: "MTN MoMo & Airtel Money" },
  { icon: MessageCircle, label: "Chat on WhatsApp" },
];

interface HeroTile {
  category: CategoryId;
  /** Layout classes: tiles in the same column have different heights for a masonry feel. */
  height: string;
}

const LEFT_COLUMN: readonly HeroTile[] = [
  { category: "phones", height: "h-52" },
  { category: "fashion", height: "h-40" },
];
const RIGHT_COLUMN: readonly HeroTile[] = [
  { category: "vehicles", height: "h-40" },
  { category: "electronics", height: "h-52" },
];

function HeroCategoryTile({
  tile,
  count,
  onPick,
}: {
  tile: HeroTile;
  count: number;
  onPick: (category: CategoryId) => void;
}): ReactElement | null {
  const category = CATEGORIES.find((item) => item.id === tile.category);
  if (!category) return null;
  const Icon = category.icon;
  const tone = CATEGORY_TONE_CLASSES[category.tone];

  return (
    <button
      type="button"
      onClick={() => onPick(category.id)}
      className={cn(
        "group relative flex w-full flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.12]",
        tile.height,
      )}
    >
      <span aria-hidden="true" className={cn("absolute inset-0 bg-gradient-to-br opacity-80", tone.glow)} />
      <Icon
        aria-hidden="true"
        className="absolute -right-3 -top-3 h-28 w-28 rotate-12 text-white/10 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110"
      />
      <span className={cn("relative mb-auto flex h-11 w-11 items-center justify-center rounded-2xl ring-1", tone.badge)}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="relative block text-base font-bold text-white">{category.label}</span>
      <span className="relative mt-0.5 flex items-center gap-1 text-xs font-medium text-white/65">
        {count > 0 ? `${count} listings` : "Browse now"}
        <ArrowRight aria-hidden="true" className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  );
}

export function Hero({ categoryCounts, onPickCategory }: HeroProps): ReactElement {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden bg-surface-inverse text-content-inverse">
      {/* Decorative background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Radial gradients give the same glow as a blurred blob without an expensive filter pass. */}
        <div
          className="absolute -left-40 -top-40 h-[40rem] w-[40rem]"
          style={{ backgroundImage: "radial-gradient(closest-side, rgb(var(--color-brand) / 0.32), transparent)" }}
        />
        <div
          className="absolute -bottom-52 -right-20 h-[44rem] w-[44rem]"
          style={{ backgroundImage: "radial-gradient(closest-side, rgb(var(--color-accent) / 0.16), transparent)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
        {/* Value proposition */}
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-accent">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            Uganda&apos;s trusted peer-to-peer marketplace
          </p>
          <h1 id="hero-heading" className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Buy &amp; sell anything,{" "}
            <span className="bg-gradient-to-r from-accent to-lime-300 bg-clip-text text-transparent">anywhere in Uganda.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Find new, refurbished and pre-loved deals near you in Kampala, Entebbe, Jinja, Mbarara and Gulu.
            Talk to verified sellers on WhatsApp and pay safely with Mobile Money.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#catalog"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-[15px] font-bold text-accent-contrast shadow-float transition hover:brightness-95"
            >
              Browse today&apos;s deals
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href={legacyPage("trader-register.html")}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-[15px] font-bold text-white transition hover:bg-white/15"
            >
              Open a free shop
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/80">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon aria-hidden="true" className="h-4 w-4 text-accent" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual grid */}
        <div className="relative hidden sm:block" role="group" aria-label="Featured categories">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              {LEFT_COLUMN.map((tile) => (
                <HeroCategoryTile key={tile.category} tile={tile} count={categoryCounts[tile.category]} onPick={onPickCategory} />
              ))}

              {/* Safety reminder */}
              <div aria-hidden="true" className="rounded-3xl border border-white/10 bg-white/[0.07] p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-accent">
                  <ShieldCheck className="h-4 w-4" /> Buy with confidence
                </div>
                <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-white/75">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Meet in public, inspect the item, then pay with Mobile Money.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-10">
              {RIGHT_COLUMN.map((tile) => (
                <HeroCategoryTile key={tile.category} tile={tile} count={categoryCounts[tile.category]} onPick={onPickCategory} />
              ))}

              {/* Floating WhatsApp conversation preview */}
              <div
                aria-hidden="true"
                className="rounded-3xl border border-white/15 bg-surface p-4 text-content shadow-card"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-whatsapp">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </div>
                <p className="mt-2 w-fit max-w-full rounded-2xl rounded-bl-md bg-surface-muted px-3 py-2 text-xs">Is it still available?</p>
                <p className="ml-auto mt-1.5 w-fit max-w-full rounded-2xl rounded-br-md bg-brand px-3 py-2 text-xs font-medium text-brand-contrast">
                  Yes! You can view it today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
