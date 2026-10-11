/* ============================================================
   BANSAL GLASS
   Change only the CONFIG block below (phone, WhatsApp, email,
   address, hours). Everything on the page updates from it.
   ============================================================ */
const CONFIG = {
  businessName: "Bansal Glass",
  phoneDisplay: "+91 00000 00000",
  phoneTel: "+910000000000",     // for tel: links, with country code
  whatsapp: "910000000000",      // digits only, with country code, no +
  email: "info@bansalglass.in",
  address: "Your shop address, Lucknow, Uttar Pradesh",
  hours: "Monday to Saturday, 9:30 am to 7:00 pm"
};

(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const waLink = (text) => "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Apply CONFIG ---------- */
  $$("[data-phone]").forEach(a => { a.href = "tel:" + CONFIG.phoneTel; a.textContent = CONFIG.phoneDisplay; });
  $$("[data-email]").forEach(a => { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; });
  $$("[data-address]").forEach(e => { e.textContent = CONFIG.address; });
  $$("[data-hours]").forEach(e => { e.textContent = CONFIG.hours; });
  $("#fabWa").href = waLink("Hello " + CONFIG.businessName + ", I would like to ask about glass work.");
  $("#yr").textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const menu = $("#menu"), nav = $("#nav");
  const closeNav = () => { nav.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); };
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach(a => a.addEventListener("click", closeNav));

  /* ---------- 3D tilt rig (hero scene and explorer) ---------- */
  function tiltRig(host, el, o) {
    if (reduce) { el.style.setProperty("--ry", o.baseY + "deg"); return; }
    let tx = 0, ty = o.baseY, cx = 0, cy = o.baseY, pointer = false, running = false, raf = 0;
    host.addEventListener("pointermove", e => {
      const r = host.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - .5) * 2, ny = ((e.clientY - r.top) / r.height - .5) * 2;
      ty = o.baseY + nx * o.y; tx = -ny * o.x; pointer = true;
    });
    host.addEventListener("pointerleave", () => { pointer = false; });
    function loop(t) {
      if (!pointer) { ty = o.baseY + Math.sin(t / 2400) * o.idleY; tx = Math.cos(t / 2900) * o.idleX; }
      cx += (tx - cx) * .07; cy += (ty - cy) * .07;
      el.style.setProperty("--rx", cx.toFixed(2) + "deg");
      el.style.setProperty("--ry", cy.toFixed(2) + "deg");
      raf = requestAnimationFrame(loop);
    }
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(en => en[0].isIntersecting ? start() : stop(), { threshold: .05 }).observe(host);
    } else start();
  }
  tiltRig($("#heroStage"), $("#scene"), { baseY: -14, x: 7, y: 16, idleX: 2.5, idleY: 7 });

  /* ---------- Glass type explorer ---------- */
  const TYPES = [
    {
      id: "toughened", name: "Toughened", short: "Strong and safe",
      layers: [["Outer skin, under compression", "lay-skin"], ["Core, under tension", "lay-core"], ["Outer skin, under compression", "lay-skin"]],
      about: "Ordinary glass is heated to around 600 °C and cooled quickly. This locks the outer skin in compression, so the sheet is several times stronger than normal glass. If it does break, it crumbles into small, blunt pieces.",
      best: "Shower enclosures, doors, railings, partitions, shopfronts, table tops", thick: "5 to 19 mm",
      note: "It cannot be cut, drilled or polished after toughening, so every size is final before it goes into the furnace."
    },
    {
      id: "double", name: "Double glazed", short: "Heat and noise",
      layers: [["Outer pane", "lay-glass"], ["Sealed air gap", "lay-gap"], ["Inner pane", "lay-glass"]],
      about: "Two panes held apart by a sealed spacer filled with dry air. The gap slows down heat and sound, so rooms stay cooler and quieter.",
      best: "Windows facing the sun or a busy road, air-conditioned rooms, shopfronts", thick: "Commonly 5 + 12 + 5 mm (pane, gap, pane)",
      note: "The panes can be toughened, tinted or reflective, depending on the need."
    },
    {
      id: "laminated", name: "Laminated", short: "Stays together",
      layers: [["Glass pane", "lay-glass"], ["Tough plastic interlayer", "lay-film"], ["Glass pane", "lay-glass"]],
      about: "Two sheets of glass bonded to a tough clear film. If a sheet cracks, the pieces stay stuck to the film instead of falling out.",
      best: "Balcony railings, staircases, overhead glazing, shopfronts", thick: "Commonly 6 + 6 mm or thicker",
      note: "It can be made from toughened sheets for extra strength."
    },
    {
      id: "frosted", name: "Frosted and etched", short: "Privacy and patterns",
      layers: [["Clear glass", "lay-glass"], ["Frosted or etched face", "lay-frost"]],
      about: "One face is sandblasted or acid-etched, so light comes through but the view does not. Patterns and logos can be etched in.",
      best: "Bathrooms, office cabins, doors, partitions", thick: "Any glass thickness; 5 to 12 mm is common",
      note: "Choose a pattern from us, or send your own design."
    },
    {
      id: "tinted", name: "Tinted and reflective", short: "Less glare",
      layers: [["Tint or reflective coating", "lay-coat"], ["Glass body", "lay-glass"]],
      about: "Tinted or coated glass cuts glare and part of the sun's heat. Reflective glass also gives privacy from outside during the day.",
      best: "Sun-facing windows, balconies, shopfronts, offices", thick: "5 to 12 mm is common",
      note: "Common colours are bronze, grey, green and blue."
    }
  ];
  const xpTabs = $("#xpTabs"), xpStack = $("#xpStack"), xpInfo = $("#xpInfo"), xpGap = $("#xpGap");
  let current = TYPES[0], gapNow = 0, gapAnim = 0;

  function setGap(target) {
    cancelAnimationFrame(gapAnim);
    if (reduce) { gapNow = target; xpStack.style.setProperty("--gap", gapNow + "px"); return; }
    const step = () => {
      gapNow += (target - gapNow) * .11;
      if (Math.abs(target - gapNow) < .4) { gapNow = target; xpStack.style.setProperty("--gap", gapNow + "px"); return; }
      xpStack.style.setProperty("--gap", gapNow.toFixed(1) + "px");
      gapAnim = requestAnimationFrame(step);
    };
    step();
  }
  function renderType(t, animate) {
    current = t;
    $$(".xp-tab", xpTabs).forEach(b => b.setAttribute("aria-selected", String(b.dataset.id === t.id)));
    const n = t.layers.length;
    xpStack.style.setProperty("--mid", (n - 1) / 2);
    xpStack.innerHTML = t.layers.map((l, idx) => '<div class="slab ' + l[1] + '" style="--i:' + (n - 1 - idx) + '"></div>').join("");
    const target = +xpGap.value * .9;
    if (animate) { gapNow = 0; xpStack.style.setProperty("--gap", "0px"); }
    setGap(target);
    xpInfo.innerHTML = "<h3>" + esc(t.name) + " glass</h3><p>" + esc(t.about) + "</p><dl>" +
      "<div><dt>Best for</dt><dd>" + esc(t.best) + "</dd></div>" +
      "<div><dt>Typical thickness</dt><dd>" + esc(t.thick) + "</dd></div>" +
      "<div><dt>Good to know</dt><dd>" + esc(t.note) + "</dd></div></dl>" +
      '<ul class="legend">' + t.layers.map((l, idx) => '<li data-idx="' + idx + '"><span class="sw ' + l[1] + '"></span>' + esc(l[0]) + "</li>").join("") + "</ul>";
    $$(".legend li", xpInfo).forEach(li => {
      const slab = $$(".slab", xpStack)[+li.dataset.idx];
      li.addEventListener("mouseenter", () => slab.classList.add("hl"));
      li.addEventListener("mouseleave", () => slab.classList.remove("hl"));
    });
  }
  TYPES.forEach(t => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "xp-tab"; b.dataset.id = t.id; b.setAttribute("role", "tab");
    b.innerHTML = "<b>" + esc(t.name) + "</b><span>" + esc(t.short) + "</span>";
    b.addEventListener("click", () => renderType(t, true));
    xpTabs.appendChild(b);
  });
  xpTabs.addEventListener("keydown", e => {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const i = TYPES.indexOf(current), nt = TYPES[(i + keys[e.key] + TYPES.length) % TYPES.length];
    renderType(nt, true); $(".xp-tab[data-id='" + nt.id + "']", xpTabs).focus();
  });
  xpGap.addEventListener("input", () => { cancelAnimationFrame(gapAnim); gapNow = +xpGap.value * .9; xpStack.style.setProperty("--gap", gapNow + "px"); });
  renderType(TYPES[0], true);
  tiltRig($("#xpStage"), $("#xpRig"), { baseY: 0, x: 8, y: 14, idleX: 1.5, idleY: 5 });

  /* ---------- Where glass goes ---------- */
  const SPOTS = [
    { x: 15.0, y: 39.4, title: "Windows", glass: "Clear, tinted or reflective glass, toughened where needed", thick: "5 to 6 mm for standard windows, thicker for large panes", text: "Choose tinted or reflective glass on the sun-facing side to cut glare and heat.", svc: "Window glass" },
    { x: 31.9, y: 70.0, title: "Double-glazed windows", glass: "Two panes with a sealed air gap", thick: "For example 5 + 12 + 5 mm", text: "Cuts heat and road noise, which helps most in air-conditioned rooms.", svc: "Double-glazed units" },
    { x: 15.4, y: 71.5, title: "Glass doors", glass: "Toughened glass, clear, frosted or etched", thick: "10 to 12 mm", text: "Frameless or with patch fittings. We size the fittings to the weight of the glass.", svc: "Glass doors" },
    { x: 41.7, y: 47.1, title: "Balcony and staircase railings", glass: "Toughened or laminated toughened glass", thick: "12 mm and above", text: "Laminated glass stays held together by its film if one sheet cracks, so we suggest it for balconies.", svc: "Glass railings" },
    { x: 44.7, y: 69.6, title: "Bathroom and shower glass", glass: "Toughened glass, clear or frosted", thick: "8 to 12 mm", text: "Frameless or semi-frameless enclosures with rust-resistant fittings. Frosted glass for bathroom windows.", svc: "Shower enclosures" },
    { x: 67.2, y: 68.3, title: "Shopfront and facade glazing", glass: "Toughened or laminated glass; double-glazed if air-conditioned", thick: "10 to 12 mm", text: "Large panes need careful handling, so we plan the lift and fitting at the site visit.", svc: "Shopfront and facade glazing" },
    { x: 87.0, y: 69.2, title: "Office and room partitions", glass: "Toughened glass, clear, frosted or with etched patterns", thick: "10 to 12 mm", text: "Frameless or framed, fixed or sliding. Frosted bands give privacy at seating height.", svc: "Glass partitions" }
  ];
  const map = $("#map"), whereInfo = $("#whereInfo");
  function showSpot(i) {
    const s = SPOTS[i];
    $$(".pin", map).forEach((p, k) => p.setAttribute("aria-pressed", String(k === i)));
    whereInfo.innerHTML = "<h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + "</p><dl>" +
      "<div><dt>Glass we recommend</dt><dd>" + esc(s.glass) + "</dd></div>" +
      "<div><dt>Typical thickness</dt><dd>" + esc(s.thick) + "</dd></div></dl>" +
      '<a class="btn btn-solid btn-sm" href="#contact" data-service="' + esc(s.svc) + '">Get a quote for this</a>';
  }
  SPOTS.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "pin"; b.textContent = "+";
    b.style.left = s.x + "%"; b.style.top = s.y + "%";
    b.setAttribute("aria-label", s.title); b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => showSpot(i));
    map.appendChild(b);
  });
  showSpot(3);

  /* ---------- Strength test ---------- */
  const panes = { A: $("#brkA"), T: $("#brkT") };
  const ASPECT = .8; // pane width / height
  function addShard(host, pts, o) {
    const el = document.createElement("div");
    el.className = "shard " + (o.fall ? "fall" : "stay");
    el.style.clipPath = "polygon(" + pts.map(p => p[0].toFixed(2) + "% " + p[1].toFixed(2) + "%").join(",") + ")";
    const cx = clamp(pts.reduce((a, p) => a + p[0], 0) / pts.length, 0, 100), cy = clamp(pts.reduce((a, p) => a + p[1], 0) / pts.length, 0, 100);
    const st = el.style;
    st.setProperty("--cx", cx + "%"); st.setProperty("--cy", cy + "%"); el.dataset.cy = cy;
    st.setProperty("--a", rnd(.6, .95).toFixed(2));
    st.setProperty("--sx", rnd(-.8, .8).toFixed(2) + "px"); st.setProperty("--sy", rnd(-.8, .8).toFixed(2) + "px"); st.setProperty("--sr", rnd(-.5, .5).toFixed(2) + "deg");
    st.setProperty("--dx", o.dx.toFixed(1) + "px"); st.setProperty("--dy", o.dy.toFixed(1) + "px"); st.setProperty("--rot", o.rot.toFixed(1) + "deg");
    st.setProperty("--d", o.d.toFixed(2) + "s"); st.setProperty("--dur", o.dur.toFixed(2) + "s");
    host.appendChild(el);
  }
  function buildNormal(host) {
    host.innerHTML = "";
    const ix = 50, iy = 42, rays = 11, rings = [0, 8, 20, 42, 170], ang = [], rad = [];
    for (let i = 0; i < rays; i++) ang.push(i * 2 * Math.PI / rays + rnd(-.16, .16));
    rings.forEach((r, k) => { rad[k] = []; for (let i = 0; i < rays; i++) rad[k][i] = (k === 0 || k === rings.length - 1) ? r : r * rnd(.75, 1.3); });
    const P = (k, i) => { i %= rays; const a = ang[i], r = rad[k][i]; return [ix + r * Math.cos(a), iy + r * Math.sin(a) * ASPECT]; };
    for (let k = 0; k < rings.length - 1; k++) for (let i = 0; i < rays; i++) {
      const fall = k === 0 || (k === 1 && Math.random() < .35);
      addShard(host, [P(k, i), P(k, i + 1), P(k + 1, i + 1), P(k + 1, i)], fall
        ? { fall: true, dx: rnd(-14, 14), dy: rnd(150, 260), rot: rnd(-50, 50), d: rnd(0, .25), dur: rnd(.8, 1.1) }
        : { fall: false, dx: rnd(-4, 4), dy: rnd(0, 10), rot: rnd(-2.5, 2.5), d: rnd(.1, .4), dur: 1 });
    }
  }
  function buildToughened(host) {
    host.innerHTML = "";
    const cols = 13, rows = 16, cw = 100 / cols, ch = 100 / rows, ix = 50, iy = 42, V = [];
    for (let r = 0; r <= rows; r++) { V[r] = []; for (let c = 0; c <= cols; c++) {
      const edge = r === 0 || c === 0 || r === rows || c === cols;
      V[r][c] = [c * cw + (edge && (c === 0 || c === cols) ? 0 : rnd(-.38, .38) * cw), r * ch + (edge && (r === 0 || r === rows) ? 0 : rnd(-.38, .38) * ch)];
    } }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const pts = [V[r][c], V[r][c + 1], V[r + 1][c + 1], V[r + 1][c]];
      const mx = (c + .5) * cw, my = (r + .5) * ch, dist = Math.hypot(mx - ix, (my - iy) * ASPECT);
      addShard(host, pts, { fall: true, dx: rnd(-40, 40), dy: rnd(140, 320), rot: rnd(-130, 130), d: dist * .011 + rnd(0, .12), dur: rnd(.6, 1) });
    }
  }
  const result = { A: $("#brkAres"), T: $("#brkTres") };
  const idleText = "Press the button to find out.";
  let hitDone = false, timers = [];
  function brkBuild() { buildNormal($(".brk-shards", panes.A)); buildToughened($(".brk-shards", panes.T)); }
  function brkHit() {
    if (hitDone) return; hitDone = true;
    /* pieces fall to the bottom edge of the pane and pile up there */
    Object.values(panes).forEach(p => {
      const H = p.getBoundingClientRect().height;
      $$(".shard.fall", p).forEach(s => {
        const land = (100 - (+s.dataset.cy)) / 100 * H - rnd(2, 16);
        s.style.setProperty("--dy", Math.max(land, 0).toFixed(1) + "px");
        s.style.setProperty("--dx", rnd(-10, 10).toFixed(1) + "px");
        s.style.setProperty("--rot", rnd(-70, 70).toFixed(1) + "deg");
      });
    });
    Object.values(panes).forEach(p => p.classList.add("hit"));
    timers.push(setTimeout(() => Object.values(panes).forEach(p => p.classList.add("cracked")), 40));
    timers.push(setTimeout(() => Object.values(panes).forEach(p => p.classList.add("go")), reduce ? 40 : 520));
    timers.push(setTimeout(() => {
      result.A.textContent = "Breaks into long, sharp pieces that can cut.";
      result.T.textContent = "Crumbles into small, blunt pieces.";
    }, reduce ? 100 : 1100));
  }
  function brkReset() {
    timers.forEach(clearTimeout); timers = []; hitDone = false;
    Object.values(panes).forEach(p => p.classList.remove("hit", "cracked", "go"));
    result.A.textContent = idleText; result.T.textContent = idleText;
    brkBuild();
  }
  $("#brkGo").addEventListener("click", brkHit);
  $("#brkReset").addEventListener("click", brkReset);
  brkBuild();

  /* ---------- Contact select (built from the product list) ---------- */
  const cType = $("#cType");
  const services = [];
  $$("[data-service]").forEach(a => { if (a.closest(".rows") && !services.includes(a.dataset.service)) services.push(a.dataset.service); });
  services.concat(["Not sure, need advice"]).forEach(s => { const o = document.createElement("option"); o.value = o.textContent = s; cType.appendChild(o); });
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-service]");
    if (a && Array.from(cType.options).some(o => o.value === a.dataset.service)) cType.value = a.dataset.service;
  });

  /* ---------- Size check ---------- */
  const TOMM = { ft: 304.8, in: 25.4, mm: 1 };
  const UNIT = { ft: "ft", in: "in", mm: "mm" };
  const USE = {
    window: ["Window", "5 to 6 mm clear or tinted glass. Double-glazed (5 + 12 + 5 mm) if the room faces the sun or a busy road."],
    door: ["Door", "10 to 12 mm toughened glass."],
    shower: ["Shower enclosure", "8 to 12 mm toughened glass; 10 to 12 mm for frameless doors."],
    railing: ["Railing", "12 mm or thicker toughened glass, or laminated toughened glass for balconies."],
    partition: ["Partition", "10 to 12 mm toughened glass for offices; 8 to 10 mm for lighter use."],
    shopfront: ["Shopfront", "10 to 12 mm toughened or laminated glass; double-glazed units if the shop is air-conditioned."],
    table: ["Table top or shelf", "8 to 12 mm toughened glass with polished edges."],
    mirror: ["Mirror", "5 to 6 mm mirror glass with polished edges."]
  };
  const sW = $("#sW"), sH = $("#sH"), sU = $("#sU"), sQ = $("#sQ"), sUse = $("#sUse"), sSvg = $("#sSvg"), sOut = $("#sOut");
  const nf = n => { const s = (Math.round(n * 100) / 100).toString(); return s; };
  let sizeText = "";
  function drawSize(w, h, unit) {
    const W = 200, H = 170, pad = 30, k = Math.min((W - pad * 2) / w, (H - pad * 2) / h), rw = w * k, rh = h * k, x = (W - rw) / 2, y = (H - rh) / 2;
    sSvg.innerHTML = '<defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fd7d0"/><stop offset=".5" stop-color="#e3f5f2"/><stop offset="1" stop-color="#7cc3ba"/></linearGradient></defs>' +
      '<rect x="' + x + '" y="' + y + '" width="' + rw + '" height="' + rh + '" fill="url(#sg)" stroke="#1e7a6d" stroke-width="3" rx="2"/>' +
      '<path d="M' + x + " " + (y - 10) + "h" + rw + "M" + x + " " + (y - 15) + "v10M" + (x + rw) + " " + (y - 15) + 'v10" stroke="#4c6968" stroke-width="1.3" fill="none"/>' +
      '<text x="' + (x + rw / 2) + '" y="' + (y - 18) + '" text-anchor="middle" font-size="13" fill="#10292b" font-family="Instrument Sans, sans-serif">' + nf(+sW.value) + " " + UNIT[unit] + "</text>" +
      '<path d="M' + (x - 10) + " " + y + "v" + rh + "M" + (x - 15) + " " + y + "h10M" + (x - 15) + " " + (y + rh) + 'h10" stroke="#4c6968" stroke-width="1.3" fill="none"/>' +
      '<text transform="translate(' + (x - 18) + " " + (y + rh / 2) + ') rotate(-90)" text-anchor="middle" font-size="13" fill="#10292b" font-family="Instrument Sans, sans-serif">' + nf(+sH.value) + " " + UNIT[unit] + "</text>";
  }
  function calcSize() {
    const w = parseFloat(sW.value), h = parseFloat(sH.value), q = parseInt(sQ.value, 10), unit = sU.value, use = USE[sUse.value];
    if (!(w > 0 && h > 0 && q > 0)) { sSvg.innerHTML = ""; sOut.innerHTML = "Enter a width, height and number of pieces."; sizeText = ""; return; }
    const wmm = w * TOMM[unit], hmm = h * TOMM[unit], one = (wmm * hmm) / (304.8 * 304.8), total = one * q;
    drawSize(w, h, unit);
    const big = Math.max(wmm, hmm) > 2400;
    sOut.innerHTML = "<strong>" + nf(total) + " sq ft</strong>" + q + " piece" + (q > 1 ? "s" : "") + ", " + nf(w) + " × " + nf(h) + " " + UNIT[unit] +
      " (" + Math.round(wmm) + " × " + Math.round(hmm) + " mm)<br><br>" + esc(use[0]) + ": " + esc(use[1]) +
      (big ? '<small class="warn">This is a large pane. It needs thicker glass and special handling, so we confirm it on site.</small>' : "") +
      "<small>Typical guidance only. We confirm thickness and size on site.</small>";
    sizeText = use[0] + ", " + q + " piece" + (q > 1 ? "s" : "") + " of " + nf(w) + " x " + nf(h) + " " + UNIT[unit] + " (about " + nf(total) + " sq ft)";
  }
  [sW, sH, sU, sQ, sUse].forEach(el => { el.addEventListener("input", calcSize); el.addEventListener("change", calcSize); });
  calcSize();
  $("#sSend").addEventListener("click", () => {
    if (!sizeText) { sOut.innerHTML = "Enter a width, height and number of pieces first."; return; }
    window.open(waLink("Hello " + CONFIG.businessName + ", I need glass for: " + sizeText + ". Please quote."), "_blank", "noopener");
  });

  /* ---------- Process timeline fills as you scroll ---------- */
  const tl = $("#tl"), steps = $$("li", tl);
  function tlUpdate() {
    const r = tl.getBoundingClientRect(), vh = window.innerHeight;
    const p = clamp((vh * .62 - r.top) / r.height, 0, 1);
    tl.style.setProperty("--p", (p * 100).toFixed(1));
    steps.forEach(li => li.classList.toggle("on", (li.offsetTop + 10) / r.height <= p + .001));
  }
  window.addEventListener("scroll", tlUpdate, { passive: true });
  window.addEventListener("resize", tlUpdate);
  tlUpdate();

  /* ---------- FAQ: one open at a time ---------- */
  const fq = $$(".faq details");
  fq.forEach(d => d.addEventListener("toggle", () => { if (d.open) fq.forEach(o => { if (o !== d) o.open = false; }); }));

  /* ---------- Contact form to WhatsApp ---------- */
  const err = $("#cErr");
  $("#cPhone").addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10); });
  $("#cForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#cName").value.trim(), phone = $("#cPhone").value.replace(/\D/g, ""), type = cType.value, area = $("#cArea").value.trim(), msg = $("#cMsg").value.trim();
    if (name.length < 2) { err.textContent = "Enter your name."; $("#cName").focus(); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { err.textContent = "Enter a valid 10-digit mobile number."; $("#cPhone").focus(); return; }
    err.textContent = "";
    window.open(waLink("Hello " + CONFIG.businessName + ",\nName: " + name + "\nMobile: " + phone + "\nNeed: " + type +
      (area ? "\nArea: " + area : "") + (msg ? "\nDetails: " + msg : "") + "\nPlease arrange a free site visit."), "_blank", "noopener");
  });
})();
