// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "dracula-soft",
    },
  },
  site: "https://lucasdelinhares.com",
  integrations: [sitemap(), playformCompress()],
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en",
  },
  prefetch: {
    defaultStrategy: "load",
    prefetchAll: true,
  },
});
