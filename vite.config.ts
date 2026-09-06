import { defineConfig } from "vite";
import { resolve } from "node:path";

// Multi-page static build: one real HTML document per URL, because every tool page
// has to be independently indexable (client-only routing would leave crawlers an
// empty shell). Relative base keeps the same dist/ working at the site root and
// under the owner preview path.
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        verben: resolve(__dirname, "verben/index.html"),
        derdiedas: resolve(__dirname, "der-die-das/index.html"),
        faelle: resolve(__dirname, "faelle/index.html"),
        einstufungstest: resolve(__dirname, "einstufungstest/index.html"),
        lernplan: resolve(__dirname, "lernplan/index.html"),
        briefe: resolve(__dirname, "briefe/index.html"),
        about: resolve(__dirname, "about/index.html"),
        contact: resolve(__dirname, "contact/index.html"),
        privacy: resolve(__dirname, "privacy/index.html"),
        terms: resolve(__dirname, "terms/index.html"),
        vorlagen: resolve(__dirname, "vorlagen/index.html")
      }
    }
  }
});
