import "./styles.css";
import { ALL_VERBS, TENSES, PRONOUNS, searchVerbs } from "./conjugate.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const input = $("#q");
const out = $("#result");
const listBody = $("#verb-list");

function partsStrip(v) {
  return `<div class="parts">
    <span class="part"><b>Infinitiv</b><span class="de">${esc(v.inf)}</span></span>
    <span class="part"><b>Präsens (er/sie/es)</b><span class="de">${esc(v.praesens[2])}</span></span>
    <span class="part"><b>Präteritum</b><span class="de">${esc(v.praet1)}</span></span>
    <span class="part"><b>Perfekt</b><span class="de">${esc(v.auxInf === "sein" ? "ist" : "hat")} ${esc(v.pp)}</span></span>
  </div>`;
}

function render(v) {
  const rows = PRONOUNS.map((p, i) => {
    const cells = TENSES.map((t) => `<td class="de">${esc(v[t.key][i])}</td>`).join("");
    return `<tr><th scope="row" class="de">${esc(p)}</th>${cells}</tr>`;
  }).join("");

  const example = v.ex
    ? `<p class="hint" style="font-size:1rem"><span class="de">${esc(v.ex)}</span> — ${esc(v.exAr)}</p>`
    : "";

  out.innerHTML = `<div class="card">
    <h2 style="margin:0 0 .1rem"><span class="de">${esc(v.inf)}</span></h2>
    <p style="margin:0 0 .4rem;color:var(--muted)">${esc(v.ar)} · فعل شاذ${v.separable ? " ومنفصل" : ""} · الفعل المساعد في الـPerfekt: <span class="de">${esc(v.auxInf)}</span></p>
    ${partsStrip(v)}
    ${example}
    <div class="tbl-scroll">
      <table>
        <caption>كل الأزمنة الأساسية للفعل <span class="de">${esc(v.inf)}</span></caption>
        <thead><tr><th>الضمير</th>${TENSES.map((t) => `<th><span class="de">${esc(t.de)}</span><br><span style="font-weight:400">${esc(t.ar)}</span></th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${v.separable ? `<p class="hint">فعل منفصل: في الجملة العادية اللاحقة <span class="de">${esc(v.inf.replace(/(an|auf|aus|ein|mit|um|fern)/, ""))}</span> تتصرّف والبادئة <b class="de">${esc(v.inf.match(/^(an|auf|aus|ein|mit|um|fern)/)[0])}</b> تروح آخر الجملة.</p>` : ""}
  </div>`;
}

function renderMany(list, q) {
  if (!list.length) {
    out.innerHTML = `<div class="card"><p style="margin:0">مفيش نتيجة لـ «${esc(q)}». جرّب المصدر (Infinitiv) زي <span class="de">gehen</span> أو أي تصريف زي <span class="de">ging</span>، أو اكتب المعنى بالعربي زي «ياكل».</p></div>`;
    return;
  }
  render(list[0]);
  if (list.length > 1) {
    const others = list.slice(1, 9).map((v) => `<button class="chip" data-verb="${esc(v.inf)}"><span class="de">${esc(v.inf)}</span> — ${esc(v.ar)}</button>`).join("");
    out.insertAdjacentHTML("beforeend", `<p class="hint" style="margin-top:.8rem">نتائج قريبة كمان:</p><div class="chips">${others}</div>`);
  }
}

function go(q, push = true) {
  const list = searchVerbs(q);
  renderMany(list, q);
  if (push) {
    const url = new URL(location.href);
    if (q) url.searchParams.set("v", q); else url.searchParams.delete("v");
    history.replaceState(null, "", url);
    // Only follow the result on a real search — never on first paint, or the
    // visitor lands below the headline and the search field.
    out.scrollIntoView({ block: "nearest" });
  }
}

$("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  go(input.value);
});

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-verb]");
  if (!b) return;
  input.value = b.dataset.verb;
  go(b.dataset.verb);
});

// Browsable table of every verb in the dataset.
listBody.innerHTML = ALL_VERBS.map(
  (v) => `<tr>
    <th scope="row"><button class="chip" data-verb="${esc(v.inf)}" style="border:0;background:none;padding:0;color:var(--action);font-weight:700"><span class="de">${esc(v.inf)}</span></button></th>
    <td>${esc(v.ar)}</td>
    <td class="de">${esc(v.praesens[2])}</td>
    <td class="de">${esc(v.praet1)}</td>
    <td class="de">${esc(v.auxInf === "sein" ? "ist" : "hat")} ${esc(v.pp)}</td>
  </tr>`
).join("");
$("#verb-count").textContent = ALL_VERBS.length;

const initial = new URLSearchParams(location.search).get("v");
if (initial) { input.value = initial; go(initial, false); } else { go("gehen", false); }
