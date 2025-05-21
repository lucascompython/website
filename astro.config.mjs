// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { execSync } from "child_process";

console.log("Generiting resumes!");
execSync(
  'typst compile resume/resume_yaml_en.typ "public/CV Lucas de Linhares en.pdf"',
);
execSync(
  'typst compile resume/resume_yaml_pt.typ "public/CV Lucas de Linhares pt.pdf"',
);

console.log("Done!");

// https://astro.build/config
export default defineConfig({
  site: "https://lucasdelinhares.com",
  integrations: [sitemap()],
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en",
  },
});
