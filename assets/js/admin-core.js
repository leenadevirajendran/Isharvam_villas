/* ISHARVAM VILLAS: admin (frontend-only demo). No login, no server. State is kept in this browser (localStorage).
   Future PHP phase: replace the ISH.admin.data layer with API calls; keep the rendering. */
(function () {
  'use strict';
  var ISH = window.ISH, D = window.ISH_DATA, C = window.ISH_CONFIG, E = ISH.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var A = ISH.admin = {};

  /* ---- data layer (browser-local overrides on top of mock data) ---- */
  A.villas = function () { var ov = ISH.store.get('ish_admin_villas', {}), extra = ISH.store.get('ish_admin_new', []); return D.villas.concat(extra).map(function (v) { return ov[v.id] ? Object.assign({}, v, ov[v.id]) : v; }); };
  A.saveVilla = function (id, patch) { var ov = ISH.store.get('ish_admin_villas', {}); ov[id] = Object.assign(ov[id] || {}, patch); ISH.store.set('ish_admin_villas', ov); };
  A.villa = function (id) { return A.villas().filter(function (v) { return v.id === id; })[0]; };
  A.img = function (v, i) { var im = v.images[i || 0]; return im ? (im.data || ISH.img(im.src, true)) : ISH.siteImg('fallback.webp'); };
  A.loc = function (id) { return ISH.location(id) || { name: id }; };
  A.statuses = ['Requested', 'Confirmed', 'Payment received', 'Completed', 'Cancelled'];
  A.badge = function (s) { var c = { Requested: 'warn', Confirmed: 'info', 'Payment received': 'ok', Completed: 'ok', Cancelled: 'err' }[s] || ''; return '<span class="badge badge--' + c + '">' + E(s) + '</span>'; };
  A.stat = function (label, val, note, icon) { return '<div class="stat"><span class="stat__ic">' + ISH.icon(icon || 'trending-up') + '</span><p class="stat__l">' + E(label) + '</p><p class="stat__v">' + val + '</p><p class="stat__n">' + E(note || '') + '</p></div>'; };
  A.empty = function (m) { return '<p class="a-empty">' + E(m) + '</p>'; };
  A.csv = function (name, rows) {
    var t = rows.map(function (r) { return r.map(function (c) { return '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/csv' })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); ISH.toast('Downloaded ' + name + ' (sample data)', 'ok');
  };
  A.modal = function (html, cls) {
    var w = document.createElement('div'); w.className = 'a-modal ' + (cls || ''); w.innerHTML = '<div class="a-modal__s"></div><div class="a-modal__p" role="dialog" aria-modal="true" tabindex="-1">' + html + '</div>'; document.body.appendChild(w);
    var prev = document.activeElement, p = $('.a-modal__p', w);
    function close() { document.removeEventListener('keydown', k); w.remove(); prev && prev.focus && prev.focus(); }
    function k(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', k); $('.a-modal__s', w).addEventListener('click', close); $$('[data-close]', w).forEach(function (b) { b.addEventListener('click', close); }); p.focus(); return { el: w, close: close };
  };
  A.confirm = function (msg, ok, cb) { var m = A.modal('<h2>' + E(msg) + '</h2><p class="muted">This only affects this browser.</p><div class="a-row"><button class="btn btn--ghost" data-close type="button">Cancel</button><button class="btn btn--primary" data-ok type="button">' + E(ok) + '</button></div>'); $('[data-ok]', m.el).addEventListener('click', function () { m.close(); cb(); }); };

  /* ---- shell ---- */
  function shell() {
    var nav = document.body.dataset.nav; $$('.admin-nav a').forEach(function (a) { if (a.dataset.navLink === nav) a.setAttribute('aria-current', 'page'); });
    var b = $('.admin-menu'), s = $('#admin-side');
    function set(o) { s.classList.toggle('is-open', o); document.body.classList.toggle('no-scroll', o && innerWidth < 1000); b.setAttribute('aria-expanded', o); }
    b.addEventListener('click', function () { set(!s.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    s.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    var sc = document.createElement('div'); sc.className = 'admin-scrim'; sc.addEventListener('click', function () { set(false); }); document.body.appendChild(sc);
    s.classList.add('js'); document.body.classList.add('js-on');
  }

  var P = {};
  /* ---- dashboard ---- */
  P.dashboard = function () {
    var bk = ISH.bookings.all(), vs = A.villas(), t = ISH.today(), open = bk.filter(function (b) { return b.status === 'Requested'; }), rev = bk.filter(function (b) { return /Confirmed|Payment|Completed/.test(b.status); }).reduce(function (s, b) { return s + (b.total || 0); }, 0);
    var inn = bk.filter(function (b) { return b.checkIn >= t && b.status !== 'Cancelled'; }).sort(function (a, b) { return a.checkIn < b.checkIn ? -1 : 1; });
    var occ = 0, tot = 0; vs.forEach(function (v) { var set = ISH.bookedSet(v); for (var i = 0; i < 30; i++) { tot++; if (set[ISH.addDays(t, i)]) occ++; } });
    $('#stats').innerHTML = A.stat('Villas listed', vs.length, 'Sample portfolio', 'house') + A.stat('Requests awaiting reply', open.length, 'Requested status', 'bell') + A.stat('Next 30 days occupancy', Math.round(occ / tot * 100) + '%', 'From bookings and blocks', 'calendar-days') + A.stat('Confirmed value', ISH.inr(rev), 'Totals, not real revenue', 'indian-rupee');
    $('#recent').innerHTML = bk.slice(0, 6).map(function (b) { var v = ISH.villa(b.villaId); return '<tr><td data-l="Ref">' + E(b.ref) + '</td><td data-l="Villa">' + E(v ? v.name : b.villaId) + '</td><td data-l="Guest">' + E(b.guest) + '</td><td data-l="Dates">' + ISH.fmtDate(b.checkIn) + ' to ' + ISH.fmtDate(b.checkOut) + '</td><td data-l="Status">' + A.badge(b.status) + '</td></tr>'; }).join('');
    $('#upcoming').innerHTML = inn.length ? inn.slice(0, 5).map(function (b) { var v = ISH.villa(b.villaId); return '<li><b>' + ISH.fmtDate(b.checkIn) + '</b><span>' + E(v ? v.name : '') + ' · ' + E(b.guest) + '</span></li>'; }).join('') : '<li>' + A.empty('No upcoming stays.') + '</li>';
    var cats = {}; vs.forEach(function (v) { cats[v.category] = (cats[v.category] || 0) + 1; }); var mx = Math.max.apply(null, Object.keys(cats).map(function (k) { return cats[k]; }));
    $('#mix').innerHTML = Object.keys(cats).map(function (k) { return '<li><span>' + E(k) + '</span><i style="--w:' + (cats[k] / mx * 100) + '%"></i><b>' + cats[k] + '</b></li>'; }).join('');
  };

  /* ---- villas list ---- */
  P.villas = function () {
    var q = $('#q'), cat = $('#cat'); cat.innerHTML = '<option value="">All categories</option>' + D.categories.map(function (c) { return '<option>' + E(c) + '</option>'; }).join('');
    function draw() {
      var s = q.value.toLowerCase(), vs = A.villas().filter(function (v) { return (!s || (v.name + ' ' + v.id + ' ' + A.loc(v.locationId).name).toLowerCase().indexOf(s) > -1) && (!cat.value || v.category === cat.value); });
      $('#rows').innerHTML = vs.length ? vs.map(function (v) { var pub = v.published !== false;
        return '<tr><td data-l="Villa"><div class="a-villa"><img src="' + A.img(v) + '" alt="" width="64" height="48"><div><b>' + E(v.name) + '</b><small>' + E(v.id) + '</small></div></div></td><td data-l="Location">' + E(A.loc(v.locationId).name) + '</td><td data-l="Category">' + E(v.category) + '</td><td data-l="Sleeps">' + v.bedrooms + ' bed · ' + v.maxGuests + ' guests</td><td data-l="Rate">' + ISH.inr(v.pricePerNight) + '</td><td data-l="Status"><button class="pill-toggle ' + (pub ? 'is-on' : '') + '" data-pub="' + v.id + '" type="button" aria-pressed="' + pub + '">' + (pub ? 'Published' : 'Draft') + '</button></td><td data-l=""><a class="btn btn--ghost btn--sm" href="villa-edit.html?id=' + v.id + '">Edit</a> <a class="btn btn--text btn--sm" href="' + ISH.villaUrl(v) + '" target="_blank" rel="noopener">View</a></td></tr>'; }).join('') : '<tr><td colspan="7">' + A.empty('No villas match.') + '</td></tr>';
      $('#cnt').textContent = ISH.plural(vs.length, 'villa');
    }
    q.addEventListener('input', draw); cat.addEventListener('change', draw);
    $('#rows').addEventListener('click', function (e) { var b = e.target.closest('[data-pub]'); if (!b) return; var v = A.villa(b.dataset.pub); A.saveVilla(v.id, { published: v.published === false }); ISH.toast(v.name + (v.published === false ? ' published (demo)' : ' set to draft (demo)'), 'ok'); draw(); });
    draw();
  };

  /* ---- villa edit / add ---- */
  P['villa-edit'] = function () {
    var id = ISH.query().id, v = id ? A.villa(id) : null, isNew = !v, f = $('#vf');
    $('#vtitle').textContent = isNew ? 'Add a villa' : 'Edit ' + v.name; v = v || { id: 'ISH-NEW', name: '', tagline: '', locationId: D.locations[0].id, category: D.categories[0], bedrooms: 3, bathrooms: 3, maxGuests: 6, pricePerNight: 30000, description: [''], amenities: [], highlights: [], images: [] };
    $('[name=locationId]', f).innerHTML = D.locations.map(function (l) { return '<option value="' + l.id + '">' + E(l.name) + '</option>'; }).join('');
    $('[name=category]', f).innerHTML = D.categories.map(function (c) { return '<option>' + E(c) + '</option>'; }).join('');
    ['name', 'tagline', 'locationId', 'category', 'bedrooms', 'bathrooms', 'maxGuests', 'pricePerNight'].forEach(function (k) { $('[name=' + k + ']', f).value = v[k]; });
    $('[name=description]', f).value = v.description.join('\n\n'); $('[name=highlights]', f).value = v.highlights.join('\n');
    var groups = {}; D.amenities.forEach(function (a) { (groups[a.group] = groups[a.group] || []).push(a); });
    $('#amen').innerHTML = Object.keys(groups).map(function (g) { return '<fieldset class="a-fs"><legend>' + E(g) + '</legend>' + groups[g].map(function (a) { return '<label class="check"><input type="checkbox" name="am" value="' + a.id + '"' + (v.amenities.indexOf(a.id) > -1 ? ' checked' : '') + '><span>' + E(a.label) + '</span></label>'; }).join('') + '</fieldset>'; }).join('');
    $('#imgs').innerHTML = v.images.length ? v.images.map(function (im, i) { return '<figure><img src="' + (im.data || ISH.img(im.src, true)) + '" alt="' + E(im.alt) + '"><figcaption>' + (i === 0 ? 'Cover · ' : '') + E(im.alt) + '</figcaption></figure>'; }).join('') : A.empty('No photos yet. Add them on the Gallery screen after saving.');
    if (isNew) $('#del').hidden = true;
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (!ISH.validateForm(f)) { ISH.toast('Please fix the highlighted fields', 'err'); return; }
      var fd = function (k) { return f.elements[k].value.trim(); };
      var p = { name: fd('name'), tagline: fd('tagline'), locationId: fd('locationId'), category: fd('category'), bedrooms: +fd('bedrooms'), bathrooms: +fd('bathrooms'), maxGuests: +fd('maxGuests'), pricePerNight: +fd('pricePerNight'), description: fd('description').split(/\n\s*\n/), highlights: fd('highlights').split('\n').filter(Boolean), amenities: $$('[name=am]:checked', f).map(function (c) { return c.value; }) };
      if (isNew) { var l = ISH.store.get('ish_admin_new', []), nid = 'ISH-V' + (D.villas.length + l.length + 1); l.push(Object.assign({ id: nid, slug: 'villa-' + p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), images: [], bookedRanges: [], featured: false, published: false, shortDescription: '' }, p)); ISH.store.set('ish_admin_new', l); ISH.toast('Villa added as a draft (demo)', 'ok'); setTimeout(function () { location.href = 'villas.html'; }, 700); }
      else { A.saveVilla(v.id, p); ISH.toast('Saved in this browser (demo). The public site is unchanged.', 'ok'); }
    });
    $('#del').addEventListener('click', function () { A.confirm('Set ' + v.name + ' to draft?', 'Set to draft', function () { A.saveVilla(v.id, { published: false }); ISH.toast('Set to draft (demo)', 'ok'); }); });
  };

  /* ---- gallery ---- */
  P.gallery = function () {
    var sel = $('#gv'), vs = A.villas(); sel.innerHTML = vs.map(function (v) { return '<option value="' + v.id + '">' + E(v.name) + '</option>'; }).join(''); var q = ISH.query().id; if (q) sel.value = q;
    var cur, items;
    function load() { cur = A.villa(sel.value); items = ISH.store.get('ish_gal_' + cur.id, null) || cur.images.map(function (i) { return { src: i.src, alt: i.alt }; }); draw(); }
    function save() { ISH.store.set('ish_gal_' + cur.id, items); }
    function draw() {
      $('#grid').innerHTML = items.length ? items.map(function (im, i) { return '<li draggable="true" data-i="' + i + '"><img src="' + (im.data || ISH.img(im.src, true)) + '" alt="' + E(im.alt) + '"><span class="g-n">' + (i === 0 ? 'Cover' : i + 1) + '</span><div class="g-act"><button type="button" data-a="up" aria-label="Move earlier"' + (i === 0 ? ' disabled' : '') + '>' + ISH.icon('arrow-left') + '</button><button type="button" data-a="dn" aria-label="Move later"' + (i === items.length - 1 ? ' disabled' : '') + '>' + ISH.icon('arrow-right') + '</button><button type="button" data-a="alt" aria-label="Edit caption">' + ISH.icon('pencil') + '</button><button type="button" data-a="rm" aria-label="Remove photo">' + ISH.icon('trash-2') + '</button></div><small>' + E(im.alt) + '</small></li>'; }).join('') : '<li class="g-empty">' + A.empty('No photos. Upload one below.') + '</li>';
    }
    function mv(i, j) { if (j < 0 || j >= items.length) return; items.splice(j, 0, items.splice(i, 1)[0]); save(); draw(); }
    $('#grid').addEventListener('click', function (e) { var b = e.target.closest('[data-a]'); if (!b) return; var i = +b.closest('li').dataset.i, a = b.dataset.a;
      if (a === 'up') mv(i, i - 1); if (a === 'dn') mv(i, i + 1);
      if (a === 'rm') A.confirm('Remove this photo?', 'Remove', function () { items.splice(i, 1); save(); draw(); ISH.toast('Photo removed (demo)', 'ok'); });
      if (a === 'alt') { var m = A.modal('<h2>Photo caption (alt text)</h2><label class="field"><span class="label">Describe the photo for screen readers</span><input class="input" value="' + E(items[i].alt) + '"></label><div class="a-row"><button class="btn btn--ghost" data-close type="button">Cancel</button><button class="btn btn--primary" data-ok type="button">Save</button></div>'); $('[data-ok]', m.el).addEventListener('click', function () { items[i].alt = $('input', m.el).value || items[i].alt; save(); draw(); m.close(); }); } });
    var drag = null; var g = $('#grid');
    g.addEventListener('dragstart', function (e) { var li = e.target.closest('li[data-i]'); if (!li) return; drag = +li.dataset.i; e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', drag); } catch (x) {} li.classList.add('is-drag'); });
    g.addEventListener('dragover', function (e) { if (drag !== null) e.preventDefault(); });
    g.addEventListener('drop', function (e) { var li = e.target.closest('li[data-i]'); if (drag === null || !li) return; e.preventDefault(); mv(drag, +li.dataset.i); drag = null; });
    g.addEventListener('dragend', function () { drag = null; $$('.is-drag', g).forEach(function (x) { x.classList.remove('is-drag'); }); });
    function files(list) { Array.prototype.forEach.call(list, function (f) { if (!/^image\//.test(f.type)) { ISH.toast(f.name + ' is not an image', 'err'); return; } if (f.size > 2e6) { ISH.toast(f.name + ' is over 2 MB; please use a smaller file', 'err'); return; } var r = new FileReader(); r.onload = function () { items.push({ data: r.result, alt: f.name.replace(/\.\w+$/, '') }); try { save(); } catch (x) {} draw(); ISH.toast('Preview added. Nothing is uploaded anywhere (demo).', 'ok'); }; r.readAsDataURL(f); }); }
    $('#file').addEventListener('change', function () { files(this.files); this.value = ''; });
    var dz = $('#drop'); ['dragenter', 'dragover'].forEach(function (n) { dz.addEventListener(n, function (e) { if (drag === null) { e.preventDefault(); dz.classList.add('is-over'); } }); }); ['dragleave', 'drop'].forEach(function (n) { dz.addEventListener(n, function () { dz.classList.remove('is-over'); }); }); dz.addEventListener('drop', function (e) { if (drag === null) { e.preventDefault(); files(e.dataTransfer.files); } });
    $('#reset').addEventListener('click', function () { ISH.store.del('ish_gal_' + cur.id); load(); ISH.toast('Gallery reset', 'ok'); });
    sel.addEventListener('change', load); load();
  };

  /* ---- pricing ---- */
  P.pricing = function () {
    var B = C.booking;
    $('#rules').innerHTML = '<div><dt>Weekend uplift</dt><dd>+' + Math.round((B.weekendMultiplier - 1) * 100) + '% (Fri and Sat nights)</dd></div><div><dt>Cleaning fee</dt><dd>' + ISH.inr(B.cleaningFee) + ' per stay</dd></div><div><dt>Tax</dt><dd>' + Math.round(B.taxRate * 100) + '%</dd></div><div><dt>Minimum stay</dt><dd>' + ISH.plural(B.minNights, 'night') + '</dd></div>';
    function draw() { $('#rows').innerHTML = A.villas().map(function (v) { var o = ISH.store.get('ish_admin_villas', {})[v.id]; var ch = o && o.pricePerNight != null && o.pricePerNight !== (D.villas.filter(function (x) { return x.id === v.id; })[0] || {}).pricePerNight;
      return '<tr><td data-l="Villa"><b>' + E(v.name) + '</b></td><td data-l="Base / night"><label class="sr-only" for="p-' + v.id + '">Rate for ' + E(v.name) + '</label><input id="p-' + v.id + '" class="input input--sm" type="number" min="1000" step="500" value="' + v.pricePerNight + '" data-id="' + v.id + '"></td><td data-l="Fri / Sat">' + ISH.inr(v.pricePerNight * B.weekendMultiplier) + '</td><td data-l="2-night stay (weekday)">' + ISH.inr(ISH.quote(v, ISH.addDays(ISH.today(), 1), ISH.addDays(ISH.today(), 3)).total) + '</td><td data-l="">' + (ch ? '<span class="badge badge--warn">Edited</span>' : '') + '</td></tr>'; }).join(''); }
    $('#rows').addEventListener('change', function (e) { var i = e.target; if (!i.dataset.id) return; var n = +i.value; if (!(n >= 1000)) { ISH.toast('Enter a rate of at least ₹1,000', 'err'); draw(); return; } A.saveVilla(i.dataset.id, { pricePerNight: n }); ISH.toast('Rate updated in this browser (demo)', 'ok'); draw(); });
    $('#reset').addEventListener('click', function () { var ov = ISH.store.get('ish_admin_villas', {}); Object.keys(ov).forEach(function (k) { delete ov[k].pricePerNight; }); ISH.store.set('ish_admin_villas', ov); draw(); ISH.toast('Rates reset to sample values', 'ok'); });
    draw();
  };

  /* ---- availability ---- */
  P.availability = function () {
    var sel = $('#av'), vs = A.villas(), view, today = ISH.today(); sel.innerHTML = vs.map(function (v) { return '<option value="' + v.id + '">' + E(v.name) + '</option>'; }).join(''); var qid = ISH.query().id; if (qid) sel.value = qid;
    view = today.slice(0, 7) + '-01'; var MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    function draw() {
      var v = A.villa(sel.value), booked = {}, t = today; v.bookedRanges.forEach(function (r) { for (var i = 0; i < r[1]; i++) booked[ISH.addDays(t, r[0] + i)] = 1; }); var bl = ISH.blocked(v.id), d0 = ISH.parse(view), y = d0.getFullYear(), m = d0.getMonth(), first = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate();
      $('#mt').textContent = MN[m] + ' ' + y; var h = '';
      ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(function (d) { h += '<span class="ac__h">' + d + '</span>'; }); for (var i = 0; i < first; i++) h += '<span></span>';
      for (var d = 1; d <= n; d++) { var iso = ISH.iso(new Date(y, m, d)), past = iso < today, st = booked[iso] ? 'booked' : bl.indexOf(iso) > -1 ? 'blocked' : 'free';
        h += '<button type="button" class="ac__d is-' + st + '" data-d="' + iso + '"' + (past || st === 'booked' ? ' disabled' : '') + ' aria-label="' + ISH.fmtDate(iso, true) + ', ' + (st === 'free' ? 'available' : st === 'booked' ? 'booked' : 'blocked by owner') + '">' + d + '</button>'; }
      $('#cal').innerHTML = h; $('#prev').disabled = view <= today.slice(0, 7) + '-01';
      var lst = bl.filter(function (x) { return x >= today; }).sort(); $('#bl').innerHTML = lst.length ? lst.map(function (x) { return '<li>' + ISH.fmtDate(x, true) + ' <button class="btn btn--text btn--sm" data-un="' + x + '" type="button">Unblock</button></li>'; }).join('') : '<li class="muted">No owner blocks for this villa.</li>';
    }
    $('#cal').addEventListener('click', function (e) { var b = e.target.closest('.ac__d'); if (!b) return; var v = A.villa(sel.value), l = ISH.blocked(v.id), i = l.indexOf(b.dataset.d); if (i > -1) l.splice(i, 1); else l.push(b.dataset.d); ISH.store.set('ish_blocked_' + v.id, l); ISH.toast(ISH.fmtDate(b.dataset.d) + (i > -1 ? ' is open again' : ' blocked') + '. The public calendar will reflect this in this browser.', 'ok'); draw(); var nb = $('.ac__d[data-d="' + b.dataset.d + '"]'); nb && nb.focus(); });
    $('#bl').addEventListener('click', function (e) { var b = e.target.closest('[data-un]'); if (!b) return; var v = A.villa(sel.value), l = ISH.blocked(v.id).filter(function (x) { return x !== b.dataset.un; }); ISH.store.set('ish_blocked_' + v.id, l); draw(); });
    $('#prev').addEventListener('click', function () { var d = ISH.parse(view); view = ISH.iso(new Date(d.getFullYear(), d.getMonth() - 1, 1)); draw(); });
    $('#next').addEventListener('click', function () { var d = ISH.parse(view); view = ISH.iso(new Date(d.getFullYear(), d.getMonth() + 1, 1)); draw(); });
    sel.addEventListener('change', draw); draw();
  };

  /* ---- bookings ---- */
  P.bookings = function () {
    var fs = $('#fs'), q = $('#q'); fs.innerHTML = '<option value="">All statuses</option>' + A.statuses.map(function (s) { return '<option>' + s + '</option>'; }).join('');
    function rows() { var s = q.value.toLowerCase(); return ISH.bookings.all().filter(function (b) { var v = ISH.villa(b.villaId); return (!fs.value || b.status === fs.value) && (!s || (b.ref + ' ' + b.guest + ' ' + (v ? v.name : '')).toLowerCase().indexOf(s) > -1); }); }
    function draw() { var r = rows(); $('#cnt').textContent = ISH.plural(r.length, 'booking request');
      $('#rows').innerHTML = r.length ? r.map(function (b) { var v = ISH.villa(b.villaId); return '<tr><td data-l="Ref"><b>' + E(b.ref) + '</b>' + (b.sample ? '<small>Website</small>' : '<small>Website request</small>') + '</td><td data-l="Villa">' + E(v ? v.name : b.villaId) + '</td><td data-l="Guest">' + E(b.guest) + '<small>' + E(b.phone || '') + '</small></td><td data-l="Stay">' + ISH.fmtDate(b.checkIn) + ' to ' + ISH.fmtDate(b.checkOut, true) + '<small>' + ISH.plural(ISH.diffDays(b.checkIn, b.checkOut), 'night') + ' · ' + ISH.plural(b.guests, 'guest') + '</small></td><td data-l="Total">' + ISH.inr(b.total || 0) + '</td><td data-l="Status"><label class="sr-only" for="s-' + b.ref + '">Status for ' + E(b.ref) + '</label><select id="s-' + b.ref + '" class="input input--sm" data-ref="' + E(b.ref) + '">' + A.statuses.map(function (s) { return '<option' + (s === b.status ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></td><td data-l=""><button class="btn btn--ghost btn--sm" data-view="' + E(b.ref) + '" type="button">Details</button></td></tr>'; }).join('') : '<tr><td colspan="7">' + A.empty('No bookings match.') + '</td></tr>'; }
    $('#rows').addEventListener('change', function (e) { var s = e.target; if (!s.dataset.ref) return; ISH.bookings.setStatus(s.dataset.ref, s.value); ISH.toast(s.dataset.ref + ' set to ' + s.value + ' (demo)', 'ok'); });
    $('#rows').addEventListener('click', function (e) { var b = e.target.closest('[data-view]'); if (!b) return; var k = ISH.bookings.find(b.dataset.view), v = ISH.villa(k.villaId);
      var msg = 'Hello ' + k.guest.replace(' (sample)', '') + ', this is Isharvam Villas about your request ' + k.ref + ' for ' + (v ? v.name : '') + ' (' + ISH.fmtDate(k.checkIn) + ' to ' + ISH.fmtDate(k.checkOut) + ').';
      A.modal('<h2>' + E(k.ref) + '</h2><dl class="a-dl"><div><dt>Villa</dt><dd>' + E(v ? v.name : '') + '</dd></div><div><dt>Guest</dt><dd>' + E(k.guest) + '</dd></div><div><dt>Phone</dt><dd>' + E(k.phone || '') + '</dd></div><div><dt>Email</dt><dd>' + E(k.email || '') + '</dd></div><div><dt>Stay</dt><dd>' + ISH.fmtDate(k.checkIn, true) + ' to ' + ISH.fmtDate(k.checkOut, true) + '</dd></div><div><dt>Guests</dt><dd>' + k.guests + '</dd></div><div><dt>Quoted total</dt><dd>' + ISH.inr(k.total || 0) + '</dd></div><div><dt>Status</dt><dd>' + A.badge(k.status) + '</dd></div></dl>' + (k.sample ? '' : '') + '<div class="a-row"><button class="btn btn--ghost" data-close type="button">Close</button>' + (k.sample ? '' : '<a class="btn btn--primary" target="_blank" rel="noopener" href="' + ISH.waLink(msg) + '">Message on WhatsApp</a>') + '</div>'); });
    q.addEventListener('input', draw); fs.addEventListener('change', draw);
    $('#export').addEventListener('click', function () { A.csv('isharvam-bookings.csv', [['Ref', 'Villa', 'Guest', 'Check-in', 'Check-out', 'Guests', 'Total', 'Status']].concat(rows().map(function (b) { var v = ISH.villa(b.villaId); return [b.ref, v ? v.name : '', b.guest, b.checkIn, b.checkOut, b.guests, b.total, b.status]; }))); });
    draw();
  };

  /* ---- guests ---- */
  P.guests = function () {
    var g = {}; ISH.bookings.all().forEach(function (b) { var k = b.email || b.guest; if (!g[k]) g[k] = { name: b.guest, email: b.email, phone: b.phone, n: 0, spend: 0, last: '' }; g[k].n++; if (b.status !== 'Cancelled') g[k].spend += b.total || 0; if (b.checkIn > g[k].last) g[k].last = b.checkIn; });
    var l = Object.keys(g).map(function (k) { return g[k]; }); $('#rows').innerHTML = l.length ? l.map(function (x) { return '<tr><td data-l="Guest"><b>' + E(x.name) + '</b></td><td data-l="Email">' + E(x.email || '') + '</td><td data-l="Phone">' + E(x.phone || '') + '</td><td data-l="Requests">' + x.n + '</td><td data-l="Value">' + ISH.inr(x.spend) + '</td><td data-l="Latest stay">' + ISH.fmtDate(x.last, true) + '</td></tr>'; }).join('') : '<tr><td colspan="6">' + A.empty('No guests yet.') + '</td></tr>'; $('#cnt').textContent = ISH.plural(l.length, 'guest') + ' (sample data)';
  };

  /* ---- payments ---- */
  P.payments = function () {
    var r = ISH.bookings.all().filter(function (b) { return b.status !== 'Cancelled'; });
    function draw() { var all = ISH.bookings.all().filter(function (b) { return b.status !== 'Cancelled'; }); $('#rows').innerHTML = all.map(function (b) { var v = ISH.villa(b.villaId), paid = /Payment|Completed/.test(b.status);
      return '<tr><td data-l="Ref"><b>' + E(b.ref) + '</b></td><td data-l="Guest">' + E(b.guest) + '</td><td data-l="Villa">' + E(v ? v.name : '') + '</td><td data-l="Amount">' + ISH.inr(b.total || 0) + '</td><td data-l="Payment">' + (paid ? '<span class="badge badge--ok">Marked received</span>' : '<span class="badge badge--warn">Awaiting</span>') + '</td><td data-l="">' + (paid ? '' : '<button class="btn btn--ghost btn--sm" data-pay="' + E(b.ref) + '" type="button">Mark received</button>') + '</td></tr>'; }).join('') || '<tr><td colspan="6">' + A.empty('Nothing to show.') + '</td></tr>';
      var due = all.filter(function (b) { return !/Payment|Completed/.test(b.status); }).reduce(function (s, b) { return s + (b.total || 0); }, 0), got = all.filter(function (b) { return /Payment|Completed/.test(b.status); }).reduce(function (s, b) { return s + (b.total || 0); }, 0);
      $('#stats').innerHTML = A.stat('Marked received', ISH.inr(got), 'Totals', 'banknote') + A.stat('Awaiting payment', ISH.inr(due), 'Totals', 'clock'); }
    $('#rows').addEventListener('click', function (e) { var b = e.target.closest('[data-pay]'); if (!b) return; ISH.bookings.setStatus(b.dataset.pay, 'Payment received'); ISH.toast('Marked as received (demo)', 'ok'); draw(); });
    draw();
  };

  /* ---- reports & settings ---- */
  P.reports = function () {
    var tabs = $$('.tabs [role=tab]'), panels = $$('[role=tabpanel]'); tabs.forEach(function (t) { t.addEventListener('click', function () { tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); }); panels.forEach(function (p) { p.hidden = p.id !== t.getAttribute('aria-controls'); }); }); });
    var bk = ISH.bookings.all().filter(function (b) { return b.status !== 'Cancelled'; }), by = {}; bk.forEach(function (b) { by[b.villaId] = (by[b.villaId] || 0) + (b.total || 0); });
    var top = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }).slice(0, 8), mx = by[top[0]] || 1;
    $('#top').innerHTML = top.map(function (k) { var v = ISH.villa(k); return '<li><span>' + E(v ? v.name : k) + '</span><i style="--w:' + (by[k] / mx * 100) + '%"></i><b>' + ISH.inr(by[k]) + '</b></li>'; }).join('') || '<li>' + A.empty('No data.') + '</li>';
    var st = {}; ISH.bookings.all().forEach(function (b) { st[b.status] = (st[b.status] || 0) + 1; }); $('#st').innerHTML = A.statuses.map(function (s) { return '<li><span>' + s + '</span><b>' + (st[s] || 0) + '</b></li>'; }).join('');
    $('#export').addEventListener('click', function () { A.csv('isharvam-report.csv', [['Villa', 'Value (INR)']].concat(top.map(function (k) { var v = ISH.villa(k); return [v ? v.name : k, by[k]]; }))); });
    var f = $('#sf'), s = ISH.store.get('ish_admin_settings', {}); ['whatsapp', 'email', 'hours', 'checkIn', 'checkOut', 'cleaningFee', 'taxRate'].forEach(function (k) { var d = { whatsapp: C.contact.whatsapp, email: C.contact.email, hours: C.contact.hours, checkIn: C.booking.checkIn, checkOut: C.booking.checkOut, cleaningFee: C.booking.cleaningFee, taxRate: Math.round(C.booking.taxRate * 100) }; f.elements[k].value = s[k] != null ? s[k] : d[k]; });
    f.addEventListener('submit', function (e) { e.preventDefault(); if (!ISH.validateForm(f)) return; var o = {}; Array.prototype.forEach.call(f.elements, function (el) { if (el.name) o[el.name] = el.value; }); ISH.store.set('ish_admin_settings', o); ISH.toast('Settings saved in this browser. To change the live site, edit assets/js/config.js.', 'ok'); });
  };

  document.addEventListener('DOMContentLoaded', function () { shell(); var f = (location.pathname.split('/').pop() || 'index.html').replace('.html', ''); var p = P[f === 'index' ? 'dashboard' : f]; if (p) p(); });
})();
