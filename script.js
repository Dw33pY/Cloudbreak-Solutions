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
};
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
// Parametric rosette: layered closed curves with a per-layer phase shift —
// the same family of curves used in real security printing.
function rosetteCanvas(px, o = {}) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = px;
  const x = cv.getContext('2d'), c = px / 2;
  const R = c * (o.scale || .92), layers = o.layers || 30, n = o.n || 9, m = o.m || 1, step = o.phase || .055;
  x.lineWidth = o.lw || .7; x.lineJoin = 'round';
  const pal = o.ink === 'light'                       /* 'light' = strokes for white paper */
    ? ['rgba(31,94,151,.55)', 'rgba(34,49,100,.6)']
    : ['rgba(42,126,193,.55)', 'rgba(200,226,247,.42)'];  /* default = strokes for navy */
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

// Wave strip: crossing sine curves — the guilloché border bands on the certificate.
function drawStrip(cv) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const w = cv.clientWidth, h = cv.clientHeight;
  if (!w || !h) return;
  cv.width = w * dpr; cv.height = h * dpr;
  const x = cv.getContext('2d');
  const col = cv.dataset.ink === 'light' ? 'rgba(31,94,151,.55)' : 'rgba(125,185,232,.5)';
  const waves = [{f:8,p:0,s:1},{f:11,p:1.9,s:-1},{f:14,p:3.6,s:1},{f:17,p:5.2,s:-1}];
  x.lineWidth = .8 * dpr;
  waves.forEach(wv => {           // four sine curves of rising frequency, alternating direction
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

// Static decorations: [data-guilloche="rosette"] and [data-guilloche="strip"]
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

// Hero rosette: pre-rendered once, then rotated + pointer-parallaxed per frame.
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
    base  = rosetteCanvas(s * dpr,        { layers: 38, lw: .62 * dpr });
    base2 = rosetteCanvas(s * dpr * .58,  { layers: 26, n: 13, lw: .55 * dpr });
    if (!animate) paint(0.6);   // static render for reduced motion / heroAnimation:false
  }
  function paint(t) {
    const x = cv.getContext('2d');
    x.clearRect(0, 0, cv.width, cv.height);
    cx += (mx - cx) * .045; cy += (my - cy) * .045;      // eased pointer parallax
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

// Re-render everything on resize (debounced) so canvases stay crisp.
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

/* ---------- 4. Scroll reveals (fade-rise, staggered via --d) ---------- */
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

/* ---------- 7. UV lamp bench (drag / arrow keys / Enter toggle / auto-patrol) ---------- */
function initBench() {
  const bench = $('.uv-bench');
  if (!bench) return;
  const cert = $('.cert', bench), lampBtn = $('.lamp', bench);
  let on = !RM && CBS.uvAutoRoam;      // reduced-motion visitors start with the lamp OFF (button still works)
  let px = null, py = null, lastUser = 0, visible = false, raf = null;

  const apply = () => { cert.style.setProperty('--tx', px + 'px'); cert.style.setProperty('--ty', py + 'px'); };
  const roam = now => {   // idle patrol: a slow Lissajous sweep across the certificate
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

  const point = e => {   // pointer (mouse or touch) → lamp position in certificate coords
    if (!on) return;
    const r = cert.getBoundingClientRect();
    px = clampN(e.clientX - r.left, -26, r.width + 26);
    py = clampN(e.clientY - r.top,  -26, r.height + 26);
    lastUser = performance.now(); apply(); wake();
  };
  bench.addEventListener('pointermove', point);
  bench.addEventListener('pointerdown', point);   // taps reposition the lamp on mobile
  bench.addEventListener('pointerleave', () => { lastUser = performance.now(); });

  const setLamp = v => {
    on = v;
    cert.classList.toggle('lamp-on', v);
    if (lampBtn) lampBtn.setAttribute('aria-pressed', String(v));
    if (v) wake();
  };
  if (lampBtn) lampBtn.addEventListener('click', () => setLamp(!on));
  setLamp(on);

  bench.addEventListener('keydown', e => {   // keyboard control: arrows move, Enter/Space toggles
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

/* ---------- 8. Thermochromic chip — press & hold to warm, release to cool ---------- */
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

/* ---------- 9. Optically variable ink chip — hue follows the pointer (viewing angle) ---------- */
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
    chip.addEventListener('keydown', e => {  // arrows nudge the viewing angle for keyboard users
      if (e.key === 'ArrowLeft')  { e.preventDefault(); set(parseFloat(chip.style.getPropertyValue('--h') || 200) + 14); }
      if (e.key === 'ArrowRight') { e.preventDefault(); set(parseFloat(chip.style.getPropertyValue('--h') || 200) - 14); }
    });
    if (!RM && CBS.oviIdleSweep) {            // idle drift until hovered — sells the colour-shift on its own
      const loop = now => { if (!hover) set(190 - 66 * Math.sin(now / 1900)); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    } else set(180);
  });
}

/* ---------- 10. Services accordion + #svc-N deep links ---------- */
function initAccordion() {
  const btns = $$('.svc-btn');
  if (!btns.length) return;
  btns.forEach(btn => btn.addEventListener('click', () => {   // toggles one register row open/closed
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.closest('.svc').classList.toggle('open', !open);
  }));
  const m = location.hash.match(/^#svc-(\d{1,2})$/);   // landing on services.html#svc-4 opens & scrolls to it
  if (m) {
    const el = document.getElementById('svc-' + m[1]);
    if (el) {
      el.classList.add('open');
      const b = $('.svc-btn', el); if (b) b.setAttribute('aria-expanded', 'true');
      setTimeout(() => el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }), 150);
    }
  }
}

/* ---------- 11. Custom dropdown (contact — service of interest) ---------- */
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
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dd.classList.contains('open') ? choose(idx) : openD(); }
    if (e.key === 'Escape') close();
  });
  list.addEventListener('click', e => { const li = e.target.closest('li'); if (li) choose(opts.indexOf(li)); });
  list.addEventListener('pointermove', e => { const li = e.target.closest('li'); if (li) setActive(opts.indexOf(li)); });
  document.addEventListener('click', e => { if (!dd.contains(e.target)) close(); });  // click-outside closes
}

/* ---------- 12. Contact form — validation, honeypot, local success state ---------- */
function initForm() {
  const form = $('#cForm');
  if (!form) return;
  const ok = $('#formOk');
  const fields = [
    { el: $('#f-name'),  test: v => v.trim().length > 1,                                   msg: 'Please tell us your name.' },
    { el: $('#f-email'), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),            msg: 'That email doesn\u2019t look right.' },
    { el: $('#f-msg'),   test: v => v.trim().length > 5,                                   msg: 'Tell us a little about your documents.' },
  ];
  fields.forEach(f => {   // live-clear errors as the visitor types
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
    if (form.company_website.value) return;   // honeypot filled → bot: silently drop the submission
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
    /*
      IMPORTANT — BEFORE LAUNCH:
      This success state is local only; nothing is sent anywhere yet.
      Wire the form to a backend or form service (Netlify Forms, Formspree, etc.)
      right here — e.g. fetch(yourEndpoint, {method:'POST', body:new FormData(form)})
      — and only show the success panel after a real response.
    */
    $('#okRef').textContent = 'CBS-ENQ-' + Date.now().toString(36).toUpperCase().slice(-6);
    $('#okMail').textContent = $('#f-email').value.trim();
    form.hidden = true; ok.hidden = false; ok.focus();
  });
}

/* ---------- 13. Footer year ---------- */
function initYear() { $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear()); }

/* ---------- Boot ---------- */
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