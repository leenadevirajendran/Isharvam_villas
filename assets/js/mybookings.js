/* ISHARVAM VILLAS: My bookings (frontend demo). Shows requests made in this browser plus three clearly-labelled sample bookings. */
(function () {
  'use strict';
  var ISH = window.ISH, C = ISH.config, $ = ISH.$, $$ = ISH.$$, tab = 'up';
  var STATUS = { Requested: 'warn', Confirmed: 'info', Paid: 'ok', Cancelled: 'err' };
  function list() { var mine = ISH.bookings.mine(), samples = ISH.bookings.all().filter(function (b) { return b.sample; }).slice(0, 3); return mine.concat(samples); }
  function bucket(b) { return b.status === 'Cancelled' ? 'cx' : b.checkOut < ISH.today() ? 'past' : 'up'; }
  function wa(b, v, what) { return ISH.waLink((C.booking.demo ? '[DEMO]\n' : '') + 'Hello Isharvam Villas, ' + what + '\nReference: ' + b.ref + '\nVilla: ' + v.name + '\nDates: ' + ISH.fmtDate(b.checkIn, true) + ' to ' + ISH.fmtDate(b.checkOut, true)); }
  function card(b) {
    var v = ISH.villa(b.villaId); if (!v) return ''; var loc = ISH.location(v.locationId), can = b.status !== 'Cancelled' && b.checkOut >= ISH.today();
    return '<article class="bk" data-ref="' + ISH.esc(b.ref) + '"><a class="bk__img" href="' + ISH.villaUrl(v) + '">' + ISH.imgTag(v.images[0].src, v.images[0].alt, { sizes: '260px' }) + '</a><div class="bk__body"><div class="bk__top"><p class="eyebrow">' + ISH.esc(loc.name) + '</p><span class="badge badge--' + (STATUS[b.status] || '') + '">' + ISH.esc(b.status) + '</span>' + (b.sample ? '<span class="badge">Sample</span>' : '') + '</div>' +
      '<h3 class="h3"><a href="' + ISH.villaUrl(v) + '">' + ISH.esc(v.name) + '</a></h3><p class="muted">' + ISH.fmtDate(b.checkIn, true) + ' → ' + ISH.fmtDate(b.checkOut, true) + ' · ' + ISH.plural(b.nights, 'night') + ' · ' + ISH.plural(b.guests, 'guest') + '</p>' +
      '<p class="small">Ref ' + ISH.esc(b.ref) + ' · Estimated ' + ISH.inr(b.total) + '</p><div class="bk__act"><button type="button" class="btn btn--ghost btn--sm js-view">View details</button><a class="btn btn--ghost btn--sm" target="_blank" rel="noopener" href="' + wa(b, v, 'I have a question about my booking.') + '">' + ISH.icon('whatsapp') + 'Message us</a>' + (can ? '<button type="button" class="btn btn--text btn--sm js-cancel">Cancel request</button>' : '') + '</div></div></article>';
  }
  function render() {
    var all = list(), counts = { up: 0, past: 0, cx: 0 }; all.forEach(function (b) { counts[bucket(b)]++; });
    $$('#bk-tabs [data-t]').forEach(function (t) { t.setAttribute('aria-selected', t.dataset.t === tab); t.querySelector('b').textContent = counts[t.dataset.t]; });
    var rows = all.filter(function (b) { return bucket(b) === tab; }), box = $('#bk-list');
    box.innerHTML = rows.length ? rows.map(card).join('') : '<div class="empty"><h2 class="h3">Nothing here yet.</h2><p class="muted">When you send a booking request it will appear here.</p><a class="btn" href="villas.html">Find a villa</a></div>';
  }
  function details(ref) {
    var b = ISH.bookings.find(ref), v = ISH.villa(b.villaId), steps = ['Requested', 'Confirmed', 'Paid'], idx = steps.indexOf(b.status);
    ISH.openDialog('<button class="dialog__close" data-close aria-label="Close">' + ISH.icon('x') + '</button><div class="cmp"><p class="eyebrow">' + ISH.esc(b.ref) + '</p><h2 class="h3">' + ISH.esc(v.name) + '</h2><ol class="timeline timeline--h">' + steps.map(function (s, i) { return '<li class="' + (b.status === 'Cancelled' ? '' : i < idx ? 'is-done' : i === idx ? 'is-cur' : '') + '"><b>' + s + '</b></li>'; }).join('') + '</ol>' + (b.status === 'Cancelled' ? '<p class="notice notice--err">This request was cancelled.</p>' : '') +
      '<dl class="facts facts--col"><div><dt>Check-in</dt><dd>' + ISH.fmtDate(b.checkIn, true) + ' · ' + C.booking.checkIn + '</dd></div><div><dt>Check-out</dt><dd>' + ISH.fmtDate(b.checkOut, true) + ' · ' + C.booking.checkOut + '</dd></div><div><dt>Guests</dt><dd>' + b.guests + '</dd></div><div><dt>Estimated total</dt><dd>' + ISH.inr(b.total) + '</dd></div><div><dt>Guest</dt><dd>' + ISH.esc(b.guest) + '</dd></div></dl><p class="small">Status changes (Confirmed, Paid) are made by the Isharvam team after your WhatsApp conversation. Demo data.</p></div>');
  }
  document.addEventListener('DOMContentLoaded', function () {
    var u = ISH.store.get('ish_user', null), g = $('#bk-greet'); if (u) { g.innerHTML = 'Welcome back, <em>' + ISH.esc(u.name.split(' ')[0]) + '.</em>'; $('#bk-login').hidden = true; $('#bk-logout').hidden = false; }
    $('#bk-logout').addEventListener('click', function () { ISH.store.del('ish_user'); location.reload(); });
    $('#bk-tabs').addEventListener('click', function (e) { var t = e.target.closest('[data-t]'); if (t) { tab = t.dataset.t; render(); } });
    $('#bk-list').addEventListener('click', function (e) {
      var c = e.target.closest('.bk'); if (!c) return; var ref = c.dataset.ref;
      if (e.target.closest('.js-view')) details(ref);
      if (e.target.closest('.js-cancel')) { var d = ISH.openDialog('<div class="cmp"><h2 class="h3">Cancel this request?</h2><p class="muted">The request will be marked as cancelled. For changes to a confirmed stay, message our team on WhatsApp.</p><div class="empty__cta"><button class="btn" id="cx-yes">Yes, cancel request</button><button class="btn btn--ghost" data-close>Keep it</button></div></div>'); $('#cx-yes', d.el).addEventListener('click', function () { ISH.bookings.setStatus(ref, 'Cancelled'); d.close(); render(); ISH.toast('Request cancelled (demo)'); }); }
    });
    render();
  });
})();
