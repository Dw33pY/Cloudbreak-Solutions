/* ==========================================================================
   CLOUDBREAK SOLUTIONS — script.js
   All interaction lives here. Each module is labelled with the element
   or behaviour it controls.
   ========================================================================== */

/* ====== QUICK SETTINGS — edit these, don't touch below ====== */
const CBS = {
  heroAnimation : true,   // rotating guilloché in page heroes — set false for a static rosette
  uvAutoRoam    : true,   // UV lamp patrols by itself until the visitor takes over
  uvRoamDelay   : 2600,   // ms of inactivity before the lamp resumes patrolling (higher = lazier)
  oviIdleSweep  : true,   // colour-shifting seal drifts on its own until hovered
  animateNumbers: true,   // count-up on the stat figures
  searchHotkey  : true,   // Ctrl/Cmd+K (or "/") opens the site search
  lbMaxZoom     : 5,      // lightbox maximum zoom (5 = 500%)
  lbStep        : 1.35,   // zoom step per click/scroll — higher = bigger jumps
};

/* ====== SEARCH INDEX — add or edit entries here =========================
   t = title shown in results      d = small description
   u = link (page + optional #anchor)   g = group label   k = keywords
   ======================================================================== */
const CBS_SEARCH = [
  // Pages
  { t:'Home',                    d:'Issue with confidence. Verify with certainty.',                              u:'index.html',        g:'Pages',   k:'home main landing hero' },
  { t:'About Cloudbreak',        d:'Who we are, our principle, and how we work in layers.',                      u:'about.html',        g:'Pages',   k:'about company story mission' },
  { t:'Services',                d:'The ten-discipline service register — design to verification.',              u:'services.html',     g:'Pages',   k:'services register offer engagement' },
  { t:'Security features',       d:'The specimen book — 15 features, the lab, techniques and inks.',             u:'features.html',     g:'Pages',   k:'features specimen book security' },
  { t:'Document samples',        d:'ID card and its five features, plus annotated certificates.',                u:'features.html#samples', g:'Pages', k:'samples gallery id certificate portfolio' },
  { t:'Contact',                 d:'Enquiry form, phone, email and the Westlands office.',                       u:'contact.html',      g:'Pages',   k:'contact enquiry form map office' },
  { t:'UV specimen lamp (demo)', d:'Drag the UV lamp across a live specimen certificate.',                       u:'index.html',        g:'Pages',   k:'uv lamp demo interactive bench' },
  // Services
  { t:'Secure document design & production', d:'Security decided at the sketch — layout, substrate, features together.', u:'services.html#svc-1',  g:'Services', k:'design production artwork layout substrate' },
  { t:'Document security features',          d:'The fifteen-feature library, ten or more per document.',          u:'services.html#svc-2',  g:'Services', k:'features library layers overt covert' },
  { t:'Document authentication & verification', d:'Checks for the eye, the lens and the machine.',               u:'services.html#svc-3',  g:'Services', k:'authentication verification machine checks' },
  { t:'Anti-counterfeiting solutions',       d:'Overt, covert and forensic layers that back each other up.',     u:'services.html#svc-4',  g:'Services', k:'counterfeit anti fraud forgery' },
  { t:'Security numbering & traceability',   d:'Every document linked to a record, end to end.',                 u:'services.html#svc-5',  g:'Services', k:'numbering serial traceability laser' },
  { t:'Tamper detection & document integrity', d:'Alterations that announce themselves.',                        u:'services.html#svc-6',  g:'Services', k:'tamper alteration integrity erase' },
  { t:'Customised security solutions',       d:'A feature stack shaped around the document\u2019s real threats.', u:'services.html#svc-7',  g:'Services', k:'custom tailored bespoke threats' },
  { t:'Security assessment & consultation',  d:'An honest audit of what you issue today.',                       u:'services.html#svc-8',  g:'Services', k:'assessment audit consultation review' },
  { t:'Document management & verification systems', d:'Security from the press to the process.',                 u:'services.html#svc-9',  g:'Services', k:'management systems issuance process' },
  { t:'Digital document verification',       d:'QR codes, signed data, machine checks against the record.',      u:'services.html#svc-10', g:'Services', k:'digital qr signed verification database' },
  // Features (the fifteen)
  { t:'Advanced watermarks',        d:'Multi-tone and true-tone watermarks integrated into the paper.',   u:'features.html#f-01', g:'Features', k:'watermark paper true-tone substrate' },
  { t:'Security paper',             d:'Unique fibres, textures and watermarks in the substrate.',        u:'features.html#f-02', g:'Features', k:'paper substrate fibres texture' },
  { t:'Embossed text',              d:'Raised lettering verified by touch.',                             u:'features.html#f-03', g:'Features', k:'emboss raised tactile touch' },
  { t:'Silver & gold foil',         d:'Metallic foil stamping for seals, logos and text.',               u:'features.html#f-04', g:'Features', k:'foil gold silver metallic stamp' },
  { t:'Invisible security (UV)',    d:'Marks and hidden images that appear only under UV light.',        u:'features.html#f-05', g:'Features', k:'uv ultraviolet invisible hidden covert' },
  { t:'Hard paper',                 d:'Durable stock that resists wear and copying.',                    u:'features.html#f-06', g:'Features', k:'hard durable wear stock' },
  { t:'Waterproof',                 d:'Water-resistant paper and ink.',                                  u:'features.html#f-07', g:'Features', k:'waterproof water resistant spill' },
  { t:'Micro text',                 d:'Verification text readable only under magnification.',            u:'features.html#f-08', g:'Features', k:'microtext micro tiny magnify lens' },
  { t:'Security ink',               d:'Inks that change colour, react, or resist chemicals.',            u:'features.html#f-09', g:'Features', k:'ink reactive chemical colour' },
  { t:'Invisible fibres',           d:'Fibres that glow under UV — able to hide images.',                u:'features.html#f-10', g:'Features', k:'fibres uv fluorescent hidden images' },
  { t:'Thermochromic ink',          d:'Heat-sensitive ink that reveals or hides detail.',                u:'features.html#f-11', g:'Features', k:'thermochromic heat temperature warm' },
  { t:'Gothic numbers',             d:'Stylised numbering that exposes alterations.',                    u:'features.html#f-12', g:'Features', k:'gothic numbering serial stylised' },
  { t:'Anticopy',                   d:'Patterns that defeat or expose copying and scanning.',            u:'features.html#f-13', g:'Features', k:'anticopy photocopy scan copy' },
  { t:'QR sounds',                  d:'QR codes carrying audio verification or embedded data.',          u:'features.html#f-14', g:'Features', k:'qr sounds audio code embedded' },
  { t:'Unique serial numbering',    d:'Sequential, randomised or encrypted numbering.',                  u:'features.html#f-15', g:'Features', k:'serial numbering sequential encrypted random' },
  // Printing techniques
  { t:'Guilloché security designs', d:'Mathematically generated geometric line work.',                   u:'features.html#tech-guilloche',     g:'Printing', k:'guilloche geometric pattern lines borders' },
  { t:'Watermarking technique',     d:'Visible or invisible marks supporting authentication.',           u:'features.html#tech-watermarking',  g:'Printing', k:'watermark marks authentication' },
  { t:'Microprinting technique',    d:'Detail too fine for copiers to resolve.',                         u:'features.html#tech-microprinting', g:'Printing', k:'microprinting small text magnification' },
  { t:'Split-duct (rainbow) printing', d:'Smooth multi-ink colour transitions in a single pass.',        u:'features.html#tech-splitduct',     g:'Printing', k:'split duct rainbow colour transition' },
  // Inks
  { t:'UV printing ink',        d:'Features that appear only under ultraviolet light.',        u:'features.html#ink-uv',             g:'Inks', k:'uv ultraviolet ink hidden' },
  { t:'Thermochromic ink',      d:'Changes appearance with temperature.',                     u:'features.html#ink-thermochromic',  g:'Inks', k:'thermochromic heat ink' },
  { t:'Magnetic ink',           d:'Ferromagnetic, readable by sensors — the basis of MICR.',  u:'features.html#ink-magnetic',       g:'Inks', k:'magnetic micr sensor banking' },
  { t:'Optically variable ink (OVI)', d:'Colour shifts with the viewing angle.',              u:'features.html#ink-ovi',            g:'Inks', k:'ovi optically variable colour shift' },
  { t:'Coin-reactive ink',      d:'Reveals hidden features under heat, light or chemicals.',  u:'features.html#ink-coin',           g:'Inks', k:'coin reactive friction reveal' },
  // Verification extras
  { t:'Security holograms',     d:'3D images with movement, depth and colour-shift.',        u:'features.html#holograms', g:'Verification', k:'hologram 3d holographic' },
  { t:'Foiling',                d:'Hot-stamp, cold and holographic foil seals.',             u:'features.html#holograms', g:'Verification', k:'foiling foil hot stamp metallic' },
  { t:'Barcodes & QR codes',    d:'Machine-readable codes for verification and tracking.',   u:'features.html#codes',     g:'Verification', k:'barcode qr code 1d 2d data matrix' },
  { t:'Security numbering systems', d:'Laser, inkjet and dot-matrix numbering schemes.',     u:'features.html#codes',     g:'Verification', k:'numbering laser inkjet dot matrix serial' },
  // Contact
  { t:'Phone — +254 722 886 443',                d:'Call Cloudbreak Solutions.',                u:'tel:+254722886443',                        g:'Contact', k:'phone call number mobile' },
  { t:'Email — Mibrahim@cloudbreak-solutions.com', d:'Write to us directly.',                 u:'mailto:Mibrahim@cloudbreak-solutions.com', g:'Contact', k:'email mail write' },
  { t:'Office — Orbit Place, Westlands, Nairobi', d:'7th Floor, Ring Road Westlands.',        u:'contact.html',                              g:'Contact', k:'office address location westlands nairobi map' },
];
/* ============================================================ */

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;  // reduced-motion preference — disables loops & auto-demo
const clampN = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- 1. Header: scrolled shadow + mobile overlay menu ---------- */
function initHeader() {
  const hdr = $('.hdr');
  if (hdr) {
    const onScroll = () => hdr.classList.toggle('scrolled', scrollY > 30);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const tog = $('.nav-toggle'), mnav = $('#mnav');
  if (!tog || !mnav) return;
  const set = open => {  // opens/closes the mobile overlay, locks page scroll
    tog.setAttribute('aria-expanded', String(open));
    tog.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.classList.toggle('open', open);
    mnav.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('lock', open);
  };
  tog.addEventListener('click', () => set(tog.getAttribute('aria-expanded') !== 'true'));
  $$('a', mnav).forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => {  // Esc closes the menu
    if (e.key === 'Escape' && mnav.classList.contains('open')) { set(false); tog.focus(); }
  });
}

/* ---------- 2. Guilloché engine (rosettes + wave strips) ---------- */
function rosetteCanvas(px, o = {}) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = px;
  const x = cv.getContext('2d'), c = px / 2;
  const R = c * (o.scale || .92), layers = o.layers || 30, n = o.n || 9, m = o.m || 1, step = o.phase || .055;
  x.lineWidth = o.lw || .7; x.lineJoin = 'round';
  const pal = o.ink === 'light'
    ? ['rgba(31,94,151,.55)', 'rgba(34,49,100,.6)']
    : ['rgba(42,126,193,.55)', 'rgba(200,226,247,.42)'];
  for (let i = 0; i < layers; i++) {
    x.strokeStyle = i % 6 === 0 ? pal[1] : pal[0];
    const p = i * step;
    x.beginPath();
    for (let a = 0; a <= 360; a += 2) {
      const t = a * Math.PI / 180;
      const X = R * .58 * Math.cos(m * t + p) + R * .42 * Math.cos(n * t);
      const Y = R * .58 * Math.sin(m * t + p) + R * .42 * Math.sin(n * t);
      a === 0 ? x.moveTo(X, Y) : x.lineTo(X, Y);
    }
    x.closePath(); x.stroke();
  }
  return cv;
}
function drawStrip(cv) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  cv.width = w * dpr; cv.height = h * dpr;
  const x = cv.getContext('2d');
  const col = cv.dataset.ink === 'light' ? 'rgba(31,94,151,.55)' : 'rgba(125,185,232,.5)';
  const waves = [{f:8,p:0,s:1},{f:11,p:1.9,s:-1},{f:14,p:3.6,s:1},{f:17,p:5.2,s:-1}];
  x.lineWidth = .8 * dpr;
  waves.forEach(wv => {
    x.beginPath();
    for (let i = 0; i <= cv.width; i += 4) {
      const y = h / 2 + wv.s * (h * .27) * Math.sin((i / cv.width) * wv.f * 2 * Math.PI + wv.p);
      i === 0 ? x.moveTo(i, y) : x.lineTo(i, y);
    }
    x.strokeStyle = col; x.stroke();
  });
  x.strokeStyle = cv.dataset.ink === 'light' ? 'rgba(34,49,100,.35)' : 'rgba(200,226,247,.35)';
  x.lineWidth = .6 * dpr;
  x.beginPath(); x.moveTo(0, h / 2); x.lineTo(cv.width, h / 2); x.stroke();
}
function drawStatic(cv) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  if (cv.dataset.guilloche === 'rosette') {
    const s = cv.clientWidth; if (!s) return;
    cv.width = s * dpr; cv.height = s * dpr;
    cv.getContext('2d').drawImage(rosetteCanvas(s * dpr, { layers: 30, lw: .7 * dpr, ink: cv.dataset.ink }), 0, 0);
  } else if (cv.dataset.guilloche === 'strip') {
    drawStrip(cv);
  }
}
function initStatics() { $$('[data-guilloche]').forEach(cv => { if (cv.dataset.guilloche !== 'hero') drawStatic(cv); }); }

let heroAPI = null;
function initHero() {
  const cv = $('[data-guilloche="hero"]');
  if (!cv) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const animate = !RM && CBS.heroAnimation;
  let base, base2, raf = null, run = false, mx = 0, my = 0, cx = 0, cy = 0;
  function build() {
    const s = Math.max(380, cv.clientWidth || 600);
    cv.width = s * dpr; cv.height = s * dpr;
    base  = rosetteCanvas(s * dpr,       { layers: 38, lw: .62 * dpr });
    base2 = rosetteCanvas(s * dpr * .58, { layers: 26, n: 13, lw: .55 * dpr });
    if (!animate) paint(0.6);
  }
  function paint(t) {
    const x = cv.getContext('2d');
    x.clearRect(0, 0, cv.width, cv.height);
    cx += (mx - cx) * .045; cy += (my - cy) * .045;
    x.save();
    x.translate(cv.width / 2 + cx * 36 * dpr, cv.height / 2 + cy * 36 * dpr);
    x.rotate(t * .05);  x.drawImage(base,  -base.width  / 2, -base.height  / 2);
    x.rotate(-t * .14); x.drawImage(base2, -base2.width / 2, -base2.height / 2);
    x.restore();
  }
  if (animate) {
    const frame = ts => { if (!run) { raf = null; return; } paint(ts / 1000); raf = requestAnimationFrame(frame); };
    const start = () => { if (!raf) { run = true; raf = requestAnimationFrame(frame); } };
    const stop  = () => { run = false; };
    new IntersectionObserver(en => en[0].isIntersecting ? start() : stop(), { threshold: .05 }).observe(cv);
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  }
  build();
  heroAPI = { rebuild: () => { build(); if (!animate) paint(0.6); } };
}
let rzT;
addEventListener('resize', () => {
  clearTimeout(rzT);
  rzT = setTimeout(() => { initStatics(); heroAPI && heroAPI.rebuild(); }, 200);
});

/* ---------- 3. Headline word-split (masked rise reveal) ---------- */
function initSplit() {
  $$('[data-split]').forEach(el => {
    const txt = el.textContent.trim();
    el.setAttribute('aria-label', txt);
    el.innerHTML = txt.split(/\s+/).map((w, i) =>
      `<span class="wm" aria-hidden="true"><span class="wi" style="--i:${i}">${w}</span></span>`).join(' ');
  });
}

/* ---------- 4. Scroll reveals ---------- */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .16, rootMargin: '0px 0px -40px 0px' });
  $$('.rv, .split').forEach(el => io.observe(el));
}

/* ---------- 5. Stat count-up ---------- */
function initCount() {
  $$('[data-count]').forEach(el => {
    const end = parseFloat(el.dataset.count);
    const done = () => { el.textContent = Math.round(end); };
    if (RM || !CBS.animateNumbers) { done(); return; }
    const io = new IntersectionObserver(en => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), D = 1200;  /* count duration — higher = slower */
      const step = n => {
        const p = Math.min(1, (n - t0) / D), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * e);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: .4 });
    io.observe(el);
  });
}

/* ---------- 6. Marquee — duplicate the group once for a seamless loop ---------- */
function initMQ() {
  $$('[data-mq]').forEach(track => {
    const g = track.firstElementChild;
    if (!g) return;
    const clone = g.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
}

/* ---------- 7. UV lamp bench ---------- */
function initBench() {
  const bench = $('.uv-bench');
  if (!bench) return;
  const cert = $('.cert', bench), lampBtn = $('.lamp', bench);
  let on = !RM && CBS.uvAutoRoam;
  let px = null, py = null, lastUser = 0, visible = false, raf = null;
  const apply = () => { cert.style.setProperty('--tx', px + 'px'); cert.style.setProperty('--ty', py + 'px'); };
  const roam = now => {
    const r = cert.getBoundingClientRect();
    px = r.width  * (.5 + .36 * Math.cos(now / 1700));
    py = r.height * (.5 + .30 * Math.sin(now / 1150));
    apply();
  };
  const loop = now => {
    if (on && visible) {
      if (!RM && CBS.uvAutoRoam && now - lastUser > CBS.uvRoamDelay) roam(now);
      raf = requestAnimationFrame(loop);
    } else raf = null;
  };
  const wake = () => { if (!raf && on) raf = requestAnimationFrame(loop); };
  const point = e => {
    if (!on) return;
    const r = cert.getBoundingClientRect();
    px = clampN(e.clientX - r.left, -26, r.width + 26);
    py = clampN(e.clientY - r.top,  -26, r.height + 26);
    lastUser = performance.now(); apply(); wake();
  };
  bench.addEventListener('pointermove', point);
  bench.addEventListener('pointerdown', point);
  bench.addEventListener('pointerleave', () => { lastUser = performance.now(); });
  const setLamp = v => {
    on = v;
    cert.classList.toggle('lamp-on', v);
    if (lampBtn) lampBtn.setAttribute('aria-pressed', String(v));
    if (v) wake();
  };
  if (lampBtn) lampBtn.addEventListener('click', () => setLamp(!on));
  setLamp(on);
  bench.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLamp(!on); return; }
    if (!on || !e.key.startsWith('Arrow')) return;
    e.preventDefault();
    const r = cert.getBoundingClientRect(), st = 26;
    if (px === null) { px = r.width / 2; py = r.height / 2; }
    if (e.key === 'ArrowLeft')  px -= st;
    if (e.key === 'ArrowRight') px += st;
    if (e.key === 'ArrowUp')    py -= st;
    if (e.key === 'ArrowDown')  py += st;
    px = clampN(px, -20, r.width + 20); py = clampN(py, -20, r.height + 20);
    lastUser = performance.now(); apply(); wake();
  });
  new IntersectionObserver(en => { visible = en[0].isIntersecting; if (visible) wake(); }, { threshold: .12 }).observe(bench);
}

/* ---------- 8. Thermochromic chip — press & hold to warm ---------- */
function initThermo() {
  $$('[data-thermo]').forEach(chip => {
    const temp = $('.thermo-temp', chip);
    let holding = false, heat = 22, raf = null;
    const render = () => { if (temp) temp.textContent = heat.toFixed(1) + '°C'; };
    const loop = () => {
      const tgt = holding ? 41 : 22;
      heat += (tgt - heat) * (holding ? .06 : .015);   // warms fast, cools slow — like the real ink
      render();
      if (Math.abs(tgt - heat) > .05) raf = requestAnimationFrame(loop);
      else { heat = tgt; render(); raf = null; }
    };
    const set = v => {
      if (v === holding) return;
      holding = v; chip.classList.toggle('hot', v);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    chip.addEventListener('pointerdown', e => { set(true); chip.setPointerCapture && chip.setPointerCapture(e.pointerId); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => chip.addEventListener(ev, () => set(false)));
    chip.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); set(true); } });
    chip.addEventListener('keyup',   e => { if (e.key === 'Enter' || e.key === ' ') set(false); });
  });
}

/* ---------- 9. Optically variable ink chip ---------- */
function initOvi() {
  $$('[data-ovi]').forEach(chip => {
    const deg = $('.ovi-deg', chip);
    let hover = false;
    const set = h => {
      h = clampN(h, 58, 232);
      chip.style.setProperty('--h', h.toFixed(1));
      if (deg) deg.textContent = 'θ ' + Math.round((222 - h) / 152 * 70 + 10) + '°';
    };
    chip.addEventListener('pointermove', e => {
      hover = true;
      const r = chip.getBoundingClientRect();
      set(222 - 152 * clampN((e.clientX - r.left) / r.width, 0, 1));
    });
    chip.addEventListener('pointerleave', () => { hover = false; });
    chip.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); set(parseFloat(chip.style.getPropertyValue('--h') || 200) + 14); }
      if (e.key === 'ArrowRight') { e.preventDefault(); set(parseFloat(chip.style.getPropertyValue('--h') || 200) - 14); }
    });
    if (!RM && CBS.oviIdleSweep) {
      const loop = now => { if (!hover) set(190 - 66 * Math.sin(now / 1900)); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    } else set(180);
  });
}

/* ---------- 10. Services accordion + #svc-N deep links ---------- */
function initAccordion() {
  const btns = $$('.svc-btn');
  if (!btns.length) return;
  btns.forEach(btn => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.closest('.svc').classList.toggle('open', !open);
  }));
  const m = location.hash.match(/^#svc-(\d{1,2})$/);
  if (m) {
    const el = document.getElementById('svc-' + m[1]);
    if (el) {
      el.classList.add('open');
      const b = $('.svc-btn', el); if (b) b.setAttribute('aria-expanded', 'true');
      setTimeout(() => el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }), 150);
    }
  }
}

/* ---------- 11. Custom dropdown (contact) ---------- */
function initDD() {
  const dd = $('[data-dd]');
  if (!dd) return;
  const btn = $('.dd-btn', dd), list = $('.dd-list', dd), input = $('input[type=hidden]', dd);
  const opts = $$('li', list);
  let idx = Math.max(0, opts.findIndex(o => o.getAttribute('aria-selected') === 'true'));
  const setActive = i => {
    idx = clampN(i, 0, opts.length - 1);
    opts.forEach((o, j) => { o.classList.toggle('active', j === idx); o.id = 'dd-o' + j; });
    btn.setAttribute('aria-activedescendant', 'dd-o' + idx);
  };
  const close = () => { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  const openD = () => { dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); setActive(idx); };
  const choose = i => {
    setActive(i);
    opts.forEach((o, j) => o.setAttribute('aria-selected', String(j === i)));
    $('.dd-val', btn).textContent = opts[i].textContent;
    input.value = opts[i].textContent;
    close();
  };
  btn.addEventListener('click', () => dd.classList.contains('open') ? close() : openD());
  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); dd.classList.contains('open') ? setActive(idx + 1) : openD(); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); dd.classList.contains('open') ? setActive(idx - 1) : openD(); }
    // Enter chooses when open (Space is left to the native button click, which toggles)
    if (e.key === 'Enter' && dd.classList.contains('open')) { e.preventDefault(); choose(idx); }
    if (e.key === 'Escape') close();
  });
  list.addEventListener('click', e => { const li = e.target.closest('li'); if (li) choose(opts.indexOf(li)); });
  list.addEventListener('pointermove', e => { const li = e.target.closest('li'); if (li) setActive(opts.indexOf(li)); });
  document.addEventListener('click', e => { if (!dd.contains(e.target)) close(); });
}

/* ---------- 12. Contact form — validates, then hands the enquiry to the
   visitor's mail app. No backend yet, so nothing is faked. To go live for
   real: sign up at formspree.io (free), point the form at the endpoint
   they give you, and replace the mailto line below with a fetch(). ------ */
function initForm() {
  const form = $('#cForm');
  if (!form) return;
  const fields = [
    { el: $('#f-name'),  test: v => v.trim().length > 1,                         msg: 'Please tell us your name.' },
    { el: $('#f-email'), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'That email doesn\u2019t look right.' },
    { el: $('#f-msg'),   test: v => v.trim().length > 5,                         msg: 'Tell us a little about your documents.' },
  ];
  fields.forEach(f => {
    if (!f.el) return;
    f.el.addEventListener('input', () => {
      f.el.closest('.field').classList.remove('err');
      const err = $('#e-' + f.el.id.replace('f-', ''));
      if (err) err.hidden = true;
      f.el.removeAttribute('aria-invalid');
    });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (form.company_website.value) return;   // honeypot — bots dropped silently
    let firstBad = null;
    fields.forEach(f => {
      if (!f.el) return;
      const good = f.test(f.el.value);
      f.el.closest('.field').classList.toggle('err', !good);
      const err = $('#e-' + f.el.id.replace('f-', ''));
      if (err) err.hidden = good;
      f.el.setAttribute('aria-invalid', String(!good));
      if (!good && !firstBad) firstBad = f.el;
    });
    if (firstBad) { firstBad.focus(); return; }
    const to = 'Mibrahim@cloudbreak-solutions.com';
    const subject = 'Website enquiry — ' + (form.service.value || 'General enquiry');
    const body =
      'Name: ' + $('#f-name').value.trim() +
      '\nOrganisation: ' + ($('#f-org').value.trim() || '—') +
      '\nEmail: ' + $('#f-email').value.trim() +
      '\nPhone: ' + ($('#f-phone').value.trim() || '—') +
      '\nService: ' + (form.service.value || 'General enquiry') +
      '\n\n' + $('#f-msg').value.trim();
    location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
}

/* ---------- 13. Footer year ---------- */
function initYear() { $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear()); }

/* ---------- 14. Smart image fallbacks -----------------------------------
   Chain per image: .jpg → same name .png → data-srcfb file → picsum
   placeholder (data-fb="seed/width/height") → hide (data-err="hide").
   Means: your images can be JPG or PNG with either extension. ------------ */
function initFallback() {
  const swap = im => {
    const st = +(im.dataset.fbStage || 0);
    if (st === 0 && /\/images\/.*\.jpg(\?|$)/i.test(im.src)) {          // 1st retry: same file as .png
      im.dataset.fbStage = 1; im.src = im.src.replace(/\.jpg(\?|$)/i, '.png$1'); return;
    }
    if (st <= 1 && im.dataset.srcfb) {                                    // 2nd: alternate local file
      im.dataset.fbStage = 2; im.src = im.dataset.srcfb; return;
    }
    if (st <= 2 && im.dataset.fb) {                                       // 3rd: placeholder photo
      im.dataset.fbStage = 3; im.src = 'https://picsum.photos/seed/' + im.dataset.fb + '.jpg'; return;
    }
    if (st <= 3 && im.dataset.err === 'hide') { im.dataset.fbStage = 4; im.style.display = 'none'; }
  };
  addEventListener('error', e => { if (e.target && e.target.tagName === 'IMG') swap(e.target); }, true); // catches failures after load
  $$('img').forEach(im => { if (im.complete && im.naturalWidth === 0 && im.src) swap(im); });            // sweep: failures before this script ran
}

/* ---------- 15. Site search — header button, overlay, autocomplete ------
   Ctrl/Cmd+K (or "/") opens. Index lives in CBS_SEARCH above. ----------- */
function initSearch() {
  const hdrIn = $('.hdr-in');
  if (!hdrIn) return;
  // Header button (injected so no page needs editing)
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'hdr-search';
  btn.setAttribute('aria-label', 'Search the site');
  btn.title = 'Search (Ctrl+K)';
  btn.innerHTML = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>';
  const anchor = $('.hdr-cta', hdrIn) || $('.nav-toggle', hdrIn);
  anchor ? hdrIn.insertBefore(btn, anchor) : hdrIn.appendChild(btn);

  // Overlay (injected once)
  const ov = document.createElement('div');
  ov.className = 'sr'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Site search');
  ov.innerHTML = `
    <div class="sr-back" data-sr-close></div>
    <div class="sr-panel">
      <span class="corners" aria-hidden="true"></span>
      <img class="sr-logo" src="images/logo.png" alt="" data-err="hide">
      <div class="sr-top">
        <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <input id="srQ" type="search" placeholder="Search pages, services, features…" autocomplete="off" spellcheck="false"
          role="combobox" aria-expanded="true" aria-controls="srList" aria-autocomplete="list">
                <button class="sr-close" type="button" aria-label="Close search"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      </div>
      <ul class="sr-list" id="srList" role="listbox" aria-label="Search results"></ul>
      <div class="sr-foot mono"><span>&uarr;&darr; NAVIGATE</span><span>ENTER OPEN</span><span>ESC CLOSE</span><span class="sr-k">CTRL&middot;K</span></div>
    </div>`;
  document.body.appendChild(ov);
  const q = $('#srQ', ov), list = $('#srList', ov);
  let items = [], sel = -1, lastFocus = null;

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const hl = (title, query) => {   // highlight the matched part of the title
    if (!query) return esc(title);
    const i = title.toLowerCase().indexOf(query.toLowerCase());
    if (i < 0) return esc(title);
    return esc(title.slice(0, i)) + '<mark>' + esc(title.slice(i, i + query.length)) + '</mark>' + esc(title.slice(i + query.length));
  };
  function render(query) {
    const nq = norm(query);
    let res;
    if (!nq) res = CBS_SEARCH.slice(0, 5);   // empty state: quick links
    else res = CBS_SEARCH.map(e => {
      const t = norm(e.t), k = norm(e.k || ''), d = norm(e.d);
      let s = -1;
      if (t.startsWith(nq)) s = 0; else if (t.includes(nq)) s = 1; else if (k.includes(nq)) s = 2; else if (d.includes(nq)) s = 3;
      return s < 0 ? null : Object.assign({}, e, { _s: s });
    }).filter(Boolean).sort((a, b) => a._s - b._s).slice(0, 12);
    items = res; sel = res.length ? 0 : -1;
    if (!res.length) {
      list.innerHTML = '<li class="sr-empty">NO MATCHES — TRY &ldquo;UV&rdquo;, &ldquo;FOIL&rdquo;, &ldquo;NUMBERING&rdquo;, &ldquo;HOLOGRAM&rdquo;</li>';
      q.removeAttribute('aria-activedescendant'); return;
    }
    const groups = [...new Set(res.map(e => e.g))];
    let html = '';
    groups.forEach(g => {
      html += '<li class="sr-group" role="presentation">' + esc(g) + '</li>';
      res.forEach((e, i) => {
        if (e.g !== g) return;
        html += '<li class="sr-item" role="option" aria-selected="false" id="sr-o' + i + '" data-i="' + i + '"><a href="' + e.u + '">' +
          '<span><span class="sr-t">' + hl(e.t, query) + '</span><span class="sr-d">' + esc(e.d) + '</span></span>' +
          '<span class="sr-g">' + esc(e.g) + '</span>' +
          '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a></li>';
      });
    });
    list.innerHTML = html; markSel();
  }
  function markSel() {
    $$('.sr-item', list).forEach(li => {
      const on = +li.dataset.i === sel;
      li.classList.toggle('sel', on);
      li.setAttribute('aria-selected', String(on));
    });
    if (sel >= 0) q.setAttribute('aria-activedescendant', 'sr-o' + sel);
    else q.removeAttribute('aria-activedescendant');
  }
  const open = () => {
    lastFocus = document.activeElement;
    ov.classList.add('open'); document.body.classList.add('sr-open');
    q.value = ''; render(''); setTimeout(() => q.focus(), 30);
  };
  const close = () => {
    ov.classList.remove('open'); document.body.classList.remove('sr-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  btn.addEventListener('click', open);
  $('[data-sr-close]', ov).addEventListener('click', close);
    $('.sr-close', ov).addEventListener('click', close);   // X button — the only visible exit on phones
  list.addEventListener('click', e => { if (e.target.closest('a')) close(); });   // navigating closes
  list.addEventListener('pointerover', e => { const li = e.target.closest('.sr-item'); if (li) { sel = +li.dataset.i; markSel(); } });
  q.addEventListener('input', () => render(q.value.trim()));
  q.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      markSel();
      const el = $('#sr-o' + sel, ov); if (el) el.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') { e.preventDefault(); if (items[sel]) location.href = items[sel].u; }
    else if (e.key === 'Escape') close();
  });
  if (CBS.searchHotkey) {
    addEventListener('keydown', e => {   // Ctrl/Cmd+K opens; "/" opens when not typing
      if (ov.classList.contains('open')) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
      else if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
    });
  }
}

/* ---------- 16. Lightbox — zoom, pan, pinch, rotate ----------------------
   Any <img data-lb> opens here. Wheel/double-click zoom, drag to pan,
   pinch on touch, R rotates, Esc closes. ---------------------------------- */
function initLightbox() {
  const lb = document.createElement('div');
  lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = `
    <img class="lb-img" alt="">
    <p class="lb-cap mono"></p>
    <button class="lb-btn lb-close" type="button" data-lb-act="close" aria-label="Close viewer"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    <div class="lb-bar">
      <button class="lb-btn" type="button" data-lb-act="in" aria-label="Zoom in"><svg class="ic" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
      <button class="lb-btn" type="button" data-lb-act="out" aria-label="Zoom out"><svg class="ic" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>
      <button class="lb-btn" type="button" data-lb-act="rot" aria-label="Rotate 90 degrees"><svg class="ic" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/></svg></button>
      <button class="lb-btn" type="button" data-lb-act="reset" aria-label="Reset to actual size"><svg class="ic" viewBox="0 0 24 24"><path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"/></svg></button>
    </div>
    <span class="lb-hint mono">SCROLL TO ZOOM &middot; DRAG TO PAN &middot; DOUBLE-CLICK TO ENLARGE &middot; R ROTATES</span>`;
  document.body.appendChild(lb);
  const img = $('.lb-img', lb), cap = $('.lb-cap', lb);
  let s = 1, tx = 0, ty = 0, r = 0, open = false, opener = null;
  const apply = () => {
    img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ') rotate(' + r + 'deg)';
    img.classList.toggle('zoomed', s > 1);
  };
  const zoomTo = v => { s = clampN(v, 1, CBS.lbMaxZoom); if (s === 1) { tx = 0; ty = 0; } apply(); };
  const openLb = im => {
    const fig = im.closest('figure');
    const figCap = fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : '';
    img.src = im.currentSrc || im.src;
    img.alt = im.alt || '';
    cap.textContent = (figCap || im.alt || '').trim();
    s = 1; tx = 0; ty = 0; r = 0; apply();
    opener = document.activeElement; open = true;
    lb.classList.add('open'); document.body.classList.add('lb-open');
    setTimeout(() => $('.lb-close', lb).focus(), 30);
  };
  const closeLb = () => {
    open = false; lb.classList.remove('open'); document.body.classList.remove('lb-open');
    if (opener && opener.focus) opener.focus();
  };
  document.addEventListener('click', e => {          // any [data-lb] image opens the viewer
    const im = e.target.closest('img[data-lb]');
    if (im) { e.preventDefault(); openLb(im); }
  });
  lb.addEventListener('click', e => {
    const b = e.target.closest('[data-lb-act]');
    if (b) {
      const a = b.dataset.lbAct;
      if (a === 'close') closeLb();
      else if (a === 'in') zoomTo(s * CBS.lbStep);
      else if (a === 'out') zoomTo(s / CBS.lbStep);
      else if (a === 'rot') { r = (r + 90) % 360; apply(); }
      else if (a === 'reset') { s = 1; tx = 0; ty = 0; r = 0; apply(); }
      return;
    }
    if (e.target === lb) closeLb();                  // backdrop click closes
  });
  lb.addEventListener('wheel', e => { if (!open) return; e.preventDefault(); zoomTo(s * (e.deltaY < 0 ? CBS.lbStep : 1 / CBS.lbStep)); }, { passive: false });
  img.addEventListener('dblclick', () => zoomTo(s > 1 ? 1 : 2.5));
  // Pan (1 pointer) + pinch zoom (2 pointers) — touch and mouse both covered
  const pts = new Map(); let pinchD = 0, pinchS = 1;
  img.addEventListener('pointerdown', e => {
    if (!open) return;
    img.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    img.classList.add('dragging');
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinchD = Math.hypot(a.x - b.x, a.y - b.y); pinchS = s; }
  });
  img.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    const p = pts.get(e.pointerId);
    if (pts.size === 1 && s > 1) { tx += e.clientX - p.x; ty += e.clientY - p.y; apply(); }
    p.x = e.clientX; p.y = e.clientY;
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchD > 0) zoomTo(pinchS * d / pinchD);
    }
  });
  const endPt = e => { pts.delete(e.pointerId); if (!pts.size) img.classList.remove('dragging'); };
  ['pointerup', 'pointercancel'].forEach(ev => img.addEventListener(ev, endPt));
  addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === '+' || e.key === '=') zoomTo(s * CBS.lbStep);
    else if (e.key === '-' || e.key === '_') zoomTo(s / CBS.lbStep);
    else if (e.key === '0') { s = 1; tx = 0; ty = 0; r = 0; apply(); }
    else if (e.key.toLowerCase() === 'r') { r = (r + 90) % 360; apply(); }
    else if (e.key.startsWith('Arrow') && s > 1) {
      e.preventDefault();
      if (e.key === 'ArrowLeft')  tx -= 60;
      if (e.key === 'ArrowRight') tx += 60;
      if (e.key === 'ArrowUp')    ty -= 60;
      if (e.key === 'ArrowDown')  ty += 60;
      apply();
    } else if (e.key === 'Tab') {   // keep focus inside the viewer
      const f = $$('.lb-btn', lb); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ---------- v4: microtext chip — tap toggles magnification on touch ---------- */
function initMicro(){
  $$('.chip-micro').forEach(ch => ch.addEventListener('click', () => ch.classList.toggle('zoomed')));
}

/* ---------- v4: image loading — async decode + gentle fade-in ---------- */
function initImgFade(){
  $$('img').forEach(im => { im.decoding = 'async'; });   // decode off the main thread — pages feel snappier
  $$('img').forEach(im => {
    if (im.complete && im.naturalWidth > 0) return;      // already visible (cached) — skip
    im.classList.add('ld');
    im.addEventListener('load', () => im.classList.add('ld-in'));
  });
}

/* ---------- Boot ---------- */
initFallback();
initHeader();
initSplit();
initReveal();
initCount();
initMQ();
initHero();
initStatics();
initBench();
initThermo();
initOvi();
initAccordion();
initDD();
initForm();
initYear();
initSearch();
initLightbox();
initMicro();
initImgFade();