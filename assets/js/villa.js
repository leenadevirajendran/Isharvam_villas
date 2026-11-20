/* ISHARVAM VILLAS: villa details page. Gallery + lightbox, lit-dates availability, price breakdown and request handoff.
   Reads ?v=<slug>&in=&out=&g= . In the PHP phase this page becomes server-rendered; the price quote and availability must then come from the server. */
(function () {
  'use strict';
  var ISH = window.ISH, C = ISH.config, D = ISH.data, $ = ISH.$, $$ = ISH.$$;
  var q = ISH.query(), v = ISH.villa(q.v || ''), root = $('#villa-root');
  var S = { 'in': q['in'] && q['in'] >= ISH.today() ? q['in'] : '', out: '', guests: Math.max(1, +q.g || 2) }; if (S['in'] && q.out > S['in']) S.out = q.out; else S['in'] = '';
  if (v && S['in'] && !ISH.isAvailable(v, S['in'], S.out)) { S['in'] = ''; S.out = ''; }

  function notFound() { root.innerHTML = '<section class="section atm-day"><div class="container container--narrow" style="padding-top:var(--header-h);text-align:center"><p class="eyebrow">404</p><h1>We couldn\'t find that villa.</h1><p class="lead" style="margin:1rem auto 2rem">The link may be out of date. Browse the full collection instead.</p><a class="btn" href="villas.html">View all villas</a></div></section>'; }

  function gallery(v) {
    var im = v.images, mosaic = im.slice(0, 5).map(function (m, i) {
      return '<button type="button" class="gal gal--' + i + '" data-i="' + i + '" aria-label="Open photo ' + (i + 1) + ' of ' + im.length + ': ' + ISH.esc(m.alt) + '">' + ISH.imgTag(m.src, m.alt, { eager: i === 0, sizes: i === 0 ? '(min-width: 900px) 50vw, 100vw' : '25vw' }) + (i === 4 ? '<span class="gal__more">' + ISH.icon('maximize-2') + 'View all ' + im.length + ' photos</span>' : '') + '</button>';
    }).join('');
    var slides = im.map(function (m, i) { return '<div class="swiper-slide"><button type="button" class="gal" data-i="' + i + '" aria-label="Open photo ' + (i + 1) + '">' + ISH.imgTag(m.src, m.alt, { eager: i === 0, sizes: '100vw' }) + '</button></div>'; }).join('');
    return '<div class="gallery__mosaic">' + mosaic + '</div><div class="swiper gallery__swiper" id="gal-swiper"><div class="swiper-wrapper">' + slides + '</div><div class="swiper-pagination"></div></div>';
  }
  function amenities(v) {
    var groups = {}; v.amenities.forEach(function (id) { var a = ISH.amenity(id); if (a) (groups[a.group] = groups[a.group] || []).push(a); });
    return Object.keys(groups).map(function (g) { return '<div class="amen"><h3 class="eyebrow">' + ISH.esc(g) + '</h3><ul>' + groups[g].map(function (a) { return '<li>' + ISH.icon(a.icon) + ISH.esc(a.label) + '</li>'; }).join('') + '</ul></div>'; }).join('');
  }
  function render() {
    var loc = ISH.location(v.locationId), w = ISH.wish.has(v.id);
    document.title = v.name + ' | Isharvam Villas'; var md = $('meta[name="description"]'); if (md) md.content = v.shortDescription;
    var sim = D.villas.filter(function (x) { return x.id !== v.id && (x.category === v.category || x.locationId === v.locationId); }).slice(0, 3);
    if (sim.length < 3) sim = sim.concat(D.villas.filter(function (x) { return x.id !== v.id && sim.indexOf(x) < 0; }).slice(0, 3 - sim.length));
    root.innerHTML =
      '<section class="vhead atm-day"><div class="container"><ul class="crumbs"><li><a href="index.html">Home</a></li><li><a href="villas.html">Villas</a></li><li>' + ISH.esc(v.name) + '</li></ul>' +
      '<div class="vhead__row"><div><p class="eyebrow">' + ISH.esc(loc.name) + ' · ' + ISH.esc(v.category) + '</p><h1>' + ISH.esc(v.name) + '</h1><p class="lead">' + ISH.esc(v.tagline) + '</p></div>' +
      '<div class="vhead__act"><button type="button" class="btn btn--ghost btn--sm js-wish' + (w ? ' is-on' : '') + '" data-id="' + v.id + '" aria-pressed="' + w + '">' + ISH.icon('heart') + '<span>Save</span></button><button type="button" class="btn btn--ghost btn--sm" id="share">' + ISH.icon('share-2') + '<span>Share</span></button></div></div></div></section>' +
      '<section class="gallery atm-day"><div class="container">' + gallery(v) + '</div></section>' +
      '<div class="atm-day vbody"><div class="container vlayout"><div class="vmain">' +
      '<ul class="specs specs--lg"><li>' + ISH.icon('bed-double') + ISH.plural(v.bedrooms, 'bedroom') + '</li><li>' + ISH.icon('bath') + ISH.plural(v.bathrooms, 'bathroom') + '</li><li>' + ISH.icon('users') + 'Up to ' + v.maxGuests + ' guests</li><li>' + ISH.icon('map-pin') + ISH.esc(loc.name) + '</li></ul>' +
      '<div class="vsec"><h2 class="h2">About this <em>villa</em></h2>' + v.description.map(function (p, i) { return '<p class="' + (i === 0 ? 'lead' : 'body') + '">' + ISH.esc(p) + '</p>'; }).join('') + '</div>' +
      '<div class="vsec"><h2 class="h2">Highlights</h2><ul class="hl">' + v.highlights.map(function (h) { return '<li><i></i>' + ISH.esc(h) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="vsec"><h2 class="h2">What\'s included</h2><div class="amen-grid">' + amenities(v) + '</div></div>' +
      '<div class="vsec" id="availability"><h2 class="h2">Availability</h2><p class="muted" style="margin-bottom:1.2rem">Lit dates are free. Choose your check-in and check-out right here or in the booking panel.</p><div id="vcal" class="cal--inline"></div></div>' +
      '<div class="vsec"><h2 class="h2">Good to know</h2><dl class="facts"><div><dt>Check-in</dt><dd>' + C.booking.checkIn + '</dd></div><div><dt>Check-out</dt><dd>' + C.booking.checkOut + '</dd></div><div><dt>Minimum stay</dt><dd>' + ISH.plural(C.booking.minNights, 'night') + '</dd></div><div><dt>Payment</dt><dd>Arranged with our team on WhatsApp</dd></div></dl><p class="small" style="margin-top:1rem">House rules and cancellation terms follow the <a href="cancellation.html" style="text-decoration:underline">cancellation policy</a> once confirmed by the business.</p></div>' +
      '<div class="vsec"><h2 class="h2">Location</h2><div class="mapph"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 12 L4 58 H16 L60 22 L104 58 H116 Z"/><rect x="47" y="46" width="26" height="64"/></svg><p><b>' + ISH.esc(loc.name) + '</b> · ' + ISH.esc(loc.region) + '</p></div></div>' +
      '</div><aside class="vbook" aria-label="Booking panel"><div class="bookcard" id="bookcard">' +
      '<p class="bookcard__price"><span class="price"><span>from</span> ' + ISH.inr(v.pricePerNight) + '<small> / night</small></span></p>' +
      '<div class="bookcard__fields"><button type="button" class="bc-f" data-bc="in"><span class="bookbar__lbl">Check-in</span><span class="val" id="bc-in">Add date</span></button><button type="button" class="bc-f" data-bc="out"><span class="bookbar__lbl">Check-out</span><span class="val" id="bc-out">Add date</span></button><div class="bc-f bc-f--full"><button type="button" id="bc-g" data-guests class="bookbar__btn"><span class="bookbar__lbl">Guests</span><span class="val">2 guests</span></button></div></div>' +
      '<div id="bc-quote" aria-live="polite"></div><div id="bc-cta"></div>' +
      '<p class="small bookcard__note">' + ISH.icon('shield-check') + ' No payment on this website. Send your request and continue with our team on WhatsApp.</p></div>' +
      '</aside></div></div>' +
      '<section class="section atm-golden"><div class="container"><header class="sec-head"><div><p class="eyebrow">You may also like</p><h2>More <em>villas.</em></h2></div><a class="link-arrow" href="villas.html">All villas ' + ISH.icon('arrow-right') + '</a></header><div class="similar">' + sim.map(function (s) { return ISH.villaCard(s, {}); }).join('') + '</div></div></section>' +
      '<div class="mbar" id="mbar"><div><span class="price"><span>from</span> ' + ISH.inr(v.pricePerNight) + '<small>/ night</small></span></div><a class="btn btn--sm" href="#bookcard" id="mbar-btn">Check dates</a></div>';
    wire(); ISH.initReveal(root);
  }

  /* ---------- booking card ---------- */
  var cal, gp;
  function quoteUI() {
    var qEl = $('#bc-quote'), cta = $('#bc-cta'); $('#bc-in').textContent = S['in'] ? ISH.fmtDate(S['in']) : 'Add date'; $('#bc-out').textContent = S.out ? ISH.fmtDate(S.out) : 'Add date'; $('#bc-in').classList.toggle('is-set', !!S['in']); $('#bc-out').classList.toggle('is-set', !!S.out);
    var mb = $('#mbar-btn'); if (!(S['in'] && S.out)) { qEl.innerHTML = ''; cta.innerHTML = '<button type="button" class="btn btn--block btn--lg" id="pick">Select your dates</button>'; $('#pick').addEventListener('click', function () { ISH.openCalendar($('[data-bc="in"]'), calOpts()); }); if (mb) mb.textContent = 'Check dates'; return; }
    var r = ISH.quote(v, S['in'], S.out, S.guests); if (!r) return;
    qEl.innerHTML = '<dl class="quote"><div><dt>' + ISH.inr(v.pricePerNight) + ' × ' + ISH.plural(r.nights, 'night') + '</dt><dd>' + ISH.inr(r.base) + '</dd></div>' + (r.weekend > 0 ? '<div><dt>Weekend nights</dt><dd>' + ISH.inr(r.weekend) + '</dd></div>' : '') +
      '<div><dt>Cleaning fee</dt><dd>' + ISH.inr(r.cleaning) + '</dd></div><div><dt>Taxes</dt><dd>' + ISH.inr(r.tax) + '</dd></div><div class="quote__total"><dt>Total</dt><dd>' + ISH.inr(r.total) + '</dd></div></dl>';
    var qs = 'v=' + v.slug + '&in=' + S['in'] + '&out=' + S.out + '&g=' + S.guests; cta.innerHTML = '<a class="btn btn--block btn--lg" href="checkout.html?' + qs + '">Request this stay ' + ISH.icon('arrow-right') + '</a>'; if (mb) { mb.textContent = 'Request stay'; mb.href = 'checkout.html?' + qs; }
  }
  function calOpts() { return { villa: v, start: S['in'] || null, end: S.out || null, onChange: function (a, b) { S['in'] = a || ''; S.out = b || ''; if (cal) cal.set(S['in'] || null, S.out || null); quoteUI(); } }; }
  function wire() {
    cal = ISH.renderCalendar($('#vcal'), { villa: v, start: S['in'] || null, end: S.out || null, onChange: function (a, b) { S['in'] = a || ''; S.out = b || ''; quoteUI(); } });
    $$('[data-bc]').forEach(function (b) { b.addEventListener('click', function () { ISH.openCalendar(b, calOpts()); }); });
    gp = new ISH.GuestPicker($('#bc-g'), { adults: Math.min(S.guests, v.maxGuests), max: v.maxGuests, onChange: function (t) { S.guests = t; quoteUI(); } }); S.guests = gp.total(); quoteUI();
    $('#share').addEventListener('click', function () { var u = location.href; if (navigator.share) navigator.share({ title: v.name, url: u }).catch(function () { }); else if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { ISH.toast('Link copied'); }, function () { ISH.toast('Copy the address bar link to share'); }); else ISH.toast('Copy the address bar link to share'); });
    if (window.Swiper) new Swiper('#gal-swiper', { slidesPerView: 1, pagination: { el: '#gal-swiper .swiper-pagination', clickable: true }, a11y: { enabled: true }, keyboard: { enabled: true } });
    root.addEventListener('click', function (e) { var g = e.target.closest('.gal'); if (g) lightbox(+g.dataset.i); });
    var mb = $('#mbar'), bc = $('#bookcard'); if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { mb.classList.toggle('is-off', en[0].isIntersecting); }, { threshold: .1 }).observe(bc);
  }

  /* ---------- lightbox ---------- */
  function lightbox(i0) {
    var im = v.images, i = i0, d, x0 = null;
    function show() { var m = im[i], img = $('.lb img', d.el); img.src = ISH.img(m.src); img.alt = m.alt; $('.lb__cap', d.el).textContent = m.alt; $('.lb__n', d.el).textContent = (i + 1) + ' / ' + im.length; $$('.lb__thumbs button', d.el).forEach(function (b, k) { b.setAttribute('aria-current', k === i); }); }
    function go(n) { i = (i + n + im.length) % im.length; show(); }
    d = ISH.openDialog('<button class="dialog__close" data-close aria-label="Close gallery">' + ISH.icon('x') + '</button><div class="lb"><img src="" alt=""><div class="lb__bar"><span class="lb__cap"></span><div><span class="lb__n"></span><button type="button" class="lb__nav" data-d="-1" aria-label="Previous photo">' + ISH.icon('arrow-left') + '</button><button type="button" class="lb__nav" data-d="1" aria-label="Next photo">' + ISH.icon('arrow-right') + '</button></div></div><div class="lb__thumbs">' + im.map(function (m, k) { return '<button type="button" data-k="' + k + '" aria-label="Photo ' + (k + 1) + '"><img src="' + ISH.img(m.src, true) + '" alt=""></button>'; }).join('') + '</div></div>', 'dialog--light');
    d.el.addEventListener('click', function (e) { var n = e.target.closest('[data-d]'); if (n) go(+n.dataset.d); var t = e.target.closest('[data-k]'); if (t) { i = +t.dataset.k; show(); } });
    document.addEventListener('keydown', function kd(e) { if (!document.body.contains(d.el)) return document.removeEventListener('keydown', kd); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
    d.el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true }); d.el.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); x0 = null; });
    show();
  }

  document.addEventListener('DOMContentLoaded', function () { if (!v) notFound(); else render(); });
})();
