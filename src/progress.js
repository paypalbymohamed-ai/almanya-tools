/**
 * Cross-tool learner progress — the retention layer.
 *
 * WHY THIS EXISTS
 * Before this, four of the six tools (verbs, der/die/das, cases, placement
 * test) wrote nothing to storage. A learner could answer 40 quiz questions,
 * close the tab, and return to a site that had never met them. There was
 * literally nothing to come back to. Only the 12-week plan and the letter
 * templates remembered anything.
 *
 * DESIGN CONSTRAINTS, in priority order
 *  1. No accounts, ever. Everything is localStorage on the learner's own
 *     device. Zero sign-up friction is this site's structural advantage over
 *     every app it competes with — the research on delayed sign-up walls says
 *     the sign-up moment is where interested users leak away, and we simply
 *     don't have one to leak from.
 *  2. Guilt-free. Evidence supports retrieval practice and habit cues; it does
 *     NOT support loss-anxiety, guilt reminders, or extrinsic-reward pressure,
 *     which risk crowding out intrinsic motivation. So: a broken streak
 *     restarts silently and is never mentioned. There is no "you lost it!",
 *     no red warning, no shaming copy, and no nagging.
 *  3. Never blocks learning. Every read is defensive: private mode, disabled
 *     storage, or corrupt JSON must degrade to "no progress yet", never throw
 *     and take a tool's page script down with it.
 *
 * The mistake bank is the load-bearing feature. Reviewing exactly what you got
 * wrong is well-supported retrieval practice with corrective feedback, and it
 * doubles as the honest reason to return tomorrow: the queue is *yours*, it is
 * finite, and it shrinks when you clear it.
 */

const KEY = 'at_progress_v1';
const DAILY_GOAL = 10;
const MISTAKE_CAP = 60; // keep the queue finite, so it always feels clearable

/* ─────────────────────── storage, defensively ─────────────────────── */

const BLANK = () => ({
  days: [],        // 'YYYY-MM-DD', ascending, distinct
  daily: {},       // 'YYYY-MM-DD' -> answers attempted that day
  correct: 0,
  attempts: 0,
  mistakes: {},    // tool -> { id: {label, meta, misses, at} }
  seen: {},        // tool -> count of distinct items practised
  resume: null,    // { tool, label, href, detail, at }
  recent: {},      // tool -> [{label, href}] most recent lookups
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return BLANK();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return BLANK();
    return { ...BLANK(), ...parsed };
  } catch {
    return BLANK(); // private mode, quota, or corrupt JSON — all the same to us
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* private mode: progress is a bonus, never a requirement */ }
}

/** Local calendar day, not UTC — a learner in Cairo must not roll over at 2am. */
function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function dayBefore(iso, n = 1) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - n);
  const p = (x) => String(x).padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

/* ─────────────────────── writes ─────────────────────── */

export function recordVisit() {
  const s = load();
  const t = today();
  if (!s.days.includes(t)) {
    s.days.push(t);
    s.days.sort();
    if (s.days.length > 400) s.days = s.days.slice(-400);
    save(s);
  }
  return s;
}

/**
 * Remember where the learner was, so the homepage can offer a way back.
 * Called on every tool page load, so resume works without per-tool wiring.
 */
export function recordActivity({ tool, label, href, detail }) {
  const s = load();
  s.resume = { tool, label, href, detail: detail || '', at: Date.now() };
  save(s);
}

/** A lookup is weaker signal than a quiz answer, but it is still intent. */
export function recordLookup({ tool, label, href, detail }) {
  const s = load();
  const list = (s.recent[tool] || []).filter((x) => x.label !== label);
  list.unshift({ label, href, detail: detail || '' });
  s.recent[tool] = list.slice(0, 8);
  s.resume = { tool, label: label, href, detail: detail || '', at: Date.now(), lookup: true };
  save(s);
}

/**
 * Record one quiz answer. Wrong answers enter the mistake bank; getting the
 * same item right later removes it, so the queue is a live picture of what the
 * learner still hasn't got — not a permanent record of failure.
 */
export function recordAttempt({ tool, id, label, correct, meta }) {
  const s = load();
  const t = today();
  s.attempts += 1;
  s.daily[t] = (s.daily[t] || 0) + 1;
  if (correct) s.correct += 1;

  const bank = s.mistakes[tool] || {};
  if (correct) {
    delete bank[id]; // cleared — earned its way out of the queue
  } else {
    const prev = bank[id];
    bank[id] = { label, meta: meta || null, misses: (prev?.misses || 0) + 1, at: Date.now() };
  }
  // Cap by oldest, so a long history can never make the queue feel hopeless.
  const ids = Object.keys(bank);
  if (ids.length > MISTAKE_CAP) {
    ids.sort((a, b) => bank[a].at - bank[b].at).slice(0, ids.length - MISTAKE_CAP)
      .forEach((k) => delete bank[k]);
  }
  s.mistakes[tool] = bank;

  const seen = s.seen[tool] || {};
  seen[id] = true;
  s.seen[tool] = seen;

  save(s);
  return s;
}

export function getMistakes(tool) {
  const bank = load().mistakes[tool] || {};
  return Object.entries(bank)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.misses - a.misses || a.at - b.at);
}

export function clearAllMistakes(tool) {
  const s = load();
  delete s.mistakes[tool];
  save(s);
}

/* ─────────────────────── reads ─────────────────────── */

/**
 * Consecutive days ending today or yesterday. Counting yesterday as "still
 * alive" is deliberate: a learner who studies daily but opens the site at
 * 00:30 must not be told their streak died. Broken streaks just return a
 * smaller number — no state anywhere records that one was lost.
 */
export function streak() {
  const s = load();
  if (!s.days.length) return 0;
  const t = today();
  const last = s.days[s.days.length - 1];
  if (last !== t && last !== dayBefore(t)) return 0;
  let n = 1;
  let cursor = last;
  const set = new Set(s.days);
  while (set.has(dayBefore(cursor))) { n += 1; cursor = dayBefore(cursor); }
  return n;
}

export function summary() {
  const s = load();
  const t = today();
  const mistakeCount = Object.values(s.mistakes)
    .reduce((sum, bank) => sum + Object.keys(bank).length, 0);
  return {
    days: s.days.length,
    streak: streak(),
    attempts: s.attempts,
    correct: s.correct,
    todayCount: s.daily[t] || 0,
    goal: DAILY_GOAL,
    goalMet: (s.daily[t] || 0) >= DAILY_GOAL,
    mistakeCount,
    mistakesByTool: Object.fromEntries(
      Object.entries(s.mistakes).map(([k, v]) => [k, Object.keys(v).length])
    ),
    resume: s.resume,
    recent: s.recent,
    isNew: s.attempts === 0 && !s.resume,
  };
}

export { DAILY_GOAL };
