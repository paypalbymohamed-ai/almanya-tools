// قائمة استعداد لامتحان Goethe/telc — checklist محلي بالكامل (localStorage)، بنفس منطق
// خطة المذاكرة (lernplan.js): مافيش حساب ولا سيرفر، والتقدّم مربوط بالجهاز والمتصفح فقط.
import "./styles.css";

const STORE_KEY = "almanya_goethetelc_v1";

const SECTIONS = [
  {
    id: "lesen",
    label: "Lesen — القراءة",
    items: [
      "اتدرّب على قراءة نص طويل في ٢٥ دقيقة بدون قاموس — التوقيت هو أكبر ضغط في هذا القسم",
      "افهم الفرق بين «صحيح/خطأ/غير مذكور» — الفخ الأساسي إنك تفترض معلومة مش موجودة في النص",
      "اقرا عناوين الجرايد والإعلانات الألمانية بسرعة (Überschriften-Scanning) بدل قراءة كل كلمة",
    ],
  },
  {
    id: "hoeren",
    label: "Hören — الاستماع",
    items: [
      "تدرّب على سماع النص مرة واحدة بس (زي الامتحان الحقيقي) مش بتكرار لحد ما تفهم",
      "اكتب الأرقام والتواريخ والأسماء وقت الاستماع فوراً — دايماً بييجي سؤال عليهم",
      "اتعرّف على لكنات مختلفة (شمال وجنوب ألمانيا) قبل الامتحان بأسبوعين على الأقل",
    ],
  },
  {
    id: "schreiben",
    label: "Schreiben — الكتابة",
    items: [
      "احفظ هيكل الرسالة الرسمية جاهز (Anrede → مقدمة → جسم → طلب → Grußformel) واستخدم مولّد الرسائل للتمرين",
      "اتدرّب على كتابة ١٥٠–١٨٠ كلمة في ٢٠ دقيقة بالضبط — تجاوز الوقت بيفوّت نص الامتحان",
      "راجع أخطاء الحالات (Akkusativ/Dativ) بعد كل تمرين كتابة — هي أكتر خصم درجات في هذا القسم",
    ],
  },
  {
    id: "sprechen",
    label: "Sprechen — المحادثة",
    items: [
      "اتدرّب على تقديم نفسك في دقيقة واحدة بدون توقف أو «إممم» طويلة",
      "جهّز ٥ جمل رأي جاهزة (Ich denke… / Meiner Meinung nach…) تقدر تلزّقها في أي سؤال",
      "اعمل محاكاة الجزء التفاعلي (التخطيط لحاجة مع partner وهمي) بصوت عالي مش في دماغك بس",
    ],
  },
];

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

function save(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function totalItems() {
  return SECTIONS.reduce((n, s) => n + s.items.length, 0);
}

function render() {
  const root = document.getElementById("gt-checklist");
  if (!root) return;
  const state = load();
  const done = Object.values(state).filter(Boolean).length;
  const total = totalItems();

  const head = document.createElement("div");
  head.className = "plan-head";
  head.innerHTML = `
    <div class="progress" style="flex:1"><i style="width:${total ? (done / total) * 100 : 0}%"></i></div>
    <span class="quiz-meta">${done} / ${total}</span>
  `;
  root.appendChild(head);

  SECTIONS.forEach((section) => {
    const sectionDone = section.items.filter((_, i) => state[`${section.id}-${i}`]).length;
    const details = document.createElement("details");
    details.className = "week" + (sectionDone === section.items.length ? " done" : "");
    details.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML = `<b>${section.label}</b><span class="week-badge">${sectionDone}/${section.items.length}</span>`;
    details.appendChild(summary);

    section.items.forEach((text, i) => {
      const key = `${section.id}-${i}`;
      const row = document.createElement("div");
      row.className = "task";
      const inputId = `gt-${key}`;
      row.innerHTML = `
        <input type="checkbox" id="${inputId}" ${state[key] ? "checked" : ""} />
        <label for="${inputId}">${text}</label>
      `;
      row.querySelector("input").addEventListener("change", (e) => {
        const s = load();
        s[key] = e.target.checked;
        save(s);
        root.innerHTML = "";
        render();
      });
      details.appendChild(row);
    });

    root.appendChild(details);
  });
}

document.addEventListener("DOMContentLoaded", render);

const resetBtn = document.getElementById("gt-reset");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (confirm("تصفير كل تحديدات الاستعداد؟")) {
      localStorage.removeItem(STORE_KEY);
      const root = document.getElementById("gt-checklist");
      if (root) {
        root.innerHTML = "";
        render();
      }
    }
  });
}
