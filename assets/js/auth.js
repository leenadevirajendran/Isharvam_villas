/* ISHARVAM VILLAS: login / registration UI. FRONTEND DEMO ONLY: nothing is sent anywhere and passwords are never stored.
   In the PHP phase these forms post to server-side authentication (hashed passwords, CSRF protection, secure sessions). */
(function () {
  'use strict';
  var ISH = window.ISH, $ = ISH.$, $$ = ISH.$$;
  document.addEventListener('DOMContentLoaded', function () {
    var form = $('#auth-form'); if (!form) return; var mode = form.dataset.mode, q = ISH.query();
    $$('.pw-toggle').forEach(function (b) { b.addEventListener('click', function () { var i = $('#' + b.dataset.for); var show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.setAttribute('aria-pressed', show); b.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); b.firstElementChild.innerHTML = '<use href="#i-' + (show ? 'eye' : 'lock') + '"/>'; }); });
    var pw = $('#a-pass'), meter = $('#pw-meter'); if (pw && meter) pw.addEventListener('input', function () { var v = pw.value, s = 0; if (v.length >= 8) s++; if (/\d/.test(v)) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++; meter.dataset.s = v ? s : 0; meter.nextElementSibling.textContent = v ? ['Too weak', 'Weak', 'Okay', 'Good', 'Strong'][s] : ''; });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); $('#auth-msg').hidden = true; if (!ISH.validateForm(form)) return; var btn = $('button[type=submit]', form); btn.classList.add('is-loading');
      setTimeout(function () {
        var email = form.email.value.trim(), user;
        if (mode === 'register') user = { name: form.name.value.trim(), email: email, phone: form.phone.value.trim() };
        else { var prev = ISH.store.get('ish_user', null); user = prev && prev.email === email ? prev : { name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }), email: email }; }
        ISH.store.set('ish_user', user); var m = $('#auth-msg'); m.hidden = false; m.className = 'notice notice--ok'; m.innerHTML = ISH.icon('circle-check') + '<span>' + (mode === 'register' ? 'Account created.' : 'Signed in.') + ' Taking you to your bookings…</span>';
        setTimeout(function () { location.href = q.next && /^[\w-]+\.html$/.test(q.next) ? q.next : 'my-bookings.html'; }, 900);
      }, 700);
    });
    var fp = $('#forgot'); if (fp) fp.addEventListener('click', function (e) { e.preventDefault(); ISH.toast('Password reset instructions will be sent to your email.'); });
  });
})();
