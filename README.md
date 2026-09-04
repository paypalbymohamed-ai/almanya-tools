# Almanya Tools

أدوات مجانية لتعلّم اللغة الألمانية موجَّهة للناطقين بالعربية.

**الموقع المنشور:** https://almanya-tools.pages.dev

## الأدوات

| الصفحة | الأداة |
|---|---|
| `/verben/` | محرك تصريف الأفعال الشاذة — ٩٩ فعلاً، بحث بالمصدر أو بأي تصريف أو بالمعنى العربي، وخمسة أزمنة مع الفعل المساعد الصحيح |
| `/der-die-das/` | ‏der/die/das والجمع — ١٧٢ اسماً بالأداة والجمع الصريح وقاعدة تفسّر الأداة، وكويز من عشرة أسئلة |

## البنية

موقع static متعدد الصفحات مبني بـ Vite. كل مسار ملف `index.html` مستقل حتى يقرأ الزاحف
المحتوى دون تنفيذ JavaScript — وهو أساس ظهور الصفحات في نتائج البحث.

- `src/data/verbs.js` — بيانات الأفعال الشاذة
- `src/data/nouns.js` — الأسماء مع الأدوات والجمع الصريح وقواعد الجنس
- `src/conjugate.js` — محرك التصريف (يتعامل مع الأفعال المنفصلة ومكان البادئة)
- `src/verben.js` · `src/der-die-das.js` — منطق واجهة كل أداة
- `public/sitemap.xml` · `public/robots.txt` — أصول الزحف
- `DESIGN.md` — عقد التصميم؛ أي تعديل بصري يُشتق منه

## التشغيل محلياً

```bash
bun install
bun run build
```

## قواعد المحتوى

- لا يُنشر شكل لغوي غير مؤكَّد؛ الجمع مكتوب صريحاً لكل اسم ولا يُتنبّأ به.
- كل صفحة تحمل canonical و hreflang عربي وبيانات schema منظّمة.

## Deployment

This site is built with Vite and deployed via Cloudflare Pages from the `main` branch.

- Build command: `bun run build`
- Build output directory: `dist`

The build output directory is also declared in `wrangler.toml`
(`pages_build_output_dir = "dist"`), so Cloudflare Pages reads it from the
repository rather than relying only on dashboard settings.
