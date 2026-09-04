import "./styles.css";
import { NOUNS, GENDER_RULES, PLURAL_RULES } from "./data/nouns.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fold = (s) => s.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss");

const WORDS = NOUNS.map(([w, g, pl, ar, topic]) => ({ w, g, pl, ar, topic })).sort((a, b) => a.w.localeCompare(b.w, "de"));

/* ---------------- search ---------------- */
const out = $("#result");
const input = $("#q");

function matchedRules(w) {
  return GENDER_RULES.filter((r) => r.test(w));
}

function card(n) {
  const rules = matchedRules(n.w).filter((r) => r.g === n.g);
  const ruleHtml = rules.length
    ? `<p class="hint" style="font-size:.95rem">القاعدة اللي بتفسّرها: <b>${esc(rules[0].label)}</b> — ${esc(rules[0].note)}</p>`
    : `<p class="hint" style="font-size:.95rem">مفيش قاعدة شكلية تحكمها — دي كلمة بتتحفظ بالـArtikel بتاعها.</p>`;
  return `<div class="card">
    <p style="margin:0 0 .2rem;font-size:.85rem;color:var(--muted)">${esc(n.topic)}</p>
    <p class="quiz-word de" style="margin:0"><span class="g-${n.g}">${esc(n.g)}</span> ${esc(n.w)}</p>
    <p style="margin:.1rem 0 .6rem">${esc(n.ar)}</p>
    <div class="parts">
      <span class="part"><b>Singular</b><span class="de"><span class="g-${n.g}">${esc(n.g)}</span> ${esc(n.w)}</span></span>
      <span class="part"><b>Plural</b><span class="de">${n.pl === "—" ? "— (مالهاش جمع مستخدم)" : `<span class="g-die">die</span> ${esc(n.pl)}</span>`}</span>
      <span class="part"><b>Akkusativ</b><span class="de">${esc(n.g === "der" ? "den" : n.g)} ${esc(n.w)}</span></span>
      <span class="part"><b>Dativ</b><span class="de">${esc(n.g === "die" ? "der" : "dem")} ${esc(n.w)}</span></span>
    </div>
    ${ruleHtml}
    <p class="hint">في الجمع الـArtikel دايماً <b class="de g-die">die</b>، وفي الـDativ للجمع بيبقى <b class="de">den</b> + ‎-n.</p>
  </div>`;
}

function search(q, push = true) {
  const n = fold(q.trim());
  if (!n) return;
  const exact = WORDS.filter((x) => fold(x.w) === n);
  const starts = WORDS.filter((x) => fold(x.w).startsWith(n) && fold(x.w) !== n);
  const inside = WORDS.filter((x) => fold(x.w).includes(n) && !fold(x.w).startsWith(n));
  const arabic = WORDS.filter((x) => x.ar.includes(q.trim()));
  const hits = [...exact, ...starts, ...inside, ...arabic];

  if (!hits.length) {
    const guess = matchedRules(q.trim());
    out.innerHTML = `<div class="card">
      <p style="margin:0 0 .5rem">الكلمة «${esc(q)}» مش في قاعدة البيانات (فيها ${WORDS.length} كلمة لحد الآن).</p>
      ${guess.length ? `<p style="margin:0">بس شكل الكلمة بيقول إنها <b class="gpill g-${guess[0].g} de">${esc(guess[0].g)}</b> — ${esc(guess[0].note)}</p>` : `<p style="margin:0">جرّب تكتبها بالألماني بحرف كبير (زي <span class="de">Wohnung</span>) أو اكتب المعنى بالعربي.</p>`}
    </div>`;
  } else {
    out.innerHTML = hits.slice(0, 1).map(card).join("");
    if (hits.length > 1) {
      out.insertAdjacentHTML(
        "beforeend",
        `<p class="hint" style="margin-top:.8rem">كلمات قريبة:</p><div class="chips">${hits
          .slice(1, 10)
          .map((x) => `<button class="chip" data-word="${esc(x.w)}"><span class="de g-${x.g}">${esc(x.g)}</span> <span class="de">${esc(x.w)}</span></button>`)
          .join("")}</div>`
      );
    }
  }
  if (push) {
    const url = new URL(location.href);
    url.searchParams.set("w", q);
    history.replaceState(null, "", url);
  }
}

$("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  search(input.value);
});

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-word]");
  if (!b) return;
  input.value = b.dataset.word;
  search(b.dataset.word);
  out.scrollIntoView({ block: "nearest" });
});

/* ---------------- quiz: 10 words ---------------- */
const QUIZ_LEN = 10;
let quiz = [];
let idx = 0;
let score = 0;

const qWord = $("#quiz-word");
const qTopic = $("#quiz-topic");
const qFb = $("#quiz-fb");
const qBar = $("#quiz-bar");
const qCount = $("#quiz-count");
const qBtns = [...document.querySelectorAll(".qbtn")];
const qAgain = $("#quiz-again");

function pick() {
  const pool = WORDS.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, QUIZ_LEN);
}

function paint() {
  const n = quiz[idx];
  qWord.textContent = n.w;
  qTopic.textContent = `${n.ar} · ${n.topic}`;
  qCount.textContent = `سؤال ${idx + 1} من ${QUIZ_LEN} · صح: ${score}`;
  qBar.style.width = `${(idx / QUIZ_LEN) * 100}%`;
  qFb.innerHTML = "";
  qBtns.forEach((b) => {
    b.disabled = false;
    b.className = "qbtn";
  });
  qAgain.hidden = true;
}

function answer(g, btn) {
  const n = quiz[idx];
  const right = g === n.g;
  if (right) score++;
  qBtns.forEach((b) => {
    b.disabled = true;
    if (b.dataset.g === n.g) b.classList.add("right");
  });
  if (!right) btn.classList.add("wrong");
  const rule = matchedRules(n.w).find((r) => r.g === n.g);
  qFb.innerHTML = `${right ? '<span class="ok">صح!</span>' : `<span class="no">غلط.</span>`}
    <span class="de"><b class="g-${n.g}">${esc(n.g)}</b> ${esc(n.w)}</span> ·
    الجمع: <span class="de">${n.pl === "—" ? "مالهاش جمع" : `<b class="g-die">die</b> ${esc(n.pl)}`}</span>
    ${rule ? `<br><span style="font-weight:400;color:var(--muted)">${esc(rule.note)}</span>` : ""}`;
  setTimeout(() => {
    idx++;
    if (idx < QUIZ_LEN) paint();
    else finish();
  }, right ? 900 : 2600);
}

function finish() {
  qBar.style.width = "100%";
  qWord.textContent = `${score} / ${QUIZ_LEN}`;
  qTopic.textContent = score >= 8 ? "مستوى ممتاز في الـArtikel" : score >= 5 ? "لسه محتاج مراجعة القواعد اللي تحت" : "ابدأ بقواعد ‎-ung و ‎-chen و ‎-um، دي أسرع مكسب";
  qCount.textContent = "خلصت الجولة";
  qFb.innerHTML = "";
  qBtns.forEach((b) => (b.disabled = true));
  qAgain.hidden = false;
}

qBtns.forEach((b) => b.addEventListener("click", () => answer(b.dataset.g, b)));
qAgain.addEventListener("click", () => {
  quiz = pick();
  idx = 0;
  score = 0;
  paint();
});

quiz = pick();
paint();

/* ---------------- browsable table + rules ---------------- */
const tbody = $("#noun-list");
let filter = "all";

function drawList() {
  const rows = WORDS.filter((n) => filter === "all" || n.g === filter);
  tbody.innerHTML = rows
    .map(
      (n) => `<tr>
      <td><span class="gpill g-${n.g} de">${esc(n.g)}</span></td>
      <th scope="row"><button class="chip" data-word="${esc(n.w)}" style="border:0;background:none;padding:0;color:var(--action);font-weight:700"><span class="de">${esc(n.w)}</span></button></th>
      <td class="de">${n.pl === "—" ? "—" : esc(n.pl)}</td>
      <td>${esc(n.ar)}</td>
      <td>${esc(n.topic)}</td>
    </tr>`
    )
    .join("");
  $("#noun-count").textContent = rows.length;
}

document.querySelectorAll("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    filter = b.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    drawList();
  })
);
drawList();

$("#plural-rules").innerHTML = PLURAL_RULES.map(
  ([form, when, ex]) => `<tr><th scope="row" class="de">${esc(form)}</th><td>${esc(when)}</td><td class="de">${esc(ex)}</td></tr>`
).join("");

$("#gender-rules").innerHTML = GENDER_RULES.map(
  (r) => `<tr><td><span class="gpill g-${r.g} de">${esc(r.g)}</span></td><th scope="row" class="de">${esc(r.label)}</th><td>${esc(r.note)}</td></tr>`
).join("");

const initial = new URLSearchParams(location.search).get("w");
if (initial) { input.value = initial; search(initial, false); } else { search("Wohnung", false); }
