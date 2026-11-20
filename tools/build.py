#!/usr/bin/env python3
"""Static page builder: stitches src/pages/*.html with shared partials into ready-to-open HTML.
Run: python3 tools/build.py        (pages in src/pages/admin/ are written to /admin)
Page front matter (above a line containing only ---): title, desc, nav, body, css, scripts, wa (0 hides floating WhatsApp), robots, layout."""
import os, re, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda p: open(os.path.join(ROOT, p), encoding='utf-8').read()
P = {n: rd('src/partials/%s.html' % n) for n in ('head', 'header', 'footer', 'logo-mark', 'admin-shell-top', 'admin-shell-bottom')}
ARROW = '<svg class="icon icon-arrow" aria-hidden="true"><use href="#i-arrow-right"/></svg>'
VENDOR = {'gsap': 'assets/vendor/gsap.min.js', 'ScrollTrigger': 'assets/vendor/ScrollTrigger.min.js', 'swiper': 'assets/vendor/swiper-bundle.min.js'}
def sub(t, d):
    t = re.sub(r'\{\{inc:([\w-]+)\}\}', lambda m: rd('src/partials/%s.html' % m.group(1)), t)
    for k, v in d.items(): t = t.replace('{{%s}}' % k, v)
    return t
def build(path, admin):
    raw = rd(path); fm, body = raw.split('\n---\n', 1); m = {}
    for line in fm.strip().splitlines():
        k, _, v = line.partition(':'); m[k.strip()] = v.strip()
    root = '../' if admin else ''; scripts = [s for s in m.get('scripts', '').split(',') if s]
    css = ['base', 'components', 'pages'] + (['ambient'] if not admin else ['admin']) + [c for c in m.get('css', '').split(',') if c] + ([] if admin else ['mobile'])
    css_html = ''.join('<link rel="stylesheet" href="%sassets/css/%s.css">\n' % (root, c) for c in css if os.path.exists(os.path.join(ROOT, 'assets/css/%s.css' % c)))
    if 'swiper' in scripts: css_html += '<link rel="stylesheet" href="%sassets/vendor/swiper-bundle.min.css">\n' % root
    d = dict(root=root, title=m.get('title', 'Isharvam Villas'), desc=m.get('desc', 'Privately managed luxury villas.'), css=css_html, logo=P['logo-mark'].strip(), arrow=ARROW,
             robots='<meta name="robots" content="noindex, nofollow">' if admin or m.get('robots') == 'noindex' else '')
    head = sub(P['head'], d); cls = m.get('body', '') + (' admin' if admin else '') + (' no-wa' if m.get('wa') == '0' else '')
    out = head + '<body class="%s" data-nav="%s">\n' % (cls.strip(), m.get('nav', ''))
    if admin: out += sub(P['admin-shell-top'], d) + sub(body, d) + P['admin-shell-bottom']
    else: out += sub(P['header'], d) + '<main id="main">\n' + sub(body, d) + '\n</main>\n' + sub(P['footer'], d)
    base = ['assets/js/config.js', 'assets/js/photos.js', 'assets/js/mock-data.js', 'assets/js/icons.js', 'assets/js/utils.js']
    if not admin or m.get('calendar') == '1': base += ['assets/js/calendar.js']
    base += ['assets/js/ui.js', 'assets/js/ambient.js'] if not admin else ['assets/js/admin-core.js']
    for s in scripts: base.append(VENDOR.get(s, 'assets/js/%s.js' % s))
    out += ''.join('<script src="%s%s"></script>\n' % (root, s) for s in base) + '</body>\n</html>\n'
    outp = os.path.join(ROOT, ('admin/' if admin else '') + os.path.basename(path)); open(outp, 'w', encoding='utf-8').write(out); return outp
if __name__ == '__main__':
    n = 0
    for p in sorted(glob.glob(os.path.join(ROOT, 'src/pages/*.html'))): build(os.path.relpath(p, ROOT), False); n += 1
    for p in sorted(glob.glob(os.path.join(ROOT, 'src/pages/admin/*.html'))): build(os.path.relpath(p, ROOT), True); n += 1
    print('built', n, 'pages')
