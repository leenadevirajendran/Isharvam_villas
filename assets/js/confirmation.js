/* ISHARVAM VILLAS: request confirmation + WhatsApp handoff (frontend demo). */
(function () {
  'use strict';
  var ISH = window.ISH, C = ISH.config, $ = ISH.$, root = $('#conf-root');
  function msg(b, v) {
    return (C.booking.demo ? '[DEMO REQUEST from website prototype]\n' : '') + 'Hello Isharvam Villas, I would like to confirm a booking request.\nReference: ' + b.ref + '\nVilla: ' + v.name + '\nDates: ' + ISH.fmtDate(b.checkIn, true) + ' to ' + ISH.fmtDate(b.checkOut, true) + ' (' + ISH.plural(b.nights, 'night') + ')\nGuests: ' + b.guests + '\nEstimated total: ' + ISH.inr(b.total) + '\nPlease let me know the next steps for payment.';
  }
  function online() { var h = new Date().getHours(); return h >= C.contact.hoursStart && h < C.contact.hoursEnd; }
  document.addEventListener('DOMContentLoaded', function () {
    var b = ISH.bookings.find(ISH.query().ref || ''), v = b && ISH.villa(b.villaId);
    if (!b || !v) { root.innerHTML = '<div class="container container--narrow" style="text-align:center;padding-block:6rem"><p class="eyebrow">Request not found</p><h1>We couldn\'t find that request.</h1><p class="lead" style="margin:1rem auto 2rem">It may have been made on another device or browser. Start a new request below.</p><a class="btn" href="villas.html">Browse villas</a></div>'; return; }
    var loc = ISH.location(v.locationId), wa = ISH.waLink(msg(b, v)), on = online();
    root.innerHTML = '<div class="container conf"><div class="conf__main"><div class="conf__seal" aria-hidden="true"><svg viewBox="0 0 120 120"><polygon fill="currentColor" points="4,58 60,12 116,58 104,58 60,22 16,58"/><rect fill="currentColor" x="47" y="46" width="26" height="64"/><rect class="lit" x="54" y="58" width="12" height="14" fill="#F2C879"/></svg></div>' +
      '<p class="eyebrow">Request received</p><h1>One last step, <em>' + ISH.esc((b.guest || 'guest').split(' ')[0]) + '.</em></h1><p class="lead">Your request for ' + ISH.esc(v.name) + ' is ready. Continue on WhatsApp so our team can confirm your dates and arrange payment.</p>' +
      '<div class="conf__cta"><a class="btn btn--wa btn--lg" id="wa-go" href="' + wa + '" target="_blank" rel="noopener">' + ISH.icon('whatsapp') + 'Continue on WhatsApp</a><button type="button" class="btn btn--ghost btn--lg" onclick="window.print()">' + ISH.icon('file-text') + 'Print summary</button></div>' +
      '<p class="conf__hours ' + (on ? 'is-on' : '') + '"><i></i>' + (on ? 'Our team is online now.' : 'Our team is offline right now and replies between ' + C.contact.hours + '.') + '</p>' +
      '<ol class="timeline"><li class="is-done"><b>Request recorded</b><span>Reference ' + ISH.esc(b.ref) + '</span></li><li class="is-cur"><b>Continue on WhatsApp</b><span>Send the prefilled message to our team</span></li><li><b>Team confirms &amp; arranges payment</b><span>Your stay is confirmed only after we reply</span></li><li><b>Booking confirmed</b><span>You will see it under My bookings</span></li></ol>' +
      '<div class="notice"><svg class="icon"><use href="#i-info"/></svg><span><b>One more step.</b> Send the prepared message on WhatsApp so our team can confirm your dates and arrange payment.</span></div></div>' +
      '<aside class="conf__card"><div class="co-sum__img">' + ISH.imgTag(v.images[0].src, v.images[0].alt, { sizes: '(min-width: 900px) 30vw, 100vw', eager: true }) + '</div><div class="co-sum__body"><p class="eyebrow">' + ISH.esc(loc.name) + '</p><h2 class="h3">' + ISH.esc(v.name) + '</h2>' +
      '<dl class="facts facts--col"><div><dt>Reference</dt><dd>' + ISH.esc(b.ref) + '</dd></div><div><dt>Check-in</dt><dd>' + ISH.fmtDate(b.checkIn, true) + ' · ' + C.booking.checkIn + '</dd></div><div><dt>Check-out</dt><dd>' + ISH.fmtDate(b.checkOut, true) + ' · ' + C.booking.checkOut + '</dd></div><div><dt>Guests</dt><dd>' + b.guests + '</dd></div><div><dt>Estimated total</dt><dd><b>' + ISH.inr(b.total) + '</b></dd></div><div><dt>Status</dt><dd><span class="badge badge--warn">Requested</span></dd></div></dl>' +
      '<a class="link-arrow" href="my-bookings.html">View in My bookings ' + ISH.icon('arrow-right') + '</a></div></aside></div>';
  });
})();
