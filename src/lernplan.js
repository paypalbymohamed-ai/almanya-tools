import "./styles.css";

/**
 * خطة مذاكرة ١٢ أسبوع بـchecklist بتتحفظ في المتصفح (localStorage).
 * القرار التصميمي: الحفظ محلي بالكامل — مافيش حساب ولا سيرفر، فالخصوصية مضمونة
 * والأداة تشتغل أوفلاين. الثمن إن التقدّم مربوط بالمتصفح والجهاز، وده مكتوب صريح للمستخدم.
 */

const STORE_KEY = "almanya_lernplan_v1";

const PLAN = [
  {
    week: 1, phase: "A1 — الأساس",
    goal: "الحروف والنطق + التعريف بنفسك",
    tasks: [
      "اتعلّم نطق الحروف الخاصة: ä ö ü ß و ei / ie / eu / ch",
      "احفظ ٢٠ كلمة من مواضيع: التحية، الأرقام ١–٢٠، الجنسيات",
      "اتقن تصريف sein و haben في المضارع غيابياً",
      "اكتب ٥ جمل بتعرّف بنفسك (اسم، بلد، سكن، شغل، سن)",
    ],
  },
  {
    week: 2, phase: "A1 — الأساس",
    goal: "تصريف المضارع + ترتيب الجملة",
    tasks: [
      "اتقن نهايات المضارع للأفعال العادية: -e -st -t -en -t -en",
      "افهم قاعدة «الفعل تاني حاجة في الجملة» واكتب ١٠ جمل عليها",
      "ذاكر ١٥ فعل شائع بمعناهم",
      "استخدم مصرّف الأفعال على ١٠ أفعال شاذة وشوف الفرق",
    ],
    tool: { href: "../verben/", label: "مصرّف الأفعال" },
  },
  {
    week: 3, phase: "A1 — الأساس",
    goal: "أدوات التعريف والجمع",
    tasks: [
      "احفظ قواعد النهايات: -ung / -heit / -keit / -schaft / -ion ← die",
      "احفظ: -chen / -lein / -um ← das",
      "ذاكر ٣٠ اسم، وكل اسم مع أداته وجمعه في نفس الوقت",
      "اعمل كويز der/die/das لحد ما تجيب ٨ من ١٠",
    ],
    tool: { href: "../der-die-das/", label: "أداة der/die/das" },
  },
  {
    week: 4, phase: "A1 — الأساس",
    goal: "Akkusativ + النفي",
    tasks: [
      "اتقن جدول الـAkkusativ (المذكر بس بيتغيّر: der ← den)",
      "احفظ حروف الجر بالـAkkusativ: durch / für / gegen / ohne / um",
      "اتعلّم الفرق بين nicht و kein واستخدمهم في ١٠ جمل",
      "راجع أسابيع ١–٣ واعمل اختبار تحديد المستوى كقياس أول",
    ],
    tool: { href: "../einstufungstest/", label: "اختبار تحديد المستوى" },
  },
  {
    week: 5, phase: "A2 — البناء",
    goal: "Dativ — أهم أسبوع في الخطة",
    tasks: [
      "اتقن جدول الـDativ كامل، ومعاه الـ-n في جمع الـDativ",
      "احفظ حروف الجر بالـDativ: aus / bei / mit / nach / seit / von / zu",
      "احفظ أفعال الـDativ: helfen / danken / gehören / gefallen / passen / schmecken",
      "اعمل مدرّب الحالات لحد ما تجيب ٨ من ١٠",
    ],
    tool: { href: "../faelle/", label: "مدرّب الحالات" },
  },
  {
    week: 6, phase: "A2 — البناء",
    goal: "حروف الجر المتغيّرة (Wechselpräpositionen)",
    tasks: [
      "افهم قاعدة الحركة/الثبات: wohin? ← Akkusativ و wo? ← Dativ",
      "احفظ أزواج الأفعال: legen/liegen و stellen/stehen و setzen/sitzen",
      "اكتب ١٠ جمل بنفس حرف الجر مرة بحركة ومرة بثبات",
      "راجع الحالات الأربعة مع بعض في جدول واحد بخط إيدك",
    ],
    tool: { href: "../faelle/#huruf", label: "حروف الجر بالحالة" },
  },
  {
    week: 7, phase: "A2 — البناء",
    goal: "الماضي: Perfekt",
    tasks: [
      "اتقن تركيب haben/sein + Partizip II",
      "اعرف امتى بتستخدم sein (أفعال الحركة وتغيّر الحالة)",
      "احفظ Partizip II لأهم ٣٠ فعل شاذ",
      "احكي يومك امبارح في ٨ جمل بالـPerfekt",
    ],
    tool: { href: "../verben/", label: "مصرّف الأفعال" },
  },
  {
    week: 8, phase: "A2 — البناء",
    goal: "الأفعال المنفصلة + الأفعال المساعدة",
    tasks: [
      "افهم الأفعال المنفصلة: aufstehen ← ich stehe um 7 Uhr auf",
      "احفظ أشهر البادئات المنفصلة: auf- / aus- / ein- / mit- / vor- / zu- / an-",
      "اتقن الأفعال المساعدة: können / müssen / wollen / dürfen / sollen / mögen",
      "اكتب ١٠ جمل بفعل مساعد + مصدر آخر الجملة",
    ],
  },
  {
    week: 9, phase: "B1 — التوسيع",
    goal: "الجمل المركّبة",
    tasks: [
      "اتقن weil و dass — الفعل يروح آخر الجملة",
      "اتقن deshalb و trotzdem — دول بيغيّروا ترتيب الجملة",
      "اتعلّم obwohl و wenn و als واعرف الفرق بين wenn و als",
      "اكتب فقرة ٨ سطور فيها ٤ روابط مختلفة على الأقل",
    ],
  },
  {
    week: 10, phase: "B1 — التوسيع",
    goal: "الصفات + الجمل الوصفية",
    tasks: [
      "اتقن نهايات الصفة بعد der/die/das",
      "اتقن نهايات الصفة بعد ein/eine",
      "اتعلّم المقارنة والتفضيل: groß / größer / am größten",
      "اتعلّم الجمل الوصفية بـder/die/das كضمير وصل",
    ],
  },
  {
    week: 11, phase: "B1 — التوسيع",
    goal: "المبني للمجهول + Konjunktiv II",
    tasks: [
      "اتقن الـPassiv: werden + Partizip II في المضارع والماضي",
      "اتقن Konjunktiv II: hätte / wäre / würde + مصدر",
      "اتعلّم الطلب المؤدّب: Könnten Sie … / Ich hätte gern …",
      "اقرا نص إخباري قصير وحدّد كل جملة مبنية للمجهول فيه",
    ],
  },
  {
    week: 12, phase: "B1 — التوسيع",
    goal: "المراجعة والقياس",
    tasks: [
      "اعمل اختبار تحديد المستوى تاني وقارن بنتيجة أسبوع ٤",
      "راجع أضعف محورين في نتيجتك بالأدوات المخصّصة ليهم",
      "اكتب رسالة رسمية قصيرة (طلب موعد أو استفسار)",
      "اتكلّم ٥ دقايق متواصلة عن موضوع مألوف وسجّل نفسك",
    ],
    tool: { href: "../einstufungstest/", label: "اختبار تحديد المستوى" },
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    // Corrupt or unavailable storage must not break the page — the plan is still readable.
    console.warn("lernplan: could not read saved progress:", err);
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.warn("lernplan: could not save progress:", err);
    return false;
  }
}

function init() {
  const root = document.querySelector("#lernplan");
  if (!root) return;

  const listEl = root.querySelector("#lp-list");
  const barEl = root.querySelector("#lp-bar");
  const statEl = root.querySelector("#lp-stat");
  const resetBtn = root.querySelector("#lp-reset");
  const warnEl = root.querySelector("#lp-warn");

  let state = loadState();
  const totalTasks = PLAN.reduce((sum, w) => sum + w.tasks.length, 0);

  function key(w, t) {
    return "w" + w + "t" + t;
  }

  function refreshTotals() {
    const done = Object.keys(state).filter((k) => state[k]).length;
    const pct = Math.round((done / totalTasks) * 100);
    barEl.style.width = pct + "%";
    statEl.textContent = "خلّصت " + done + " من " + totalTasks + " مهمة (" + pct + "٪)";

    PLAN.forEach((w) => {
      const wrap = listEl.querySelector('[data-week="' + w.week + '"]');
      if (!wrap) return;
      const doneCount = w.tasks.filter((_, i) => state[key(w.week, i)]).length;
      const badge = wrap.querySelector(".week-badge");
      badge.textContent = doneCount + "/" + w.tasks.length;
      wrap.classList.toggle("done", doneCount === w.tasks.length);
    });
  }

  function render() {
    listEl.innerHTML = "";
    let lastPhase = null;

    PLAN.forEach((w) => {
      if (w.phase !== lastPhase) {
        const h = document.createElement("h3");
        h.textContent = w.phase;
        listEl.appendChild(h);
        lastPhase = w.phase;
      }

      const d = document.createElement("details");
      d.className = "week";
      d.dataset.week = String(w.week);

      const s = document.createElement("summary");
      s.innerHTML =
        "<b>أسبوع " + w.week + "</b>" +
        '<span class="week-badge"></span>' +
        "<span>" + w.goal + "</span>";
      d.appendChild(s);

      w.tasks.forEach((text, i) => {
        const id = "lp-" + key(w.week, i);
        const row = document.createElement("div");
        row.className = "task";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = id;
        cb.checked = Boolean(state[key(w.week, i)]);
        cb.addEventListener("change", () => {
          state[key(w.week, i)] = cb.checked;
          if (!saveState(state)) warnEl.hidden = false;
          refreshTotals();
        });

        const lab = document.createElement("label");
        lab.htmlFor = id;
        lab.textContent = text;

        row.appendChild(cb);
        row.appendChild(lab);
        d.appendChild(row);
      });

      if (w.tool) {
        const p = document.createElement("p");
        p.className = "chips";
        p.innerHTML = '<a class="chip go" href="' + w.tool.href + '">' + w.tool.label + " ←</a>";
        d.appendChild(p);
      }

      listEl.appendChild(d);
    });

    refreshTotals();
  }

  resetBtn.addEventListener("click", () => {
    if (!window.confirm("هتمسح كل التقدّم المحفوظ. متأكد؟")) return;
    state = {};
    saveState(state);
    render();
  });

  render();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
