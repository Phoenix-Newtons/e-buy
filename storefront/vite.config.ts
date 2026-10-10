import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base: "./"` lets the build be served from any sub-path (for example
// GitHub Pages at /e-buy/storefront/) next to the legacy static pages.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { host: "0.0.0.0", port: 5173, allowedHosts: true },
  preview: { host: "0.0.0.0", port: 4173, allowedHosts: true },
});
