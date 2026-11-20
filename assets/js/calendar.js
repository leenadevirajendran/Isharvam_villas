/* ISHARVAM VILLAS: "lit dates" calendar.
   Available nights glow like lit windows; booked nights are dimmed; a selected stay lights up night by night.
   Availability comes from ISH.bookedSet(villa) (mock data now; swap for the PHP availability endpoint later).
   Usage: ISH.openCalendar(anchorEl, {villa, start, end, onChange}) or ISH.renderCalendar(container, opts) for inline/read-only. */
(function () {
  'use strict';
  var ISH = window.ISH, $ = ISH.$, $$ = ISH.$$;

  function monthsToShow() { return window.innerWidth >= 780 ? 2 : 1; }
  function firstOfMonth(iso) { var d = ISH.parse(iso); return ISH.iso(new Date(d.getFullYear(), d.getMonth(), 1)); }
  function addMonths(iso, n) { var d = ISH.parse(iso); return ISH.iso(new Date(d.getFullYear(), d.getMonth() + n, 1)); }

  function Calendar(box, o) {
    this.box = box; this.o = o || {}; this.today = ISH.today(); this.start = o.start || null; this.end = o.end || null; this.hover = null;
    this.readonly = !!o.readonly; this.view = firstOfMonth(this.start || this.today); this.booked = o.villa ? ISH.bookedSet(o.villa) : {};
    this.maxView = addMonths(firstOfMonth(this.today), ISH.config.booking.maxMonthsAhead);
    this.render(); var self = this;
    box.addEventListener('click', function (e) { self.onClick(e); });
    box.addEventListener('keydown', function (e) { self.onKey(e); });
    box.addEventListener('mouseover', function (e) { var b = e.target.closest('.cal__day'); if (b && self.start && !self.end && !self.readonly) { self.hover = b.dataset.d; self.paint(); } });
    box.addEventListener('mouseleave', function () { if (self.hover) { self.hover = null; self.paint(); } });
  }
  Calendar.prototype.isPast = function (d) { return d < this.today; };
  Calendar.prototype.isBooked = function (d) { return !!this.booked[d]; };
  Calendar.prototype.canStart = function (d) { return !this.isPast(d) && !this.isBooked(d); };
  Calendar.prototype.canEnd = function (d) {
    if (!this.start || d <= this.start) return false;
    if (ISH.diffDays(this.start, d) < ISH.config.booking.minNights) return false;
    return !this.o.villa || ISH.isAvailable(this.o.villa, this.start, d);
  };
  Calendar.prototype.render = function () {
    var n = monthsToShow(), h = '<div class="cal__head"><button type="button" class="cal__nav" data-nav="-1" aria-label="Previous month">' + ISH.icon('chevron-left') + '</button><div class="cal__titles">';
    for (var i = 0; i < n; i++) { var d = ISH.parse(addMonths(this.view, i)); h += '<h3 class="cal__title" aria-live="polite">' + ISH.MONTHS[d.getMonth()] + ' ' + d.getFullYear() + '</h3>'; }
    h += '</div><button type="button" class="cal__nav" data-nav="1" aria-label="Next month">' + ISH.icon('chevron-right') + '</button></div><div class="cal__months cal__months--' + n + '">';
    for (i = 0; i < n; i++) h += this.month(addMonths(this.view, i));
    h += '</div><div class="cal__legend"><span><i class="lamp"></i> Available</span><span><i class="lamp lamp--off"></i> Booked</span><span><i class="lamp lamp--sel"></i> Your stay</span></div>';
    this.box.innerHTML = h; this.paint();
    var prev = $('[data-nav="-1"]', this.box), next = $('[data-nav="1"]', this.box);
    prev.disabled = this.view <= firstOfMonth(this.today); next.disabled = addMonths(this.view, n) > this.maxView;
  };
  Calendar.prototype.month = function (first) {
    var d = ISH.parse(first), y = d.getFullYear(), m = d.getMonth(), lead = (d.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
    var h = '<div class="cal__month" role="grid" aria-label="' + ISH.MONTHS[m] + ' ' + y + '"><div class="cal__dow" role="row">';
    ISH.DOW.forEach(function (x) { h += '<span role="columnheader">' + x + '</span>'; }); h += '</div><div class="cal__grid">';
    for (var i = 0; i < lead; i++) h += '<span class="cal__pad"></span>';
    for (var k = 1; k <= days; k++) {
      var iso = y + '-' + (m + 1 < 10 ? '0' : '') + (m + 1) + '-' + (k < 10 ? '0' : '') + k;
      h += '<button type="button" class="cal__day" data-d="' + iso + '" role="gridcell"><span>' + k + '</span></button>';
    }
    return h + '</div></div>';
  };
  Calendar.prototype.paint = function () {
    var self = this, s = this.start, e = this.end || (this.hover && this.start && this.hover > this.start ? this.hover : null), idx = 0;
    $$('.cal__day', this.box).forEach(function (b) {
      var d = b.dataset.d, past = self.isPast(d), bk = self.isBooked(d), cls = 'cal__day';
      var selectable = !self.readonly && (s && !self.end ? (self.canEnd(d) || self.canStart(d)) : self.canStart(d));
      if (past) cls += ' is-past'; else if (bk) cls += ' is-booked'; else cls += ' is-free';
      if (s && d === s) cls += ' is-start'; if (self.end && d === self.end) cls += ' is-end';
      if (s && e && d > s && d < e) cls += ' is-mid'; if (s && e && d >= s && d < e) { cls += ' is-night'; b.style.setProperty('--i', idx++); }
      if (self.hover && !self.end && d === self.hover && s && d > s) cls += ' is-hover';
      b.className = cls; b.disabled = !selectable; b.tabIndex = -1;
      var lbl = ISH.fmtDate(d, true) + (past ? ', unavailable' : bk ? ', booked' : ', available'); b.setAttribute('aria-label', lbl); b.setAttribute('aria-selected', (d === s || d === self.end) ? 'true' : 'false');
    });
    var first = $('.cal__day.is-start:not(:disabled)', this.box) || $('.cal__day:not(:disabled)', this.box); if (first) first.tabIndex = 0;
  };
  Calendar.prototype.pick = function (d) {
    if (this.readonly) return;
    if (!this.start || this.end) { if (!this.canStart(d)) return; this.start = d; this.end = null; }
    else if (d <= this.start) { if (!this.canStart(d)) return; this.start = d; }
    else if (this.canEnd(d)) { this.end = d; }
    else { if (this.canStart(d)) { this.start = d; this.end = null; if (this.o.villa) ISH.toast('Those dates include a booked night. Pick a new check-in.'); } else return; }
    this.hover = null; this.paint(); if (this.o.onChange) this.o.onChange(this.start, this.end);
  };
  Calendar.prototype.onClick = function (e) {
    var nav = e.target.closest('.cal__nav'); if (nav) { var n = monthsToShow(); this.view = addMonths(this.view, +nav.dataset.nav * (n > 1 ? 1 : 1)); this.render(); var f = $('.cal__nav:not(:disabled)', this.box); return; }
    var b = e.target.closest('.cal__day'); if (b && !b.disabled) this.pick(b.dataset.d);
  };
  Calendar.prototype.onKey = function (e) {
    var b = e.target.closest('.cal__day'); if (!b) return; var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]; if (!step) return;
    e.preventDefault(); var t = ISH.addDays(b.dataset.d, step), nb = $('.cal__day[data-d="' + t + '"]', this.box);
    if (!nb) { this.view = firstOfMonth(t); if (this.view < firstOfMonth(this.today) || this.view > this.maxView) return; this.render(); nb = $('.cal__day[data-d="' + t + '"]', this.box); }
    if (nb) { $$('.cal__day', this.box).forEach(function (x) { x.tabIndex = -1; }); nb.tabIndex = 0; nb.focus(); }
  };
  Calendar.prototype.set = function (a, b) { this.start = a; this.end = b; if (a) this.view = firstOfMonth(a); this.render(); };
  ISH.renderCalendar = function (box, o) { box.classList.add('cal'); return new Calendar(box, o); };

  /* ---------- popover ---------- */
  var open = null;
  function close() { if (!open) return; open.el.remove(); document.removeEventListener('mousedown', open.out, true); document.removeEventListener('keydown', open.key, true); window.removeEventListener('resize', open.pos); if (open.anchor) { open.anchor.setAttribute('aria-expanded', 'false'); } open = null; }
  ISH.closeCalendar = close;
  ISH.openCalendar = function (anchor, o) {
    close(); var el = document.createElement('div'); el.className = 'cal-pop'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Choose your dates');
    el.innerHTML = '<div class="cal-pop__body"></div><div class="cal-pop__foot"><p class="cal-pop__sum" aria-live="polite"></p><div><button type="button" class="btn btn--text js-clear">Clear dates</button><button type="button" class="btn btn--primary btn--sm js-done">Done</button></div></div>';
    document.body.appendChild(el); anchor.setAttribute('aria-expanded', 'true');
    var sum = $('.cal-pop__sum', el);
    function upd(a, b) { sum.textContent = a && b ? ISH.plural(ISH.diffDays(a, b), 'night') + ' · ' + ISH.fmtDate(a) + ' to ' + ISH.fmtDate(b) : a ? 'Now choose your check-out date' : 'Choose your check-in date'; }
    var cal = ISH.renderCalendar($('.cal-pop__body', el), Object.assign({}, o, { onChange: function (a, b) { upd(a, b); if (o.onChange) o.onChange(a, b); if (a && b) setTimeout(function () { if (open && open.el === el) { close(); anchor.focus(); } }, 650); } }));
    upd(cal.start, cal.end);
    function pos() {
      var r = anchor.getBoundingClientRect(), w = el.offsetWidth, left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + window.scrollX)), top = r.bottom + window.scrollY + 10;
      if (window.innerWidth < 640) { left = 8; el.style.width = (window.innerWidth - 16) + 'px'; } else el.style.width = '';
      var fit = r.bottom + el.offsetHeight + 16 > window.innerHeight && r.top > el.offsetHeight + 16; if (fit) top = r.top + window.scrollY - el.offsetHeight - 10;
      el.style.left = left + 'px'; el.style.top = top + 'px';
    }
    pos(); requestAnimationFrame(function () { el.classList.add('is-in'); var f = $('.cal__day:not(:disabled)[tabindex="0"]', el) || $('.cal__day:not(:disabled)', el); if (f) f.focus({ preventScroll: true }); });
    open = { el: el, anchor: anchor, pos: pos,
      out: function (e) { if (!el.contains(e.target) && !anchor.contains(e.target)) close(); },
      key: function (e) { if (e.key === 'Escape') { close(); anchor.focus(); } } };
    document.addEventListener('mousedown', open.out, true); document.addEventListener('keydown', open.key, true); window.addEventListener('resize', pos);
    $('.js-clear', el).addEventListener('click', function () { cal.set(null, null); upd(null, null); if (o.onChange) o.onChange(null, null); });
    $('.js-done', el).addEventListener('click', function () { close(); anchor.focus(); });
    ISH.focusTrap(el); return cal;
  };
})();
