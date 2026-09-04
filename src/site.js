/**
 * Site-wide behaviour shared by every page.
 *
 * Two concerns, deliberately kept quiet:
 *  1. nav  — collapse the 8-link header into a real menu on small screens, so a
 *            sticky header can never cover page content again.
 *  2. wa   — a WhatsApp contact path that only appears AFTER the visitor got
 *            value: no popups, no interstitials, no auto-open, dismissible, and
 *            it remembers a dismissal. The learner must never feel the site
 *            exists to sell them a course.
 */

const WA_NUMBER = '201055205228';
const DISMISS_KEY = 'at_wa_dismissed_at';
const DISMISS_DAYS = 14;

/* ─────────────────────────── nav ─────────────────────────── */

function initNav() {
  const head = document.querySelector('.site-head');
  const nav = document.querySelector('.site-nav');
  const btn = document.querySelector('.nav-toggle');
  if (!head || !nav || !btn) return;

  // Only now does CSS hand control to the button — no-JS visitors keep a row.
  document.documentElement.classList.add('js-nav');
  if (!nav.id) nav.id = 'site-nav';
  btn.setAttribute('aria-controls', nav.id);

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  setOpen(false);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains('is-open'));
  });

  // Close on: link chosen, Escape, outside tap, or growing past the breakpoint.
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      btn.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (!head.contains(e.target)) setOpen(false);
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', (ev) => {
    if (ev.matches) setOpen(false);
  });
}

/* ─────────────────────────── whatsapp ─────────────────────────── */

const PAGE_LABELS = [
  ['/verben/', 'صفحة الأفعال الشاذة'],
  ['/der-die-das/', 'صفحة der/die/das'],
  ['/faelle/', 'صفحة الحالات الأربعة'],
  ['/einstufungstest/', 'اختبار تحديد المستوى'],
  ['/lernplan/', 'خطة المذاكرة'],
  ['/vorlagen/', 'صفحة المراسلات الرسمية'],
];

function pageLabel() {
  const path = location.pathname;
  for (const [frag, label] of PAGE_LABELS) if (path.includes(frag)) return label;
  return 'موقع Almanya Tools';
}

/** Build a wa.me link whose opening message already carries real context. */
function waLink(intent, extra = '') {
  const opener = 'السلام عليكم، جاي من موقع Almanya Tools';
  const bodies = {
    trial: 'وعايز أحجز حصة تجريبية مجانية.',
    course: 'وعايز أعرف تفاصيل الكورس والمواعيد.',
    feedback: 'وعندي ملاحظة/اقتراح على الموقع.',
    help: `وكنت بستخدم ${pageLabel()} وعندي سؤال.`,
  };
  const text = [opener, bodies[intent] || bodies.help, extra].filter(Boolean).join(' ');
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function dismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (!at) return false;
    return (Date.now() - at) < DISMISS_DAYS * 864e5;
  } catch { return false; }
}

/** Upgrade the static hrefs in the end-of-page band with contextual text. */
function enrichStaticLinks(extra = '') {
  document.querySelectorAll('[data-wa-intent]').forEach((a) => {
    a.href = waLink(a.dataset.waIntent, extra);
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.03.24-3.47-.72-2.95-1.16-4.81-4.22-4.96-4.42-.14-.2-1.16-1.55-1.16-2.95s.73-2.1 1-2.38c.26-.29.58-.36.77-.36s.39 0 .56.01c.18.01.42-.07.66.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.2-.2.32-.39.51-.19.19-.29.29-.19.5.1.2.53.9 1.14 1.45.78.71 1.44.95 1.63 1.05.19.1.31.08.42-.05.12-.14.51-.6.65-.8.14-.2.29-.17.48-.1.19.07 1.22.58 1.43.68.2.1.34.15.39.24.05.09.05.53-.19 1.21z"/></svg>';

function buildDock() {
  const dock = document.createElement('div');
  dock.className = 'wa-dock';
  dock.innerHTML = `
    <div class="wa-sheet" role="dialog" aria-label="تواصل معنا" hidden>
      <button class="wa-close" type="button" aria-label="إغلاق">&times;</button>
      <h3>تحب نساعدك؟</h3>
      <p class="wa-sub">الموقع مجاني بالكامل. اختار اللي يناسبك:</p>
      <div class="wa-opts">
        <a data-wa-intent="trial" href="#">حصة تجريبية مجانية<small>نشوف مستواك ونبدأ منه</small></a>
        <a data-wa-intent="course" href="#">تفاصيل الكورس<small>المواعيد والمستويات</small></a>
        <a data-wa-intent="feedback" href="#">رأي أو اقتراح<small>ملاحظاتك بتحسّن الموقع</small></a>
      </div>
      <button class="wa-dismiss" type="button">مش دلوقتي، متظهرش تاني</button>
    </div>
    <button class="wa-fab" type="button" aria-expanded="false" aria-label="تواصل معنا على واتساب">
      ${WA_ICON}<span>تواصل معنا</span>
    </button>`;
  document.body.appendChild(dock);

  const fab = dock.querySelector('.wa-fab');
  const sheet = dock.querySelector('.wa-sheet');
  const setOpen = (open) => {
    sheet.hidden = !open;
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) sheet.querySelector('.wa-opts a').focus();
  };

  fab.addEventListener('click', (e) => { e.stopPropagation(); setOpen(sheet.hidden); });
  dock.querySelector('.wa-close').addEventListener('click', () => { setOpen(false); fab.focus(); });
  dock.querySelector('.wa-dismiss').addEventListener('click', () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* private mode */ }
    dock.remove();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sheet.hidden) { setOpen(false); fab.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!sheet.hidden && !dock.contains(e.target)) setOpen(false);
  });

  // The sheet's links are created here, after the initial pass, so they need
  // their own enrichment — otherwise they stay as bare "#" placeholders.
  enrichStaticLinks();

  return dock;
}

/**
 * Reveal the launcher only once the visitor has actually engaged: scrolled
 * meaningfully, stayed a while, or finished something. Never on load.
 */
function initDock() {
  if (dismissed()) return { reveal() {} };
  const dock = buildDock();
  let shown = false;
  const reveal = () => {
    if (shown) return;
    shown = true;
    dock.classList.add('is-ready');
  };

  const onScroll = () => {
    const de = document.documentElement;
    const max = de.scrollHeight - de.clientHeight;
    if (max <= 0) return;
    if ((de.scrollTop || document.body.scrollTop) / max > 0.35) {
      reveal();
      window.removeEventListener('scroll', onScroll);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  setTimeout(reveal, 35000);
  return { reveal };
}

/**
 * Watch for a tool actually producing a result, then offer help in that exact
 * context. This reads the DOM instead of patching every tool's own script.
 */
function initContextualOffers(dock) {
  const path = location.pathname;

  const inject = (anchor, html, extra) => {
    if (!anchor || anchor.parentNode.querySelector('.wa-inline')) return;
    const box = document.createElement('div');
    box.className = 'wa-inline';
    box.innerHTML = html;
    anchor.insertAdjacentElement('afterend', box);
    enrichStaticLinks(extra);
    dock.reveal();
  };

  // Placement test: the single highest-intent moment on the whole site.
  if (path.includes('/einstufungstest/')) {
    const watch = new MutationObserver(() => {
      const band = document.querySelector('.result-band');
      const level = band?.querySelector('.result-level')?.textContent?.trim();
      if (band && level) {
        watch.disconnect();
        inject(band,
          `<p>مستواك التقديري <strong>${level}</strong>. لو حبيت تبدأ من المستوى ده مع مدرّس،
           فيه حصة تجريبية مجانية — وممكن كمان تكمل بنفسك بخطة الـ١٢ أسبوع المجانية.</p>
           <a class="btn" data-wa-intent="trial" href="#">احجز حصة تجريبية مجانية</a>`,
          `مستواي حسب اختبار الموقع: ${level}.`);
      }
    });
    watch.observe(document.body, { childList: true, subtree: true });
  }

  // Letter generator: offer a human review only once a letter really exists.
  if (path.includes('/vorlagen/')) {
    const out = document.querySelector('.vt-out');
    if (out) {
      const watch = new MutationObserver(() => {
        if ((out.textContent || '').trim().length > 120) {
          watch.disconnect();
          inject(out.closest('.vt-out-card') || out,
            `<p>تحب حد يراجع خطابك قبل ما تبعته؟ ابعته لنا على واتساب ونقولك رأينا.</p>
             <a class="btn" data-wa-intent="help" href="#">راجع خطابي</a>`,
            'وعايز حد يراجع خطاب كتبته بالأداة.');
        }
      });
      watch.observe(out, { childList: true, characterData: true, subtree: true });
    }
  }
}

function init() {
  initNav();
  enrichStaticLinks();
  const dock = initDock();
  initContextualOffers(dock);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
