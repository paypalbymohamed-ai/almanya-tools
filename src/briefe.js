// Formal-letter generator: three templates (Bewerbung, Terminanfrage, Wohnungsanfrage).
// The learning value is in the fixed formal scaffolding (Anrede/Betreff/Grußformel) —
// the tool fills the variable slots and keeps the scaffold visible so the user learns
// the pattern, not just copies a finished text.
import "./styles.css";

const TEMPLATES = {
  bewerbung: {
    label: "طلب توظيف (Bewerbung)",
    fields: [
      { key: "job", ar: "اسم الوظيفة", de: "Stellenbezeichnung", placeholder: "Pflegefachkraft" },
      { key: "firma", ar: "اسم الشركة", de: "Firmenname", placeholder: "Klinikum München" },
      { key: "name", ar: "اسمك", de: "Ihr Name", placeholder: "Ahmed Youssef" },
      { key: "ref", ar: "مصدر الإعلان (اختياري)", de: "Quelle der Anzeige", placeholder: "auf Ihrer Website" }
    ],
    build(v) {
      const ref = v.ref ? ` ${v.ref}` : " in Ihrer Stellenanzeige";
      return [
        "Sehr geehrte Damen und Herren,",
        "",
        `mit großem Interesse habe ich Ihre Stellenanzeige für die Position als ${v.job || "___"}${ref} gelesen. Hiermit bewerbe ich mich um diese Stelle bei ${v.firma || "___"}.`,
        "",
        "Durch meine bisherige Ausbildung und Berufserfahrung bringe ich die notwendigen Kenntnisse und Fähigkeiten für diese Position mit. Ich bin motiviert, zuverlässig und arbeite gerne im Team.",
        "",
        "Über die Möglichkeit eines persönlichen Gesprächs würde ich mich sehr freuen. Meine vollständigen Bewerbungsunterlagen finden Sie im Anhang.",
        "",
        "Mit freundlichen Grüßen",
        v.name || "___"
      ].join("\n");
    },
    tip: "خليك محدد في السطر التاني (اسم الوظيفة والشركة) — أرباب العمل بيلاحظوا فوراً لو الخطاب عام وممكن يتبعت لأي شركة."
  },
  termin: {
    label: "طلب موعد (Terminanfrage)",
    fields: [
      { key: "amt", ar: "الجهة (مكتب/عيادة)", de: "Behörde/Praxis", placeholder: "Ausländerbehörde" },
      { key: "grund", ar: "سبب الموعد", de: "Anliegen", placeholder: "Verlängerung meines Aufenthaltstitels" },
      { key: "name", ar: "اسمك", de: "Ihr Name", placeholder: "Sara Ali" },
      { key: "kontakt", ar: "رقم الموبايل أو الإيميل", de: "Kontaktdaten", placeholder: "0176 1234567" }
    ],
    build(v) {
      return [
        "Sehr geehrte Damen und Herren,",
        "",
        `ich möchte gerne einen Termin bei Ihnen vereinbaren. Mein Anliegen betrifft: ${v.grund || "___"}.`,
        "",
        `Ich bitte Sie höflich um einen zeitnahen Termin bei ${v.amt || "___"}. Bitte teilen Sie mir mit, welche Termine für Sie möglich sind.`,
        "",
        "Für Rückfragen erreichen Sie mich unter folgenden Kontaktdaten:",
        `${v.kontakt || "___"}`,
        "",
        "Vielen Dank im Voraus für Ihre Bemühungen.",
        "",
        "Mit freundlichen Grüßen",
        v.name || "___"
      ].join("\n");
    },
    tip: "اكتب السبب في سطر واحد واضح (زي «تجديد الإقامة» أو «تسجيل عنوان جديد») — الموظف بيحدد نوع الموعد بناءً عليه، فالعمومية بتأخر الرد."
  },
  wohnung: {
    label: "استفسار عن شقة (Wohnungsanfrage)",
    fields: [
      { key: "adresse", ar: "عنوان الشقة أو رقم الإعلان", de: "Wohnung/Anzeige", placeholder: "3-Zimmer-Wohnung, Musterstraße 5" },
      { key: "name", ar: "اسمك", de: "Ihr Name", placeholder: "Mohamed Farouk" },
      { key: "beruf", ar: "وظيفتك", de: "Beruf", placeholder: "Ausbildung als Krankenpfleger" },
      { key: "kontakt", ar: "رقم الموبايل أو الإيميل", de: "Kontaktdaten", placeholder: "0176 9876543" }
    ],
    build(v) {
      return [
        "Sehr geehrte Damen und Herren,",
        "",
        `mit großem Interesse habe ich Ihre Anzeige zu folgender Wohnung gelesen: ${v.adresse || "___"}. Ich möchte mich hiermit als Mieter/in bewerben.`,
        "",
        `Zu meiner Person: Ich bin ${v.beruf || "___"} und suche eine Wohnung in Ihrer Nähe. Ich bin zuverlässig, nichtraucherisch und kann alle notwendigen Unterlagen (Einkommensnachweis, SCHUFA, Mietschuldenfreiheitsbescheinigung) vorlegen.`,
        "",
        "Über die Möglichkeit einer Besichtigung würde ich mich sehr freuen.",
        "",
        `Kontakt: ${v.kontakt || "___"}`,
        "",
        "Mit freundlichen Grüßen",
        v.name || "___"
      ].join("\n");
    },
    tip: "سوق العقارات في ألمانيا فيه منافسة كبيرة — الرد السريع بمستندات جاهزة (SCHUFA وإثبات الدخل) بيفرق أكتر من صياغة الرسالة نفسها."
  }
};

export function initBriefe() {
  const root = document.querySelector("#briefe");
  if (!root) return;

  const tabsEl = root.querySelector("#bf-tabs");
  const fieldsEl = root.querySelector("#bf-fields");
  const outEl = root.querySelector("#bf-output");
  const tipEl = root.querySelector("#bf-tip");
  const copyBtn = root.querySelector("#bf-copy");
  const copyMsg = root.querySelector("#bf-copy-msg");

  let current = "bewerbung";
  const values = {};

  function renderTabs() {
    tabsEl.innerHTML = "";
    Object.keys(TEMPLATES).forEach((key) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn" + (key === current ? "" : " ghost");
      b.textContent = TEMPLATES[key].label;
      b.addEventListener("click", () => {
        current = key;
        renderTabs();
        renderFields();
        renderOutput();
      });
      tabsEl.appendChild(b);
    });
  }

  function renderFields() {
    const tpl = TEMPLATES[current];
    values[current] = values[current] || {};
    fieldsEl.innerHTML = "";
    tpl.fields.forEach((f) => {
      const wrap = document.createElement("label");
      wrap.className = "bf-field";
      wrap.innerHTML =
        '<span class="bf-field-label">' +
        f.ar +
        ' <span class="de bf-field-de">(' +
        f.de +
        ")</span></span>";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = f.placeholder;
      input.value = values[current][f.key] || "";
      input.addEventListener("input", () => {
        values[current][f.key] = input.value;
        renderOutput();
      });
      wrap.appendChild(input);
      fieldsEl.appendChild(wrap);
    });
  }

  function renderOutput() {
    const tpl = TEMPLATES[current];
    outEl.textContent = tpl.build(values[current] || {});
    tipEl.innerHTML = "<b>نصيحة:</b> " + tpl.tip;
  }

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(outEl.textContent);
      copyMsg.hidden = false;
      copyMsg.textContent = "تم النسخ ✓";
      setTimeout(() => {
        copyMsg.hidden = true;
      }, 2000);
    } catch {
      copyMsg.hidden = false;
      copyMsg.textContent = "حدد النص ونسخه يدوياً (Ctrl/Cmd+C)";
    }
  });

  renderTabs();
  renderFields();
  renderOutput();
}

initBriefe();
