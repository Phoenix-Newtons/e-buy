import type { Config } from "tailwindcss";

/**
 * Semantic colour tokens.
 *
 * Components never reference raw palette colours for surfaces or text.
 * They use names such as `bg-surface`, `text-content-muted` or
 * `border-line`. The actual values live as CSS variables in
 * `src/index.css` and swap automatically in dark mode (`.dark` on <html>).
 */
const token = (name: string): string => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        // Surfaces
        canvas: token("canvas"), // page background
        surface: token("surface"), // cards, panels
        "surface-muted": token("surface-muted"), // inputs, subtle wells
        "surface-raised": token("surface-raised"), // popovers, drawers
        "surface-inverse": token("surface-inverse"), // dark hero / footer blocks
        // Text
        content: token("content"),
        "content-muted": token("content-muted"),
        "content-subtle": token("content-subtle"),
        "content-inverse": token("content-inverse"),
        // Borders & rings
        line: token("line"),
        "line-strong": token("line-strong"),
        // Brand
        brand: token("brand"),
        "brand-hover": token("brand-hover"),
        "brand-soft": token("brand-soft"),
        "brand-soft-content": token("brand-soft-content"),
        "brand-contrast": token("brand-contrast"),
        accent: token("accent"),
        "accent-soft": token("accent-soft"),
        "accent-contrast": token("accent-contrast"),
        "accent-soft-content": token("accent-soft-content"),
        // Status
        success: token("success"),
        "success-soft": token("success-soft"),
        danger: token("danger"),
        "danger-soft": token("danger-soft"),
        warning: token("warning"),
        "warning-soft": token("warning-soft"),
        info: token("info"),
        "info-soft": token("info-soft"),
        // Regional communication channels
        whatsapp: token("whatsapp"),
        "whatsapp-hover": token("whatsapp-hover"),
      },
      boxShadow: {
        card: "0 1px 2px rgb(var(--shadow) / 0.06), 0 1px 3px rgb(var(--shadow) / 0.08)",
        "card-hover": "0 12px 28px -8px rgb(var(--shadow) / 0.22), 0 4px 10px -4px rgb(var(--shadow) / 0.12)",
        float: "0 20px 45px -15px rgb(var(--shadow) / 0.35)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(-4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "heart-beat": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "fade-up": "fade-up 0.4s ease-out both",
        "pop-in": "pop-in 0.14s ease-out both",
        float: "float 5s ease-in-out infinite",
        "heart-beat": "heart-beat 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
