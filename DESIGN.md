# Design direction

## Design read
A set of interactive German-learning tool pages for Arabic-speaking learners, designed to make
a visitor *use a tool within five seconds of landing*, using a calm bilingual-reference
(RTL Arabic UI + LTR German data) direction grounded in the grammar itself — gender color, verb tables.

## Goal and audience
- **Subject:** Almanya Tools — free interactive German-learning tools with an Egyptian-Arabic interface.
  First two tools: irregular (strong) verb conjugation engine, and a Der/Die/Das article finder + quiz.
- **Audience:** Arabic speakers (mostly Egypt/Gulf) studying German at A1–B1 — Ausbildung applicants,
  nurses, IT workers, students. Mostly on mid-range Android phones, often on slow connections.
  They distrust: sites that demand signup before showing anything, walls of ads, thin content
  that turns out to be a PDF download page.
- **Single job:** the visitor searches a verb or a noun and gets the correct answer immediately.
  Everything else (quiz, related tools, articles) is secondary.
- **Real assets and proof:** none supplied. The trustworthy material here is the *linguistic data*
  itself — 60 strong verbs with full principal parts, 120 nouns with article + plural.
  No testimonials, no user counts, no claimed credentials anywhere on the site.
- **Missing material and draft placeholders:** owner contact e-mail, owner/site name for the
  imprint, and the Facebook page link. Contact page uses a clearly-labeled
  "Replace before launch" note instead of inventing an address. No fake statistics, no fake reviews.

## Dials
- Design variance: **3/10** — a reference tool must feel predictable; surprise belongs in the data, not the layout.
- Motion intensity: **2/10** — state feedback only (quiz answer reveal, tab switch). Respects `prefers-reduced-motion`.
- Visual density: **7/10** — learners want many facts per screen (a full conjugation table beats a pretty hero).

## Visual system
- **Color** (light canvas, chosen for daylight phone reading and long text sessions):
  - canvas `#f7f5f1` (warm paper), surface `#ffffff`, border `#e3ddd3`
  - ink (primary text) `#1a1d1a`, muted (secondary) `#5f6660`
  - action `#0f5c4e` (deep German-forest teal), action-hover `#0b4a3f`
  - **Gender roles — the load-bearing accent set:** der `#1d4ed8` (blue), die `#be1250` (rose-red),
    das `#0f7a3d` (green). Used identically in every tool, chip, table row and quiz button.
- **Typography:**
  - Display: `Tajawal` 700/800 — Arabic headlines, tool titles.
  - Body/UI Arabic: `IBM Plex Sans Arabic` 400/600 — 1.75 line-height for Arabic legibility.
  - German data: `IBM Plex Sans` 500/600, `direction: ltr` islands inside RTL text, slightly tighter
    tracking so `Präteritum` forms read as data, not prose.
  - Scale: clamp-based — h1 `clamp(1.75rem, 5vw, 2.6rem)`, table text 0.95rem min 15px.
- **Layout and responsive behavior:** single column, max content width 62rem, `dir="rtl"` document.
  Sticky compact header with tool nav. Each tool page = search field first (above the fold, autofocused
  on desktop only), then result card, then the full browsable table, then FAQ, then internal links.
  Conjugation tables become horizontally-scrollable at <640px with the Infinitiv column pinned;
  quiz options become full-width 48px tap targets stacked vertically.
- **Signature:** **the gender color system + principal-parts strip.** Every noun anywhere on the site
  carries its article in its own color, and every verb is shown as a four-cell strip
  (Infinitiv · Präsens 3.Sg · Präteritum · Perfekt) that stays visually identical in search results,
  tables and quiz feedback. Hide the logo and the site is still recognizable by those two devices.
- **Imagery and motion:** **no generated or stock imagery in the first pass** — deliberate decision.
  Photos add page weight and zero informational value to a grammar tool, and hurt LCP on the
  target devices. Identity is carried by type + the gender palette. One motion idea only:
  a 120ms color-fill on quiz answer reveal, disabled under reduced-motion.
- **Image production plan:** none this pass. Later: one SVG/OG card per tool page for social sharing
  (flat, type-only, generated from the same palette), max 4 total.

## Content structure
First screen (home): H1 "أدوات تعلّم الألماني — مجانية وبدون تسجيل", one-line promise, then the two live
tool cards as *real entry points* (each with its own search field-styled CTA naming the result:
"صرّف فعل شاذ", "اعرف der/die/das"), then the roadmap list of upcoming tools, then a short
"إزاي تستخدم الموقع" HowTo block, then FAQ, then footer with About/Contact/Privacy/Terms.

Tool page sequence: breadcrumb → H1 → 2-sentence intent-matching intro → tool → browsable data table
→ grammar explainer (real teaching content, 400+ words, so the page is not thin) → FAQ (FAQPage schema)
→ 3–5 internal links with Arabic anchors.

## Reference evidence
None supplied.
