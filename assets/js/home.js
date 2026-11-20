/* ISHARVAM VILLAS: homepage behaviour.
   Signature moments: (1) hero roofline + masked headline, (2) "The Villa Wakes" scroll scene, (3) window-mask reveal on the first featured villa,
   (4) time-of-day chapters, plus the lit-dates calendar in the booking bar (calendar.js). Everything degrades to a static, readable page. */
(function () {
  'use strict';
  var ISH = window.ISH, D = ISH.data, $ = ISH.$, $$ = ISH.$$;

  /* ---------- content rendering from mock-data.js ---------- */
  function renderFeatured() {
    var box = $('#featured-grid'); if (!box) return;
    box.innerHTML = D.villas.filter(function (v) { return v.featured; }).slice(0, 3).map(function (v) { return ISH.villaCard(v, { cls: 'is-feat', sizes: '(min-width: 900px) 33vw, 100vw' }); }).join('');
    $$('[data-reveal]', box).forEach(function () { });
    $$('.vcard', box).forEach(function (c, i) { c.setAttribute('data-reveal', ''); c.style.setProperty('--d', (i * .08) + 's'); }); ISH.initReveal(box);
    var first = $('.vcard__media', box); if (first) first.classList.add('winmask');
  }
  function renderIndex() {
    var list = $('#index-list'); if (!list) return; var chips = $('#index-chips'), prev = $('#index-preview'), cur = 'All';
    var cats = ['All'].concat(D.categories.filter(function (c) { return D.villas.some(function (v) { return v.category === c; }); }));
    chips.innerHTML = cats.map(function (c, i) { return '<button type="button" class="chip" aria-pressed="' + (i === 0) + '" data-cat="' + ISH.esc(c) + '">' + ISH.esc(c) + '</button>'; }).join('');
    list.innerHTML = D.villas.map(function (v) {
      var l = ISH.location(v.locationId);
      return '<li class="index__row" data-cat="' + ISH.esc(v.category) + '"><a href="' + ISH.villaUrl(v) + '" data-img="' + ISH.img(v.images[0].src) + '" data-alt="' + ISH.esc(v.images[0].alt) + '"><span class="index__name">' + ISH.esc(v.name) + '</span><span class="index__meta">' + ISH.esc(l.name) + ' · ' + ISH.esc(v.category) + '</span><span class="index__go"><small>from</small> ' + ISH.inr(v.pricePerNight) + ISH.icon('arrow-right') + '</span></a></li>';
    }).join('');
    function swap(a) { if (!prev || !a || prev.getAttribute('src') === a.dataset.img) return; prev.classList.add('is-swap'); setTimeout(function () { prev.src = a.dataset.img; prev.alt = ''; prev.classList.remove('is-swap'); }, 260); }
    list.addEventListener('mouseover', function (e) { swap(e.target.closest('a')); }); list.addEventListener('focusin', function (e) { swap(e.target.closest('a')); });
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return; cur = b.dataset.cat; $$('.chip', chips).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $$('.index__row', list).forEach(function (r) { r.classList.toggle('is-hidden', cur !== 'All' && r.dataset.cat !== cur); });
    });
    if (list.firstElementChild) { var a = $('a', list.firstElementChild); if (prev && a) prev.src = a.dataset.img; }
  }
  function renderExperiences() {
    var box = $('#exp-grid'); if (!box) return;
    box.innerHTML = D.experiences.slice(0, 4).map(function (x, i) { return '<article class="exp__tile" data-reveal style="--d:' + (i * .07) + 's"><img src="' + ISH.siteImg(x.image) + '" srcset="' + ISH.siteImg(x.image, true) + ' 800w, ' + ISH.siteImg(x.image) + ' 1600w" sizes="(min-width: 800px) 40vw, 100vw" alt="" loading="lazy" decoding="async"><div>' + ISH.icon(x.icon) + '<h3>' + ISH.esc(x.title) + '</h3><p>' + ISH.esc(x.text) + '</p></div></article>'; }).join(''); ISH.initReveal(box);
  }
  function renderPlaces() {
    var w = $('#places-wrap'); if (!w) return;
    w.innerHTML = D.locations.map(function (l) {
      var n = D.villas.filter(function (v) { return v.locationId === l.id; }).length;
      return '<div class="swiper-slide"><a class="place" href="villas.html?loc=' + l.id + '"><div class="place__img"><img src="' + ISH.siteImg(l.image) + '" srcset="' + ISH.siteImg(l.image, true) + ' 800w, ' + ISH.siteImg(l.image) + ' 1200w" sizes="360px" alt="' + ISH.esc(l.name) + '" loading="lazy" decoding="async"></div><h3>' + ISH.esc(l.name) + '</h3><p>' + ISH.esc(l.blurb) + '</p><small>' + n + ' sample ' + (n === 1 ? 'villa' : 'villas') + ' · ' + ISH.esc(l.region) + '</small></a></div>';
    }).join('');
    if (window.Swiper) new Swiper('#places-swiper', { slidesPerView: 'auto', spaceBetween: 24, navigation: { nextEl: '.places-next', prevEl: '.places-prev' }, a11y: { enabled: true }, keyboard: { enabled: true }, grabCursor: true });
  }
  function renderQuotes() {
    var w = $('#quotes-wrap'); if (!w) return;
    w.innerHTML = D.testimonials.map(function (t) { return '<div class="swiper-slide"><figure class="quote"><blockquote>“' + ISH.esc(t.quote) + '”</blockquote><figcaption>' + ISH.esc(t.author) + ' · ' + ISH.esc(t.context) + '</figcaption></figure></div>'; }).join('');
    if (window.Swiper) new Swiper('#quotes-swiper', { effect: 'fade', fadeEffect: { crossFade: true }, autoHeight: true, speed: 700, pagination: { el: '.quotes__pag', clickable: true }, a11y: { enabled: true }, keyboard: { enabled: true } });
  }

  /* ---------- time-of-day chapters ---------- */
  function initChapters() {
    var tabs = $$('.chapters__tabs [role="tab"]'), imgs = $$('.chapters__stage img'), txt = $('#ch-text'); if (!tabs.length) return;
    var copy = ['Morning light is clear and quiet: coffee on the terrace, the pool still as glass.', 'Golden hour warms the stone and the water. The best hour for a long drink and a longer conversation.', 'At dusk the windows begin to glow and the house turns inward, ready for dinner.', 'By night the pool lights, the garden lamps and a sky full of stars take over.'];
    function go(i, focus) { tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; }); imgs.forEach(function (m, k) { m.classList.toggle('is-on', k === i); }); txt.textContent = copy[i]; if (focus) tabs[i].focus(); }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); t.addEventListener('keydown', function (e) { var k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (k) { e.preventDefault(); go((i + k + tabs.length) % tabs.length, true); } }); });
  }

  /* ---------- GSAP: hero, wake scene, masks ---------- */
  function initMotion() {
    var wake = $('#wake'), hero = wake;
    function ready() { hero && hero.classList.add('is-ready'); }
    if (!window.gsap || !window.ScrollTrigger || ISH.reduceMotion) { ready(); wake && wake.classList.add('is-static'); return; }
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();
    mm.add({ ok: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 760px)' }, function (ctx) {
      var wide = ctx.conditions.wide;
      /* 1. hero intro: headline mask, lines of the villa draw themselves, booking bar rises */
      hero.classList.add('is-playing');
      var tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: ready });
      tl.fromTo('.hero__eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8 }, .2)
        .fromTo('.hero__title .line > span', { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: .12 }, .3)
        .fromTo('#wake .d', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: { amount: 1.3 }, ease: 'power1.inOut' }, .2)
        .to('#wake .f', { opacity: 1, duration: .9, stagger: { amount: 1.1 }, ease: 'power1.out' }, 1)
        .fromTo('.hero__lead, .hero__cta', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, stagger: .12 }, .9)
        .fromTo('.hero__bar', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 1.2);

      /* story image: clipped reveal */
      gsap.fromTo('[data-story-img] img', { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, ease: 'power3.inOut', scrollTrigger: { trigger: '[data-story-img]', start: 'top 80%', once: true } });

      /* 3. window-mask reveal on the first featured villa */
      var wm = $('.winmask'); if (wm) { var img = $('img', wm); gsap.fromTo(wm, { clipPath: 'inset(36% 36% 36% 36%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'power3.inOut', onComplete: function () { wm.classList.add('is-open'); }, scrollTrigger: { trigger: wm, start: 'top 82%', once: true } }); if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: wm, start: 'top 82%', once: true } }); }

      /* 2. the villa wakes */
      var cap = $('[data-cap]'), prog = $('.wake__prog i'), caps = ['Daylight: a quiet house, waiting.', 'Dusk arrives. The windows wake, one by one.', 'Evening: the garden lights, the pool begins to glow.', 'Step inside.'], ci = -1;
      function setCap(p) { var i = p < .2 ? 0 : p < .42 ? 1 : p < .7 ? 2 : 3; if (i !== ci) { ci = i; gsap.fromTo(cap, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .5 }); cap.textContent = caps[i]; } }
      var DUSK = { '--wall': '#E9CDB0', '--wall2': '#D3B392', '--trim': '#F0DDC6', '--roof': '#2D3A62', '--roof2': '#25315A', '--door': '#0A6173', '--shutter': '#0A6173', '--glass': '#D69A8A', '--ground': '#8A9B84', '--stone': '#C0AA8E', '--leaf1': '#3D6659', '--leaf2': '#55806F', '--trunk': '#5F4E3E', '--hill': '#7F8AA3', '--hill2': '#6E7F8A', '--chim': '#8B6648', '--ln': '#1B2C4E' };
      var NIGHT = { '--wall': '#3B4A69', '--wall2': '#2D3A56', '--trim': '#55638A', '--roof': '#141E37', '--roof2': '#101A31', '--door': '#07505F', '--shutter': '#07505F', '--glass': '#0F1B33', '--ground': '#15283A', '--stone': '#3B4764', '--leaf1': '#1C3A3A', '--leaf2': '#27504B', '--trunk': '#2A2A36', '--hill': '#14233E', '--hill2': '#101C34', '--chim': '#4A3E40', '--ln': '#8A9BBF' };
      function wakeTimeline(zoom) {
        var t = gsap.timeline({ defaults: { ease: 'none' } }), svg = '#wake .wake__svg';
        t.addLabel('dusk', .2).to('.hero__title em', { color: '#F2C879', duration: 1 }, 'dusk').to('.hero__eyebrow', { color: '#BCA77D', duration: 1 }, 'dusk').to('.hero__cta .btn', { '--b': '#F7F5F0', '--f': '#10213D', duration: 1 }, 'dusk')
          .to('#wake .sk-dusk', { opacity: 1, duration: 1 }, 'dusk').to('#wake .cloud', { opacity: 0, duration: .8 }, 'dusk')
          .to(svg, Object.assign({ duration: 1 }, DUSK), 'dusk')
          .to('.wake__pin', { color: '#F7F5F0', duration: 1 }, 'dusk+=.2')
          .to('#wake .win .lit', { opacity: .92, duration: .3, stagger: .17, ease: 'power1.out' }, 'dusk+=.5')
          .to('#wake .win .halo', { opacity: 1, duration: .5, stagger: .17 }, 'dusk+=.55')
          .addLabel('night', 'dusk+=1.9')
          .to('#wake .sk-night', { opacity: 1, duration: 1 }, 'night')
          .to(svg, Object.assign({ duration: 1.2 }, NIGHT), 'night')
          .to('#wake .stars', { opacity: 1, duration: .9 }, 'night+=.2').to('#wake .moon', { opacity: 1, duration: .9 }, 'night+=.3')
          .to('#wake .xlights', { opacity: 1, duration: .5 }, 'night+=.3').to('#wake .poollit', { opacity: .55, duration: .8 }, 'night+=.5').to('#wake .pool-lines', { opacity: .6, duration: .8 }, 'night+=.7');
        if (zoom) {
          t.addLabel('enter', 'night+=1.6').to('#wake .wake__world', { scale: 10, svgOrigin: '640 500', duration: 1.5, ease: 'power3.in' }, 'enter').to('.wake__copy, .wake__cap', { opacity: 0, duration: .4 }, 'enter').to('.wake__reveal', { opacity: 1, duration: .6, ease: 'power1.in' }, 'enter+=.95');
        }
        return t;
      }
      if (wake) {
        if (wide) {
          var tl2 = wakeTimeline(true);
          ScrollTrigger.create({ animation: tl2, trigger: wake, start: 'top top', end: '+=180%', scrub: .6, pin: '.wake__pin', anticipatePin: 1, onUpdate: function (s) { setCap(s.progress); if (prog) prog.style.transform = 'scaleX(' + s.progress + ')'; } });
        } else {
          var tl3 = wakeTimeline(false); ScrollTrigger.create({ animation: tl3, trigger: wake, start: 'top top', end: 'bottom 25%', scrub: .6, onUpdate: function (s) { setCap(s.progress); } });
        }
      }
      return function () { ready(); };
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFeatured(); renderIndex(); renderExperiences(); renderPlaces(); renderQuotes(); initChapters(); initMotion();
    var a = $('a[href="#wake"]'); if (a) a.addEventListener('click', function (e) { e.preventDefault(); var w = $('#wake'); w && w.scrollIntoView({ behavior: ISH.reduceMotion ? 'auto' : 'smooth' }); });
  });
})();
