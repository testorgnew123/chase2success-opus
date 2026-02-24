import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import path from "path";

/**
 * Injects <link rel="preload"> for the hero images so the browser can
 * start downloading them immediately from HTML, before JS parses.
 * This eliminates the ~1,900 ms "resource load delay" Lighthouse reports.
 */
function heroImagePreload(): Plugin {
  return {
    name: "hero-image-preload",
    enforce: "post",
    transformIndexHtml(html, ctx) {
      // Only inject in production builds (ctx.bundle exists)
      if (!ctx.bundle) return html;
      const assets = Object.keys(ctx.bundle);
      const mobile = assets.find((a) => a.includes("hero-bg-mobile") && a.endsWith(".webp"));
      const desktop = assets.find((a) => a.match(/hero-bg-[^m]/) && a.endsWith(".webp"));
      const tags: { tag: string; attrs: Record<string, string>; injectTo: "head" }[] = [];
      if (mobile) {
        tags.push({
          tag: "link",
          attrs: { rel: "preload", as: "image", type: "image/webp", href: `/${mobile}`, media: "(max-width: 768px)", fetchpriority: "high" },
          injectTo: "head",
        });
      }
      if (desktop) {
        tags.push({
          tag: "link",
          attrs: { rel: "preload", as: "image", type: "image/webp", href: `/${desktop}`, media: "(min-width: 769px)", fetchpriority: "high" },
          injectTo: "head",
        });
      }
      return tags;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    heroImagePreload(),
    ViteImageOptimizer({
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
