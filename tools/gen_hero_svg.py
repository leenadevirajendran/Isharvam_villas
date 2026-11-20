"""Generates the hero illustration (sky + coloured line-art villa) and injects it into src/pages/index.html."""
import random, re, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = []
def el(tag, attrs, fill=None, line=True, th=False):
    a = ' '.join('%s="%s"' % (k, v) for k, v in attrs.items())
    if fill: out.append('<%s class="f" style="fill:%s" %s/>' % (tag, fill, a))
    if line: out.append('<%s class="d%s" pathLength="1" %s/>' % (tag, ' th' if th else '', a))
def rect(x, y, w, h, fill=None, line=True, rx=0, th=False):
    el('rect', dict(x=x, y=y, width=w, height=h, rx=rx), fill, line, th)
def poly(pts, fill=None, line=True, th=False):
    el('path', dict(d='M' + ' L'.join('%s %s' % p for p in pts) + 'Z'), fill, line, th)
def path(d, fill=None, line=True, th=False):
    el('path', dict(d=d), fill, line, th)
def circ(cx, cy, r, fill=None, line=True, th=False):
    el('circle', dict(cx=cx, cy=cy, r=r), fill, line, th)
def ell(cx, cy, rx, ry, fill=None, line=True, th=False):
    el('ellipse', dict(cx=cx, cy=cy, rx=rx, ry=ry), fill, line, th)
def strokes(d, th=True):
    path(d, None, True, th)

def win(x, y, w, h, kind='rect', main=False, cols=2, rows=2, curtain=True):
    cx, cy = x + w / 2, y + h / 2
    out.append('<g class="win%s">' % (' win--main' if main else ''))
    out.append('<ellipse class="halo" cx="%s" cy="%s" rx="%s" ry="%s" fill="url(#halo)" opacity="0"/>' % (cx, cy, w * 1.05 + 14, h * .95 + 14))
    if kind == 'round':
        out.append('<circle class="f" style="fill:var(--glass)" cx="%s" cy="%s" r="%s"/>' % (cx, cy, w / 2))
        out.append('<circle class="lit" cx="%s" cy="%s" r="%s" fill="url(#litg)" opacity="0"/>' % (cx, cy, w / 2))
        out.append('<circle class="d" pathLength="1" cx="%s" cy="%s" r="%s"/>' % (cx, cy, w / 2))
        out.append('<path class="d th" pathLength="1" d="M%s %s V%s M%s %s H%s"/>' % (cx, y, y + h, x, cy, x + w))
    else:
        out.append('<rect class="f" style="fill:var(--glass)" x="%s" y="%s" width="%s" height="%s"/>' % (x, y, w, h))
        out.append('<rect class="lit" x="%s" y="%s" width="%s" height="%s" fill="url(#litg)" opacity="0"/>' % (x, y, w, h))
        if curtain:
            out.append('<path class="lit" d="M%s %s h%s v%s q-%s -%s -%s -%s Z M%s %s h-%s v%s q%s -%s %s -%s Z" fill="#E8B96A" opacity="0"/>' % (x, y, w * .2, h * .6, w * .1, h * .12, w * .2, h * .2, x + w, y, w * .2, h * .6, w * .1, h * .12, w * .2, h * .2))
        out.append('<rect class="d" pathLength="1" x="%s" y="%s" width="%s" height="%s"/>' % (x, y, w, h))
        d = ''.join('M%s %s V%s ' % (x + w * i / cols, y, y + h) for i in range(1, cols)) + ''.join('M%s %s H%s ' % (x, y + h * j / rows, x + w) for j in range(1, rows))
        out.append('<path class="d th" pathLength="1" d="%s"/>' % d.strip())
    out.append('</g>')

# ---------------- scene ----------------
# hills (soft, no outline) for depth
path('M-1200 566 L-1200 478 C-700 420 -260 492 120 462 S520 392 740 436 S1120 424 1500 478 L2400 452 V566Z', 'var(--hill)', False)
path('M-1200 566 L-1200 512 C-600 478 -80 520 300 500 S760 468 1000 500 S1500 500 2400 486 V566Z', 'var(--hill2)', False)
# lawn
path('M-1200 560 H2400 V5000 H-1200Z', 'var(--ground)', False)
# stone path + terrace
poly([(330, 562), (950, 562), (992, 600), (300, 600)], 'var(--stone)', False)
poly([(590, 566), (690, 566), (736, 700), (466, 700)], 'var(--stone)', True, True)
strokes('M572 600 H710 M548 640 H730 M520 680 H744')
# back tree (right) and cypress (left)
rect(1000, 470, 10, 94, 'var(--trunk)', True, 0, True)
circ(1005, 432, 56, 'var(--leaf1)'); circ(972, 458, 38, 'var(--leaf2)'); circ(1040, 456, 36, 'var(--leaf2)'); circ(1005, 396, 36, 'var(--leaf2)')
ell(285, 486, 22, 80, 'var(--leaf1)'); strokes('M285 420 V560 M274 470 Q285 458 296 470')
# ---------------- house ----------------
rect(330, 552, 620, 10, 'var(--stone)')                         # plinth
rect(340, 448, 160, 104, 'var(--wall)'); rect(780, 448, 160, 104, 'var(--wall)')   # wings
rect(500, 300, 280, 252, 'var(--wall)')                         # main block
rect(500, 406, 280, 8, 'var(--trim)')                           # string course
poly([(500, 300), (640, 198), (780, 300)], 'var(--wall2)')      # gable face
rect(728, 196, 30, 66, 'var(--chim)'); rect(722, 190, 42, 9, 'var(--trim)')            # chimney
path('M458 314 L640 170 L822 314 L800 314 L640 196 L480 314Z', 'var(--roof)')          # main roof (barge)
poly([(500, 392), (356, 392), (320, 454), (500, 454)], 'var(--roof2)'); poly([(780, 392), (924, 392), (960, 454), (780, 454)], 'var(--roof2)')
strokes('M492 410 H342 M486 428 H331 M788 410 H938 M794 428 H949')
# porch
poly([(582, 438), (698, 438), (712, 456), (568, 456)], 'var(--roof2)')
rect(592, 456, 8, 98, 'var(--trim)'); rect(680, 456, 8, 98, 'var(--trim)')
rect(610, 458, 60, 96, 'var(--wall2)', False)
# door leaf
path('M620 554 V482 Q620 466 640 466 Q660 466 660 482 V554Z', 'var(--door)')
circ(652, 520, 2.4, '#BCA77D', False)
# balcony
rect(598, 410, 84, 6, 'var(--trim)'); rect(600, 386, 80, 24, None, True, 0, True)
strokes('M612 386 V410 M624 386 V410 M636 386 V410 M648 386 V410 M660 386 V410 M672 386 V410')
# shutters + sills
for sx in (520, 702):
    rect(sx - 14, 452, 11, 76, 'var(--shutter)', True, 0, True); rect(sx + 61, 452, 11, 76, 'var(--shutter)', True, 0, True)
for sx in (536, 692):
    rect(sx - 14, 332, 11, 64, 'var(--shutter)', True, 0, True); rect(sx + 55, 332, 11, 64, 'var(--shutter)', True, 0, True)
for (sx, sy, sw) in ((516, 528, 66), (698, 528, 66), (532, 396, 60), (688, 396, 60), (366, 530, 92), (822, 530, 92)):
    rect(sx, sy, sw, 6, 'var(--trim)', True, 0, True)
# ---------------- windows (lit one by one) ----------------
win(372, 474, 80, 56, cols=3, rows=2)                   # left wing
win(520, 452, 58, 76)                                   # ground left
win(536, 332, 52, 64)                                   # upper left
win(622, 246, 36, 36, 'round', cols=2, rows=2)          # attic
win(620, 330, 40, 56, rows=3, cols=2, curtain=False)    # upper centre (french door)
win(692, 332, 52, 64)                                   # upper right
win(702, 452, 58, 76)                                   # ground right
win(828, 474, 80, 56, cols=3, rows=2)                   # right wing
win(626, 474, 28, 50, main=True, cols=2, rows=3, curtain=False)   # front door glass (zoom target)
# steps
rect(596, 554, 88, 7, 'var(--stone)'); rect(588, 561, 104, 7, 'var(--stone)')
# ---------------- foreground garden ----------------
for (cx, cy, r, c) in ((358, 546, 19, 'var(--leaf1)'), (392, 549, 14, 'var(--leaf2)'), (470, 549, 13, 'var(--leaf1)'), (572, 544, 14, 'var(--leaf2)'), (708, 544, 14, 'var(--leaf2)'),
                       (812, 549, 13, 'var(--leaf1)'), (890, 548, 15, 'var(--leaf2)'), (924, 545, 19, 'var(--leaf1)')):
    circ(cx, cy, r, c, True, True)
# lamp posts
strokes('M500 600 V646 M1076 642 V680 M296 570 V610', True)
# pool
rect(728, 600, 340, 84, 'var(--stone)', True, 14, True)
rect(741, 612, 314, 60, 'url(#pool-g)', True, 8, True)
out.append('<rect class="poollit" x="741" y="612" width="314" height="60" rx="8" fill="#8FE9F5" opacity="0"/>')
out.append('<g class="pool-lines" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity="0"><path d="M770 630 q18 -5 36 0 t36 0"/><path d="M900 650 q18 -5 36 0 t36 0"/><path d="M810 662 q14 -4 28 0 t28 0"/></g>')
# lights (night)
out.append('<g class="xlights" opacity="0">')
for (bx, by, r) in ((604, 490, 22), (676, 490, 22), (500, 596, 26), (1076, 638, 26), (296, 566, 26)):
    out.append('<circle cx="%s" cy="%s" r="%s" fill="url(#halo)"/><circle cx="%s" cy="%s" r="3.6" fill="#F2C879"/>' % (bx, by, r, bx, by))
for bx in range(588, 700, 16):
    out.append('<circle cx="%s" cy="459" r="2.8" fill="#F2C879"/>' % bx)
for bx in range(350, 500, 30):
    out.append('<circle cx="%s" cy="%s" r="2.4" fill="#F2C879"/>' % (bx, 456 - (bx - 350) // 40))
for bx in range(790, 950, 30):
    out.append('<circle cx="%s" cy="%s" r="2.4" fill="#F2C879"/>' % (bx, 456 + (bx - 790) // 40))
out.append('</g>')
house = '\n'.join(out)

# ---------------- sky ----------------
random.seed(7)
stars = ''.join('<circle cx="%d" cy="%d" r="%.1f"/>' % (random.randint(20, 1180), random.randint(20, 360), random.choice([.9, 1.1, 1.4, 1.7])) for _ in range(46))
sky = '''<svg class="wake__sky" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect class="sk-day" width="1200" height="700" fill="url(#sk-day)"/>
        <rect class="sk-dusk" width="1200" height="700" fill="url(#sk-dusk)" opacity="0"/>
        <rect class="sk-night" width="1200" height="700" fill="url(#sk-night)" opacity="0"/>
        <g class="cloud" fill="#fff" opacity=".8"><ellipse cx="240" cy="150" rx="90" ry="20"/><ellipse cx="300" cy="136" rx="60" ry="22"/><ellipse cx="900" cy="110" rx="100" ry="18"/><ellipse cx="960" cy="98" rx="56" ry="20"/><ellipse cx="620" cy="70" rx="70" ry="13"/></g>
        <g class="stars" fill="#F7F5F0" opacity="0">%s</g>
        <circle class="moon" cx="1010" cy="120" r="30" fill="#F3F0E2" opacity="0"/>
      </svg>''' % stars
svg = '''<svg class="wake__svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Illustration of a villa with a pool. As evening arrives its windows light one by one, then the garden lights and the pool glow.">
        <defs>
          <linearGradient id="sk-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FCBE0"/><stop offset="1" stop-color="#F3EEE2"/></linearGradient>
          <linearGradient id="sk-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26386A"/><stop offset="1" stop-color="#EFA487"/></linearGradient>
          <linearGradient id="sk-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070D1E"/><stop offset="1" stop-color="#1B3358"/></linearGradient>
          <radialGradient id="halo"><stop offset="0" stop-color="#F2C879" stop-opacity=".75"/><stop offset="1" stop-color="#F2C879" stop-opacity="0"/></radialGradient>
          <linearGradient id="litg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE2A6"/><stop offset="1" stop-color="#EDAE55"/></linearGradient>
          <linearGradient id="pool-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34C1D8"/><stop offset="1" stop-color="#0B7285"/></linearGradient>
        </defs>
        <g class="wake__world">
%s
        </g>
      </svg>''' % house
block = '<div class="wake__stage">\n      ' + sky + '\n      ' + svg + '\n      <div class="wake__reveal"><img src="assets/img/site/cover.webp" srcset="assets/img/site/cover-sm.webp 900w, assets/img/site/cover.webp 2000w" sizes="100vw" alt="A modern villa with a private pool and shaded terrace" width="2000" height="1333" decoding="async"><div class="wake__welcome"><p class="eyebrow">Welcome</p><p class="serif wake__welcome-t">Your villa is <em>ready.</em></p><a class="btn btn--primary btn--lg" href="villas.html" tabindex="-1">Discover the villas</a></div></div>\n    </div>\n    '
p = os.path.join(ROOT, 'src/pages/index.html')
s = open(p).read()
s = re.sub(r'<div class="wake__stage">.*?(?=<div class="container wake__copy">)', lambda m: block, s, count=1, flags=re.S)
open(p, 'w').write(s)
print('ok', len(house))
