import type { ReactElement, ReactNode } from "react";
import { Mail, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, Store, Wallet } from "lucide-react";
import { REGIONS } from "../../data/constants";
import { SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_E164 } from "../../data/contact";
import { legacyPage, telUrl } from "../../lib/links";
import type { CategoryId, CategoryOption, LegalDocumentId, RegionId } from "../../types";

export interface FooterProps {
  categories: readonly CategoryOption[];
  onPickCategory: (category: CategoryId) => void;
  onPickRegion: (region: RegionId) => void;
  onOpenAssistant: () => void;
  onOpenDocument: (id: LegalDocumentId) => void;
}

const LINK_CLASS =
  "rounded text-left text-white/75 transition-colors hover:text-accent focus-visible:ring-offset-surface-inverse";

function FooterColumn({ heading, children }: { heading: string; children: ReactNode }): ReactElement {
  return (
    <nav aria-label={heading}>
      <h2 className="text-xs font-bold uppercase tracking-wider text-white/50">{heading}</h2>
      <ul className="mt-4 space-y-3 text-sm">{children}</ul>
    </nav>
  );
}

export function Footer({ categories, onPickCategory, onPickRegion, onOpenAssistant, onOpenDocument }: FooterProps): ReactElement {
  const whatsappLink = `https://wa.me/${SUPPORT_PHONE_E164}?text=${encodeURIComponent("Hello E-Buy Uganda, I need some help.")}`;

  return (
    <footer className="mt-20 bg-surface-inverse text-content-inverse">
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* Brand and official contact points */}
          <section aria-labelledby="footer-brand" className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-contrast">
                <Store aria-hidden="true" className="h-5 w-5" />
              </span>
              <h2 id="footer-brand" className="text-xl font-extrabold">
                E-Buy <span className="text-accent">Uganda</span>
              </h2>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Buy and sell new, refurbished and used items across Uganda. Chat with sellers on WhatsApp and pay safely with Mobile Money.
            </p>

            <address className="mt-6 space-y-3 text-sm not-italic">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-[13px] font-semibold text-white transition-all duration-300 hover:border-accent/60 hover:bg-white/10"
              >
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                <span className="min-w-0 break-words">{SUPPORT_EMAIL}</span>
              </a>
              <div className="flex flex-wrap gap-3">
                <a
                  href={telUrl(SUPPORT_PHONE_E164)}
                  className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 font-semibold text-white transition-all duration-300 hover:border-accent/60 hover:bg-white/10"
                >
                  <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                  {SUPPORT_PHONE_DISPLAY}
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-whatsapp px-3.5 py-3 font-bold text-white transition-all duration-300 hover:bg-whatsapp-hover"
                >
                  <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                  WhatsApp
                </a>
              </div>
            </address>

            <ul className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <li className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <Wallet aria-hidden="true" className="h-3.5 w-3.5 text-accent" /> MTN MoMo
              </li>
              <li className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                <Wallet aria-hidden="true" className="h-3.5 w-3.5 text-accent" /> Airtel Money
              </li>
            </ul>
          </section>

          <FooterColumn heading="Marketplace">
            <li>
              <a href="#catalog" className={LINK_CLASS}>
                Browse listings
              </a>
            </li>
            <li>
              <a href="#categories" className={LINK_CLASS}>
                Popular categories
              </a>
            </li>
            <li>
              <button type="button" onClick={onOpenAssistant} className={`${LINK_CLASS} inline-flex items-center gap-1.5`}>
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
                Shopping Assistant
              </button>
            </li>
            <li>
              <a href={legacyPage("trader-register.html")} className={LINK_CLASS}>
                Start selling
              </a>
            </li>
            <li>
              <a href={legacyPage("my-orders.html")} className={LINK_CLASS}>
                My orders
              </a>
            </li>
          </FooterColumn>

          <FooterColumn heading="Shop by category">
            {categories.map((category) => (
              <li key={category.id}>
                <button type="button" onClick={() => onPickCategory(category.id)} className={LINK_CLASS}>
                  {category.label}
                </button>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn heading="Shop by location">
            {REGIONS.map((region) => (
              <li key={region.id}>
                <button type="button" onClick={() => onPickRegion(region.id)} className={`${LINK_CLASS} inline-flex items-center gap-1.5`}>
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-white/40" />
                  {region.label}
                </button>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn heading="Support & legal">
            <li>
              <button type="button" onClick={() => onOpenDocument("safety")} className={LINK_CLASS}>
                Safety tips
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onOpenDocument("terms")} className={LINK_CLASS}>
                Terms of use
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onOpenDocument("privacy")} className={LINK_CLASS}>
                Privacy policy
              </button>
            </li>
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("E-Buy Uganda support")}`} className={LINK_CLASS}>
                Contact us
              </a>
            </li>
            <li>
              <a href={legacyPage("login.html")} className={LINK_CLASS}>
                Login / Register
              </a>
            </li>
          </FooterColumn>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-24 pt-6 text-xs text-white/60 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} E-Buy Uganda. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <button type="button" onClick={() => onOpenDocument("terms")} className="rounded hover:text-accent">
                Terms
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onOpenDocument("privacy")} className="rounded hover:text-accent">
                Privacy
              </button>
            </li>
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="rounded hover:text-accent">
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Meet in public places. Inspect before you pay.
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
