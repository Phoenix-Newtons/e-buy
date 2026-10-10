import { useState, type ReactElement } from "react";
import { Heart, Menu, Moon, Sparkles, Store, Sun, X } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import type { ThemeMode } from "../../hooks/useTheme";
import { cn } from "../../lib/cn";
import { legacyPage } from "../../lib/links";

export interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  savedCount: number;
  onOpenAssistant: () => void;
}

interface NavLinkItem {
  label: string;
  href: string;
  current?: boolean;
}

const NAV_LINKS: readonly NavLinkItem[] = [
  { label: "Browse", href: "#catalog", current: true },
  { label: "Categories", href: "#categories" },
  { label: "My Orders", href: legacyPage("my-orders.html") },
  { label: "Messages", href: legacyPage("buyer-messages.html") },
];

export function Header({ theme, onToggleTheme, savedCount, onOpenAssistant }: HeaderProps): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  useBodyScrollLock(menuOpen);
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface-inverse text-content-inverse">
      <a
        href="#catalog"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-contrast"
      >
        Skip to listings
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 rounded-lg" aria-label="E-Buy Uganda home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-contrast shadow-card">
            <Store aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            E-Buy <span className="text-accent">Uganda</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/10",
                link.current ? "text-accent" : "text-white/80",
              )}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenAssistant}
            aria-haspopup="dialog"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4 text-accent" />
            Assistant
          </button>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            {isDark ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
          </button>

          <a
            href="#catalog"
            aria-label={`Saved items (${savedCount})`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Heart aria-hidden="true" className="h-5 w-5" />
            {savedCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-contrast">
                {savedCount}
              </span>
            )}
          </a>

          <a
            href={legacyPage("login.html")}
            className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 lg:block"
          >
            Login
          </a>
          <a
            href={legacyPage("login.html")}
            className="hidden rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-contrast shadow-card transition hover:brightness-95 sm:block"
          >
            Start Selling
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 md:hidden"
          >
            <Menu aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-surface-inverse transition-transform duration-300 ease-out md:hidden",
          menuOpen ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-lg font-extrabold">
            E-Buy <span className="text-accent">Uganda</span>
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white hover:bg-white/10"
          >
            <X aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3.5 text-lg font-bold text-white/90 hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onOpenAssistant();
            }}
            className="flex items-center gap-2 rounded-xl px-4 py-3.5 text-left text-lg font-bold text-white/90 hover:bg-white/10"
          >
            <Sparkles aria-hidden="true" className="h-5 w-5 text-accent" />
            Assistant
          </button>
        </nav>
        <div className="mt-auto grid gap-3 p-4">
          <a href={legacyPage("login.html")} className="rounded-xl bg-white py-3.5 text-center font-bold text-surface-inverse">
            Login / Register
          </a>
          <a href={legacyPage("login.html")} className="rounded-xl bg-accent py-3.5 text-center font-bold text-accent-contrast">
            Start Selling
          </a>
        </div>
      </div>
    </header>
  );
}
