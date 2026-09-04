import "./styles.css";

/**
 * قوالب المراسلات الرسمية بالألماني.
 *
 * القرار التصميمي: الأداة مش "قوالب جاهزة تنسخها زي ما هي". دي بتولّد الخطاب من
 * بياناتك أنت، وبتسيب أي خانة فاضية كعلامة صريحة بين قوسين مربعين — عشان المستخدم
 * يشوف بعينه إن فيه حاجة ناقصة قبل ما يبعت، بدل ما يبعت خطاب فيه اسم شخص تاني.
 * أي بيانات بتتكتب بتفضل في المتصفح ومش بتتبعت لأي سيرفر.
 */

const STORE_KEY = "almanya_vorlagen_v1";

/** أي خانة فاضية بتطلع كعلامة واضحة، مش بتتخفّي. */
const ph = (value, label) => {
  const v = (value || "").trim();
  return v ? v : "[" + label + "]";
};

/** سطر بيختفي بالكامل لو مفيهوش بيانات — عشان مايطلعش سطر فاضي في الخطاب. */
const optLine = (value) => {
  const v = (value || "").trim();
  return v ? v + "\n" : "";
};

/** الـAnrede الصح على حسب اسم جهة الاتصال. أول كلمة بعد الفاصلة بتفضل صغيرة — قاعدة ألمانية. */
const anrede = (v) => {
  const name = (v.kontakt || "").trim();
  const anr = (v.anrede_typ || "").trim();
  if (!name) return "Sehr geehrte Damen und Herren,";
  if (anr === "frau") return "Sehr geehrte Frau " + name + ",";
  if (anr === "herr") return "Sehr geehrter Herr " + name + ",";
  return "Sehr geehrte Damen und Herren,";
};

const absender = (v) =>
  ph(v.name, "اسمك الكامل") + "\n" +
  optLine(v.strasse) +
  optLine(v.ort) +
  optLine(v.telefon) +
  optLine(v.email);

const empfaenger = (v) =>
  ph(v.firma, "اسم الجهة أو الشركة") + "\n" +
  optLine((v.kontakt || "").trim() && (v.anrede_typ === "frau" ? "Frau " : v.anrede_typ === "herr" ? "Herr " : "") + v.kontakt) +
  optLine(v.firma_strasse) +
  optLine(v.firma_ort);

const datumZeile = (v) =>
  ph(v.stadt, "مدينتك") + ", den " + ph(v.datum, "التاريخ");

const gruss = (v) => "Mit freundlichen Grüßen\n\n\n" + ph(v.name, "اسمك الكامل");

/* الحقول المشتركة في كل القوالب — بيانات المُرسل. */
const ABSENDER_FIELDS = [
  { k: "name", label: "اسمك الكامل", ph: "Vorname Nachname", req: true },
  { k: "strasse", label: "الشارع ورقم البيت", ph: "Musterstraße 12" },
  { k: "ort", label: "الرمز البريدي والمدينة", ph: "50667 Köln" },
  { k: "telefon", label: "التليفون", ph: "0151 23456789" },
  { k: "email", label: "الإيميل", ph: "name@example.com" },
  { k: "stadt", label: "المدينة (لسطر التاريخ)", ph: "Köln" },
  { k: "datum", label: "التاريخ", ph: "04.09.2026", type: "date_de" },
];

/* حقول جهة الاستلام. */
const EMPFAENGER_FIELDS = [
  { k: "firma", label: "اسم الجهة / الشركة", ph: "Muster GmbH", req: true },
  { k: "kontakt", label: "اسم الشخص المسؤول (لو معروف)", ph: "Schmidt" },
  {
    k: "anrede_typ", label: "الشخص ده", type: "select",
    options: [
      { v: "", t: "مش معروف — استخدم Damen und Herren" },
      { v: "frau", t: "سيدة (Frau)" },
      { v: "herr", t: "سيد (Herr)" },
    ],
  },
  { k: "firma_strasse", label: "شارع الجهة", ph: "Hauptstraße 5" },
  { k: "firma_ort", label: "الرمز البريدي ومدينة الجهة", ph: "50667 Köln" },
];

const TEMPLATES = [
  {
    id: "bewerbung",
    tab: "تقديم على شغل / Ausbildung",
    de: "Bewerbung",
    title: "خطاب تقديم على وظيفة أو Ausbildung",
    lede:
      "ده أهم خطاب هتكتبه بالألماني. الشركات الألمانية بتقرا الـBewerbung بترتيب ثابت، " +
      "وأي خروج عن الترتيب ده بيقرا كإنك مش فاهم الشكل الرسمي. القالب ده ماشي على الترتيب المتوقّع بالحرف.",
    fields: [
      { k: "stelle", label: "الوظيفة اللي بتقدّم عليها", ph: "Pflegefachkraft", req: true },
      { k: "referenz", label: "رقم الإعلان / المرجع (لو موجود)", ph: "Ref. 2026-114" },
      { k: "quelle", label: "شفت الإعلان فين", ph: "auf Ihrer Webseite" },
      { k: "situation", label: "وضعك الحالي", ph: "arbeite ich als Pflegehelfer in Kairo" },
      { k: "qualifikation", label: "أهم مؤهل عندك", ph: "eine dreijährige Ausbildung als Krankenpfleger" },
      { k: "erfahrung", label: "سنين الخبرة", ph: "vier Jahre" },
      { k: "sprachniveau", label: "مستوى الألماني", ph: "B1" },
      { k: "eintritt", label: "متاح تبدأ إمتى", ph: "ab dem 01.01.2027" },
    ],
    build: (v) =>
      absender(v) + "\n" +
      empfaenger(v) + "\n" +
      datumZeile(v) + "\n\n" +
      "Bewerbung als " + ph(v.stelle, "الوظيفة") +
      ((v.referenz || "").trim() ? " — " + v.referenz.trim() : "") + "\n\n" +
      anrede(v) + "\n\n" +
      "mit großem Interesse habe ich Ihre Stellenanzeige für die Position als " +
      ph(v.stelle, "الوظيفة") + " " + ph(v.quelle, "مكان الإعلان") + " gelesen. " +
      "Zurzeit " + ph(v.situation, "وضعك الحالي") + ". " +
      "Deshalb möchte ich mich bei Ihnen bewerben.\n\n" +
      "Ich habe " + ph(v.qualifikation, "مؤهلك") + " abgeschlossen und verfüge über " +
      ph(v.erfahrung, "سنين الخبرة") + " Berufserfahrung in diesem Bereich. " +
      "Sorgfältiges und zuverlässiges Arbeiten ist für mich selbstverständlich, " +
      "und ich arbeite gern im Team.\n\n" +
      "Die deutsche Sprache beherrsche ich auf dem Niveau " + ph(v.sprachniveau, "مستوى الألماني") +
      ", und ich verbessere sie kontinuierlich weiter. " +
      "Eine Tätigkeit in Ihrem Haus wäre für mich der nächste wichtige Schritt, " +
      "weil ich meine Erfahrung dort langfristig einsetzen möchte. " +
      "Verfügbar bin ich " + ph(v.eintritt, "تاريخ البدء") + ".\n\n" +
      "Über eine Einladung zu einem persönlichen Gespräch freue ich mich sehr.\n\n" +
      gruss(v) + "\n\n" +
      "Anlagen: Lebenslauf, Zeugnisse, Sprachzertifikat",
    tips: [
      "أول كلمة بعد الـAnrede بتبدأ <b>بحرف صغير</b> — لأن الفاصلة بعد <span class=\"de\">Sehr geehrte …,</span> مش نقطة. أشهر غلط في الخطابات.",
      "متكتبش <span class=\"de\">Ich will</span> — الصح <span class=\"de\">Ich möchte</span>. الأولى بتقرا كطلب متشدّد في السياق الرسمي.",
      "صفحة واحدة بالكتير. الشركة الألمانية بتقرا الخطاب في أقل من دقيقة، والخطاب الطويل بيقرا كإنك مش عارف تختصر.",
      "لو الإعلان فيه اسم شخص، استخدمه. <span class=\"de\">Sehr geehrte Damen und Herren</span> بتستخدم بس لما الاسم مش معروف فعلاً.",
    ],
  },
  {
    id: "termin",
    tab: "طلب موعد",
    de: "Terminanfrage",
    title: "طلب موعد من جهة رسمية أو عيادة",
    lede:
      "الجهات الرسمية في ألمانيا (Ausländerbehörde، Jobcenter، Bürgeramt) والعيادات بتتعامل مع " +
      "طلب الموعد كطلب مكتوب مختصر. الخطاب الناجح بيقول <b>مين انت</b> و<b>عايز إيه</b> و<b>إمتى فاضي</b> في ٣ أسطر.",
    fields: [
      { k: "anliegen", label: "الموضوع بالألماني", ph: "die Verlängerung meiner Aufenthaltserlaubnis", req: true },
      { k: "aktenzeichen", label: "رقم الملف / رقم العميل (لو موجود)", ph: "AZ 12-345678" },
      { k: "geburtsdatum", label: "تاريخ ميلادك", ph: "01.01.1995" },
      { k: "zeiten", label: "الأوقات اللي تناسبك", ph: "montags und mittwochs vormittags" },
      { k: "frist", label: "فيه موعد نهائي؟ (لو فيه)", ph: "bis zum 30.10.2026" },
    ],
    build: (v) =>
      absender(v) + "\n" +
      empfaenger(v) + "\n" +
      datumZeile(v) + "\n\n" +
      "Terminanfrage" +
      ((v.aktenzeichen || "").trim() ? " — " + v.aktenzeichen.trim() : "") + "\n\n" +
      anrede(v) + "\n\n" +
      "ich möchte gern einen Termin bei Ihnen vereinbaren. Es geht um " +
      ph(v.anliegen, "الموضوع") + ".\n\n" +
      "Meine Daten:\n" +
      "Name: " + ph(v.name, "اسمك الكامل") + "\n" +
      "Geburtsdatum: " + ph(v.geburtsdatum, "تاريخ الميلاد") + "\n" +
      ((v.aktenzeichen || "").trim() ? "Aktenzeichen: " + v.aktenzeichen.trim() + "\n" : "") +
      "\n" +
      "Terminlich passen mir " + ph(v.zeiten, "الأوقات المناسبة") + ". " +
      "Ich richte mich aber gern nach Ihren freien Zeiten." +
      ((v.frist || "").trim()
        ? " Da die Angelegenheit " + v.frist.trim() + " erledigt sein muss, wäre ich für einen zeitnahen Termin dankbar."
        : "") + "\n\n" +
      "Bitte teilen Sie mir einen möglichen Termin schriftlich mit. Vielen Dank im Voraus.\n\n" +
      gruss(v),
    tips: [
      "اكتب رقم الملف (<span class=\"de\">Aktenzeichen</span>) لو عندك — بيقفز بالطلب لبداية الطابور لأن الموظف بيلاقي ملفك فوراً.",
      "<span class=\"de\">Ich richte mich nach Ihren freien Zeiten</span> جملة مهمة: بتوريهم إنك مرن، وبتزوّد فرصة إنهم يبعتوا موعد بسرعة.",
      "متطلبش موعد مستعجل من غير سبب مكتوب. لو فيه تاريخ نهائي (تجديد إقامة، عقد شغل)، اكتبه صريح.",
      "لو الجهة عندها بورتال أونلاين للمواعيد، استخدمه الأول — الخطاب ده للجهات اللي بتقبل الإيميل أو البريد.",
    ],
  },
  {
    id: "wohnung",
    tab: "طلب سكن",
    de: "Wohnungsanfrage",
    title: "طلب معاينة شقة (Wohnungsanfrage)",
    lede:
      "سوق السكن في ألمانيا فيه منافسة عالية جداً، والمالك بياخد قراره من أول رسالة. " +
      "الرسالة اللي بتوصل للمعاينة هي اللي بتجاوب على أسئلته قبل ما يسألها: بتشتغل إيه، دخلك كام، ومعاك ورق إيه.",
    fields: [
      { k: "objekt", label: "الشقة (غرف ومنطقة)", ph: "3-Zimmer-Wohnung in Köln-Ehrenfeld", req: true },
      { k: "anzeige", label: "الإعلان لقيته فين", ph: "auf ImmoScout24" },
      { k: "beruf", label: "شغلك", ph: "Pflegefachkraft" },
      { k: "arbeitgeber", label: "جهة العمل", ph: "Uniklinik Köln" },
      { k: "vertrag", label: "نوع العقد", ph: "unbefristet" },
      { k: "einkommen", label: "الدخل الصافي شهرياً بالأورو", ph: "2400" },
      { k: "personen", label: "هتسكن بكام فرد", ph: "zwei" },
      { k: "einzug", label: "متاح تدخل إمتى", ph: "ab dem 01.11.2026" },
    ],
    build: (v) =>
      absender(v) + "\n" +
      empfaenger(v) + "\n" +
      datumZeile(v) + "\n\n" +
      "Anfrage zur " + ph(v.objekt, "وصف الشقة") + " — Besichtigungstermin\n\n" +
      anrede(v) + "\n\n" +
      "Ihre Anzeige für die " + ph(v.objekt, "وصف الشقة") + " " +
      ph(v.anzeige, "مكان الإعلان") + " hat mich sehr interessiert. " +
      "Ich möchte die Wohnung gern besichtigen.\n\n" +
      "Zu meiner Person: Ich arbeite als " + ph(v.beruf, "شغلك") + " bei " +
      ph(v.arbeitgeber, "جهة العمل") + ". Mein Arbeitsvertrag ist " +
      ph(v.vertrag, "نوع العقد") + ", und mein monatliches Nettoeinkommen beträgt " +
      ph(v.einkommen, "الدخل") + " Euro. Die Wohnung würde ich mit " +
      ph(v.personen, "عدد الأفراد") + " Personen bewohnen. Ich bin Nichtraucher " +
      "und halte keine Haustiere. Einziehen könnte ich " + ph(v.einzug, "تاريخ الدخول") + ".\n\n" +
      "Folgende Unterlagen kann ich Ihnen vollständig vorlegen:\n" +
      "- SCHUFA-Auskunft\n" +
      "- Einkommensnachweise der letzten drei Monate\n" +
      "- Kopie des Personalausweises bzw. Aufenthaltstitels\n" +
      "- Mietschuldenfreiheitsbescheinigung des jetzigen Vermieters\n\n" +
      "Über eine Einladung zur Besichtigung freue ich mich sehr. " +
      "Telefonisch erreichen Sie mich unter " + ph(v.telefon, "التليفون") + ".\n\n" +
      gruss(v),
    tips: [
      "قائمة الورق (<span class=\"de\">Unterlagen</span>) هي أقوى حاجة في الرسالة — المالك بيدوّر على مستأجر جاهز، مش على مستأجر هيلم ورقه بعدين.",
      "اكتب الدخل الصافي بالأرقام. القاعدة العملية عندهم: الإيجار الدافئ ماينفعش يزيد عن تلت الدخل الصافي.",
      "<span class=\"de\">Mietschuldenfreiheitsbescheinigung</span> ورقة من المالك الحالي بتقول إنك مامدينش إيجار — لو أول سكن لك في ألمانيا، شيل السطر ده.",
      "ابعت الرسالة في أول ٢٤ ساعة من نشر الإعلان. الشقة المطلوبة بتتحدد معاينتها قبل ما الإعلان يكمل يومين.",
    ],
  },
  {
    id: "kuendigung",
    tab: "إلغاء عقد",
    de: "Kündigung",
    title: "إلغاء عقد (جيم، تليفون، إنترنت، تأمين)",
    lede:
      "في ألمانيا العقد بيتجدّد تلقائي لو مابعتّش إلغاء مكتوب في الوقت. " +
      "الخطاب ده مكتوب بالصيغة اللي الشركات ملزومة تقبلها، وبيطلب <b>تأكيد كتابي</b> — وده اللي بيحميك لو ادّعوا إنهم مستلموش.",
    fields: [
      { k: "vertragsart", label: "نوع العقد", ph: "Fitnessstudio-Vertrag", req: true },
      { k: "vertragsnummer", label: "رقم العقد / رقم العميل", ph: "KD-998877", req: true },
      { k: "kuendigung_zum", label: "الإلغاء ساري من", ph: "zum nächstmöglichen Zeitpunkt" },
    ],
    build: (v) =>
      absender(v) + "\n" +
      empfaenger(v) + "\n" +
      datumZeile(v) + "\n\n" +
      "Kündigung meines " + ph(v.vertragsart, "نوع العقد") +
      " — Kundennummer " + ph(v.vertragsnummer, "رقم العقد") + "\n\n" +
      anrede(v) + "\n\n" +
      "hiermit kündige ich meinen " + ph(v.vertragsart, "نوع العقد") +
      " mit der Kundennummer " + ph(v.vertragsnummer, "رقم العقد") + " " +
      ph(v.kuendigung_zum, "تاريخ سريان الإلغاء") + ".\n\n" +
      "Bitte bestätigen Sie mir die Kündigung schriftlich und nennen Sie mir " +
      "das genaue Datum, zu dem der Vertrag endet. " +
      "Sollte eine Kündigung zum genannten Termin nicht möglich sein, " +
      "kündige ich hiermit zum nächstmöglichen Zeitpunkt.\n\n" +
      "Etwaige Einzugsermächtigungen widerrufe ich mit Wirkung " +
      "zum Ende des Vertragsverhältnisses.\n\n" +
      gruss(v),
    tips: [
      "الجملة الأخيرة (<span class=\"de\">zum nächstmöglichen Zeitpunkt</span>) مقصودة: لو حسبت التاريخ غلط، الإلغاء بيفضل صحيح لأقرب موعد ممكن بدل ما يبطل خلاص.",
      "اطلب التأكيد الكتابي دايماً واحتفظ بيه. من غيره مافيش إثبات إنك بعتت.",
      "ابعت بالبريد المسجّل (<span class=\"de\">Einwurf-Einschreiben</span>) لو العقد فيه فلوس شهرية — الإيصال بيبقى دليل التاريخ.",
      "<span class=\"de\">Widerruf der Einzugsermächtigung</span> بيوقف الخصم التلقائي بعد نهاية العقد بس، مش قبلها.",
    ],
  },
  {
    id: "krankmeldung",
    tab: "إبلاغ مرض",
    de: "Krankmeldung",
    title: "إبلاغ الشغل أو المدرسة بمرض",
    lede:
      "الإبلاغ لازم يوصل <b>في نفس اليوم وقبل بداية الشيفت</b>. الخطاب ده قصير بالقصد — " +
      "الشغل مش محتاج تشخيص، محتاج بس يعرف إنك مش جاي ولحد إمتى.",
    fields: [
      { k: "bis_wann", label: "التقرير الطبي لحد إمتى", ph: "bis zum 08.09.2026", req: true },
      { k: "erster_tag", label: "أول يوم غياب", ph: "heute, 04.09.2026" },
      { k: "nachweis", label: "هتبعت التقرير إزاي", ph: "heute per Post" },
      { k: "vertretung", label: "شغل عاجل محتاج حد يغطّيه؟", ph: "die Schichtplanung für Freitag" },
    ],
    build: (v) =>
      absender(v) + "\n" +
      empfaenger(v) + "\n" +
      datumZeile(v) + "\n\n" +
      "Krankmeldung\n\n" +
      anrede(v) + "\n\n" +
      "leider bin ich erkrankt und kann ab " + ph(v.erster_tag, "أول يوم غياب") +
      " nicht zur Arbeit kommen. " +
      "Der Arzt hat mich " + ph(v.bis_wann, "لحد إمتى") + " krankgeschrieben.\n\n" +
      "Die Arbeitsunfähigkeitsbescheinigung sende ich Ihnen " +
      ph(v.nachweis, "طريقة إرسال التقرير") + ".\n\n" +
      ((v.vertretung || "").trim()
        ? "Dringend wäre aus meinen Aufgaben lediglich " + v.vertretung.trim() +
          ". Hier bitte ich Sie, eine Vertretung einzuplanen.\n\n"
        : "") +
      "Sobald sich mein Zustand ändert, melde ich mich bei Ihnen.\n\n" +
      gruss(v),
    tips: [
      "الإبلاغ في نفس اليوم وقبل بداية الشيفت — التأخير ده هو المشكلة القانونية الحقيقية، مش الغياب نفسه.",
      "متكتبش التشخيص. صاحب الشغل مش من حقه يعرف مرضك إيه، والقانون مش بيلزمك تقوله.",
      "التقرير الطبي (<span class=\"de\">AU-Bescheinigung</span>) بيتطلب عادةً من رابع يوم غياب، لكن كتير من العقود بتطلبه من أول يوم — راجع عقدك.",
      "لو مدرسة أو معهد لغة، نفس القالب بيشتغل — بدّل <span class=\"de\">zur Arbeit</span> بـ<span class=\"de\">zum Unterricht</span>.",
    ],
  },
];

/* ── الحالة ───────────────────────────────────────────────────────── */

let activeId = TEMPLATES[0].id;
let values = {};
let storageOk = true;

const load = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    values = raw ? JSON.parse(raw) : {};
    if (typeof values !== "object" || values === null) values = {};
  } catch {
    storageOk = false;
    values = {};
  }
};

const save = () => {
  if (!storageOk) return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(values));
  } catch {
    storageOk = false;
  }
};

const tpl = () => TEMPLATES.find((t) => t.id === activeId) || TEMPLATES[0];

/* ── الرسم ────────────────────────────────────────────────────────── */

const el = (id) => document.getElementById(id);

function renderTabs() {
  const box = el("vt-tabs");
  if (!box) return;
  box.innerHTML = "";
  TEMPLATES.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (t.id === activeId ? " go" : "");
    b.textContent = t.tab;
    b.setAttribute("aria-pressed", String(t.id === activeId));
    b.addEventListener("click", () => {
      activeId = t.id;
      renderAll();
      const h = el("vt-form-head");
      if (h) h.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    box.appendChild(b);
  });
}

function fieldRow(f) {
  const wrap = document.createElement("div");
  wrap.className = "vt-field";

  const lab = document.createElement("label");
  lab.setAttribute("for", "vt-" + f.k);
  lab.textContent = f.label + (f.req ? " *" : "");
  wrap.appendChild(lab);

  let input;
  if (f.type === "select") {
    input = document.createElement("select");
    (f.options || []).forEach((o) => {
      const op = document.createElement("option");
      op.value = o.v;
      op.textContent = o.t;
      input.appendChild(op);
    });
    input.value = values[f.k] || "";
  } else {
    input = document.createElement("input");
    input.type = "text";
    input.placeholder = f.ph || "";
    input.setAttribute("dir", "auto");
    input.autocomplete = "off";
    input.value = values[f.k] || "";
  }
  input.id = "vt-" + f.k;
  input.addEventListener("input", () => {
    values[f.k] = input.value;
    save();
    renderOutput();
  });
  input.addEventListener("change", () => {
    values[f.k] = input.value;
    save();
    renderOutput();
  });
  wrap.appendChild(input);
  return wrap;
}

function renderForm() {
  const t = tpl();

  const head = el("vt-form-head");
  if (head) {
    head.innerHTML =
      "<h3>" + t.title + " <span class=\"de\">(" + t.de + ")</span></h3>" +
      "<p>" + t.lede + "</p>";
  }

  const shared = el("vt-shared");
  if (shared) {
    shared.innerHTML = "";
    ABSENDER_FIELDS.forEach((f) => shared.appendChild(fieldRow(f)));
  }

  const emp = el("vt-empfaenger");
  if (emp) {
    emp.innerHTML = "";
    EMPFAENGER_FIELDS.forEach((f) => emp.appendChild(fieldRow(f)));
  }

  const spec = el("vt-specific");
  if (spec) {
    spec.innerHTML = "";
    t.fields.forEach((f) => spec.appendChild(fieldRow(f)));
  }

  const tips = el("vt-tips");
  if (tips) {
    tips.innerHTML =
      "<h3>نصايح على القالب ده</h3><ul>" +
      t.tips.map((x) => "<li>" + x + "</li>").join("") +
      "</ul>";
  }
}

function renderOutput() {
  const out = el("vt-out");
  if (!out) return;
  const text = tpl().build(values);
  out.textContent = text;

  const missing = (text.match(/\[[^\]]+\]/g) || []).length;
  const warn = el("vt-missing");
  if (warn) {
    if (missing > 0) {
      warn.hidden = false;
      warn.innerHTML =
        "لسه فيه <b>" + missing + "</b> خانة ناقصة في الخطاب، وظاهرة جوّاه بين قوسين مربعين " +
        "[زي كده]. املاها قبل ما تبعت.";
    } else {
      warn.hidden = true;
    }
  }
}

function renderAll() {
  renderTabs();
  renderForm();
  renderOutput();
}

/* ── نسخ وتنزيل ──────────────────────────────────────────────────── */

function flash(btn, msg) {
  const old = btn.textContent;
  btn.textContent = msg;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = old;
    btn.disabled = false;
  }, 1600);
}

function wireActions() {
  const copy = el("vt-copy");
  if (copy) {
    copy.addEventListener("click", async () => {
      const text = tpl().build(values);
      try {
        await navigator.clipboard.writeText(text);
        flash(copy, "اتنسخ ✓");
      } catch {
        const ta = el("vt-out");
        if (ta) {
          const r = document.createRange();
          r.selectNodeContents(ta);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
        }
        flash(copy, "اعمل نسخ بنفسك");
      }
    });
  }

  const dl = el("vt-download");
  if (dl) {
    dl.addEventListener("click", () => {
      const t = tpl();
      const blob = new Blob([t.build(values)], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = t.de + ".txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      flash(dl, "اتنزّل ✓");
    });
  }

  const reset = el("vt-reset");
  if (reset) {
    reset.addEventListener("click", () => {
      values = {};
      save();
      renderAll();
    });
  }
}

load();
if (!storageOk) {
  const w = el("vt-warn");
  if (w) w.hidden = false;
}
renderAll();
wireActions();
