/* ISHARVAM VILLAS: shared utilities (data access, dates, pricing, storage, rendering helpers).
   Classic script (no modules) so the site also works when opened from the file system. */
(function () {
  'use strict';
  var C = window.ISH_CONFIG, D = window.ISH_DATA, ISH = window.ISH = window.ISH || {};
  ISH.config = C; ISH.data = D;
  ISH.root = document.documentElement.getAttribute('data-root') || '';
  ISH.reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ISH.isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
  var $ = ISH.$ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = ISH.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  ISH.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- storage (localStorage with in-memory fallback) ---------- */
  var mem = {};
  ISH.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };
  ISH.query = function () { var o = {}; new URLSearchParams(location.search).forEach(function (v, k) { o[k] = v; }); return o; };

  /* ---------- formatting ---------- */
  ISH.inr = function (n) { return '₹' + Math.round(n).toLocaleString('en-IN'); };
  ISH.phone = function (p) { return '+91 ' + p.slice(0, 5) + ' ' + p.slice(5); };
  ISH.plural = function (n, w, p) { return n + ' ' + (n === 1 ? w : (p || w + 's')); };

  /* ---------- dates (ISO yyyy-mm-dd strings, local time) ---------- */
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  ISH.iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  ISH.parse = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  ISH.addDays = function (s, n) { var d = ISH.parse(s); d.setDate(d.getDate() + n); return ISH.iso(d); };
  ISH.diffDays = function (a, b) { return Math.round((ISH.parse(b) - ISH.parse(a)) / 864e5); };
  ISH.today = function () { return ISH.iso(new Date()); };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  ISH.MONTHS = MONTHS; ISH.DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  ISH.fmtDate = function (s, long) { if (!s) return ''; var d = ISH.parse(s); return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3) + (long ? ' ' + d.getFullYear() : ''); };

  /* ---------- data access ---------- */
  ISH.villas = function () { return D.villas; };
  ISH.villa = function (key) { return D.villas.filter(function (v) { return v.id === key || v.slug === key; })[0] || null; };
  ISH.location = function (id) { return D.locations.filter(function (l) { return l.id === id; })[0] || { name: '', region: '' }; };
  ISH.amenity = function (id) { return D.amenities.filter(function (a) { return a.id === id; })[0]; };
  ISH.villaUrl = function (v, extra) { return ISH.root + 'villa.html?v=' + v.slug + (extra ? '&' + extra : ''); };
  /* temporary Pexels demo photos (assets/js/photos.js): remote CDN until downloaded locally by tools/fetch_photos.py */
  var PH = window.ISH_PHOTOS || { remote: false, map: {} };
  ISH.remotePhoto = function (name, small) { var id = PH.remote && PH.map[name.replace(/(-sm)?\.webp$/, '')]; return id ? 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + (small ? 800 : 1800) : null; };
  ISH.img = function (name, small) { return ISH.remotePhoto(name, small) || (ISH.root + C.paths.villas + (small ? name.replace('.webp', '-sm.webp') : name)); };
  ISH.siteImg = function (name, small) { return ISH.remotePhoto(name, small) || (ISH.root + C.paths.site + (small ? name.replace('.webp', '-sm.webp') : name)); };
  /* static <img> tags written in the page HTML */
  document.addEventListener('DOMContentLoaded', function () { if (!PH.remote) return; Array.prototype.forEach.call(document.querySelectorAll('img[src*="assets/img/"]'), function (i) { var m = i.getAttribute('src').match(/([\w-]+?)(-sm)?\.webp$/); var u = m && ISH.remotePhoto(m[1] + '.webp', !!m[2]); if (u) { i.removeAttribute('srcset'); i.src = u; } }); });
  ISH.imgTag = function (file, alt, o) {
    o = o || {}; var base = o.site ? ISH.siteImg : ISH.img;
    return '<img src="' + base(file) + '" srcset="' + base(file, true) + ' 800w, ' + base(file) + ' 1600w" sizes="' + (o.sizes || '(min-width: 900px) 50vw, 100vw') + '" alt="' + ISH.esc(alt || '') + '"' +
      (o.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"' + (o.cls ? ' class="' + o.cls + '"' : '') + '>';
  };
  document.addEventListener('error', function (e) {
    var t = e.target; if (t && t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = 1; t.removeAttribute('srcset'); t.src = ISH.root + C.paths.fallback; t.classList.add('is-fallback'); }
  }, true);
  ISH.icon = function (n, cls) { return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>'; };

  /* ---------- availability & pricing ---------- */
  ISH.blocked = function (id) { return ISH.store.get('ish_blocked_' + id, []); };
  ISH.bookedSet = function (v) {
    var set = {}, t = ISH.today();
    v.bookedRanges.forEach(function (r) { for (var i = 0; i < r[1]; i++) set[ISH.addDays(t, r[0] + i)] = 1; });
    ISH.blocked(v.id).forEach(function (d) { set[d] = 1; });
    return set;
  };
  ISH.isAvailable = function (v, a, b) {
    if (!a || !b) return true; var set = ISH.bookedSet(v), n = ISH.diffDays(a, b);
    for (var i = 0; i < n; i++) if (set[ISH.addDays(a, i)]) return false; return true;
  };
  ISH.nextFree = function (v) { var set = ISH.bookedSet(v), t = ISH.today(); for (var i = 0; i < 200; i++) { var d = ISH.addDays(t, i); if (!set[d]) return d; } return null; };
  ISH.quote = function (v, a, b, guests) {
    var n = ISH.diffDays(a, b); if (!(n > 0)) return null;
    var B = C.booking, base = 0, wk = 0, i;
    for (i = 0; i < n; i++) { var dow = ISH.parse(ISH.addDays(a, i)).getDay(); base += v.pricePerNight; if (B.weekendDays.indexOf(dow) > -1) wk += v.pricePerNight * (B.weekendMultiplier - 1); }
    var sub = base + wk, tax = (sub + B.cleaningFee) * B.taxRate;
    return { nights: n, base: base, weekend: wk, cleaning: B.cleaningFee, tax: tax, total: sub + B.cleaningFee + tax, guests: guests };
  };
  ISH.waLink = function (text) { return 'https://wa.me/' + C.contact.whatsapp + '?text=' + encodeURIComponent(text); };

  /* ---------- bookings (sample + browser-local demo requests) ---------- */
  ISH.bookings = {
    all: function () {
      var t = ISH.today(), ov = ISH.store.get('ish_status', {});
      var sample = D.sampleBookings.map(function (b) { var ci = ISH.addDays(t, b.checkInOffset); return Object.assign({}, b, { checkIn: ci, checkOut: ISH.addDays(ci, b.nights), sample: true }); });
      var mine = ISH.store.get('ish_requests', []);
      return mine.concat(sample).map(function (b) { if (ov[b.ref]) b.status = ov[b.ref]; return b; });
    },
    mine: function () { return ISH.store.get('ish_requests', []).map(function (b) { var ov = ISH.store.get('ish_status', {}); if (ov[b.ref]) b.status = ov[b.ref]; return b; }); },
    add: function (b) { var l = ISH.store.get('ish_requests', []); l.unshift(b); ISH.store.set('ish_requests', l); },
    setStatus: function (ref, s) { var ov = ISH.store.get('ish_status', {}); ov[ref] = s; ISH.store.set('ish_status', ov); },
    find: function (ref) { return ISH.bookings.all().filter(function (b) { return b.ref === ref; })[0]; }
  };

  /* ---------- wishlist & compare ---------- */
  ISH.wish = {
    list: function () { return ISH.store.get('ish_wish', []); },
    has: function (id) { return ISH.wish.list().indexOf(id) > -1; },
    toggle: function (id) { var l = ISH.wish.list(), i = l.indexOf(id); if (i > -1) l.splice(i, 1); else l.push(id); ISH.store.set('ish_wish', l); return i === -1; }
  };
  ISH.compare = {
    list: function () { return ISH.store.get('ish_compare', []); },
    toggle: function (id) { var l = ISH.compare.list(), i = l.indexOf(id); if (i > -1) l.splice(i, 1); else { if (l.length >= 3) return false; l.push(id); } ISH.store.set('ish_compare', l); document.dispatchEvent(new CustomEvent('ish:compare')); return true; },
    clear: function () { ISH.store.set('ish_compare', []); document.dispatchEvent(new CustomEvent('ish:compare')); }
  };

  /* ---------- toast ---------- */
  ISH.toast = function (msg, type) {
    var w = $('.toasts'); if (!w) { w = document.createElement('div'); w.className = 'toasts'; w.setAttribute('role', 'status'); w.setAttribute('aria-live', 'polite'); document.body.appendChild(w); }
    var t = document.createElement('div'); t.className = 'toast' + (type ? ' toast--' + type : ''); t.textContent = msg; w.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-in'); });
    setTimeout(function () { t.classList.remove('is-in'); setTimeout(function () { t.remove(); }, 400); }, 3400);
  };

  /* ---------- villa card ---------- */
  ISH.villaCard = function (v, o) {
    o = o || {}; var loc = ISH.location(v.locationId), w = ISH.wish.has(v.id), cmp = ISH.compare.list().indexOf(v.id) > -1;
    var q = o.query ? '&' + o.query : '';
    return '<article class="vcard ' + (o.cls || '') + '" data-id="' + v.id + '">' +
      '<a class="vcard__media" href="' + ISH.villaUrl(v, o.query) + '" aria-label="' + ISH.esc(v.name) + '">' + ISH.imgTag(v.images[0].file || v.images[0].src, v.images[0].alt, { sizes: o.sizes || '(min-width: 900px) 33vw, 100vw' }) +
      '<span class="vcard__lights" aria-hidden="true"><i></i><i></i><i></i></span></a>' +
      '<button class="vcard__wish js-wish' + (w ? ' is-on' : '') + '" type="button" data-id="' + v.id + '" aria-pressed="' + w + '" aria-label="Save ' + ISH.esc(v.name) + ' to wishlist">' + ISH.icon('heart') + '</button>' +
      '<div class="vcard__body"><p class="eyebrow">' + ISH.esc(loc.name) + ' · ' + ISH.esc(v.category) + '</p>' +
      '<h3 class="vcard__title"><a href="' + ISH.villaUrl(v, o.query) + '">' + ISH.esc(v.name) + '</a></h3><p class="vcard__tag">' + ISH.esc(v.tagline) + '</p>' +
      '<ul class="specs"><li>' + ISH.icon('bed-double') + v.bedrooms + ' bed</li><li>' + ISH.icon('bath') + v.bathrooms + ' bath</li><li>' + ISH.icon('users') + 'up to ' + v.maxGuests + '</li></ul>' +
      '<div class="vcard__foot"><p class="price"><span>from</span> ' + ISH.inr(v.pricePerNight) + '<small> / night</small></p>' +
      (o.compare ? '<label class="check check--sm"><input type="checkbox" class="js-compare" data-id="' + v.id + '"' + (cmp ? ' checked' : '') + '><span>Compare</span></label>' : '') + '</div></div></article>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.js-wish'); if (!b) return; e.preventDefault();
    var on = ISH.wish.toggle(b.dataset.id); $$('.js-wish[data-id="' + b.dataset.id + '"]').forEach(function (x) { x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on); });
    ISH.toast(on ? 'Saved to your wishlist' : 'Removed from wishlist');
  });

  /* ---------- scroll reveal (no GSAP needed) ---------- */
  ISH.initReveal = function (root) {
    var els = $$('[data-reveal]:not(.is-in)', root); if (!els.length) return;
    if (ISH.reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    /* clip-path masked elements have no visible area to intersect, so their wrapper is observed instead */
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { (x.target._ishFor || [x.target]).forEach(function (t) { t.classList.add('is-in'); }); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(function (e) { var t = e.getAttribute('data-reveal') === 'mask' && e.parentElement ? e.parentElement : e; (t._ishFor = t._ishFor || []).push(e); io.observe(t); });
  };
  ISH.focusTrap = function (box) {
    function h(e) { if (e.key !== 'Tab') return; var f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])', box).filter(function (x) { return x.offsetParent !== null; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    box.addEventListener('keydown', h); return function () { box.removeEventListener('keydown', h); };
  };
  ISH.validators = {
    required: function (v) { return v.trim() ? '' : 'This field is required.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address.'; },
    phone: function (v) { return /^(\+?91)?[\s-]?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim()) ? '' : 'Enter a valid 10-digit mobile number.'; },
    password: function (v) { return v.length >= 8 && /\d/.test(v) && /[A-Za-z]/.test(v) ? '' : 'Use 8+ characters with letters and a number.'; }
  };
  /* Generic form validation: inputs declare data-rules="required,email". Returns true when valid. */
  ISH.validateForm = function (form) {
    var ok = true, first = null;
    $$('[data-rules]', form).forEach(function (f) {
      var err = '', rules = f.dataset.rules.split(',');
      for (var i = 0; i < rules.length && !err; i++) {
        var r = rules[i].trim();
        if (f.type === 'checkbox') { if (r === 'required' && !f.checked) err = 'Please tick to continue.'; }
        else if (r === 'match') { var o = $('[name="' + f.dataset.match + '"]', form); if (o && o.value !== f.value) err = 'Passwords do not match.'; }
        else if (ISH.validators[r] && (r === 'required' || f.value.trim())) err = ISH.validators[r](f.value);
      }
      var wrap = f.closest('.field') || f.parentNode, msg = $('.field__err', wrap);
      if (!msg) { msg = document.createElement('p'); msg.className = 'field__err'; msg.id = (f.id || f.name) + '-err'; wrap.appendChild(msg); }
      msg.textContent = err; wrap.classList.toggle('has-error', !!err); f.setAttribute('aria-invalid', err ? 'true' : 'false'); if (err) f.setAttribute('aria-describedby', msg.id); else f.removeAttribute('aria-describedby');
      if (err) { ok = false; if (!first) first = f; }
    });
    if (first) first.focus(); return ok;
  };
  document.addEventListener('DOMContentLoaded', function () { ISH.initReveal(); });
})();
