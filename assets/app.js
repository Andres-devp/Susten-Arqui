(function () {
"use strict";
const D = window.PGDR || { ids: {}, apis: [], fichas: {} };
const C = window.CONTENT || {};
const IDS = D.ids, FICHAS = D.fichas;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nl = s => esc(s).replace(/\n/g, "<br>");
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const isDark = () => { const t = document.documentElement.getAttribute("data-theme"); if (t) return t === "dark"; return matchMedia("(prefers-color-scheme: dark)").matches; };
const h = (tag, attrs, html) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; };

/* ---------- IDs: conocimiento y referencias cruzadas ---------- */
const ID_RX = /\b(?:(?:RF|AC)-[A-Z]{3}-\d{3}|DA-(?:ARQ|INT|API)-\d{2}|ASE-[LD]-\d{2}|EVT-P?\d{1,2}|(?:IE|RN|RST|SUP|EXC|ACT|AMB|PRI|PIN|TAC|CSI|ERR|PSE|AME|MF|PES|OBS|EA|ESC|RSG|NRS|PS|PC|TR|PRG|API)-\d{2,3}|SUP-[A-E]|EO-[A-E]|ND-[0-3]|R-\d{2})\b/g;
const known = id => !!(IDS[id] || FICHAS[id] || (C.extraIds && C.extraIds[id]));
const occText = id => { let t = ""; (IDS[id] || []).forEach(o => t += " " + o.c.join(" ")); const f = FICHAS[id]; if (f) f.fields.forEach(x => t += " " + x.join(" ")); return t; };
const REFS = {};
(function buildRefs() {
  const all = Object.keys(IDS).concat(Object.keys(FICHAS));
  all.forEach(src => {
    const found = occText(src).match(ID_RX) || [];
    new Set(found).forEach(t => { if (t !== src) (REFS[t] = REFS[t] || new Set()).add(src); });
  });
})();
function shortDesc(id) {
  if (FICHAS[id]) return FICHAS[id].title;
  const o = (IDS[id] || [])[0];
  if (o) return o.c[1] || "";
  return (C.extraIds && C.extraIds[id]) || "";
}
function idBtn(id, label) { return `<button class="idref" data-id="${esc(id)}">${esc(label || id)}</button>`; }

/* ---------- Popover de definición ---------- */
const pop = $("#pop");
function renderIdInfo(id) {
  let html = "";
  const f = FICHAS[id];
  if (f) {
    html += `<div class="src">${f.doc} · ficha</div><p><b>${esc(f.title)}</b></p><dl class="kv">`;
    f.fields.forEach(([k, v]) => html += `<dt>${esc(k)}</dt><dd>${nl(v)}</dd>`);
    html += `</dl>`;
  }
  (IDS[id] || []).forEach((o, i) => {
    html += `<div class="${f || i ? "occ" : ""}"><div class="src">${o.d} · ${esc(o.s)}</div><dl class="kv">`;
    o.c.forEach((cell, j) => { if (j === 0 || !cell) return; html += `<dt>${esc(o.h[j] || "")}</dt><dd>${nl(cell)}</dd>`; });
    html += `</dl></div>`;
  });
  if (C.extraIds && C.extraIds[id]) html += `<p>${esc(C.extraIds[id])}</p>`;
  const refs = REFS[id] ? Array.from(REFS[id]) : [];
  if (refs.length) html += `<div class="refs"><b>Lo mencionan (${refs.length}):</b> ${refs.slice(0, 40).map(r => idBtn(r)).join(" ")}</div>`;
  if (!html) html = `<p class="muted">No encontré ese identificador en los documentos.</p>`;
  return html;
}
function showPop(id, anchor) {
  pop.innerHTML = `<button class="close" aria-label="Cerrar">×</button><h4>${esc(id)}</h4>${renderIdInfo(id)}`;
  linkify(pop);
  pop.hidden = false;
  const r = anchor ? anchor.getBoundingClientRect() : { left: innerWidth / 2 - 260, bottom: 80, top: 80 };
  const pw = pop.offsetWidth, ph = pop.offsetHeight;
  let left = Math.min(Math.max(12, r.left), innerWidth - pw - 12);
  let top = r.bottom + 8;
  if (top + ph > innerHeight - 12) top = Math.max(12, r.top - ph - 8);
  pop.style.left = left + "px"; pop.style.top = top + "px";
  pop.scrollTop = 0;
}
function hidePop() { pop.hidden = true; }
document.addEventListener("click", e => {
  const b = e.target.closest(".idref");
  if (b) { e.preventDefault(); showPop(b.dataset.id, b); return; }
  if (e.target.closest(".pop .close")) { hidePop(); return; }
  if (!pop.hidden && !e.target.closest(".pop")) hidePop();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") { hidePop(); $("#lightbox").hidden = true; $("#results").hidden = true; } });

/* ---------- Enlazado automático de IDs ---------- */
function linkify(root) {
  const skip = el => el.closest("script,style,button,a,input,textarea,select,code,.mmd-box,svg,th,.seq-svg,.seq-head,.nav,.flash,.quiz-opt,summary");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => (!n.nodeValue.trim() || !n.parentElement || skip(n.parentElement)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(node => {
    const txt = node.nodeValue; ID_RX.lastIndex = 0;
    if (!ID_RX.test(txt)) return;
    ID_RX.lastIndex = 0;
    const frag = document.createDocumentFragment(); let last = 0, m, any = false;
    while ((m = ID_RX.exec(txt))) {
      if (!known(m[0])) continue;
      any = true;
      frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
      const b = h("button", { class: "idref", "data-id": m[0] }, esc(m[0]));
      frag.appendChild(b); last = m.index + m[0].length;
    }
    if (!any) return;
    frag.appendChild(document.createTextNode(txt.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
}

/* ---------- Tablas desde los documentos ---------- */
function renderTable(el) {
  const rx = new RegExp(el.dataset.table);
  const cols = (el.dataset.cols || "0,1,2").split(",").map(Number);
  const sevCol = el.dataset.sev != null ? Number(el.dataset.sev) : -1;
  const ids = Object.keys(IDS).filter(k => rx.test(k));
  const groups = [];
  ids.forEach(id => {
    const o = IDS[id][0];
    const sig = cols.map(c => o.h[c] || "").join("|");
    let g = groups.find(x => x.sig === sig);
    if (!g) groups.push(g = { sig, h: o.h, rows: [] });
    g.rows.push({ id, o });
  });
  let tools = `<div class="tbl-tools"><input type="search" placeholder="Filtrar…" aria-label="Filtrar tabla" id="f-${Math.random().toString(36).slice(2, 8)}">`;
  let mods = [];
  if (el.dataset.modfilter) { mods = Array.from(new Set(ids.map(i => i.split("-")[1]))); }
  tools += `<span class="count"></span></div>`;
  if (mods.length) tools += `<div class="pill-group" role="group"><button class="on" data-m="">Todos</button>${mods.map(m => `<button data-m="${m}">${m}</button>`).join("")}</div>`;
  let tables = "";
  groups.forEach(g => {
    tables += `<div class="tbl-wrap"><table><thead><tr>${cols.map(c => `<th>${esc(g.h[c] || "")}</th>`).join("")}</tr></thead><tbody>`;
    g.rows.forEach(({ id, o }) => {
      tables += `<tr data-id="${id}" data-t="${esc(norm(o.c.join(" ")))}">${cols.map(c => {
        if (c === 0) return `<td>${idBtn(id)}</td>`;
        if (c === sevCol) return `<td><span class="chip sev-${esc(o.c[c])}">${esc(o.c[c])}</span></td>`;
        return `<td>${nl(o.c[c] || "")}</td>`;
      }).join("")}</tr>`;
    });
    tables += `</tbody></table></div>`;
  });
  el.innerHTML = tools + tables;
  const inp = $("input", el), cnt = $(".count", el);
  let mod = "";
  const apply = () => {
    const q = norm(inp.value.trim()); let shown = 0;
    $$("tbody tr", el).forEach(tr => {
      const ok = (!q || tr.dataset.t.includes(q) || tr.dataset.id.toLowerCase().includes(q)) && (!mod || tr.dataset.id.split("-")[1] === mod);
      tr.hidden = !ok; if (ok) shown++;
    });
    cnt.textContent = `${shown} de ${ids.length}`;
  };
  inp.addEventListener("input", apply);
  $$(".pill-group button", el).forEach(b => b.addEventListener("click", () => { $$(".pill-group button", el).forEach(x => x.classList.remove("on")); b.classList.add("on"); mod = b.dataset.m; apply(); }));
  apply();
}

/* ---------- Fichas (DA-ARQ y ESC) ---------- */
function renderFichas(el) {
  const pre = el.dataset.fichas;
  const keys = Object.keys(FICHAS).filter(k => k.startsWith(pre + "-")).sort();
  el.innerHTML = keys.map(k => {
    const f = FICHAS[k];
    let chip = "";
    if (pre === "ESC") { const o = (IDS[k] || []).find(x => x.h.some(hh => hh.includes("(I, D)"))); if (o) chip = `<span class="chip ${o.c[4] === "(A, A)" ? "c1" : "c2"}">${esc(o.c[4])}</span>`; }
    return `<details class="acc"><summary><span class="mono" style="color:var(--accent)">${k}</span> ${esc(f.title)} ${chip}</summary><div class="body"><dl class="kv">${f.fields.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${nl(b)}</dd>`).join("")}</dl></div></details>`;
  }).join("");
}

/* ---------- Explorador de APIs ---------- */
function renderApis(el) {
  const rows = D.apis.filter(a => a.api);
  const apis = Array.from(new Set(rows.map(r => r.api)));
  el.innerHTML = `<div class="pill-group"><button class="on" data-a="">Todas</button>${apis.map(a => `<button data-a="${a}" title="${esc(C.extraIds[a] || "")}">${a}</button>`).join("")}</div>
  <div class="tbl-tools"><select aria-label="Verbo"><option value="">Todos los verbos</option><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select><input type="search" placeholder="Filtrar por ruta, propósito o requisito…" aria-label="Filtrar operaciones"><span class="count"></span></div>
  <p class="muted api-desc" style="margin:.2rem 0"></p>
  <div class="tbl-wrap"><table><thead><tr><th>API</th><th>Operación</th><th>Propósito</th><th>Requisitos</th><th>Clase</th><th>Publica / patrón</th></tr></thead><tbody>
  ${rows.map(r => `<tr data-a="${r.api}" data-t="${esc(norm(r.c.join(" ")))}"><td>${idBtn(r.api)}</td><td><code>${esc(r.c[0])}</code></td><td>${nl(r.c[1])}</td><td>${nl(r.c[2])}</td><td>${classChips(r.c[3])}</td><td>${nl(r.c[4] || "")}</td></tr>`).join("")}
  </tbody></table></div>`;
  let api = "";
  const sel = $("select", el), inp = $("input", el), cnt = $(".count", el), desc = $(".api-desc", el);
  const apply = () => {
    const q = norm(inp.value.trim()), v = sel.value; let n = 0;
    $$("tbody tr", el).forEach(tr => { const ok = (!api || tr.dataset.a === api) && (!v || tr.dataset.t.startsWith(v.toLowerCase())) && (!q || tr.dataset.t.includes(q)); tr.hidden = !ok; if (ok) n++; });
    cnt.textContent = `${n} operaciones`;
    desc.textContent = api ? `${api}: ${C.extraIds[api] || ""}` : "13 APIs repartidas en 5 superficies.";
  };
  sel.addEventListener("change", apply); inp.addEventListener("input", apply);
  $$(".pill-group button", el).forEach(b => b.addEventListener("click", () => { $$(".pill-group button", el).forEach(x => x.classList.remove("on")); b.classList.add("on"); api = b.dataset.a; apply(); }));
  apply();
}
function classChips(t) {
  return esc(t || "").replace(/\bC([123])\b/g, (m, n) => `<span class="chip c${n}">C${n}</span>`);
}

/* ---------- Matriz de integración ---------- */
function renderIntMatrix(el) {
  const sys = ["IE-010", "IE-011", "IE-012", "IE-013", "IE-014", "IE-015", "IE-016", "IE-017", "IE-018", "ACT-13", "ACT-02"];
  const find = (id, key) => (IDS[id] || []).find(o => o.h.some(x => x.includes(key)));
  el.innerHTML = `<div class="pill-group">${sys.map((s, i) => `<button data-s="${s}" class="${i ? "" : "on"}">${s}</button>`).join("")}</div><div class="card mx"></div>`;
  const show = s => {
    const m = find(s, "Patrón"), f = find(s, "Frescura"), info = find(s, "Información intercambiada");
    const cls = m ? m.c[4] : "";
    $(".mx", el).innerHTML = `<h3 style="margin-top:0">${esc(s)} · ${esc(m ? m.c[1] : shortDesc(s))} ${cls ? `<span class="chip ${cls.toLowerCase()}">${esc(cls)}</span>` : ""}</h3>
    <dl class="kv">
      ${m ? `<dt>Dirección</dt><dd>${esc(m.c[2])}</dd><dt>Patrón</dt><dd>${esc(m.c[3])}</dd>` : ""}
      ${info ? `<dt>Información</dt><dd>${esc(info.c[3])}</dd><dt>Requisitos</dt><dd>${esc(info.c[4])}</dd>` : ""}
      ${f ? `<dt>Frescura máxima</dt><dd>${esc(f.c[1])}</dd><dt>Si no está disponible</dt><dd>${nl(f.c[2])}</dd>` : ""}
    </dl>`;
    linkify($(".mx", el));
  };
  $$("button[data-s]", el).forEach(b => b.addEventListener("click", () => { $$("button[data-s]", el).forEach(x => x.classList.remove("on")); b.classList.add("on"); show(b.dataset.s); }));
  show(sys[0]);
}

/* ---------- Mapa atributo → decisiones ---------- */
function renderAttrMap(el) {
  const keys = Object.keys(C.attrMap);
  el.innerHTML = `<div class="pill-group">${keys.map((k, i) => `<button data-k="${k}" class="${i ? "" : "on"}">${C.attrMap[k].name}</button>`).join("")}</div><div class="am"></div>`;
  const show = k => {
    const a = C.attrMap[k];
    $(".am", el).innerHTML = a.dec.length ? `<div class="tbl-wrap"><table><thead><tr><th>Decisión</th><th>Qué decide</th></tr></thead><tbody>${a.dec.map(d => `<tr><td>${idBtn(d)}</td><td>${esc(shortDesc(d))}</td></tr>`).join("")}</tbody></table></div>`
      : `<p class="muted">El SAD no asigna decisiones a ${esc(a.name)}. Tampoco tuvo escenario propio en el ATAM (cap. 11).</p>`;
  };
  $$("button", el).forEach(b => b.addEventListener("click", () => { $$("button", el).forEach(x => x.classList.remove("on")); b.classList.add("on"); show(b.dataset.k); }));
  show(keys[0]);
}

/* ---------- Árbol de utilidad ---------- */
function renderUtilTree(el) {
  const leaves = Object.keys(IDS).filter(k => /^ESC-/.test(k)).map(k => ({ id: k, o: IDS[k].find(o => o.h.some(x => x.includes("(I, D)"))) })).filter(x => x.o);
  const groups = {};
  leaves.forEach(l => (groups[l.o.s] = groups[l.o.s] || []).push(l));
  el.innerHTML = `<div class="tree">${Object.keys(groups).map(g => `<div class="attr"><button aria-expanded="true">▾ ${esc(g.replace(/^[\d.]+\s*/, ""))}</button><div class="leaves">${groups[g].map(l => {
    const p = l.o.c[4]; const cls = p === "(A, A)" ? "aa" : p === "(A, M)" ? "am" : "mm";
    return `<div class="leaf ${cls}" data-id="${l.id}" tabindex="0"><span class="mono" style="color:var(--accent);font-weight:600">${l.id}</span><span class="chip ${cls === "aa" ? "c1" : cls === "am" ? "c2" : "c3"}">${esc(p)}</span><span><b>${esc(l.o.c[1])}.</b> ${esc(l.o.c[2])}${FICHAS[l.id] ? ' <span class="chip info">ficha</span>' : ""}</span></div>`;
  }).join("")}</div></div>`).join("")}</div>
  <p class="muted" style="font-size:.84rem"><span class="chip c1">(A, A)</span> ficha completa · <span class="chip c2">(A, M)</span> ficha o consolidado · <span class="chip c3">(M, x)</span> consolidado</p>`;
  $$(".leaf", el).forEach(l => { const go = () => showPop(l.dataset.id, l); l.addEventListener("click", go); l.addEventListener("keydown", e => { if (e.key === "Enter") go(); }); });
  $$(".attr>button", el).forEach(b => b.addEventListener("click", () => { const lv = b.nextElementSibling; lv.hidden = !lv.hidden; b.setAttribute("aria-expanded", String(!lv.hidden)); b.textContent = (lv.hidden ? "▸ " : "▾ ") + b.textContent.slice(2); }));
}

/* ---------- Explorador de trazabilidad ---------- */
function renderTrace(el) {
  const keys = Object.keys(C.attrMap);
  el.innerHTML = `<div class="pill-group">${keys.map((k, i) => `<button data-k="${k}" class="${i ? "" : "on"}">${C.attrMap[k].name}</button>`).join("")}</div><div class="tr-out"></div>`;
  const all = Object.keys(IDS).concat(Object.keys(FICHAS).filter(k => !IDS[k]));
  const mentions = (pfxRx, needle) => all.filter(id => pfxRx.test(id) && occText(id).includes(needle));
  const show = k => {
    const needle = "AC-" + k;
    const acs = Object.keys(IDS).filter(i => i.startsWith(needle + "-"));
    const decs = Array.from(new Set(C.attrMap[k].dec.concat(mentions(/^DA-/, needle))));
    const tacs = mentions(/^(TAC|PRI|PES|PSE|CSI|PIN)-/, needle);
    const escs = mentions(/^ESC-/, needle);
    const finds = mentions(/^(RSG|NRS|PS|PC)-/, needle);
    const eas = mentions(/^EA-/, needle);
    const col = (t, list) => `<div class="card"><h4 style="margin-top:0">${t} <span class="muted">(${list.length})</span></h4>${list.length ? list.map(i => `<div style="margin:4px 0;font-size:.86rem">${idBtn(i)} ${esc(shortDesc(i)).slice(0, 110)}</div>`).join("") : '<p class="muted">Ninguno</p>'}</div>`;
    $(".tr-out", el).innerHTML = `<div class="grid two">${col("Atributos de calidad (SRS)", acs)}${col("Decisiones (SAD 17)", decs)}${col("Principios, patrones, tácticas y controles", tacs)}${col("Enfoques ATAM", eas)}${col("Escenarios ATAM", escs)}${col("Hallazgos: riesgos, no riesgos, sensibilidad, compromiso", finds)}</div>`;
  };
  $$("button", el).forEach(b => b.addEventListener("click", () => { $$("button", el).forEach(x => x.classList.remove("on")); b.classList.add("on"); show(b.dataset.k); }));
  show(keys[0]);
}
function renderDecoder(el) {
  el.innerHTML = `<div class="tbl-tools"><input type="search" placeholder="Ej. RF-MOV-005" aria-label="Identificador" style="min-width:240px"></div><div class="pill-group sugg"></div><div class="card dec-out"><p class="muted">Escribe un identificador.</p></div>`;
  const inp = $("input", el), out = $(".dec-out", el), sugg = $(".sugg", el);
  const all = Object.keys(IDS).concat(Object.keys(FICHAS), Object.keys(C.extraIds || {}));
  const uniq = Array.from(new Set(all));
  const show = id => { out.innerHTML = `<h3 style="margin-top:0;font-family:var(--f-mono);color:var(--accent)">${esc(id)}</h3>` + renderIdInfo(id); linkify(out); };
  inp.addEventListener("input", () => {
    const q = inp.value.trim().toUpperCase();
    if (!q) { sugg.innerHTML = ""; return; }
    if (uniq.includes(q)) show(q);
    sugg.innerHTML = uniq.filter(i => i.startsWith(q)).slice(0, 24).map(i => `<button data-i="${i}">${i}</button>`).join("");
    $$("button", sugg).forEach(b => b.addEventListener("click", () => { inp.value = b.dataset.i; show(b.dataset.i); }));
  });
}

/* ---------- Visor con zoom: el diagrama cabe completo y se puede acercar ---------- */
function makeZoom(host, w, h, opt = {}) {
  host.classList.add("zv");
  host.innerHTML = `<div class="zv-stage"></div><div class="zv-tools" role="toolbar" aria-label="Zoom del diagrama"><button type="button" data-z="out" aria-label="Alejar">−</button><span class="zv-pct">100%</span><button type="button" data-z="in" aria-label="Acercar">+</button><button type="button" data-z="fit">Ajustar</button><button type="button" data-z="max" aria-label="Pantalla completa" title="Pantalla completa">⛶</button></div><div class="zv-hint">Ctrl + rueda, doble clic o + / − para zoom · arrastra para mover</div>`;
  const stage = $(".zv-stage", host), pct = $(".zv-pct", host);
  const st = { w, h, s: 1, x: 0, y: 0, fit: 1, atFit: true, maxed: false };
  const baseMaxH = () => opt.maxH ? opt.maxH() : Math.min(innerHeight * 0.68, 620);
  const size = () => { stage.style.width = st.w + "px"; stage.style.height = st.h + "px"; };
  function clamp() {
    const cw = host.clientWidth, ch = host.clientHeight, sw = st.w * st.s, sh = st.h * st.s;
    st.x = sw <= cw ? (cw - sw) / 2 : Math.min(0, Math.max(cw - sw, st.x));
    st.y = sh <= ch ? (ch - sh) / 2 : Math.min(0, Math.max(ch - sh, st.y));
  }
  function apply() {
    stage.style.transform = `translate(${st.x}px,${st.y}px) scale(${st.s})`;
    pct.textContent = Math.round(st.s * 100) + "%";
    const big = st.w * st.s > host.clientWidth + 1 || st.h * st.s > host.clientHeight + 1;
    host.classList.toggle("grab", big);
    host.style.touchAction = big ? "none" : "pan-y";
  }
  function layout() {
    const cw = host.clientWidth; if (!cw) return;
    const availH = st.maxed ? host.clientHeight - 8 : baseMaxH();
    st.fit = Math.min(cw / st.w, availH / st.h, opt.maxFit || 1);
    if (!st.maxed) host.style.height = Math.max(90, Math.ceil(st.h * st.fit)) + "px";
    if (st.atFit) st.s = st.fit;
    clamp(); apply();
  }
  function zoomAt(f, px, py) {
    const ns = Math.min(Math.max(st.s * f, st.fit * 0.6), Math.max(4, st.fit * 6));
    if (px == null) { px = host.clientWidth / 2; py = host.clientHeight / 2; }
    st.x = px - (px - st.x) * (ns / st.s); st.y = py - (py - st.y) * (ns / st.s);
    st.s = ns; st.atFit = Math.abs(ns - st.fit) < 1e-3; clamp(); apply();
  }
  const local = e => { const r = host.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  host.addEventListener("wheel", e => { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); const [px, py] = local(e); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, px, py); }, { passive: false });
  host.addEventListener("dblclick", e => { if (e.target.closest(".zv-tools")) return; const [px, py] = local(e); zoomAt(e.shiftKey ? 1 / 1.6 : 1.6, px, py); });
  const ptrs = new Map(); let drag = null, pinch = null, moved = false;
  host.addEventListener("pointerdown", e => {
    if (e.target.closest(".zv-tools") || e.button > 0) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = false;
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) }; drag = null; }
    else if (host.classList.contains("grab")) drag = { x: e.clientX, y: e.clientY, ox: st.x, oy: st.y, id: e.pointerId };
  });
  host.addEventListener("pointermove", e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); const r = host.getBoundingClientRect(); zoomAt(d / pinch.d, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); pinch.d = d; moved = true; return; }
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) < 4) return;
    if (!moved) { moved = true; host.setPointerCapture(e.pointerId); host.classList.add("grabbing"); }
    st.x = drag.ox + dx; st.y = drag.oy + dy; st.atFit = false; clamp(); apply();
  });
  const end = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (drag && drag.id === e.pointerId) { drag = null; host.classList.remove("grabbing"); } };
  host.addEventListener("pointerup", end); host.addEventListener("pointercancel", end);
  host.addEventListener("click", e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  const setMax = on => {
    st.maxed = on; host.classList.toggle("zv-max", on); document.body.classList.toggle("zv-open", on);
    $('[data-z="max"]', host).textContent = on ? "✕" : "⛶";
    $('[data-z="max"]', host).setAttribute("aria-label", on ? "Salir de pantalla completa" : "Pantalla completa");
    st.atFit = true; if (!on) host.style.height = ""; requestAnimationFrame(layout);
  };
  $(".zv-tools", host).addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const z = b.dataset.z;
    if (z === "in") zoomAt(1.25); if (z === "out") zoomAt(1 / 1.25);
    if (z === "fit") { st.atFit = true; layout(); }
    if (z === "max") setMax(!st.maxed);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && st.maxed) setMax(false); });
  if (window.ResizeObserver) new ResizeObserver(() => layout()).observe(host);
  addEventListener("resize", () => layout());
  size(); layout();
  return { stage, layout, setSize(nw, nh) { st.w = nw; st.h = nh; st.atFit = true; size(); layout(); } };
}
function zoomFigure(img) {
  if (img.dataset.zv) return; img.dataset.zv = "1";
  const host = h("div", { class: "fig-zv" });
  img.parentNode.insertBefore(host, img);
  const zv = makeZoom(host, 1000, 560);
  zv.stage.appendChild(img);
  const ready = () => { if (!img.naturalWidth) return; img.width = img.naturalWidth; img.height = img.naturalHeight; zv.setSize(img.naturalWidth, img.naturalHeight); };
  img.loading = "eager";
  if (img.complete) ready(); else img.addEventListener("load", ready, { once: true });
}

/* ---------- Mermaid ---------- */
let mermaidP = null, mmdN = 0;
function loadMermaid() {
  if (window.mermaid) return Promise.resolve(window.mermaid);
  if (!mermaidP) mermaidP = new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";
    s.onload = () => { window.mermaid.initialize({ startOnLoad: false, theme: isDark() ? "dark" : "neutral", securityLevel: "strict", flowchart: { useMaxWidth: false, htmlLabels: true }, class: { useMaxWidth: false }, fontFamily: "IBM Plex Sans, system-ui, sans-serif" }); res(window.mermaid); };
    s.onerror = rej;
    document.head.appendChild(s);
  });
  return mermaidP;
}
function renderMermaidIn(root) {
  $$("[data-mmd]", root).forEach(el => {
    if (el.dataset.done || el.closest("[hidden]")) return;
    el.dataset.done = "1";
    const code = C.mermaid[el.dataset.mmd];
    el.classList.add("mmd-box");
    el.innerHTML = `<div class="mmd-loading">Dibujando diagrama…</div>`;
    loadMermaid().then(m => m.render("mmd" + (++mmdN), code)).then(r => {
      el.innerHTML = r.svg;
      const svg = $("svg", el);
      const vb = svg.viewBox && svg.viewBox.baseVal;
      let w = vb && vb.width, hh = vb && vb.height;
      if (!w || !hh) { const bb = svg.getBBox(); w = bb.width; hh = bb.height; }
      svg.removeAttribute("style"); svg.setAttribute("width", w); svg.setAttribute("height", hh);
      svg.remove();
      const zv = makeZoom(el, w, hh);
      zv.stage.appendChild(svg);
    })
      .catch(() => { el.innerHTML = `<p class="muted">No se pudo cargar el renderizador de diagramas (requiere internet). Este es el código Mermaid del diagrama:</p><pre>${esc(code)}</pre>`; });
  });
}

/* ---------- Reproductor de secuencias ---------- */
let seqN = 0;
function renderSeq(el, seqKey) {
  const S = C.seqs[seqKey]; if (!S) return;
  const key = seqKey + (++seqN);
  const colW = 138, top = 64, rowH = 40, padX = 20;
  const W = padX * 2 + S.parts.length * colW, H = top + S.steps.length * rowH + 24;
  const cx = i => padX + i * colW + colW / 2;
  let cur = -1, timer = null;
  el.className = "seq";
  el.innerHTML = `<div class="seq-head"><b>${esc(S.title)}</b><div class="btns" style="margin:0">
    <button class="btn" data-a="prev" aria-label="Paso anterior">◀</button><button class="btn primary" data-a="next">Siguiente ▶</button>
    <button class="btn" data-a="play">Reproducir</button><button class="btn" data-a="reset">Reiniciar</button><span class="muted cnt" style="align-self:center;font-size:.82rem"></span></div></div>
    <div class="seq-svg"></div><div class="seq-note"></div>`;
  const zv = makeZoom($(".seq-svg", el), W, H, { maxH: () => Math.min(innerHeight * 0.62, 560) });
  const svgHost = zv.stage, note = $(".seq-note", el), cnt = $(".cnt", el);
  const wrap = (t, max) => { const w = t.split(" "); const lines = []; let l = ""; w.forEach(x => { if ((l + " " + x).trim().length > max) { lines.push(l.trim()); l = x; } else l += " " + x; }); lines.push(l.trim()); return lines.slice(0, 3); };
  function draw() {
    const ink = "var(--ink)", mut = "var(--ink-2)", acc = "var(--accent)", line = "var(--line)";
    let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(S.title)}">
      <defs>${["ink", "mut", "acc"].map(n => `<marker id="ah-${key}-${n}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${n === "ink" ? ink : n === "mut" ? mut : acc}"/></marker><marker id="ao-${key}-${n}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10" fill="none" stroke="${n === "ink" ? ink : n === "mut" ? mut : acc}" stroke-width="1.6"/></marker>`).join("")}</defs>`;
    S.parts.forEach((p, i) => {
      const x = cx(i);
      s += `<line x1="${x}" y1="${top - 8}" x2="${x}" y2="${H - 8}" stroke="${line}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
      s += `<rect x="${x - colW / 2 + 6}" y="8" width="${colW - 12}" height="44" rx="7" fill="var(--surface-2)" stroke="${line}"/>`;
      wrap(p, 18).forEach((ln, j, arr) => s += `<text x="${x}" y="${30 + (j - (arr.length - 1) / 2) * 13}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${ink}" dominant-baseline="middle">${esc(ln)}</text>`);
    });
    S.steps.forEach((st, i) => {
      const [a, b, label, type] = st;
      const y = top + i * rowH + 26;
      const state = i === cur ? "acc" : i < cur ? "mut" : "fut";
      const col = state === "acc" ? acc : state === "mut" ? mut : mut;
      const op = state === "fut" ? 0.18 : 1;
      const mk = state === "acc" ? "acc" : "mut";
      const sw = state === "acc" ? 2.4 : 1.4;
      s += `<g class="st" data-i="${i}" style="cursor:pointer" opacity="${op}">`;
      if (type === "n") {
        const x1 = cx(Math.min(a, b)) - colW / 2 + 10, x2 = cx(Math.max(a, b)) + colW / 2 - 10;
        s += `<rect x="${x1}" y="${y - 15}" width="${x2 - x1}" height="24" rx="5" fill="var(--c2-soft)" stroke="var(--c2)"/><text x="${(x1 + x2) / 2}" y="${y - 2}" text-anchor="middle" font-size="11.5" fill="var(--c2)" font-weight="600" dominant-baseline="middle">${esc(label)}</text>`;
      } else if (a === b) {
        const x = cx(a);
        s += `<path d="M${x} ${y - 10} h26 v16 h-24" fill="none" stroke="${col}" stroke-width="${sw}" marker-end="url(#ah-${key}-${mk})"/>`;
        s += `<text x="${x + 34}" y="${y - 1}" font-size="11.5" fill="${state === "acc" ? acc : ink}" font-weight="${state === "acc" ? 700 : 500}" dominant-baseline="middle">${i + 1}. ${esc(label)}</text>`;
      } else {
        const x1 = cx(a), x2 = cx(b), dir = x2 > x1 ? 1 : -1;
        const dash = type === "r" || type === "x" ? `stroke-dasharray="6 4"` : "";
        const marker = type === "a" ? `url(#ao-${key}-${mk})` : type === "x" ? "" : `url(#ah-${key}-${mk})`;
        s += `<line x1="${x1 + dir * 3}" y1="${y}" x2="${x2 - dir * 5}" y2="${y}" stroke="${col}" stroke-width="${sw}" ${dash} ${marker ? `marker-end="${marker}"` : ""}/>`;
        if (type === "x") s += `<path d="M${x2 - dir * 12 - 5} ${y - 5} l10 10 M${x2 - dir * 12 - 5} ${y + 5} l10 -10" stroke="var(--c1)" stroke-width="2"/>`;
        const lx = Math.min(x1, x2) + 8;
        s += `<text x="${lx}" y="${y - 7}" font-size="11.5" fill="${state === "acc" ? acc : ink}" font-weight="${state === "acc" ? 700 : 500}">${i + 1}. ${esc(label)}</text>`;
      }
      s += `</g>`;
    });
    s += `</svg>`;
    svgHost.innerHTML = s;
    $$(".st", svgHost).forEach(g => g.addEventListener("click", () => { cur = Number(g.dataset.i); update(); }));
  }
  function update() {
    draw();
    cnt.textContent = cur < 0 ? `${S.steps.length} pasos` : `Paso ${cur + 1} de ${S.steps.length}`;
    if (cur < 0) { note.innerHTML = `<p class="muted">Pulsa <b>Siguiente</b> para recorrer el escenario. Cada paso explica qué ocurre y por qué la arquitectura lo hace así. También puedes tocar cualquier flecha.</p>`; return; }
    const st = S.steps[cur];
    const who = st[3] === "n" ? "Nota" : st[0] === st[1] ? S.parts[st[0]] : `${S.parts[st[0]]} → ${S.parts[st[1]]}`;
    note.innerHTML = `<div class="stepno">Paso ${cur + 1} · ${esc(who)}</div><p><b>${esc(st[2])}</b></p>${st[4] ? `<p>${esc(st[4])}</p>` : ""}`;
    linkify(note);
  }
  const stop = () => { clearInterval(timer); timer = null; $('[data-a="play"]', el).textContent = "Reproducir"; };
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    const act = a.dataset.a;
    if (act === "next") { stop(); cur = Math.min(S.steps.length - 1, cur + 1); }
    if (act === "prev") { stop(); cur = Math.max(-1, cur - 1); }
    if (act === "reset") { stop(); cur = -1; }
    if (act === "play") {
      if (timer) { stop(); return; }
      if (cur >= S.steps.length - 1) cur = -1;
      a.textContent = "Pausa";
      timer = setInterval(() => { cur++; update(); if (cur >= S.steps.length - 1) stop(); }, 2600);
    }
    update();
  });
  update();
}

/* ---------- Simuladores ---------- */
const SIMS = {};
SIMS.breaker = el => {
  const st = { state: "closed", win: [], t: 0, openedAt: 0, up: false, cache: { v: 312, at: -95 }, log: [] };
  el.className = "sim";
  el.innerHTML = `<h3>Interruptor de circuito: sistema hospitalario IE-012</h3>
  <p class="muted">TAC-03: se abre con 50 % de fallas sobre al menos 20 invocaciones en una ventana de 30 s; reposo de 30 s; luego una llamada de prueba (semiabierto). Con el circuito abierto se responde desde la caché de última información conocida (DA-INT-06).</p>
  <div class="state-row"><div class="state s-closed">Cerrado</div><div class="state s-half">Semiabierto</div><div class="state s-open">Abierto</div></div>
  <div class="btns"><label class="btn"><input type="checkbox" class="up"> El hospital responde</label>
   <button class="btn" data-a="1">Hacer 1 consulta</button><button class="btn" data-a="10">Hacer 10 consultas</button><button class="btn" data-a="wait">Avanzar 30 s</button><button class="btn" data-a="reset">Reiniciar</button></div>
  <div class="sim-grid"><div><div class="muted" style="font-size:.82rem">Ventana de 30 s: <b class="wn">0</b> llamadas, <b class="wf">0 %</b> fallas (umbral: 50 % con ≥ 20)</div><div class="meter" style="margin-top:6px"><i class="wm"></i><span class="tick" style="left:50%"></span></div>
   <div class="card" style="margin-top:12px;box-shadow:none"><div class="muted" style="font-size:.78rem">Lo que ve el tablero de la sala de crisis</div><div class="big-num cv">312</div><div class="cm" style="font-size:.85rem"></div></div></div>
   <div><div class="muted" style="font-size:.82rem">Registro</div><div class="log"></div></div></div>`;
  const clock = t => { const s = 10 * 3600 + 42 * 60 + t; return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(x => String(x).padStart(2, "0")).join(":"); };
  const log = (m, c) => { st.log.unshift(`<div class="${c}">[${clock(st.t)}] ${m}</div>`); st.log = st.log.slice(0, 60); };
  const call = () => {
    st.t += 1;
    st.win = st.win.filter(x => st.t - x.t < 30);
    if (st.state === "open") {
      if (st.t - st.openedAt >= 30) { st.state = "half"; log("Venció el reposo → Semiabierto: la próxima llamada es de prueba", "warn"); }
      else { log("Rechazo inmediato (0 ms, circuito abierto) → respuesta desde caché, marcada DESACTUALIZADA", "bad"); return; }
    }
    if (st.state === "half") {
      if (st.up) { st.state = "closed"; st.win = []; st.cache = { v: 290 + Math.floor(Math.random() * 40), at: st.t }; log("Sondeo de prueba exitoso → Cerrado. EVT-P1: integración operativa. La bandeja de salida envía lo pendiente.", "ok"); }
      else { st.state = "open"; st.openedAt = st.t; log("Sondeo de prueba fallido → Abierto de nuevo, otros 30 s de reposo", "bad"); }
      return;
    }
    if (st.up) { st.win.push({ t: st.t, ok: true }); st.cache = { v: 290 + Math.floor(Math.random() * 40), at: st.t }; log("200 OK en 180 ms. Caché actualizada", "ok"); }
    else { st.win.push({ t: st.t, ok: false }); log("Sin respuesta: el límite de espera corta a los 1,5 s (TAC-01) → respuesta degradada desde caché", "warn"); }
    const n = st.win.length, f = st.win.filter(x => !x.ok).length;
    if (n >= 20 && f / n >= 0.5) { st.state = "open"; st.openedAt = st.t; log(`Umbral superado (${f}/${n} fallas) → ABIERTO. EVT-P1 publicado; el catálogo marca IE-012 como degradada`, "bad"); }
  };
  const render = () => {
    $$(".state", el).forEach(s => s.classList.remove("on"));
    $(".s-" + st.state, el).classList.add("on");
    const win = st.win.filter(x => st.t - x.t < 30), n = win.length, f = win.filter(x => !x.ok).length, pct = n ? Math.round(f / n * 100) : 0;
    $(".wn", el).textContent = n; $(".wf", el).textContent = pct + " %"; $(".wm", el).style.width = pct + "%";
    $(".cv", el).textContent = st.cache.v + " camas";
    const age = st.t - st.cache.at, stale = st.state !== "closed" || !st.up;
    $(".cm", el).innerHTML = `Capacidad disponible · obtenida ${clock(st.cache.at)} (hace ${age} s) ${stale ? '<span class="chip c1">Fuente degradada · desactualizado</span>' : '<span class="chip c3">al día</span>'}`;
    $(".log", el).innerHTML = st.log.join("") || '<div class="info">Marca o desmarca "El hospital responde" y haz consultas.</div>';
  };
  $(".up", el).addEventListener("change", e => { st.up = e.target.checked; log(st.up ? "El sistema hospitalario vuelve a responder" : "El sistema hospitalario deja de responder", "info"); render(); });
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    const act = a.dataset.a;
    if (act === "1") call();
    if (act === "10") for (let i = 0; i < 10; i++) call();
    if (act === "wait") { st.t += 30; if (st.state === "open") { st.state = "half"; log("Pasaron 30 s de reposo → Semiabierto", "warn"); } else log("Pasan 30 s", "info"); }
    if (act === "reset") { Object.assign(st, { state: "closed", win: [], t: 0, openedAt: 0, log: [], cache: { v: 312, at: -95 } }); }
    render();
  });
  render();
};

SIMS.degradacion = el => {
  const F = [
    ["Registro y consulta de eventos", "C1", ["ok", "ok", "ok", "ok"]],
    ["Asignación de recursos", "C1", ["ok", "ok", "ok", "ok"]],
    ["Alertas críticas", "C1", ["ok", "ok", "ok", "ok"]],
    ["Autenticación y auditoría", "C1", ["ok", "ok", "ok", "ok"]],
    ["Datos estructurados de campo", "C1", ["ok", "ok", "ok", "ok"]],
    ["Carga de evidencias (fotos)", "C2", ["ok", "ok", "ok", "off:pospuesta"]],
    ["Tableros operativos", "C2", ["ok", "ok", "deg:intervalo ampliado", "off:ERR-10"]],
    ["Consultas no urgentes de GPA", "C2", ["ok", "ok", "deg:cuota reducida", "off:ERR-10"]],
    ["Integraciones de consulta C2", "C2", ["ok", "ok", "deg:sondeo espaciado", "off:ERR-10"]],
    ["Consulta pública", "C3", ["ok", "deg:solo caché", "deg:solo caché", "off:ERR-10"]],
    ["Exportaciones y reportes", "C3", ["ok", "off:en pausa", "off:en pausa", "off:ERR-10"]],
    ["Cambios de catálogo no urgentes", "C3", ["ok", "deg:diferidos", "deg:diferidos", "off:ERR-10"]]
  ];
  const names = ["ND-0 Normal", "ND-1 Presión", "ND-2 Sobrecarga", "ND-3 Crítico"];
  const st = { sat: 45, lat: false, level: 0, pending: null, left: 0, log: [] };
  el.className = "sim";
  el.innerHTML = `<h3>Control de admisión y niveles de degradación</h3>
  <p class="muted">Umbrales de referencia (SAD 20.5): ND-1 &gt; 70 %, ND-2 &gt; 85 %, ND-3 si la latencia C1 supera su presupuesto. Se sube de inmediato y se baja solo después de un periodo sostenido (histéresis; aquí 5 s para simular varios minutos).</p>
  <div class="sim-grid"><div class="field"><label for="sat-${Math.random().toString(36).slice(2, 6)}">Saturación del compartimento: <b class="sv">45 %</b></label><input type="range" min="0" max="100" value="45" class="sat" aria-label="Saturación"></div>
  <div><label class="btn"><input type="checkbox" class="lat"> La latencia C1 supera su presupuesto</label></div></div>
  <div class="state-row">${names.map((n, i) => `<div class="state nd${i}" style="--c:var(--${i === 0 ? "c3" : i === 3 ? "c1" : "c2"})">${n}</div>`).join("")}</div>
  <div class="pend muted" style="font-size:.85rem;min-height:1.4em"></div>
  <div class="func-list"></div><div class="log"></div>`;
  $$(".state", el).forEach(s => { s.addEventListener("transitionend", () => {}); });
  const target = () => st.lat ? 3 : st.sat > 85 ? 2 : st.sat > 70 ? 1 : 0;
  const setLevel = l => { if (l === st.level) return; st.log.unshift(`<div class="${l > st.level ? "bad" : "ok"}">EVT-P4 plt.degradacion.nivel-cambiado.v1: ${names[st.level]} → ${names[l]}</div>`); st.level = l; };
  const tick = () => {
    const t = target();
    if (t > st.level) { setLevel(t); st.pending = null; }
    else if (t < st.level) { if (st.pending == null) { st.pending = t; st.left = 5; } else { st.left--; if (st.left <= 0) { setLevel(st.pending); st.pending = null; } else st.pending = t; } }
    else st.pending = null;
    render();
  };
  const render = () => {
    $(".sv", el).textContent = st.sat + " %";
    $$(".state", el).forEach((s, i) => { const on = i === st.level; s.classList.toggle("on", on); s.style.background = on ? "var(--" + (i === 0 ? "c3" : i === 3 ? "c1" : "c2") + ")" : ""; s.style.borderColor = on ? s.style.background : ""; s.style.color = on ? "#fff" : ""; });
    $(".pend", el).textContent = st.pending != null ? `Carga por debajo del umbral: bajará a ${names[st.pending]} en ${st.left} s si se mantiene (histéresis).` : "";
    $(".func-list", el).innerHTML = F.map(([n, c, s]) => { const [k, t] = s[st.level].split(":"); return `<div class="func"><span><span class="chip ${c.toLowerCase()}">${c}</span> ${n}</span><span class="st ${k}">${k === "ok" ? "normal" : t}</span></div>`; }).join("");
    $(".log", el).innerHTML = st.log.slice(0, 20).join("") || '<div class="info">Mueve la saturación por encima del 70 % y del 85 %.</div>';
  };
  $(".sat", el).addEventListener("input", e => { st.sat = Number(e.target.value); tick(); });
  $(".lat", el).addEventListener("change", e => { st.lat = e.target.checked; tick(); });
  setInterval(() => { if (st.pending != null && el.offsetParent) tick(); }, 1000);
  render();
};

SIMS.outbox = el => {
  const st = { crash: false, up: true, direct: [], box: [], n: 0 };
  el.className = "sim";
  el.innerHTML = `<h3>Bandeja de salida transaccional frente a envío directo</h3>
  <p class="muted">Operación: asignar un recurso (POST /v1/asignaciones), que debe informarse al sistema de recursos IE-013 (PIN-05, DA-INT-05).</p>
  <div class="btns"><label class="btn"><input type="checkbox" class="crash"> El proceso cae justo después de guardar</label><label class="btn"><input type="checkbox" class="up" checked> IE-013 disponible</label>
  <button class="btn primary" data-a="op">Asignar recurso</button><button class="btn" data-a="pub">Ejecutar ciclo del publicador</button><button class="btn" data-a="reset">Reiniciar</button></div>
  <div class="sim-grid"><div class="card" style="box-shadow:none"><h4 style="margin-top:0">Envío directo (alternativa descartada)</h4><div class="log d"></div></div>
  <div class="card" style="box-shadow:none"><h4 style="margin-top:0">Con bandeja de salida (decisión)</h4><div class="tbl-wrap" style="margin:0 0 8px"><table><thead><tr><th>Registro</th><th>Estado</th><th>Intentos</th></tr></thead><tbody class="ob"></tbody></table></div><div class="log b"></div></div></div>`;
  const dl = [], bl = [];
  const wait = n => { const base = 2 * Math.pow(2, n - 1); const j = base * (1 + (Math.random() * 0.4 - 0.2)); return j.toFixed(1); };
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    const act = a.dataset.a;
    if (act === "op") {
      const id = "ASG-" + String(++st.n).padStart(3, "0");
      if (st.crash) dl.unshift(`<div class="bad">${id}: guardado en la BD; el proceso cae antes de enviar → IE-013 nunca se entera. Inconsistencia silenciosa.</div>`);
      else if (!st.up) dl.unshift(`<div class="bad">${id}: guardado; el envío falla porque IE-013 está caído. ¿Revertir la asignación o dejarla sin informar? La operación C1 depende del externo.</div>`);
      else dl.unshift(`<div class="ok">${id}: guardado y enviado. Funciona solo cuando todo sale bien.</div>`);
      st.box.push({ id, s: "pendiente", n: 0 });
      bl.unshift(`<div class="ok">${id}: asignación y registro de salida escritos en la MISMA transacción. Se confirma al usuario (TAC-18).</div>`);
      if (st.crash) bl.unshift(`<div class="warn">El proceso cae… al reiniciar, el registro sigue en la bandeja como pendiente. Nada se perdió.</div>`);
      else publish();
    }
    if (act === "pub") publish();
    if (act === "reset") { st.box = []; st.n = 0; dl.length = 0; bl.length = 0; }
    render();
  });
  function publish() {
    st.box.filter(x => x.s !== "entregado").forEach(x => {
      x.n++;
      if (st.up) { x.s = "entregado"; bl.unshift(`<div class="ok">${x.id}: publicado a IE-013 con clave de idempotencia y marcado como entregado (orden por entidad).</div>`); }
      else { x.s = "reencolado"; bl.unshift(`<div class="warn">${x.id}: IE-013 no responde (circuito). Reencolado; próximo intento en ~${wait(x.n)} s (base 2 s, variación ±20 %).</div>`); }
    });
  }
  const render = () => {
    $(".d", el).innerHTML = dl.join("") || '<div class="info">Pulsa "Asignar recurso" con y sin fallas.</div>';
    $(".b", el).innerHTML = bl.join("") || '<div class="info">Compara el mismo caso aquí.</div>';
    $(".ob", el).innerHTML = st.box.map(x => `<tr><td class="mono">${x.id}</td><td><span class="st ${x.s === "entregado" ? "ok" : x.s === "pendiente" ? "deg" : "off"}">${x.s}</span></td><td>${x.n}</td></tr>`).join("") || '<tr><td colspan="3" class="muted">Bandeja vacía</td></tr>';
  };
  $(".crash", el).addEventListener("change", e => st.crash = e.target.checked);
  $(".up", el).addEventListener("change", e => { st.up = e.target.checked; });
  render();
};

SIMS.idem = el => {
  const reg = new Map(); let events = 0; const log = [];
  el.className = "sim";
  el.innerHTML = `<h3>Idempotencia: la misma alerta llega varias veces</h3>
  <p class="muted">La clave identifica el <b>hecho</b>, no el envío (RF-INT-008, DA-INT-04). Registro de claves procesadas con su resultado.</p>
  <div class="sim-grid"><div class="field"><label>Clave de idempotencia<input class="k" value="IE-010:sismo:2026-09-23T10:41:07Z"></label></div>
  <div class="field"><label>Contenido del mensaje<select class="c"><option>Magnitud 6,8 · epicentro 4,61 N −74,08 O</option><option>Magnitud 7,1 · epicentro 4,61 N −74,08 O</option></select></label></div></div>
  <div class="btns"><button class="btn primary" data-a="send">Enviar mensaje</button><button class="btn" data-a="new">Nuevo hecho (clave nueva)</button><button class="btn" data-a="reset">Reiniciar</button></div>
  <p>Eventos creados en la plataforma: <span class="big-num ev">0</span></p><div class="log"></div>`;
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    const k = $(".k", el).value.trim(), c = $(".c", el).value;
    if (a.dataset.a === "send") {
      if (!reg.has(k)) { events++; const r = "EVD-" + String(1000 + events); reg.set(k, { c, r }); log.unshift(`<div class="ok">201 Creado → evento preliminar ${r} (Detectado)</div>`); }
      else if (reg.get(k).c === c) log.unshift(`<div class="info">Clave ya procesada con el mismo contenido → se devuelve el resultado original (${reg.get(k).r}) sin efecto. El emisor puede reintentar tranquilo.</div>`);
      else log.unshift(`<div class="bad">409 ERR-08: clave repetida con contenido distinto → rechazado y registrado.</div>`);
    }
    if (a.dataset.a === "new") { $(".k", el).value = "IE-010:sismo:2026-09-23T" + new Date().toTimeString().slice(0, 8) + "Z"; }
    if (a.dataset.a === "reset") { reg.clear(); events = 0; log.length = 0; }
    $(".ev", el).textContent = events; $(".log", el).innerHTML = log.join("") || '<div class="info">Envía el mismo mensaje dos veces y luego cambia el contenido.</div>';
  });
  $(".log", el).innerHTML = '<div class="info">Envía el mismo mensaje dos veces y luego cambia el contenido.</div>';
};

SIMS.conflicto = el => {
  const st = {};
  const reset = () => Object.assign(st, { server: { v: 1, val: "Daño moderado", by: "evaluador" }, base: 1, local: "Destrucción total", validatorEdit: false, synced: false, status: "pendiente", counts: { p: 1, s: 0, c: 0, d: 0 }, log: [], conflict: null });
  reset();
  el.className = "sim";
  el.innerHTML = `<h3>Sincronización de campo con conflicto (PIN-06)</h3>
  <p class="muted">Evaluación del puente P-12. El evaluador descargó la versión v1 ("Daño moderado") y, sin conexión, la cambió a "Destrucción total".</p>
  <div class="btns"><label class="btn"><input type="checkbox" class="ve"> Mientras tanto, el validador la editó en la plataforma</label>
  <button class="btn primary" data-a="sync">Sincronizar lote</button><button class="btn" data-a="again">Reenviar el mismo lote (se cortó la red)</button><button class="btn" data-a="reset">Reiniciar</button></div>
  <div class="sim-grid"><div class="card" style="box-shadow:none"><h4 style="margin-top:0">App móvil (RF-MOV-008)</h4><div class="cnts"></div></div>
  <div class="card" style="box-shadow:none"><h4 style="margin-top:0">Plataforma</h4><div class="srv"></div></div></div>
  <div class="bandeja"></div><div class="log"></div>`;
  const render = () => {
    const c = st.counts;
    $(".cnts", el).innerHTML = `<dl class="kv"><dt>Pendientes</dt><dd>${c.p}</dd><dt>Sincronizados</dt><dd>${c.s}</dd><dt>En conflicto</dt><dd>${c.c}</dd><dt>Duplicados</dt><dd>${c.d}</dd><dt>Versión base local</dt><dd>v${st.base}</dd></dl>`;
    $(".srv", el).innerHTML = `<dl class="kv"><dt>Versión vigente</dt><dd>v${st.server.v}: ${esc(st.server.val)} <span class="muted">(${st.server.by})</span></dd></dl>`;
    $(".bandeja", el).innerHTML = st.conflict ? `<div class="callout warn"><b>Bandeja de conflictos: se conservan ambas versiones</b>Campo: "${esc(st.local)}" (base v${st.base}) · Plataforma: "${esc(st.conflict)}" (v${st.server.v}). Una persona autorizada decide (RF-MOV-007).
      <div class="btns"><button class="btn" data-a="pickF">Elegir la de campo</button><button class="btn" data-a="pickV">Elegir la del validador</button></div>
      <span style="font-size:.85rem">La política que diga cuál prevalece <b>no está definida</b> (OBS-02, RSG-02, riesgo alto; recomendación R-01).</span></div>` : "";
    $(".log", el).innerHTML = st.log.join("") || '<div class="info">Prueba primero sin la edición del validador y luego con ella.</div>';
    linkify($(".bandeja", el));
  };
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    const act = a.dataset.a;
    if (act === "sync") {
      if (st.synced || st.conflict) { st.log.unshift(`<div class="info">Nada pendiente en el dispositivo.</div>`); }
      else {
        st.log.unshift(`<div class="info">Lote recibido y encolado; confirmación temprana al dispositivo.</div>`);
        if (st.server.v === st.base) { st.server = { v: st.server.v + 1, val: st.local, by: "evaluador de campo" }; st.synced = true; st.counts = { p: 0, s: 1, c: 0, d: 0 }; st.log.unshift(`<div class="ok">Versión base v${st.base} = vigente → se aplica como v${st.server.v} (RF-EVD-009). Nada se sobrescribe: v1 queda en el histórico.</div>`); }
        else { st.conflict = st.server.val; st.counts = { p: 0, s: 0, c: 1, d: 0 }; st.log.unshift(`<div class="bad">Versión base v${st.base} ≠ vigente v${st.server.v} → CONFLICTO. No se sobrescribe en silencio. EVT-13 mov.conflicto.detectado.v1.</div>`); }
      }
    }
    if (act === "again") { st.counts.d++; st.log.unshift(`<div class="warn">Mismo identificador de dispositivo ya recibido → registro marcado como duplicado, sin crear otro (RN-013).</div>`); }
    if (act === "pickF" || act === "pickV") { const val = act === "pickF" ? st.local : st.conflict; st.server = { v: st.server.v + 1, val, by: "resolución manual" }; st.conflict = null; st.synced = true; st.counts = { p: 0, s: 1, c: 0, d: st.counts.d }; st.log.unshift(`<div class="ok">Conflicto resuelto → v${st.server.v}. Ambas ramas quedan en la cadena de versiones y en la auditoría (RF-AUD-003).</div>`); }
    if (act === "reset") { const ve = $(".ve", el); ve.checked = false; reset(); }
    render();
  });
  $(".ve", el).addEventListener("change", e => {
    if (st.synced || st.conflict) return;
    if (e.target.checked) { st.server = { v: 2, val: "Daño grave", by: "validador" }; st.log.unshift(`<div class="warn">El validador guarda v2 "Daño grave" en la plataforma.</div>`); }
    else { st.server = { v: 1, val: "Daño moderado", by: "evaluador" }; }
    render();
  });
  render();
};

SIMS.capacidad = el => {
  el.className = "sim";
  el.innerHTML = `<h3>Calculadora: ¿cabe el lote en 5 minutos? (AC-REN-005, RSG-05)</h3>
  <div class="sim-grid">
   <div class="field"><label>Evaluaciones en el lote<input type="number" class="n" value="50" min="1"></label></div>
   <div class="field"><label>Fotos por evaluación<input type="number" class="f" value="1" min="0" step="1"></label></div>
   <div class="field"><label>Tamaño medio por foto tras compresión (kB)<input type="number" class="s" value="700" min="1"></label></div>
   <div class="field"><label>Datos estructurados por evaluación (kB)<input type="number" class="d" value="4" min="0"></label></div>
   <div class="field"><label>Ancho de banda (Mbps)<input type="number" class="b" value="1" min="0.1" step="0.1"></label></div>
  </div>
  <div class="grid"><div class="card" style="box-shadow:none"><div class="muted" style="font-size:.8rem">Tiempo total del lote</div><div class="big-num tt"></div><div class="verdict vv"></div></div>
  <div class="card" style="box-shadow:none"><div class="muted" style="font-size:.8rem">Los datos estructurados llegan en</div><div class="big-num ts"></div><div class="muted" style="font-size:.8rem">porque se envían primero (IE-022, DA-ARQ-10)</div></div>
  <div class="card" style="box-shadow:none"><div class="muted" style="font-size:.8rem">Tamaño máximo de foto para cumplir</div><div class="big-num mx"></div><div class="muted" style="font-size:.8rem">punto de sensibilidad PS-08 / PS-11</div></div></div>
  <p class="muted" style="font-size:.86rem">1 Mbps × 300 s = 300 Mb ≈ 37,5 MB. Además, 500 reportes/min ≈ 8,3 por segundo sostenidos; con ráfaga ×3 son unos 25/s. Ancho de banda de entrada para evidencias a 500/min con estos valores: <b class="bw"></b>.</p>`;
  const calc = () => {
    const n = +$(".n", el).value || 0, f = +$(".f", el).value || 0, s = +$(".s", el).value || 0, d = +$(".d", el).value || 0, b = +$(".b", el).value || 0.1;
    const kbps = b * 1000 / 8; // kB/s
    const tot = n * (f * s + d), t = tot / kbps, ts = n * d / kbps;
    const maxS = f > 0 ? Math.max(0, (300 * kbps - n * d) / (n * f)) : Infinity;
    const fmt = x => x >= 60 ? `${Math.floor(x / 60)} min ${Math.round(x % 60)} s` : `${x.toFixed(1)} s`;
    $(".tt", el).textContent = fmt(t);
    const ok = t <= 300;
    const vv = $(".vv", el); vv.className = "verdict vv " + (ok ? "ok" : "bad"); vv.textContent = ok ? "Cumple AC-REN-005" : "No cumple: más de 5 min";
    $(".ts", el).textContent = fmt(ts);
    $(".mx", el).textContent = isFinite(maxS) ? Math.floor(maxS) + " kB" : "sin fotos";
    $(".bw", el).textContent = ((500 / 60) * f * s * 8 / 1000).toFixed(1) + " Mbps sostenidos (×3 en ráfaga)";
  };
  $$("input", el).forEach(i => i.addEventListener("input", calc)); calc();
};

SIMS.disponibilidad = el => {
  const inc = [["Falla de instancia, recuperación automática (N1)", 0], ["Pérdida de una zona, conmutación automática (N2)", 0], ["Despliegue fallido revertido automáticamente", 2], ["Conmutación regional N3 completa", 30]];
  el.className = "sim";
  el.innerHTML = `<h3>Presupuesto de indisponibilidad mensual (AC-DIS-001, RSG-07)</h3>
  <div class="sim-grid"><div class="field"><label>Disponibilidad objetivo (%)<input type="number" class="a" value="99.95" step="0.01" min="90" max="100"></label></div>
  <div><div class="muted" style="font-size:.8rem">Presupuesto del mes (730 h)</div><div class="big-num bud"></div></div></div>
  <div class="field" style="margin-top:10px">Incidentes del mes (minutos visibles para C1):</div>
  <div class="incs">${inc.map((x, i) => `<label style="display:block;margin:4px 0"><input type="checkbox" data-i="${i}"> ${x[0]} · <b>${x[1]} min</b></label>`).join("")}</div>
  <div class="meter" style="margin-top:10px;height:18px"><i class="um"></i></div>
  <p class="verdict res"></p>
  <p class="muted" style="font-size:.86rem">Por eso el SAD 19.1 concluye que las fallas ordinarias deben resolverse sin interrupción visible, y que la conmutación regional queda reservada a la catástrofe. Qué se reporta cuando ambos objetivos chocan es la pregunta PRG-08 al cliente.</p>`;
  const calc = () => {
    const a = +$(".a", el).value || 0, bud = (100 - a) / 100 * 730 * 60;
    const used = $$("input[data-i]", el).filter(c => c.checked).reduce((s, c) => s + inc[+c.dataset.i][1], 0);
    $(".bud", el).textContent = bud.toFixed(1) + " min";
    const pct = Math.min(100, bud ? used / bud * 100 : 100);
    $(".um", el).style.width = pct + "%"; $(".um", el).style.background = used > bud ? "var(--c1)" : "var(--c3)";
    $(".res", el).className = "verdict res " + (used > bud ? "bad" : "ok");
    $(".res", el).textContent = `Usados ${used} de ${bud.toFixed(1)} min: ${used > bud ? "presupuesto excedido" : "dentro del objetivo"}`;
  };
  $$("input", el).forEach(i => i.addEventListener("input", calc)); calc();
  linkify(el);
};

SIMS.n3 = el => {
  const steps = [[0, 2, "Detección y alerta a operación", "AC-OBS-003: menos de 2 min; monitoreo externo a ambas regiones."], [2, 5, "Declaración de contingencia N3", "Decisión humana acotada en tiempo (responsable de continuidad)."], [5, 6, "Aislamiento de la región principal", "Bloquea sus escrituras si sigue parcialmente accesible: nunca dos regiones escribiendo."], [6, 8, "Promoción de los almacenes secundarios", "Nada funciona sin datos."], [8, 12, "Custodia de claves e intermediario de identidad", "Sin claves no se leen los datos; sin identidad nadie entra."], [12, 16, "Bus de eventos, bandejas de salida y consumidor de auditoría", "Toda operación C1 necesita dejar su registro."], [16, 22, "GDE, NOT, COR, GRE, EVD, MOV y SEG + IE-010, IE-017, IE-018", "Son las funciones C1 del SRS 5.1."], [22, 26, "Redirección del punto de entrada global", "Los clientes llegan solo cuando todo lo anterior está listo; nadie se reconfigura."], [26, 30, "Verificación con monitoreo sintético", "Confirma el RTO de 30 min con evidencia."], [30, 30, "Después: C2, luego C3, y reconstrucción de proyecciones", "Siguen la clasificación de criticidad; luego la reconciliación (19.7)."]];
  let t = 0, timer = null;
  el.className = "sim";
  el.innerHTML = `<h3>Secuencia de restablecimiento ante pérdida de la región (N3)</h3>
  <div class="btns"><button class="btn primary" data-a="play">Reproducir</button><button class="btn" data-a="step">+1 min</button><button class="btn" data-a="reset">Reiniciar</button><span class="clock">min 00</span></div>
  <div class="timeline">${steps.map((s, i) => `<div class="tl-row" data-i="${i}"><span class="m">${String(s[0]).padStart(2, "0")}–${String(s[1]).padStart(2, "0")}</span><span><b>${esc(s[2])}</b> <span class="muted">· ${esc(s[3])}</span></span></div>`).join("")}</div>`;
  const render = () => {
    $(".clock", el).textContent = "min " + String(t).padStart(2, "0") + (t >= 30 ? " · RTO cumplido" : "");
    $$(".tl-row", el).forEach((r, i) => { const s = steps[i]; r.classList.toggle("on", t >= s[0] && (t > s[0] || i === 0 || s[0] === s[1] ? true : true) && t >= s[0]); r.classList.toggle("cur", t >= s[0] && (t < s[1] || (s[0] === s[1] && t >= 30))); });
  };
  const stop = () => { clearInterval(timer); timer = null; $('[data-a="play"]', el).textContent = "Reproducir"; };
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    if (a.dataset.a === "play") { if (timer) { stop(); return; } if (t >= 30) t = 0; a.textContent = "Pausa"; timer = setInterval(() => { t++; render(); if (t >= 30) stop(); }, 450); }
    if (a.dataset.a === "step") { stop(); t = Math.min(30, t + 1); }
    if (a.dataset.a === "reset") { stop(); t = 0; }
    render();
  });
  render(); linkify(el);
};

/* ---------- Guion con cronómetro ---------- */
function renderGuion(el) {
  const G = C.guion; const total = G.reduce((s, b) => s + b.min, 0);
  let start = null, acc = 0, timer = null;
  el.innerHTML = `<div class="timer-bar"><span class="clock gt">00:00</span><span class="muted">objetivo ${total} min (máximo del enunciado: 20)</span><button class="btn primary" data-a="go">Iniciar</button><button class="btn" data-a="rs">Reiniciar</button><span class="gb muted"></span></div>
  ${G.map((b, i) => `<div class="guion-block" data-i="${i}"><div class="meta"><b>${b.min} min</b>diapositivas ${b.slides}</div><div><h3 style="margin-top:0">${esc(b.t)}</h3><ul>${b.key.map(k => `<li>${esc(k)}</li>`).join("")}</ul><p class="say">"${esc(b.say)}"</p></div></div>`).join("")}`;
  const secs = () => acc + (start ? (Date.now() - start) / 1000 : 0);
  const render = () => {
    const s = secs(); $(".gt", el).textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    let c = 0, idx = -1; G.forEach((b, i) => { if (idx < 0 && s < (c += b.min) * 60) idx = i; });
    if (s > 0 && idx < 0) idx = G.length - 1;
    $$(".guion-block", el).forEach((b, i) => b.classList.toggle("cur", start != null && i === idx));
    $(".gb", el).textContent = start || acc ? (idx >= 0 ? `Deberías estar en: ${G[idx].t}` : "") : "";
    $(".gt", el).style.color = s > 20 * 60 ? "var(--c1)" : "";
  };
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    if (a.dataset.a === "go") { if (start) { acc = secs(); start = null; clearInterval(timer); a.textContent = "Continuar"; } else { start = Date.now(); timer = setInterval(render, 500); a.textContent = "Pausa"; } }
    if (a.dataset.a === "rs") { start = null; acc = 0; clearInterval(timer); $('[data-a="go"]', el).textContent = "Iniciar"; }
    render();
  });
  render();
}

/* ---------- Mi exposición (diapositivas 23 a 31) ---------- */
function renderMiParte(el) {
  const M = C.miParte, B = M.bloques, total = B.reduce((s, b) => s + b.min, 0);
  const done = store.get("pgdr-miparte", {});
  const words = t => t.trim().split(/\s+/).length;
  const mmss = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  const readSecs = b => (b.say.reduce((n, p) => n + words(p), 0) + (b.puente ? words(b.puente) : 0)) / 140 * 60;
  const allRead = B.reduce((s, b) => s + readSecs(b), 0) + (words(M.intro) + words(M.cierre)) / 140 * 60;
  let start = null, acc = 0, timer = null;
  el.innerHTML = `<div class="timer-bar"><span class="clock gt">00:00</span><span class="muted">objetivo ${total} min · leído en voz alta ≈ ${mmss(allRead)}</span><button class="btn primary" data-a="go">Iniciar</button><button class="btn" data-a="rs">Reiniciar</button><button class="btn" data-a="rd" aria-pressed="false">Modo lectura</button><span class="gb muted"></span></div>
  <p class="say mp-edge"><b>Entrada:</b> ${esc(M.intro)}</p>
  ${B.map((b, i) => `<article class="guion-block mp-block" data-i="${i}"><div class="meta mp-meta"><b>Diap. ${b.slide}</b>${b.min} min · ≈ ${mmss(readSecs(b))} leído<br><a href="#${b.ver}">ver detalle →</a><br><label><input type="checkbox" class="m" ${done[i] ? "checked" : ""}> La domino</label></div><div>
    <h3 style="margin-top:0">${esc(b.t)}</h3>
    <div class="mp-say">${b.say.map(p => `<p>${esc(p)}</p>`).join("")}</div>
    <div class="mp-datos">${b.datos.map(d => `<span>${esc(d)}</span>`).join("")}</div>
    <div class="mp-qa"><div class="mp-lbl">Si me preguntan</div>${b.qa.map(x => `<details class="acc"><summary>${esc(x.q)}</summary><div class="body"><p>${esc(x.a)}</p></div></details>`).join("")}</div>
    ${b.puente ? `<p class="say mp-puente">→ ${esc(b.puente)}</p>` : ""}
  </div></article>`).join("")}
  <p class="say mp-edge"><b>Cierre:</b> ${esc(M.cierre)}</p>`;
  const secs = () => acc + (start ? (Date.now() - start) / 1000 : 0);
  const setReading = on => { el.classList.toggle("mp-reading", on); $('[data-a="rd"]', el).setAttribute("aria-pressed", String(on)); store.set("pgdr-miparte-lectura", on); };
  const render = () => {
    const s = secs(); $(".gt", el).textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    let c = 0, idx = -1; B.forEach((b, i) => { if (idx < 0 && s < (c += b.min) * 60) idx = i; });
    if (s > 0 && idx < 0) idx = B.length - 1;
    $$(".mp-block", el).forEach((b, i) => b.classList.toggle("cur", start != null && i === idx));
    const n = Object.values(done).filter(Boolean).length;
    $(".gb", el).textContent = (start || acc) && idx >= 0 ? `Deberías estar en: diap. ${B[idx].slide}` : `${n} de ${B.length} dominadas`;
    $(".gt", el).style.color = s > total * 60 ? "var(--c1)" : "";
  };
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    if (a.dataset.a === "go") { if (start) { acc = secs(); start = null; clearInterval(timer); a.textContent = "Continuar"; } else { start = Date.now(); timer = setInterval(render, 500); a.textContent = "Pausa"; } }
    if (a.dataset.a === "rs") { start = null; acc = 0; clearInterval(timer); $('[data-a="go"]', el).textContent = "Iniciar"; }
    if (a.dataset.a === "rd") setReading(!el.classList.contains("mp-reading"));
    render();
  });
  $$(".m", el).forEach(c => c.addEventListener("change", () => { done[c.closest(".mp-block").dataset.i] = c.checked; store.set("pgdr-miparte", done); render(); }));
  setReading(store.get("pgdr-miparte-lectura", false));
  render();
}

/* ---------- Banco de preguntas ---------- */
function renderQA(el) {
  const mastered = store.get("pgdr-qa", {});
  const tags = Array.from(new Set(C.qa.map(q => q.tag)));
  el.innerHTML = `<div class="pill-group"><button class="on" data-t="">Todas (${C.qa.length})</button>${tags.map(t => `<button data-t="${t}">${t}</button>`).join("")}<button data-t="__pend">Sin dominar</button></div><p class="muted qa-count" style="font-size:.84rem"></p>
  ${C.qa.map((q, i) => `<details class="acc qa-item" data-tag="${q.tag}" data-i="${i}"><summary><span class="chip info">${q.tag}</span> ${esc(q.q)}</summary><div class="body"><p class="short">${esc(q.a)}</p><p class="more"><b>Si insisten:</b> ${esc(q.more)}</p><label style="font-size:.84rem"><input type="checkbox" class="m" ${mastered[i] ? "checked" : ""}> La domino</label></div></details>`).join("")}`;
  let tag = "";
  const apply = () => { let n = 0; $$(".qa-item", el).forEach(d => { const i = d.dataset.i; const ok = !tag || (tag === "__pend" ? !mastered[i] : d.dataset.tag === tag); d.hidden = !ok; if (ok) n++; }); $(".qa-count", el).textContent = `${Object.values(mastered).filter(Boolean).length} de ${C.qa.length} dominadas · mostrando ${n}`; };
  $$(".pill-group button", el).forEach(b => b.addEventListener("click", () => { $$(".pill-group button", el).forEach(x => x.classList.remove("on")); b.classList.add("on"); tag = b.dataset.t; apply(); }));
  $$(".m", el).forEach(c => c.addEventListener("change", () => { mastered[c.closest(".qa-item").dataset.i] = c.checked; store.set("pgdr-qa", mastered); apply(); }));
  apply();
}

/* ---------- Quiz ---------- */
function renderQuiz(el) {
  let Q = [], i = 0, score = 0, answered = false;
  const shuffle = a => { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; };
  const start = n => { Q = shuffle(C.quiz).slice(0, n).map(q => ({ q: q[0], opts: shuffle(q[1].map((t, k) => ({ t, ok: k === q[2] }))), exp: q[3] })); i = 0; score = 0; show(); };
  const show = () => {
    answered = false;
    if (i >= Q.length) {
      const best = store.get("pgdr-quiz-best", 0), pct = Math.round(score / Q.length * 100);
      if (pct > best) store.set("pgdr-quiz-best", pct);
      el.innerHTML = `<div class="card"><h3 style="margin-top:0">Resultado: ${score} de ${Q.length} (${pct} %)</h3><p>${pct >= 80 ? "Listo para la sustentación en estos temas." : pct >= 60 ? "Bien encaminado. Repasa las explicaciones de las que fallaste." : "Vuelve a Fundamentos, Integración y ATAM y repite."}</p><p class="muted">Tu mejor puntaje: ${Math.max(best, pct)} %</p><div class="btns"><button class="btn primary" data-n="10">Otro quiz de 10</button><button class="btn" data-n="${C.quiz.length}">Todas (${C.quiz.length})</button></div></div>`;
      return;
    }
    const q = Q[i];
    el.innerHTML = `<div class="card"><div class="muted" style="font-size:.8rem">Pregunta ${i + 1} de ${Q.length} · aciertos ${score}</div><div class="quiz-q">${esc(q.q)}</div>${q.opts.map((o, k) => `<button class="quiz-opt" data-k="${k}">${esc(o.t)}</button>`).join("")}<div class="exp"></div><div class="btns"><button class="btn primary nx" hidden>Siguiente</button></div></div>`;
  };
  el.addEventListener("click", e => {
    const n = e.target.closest("[data-n]"); if (n) { start(+n.dataset.n); return; }
    const o = e.target.closest(".quiz-opt");
    if (o && !answered) {
      answered = true; const q = Q[i], k = +o.dataset.k;
      if (q.opts[k].ok) score++;
      $$(".quiz-opt", el).forEach((b, j) => { if (q.opts[j].ok) b.classList.add("right"); else if (j === k) b.classList.add("wrong"); });
      $(".exp", el).innerHTML = `<div class="callout ${q.opts[k].ok ? "good" : "warn"}"><b>${q.opts[k].ok ? "Correcto" : "Incorrecto"}</b>${esc(q.exp)}</div>`;
      linkify($(".exp", el));
      $(".nx", el).hidden = false;
    }
    if (e.target.closest(".nx")) { i++; show(); }
  });
  el.innerHTML = `<div class="card"><h3 style="margin-top:0">Quiz de opción múltiple</h3><p>${C.quiz.length} preguntas sobre cifras, patrones, decisiones y hallazgos del ATAM. Cada respuesta trae su explicación.</p><div class="btns"><button class="btn primary" data-n="10">Empezar (10 preguntas)</button><button class="btn" data-n="${C.quiz.length}">Todas</button></div></div>`;
}
function renderFlash(el, deck, title) {
  let i = 0, flipped = false, order = deck.map((_, k) => k);
  el.innerHTML = `<p class="muted">${esc(title)} Toca la tarjeta para voltearla.</p><div class="flash" tabindex="0" role="button" aria-label="Voltear tarjeta"></div><div class="btns"><button class="btn" data-a="p">◀ Anterior</button><button class="btn primary" data-a="n">Siguiente ▶</button><button class="btn" data-a="s">Barajar</button><span class="muted ct" style="align-self:center;font-size:.84rem"></span></div>`;
  const card = $(".flash", el);
  const render = () => { const [f, b] = deck[order[i]]; card.innerHTML = flipped ? `<div class="back">${esc(b)}</div>` : `<div class="front">${esc(f)}</div>`; $(".ct", el).textContent = `${i + 1} / ${deck.length}`; };
  const flip = () => { flipped = !flipped; render(); };
  card.addEventListener("click", flip); card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
  el.addEventListener("click", e => { const a = e.target.closest("[data-a]"); if (!a) return; flipped = false; if (a.dataset.a === "n") i = (i + 1) % deck.length; if (a.dataset.a === "p") i = (i - 1 + deck.length) % deck.length; if (a.dataset.a === "s") { order = order.sort(() => Math.random() - 0.5); i = 0; } render(); });
  render();
}

/* ---------- Diagramas Archify ---------- */
const ARCHIFY = [
  { id: "pgdr-arquitectura", tipo: "Arquitectura", t: "Vista general de la arquitectura", d: "Clientes y superficies, compartimentos, almacenes por módulo, bus de eventos, identidad y auditoría dentro de la región principal.", ids: "DA-ARQ-01, DA-ARQ-02, DA-ARQ-04, DA-ARQ-08" },
  { id: "pgdr-ingesta-alerta", tipo: "Secuencia", t: "EO-A · Ingesta de una alerta externa", d: "Confirmación temprana, idempotencia, traducción al canónico, evento preliminar y alerta en menos de 30 s.", ids: "PIN-01, DA-INT-03, AC-REN-004" },
  { id: "pgdr-caida-hospitalario", tipo: "Secuencia", t: "EO-C · Caída del sistema hospitalario", d: "Circuito abierto, respuesta desde caché con advertencia y restablecimiento con envío de pendientes.", ids: "DA-INT-06, DA-INT-12, TAC-03" },
  { id: "pgdr-sincronizacion", tipo: "Secuencia", t: "EO-D · Sincronización de campo con conflicto", d: "Lote idempotente, comparación de versión base y bandeja de conflictos sin sobrescritura silenciosa.", ids: "PIN-06, RN-013, RSG-02" },
  { id: "pgdr-escritura", tipo: "Secuencia", t: "Escritura con bandeja de salida", d: "Parte síncrona C1 con confirmación local y propagación asíncrona a auditoría, proyecciones y externos.", ids: "DA-API-04, TAC-18" },
  { id: "pgdr-interruptor", tipo: "Ciclo de vida", t: "Interruptor de circuito", d: "Cerrado, umbral, abierto, semiabierto y cierre, con la degradación controlada mientras está abierto.", ids: "TAC-03, DA-INT-07, PS-01" },
  { id: "pgdr-ciclo-evento", tipo: "Ciclo de vida", t: "Ciclo de vida de un evento de desastre", d: "Fases configurables, flujo abreviado Nivel_1, reclasificación y reapertura auditadas.", ids: "DA-ARQ-05, RN-004, RN-006" },
  { id: "pgdr-datos", tipo: "Flujo de datos", t: "Daños, datos personales y traza", d: "Ruta de la evaluación, aislamiento de datos personales en GPA y consumo por proyección, REC y auditoría.", ids: "DA-API-06, CSI-20, CSI-23" }
];
let archifyPick = null;
function renderArchify(el) {
  el.innerHTML = `<div class="pill-group">${ARCHIFY.map((a, i) => `<button data-a="${a.id}" class="${i ? "" : "on"}">${esc(a.t)}</button>`).join("")}</div>
  <div class="card ax-info" style="box-shadow:none"></div>
  <div class="ax-frame"><iframe title="Diagrama Archify" loading="lazy"></iframe></div>`;
  const frame = $("iframe", el), info = $(".ax-info", el);
  const show = id => {
    const a = ARCHIFY.find(x => x.id === id) || ARCHIFY[0];
    $$(".pill-group button", el).forEach(b => b.classList.toggle("on", b.dataset.a === a.id));
    info.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:baseline"><h3 style="margin:0">${esc(a.t)} <span class="chip info">${esc(a.tipo)}</span></h3><a class="btn" href="archify/${a.id}.html" target="_blank" rel="noopener">Abrir en pantalla completa ↗</a></div><p style="margin:.4rem 0 0">${esc(a.d)} <span class="muted">Relacionado: ${esc(a.ids)}</span></p>`;
    linkify(info);
    frame.src = `archify/${a.id}.html`;
  };
  $$(".pill-group button", el).forEach(b => b.addEventListener("click", () => show(b.dataset.a)));
  el._show = show;
  show(archifyPick || ARCHIFY[0].id);
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-open-archify]"); if (!b) return;
  archifyPick = b.dataset.openArchify;
  const host = $("[data-archify]");
  if (location.hash === "#archify" && host && host._show) host._show(archifyPick);
  else location.hash = "archify";
});

/* ---------- Pestañas genéricas ---------- */
function tabs(barId, attr, labels, onShow) {
  const bar = document.getElementById(barId); if (!bar || bar.dataset.done) return; bar.dataset.done = "1";
  const keys = Object.keys(labels);
  bar.innerHTML = keys.map((k, i) => `<button data-k="${k}" class="${i ? "" : "on"}">${labels[k]}</button>`).join("");
  $$("button", bar).forEach(b => b.addEventListener("click", () => {
    $$("button", bar).forEach(x => x.classList.remove("on")); b.classList.add("on");
    const root = bar.closest("section");
    $$(`[${attr}]`, root).forEach(p => p.hidden = p.getAttribute(attr) !== b.dataset.k);
    const pane = $(`[${attr}="${b.dataset.k}"]`, root);
    renderMermaidIn(pane); if (onShow) onShow(b.dataset.k, pane);
  }));
}

/* ---------- Inicialización perezosa por sección ---------- */
const inited = new Set();
function initSection(sec) {
  if (inited.has(sec.id)) { renderMermaidIn(sec); if (sec.id === "archify" && archifyPick) { const host = $("[data-archify]", sec); if (host._show) host._show(archifyPick); } return; }
  inited.add(sec.id);
  $$("[data-table]", sec).forEach(renderTable);
  $$("[data-fichas]", sec).forEach(renderFichas);
  $$("[data-apis]", sec).forEach(renderApis);
  $$("[data-intmatrix]", sec).forEach(renderIntMatrix);
  $$("[data-attrmap]", sec).forEach(renderAttrMap);
  $$("[data-utiltree]", sec).forEach(renderUtilTree);
  $$("[data-trace]", sec).forEach(renderTrace);
  $$("[data-decoder]", sec).forEach(renderDecoder);
  $$("[data-guion]", sec).forEach(renderGuion);
  $$("[data-miparte]", sec).forEach(renderMiParte);
  $$("[data-qa]", sec).forEach(renderQA);
  $$("[data-quiz]", sec).forEach(renderQuiz);
  $$("[data-cards]", sec).forEach(el => renderFlash(el, C.cards, "Conceptos clave del proyecto."));
  $$("[data-idcards]", sec).forEach(el => {
    const pick = Object.keys(IDS).filter(k => /^(DA-|PRI|PIN|TAC-(0|1[01])|RSG|PC|EVT-0|ERR|SUP-[A-E]|EA-|AC-(DIS|REN|ESC|RCP)|RN-)/.test(k));
    const extra = Object.keys(FICHAS).filter(k => k.startsWith("DA-ARQ"));
    renderFlash(el, pick.concat(extra).map(k => [k, shortDesc(k)]), "Memoriza los identificadores que más vas a citar.");
  });
  $$("figure.fig img", sec).forEach(zoomFigure);
  $$("[data-archify]", sec).forEach(renderArchify);
  $$("[data-seq]", sec).forEach(el => renderSeq(el, el.dataset.seq));
  $$("[data-sim]", sec).forEach(el => SIMS[el.dataset.sim] && SIMS[el.dataset.sim](el));
  if (sec.id === "vistas") tabs("view-tabs", "data-view", { la: "Lógica A · dominio", lb: "Lógica B · módulos", pr: "Procesos", de: "Desarrollo", fi: "Física", es: "+1 Escenarios" });
  if (sec.id === "atam") tabs("atam-tabs", "data-atamtab", { RSG: "Riesgos (23)", NRS: "No riesgos (15)", PS: "Sensibilidad (21)", PC: "Compromisos (14)", TR: "Temas de riesgo (7)", R: "Recomendaciones (12)", PRG: "Preguntas abiertas (10)" });
  if (sec.id === "quiz") tabs("quiz-tabs", "data-quiztab", { quiz: "Quiz", cards: "Tarjetas de conceptos", ids: "Tarjetas de IDs" });
  if (sec.id === "simuladores") {
    tabs("sim-tabs", "data-simtab", { esc: "Escenarios paso a paso", breaker: "Interruptor de circuito", degr: "Control de admisión", outbox: "Bandeja de salida", idem: "Idempotencia", conf: "Conflicto de sincronización", cap: "Capacidad", disp: "Disponibilidad", n3: "Recuperación N3" });
    const pick = $("#seq-pick"), host = $("#seq-host");
    const keys = Object.keys(C.seqs);
    pick.innerHTML = keys.map((k, i) => `<button data-k="${k}" class="${i ? "" : "on"}">${esc(C.seqs[k].title.split(" · ")[0])}</button>`).join("");
    const load = k => { host.innerHTML = ""; const d = h("div"); host.appendChild(d); renderSeq(d, k); };
    $$("button", pick).forEach(b => b.addEventListener("click", () => { $$("button", pick).forEach(x => x.classList.remove("on")); b.classList.add("on"); load(b.dataset.k); }));
    load(keys[0]);
  }
  linkify(sec);
  renderMermaidIn(sec);
}

/* ---------- Navegación y progreso ---------- */
const sections = $$("section.route");
const prog = store.get("pgdr-progress", { seen: {}, done: {} });
function buildNav() {
  const nav = $("#nav"); let html = "", g = "";
  sections.forEach(s => {
    if (s.dataset.group !== g) { g = s.dataset.group; html += `<div class="nav-group">${esc(g)}</div>`; }
    html += `<a href="#${s.id}" data-r="${s.id}"><span class="dot"></span>${esc(s.dataset.title)}</a>`;
    const hd = $("header", s);
    if (hd && !$(".done-toggle", hd)) { const b = h("button", { class: "done-toggle", "aria-pressed": prog.done[s.id] ? "true" : "false" }, prog.done[s.id] ? "✓ Lo domino" : "Marcar como dominado"); b.addEventListener("click", () => { prog.done[s.id] = !prog.done[s.id]; store.set("pgdr-progress", prog); b.setAttribute("aria-pressed", String(!!prog.done[s.id])); b.textContent = prog.done[s.id] ? "✓ Lo domino" : "Marcar como dominado"; paintNav(); }); hd.appendChild(b); }
  });
  nav.innerHTML = html;
}
function paintNav() {
  $$("#nav a").forEach(a => { const r = a.dataset.r; a.classList.toggle("seen", !!prog.seen[r]); a.classList.toggle("done", !!prog.done[r]); });
  const d = sections.filter(s => prog.done[s.id]).length;
  $("#prog-txt").textContent = `${d} de ${sections.length} secciones dominadas`;
  $("#prog-bar").style.width = (d / sections.length * 100) + "%";
}
function route() {
  const id = (location.hash || "#inicio").slice(1);
  const sec = document.getElementById(id);
  if (!sec || !sec.classList.contains("route")) return;
  sections.forEach(s => s.hidden = s !== sec);
  $$("#nav a").forEach(a => a.classList.toggle("active", a.dataset.r === id));
  prog.seen[id] = true; store.set("pgdr-progress", prog); paintNav();
  initSection(sec);
  window.scrollTo(0, 0);
  $("#side").classList.remove("open");
  hidePop();
}
window.addEventListener("hashchange", route);

/* ---------- Búsqueda global ---------- */
const HEADS = [];
sections.forEach(s => $$("h2,h3", s).forEach((hd, i) => { if (!hd.id) hd.id = s.id + "-h" + i; HEADS.push({ r: s.id, id: hd.id, t: hd.textContent, n: norm(hd.textContent), rt: s.dataset.title }); }));
const ALLIDS = Array.from(new Set(Object.keys(IDS).concat(Object.keys(FICHAS), Object.keys(C.extraIds || {}))));
const q = $("#q"), res = $("#results");
let hits = [], hl = 0;
function doSearch() {
  const raw = q.value.trim(); if (!raw) { res.hidden = true; return; }
  const up = raw.toUpperCase(), n = norm(raw);
  hits = [];
  ALLIDS.filter(i => i.startsWith(up)).slice(0, 8).forEach(i => hits.push({ k: "id", id: i, t: shortDesc(i) }));
  HEADS.filter(x => x.n.includes(n)).slice(0, 8).forEach(x => hits.push({ k: "h", x }));
  if (n.length > 2) ALLIDS.filter(i => !i.startsWith(up) && norm(occText(i)).includes(n)).slice(0, 12).forEach(i => hits.push({ k: "id", id: i, t: shortDesc(i) }));
  hl = 0;
  res.innerHTML = hits.length ? hits.map((x, i) => x.k === "id" ? `<button data-i="${i}" class="${i ? "" : "hl"}"><span class="rid">${esc(x.id)}</span>${esc(String(x.t).slice(0, 120))}</button>` : `<button data-i="${i}" class="${i ? "" : "hl"}"><span class="rid">§</span>${esc(x.x.t)} <span class="muted">· ${esc(x.x.rt)}</span></button>`).join("") : `<button disabled>Sin resultados para "${esc(raw)}"</button>`;
  res.hidden = false;
}
function pick(i) {
  const x = hits[i]; if (!x) return;
  res.hidden = true;
  if (x.k === "id") showPop(x.id, q);
  else { location.hash = x.x.r; setTimeout(() => { const el = document.getElementById(x.x.id); if (el) { const hide = el.closest("[data-view],[data-atamtab],[data-simtab],[data-quiztab]"); if (hide && hide.hidden) { const attr = ["data-view", "data-atamtab", "data-simtab", "data-quiztab"].find(a => hide.hasAttribute(a)); const b = $(`button[data-k="${hide.getAttribute(attr)}"]`, hide.closest("section")); if (b) b.click(); } el.scrollIntoView({ block: "start" }); window.scrollBy(0, -70); } }, 60); }
}
q.addEventListener("input", doSearch);
q.addEventListener("focus", () => { if (q.value.trim()) doSearch(); });
q.addEventListener("keydown", e => {
  const bs = $$("button[data-i]", res);
  if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!bs.length) return; hl = (hl + (e.key === "ArrowDown" ? 1 : -1) + bs.length) % bs.length; bs.forEach((b, i) => b.classList.toggle("hl", i === hl)); bs[hl].scrollIntoView({ block: "nearest" }); }
  if (e.key === "Enter") { e.preventDefault(); pick(hl); }
});
res.addEventListener("click", e => { const b = e.target.closest("button[data-i]"); if (b) pick(+b.dataset.i); });
document.addEventListener("click", e => { if (!e.target.closest(".search")) res.hidden = true; });
document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); q.focus(); q.select(); } });

/* ---------- Lightbox y menú ---------- */
const lb = $("#lightbox");
lb.addEventListener("click", () => lb.hidden = true);
$("#menu-btn").addEventListener("click", () => $("#side").classList.toggle("open"));

buildNav(); paintNav(); route();
})();
