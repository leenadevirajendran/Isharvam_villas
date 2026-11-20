/* ISHARVAM VILLAS: ambient villa scene.
   A quiet line-art street of villas that drifts slowly left to right behind every inner page (fixed layer)
   and along the bottom of each page header. Clouds and one small bird glide the same way. Decorative only (aria-hidden).
   Respects prefers-reduced-motion (CSS stops all movement). */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  function win(x, y, w, h, d) { return '<rect class="amb-w" style="animation-delay:' + d + 's" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>'; }
  function win(x, y, w, h, d) { return '<rect class="amb-w" style="animation-delay:' + d + 's" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>'; }
  /* one seamless 1600 x 220 tile; the ground line runs edge to edge so tiles join cleanly */
  var TILE =
    '<svg class="amb-tile" viewBox="0 0 1600 220" width="1600" height="220" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square">' +
    '<path d="M0 200 H1600"/>' +
    '<path d="M110 200 V128 H330 V200 M150 128 V70 H300 V128 M96 128 H344 M138 70 H312"/>' + win(130, 146, 40, 40, 0) + win(190, 146, 40, 40, 1.6) + win(250, 146, 56, 40, .8) + win(168, 86, 40, 30, 2.4) + win(230, 86, 52, 30, 3.2) +
    '<path d="M420 200 V168 M392 138 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0"/>' +
    '<path d="M560 200 V122 H780 V200 M546 122 L670 52 L794 122"/>' + win(590, 146, 44, 40, 1.1) + win(700, 146, 44, 40, 2.9) + win(650, 90, 40, 26, .4) +
    '<path d="M830 200 H1010 M846 188 H996"/>' +
    '<path d="M1060 200 V150 M1040 128 a20 22 0 1 0 40 0 a20 22 0 1 0 -40 0 M1100 200 V182 M1088 172 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0"/>' +
    '<path d="M1180 200 V136 H1450 V200 M1164 136 H1466 M1230 136 V104 H1400 V136"/>' + win(1204, 154, 50, 34, 1.9) + win(1274, 154, 50, 34, .2) + win(1344, 154, 50, 34, 3.1) + win(1262, 114, 60, 14, 2.2) +
    '<path d="M1500 200 V176 M1560 200 V176" stroke-width="1"/><circle class="amb-w2" cx="1500" cy="172" r="3.5" fill="currentColor" stroke="none"/><circle class="amb-w2" cx="1560" cy="172" r="3.5" fill="currentColor" stroke="none" style="animation-delay:1.2s"/>' +
    '</g></svg>';
  var CLOUD = '<svg class="amb-cloud" viewBox="0 0 120 40" aria-hidden="true" focusable="false"><path d="M14 32 H104 M22 32 a14 14 0 0 1 8 -22 a18 18 0 0 1 34 -4 a14 14 0 0 1 28 10 a11 11 0 0 1 12 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var BIRD = '<span class="amb-bird" aria-hidden="true"><svg viewBox="0 0 40 24" width="34" height="20" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path class="amb-wl" d="M20 14 C15 6 8 6 3 10"/><path class="amb-wr" d="M20 14 C25 6 32 6 37 10"/></g></svg></span>';
  function track(n) { var t = ''; for (var i = 0; i < n; i++) t += TILE; return '<div class="amb-track">' + t + '</div>'; }
  function el(cls, html) { var d = document.createElement('div'); d.className = cls; d.setAttribute('aria-hidden', 'true'); d.innerHTML = html; return d; }
  // keep in-grid bands full-bleed even when the grid is off-centre (filters sidebar)
  var fitT; function fitBands() { var bs = document.querySelectorAll('.amb-divider--in'); for (var i = 0; i < bs.length; i++) { bs[i].style.setProperty('--bl', (-bs[i].getBoundingClientRect().left) + 'px'); } }
  function queueFit() { clearTimeout(fitT); fitT = setTimeout(fitBands, 60); }
  if (window.IntersectionObserver) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-off', !e.isIntersecting); }); }, { rootMargin: '120px' }); var watch = function () { var bs = document.querySelectorAll('.amb-divider:not([data-w])'); for (var i = 0; i < bs.length; i++) { bs[i].setAttribute('data-w', '1'); io.observe(bs[i]); } }; watch(); if (window.MutationObserver) new MutationObserver(watch).observe(document.documentElement, { childList: true, subtree: true }); }
  window.addEventListener('resize', queueFit); window.addEventListener('load', queueFit);
  if (window.MutationObserver) new MutationObserver(queueFit).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', function () {
    var nav = document.body.dataset.nav, wantFixed = !!nav;
    if (document.body.classList.contains('admin')) return;
    if (wantFixed) {
      var s = el('bg-scene', '<div class="bg-scene__sky">' + CLOUD + CLOUD + CLOUD + BIRD + '</div><div class="bg-scene__street">' + track(4) + '</div>');
      document.body.insertBefore(s, document.body.firstChild); document.body.classList.add('has-amb');
    }
    if (wantFixed) {
      /* visible animated bands between the content panels: they sit in the gaps, so they never run behind text */
      var addBands = function () {
        var secs = document.querySelectorAll('main > section, .villa > section, .villa > .vbody');
        Array.prototype.forEach.call(secs, function (sec, i) {
          var c = sec.classList; if (c.contains('page-head') || c.contains('wake') || c.contains('atm-night') || c.contains('atm-dusk') || c.contains('atm-golden')) return;
          var nx = sec.nextElementSibling; if (!nx || nx.classList.contains('amb-divider') || nx.classList.contains('atm-night') || nx.classList.contains('atm-dusk')) return;
          sec.parentNode.insertBefore(el('amb-divider', track(6)), nx);
        });
      };
      
    }
    Array.prototype.forEach.call(document.querySelectorAll('.page-head'), function (h) { h.appendChild(el('amb-head', track(6))); h.classList.add('has-amb-head'); });
  });
})();
