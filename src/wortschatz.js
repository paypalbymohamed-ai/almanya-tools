// حصيلة كلمات بالمجال: فلاتر (تمريض/Ausbildung/IT) + بحث + بطاقات قابلة للفلترة + كويز سريع.
// القرار: بدون localStorage هنا (بعكس lernplan) لأن الاستخدام المتوقع أسرع وأقصر — تصفح وحفظ
// بالعين، مش تتبّع تقدّم طويل المدى.
import "./styles.css";
import { WORTSCHATZ, DOMAINS } from "./data/wortschatz.js";

function initWortschatz() {
  const listEl = document.getElementById("ws-list");
  const filterEl = document.getElementById("ws-filters");
  const searchEl = document.getElementById("ws-search");
  const countEl = document.getElementById("ws-count");
  if (!listEl || !filterEl || !searchEl) return;

  let activeDomain = "all";
  let query = "";

  function renderFilters() {
    const domains = [["all", { label: "الكل", short: "الكل" }], ...Object.entries(DOMAINS)];
    filterEl.innerHTML = "";
    domains.forEach(([key, d]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ws-filter" + (key === activeDomain ? " active" : "");
      b.textContent = d.short;
      b.addEventListener("click", () => {
        activeDomain = key;
        renderFilters();
        renderList();
      });
      filterEl.appendChild(b);
    });
  }

  function renderList() {
    const q = query.trim().toLowerCase();
    const rows = WORTSCHATZ.filter((r) => {
      if (activeDomain !== "all" && r[4] !== activeDomain) return false;
      if (!q) return true;
      return (
        r[0].toLowerCase().includes(q) ||
        r[3].toLowerCase().includes(q)
      );
    });
    countEl.textContent = `عدد الكلمات: ${rows.length}`;
    listEl.innerHTML = "";
    if (rows.length === 0) {
      listEl.innerHTML = '<p class="ws-empty">مافيش نتائج مطابقة.</p>';
      return;
    }
    rows.forEach(([word, gender, plural, ar, domain]) => {
      const card = document.createElement("div");
      card.className = "ws-card";
      const genderClass = gender ? `g-${gender.replace("der", "der").replace("die", "die").replace("das", "das")}` : "";
      card.innerHTML =
        `<div class="ws-de"><span class="ws-gender ${genderClass}">${gender || ""}</span> <span class="de">${word.replace(/^(der|die|das)\s/, "")}</span></div>` +
        `<div class="ws-ar">${ar}</div>` +
        `<div class="ws-meta"><span class="ws-plural">جمع: <span class="de">${plural}</span></span><span class="ws-domain-tag">${DOMAINS[domain]?.short || domain}</span></div>`;
      listEl.appendChild(card);
    });
  }

  searchEl.addEventListener("input", () => {
    query = searchEl.value;
    renderList();
  });

  renderFilters();
  renderList();

  // Quick quiz: 8 random words, guess the article.
  const quizEl = document.getElementById("ws-quiz");
  if (quizEl) {
    let qi = 0;
    let score = 0;
    let pool = [];

    function pickPool() {
      const shuffled = [...WORTSCHATZ].sort(() => Math.random() - 0.5);
      pool = shuffled.slice(0, 8).filter((r) => r[1]);
      qi = 0;
      score = 0;
    }

    function renderQuiz() {
      if (qi >= pool.length) {
        quizEl.innerHTML =
          `<div class="ws-quiz-done"><p>خلصت! نتيجتك: <b>${score} / ${pool.length}</b></p>` +
          '<button type="button" class="btn" id="ws-quiz-again">أعد الاختبار</button></div>';
        document.getElementById("ws-quiz-again")?.addEventListener("click", () => {
          pickPool();
          renderQuiz();
        });
        return;
      }
      const [word, gender, , ar] = pool[qi];
      const bare = word.replace(/^(der|die|das)\s/, "");
      quizEl.innerHTML =
        `<p class="ws-quiz-q">سؤال ${qi + 1} من ${pool.length} — إيه أداة التعريف الصح لكلمة <span class="de">${bare}</span> (${ar})؟</p>` +
        '<div class="ws-quiz-opts">' +
        ["der", "die", "das"]
          .map((g) => `<button type="button" class="ws-quiz-opt" data-g="${g}">${g}</button>`)
          .join("") +
        "</div><p class=\"ws-quiz-fb\" id=\"ws-quiz-fb\" hidden></p>";
      quizEl.querySelectorAll(".ws-quiz-opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          const chosen = btn.getAttribute("data-g");
          const correct = chosen === gender;
          if (correct) score += 1;
          quizEl.querySelectorAll(".ws-quiz-opt").forEach((b2) => (b2.disabled = true));
          const fb = document.getElementById("ws-quiz-fb");
          fb.hidden = false;
          fb.textContent = correct
            ? "صحيح ✓"
            : `غلط — الصحيح: ${gender} ${bare}`;
          fb.className = "ws-quiz-fb " + (correct ? "ok" : "no");
          setTimeout(() => {
            qi += 1;
            renderQuiz();
          }, 1100);
        });
      });
    }

    pickPool();
    renderQuiz();
  }
}

initWortschatz();
