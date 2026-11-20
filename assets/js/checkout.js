/* ISHARVAM VILLAS: "Request your stay" (replaces checkout: payment is arranged on WhatsApp).
   FRONTEND DEMO: the request is stored in this browser only. In the PHP phase the server must re-check availability and recompute the price. */
(function () {
  'use strict';
  var ISH = window.ISH, C = ISH.config, $ = ISH.$, $$ = ISH.$$, q = ISH.query(), v = ISH.villa(q.v || '');
  if (!v) { location.replace('villas.html'); return; }
  var S = { 'in': q['in'] >= ISH.today() ? q['in'] : '', out: q.out || '', guests: Math.max(1, Math.min(v.maxGuests, +q.g || 2)) }; if (!(S.out > S['in']) || !ISH.isAvailable(v, S['in'], S.out)) { S['in'] = ''; S.out = ''; }
  var form, gp;
  function summary() {
    var loc = ISH.location(v.locationId), r = S['in'] && S.out ? ISH.quote(v, S['in'], S.out, S.guests) : null, B = C.booking;
    $('#co-summary').innerHTML = '<div class="co-sum__img">' + ISH.imgTag(v.images[0].src, v.images[0].alt, { sizes: '(min-width: 900px) 30vw, 100vw', eager: true }) + '</div><div class="co-sum__body"><p class="eyebrow">' + ISH.esc(loc.name) + ' · ' + ISH.esc(v.category) + '</p><h2 class="h3"><a href="' + ISH.villaUrl(v) + '">' + ISH.esc(v.name) + '</a></h2>' +
      '<ul class="specs"><li>' + ISH.icon('bed-double') + v.bedrooms + ' bed</li><li>' + ISH.icon('bath') + v.bathrooms + ' bath</li><li>' + ISH.icon('users') + 'up to ' + v.maxGuests + '</li></ul><hr class="hr">' +
      (r ? '<dl class="quote"><div><dt>' + ISH.inr(v.pricePerNight) + ' × ' + ISH.plural(r.nights, 'night') + '</dt><dd>' + ISH.inr(r.base) + '</dd></div>' + (r.weekend > 0 ? '<div><dt>Weekend nights</dt><dd>' + ISH.inr(r.weekend) + '</dd></div>' : '') + '<div><dt>Cleaning fee</dt><dd>' + ISH.inr(r.cleaning) + '</dd></div><div><dt>Taxes</dt><dd>' + ISH.inr(r.tax) + '</dd></div><div class="quote__total"><dt>Estimated total</dt><dd>' + ISH.inr(r.total) + '</dd></div></dl>' : '<p class="muted">Choose your dates to see the price.</p>') +
      '<p class="small">' + ISH.icon('shield-check') + ' You are not charged on this website. Our team confirms the final amount with you on WhatsApp.</p></div>';
    $('#co-in').textContent = S['in'] ? ISH.fmtDate(S['in'], true) : 'Add date'; $('#co-out').textContent = S.out ? ISH.fmtDate(S.out, true) : 'Add date'; $('#co-in').classList.toggle('is-set', !!S['in']); $('#co-out').classList.toggle('is-set', !!S.out); $('#co-err').textContent = '';
  }
  function calOpts() { return { villa: v, start: S['in'] || null, end: S.out || null, onChange: function (a, b) { S['in'] = a || ''; S.out = b || ''; summary(); } }; }
  function ref() { var d = new Date(), s = ''; for (var i = 0; i < 4; i++) s += 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'.charAt(Math.floor(Math.random() * 32)); return 'ISH-' + String(d.getFullYear()).slice(2) + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '-' + s; }
  document.addEventListener('DOMContentLoaded', function () {
    form = $('#co-form'); $('#co-title').textContent = 'Request ' + v.name; document.title = 'Request your stay: ' + v.name + ' | Isharvam Villas';
    $$('[data-bc]').forEach(function (b) { b.addEventListener('click', function () { ISH.openCalendar(b, calOpts()); }); });
    gp = new ISH.GuestPicker($('#co-g'), { adults: S.guests, max: v.maxGuests, onChange: function (t) { S.guests = t; summary(); } }); S.guests = gp.total();
    var u = ISH.store.get('ish_user', null); if (u) { form.name.value = u.name || ''; form.email.value = u.email || ''; form.phone.value = u.phone || ''; }
    summary();
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var ok = ISH.validateForm(form), err = $('#co-err');
      if (!(S['in'] && S.out)) { err.textContent = 'Please choose your check-in and check-out dates.'; ok = false; } else if (!ISH.isAvailable(v, S['in'], S.out)) { err.textContent = 'Sorry, those dates are no longer free. Please choose different dates.'; ok = false; }
      if (!ok) { if (err.textContent) err.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      var r = ISH.quote(v, S['in'], S.out, S.guests), btn = $('button[type=submit]', form); btn.classList.add('is-loading');
      var b = { ref: ref(), villaId: v.id, guest: form.name.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim(), notes: form.notes.value.trim(), checkIn: S['in'], checkOut: S.out, nights: r.nights, guests: S.guests, total: Math.round(r.total), status: 'Requested', created: ISH.today(), sample: false };
      ISH.bookings.add(b); setTimeout(function () { location.href = 'confirmation.html?ref=' + encodeURIComponent(b.ref); }, 700);
    });
  });
})();
