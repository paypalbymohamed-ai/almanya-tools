// German verb conjugation engine.
// Präsens: irregular du/er forms come from the dataset; ich/wir/ihr/sie follow the
// regular strong-verb pattern (no vowel change) with orthographic -et after t/d stems.
// Präteritum: German strong preterites take fixed endings on the ich/er stem;
// weak-type stems (already ending in -e: dachte, wusste, konnte, wurde) take weak endings.

import { VERBS, SEPARABLE, PRAESENS_OVERRIDE, PRONOUNS } from "./data/verbs.js";

const stemOf = (inf) => (inf.endsWith("en") ? inf.slice(0, -2) : inf.slice(0, -1));

function praesens(inf, du, er) {
  const o = PRAESENS_OVERRIDE[inf];
  if (o) return o.slice();
  const s = stemOf(inf);
  const ihr = /[td]$/.test(s) ? s + "et" : s + "t";
  return [s + "e", du, er, inf, ihr, inf];
}

function praeteritum(p) {
  if (p.endsWith("e")) return [p, p + "st", p, p + "n", p + "t", p + "n"]; // dachte, wusste, wurde …
  const du = /[tdsßz]$/.test(p) ? p + "est" : p + "st"; // du fandest, du aßest, du kamst
  const ihr = /[td]$/.test(p) ? p + "et" : p + "t"; // ihr fandet, ihr aßt, ihr kamt
  return [p, du, p, p + "en", ihr, p + "en"];
}

const HABEN = ["habe", "hast", "hat", "haben", "habt", "haben"];
const SEIN = ["bin", "bist", "ist", "sind", "seid", "sind"];
const HATTE = ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"];
const WAR = ["war", "warst", "war", "waren", "wart", "waren"];
const WERDEN = ["werde", "wirst", "wird", "werden", "werdet", "werden"];

/** Build the full record for one verb (simple or separable). */
function build(row) {
  if (row.sep) {
    const base = VERBS.find((v) => v[0] === row.base);
    const bp = praesens(base[0], base[2], base[3]);
    const bt = praeteritum(base[4]);
    const tail = " " + row.sep;
    return finish({
      inf: row.inf,
      ar: row.ar,
      aux: row.aux,
      pp: row.pp,
      praet1: base[4] + tail,
      separable: true,
      praesens: bp.map((f) => f + tail),
      praeteritum: bt.map((f) => f + tail),
      ex: row.ex,
      exAr: row.exAr
    });
  }
  return finish({
    inf: row.inf,
    ar: row.ar,
    aux: row.aux,
    pp: row.pp,
    praet1: row.praet,
    separable: false,
    praesens: praesens(row.inf, row.du, row.er),
    praeteritum: praeteritum(row.praet),
    ex: row.ex,
    exAr: row.exAr
  });
}

function finish(v) {
  const aux = v.aux === "s" ? SEIN : HABEN;
  const auxPast = v.aux === "s" ? WAR : HATTE;
  v.auxInf = v.aux === "s" ? "sein" : "haben";
  v.perfekt = aux.map((a) => `${a} ${v.pp}`);
  v.plusquam = auxPast.map((a) => `${a} ${v.pp}`);
  v.futur = WERDEN.map((w) => `${w} ${v.inf}`);
  return v;
}

export const ALL_VERBS = [
  ...VERBS.map((r) => build({ inf: r[0], ar: r[1], du: r[2], er: r[3], praet: r[4], pp: r[5], aux: r[6], ex: r[7], exAr: r[8] })),
  ...SEPARABLE.map((r) => build({ inf: r[0], ar: r[1], sep: r[2], base: r[3], pp: r[4], aux: r[5], ex: r[6], exAr: r[7] }))
].sort((a, b) => a.inf.localeCompare(b.inf, "de"));

export const TENSES = [
  { key: "praesens", de: "Präsens", ar: "المضارع" },
  { key: "praeteritum", de: "Präteritum", ar: "الماضي البسيط (كتابي)" },
  { key: "perfekt", de: "Perfekt", ar: "الماضي المركّب (كلام يومي)" },
  { key: "plusquam", de: "Plusquamperfekt", ar: "الماضي الأبعد" },
  { key: "futur", de: "Futur I", ar: "المستقبل" }
];

export { PRONOUNS };

const fold = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss");

/** Search by infinitive, any conjugated form, or Arabic meaning. */
export function searchVerbs(q) {
  const n = fold(q.trim());
  if (!n) return [];
  const hits = [];
  for (const v of ALL_VERBS) {
    let score = 0;
    const inf = fold(v.inf);
    if (inf === n) score = 100;
    else if (inf.startsWith(n)) score = 80;
    else if (inf.includes(n)) score = 60;
    else if (v.ar.includes(q.trim())) score = 55;
    else {
      const forms = [...v.praesens, ...v.praeteritum, v.pp, v.praet1];
      if (forms.some((f) => fold(f) === n)) score = 70;
      else if (forms.some((f) => fold(f).startsWith(n))) score = 40;
    }
    if (score) hits.push([score, v]);
  }
  return hits.sort((a, b) => b[0] - a[0] || a[1].inf.localeCompare(b[1].inf, "de")).map((h) => h[1]);
}
