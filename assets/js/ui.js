/* ISHARVAM VILLAS: shared UI behaviour: header, mobile menu, booking bar, guest picker, floating WhatsApp, demo notice. */
(function () {
  'use strict';
  var ISH = window.ISH, C = ISH.config, $ = ISH.$, $$ = ISH.$$;

  /* ---------- header ---------- */
  function initHeader() {
    var h = $('.site-header'); if (!h) return;
    var hero = document.body.classList.contains('has-hero');
    function upd() { h.classList.toggle('is-solid', !hero || window.scrollY > 60); h.classList.toggle('is-hidden', window.scrollY > 600 && window.scrollY > lastY + 4 && !document.body.classList.contains('menu-open')); if (window.scrollY < lastY - 4) h.classList.remove('is-hidden'); lastY = window.scrollY; }
    var lastY = 0, tick = false; window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { upd(); tick = false; }); } }, { passive: true }); upd();
    var btn = $('.nav-toggle'), menu = $('#mobile-menu'); if (!btn || !menu) return; var release;
    function set(o) { document.body.classList.toggle('menu-open', o); btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); menu.hidden = !o; if (o) { release = ISH.focusTrap(menu); var f = $('a', menu); f && f.focus(); } else { release && release(); } }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches && !menu.hidden) set(false); });
    var user = ISH.store.get('ish_user', null); if (user) { $$('.icon-btn[href$="login.html"]').forEach(function (a) { a.href = ISH.root + 'my-bookings.html'; a.setAttribute('aria-label', 'My account: ' + user.name); }); }
    var cur = document.body.dataset.nav; if (cur) $$('[data-nav-link="' + cur + '"]').forEach(function (a) { a.setAttribute('aria-current', 'page'); });
  }

  /* ---------- footer details from config ---------- */
  function initFooter() {
    $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });
    var c = C.contact;
    $$('[data-fill="phones"]').forEach(function (e) { e.innerHTML = c.phones.map(function (p) { return '<a href="tel:+91' + p + '">' + ISH.phone(p) + '</a>'; }).join('<br>'); });
    $$('[data-fill="email"]').forEach(function (e) { e.innerHTML = '<a href="mailto:' + c.email + '">' + c.email + '</a>'; });
    $$('[data-fill="hours"]').forEach(function (e) { e.textContent = c.hours; });
    $$('[data-fill="address"]').forEach(function (e) { if (c.address) e.innerHTML = ISH.esc(c.address); else e.remove(); });
    $$('[data-wa]').forEach(function (a) { a.href = ISH.waLink(a.dataset.wa || 'Hello Isharvam Villas, I would like to know more about your villas.'); a.target = '_blank'; a.rel = 'noopener'; });
    $$('[data-fill="instagram"]').forEach(function (a) { a.href = c.instagram; a.target = '_blank'; a.rel = 'noopener'; });
    var pill = $('.demo-pill'), pop = $('.demo-pop');
    if (pill && pop) { pill.addEventListener('click', function () { var o = pop.hidden; pop.hidden = !o; pill.setAttribute('aria-expanded', o); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { pop.hidden = true; pill.setAttribute('aria-expanded', 'false'); } }); }
  }

  /* ---------- guest picker ---------- */
  function GuestPicker(btn, o) {
    var self = this; this.adults = o.adults || 2; this.children = o.children || 0; this.max = o.max || 20; this.onChange = o.onChange;
    this.pop = document.createElement('div'); this.pop.className = 'guest-pop'; this.pop.hidden = true; this.pop.setAttribute('role', 'dialog'); this.pop.setAttribute('aria-label', 'Guests');
    this.pop.innerHTML = '<div class="step"><div><b>Adults</b><small>Age 13+</small></div><div class="stepper"><button type="button" data-k="adults" data-s="-1" aria-label="Fewer adults">' + ISH.icon('minus') + '</button><output data-o="adults">2</output><button type="button" data-k="adults" data-s="1" aria-label="More adults">' + ISH.icon('plus') + '</button></div></div>' +
      '<div class="step"><div><b>Children</b><small>Age 0–12</small></div><div class="stepper"><button type="button" data-k="children" data-s="-1" aria-label="Fewer children">' + ISH.icon('minus') + '</button><output data-o="children">0</output><button type="button" data-k="children" data-s="1" aria-label="More children">' + ISH.icon('plus') + '</button></div></div><p class="guest-pop__note"></p>';
    btn.parentNode.style.position = 'relative'; btn.parentNode.appendChild(this.pop); this.btn = btn;
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () { self.toggle(); });
    this.pop.addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (!b) return; var k = b.dataset.k, v = self[k] + +b.dataset.s; if (k === 'adults' && v < 1) return; if (v < 0) return; if (self.adults + self.children + +b.dataset.s > self.max) { return; } self[k] = v; self.update(); });
    document.addEventListener('mousedown', function (e) { if (!self.pop.hidden && !self.pop.contains(e.target) && !btn.contains(e.target)) self.toggle(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !self.pop.hidden) { self.toggle(false); btn.focus(); } });
    this.update(true);
  }
  GuestPicker.prototype.total = function () { return this.adults + this.children; };
  GuestPicker.prototype.toggle = function (f) { var o = typeof f === 'boolean' ? f : this.pop.hidden; this.pop.hidden = !o; this.btn.setAttribute('aria-expanded', o); };
  GuestPicker.prototype.update = function (silent) {
    $('[data-o="adults"]', this.pop).textContent = this.adults; $('[data-o="children"]', this.pop).textContent = this.children;
    var t = this.total(); $('.val', this.btn).textContent = ISH.plural(t, 'guest') + (this.children ? ' (' + this.children + ' child' + (this.children > 1 ? 'ren' : '') + ')' : '');
    $('.guest-pop__note', this.pop).textContent = t >= this.max ? 'Maximum ' + this.max + ' guests for this selection.' : '';
    if (!silent && this.onChange) this.onChange(t, this);
  };
  ISH.GuestPicker = GuestPicker;

  /* ---------- booking bar (home hero, listing pages) ---------- */
  ISH.initBookbar = function (form) {
    var q = ISH.query(), sel = $('select[name="loc"]', form), inI = $('[name="in"]', form), outI = $('[name="out"]', form), gI = $('[name="g"]', form);
    if (sel && sel.options.length < 2) sel.innerHTML = '<option value="">All locations</option>' + ISH.data.locations.map(function (l) { return '<option value="' + l.id + '">' + ISH.esc(l.name) + ' · ' + ISH.esc(l.region) + '</option>'; }).join('');
    if (sel && q.loc) sel.value = q.loc;
    var dBtn = $('[data-dates]', form), vi = $('[data-in]', form), vo = $('[data-out]', form);
    function showDates() { vi.textContent = inI.value ? ISH.fmtDate(inI.value) : 'Add date'; vo.textContent = outI.value ? ISH.fmtDate(outI.value) : 'Add date'; vi.classList.toggle('is-set', !!inI.value); vo.classList.toggle('is-set', !!outI.value); }
    if (q.in && q.out && q.in >= ISH.today() && q.out > q.in) { inI.value = q.in; outI.value = q.out; } showDates();
    $$('[data-dates]', form).forEach(function (b) { b.addEventListener('click', function () { ISH.openCalendar(b, { start: inI.value || null, end: outI.value || null, onChange: function (a, z) { inI.value = a || ''; outI.value = z || ''; showDates(); form.dispatchEvent(new CustomEvent('bookbar:change')); } }); }); });
    var gb = $('[data-guests]', form), gp = gb && new GuestPicker(gb, { adults: Math.max(1, +q.g || 2), onChange: function (t) { gI.value = t; form.dispatchEvent(new CustomEvent('bookbar:change')); } });
    if (gp) gI.value = gp.total();
    if (sel) sel.addEventListener('change', function () { form.dispatchEvent(new CustomEvent('bookbar:change')); });
    if (!form.dataset.noSubmit) form.addEventListener('submit', function () { if (!inI.value) { inI.disabled = true; outI.disabled = true; } if (!sel.value) sel.disabled = true; });
    return { form: form, guests: gp };
  };

  /* ---------- dialog helper (lightbox, compare, etc.) ---------- */
  ISH.openDialog = function (html, cls) {
    var wrap = document.createElement('div'); wrap.className = 'dialog ' + (cls || ''); wrap.innerHTML = '<div class="dialog__scrim"></div><div class="dialog__panel" role="dialog" aria-modal="true" tabindex="-1">' + html + '</div>'; document.body.appendChild(wrap);
    var prev = document.activeElement, panel = $('.dialog__panel', wrap), rel = ISH.focusTrap(panel); document.body.classList.add('no-scroll');
    function close() { rel(); wrap.classList.remove('is-in'); document.body.classList.remove('no-scroll'); document.removeEventListener('keydown', key); setTimeout(function () { wrap.remove(); }, 250); prev && prev.focus && prev.focus(); }
    function key(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', key); $('.dialog__scrim', wrap).addEventListener('click', close);
    $$('[data-close]', wrap).forEach(function (b) { b.addEventListener('click', close); });
    requestAnimationFrame(function () { wrap.classList.add('is-in'); panel.focus(); }); return { el: wrap, close: close };
  };

  document.addEventListener('DOMContentLoaded', function () {
    initHeader(); initFooter();
    $$('[data-bookbar]').forEach(function (f) { ISH.initBookbar(f); });
    if ('startViewTransition' in document) document.documentElement.classList.add('vt');
  });
})();
