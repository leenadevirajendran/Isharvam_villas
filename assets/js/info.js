/* ISHARVAM VILLAS: Experiences, Contact and FAQ pages (frontend demo). */
(function () {
  'use strict';
  var ISH = window.ISH, D = ISH.data, C = ISH.config, $ = ISH.$, $$ = ISH.$$;

  function experiences() {
    var box = $('#exp-list'); if (!box) return;
    box.innerHTML = D.experiences.map(function (x, i) {
      return '<article class="xrow' + (i % 2 ? ' xrow--flip' : '') + '"><figure class="xrow__img" data-reveal="mask"><img src="' + ISH.siteImg(x.image) + '" srcset="' + ISH.siteImg(x.image, true) + ' 800w, ' + ISH.siteImg(x.image) + ' 1600w" sizes="(min-width: 900px) 55vw, 100vw" alt="" loading="lazy" decoding="async"></figure><div class="xrow__txt" data-reveal><p class="eyebrow">' + String(i + 1).padStart(2, '0') + '</p><h2 class="h2">' + ISH.esc(x.title) + '</h2><p class="lead">' + ISH.esc(x.text) + '</p><a class="link-arrow" target="_blank" rel="noopener" data-wa="Hello Isharvam Villas, I would like to know about: ' + ISH.esc(x.title) + '" href="#">Ask about this ' + ISH.icon('arrow-right') + '</a></div></article>';
    }).join('');
    var dir = $('#amen-dir'); if (dir) { var groups = {}; D.amenities.forEach(function (a) { (groups[a.group] = groups[a.group] || []).push(a); });
      dir.innerHTML = Object.keys(groups).map(function (g, i) { return '<div class="amen" data-reveal style="--d:' + i * .05 + 's"><h3 class="eyebrow">' + ISH.esc(g) + '</h3><ul>' + groups[g].map(function (a) { var n = D.villas.filter(function (v) { return v.amenities.indexOf(a.id) > -1; }).length; return '<li>' + ISH.icon(a.icon) + '<span>' + ISH.esc(a.label) + '</span><small>' + n + ' villas</small></li>'; }).join('') + '</ul></div>'; }).join(''); }
    $$('[data-wa]', box).forEach(function (a) { a.href = ISH.waLink(a.dataset.wa); }); ISH.initReveal();
  }

  function contact() {
    var f = $('#contact-form'); if (!f) return; var c = C.contact;
    $('#c-details').innerHTML = '<ul class="clist"><li>' + ISH.icon('phone') + '<div><b>Call us</b>' + c.phones.map(function (p) { return '<a href="tel:+91' + p + '">' + ISH.phone(p) + '</a>'; }).join('') + '</div></li><li>' + ISH.icon('mail') + '<div><b>Email</b><a href="mailto:' + c.email + '">' + c.email + '</a></div></li><li>' + ISH.icon('clock') + '<div><b>Working hours</b><span>' + c.hours + '</span></div></li>' + (c.address ? '<li>' + ISH.icon('map-pin') + '<div><b>Address</b><span>' + ISH.esc(c.address) + '</span></div></li>' : '') + '</ul>';
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (!ISH.validateForm(f)) return; var btn = $('button[type=submit]', f); btn.classList.add('is-loading');
      setTimeout(function () {
        btn.classList.remove('is-loading'); var name = f.name.value.trim(), msg = (C.booking.demo ? '[DEMO] ' : '') + 'Hello Isharvam Villas, this is ' + name + '. Topic: ' + f.topic.value + '.\n' + f.message.value.trim();
        $('#c-form-wrap').innerHTML = '<div class="notice notice--ok">' + ISH.icon('circle-check') + '<span><b>Thank you, ' + ISH.esc(name.split(' ')[0]) + '.</b> To reach the team now, continue on WhatsApp with your message ready to send.</span></div><div class="conf__cta"><a class="btn btn--wa btn--lg" target="_blank" rel="noopener" href="' + ISH.waLink(msg) + '">' + ISH.icon('whatsapp') + 'Continue on WhatsApp</a><a class="btn btn--ghost btn--lg" href="mailto:' + C.email + '?subject=' + encodeURIComponent('Enquiry: ' + f.topic.value) + '&body=' + encodeURIComponent(f.message.value.trim()) + '">' + ISH.icon('mail') + 'Email instead</a></div>';
      }, 700);
    });
  }

  function faq() {
    var root = $('#faq-root'); if (!root) return; var groups = []; D.faqs.forEach(function (x) { if (groups.indexOf(x.group) < 0) groups.push(x.group); }); var cur = 'All', term = '';
    $('#faq-chips').innerHTML = ['All'].concat(groups).map(function (g, i) { return '<button type="button" class="chip" aria-pressed="' + (i === 0) + '" data-g="' + g + '">' + g + '</button>'; }).join('');
    function draw() {
      var list = D.faqs.filter(function (x) { return (cur === 'All' || x.group === cur) && (!term || (x.q + ' ' + x.a).toLowerCase().indexOf(term) > -1); });
      root.innerHTML = list.length ? '<div class="acc">' + list.map(function (x, i) { return '<div class="acc__item"><h3><button type="button" class="acc__btn" aria-expanded="false" aria-controls="fa' + i + '" id="fq' + i + '"><span>' + ISH.esc(x.q) + '</span>' + ISH.icon('plus') + '</button></h3><div class="acc__panel" id="fa' + i + '" role="region" aria-labelledby="fq' + i + '"><div><p>' + ISH.esc(x.a) + '</p></div></div></div>'; }).join('') + '</div>' : '<div class="empty"><p class="muted">No questions match. Try another word, or ask us on WhatsApp.</p></div>';
    }
    $('#faq-chips').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; cur = b.dataset.g; $$('#faq-chips .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); draw(); });
    $('#faq-q').addEventListener('input', function (e) { term = e.target.value.trim().toLowerCase(); draw(); });
    root.addEventListener('click', function (e) { var b = e.target.closest('.acc__btn'); if (!b) return; var o = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', o); $('#' + b.getAttribute('aria-controls')).classList.toggle('is-open', o); });
    draw();
  }
  document.addEventListener('DOMContentLoaded', function () { experiences(); contact(); faq(); });
})();
