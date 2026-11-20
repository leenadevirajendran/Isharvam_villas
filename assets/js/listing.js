/* ISHARVAM VILLAS: Explore / Search results. Filters, sorting, availability, wishlist and compare, all driven by mock-data.js.
   State lives in the URL (loc, in, out, g, cat, min, max, beds, am, sort) so it can be shared and read by PHP later. */
(function () {
  'use strict';
  var ISH = window.ISH, D = ISH.data, $ = ISH.$, $$ = ISH.$$;
  var st = { loc: '', cats: [], min: 0, max: 0, beds: 0, am: [], sort: 'rec', 'in': '', out: '', g: 0 };
  var prices = D.villas.map(function (v) { return v.pricePerNight; }), PMIN = Math.min.apply(null, prices), PMAX = Math.max.apply(null, prices);
  var FILTER_AM = ['private-pool', 'infinity-pool', 'fireplace', 'chef', 'theatre', 'gym', 'garden', 'kids', 'pets'];
  var searchMode = document.body.dataset.mode === 'search';

  function read() {
    var q = ISH.query(); st.loc = q.loc || ''; st.cats = q.cat ? q.cat.split(',') : []; st.min = +q.min || 0; st.max = +q.max || 0; st.beds = +q.beds || 0; st.am = q.am ? q.am.split(',') : [];
    st.sort = q.sort || 'rec'; st['in'] = q['in'] && q['in'] >= ISH.today() ? q['in'] : ''; st.out = st['in'] && q.out > st['in'] ? q.out : ''; if (!st.out) st['in'] = ''; st.g = +q.g || 0;
  }
  function write() {
    var p = new URLSearchParams(); if (st.loc) p.set('loc', st.loc); if (st['in']) { p.set('in', st['in']); p.set('out', st.out); } if (st.g) p.set('g', st.g); if (st.cats.length) p.set('cat', st.cats.join(','));
    if (st.min) p.set('min', st.min); if (st.max) p.set('max', st.max); if (st.beds) p.set('beds', st.beds); if (st.am.length) p.set('am', st.am.join(',')); if (st.sort !== 'rec') p.set('sort', st.sort);
    var s = p.toString(); try { history.replaceState(null, '', location.pathname + (s ? '?' + s : '')); } catch (e) { }
  }
  function matches(v) {
    if (st.loc && v.locationId !== st.loc) return false; if (st.cats.length && st.cats.indexOf(v.category) < 0) return false;
    if (st.g && v.maxGuests < st.g) return false; if (st.beds && v.bedrooms < st.beds) return false;
    if (st.min && v.pricePerNight < st.min) return false; if (st.max && v.pricePerNight > st.max) return false;
    for (var i = 0; i < st.am.length; i++) if (v.amenities.indexOf(st.am[i]) < 0) return false;
    if (st['in'] && !ISH.isAvailable(v, st['in'], st.out)) return false; return true;
  }
  function sorted(list) {
    var s = st.sort, c = list.slice();
    if (s === 'pa') c.sort(function (a, b) { return a.pricePerNight - b.pricePerNight; }); else if (s === 'pd') c.sort(function (a, b) { return b.pricePerNight - a.pricePerNight; });
    else if (s === 'g') c.sort(function (a, b) { return b.maxGuests - a.maxGuests; }); else if (s === 'b') c.sort(function (a, b) { return b.bedrooms - a.bedrooms; });
    else c.sort(function (a, b) { return (b.featured - a.featured) || a.id.localeCompare(b.id); }); return c;
  }
  function carryQuery() { var p = []; if (st['in']) p.push('in=' + st['in'], 'out=' + st.out); if (st.g) p.push('g=' + st.g); return p.join('&'); }

  function buildFilters() {
    var box = $('#filters-body'); if (!box) return;
    box.innerHTML = '<fieldset class="fgroup"><legend>Property type</legend>' + D.categories.map(function (c) { return '<label class="check"><input type="checkbox" name="cat" value="' + ISH.esc(c) + '"><span>' + ISH.esc(c) + '</span></label>'; }).join('') + '</fieldset>' +
      '<fieldset class="fgroup"><legend>Price per night</legend><div class="frange"><div class="field"><label for="f-min">Min (₹)</label><input class="input" id="f-min" type="number" inputmode="numeric" min="0" step="500" placeholder="' + PMIN + '"></div><div class="field"><label for="f-max">Max (₹)</label><input class="input" id="f-max" type="number" inputmode="numeric" min="0" step="500" placeholder="' + PMAX + '"></div></div><p class="small">Prices from ' + ISH.inr(PMIN) + ' to ' + ISH.inr(PMAX) + '</p></fieldset>' +
      '<fieldset class="fgroup"><legend>Bedrooms</legend><div class="chips" id="f-beds">' + [0, 3, 4, 5, 6].map(function (n) { return '<button type="button" class="chip" data-beds="' + n + '" aria-pressed="false">' + (n ? n + '+' : 'Any') + '</button>'; }).join('') + '</div></fieldset>' +
      '<fieldset class="fgroup"><legend>Must have</legend>' + FILTER_AM.map(function (id) { var a = ISH.amenity(id); return '<label class="check"><input type="checkbox" name="am" value="' + id + '"><span>' + ISH.esc(a.label) + '</span></label>'; }).join('') + '</fieldset>' +
      '<button type="button" class="btn btn--ghost btn--block" id="f-reset">Reset filters</button>';
  }
  function syncUI() {
    $$('input[name="cat"]').forEach(function (i) { i.checked = st.cats.indexOf(i.value) > -1; }); $$('input[name="am"]').forEach(function (i) { i.checked = st.am.indexOf(i.value) > -1; });
    var mn = $('#f-min'), mx = $('#f-max'); if (mn) mn.value = st.min || ''; if (mx) mx.value = st.max || '';
    $$('#f-beds .chip').forEach(function (c) { c.setAttribute('aria-pressed', +c.dataset.beds === st.beds); }); var s = $('#sort'); if (s) s.value = st.sort;
  }
  function activePills() {
    var out = []; if (st.loc) out.push(['loc', ISH.location(st.loc).name]); st.cats.forEach(function (c) { out.push(['cat:' + c, c]); }); if (st.min) out.push(['min', 'From ' + ISH.inr(st.min)]); if (st.max) out.push(['max', 'Up to ' + ISH.inr(st.max)]);
    if (st.beds) out.push(['beds', st.beds + '+ bedrooms']); st.am.forEach(function (a) { out.push(['am:' + a, ISH.amenity(a).label]); });
    return out;
  }
  function render() {
    var all = D.villas, list = sorted(all.filter(matches)), grid = $('#results'), cnt = $('#count'), emp = $('#empty'), q = carryQuery();
    grid.innerHTML = list.map(function (v, i) { return ISH.villaCard(v, { query: q, compare: true, sizes: '(min-width: 1100px) 36vw, (min-width: 700px) 45vw, 100vw' }); }).join('');
    grid.setAttribute('aria-busy', 'false'); emp.hidden = list.length > 0; grid.hidden = !list.length;
    var txt = ISH.plural(list.length, 'villa') + (st['in'] ? ' available for ' + ISH.fmtDate(st['in']) + ' to ' + ISH.fmtDate(st.out) + ' (' + ISH.plural(ISH.diffDays(st['in'], st.out), 'night') + ')' : ' to explore');
    cnt.textContent = txt; var sum = $('#search-summary'); if (sum) sum.textContent = txt + (st.g ? ' for ' + ISH.plural(st.g, 'guest') : '') + (st.loc ? ' in ' + ISH.location(st.loc).name : '');
    var pills = activePills(); $('#pills').innerHTML = pills.map(function (p) { return '<button type="button" class="chip is-on" data-pill="' + ISH.esc(p[0]) + '">' + ISH.esc(p[1]) + ' ' + ISH.icon('x') + '</button>'; }).join('');
    $$('.vcard', grid).forEach(function (c, i) { c.setAttribute('data-reveal', ''); c.style.setProperty('--d', (i % 4) * .06 + 's'); }); ISH.initReveal(grid); var fc = $('#f-count'); if (fc) fc.textContent = list.length; write(); renderTray();
  }

  /* ---------- compare ---------- */
  function renderTray() {
    var tray = $('#tray'), ids = ISH.compare.list(); if (!tray) return; tray.hidden = !ids.length; if (!ids.length) return;
    $('#tray-items', tray).innerHTML = ids.map(function (id) { var v = ISH.villa(id); return '<li><img src="' + ISH.img(v.images[0].src, true) + '" alt=""><span>' + ISH.esc(v.name) + '</span><button type="button" data-rm="' + id + '" aria-label="Remove ' + ISH.esc(v.name) + ' from comparison">' + ISH.icon('x') + '</button></li>'; }).join('');
    var b = $('#tray-go', tray); b.disabled = ids.length < 2; b.textContent = ids.length < 2 ? 'Pick one more to compare' : 'Compare ' + ids.length + ' villas';
  }
  function openCompare() {
    var vs = ISH.compare.list().map(ISH.villa), q = carryQuery();
    var rows = [['Location', function (v) { return ISH.esc(ISH.location(v.locationId).name); }], ['Type', function (v) { return ISH.esc(v.category); }], ['Bedrooms', function (v) { return v.bedrooms; }], ['Bathrooms', function (v) { return v.bathrooms || v.bathrooms; }], ['Max guests', function (v) { return v.maxGuests; }],
      ['Price / night', function (v) { return '<b>' + ISH.inr(v.pricePerNight) + '</b>'; }], ['Pool', function (v) { return v.amenities.indexOf('private-pool') > -1 || v.amenities.indexOf('infinity-pool') > -1 ? 'Yes' : '—'; }], ['Fireplace', function (v) { return v.amenities.indexOf('fireplace') > -1 ? 'Yes' : '—'; }], ['Chef on request', function (v) { return v.amenities.indexOf('chef') > -1 ? 'Yes' : '—'; }], ['Child-friendly', function (v) { return v.amenities.indexOf('kids') > -1 ? 'Yes' : '—'; }]];
    var h = '<button class="dialog__close" data-close aria-label="Close comparison">' + ISH.icon('x') + '</button><div class="cmp"><h2 class="h3">Compare villas</h2><div class="cmp__scroll"><table><thead><tr><td></td>' + vs.map(function (v) { return '<th scope="col"><img src="' + ISH.img(v.images[0].src, true) + '" alt=""><a href="' + ISH.villaUrl(v, q) + '">' + ISH.esc(v.name) + '</a></th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th>' + vs.map(function (v) { return '<td>' + r[1](v) + '</td>'; }).join('') + '</tr>'; }).join('') + '<tr><td></td>' + vs.map(function (v) { return '<td><a class="btn btn--sm" href="' + ISH.villaUrl(v, q) + '">View villa</a></td>'; }).join('') + '</tr></tbody></table></div><p class="small">Sample data for demonstration.</p></div>';
    ISH.openDialog(h);
  }

  document.addEventListener('DOMContentLoaded', function () {
    read(); buildFilters(); var form = $('#listing-bar'); var bar = form && ISH.initBookbar(form); syncUI();
    form.addEventListener('bookbar:change', function () { st.loc = $('[name="loc"]', form).value; st['in'] = $('[name="in"]', form).value; st.out = $('[name="out"]', form).value; st.g = +$('[name="g"]', form).value || 0; if (st.g === 2 && !ISH.query().g) { } render(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); render(); $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    var fb = $('#filters'); fb.addEventListener('change', function (e) {
      var t = e.target; if (t.name === 'cat') st.cats = $$('input[name="cat"]:checked').map(function (i) { return i.value; }); else if (t.name === 'am') st.am = $$('input[name="am"]:checked').map(function (i) { return i.value; }); else if (t.id === 'f-min') st.min = Math.max(0, +t.value || 0); else if (t.id === 'f-max') st.max = Math.max(0, +t.value || 0); render();
    });
    fb.addEventListener('click', function (e) {
      var b = e.target.closest('[data-beds]'); if (b) { st.beds = +b.dataset.beds; syncUI(); render(); }
      if (e.target.closest('#f-reset')) { st.cats = []; st.am = []; st.min = st.max = st.beds = 0; syncUI(); render(); }
    });
    $('#sort').addEventListener('change', function (e) { st.sort = e.target.value; render(); });
    $('#pills').addEventListener('click', function (e) {
      var b = e.target.closest('[data-pill]'); if (!b) return; var k = b.dataset.pill.split(':'), v = k.slice(1).join(':');
      if (k[0] === 'loc') { st.loc = ''; $('[name="loc"]', form).value = ''; } else if (k[0] === 'cat') st.cats = st.cats.filter(function (x) { return x !== v; }); else if (k[0] === 'am') st.am = st.am.filter(function (x) { return x !== v; }); else st[k[0]] = 0; syncUI(); render();
    });
    $$('.js-reset-all').forEach(function (b) { b.addEventListener('click', function () { st.loc = ''; st.cats = []; st.am = []; st.min = st.max = st.beds = st.g = 0; st['in'] = st.out = ''; location.href = location.pathname; }); });
    var open = $('#filters-open'), close = $$('[data-filters-close]');
    function setF(o) { document.body.classList.toggle('filters-open', o); open.setAttribute('aria-expanded', o); }
    open.addEventListener('click', function () { setF(true); }); close.forEach(function (c) { c.addEventListener('click', function () { setF(false); }); }); document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setF(false); });
    document.addEventListener('change', function (e) {
      var c = e.target.closest('.js-compare'); if (!c) return; var ok = ISH.compare.toggle(c.dataset.id); if (!ok) { c.checked = false; ISH.toast('You can compare up to 3 villas at a time.'); }
    });
    document.addEventListener('ish:compare', function () { var ids = ISH.compare.list(); $$('.js-compare').forEach(function (c) { c.checked = ids.indexOf(c.dataset.id) > -1; }); renderTray(); });
    var tray = $('#tray'); tray.addEventListener('click', function (e) { var r = e.target.closest('[data-rm]'); if (r) ISH.compare.toggle(r.dataset.rm); if (e.target.closest('#tray-clear')) ISH.compare.clear(); if (e.target.closest('#tray-go') && ISH.compare.list().length > 1) openCompare(); });
    render();
  });
})();
