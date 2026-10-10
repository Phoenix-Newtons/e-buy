import type { ReactElement } from "react";
import { Lock, MessageCircle, ShieldCheck, Store, Wallet } from "lucide-react";
import { legacyPage } from "../../lib/links";

interface FooterLinkGroup {
  heading: string;
  links: readonly { label: string; href: string }[];
}

const LINK_GROUPS: readonly FooterLinkGroup[] = [
  {
    heading: "Marketplace",
    links: [
      { label: "Browse listings", href: "#catalog" },
      { label: "Popular categories", href: "#categories" },
      { label: "Start selling", href: legacyPage("trader-register.html") },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login", href: legacyPage("login.html") },
      { label: "Create buyer account", href: legacyPage("buyer-register.html") },
      { label: "My orders", href: legacyPage("my-orders.html") },
    ],
  },
];

export function Footer(): ReactElement {
  return (
    <footer className="mt-20 bg-surface-inverse text-content-inverse">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <section aria-labelledby="footer-brand">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-contrast">
              <Store aria-hidden="true" className="h-5 w-5" />
            </span>
            <h2 id="footer-brand" className="text-lg font-extrabold">
              E-Buy <span className="text-accent">Uganda</span>
            </h2>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Buy and sell new, refurbished and used items anywhere in Uganda. Pay with MTN MoMo or Airtel Money and chat
            with sellers on WhatsApp.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
            <li className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <Wallet aria-hidden="true" className="h-3.5 w-3.5 text-accent" /> MTN MoMo
            </li>
            <li className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <Wallet aria-hidden="true" className="h-3.5 w-3.5 text-accent" /> Airtel Money
            </li>
            <li className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <MessageCircle aria-hidden="true" className="h-3.5 w-3.5 text-accent" /> WhatsApp chat
            </li>
          </ul>
        </section>

        {LINK_GROUPS.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/50">{group.heading}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/80 transition-colors hover:text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} E-Buy Uganda. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Meet in public places
            </span>
            <span className="flex items-center gap-1.5">
              <Lock aria-hidden="true" className="h-3.5 w-3.5" /> Never pay before inspecting
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
