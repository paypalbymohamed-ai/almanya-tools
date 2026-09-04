import "./styles.css";

/**
 * اختبار تحديد المستوى A1–B1.
 * كل سؤال متعلّم بـ:
 *   area  — المهارة (بتظهر في نتيجة تفصيلية وبتوصّل للأداة المناسبة)
 *   level — المستوى اللي السؤال بيقيسه
 * النتيجة مش مجموع أعمى: المستوى بيتحدّد بنسبة الإجابات الصح في كل مستوى،
 * عشان حد يجيب A1 كله و B1 غلط ميطلعش B1.
 */

const AREAS = {
  artikel: { label: "أداة التعريف", tool: "../der-die-das/", toolLabel: "أداة der/die/das" },
  kasus: { label: "الحالات", tool: "../faelle/", toolLabel: "مدرّب الحالات" },
  verben: { label: "الأفعال", tool: "../verben/", toolLabel: "مصرّف الأفعال" },
  praep: { label: "حروف الجر", tool: "../faelle/#huruf", toolLabel: "حروف الجر بالحالة" },
  wortschatz: { label: "المفردات", tool: null, toolLabel: null },
  satzbau: { label: "ترتيب الجملة", tool: null, toolLabel: null },
};

const QUESTIONS = [
  // ---------- A1 ----------
  {
    level: "A1", area: "artikel",
    q: "اختار الأداة الصح: ؟؟؟ Haus ist groß.",
    opts: ["das", "der", "die"], answer: 0,
    why: "‏Haus محايد → das. والكلمات اللي بتنتهي بـ -chen و -lein و -um محايدة كذلك.",
  },
  {
    level: "A1", area: "verben",
    q: "كمّل: Ich ؟؟؟ aus Ägypten.",
    opts: ["komme", "kommen", "kommt"], answer: 0,
    why: "مع ich الفعل بياخد النهاية -e: ich komme.",
  },
  {
    level: "A1", area: "wortschatz",
    q: "إيه معنى: Wie geht es dir?",
    opts: ["إزيك؟", "انت فين؟", "اسمك إيه؟"], answer: 0,
    why: "‏Wie geht es dir? = إزيك / عامل إيه.",
  },
  {
    level: "A1", area: "verben",
    q: "كمّل: Du ؟؟؟ sehr gut Deutsch.",
    opts: ["sprichst", "sprechen", "spricht"], answer: 0,
    why: "مع du الفعل بياخد -st، و sprechen فعل شاذ بيغيّر e→i: du sprichst.",
  },
  {
    level: "A1", area: "satzbau",
    q: "الجملة الصح فين؟",
    opts: [
      "Heute gehe ich ins Kino.",
      "Heute ich gehe ins Kino.",
      "Ich heute gehe ins Kino.",
    ], answer: 0,
    why: "الفعل لازم يكون تاني حاجة في الجملة. لو بدأت بـ heute، الفعل يجي بعدها فوراً وبعديها الفاعل.",
  },
  {
    level: "A1", area: "artikel",
    q: "جمع كلمة das Kind إيه؟",
    opts: ["die Kinder", "die Kinds", "die Kinden"], answer: 0,
    why: "‏das Kind → die Kinder. وكل جمع أداته die.",
  },
  {
    level: "A1", area: "praep",
    q: "كمّل: Ich wohne ؟؟؟ Kairo.",
    opts: ["in", "an", "auf"], answer: 0,
    why: "مع المدن بنستخدم in: in Kairo, in Berlin.",
  },
  {
    level: "A1", area: "kasus",
    q: "كمّل: Ich habe ؟؟؟ Bruder.",
    opts: ["einen", "ein", "einem"], answer: 0,
    why: "‏haben بياخد Akkusativ، والمذكر في الـAkkusativ = einen.",
  },

  // ---------- A2 ----------
  {
    level: "A2", area: "kasus",
    q: "كمّل: Ich helfe ؟؟؟ Mann.",
    opts: ["dem", "den", "der"], answer: 0,
    why: "‏helfen بياخد Dativ إجبارياً، والمذكر في الـDativ = dem. ترجمتها العربية «بساعد الراجل» بتوحي بمفعول مباشر وده اللي بيوقّع الناس.",
  },
  {
    level: "A2", area: "verben",
    q: "الماضي (Perfekt) الصح: Ich ؟؟؟ nach Berlin ؟؟؟.",
    opts: ["bin … gefahren", "habe … gefahren", "bin … fahren"], answer: 0,
    why: "أفعال الحركة بتاخد sein في الـPerfekt: ich bin gefahren.",
  },
  {
    level: "A2", area: "praep",
    q: "كمّل: Ich lege das Buch ؟؟؟ Tisch.",
    opts: ["auf den", "auf dem", "auf der"], answer: 0,
    why: "فيه حركة (wohin?) فحرف الجر auf بياخد Akkusativ → auf den Tisch. لو كان ثابت (liegt) يبقى auf dem Tisch.",
  },
  {
    level: "A2", area: "satzbau",
    q: "كمّل: Ich weiß, dass er heute ؟؟؟.",
    opts: ["kommt", "kommt heute", "kommen"], answer: 0,
    why: "بعد dass الفعل يروح آخر الجملة: …, dass er heute kommt.",
  },
  {
    level: "A2", area: "verben",
    q: "كمّل: Als Kind ؟؟؟ ich viel Fußball.",
    opts: ["spielte", "spiele", "gespielt"], answer: 0,
    why: "الحكي عن الطفولة بالـPräteritum: ich spielte.",
  },
  {
    level: "A2", area: "kasus",
    q: "كمّل: Das ist das Auto ؟؟؟ Lehrers.",
    opts: ["des", "dem", "der"], answer: 0,
    why: "ملكية → Genitiv. المذكر في الـGenitiv = des، والاسم بياخد -s: des Lehrers.",
  },
  {
    level: "A2", area: "wortschatz",
    q: "إيه معنى: Ich habe einen Termin beim Arzt.",
    opts: ["عندي موعد عند الدكتور", "أنا تعبان", "بدور على دكتور"], answer: 0,
    why: "‏Termin = موعد، و beim Arzt = عند الدكتور.",
  },
  {
    level: "A2", area: "praep",
    q: "كمّل: Ich fahre ؟؟؟ Bus zur Arbeit.",
    opts: ["mit dem", "mit den", "mit der"], answer: 0,
    why: "‏mit بتاخد Dativ دايماً، والمذكر في الـDativ = dem.",
  },

  // ---------- B1 ----------
  {
    level: "B1", area: "satzbau",
    q: "كمّل: ؟؟؟ es regnete, gingen wir spazieren.",
    opts: ["Obwohl", "Weil", "Deshalb"], answer: 0,
    why: "المعنى «رغم إن الدنيا كانت بتمطّر، خرجنا نتمشّى» → obwohl. و weil سبب، و deshalb نتيجة.",
  },
  {
    level: "B1", area: "verben",
    q: "المبني للمجهول الصح: Das Haus ؟؟؟ 1990 ؟؟؟.",
    opts: ["wurde … gebaut", "hat … gebaut", "ist … bauen"], answer: 0,
    why: "‏Passiv في الماضي = wurde + Partizip II: wurde gebaut.",
  },
  {
    level: "B1", area: "kasus",
    q: "كمّل: ؟؟؟ des schlechten Wetters blieben wir zu Hause.",
    opts: ["Wegen", "Mit", "Für"], answer: 0,
    why: "‏wegen بتاخد Genitiv → wegen des Wetters. وde mit بتاخد Dativ و für بتاخد Akkusativ.",
  },
  {
    level: "B1", area: "verben",
    q: "الشرط غير الحقيقي: Wenn ich Zeit ؟؟؟, würde ich kommen.",
    opts: ["hätte", "habe", "hatte"], answer: 0,
    why: "‏Konjunktiv II للشرط غير الحقيقي: wenn ich Zeit hätte.",
  },
  {
    level: "B1", area: "artikel",
    q: "الصفة الصح: Ich habe ein ؟؟؟ Auto gekauft.",
    opts: ["neues", "neue", "neuer"], answer: 0,
    why: "بعد ein مع اسم محايد في الـAkkusativ الصفة بتاخد -es: ein neues Auto.",
  },
  {
    level: "B1", area: "satzbau",
    q: "كمّل: Der Mann, ؟؟؟ ich gestern getroffen habe, ist Arzt.",
    opts: ["den", "der", "dem"], answer: 0,
    why: "جملة وصفية: الرجل مفعول للفعل treffen → Akkusativ مذكر = den.",
  },
  {
    level: "B1", area: "wortschatz",
    q: "إيه معنى: Die Bewerbung wurde abgelehnt.",
    opts: ["الطلب اترفض", "الطلب اتقبل", "الطلب لسه بيتراجع"], answer: 0,
    why: "‏ablehnen = يرفض. والقبول يبقى annehmen.",
  },
  {
    level: "B1", area: "praep",
    q: "كمّل: Ich freue mich ؟؟؟ das Wochenende.",
    opts: ["auf", "für", "über"], answer: 0,
    why: "‏sich freuen auf + Akkusativ = يستنى حاجة جايّة بفرح. و sich freuen über لحاجة حصلت خلاص.",
  },
];

function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function decideLevel(byLevel) {
  const rate = (lvl) => (byLevel[lvl].total ? byLevel[lvl].right / byLevel[lvl].total : 0);
  const a1 = rate("A1"), a2 = rate("A2"), b1 = rate("B1");
  if (a1 < 0.6) {
    return {
      level: "A1",
      head: "مستواك في بداية A1",
      body: "الأساسيات لسه محتاجة تثبيت — التصريف في المضارع وأدوات التعريف. ابدأ منهم بالترتيب ومتقفزش للحالات قبلهم.",
    };
  }
  if (a2 < 0.6) {
    return {
      level: "A1+",
      head: "خلّصت A1 وبتدخل A2",
      body: "الأساسيات ماشية، والفاصل دلوقتي هو الحالات (Akkusativ / Dativ) والماضي. دول اللي بيفتحوا A2.",
    };
  }
  if (b1 < 0.55) {
    return {
      level: "A2",
      head: "مستواك A2 مستقر",
      body: "ممتاز في الأساسيات والحالات. اللي ناقص للـB1: الجمل المركّبة (obwohl / dass / weil)، المبني للمجهول، و Konjunktiv II.",
    };
  }
  if (b1 < 0.8) {
    return {
      level: "A2+",
      head: "على حدود B1",
      body: "قريب جداً. ركّز على التراكيب المتقدمة — الجمل الوصفية والمبني للمجهول — وهتعدّي.",
    };
  }
  return {
    level: "B1",
    head: "مستواك B1",
    body: "أساسيات وتراكيب متقدمة كلها ماشية. المرحلة الجاية تكون توسيع مفردات متخصّصة والتدريب على شكل الامتحان.",
  };
}

function init() {
  const root = document.querySelector("#level-test");
  if (!root) return;

  const qEl = root.querySelector("#lt-q");
  const optsEl = root.querySelector("#lt-opts");
  const metaEl = root.querySelector("#lt-meta");
  const barEl = root.querySelector("#lt-bar");
  const resultEl = root.querySelector("#lt-result");
  const startEl = root.querySelector("#lt-start");
  const quizEl = root.querySelector("#lt-quiz");
  const restartBtn = root.querySelector("#lt-restart");
  const startBtn = root.querySelector("#lt-begin");

  let deck = [];
  let idx = 0;
  let answers = [];

  function begin() {
    deck = shuffle(QUESTIONS);
    idx = 0;
    answers = [];
    startEl.hidden = true;
    resultEl.hidden = true;
    quizEl.hidden = false;
    render();
  }

  function render() {
    const item = deck[idx];
    qEl.textContent = item.q;
    metaEl.innerHTML =
      "<span>سؤال " + (idx + 1) + " من " + deck.length + "</span>" +
      '<span>المهارة: ' + AREAS[item.area].label + "</span>";
    barEl.style.width = Math.round((idx / deck.length) * 100) + "%";

    optsEl.innerHTML = "";
    const order = shuffle(item.opts.map((text, i) => ({ text, i })));
    order.forEach(({ text, i }) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "qbtn de";
      b.textContent = text;
      b.addEventListener("click", () => choose(i));
      optsEl.appendChild(b);
    });
  }

  function choose(picked) {
    const item = deck[idx];
    answers.push({ item, correct: picked === item.answer });
    idx++;
    if (idx >= deck.length) finish();
    else render();
  }

  function finish() {
    quizEl.hidden = true;
    resultEl.hidden = false;

    const byLevel = { A1: { right: 0, total: 0 }, A2: { right: 0, total: 0 }, B1: { right: 0, total: 0 } };
    const byArea = {};
    let right = 0;

    answers.forEach(({ item, correct }) => {
      byLevel[item.level].total++;
      if (correct) byLevel[item.level].right++;
      if (!byArea[item.area]) byArea[item.area] = { right: 0, total: 0 };
      byArea[item.area].total++;
      if (correct) byArea[item.area].right++;
      if (correct) right++;
    });

    const verdict = decideLevel(byLevel);

    const areaRows = Object.keys(byArea)
      .map((key) => {
        const a = byArea[key];
        const pct = Math.round((a.right / a.total) * 100);
        return { key, pct, right: a.right, total: a.total, weak: pct < 60 };
      })
      .sort((x, y) => x.pct - y.pct);

    const bars = areaRows
      .map(
        (r) =>
          '<div class="bar-row' + (r.weak ? " weak" : "") + '">' +
          "<span>" + AREAS[r.key].label + "</span>" +
          '<span class="bar-track"><i style="width:' + r.pct + '%"></i></span>' +
          "<span>" + r.right + "/" + r.total + "</span>" +
          "</div>"
      )
      .join("");

    const weakAreas = areaRows.filter((r) => r.weak);
    let advice;
    if (!weakAreas.length) {
      advice = "<p>مافيش مهارة ضعيفة واضحة — كل المحاور فوق ٦٠٪. كمّل على توسيع المفردات والتدريب على شكل الامتحان.</p>";
    } else {
      const links = weakAreas
        .filter((r) => AREAS[r.key].tool)
        .map((r) => '<a class="chip go" href="' + AREAS[r.key].tool + '">' + AREAS[r.key].toolLabel + " ←</a>")
        .join("");
      advice =
        "<p><b>ابدأ من هنا:</b> أضعف محاورك هو <b>" +
        AREAS[weakAreas[0].key].label +
        "</b>" +
        (weakAreas.length > 1 ? " وبعده " + AREAS[weakAreas[1].key].label : "") +
        ".</p>" +
        (links ? '<div class="chips">' + links + "</div>" : "");
    }

    const mistakes = answers.filter((a) => !a.correct);
    const review = mistakes.length
      ? "<h3>مراجعة غلطاتك (" + mistakes.length + ")</h3>" +
        mistakes
          .map(
            (m) =>
              "<details><summary>" +
              m.item.q +
              "</summary><p><b>الصح:</b> <span class=\"de\">" +
              m.item.opts[m.item.answer] +
              "</span><br>" +
              m.item.why +
              "</p></details>"
          )
          .join("")
      : "<p>مافيش غلطات خالص. نتيجة كاملة.</p>";

    resultEl.innerHTML =
      '<div class="result-band">' +
      '<div class="result-level">' + verdict.level + "</div>" +
      "<h3>" + verdict.head + "</h3>" +
      '<p class="result-score">إجابات صح: ' + right + " من " + deck.length + "</p>" +
      "<p>" + verdict.body + "</p>" +
      "</div>" +
      "<h3>نتيجتك بالمهارة</h3>" +
      '<div class="bars">' + bars + "</div>" +
      advice +
      review;

    restartBtn.hidden = false;
    resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  startBtn.addEventListener("click", begin);
  restartBtn.addEventListener("click", begin);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
