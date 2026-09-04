// Interactive trainer for the four German cases (Nominativ / Akkusativ / Dativ / Genitiv).
// Each question carries the case it tests plus a written reason, because the learning value is
// in *why* an ending is right — a bare right/wrong verdict teaches nothing.
import "./styles.css";

const QUESTIONS = [
  {
    parts: ["Ich sehe ", " Mann."],
    opts: ["der", "den", "dem", "des"],
    a: 1,
    kasus: "Akkusativ",
    why: "الفعل <span class=\"de\">sehen</span> بياخد مفعول مباشر (Akkusativ). والمذكر في الـAkkusativ بيتغيّر من <span class=\"de\">der</span> لـ<span class=\"de\">den</span> — ده التغيير الوحيد في جدول أدوات التعريف."
  },
  {
    parts: ["", " Frau liest ein Buch."],
    opts: ["Die", "Der", "Den", "Dem"],
    a: 0,
    kasus: "Nominativ",
    why: "اللي بيعمل الفعل هو الفاعل، والفاعل دايماً Nominativ. المؤنث في الـNominativ = <span class=\"de\">die</span>."
  },
  {
    parts: ["Ich helfe ", " Kind."],
    opts: ["das", "dem", "des", "den"],
    a: 1,
    kasus: "Dativ",
    why: "<span class=\"de\">helfen</span> من الأفعال اللي بتاخد Dativ إجبارياً — مش Akkusativ زي ما الترجمة العربية توحي. المحايد في الـDativ = <span class=\"de\">dem</span>."
  },
  {
    parts: ["Das Auto ", " Vaters ist neu."],
    opts: ["der", "den", "dem", "des"],
    a: 3,
    kasus: "Genitiv",
    why: "الملكية = Genitiv. المذكر بياخد <span class=\"de\">des</span>، والاسم نفسه بياخد نهاية <span class=\"de\">-s</span> (<span class=\"de\">Vater → Vaters</span>)."
  },
  {
    parts: ["Wir fahren mit ", " Bus."],
    opts: ["der", "den", "dem", "des"],
    a: 2,
    kasus: "Dativ",
    why: "<span class=\"de\">mit</span> من حروف الجر اللي بتاخد Dativ دايماً وبدون استثناء."
  },
  {
    parts: ["Ich gehe in ", " Schule."],
    opts: ["die", "der", "dem", "den"],
    a: 0,
    kasus: "Akkusativ",
    why: "<span class=\"de\">in</span> حرف جر متغيّر (Wechselpräposition). هنا فيه حركة واتجاه (<span class=\"de\">wohin?</span>) فبياخد Akkusativ."
  },
  {
    parts: ["Ich bin in ", " Schule."],
    opts: ["die", "der", "dem", "den"],
    a: 1,
    kasus: "Dativ",
    why: "نفس حرف الجر <span class=\"de\">in</span>، بس هنا مكان ثابت بدون حركة (<span class=\"de\">wo?</span>) فبياخد Dativ. المؤنث في الـDativ = <span class=\"de\">der</span>."
  },
  {
    parts: ["Der Film gefällt ", " Kindern."],
    opts: ["die", "der", "dem", "den"],
    a: 3,
    kasus: "Dativ",
    why: "<span class=\"de\">gefallen</span> بياخد Dativ. والجمع في الـDativ بياخد <span class=\"de\">den</span> والاسم نفسه بياخد <span class=\"de\">-n</span> (<span class=\"de\">Kinder → Kindern</span>)."
  },
  {
    parts: ["Ohne ", " Vater fahre ich nicht."],
    opts: ["der", "den", "dem", "des"],
    a: 1,
    kasus: "Akkusativ",
    why: "<span class=\"de\">ohne</span> من حروف الجر اللي بتاخد Akkusativ دايماً."
  },
  {
    parts: ["Wegen ", " Wetters bleiben wir zu Hause."],
    opts: ["das", "dem", "des", "den"],
    a: 2,
    kasus: "Genitiv",
    why: "<span class=\"de\">wegen</span> من حروف الجر اللي بتاخد Genitiv. المحايد في الـGenitiv = <span class=\"de\">des</span> + نهاية <span class=\"de\">-s</span> على الاسم."
  },
  {
    parts: ["Kannst du ", " helfen?"],
    opts: ["mich", "mir", "ich", "mein"],
    a: 1,
    kasus: "Dativ",
    why: "<span class=\"de\">helfen</span> بياخد Dativ، فضمير المتكلم يبقى <span class=\"de\">mir</span> مش <span class=\"de\">mich</span>. ده من أشهر الأغلاط."
  },
  {
    parts: ["Ich danke ", " für alles."],
    opts: ["dich", "dir", "du", "dein"],
    a: 1,
    kasus: "Dativ",
    why: "<span class=\"de\">danken</span> كمان بياخد Dativ: <span class=\"de\">dir</span>."
  },
  {
    parts: ["Er liebt ", " sehr."],
    opts: ["sie", "ihr", "ihnen", "ihres"],
    a: 0,
    kasus: "Akkusativ",
    why: "<span class=\"de\">lieben</span> فعل عادي بمفعول مباشر (Akkusativ)، وضمير المؤنث في الـAkkusativ = <span class=\"de\">sie</span> (نفس شكل الـNominativ)."
  },
  {
    parts: ["Das Buch gehört ", "."],
    opts: ["ihn", "ihm", "er", "seines"],
    a: 1,
    kasus: "Dativ",
    why: "<span class=\"de\">gehören</span> بياخد Dativ، فضمير المذكر يبقى <span class=\"de\">ihm</span>."
  },
  {
    parts: ["Sie wartet auf ", " Bus."],
    opts: ["der", "den", "dem", "des"],
    a: 1,
    kasus: "Akkusativ",
    why: "التعبير <span class=\"de\">warten auf</span> بياخد Akkusativ ثابت — هنا <span class=\"de\">auf</span> جزء من الفعل، مش وصف مكان."
  },
  {
    parts: ["Nach ", " Arbeit gehe ich einkaufen."],
    opts: ["die", "der", "dem", "den"],
    a: 1,
    kasus: "Dativ",
    why: "<span class=\"de\">nach</span> بياخد Dativ. المؤنث في الـDativ = <span class=\"de\">der</span>."
  },
  {
    parts: ["Ich lege das Buch auf ", " Tisch."],
    opts: ["der", "den", "dem", "des"],
    a: 1,
    kasus: "Akkusativ",
    why: "<span class=\"de\">legen</span> فعل حركة — الكتاب بيتنقل لمكان جديد (<span class=\"de\">wohin?</span>) فـ<span class=\"de\">auf</span> بياخد Akkusativ."
  },
  {
    parts: ["Das Buch liegt auf ", " Tisch."],
    opts: ["der", "den", "dem", "des"],
    a: 2,
    kasus: "Dativ",
    why: "<span class=\"de\">liegen</span> فعل حالة ثابتة (<span class=\"de\">wo?</span>) فـ<span class=\"de\">auf</span> بياخد Dativ. قارن بالسؤال اللي فوقه — نفس حرف الجر وحالة مختلفة."
  },
  {
    parts: ["Trotz ", " Regens spielen sie Fußball."],
    opts: ["der", "den", "dem", "des"],
    a: 3,
    kasus: "Genitiv",
    why: "<span class=\"de\">trotz</span> بياخد Genitiv: <span class=\"de\">des Regens</span>."
  },
  {
    parts: ["Ich gebe ", " Freund ein Geschenk."],
    opts: ["der", "den", "dem", "des"],
    a: 2,
    kasus: "Dativ",
    why: "الفعل <span class=\"de\">geben</span> له مفعولين: الحاجة اللي بتتّدي (Akkusativ = <span class=\"de\">ein Geschenk</span>) والشخص اللي بياخدها (Dativ = <span class=\"de\">dem Freund</span>)."
  },
  {
    parts: ["Ich habe ", " Hund."],
    opts: ["ein", "einen", "einem", "eines"],
    a: 1,
    kasus: "Akkusativ",
    why: "<span class=\"de\">haben</span> بياخد Akkusativ. أداة النكرة للمذكر في الـAkkusativ = <span class=\"de\">einen</span>."
  },
  {
    parts: ["", " gehört das Auto?"],
    opts: ["Wer", "Wen", "Wem", "Wessen"],
    a: 2,
    kasus: "Dativ",
    why: "<span class=\"de\">gehören</span> بياخد Dativ، وأداة السؤال للـDativ هي <span class=\"de\">wem</span>."
  },
  {
    parts: ["", " hast du gestern gesehen?"],
    opts: ["Wer", "Wen", "Wem", "Wessen"],
    a: 1,
    kasus: "Akkusativ",
    why: "<span class=\"de\">sehen</span> بياخد Akkusativ، وأداة السؤال للـAkkusativ هي <span class=\"de\">wen</span>."
  },
  {
    parts: ["", " Tasche ist das?"],
    opts: ["Wer", "Wen", "Wem", "Wessen"],
    a: 3,
    kasus: "Genitiv",
    why: "السؤال عن الملكية بيستخدم <span class=\"de\">wessen</span> (بتاع مين) — وده أداة سؤال الـGenitiv."
  }
];

const KASUS_CLASS = {
  Nominativ: "g-der",
  Akkusativ: "g-die",
  Dativ: "g-das",
  Genitiv: "gender"
};

function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const root = document.querySelector("#kasus-quiz");
if (root) {
  const wordEl = root.querySelector("#kq-word");
  const optsEl = root.querySelector("#kq-opts");
  const fbEl = root.querySelector("#kq-fb");
  const progEl = root.querySelector("#kq-progress");
  const scoreEl = root.querySelector("#kq-score");
  const nextBtn = root.querySelector("#kq-next");
  const restartBtn = root.querySelector("#kq-restart");

  const TOTAL = 10;
  let deck = [];
  let index = 0;
  let score = 0;
  let answered = false;

  function start() {
    deck = shuffle(QUESTIONS).slice(0, TOTAL);
    index = 0;
    score = 0;
    restartBtn.hidden = true;
    render();
  }

  function render() {
    answered = false;
    const q = deck[index];
    wordEl.innerHTML =
      '<span class="de">' +
      q.parts[0] +
      '</span><b class="part">؟؟؟</b><span class="de">' +
      q.parts[1] +
      "</span>";
    progEl.textContent = "سؤال " + (index + 1) + " من " + deck.length;
    scoreEl.textContent = "صح: " + score;
    fbEl.hidden = true;
    fbEl.className = "quiz-fb";
    nextBtn.hidden = true;
    optsEl.innerHTML = "";
    q.opts.forEach((opt, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "qbtn de";
      b.textContent = opt;
      b.addEventListener("click", () => choose(i, b));
      optsEl.appendChild(b);
    });
  }

  function choose(i, btn) {
    if (answered) return;
    answered = true;
    const q = deck[index];
    const correct = i === q.a;
    if (correct) score++;
    [...optsEl.children].forEach((child, ci) => {
      child.disabled = true;
      if (ci === q.a) child.classList.add("ok");
      else if (ci === i) child.classList.add("wrong");
    });
    const solved =
      '<span class="de">' + q.parts[0] + "<b>" + q.opts[q.a] + "</b>" + q.parts[1] + "</span>";
    fbEl.hidden = false;
    fbEl.classList.add(correct ? "ok" : "no");
    fbEl.innerHTML =
      "<p><b>" +
      (correct ? "صح" : "غلط") +
      '</b> — الحالة: <span class="badge ' +
      (KASUS_CLASS[q.kasus] || "gender") +
      '">' +
      q.kasus +
      "</span></p><p>" +
      solved +
      "</p><p>" +
      q.why +
      "</p>";
    scoreEl.textContent = "صح: " + score;
    nextBtn.hidden = false;
    nextBtn.textContent = index + 1 >= deck.length ? "شوف النتيجة" : "السؤال اللي بعده";
  }

  nextBtn.addEventListener("click", () => {
    if (index + 1 >= deck.length) {
      finish();
      return;
    }
    index++;
    render();
  });

  function finish() {
    const pct = Math.round((score / deck.length) * 100);
    let verdict;
    if (pct >= 90) verdict = "ممتاز — الحالات الأربعة ماسكها كويس.";
    else if (pct >= 70) verdict = "كويس. راجع الجداول فوق للحالات اللي غلطت فيها.";
    else if (pct >= 40) verdict = "محتاج مراجعة — ابدأ بجدول أدوات التعريف وحروف الجر.";
    else verdict = "ابدأ من الأول: اقرا شرح الحالات الأربعة فوق قبل الكويز.";
    wordEl.innerHTML = "<b>" + score + " / " + deck.length + "</b>";
    optsEl.innerHTML = "";
    progEl.textContent = "خلصت الكويز";
    fbEl.hidden = false;
    fbEl.className = "quiz-fb ok";
    fbEl.innerHTML = "<p><b>" + pct + "%</b></p><p>" + verdict + "</p>";
    nextBtn.hidden = true;
    restartBtn.hidden = false;
  }

  restartBtn.addEventListener("click", start);
  start();
}
