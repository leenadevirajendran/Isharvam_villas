#!/usr/bin/env python3
"""Generates the PLACEHOLDER architectural illustrations (WebP) used until the client supplies real photography.
Usage: python3 tools/gen_images.py            (all)       python3 tools/gen_images.py test   (one preview)
Requires: rsvg-convert, Pillow with WebP. Output: assets/img/villas/*.webp and assets/img/site/*.webp"""
import os, random, subprocess, io, sys, math
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from roster import VILLAS, LOCMAP

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTV = os.path.join(ROOT, 'assets/img/villas'); OUTS = os.path.join(ROOT, 'assets/img/site')
os.makedirs(OUTV, exist_ok=True); os.makedirs(OUTS, exist_ok=True)

def h2r(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def r2h(c): return '#%02x%02x%02x' % tuple(max(0, min(255, int(round(v)))) for v in c)
def mix(a, b, t): A, B = h2r(a), h2r(b); return r2h([A[i]+(B[i]-A[i])*t for i in range(3)])

TIMES = {
 'day':    dict(sky=('#78BDE6', '#DCEFF3'), light=1.0, glow=0.0, tint=('#FFFFFF', 0.0), stars=0.0, sun=(0.80, 0.16, '#FFF4CF'), water=('#4FA7C7', '#9AD4E0')),
 'golden': dict(sky=('#5E9BD1', '#FBD6A2'), light=0.95, glow=0.30, tint=('#FFB25C', 0.17), stars=0.0, sun=(0.78, 0.50, '#FFE0A0'), water=('#B9835F', '#F2B987')),
 'dusk':   dict(sky=('#1E2C5C', '#F0A586'), light=0.62, glow=0.85, tint=('#3B3F85', 0.26), stars=0.35, sun=None, water=('#2A3C6E', '#C77F7C')),
 'night':  dict(sky=('#060B1B', '#1C2D58'), light=0.30, glow=1.0, tint=('#0B1633', 0.42), stars=1.0, sun=None, water=('#0A1430', '#1E3566')),
}
WALLS = {'sand': '#E7DCC8', 'stone': '#BDB6A8', 'ivory': '#F1EEE6', 'timber': '#A97B52', 'concrete': '#A9ADB0', 'terracotta': '#D8A07C'}
LAMP = '#FFC878'

class Scene:
    def __init__(self, W, H, t, seed):
        self.W, self.H, self.t, self.T = W, H, t, TIMES[t]
        self.rng = random.Random(seed); self.o = []; self.defs = []; self.n = 0
    def uid(self): self.n += 1; return 'g%d' % self.n
    def c(self, col):  # time-of-day colour grading
        T = self.T; col = mix(col, T['tint'][0], T['tint'][1]); return mix(col, '#0A1226', 1 - T['light'])
    def add(self, s): self.o.append(s)
    def rect(self, x, y, w, h, fill, extra='', raw=False):
        self.add('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" %s/>' % (x, y, w, h, fill if raw else self.c(fill), extra))
    def poly(self, pts, fill, extra='', raw=False):
        self.add('<polygon points="%s" fill="%s" %s/>' % (' '.join('%.1f,%.1f' % p for p in pts), fill if raw else self.c(fill), extra))
    def ell(self, cx, cy, rx, ry, fill, extra='', raw=False):
        self.add('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s" %s/>' % (cx, cy, rx, ry, fill if raw else self.c(fill), extra))
    def lin(self, a, b, vertical=True):
        i = self.uid(); self.defs.append('<linearGradient id="%s" x1="0" y1="0" x2="%d" y2="%d"><stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>' % (i, 0 if vertical else 1, 1 if vertical else 0, a, b)); return 'url(#%s)' % i
    def glowspot(self, cx, cy, r, op):
        i = self.uid(); self.defs.append('<radialGradient id="%s"><stop offset="0" stop-color="%s" stop-opacity="%.2f"/><stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient>' % (i, LAMP, op, LAMP))
        self.add('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="url(#%s)"/>' % (cx, cy, r, i))
    def window(self, x, y, w, h, lit=None, frame='#1B2230'):
        g = self.T['glow'] if lit is None else lit
        base = mix('#8FB3C9', '#27364A', 0.0 if self.t == 'day' else 0.5 if self.t == 'golden' else 0.8)
        self.rect(x, y, w, h, base, raw=True)
        if self.t == 'day': self.poly([(x+w*.15, y), (x+w*.45, y), (x+w*.15+0, y+h*.0+h*.8), (x, y+h*.8)], '#FFFFFF', 'opacity=".18"', raw=True)
        if g > .05:
            self.rect(x, y, w, h, LAMP, 'opacity="%.2f"' % (0.9*g if self.t != 'golden' else 0.45), raw=True)
            self.glowspot(x+w/2, y+h/2, max(w, h)*1.2, 0.35*g)
        self.add('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="none" stroke="%s" stroke-width="3"/>' % (x, y, w, h, frame))
        self.add('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2"/>' % (x+w/2, y, x+w/2, y+h, frame))

def sky(s, y0, y1, x0=0, x1=None):
    x1 = x1 or s.W; T = s.T
    s.rect(x0, y0, x1-x0, y1-y0, s.lin(*T['sky']), raw=True)
    if T['stars'] > 0:
        for _ in range(int(160*T['stars'])):
            x = s.rng.uniform(x0, x1); y = s.rng.uniform(y0, y0+(y1-y0)*.7); s.add('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#fff" opacity="%.2f"/>' % (x, y, s.rng.choice([.8, 1, 1.4, 1.8]), s.rng.uniform(.4, .95)*T['stars']))
    if T['sun']:
        fx, fy, col = T['sun']; cx, cy = x0+(x1-x0)*fx, y0+(y1-y0)*fy
        s.glowspot(cx, cy, 220, .55); s.add('<circle cx="%.1f" cy="%.1f" r="46" fill="%s"/>' % (cx, cy, col))
    elif s.t == 'night':
        cx, cy = x0+(x1-x0)*.8, y0+(y1-y0)*.2; s.glowspot(cx, cy, 160, .25); s.add('<circle cx="%.1f" cy="%.1f" r="28" fill="#F3F0E2"/>' % (cx, cy))
    for _ in range(4):
        cx = s.rng.uniform(x0, x1); cy = y0+(y1-y0)*s.rng.uniform(.1, .6); w = s.rng.uniform(120, 260)
        for k in range(3): s.ell(cx+k*w*.25, cy+(k % 2)*8, w*.35, 16+k*3, '#FFFFFF', 'opacity="%.2f"' % (.55 if s.t == 'day' else .22), )

def mountains(s, hz, x0=0, x1=None, snow=True, scale=1.0):
    x1 = x1 or s.W; W = x1-x0
    layers = [('#9FB2C8', .55, 4), ('#7F98B0', .38, 5), ('#5E7C8C', .22, 6)]
    for li, (col, hh, n) in enumerate(layers):
        pts = [(x0, hz)]
        for k in range(n*2+1):
            x = x0+W*k/(n*2); pk = (k % 2 == 1)
            y = hz - (s.rng.uniform(.6, 1.0) if pk else s.rng.uniform(.15, .35))*hh*300*scale
            pts.append((x, y))
        pts.append((x1, hz)); s.poly(pts, col)
        if snow and li == 0:
            for i in range(1, len(pts)-1):
                if i % 2 == 1:
                    x, y = pts[i]; s.poly([(x-46, y+58), (x, y), (x+46, y+58), (x+18, y+44), (x, y+60), (x-14, y+46)], '#F4F7FA')

def hills(s, hz, col1='#6F9B6A', col2='#4E7F55', x0=0, x1=None):
    x1 = x1 or s.W; W = x1-x0
    for col, off, amp in ((col1, 0, 60), (col2, 40, 45)):
        d = 'M%.0f,%.0f ' % (x0, hz+off+30)
        for k in range(0, 9):
            x = x0+W*k/8; y = hz+off-amp*s.rng.uniform(.2, 1)
            d += 'L%.1f,%.1f ' % (x, y)
        d += 'L%.0f,%.0f Z' % (x1, hz+off+90)
        s.add('<path d="%s" fill="%s" stroke="none"/>' % (d.replace('L', 'S', 0), s.c(col)))
        # smooth via round joins
def sea(s, hz, bottom, x0=0, x1=None):
    x1 = x1 or s.W; s.rect(x0, hz, x1-x0, bottom-hz, s.lin(*s.T['water']), raw=True)
    for _ in range(40):
        x = s.rng.uniform(x0, x1); y = s.rng.uniform(hz+6, bottom-6); w = s.rng.uniform(30, 120)
        s.add('<rect x="%.0f" y="%.0f" width="%.0f" height="2" fill="#fff" opacity="%.2f"/>' % (x, y, w, .12 if s.t in ('day', 'golden') else .07))

def setting_bg(s, setting, hz, x0=0, x1=None, bottom=None):
    x1 = x1 or s.W; bottom = bottom or s.H
    if setting == 'mountain': mountains(s, hz, x0, x1, True, 1.0); hills(s, hz+10, '#5F8A62', '#46735A', x0, x1)
    elif setting == 'coast': sea(s, hz, hz+170, x0, x1); hills(s, hz+140, '#7BA56E', '#5C8B5E', x0, x1)
    elif setting == 'lake': mountains(s, hz, x0, x1, False, .55); sea(s, hz, hz+150, x0, x1); hills(s, hz+130, '#6F9B6A', '#4E7F55', x0, x1)
    elif setting == 'valley': mountains(s, hz, x0, x1, False, .5); hills(s, hz+10, '#6F9B6A', '#4E7F55', x0, x1)
    else: hills(s, hz, '#86AD74', '#659B64', x0, x1)

def tree(s, x, base, h, kind='round', col='#3E7A4E'):
    s.rect(x-4, base-h*.35, 8, h*.35, '#5A4333')
    if kind == 'pine':
        for k in range(4): s.poly([(x-h*.22+k*4, base-h*.25-k*h*.18), (x, base-h*.55-k*h*.18), (x+h*.22-k*4, base-h*.25-k*h*.18)], col)
    elif kind == 'palm':
        s.rect(x-3, base-h, 6, h, '#7A6248')
        for a in (-70, -35, 0, 35, 70, 105, 145):
            r = math.radians(a); ex, ey = x+math.cos(r)*h*.45, base-h-math.sin(r)*h*.18+abs(math.sin(r))*0
            s.add('<path d="M%.1f,%.1f Q%.1f,%.1f %.1f,%.1f" stroke="%s" stroke-width="7" fill="none" stroke-linecap="round"/>' % (x, base-h, (x+ex)/2, base-h-h*.22, ex, base-h+h*.14, s.c(col)))
    else:
        s.ell(x, base-h*.62, h*.32, h*.30, col); s.ell(x-h*.18, base-h*.5, h*.22, h*.2, mix(col, '#2F5E3F', .3)); s.ell(x+h*.18, base-h*.52, h*.22, h*.2, mix(col, '#5E9A5E', .25))

def pool(s, x, y, w, h, infinity=False):
    top, bot = ('#5CD0E4', '#2FA6C4')
    s.rect(x-10, y-8, w+20, h+16, '#D8D2C4')
    s.rect(x, y, w, h, s.lin(mix(top, '#FFFFFF', 0) if s.t in ('day', 'golden') else '#20B8D2', bot if s.t in ('day', 'golden') else '#0E6E88'), raw=True)
    if s.T['glow'] > .3: s.rect(x, y, w, h, '#20B8D2', 'opacity="%.2f"' % (.35*s.T['glow']), raw=True)
    for k in range(7): s.add('<rect x="%.0f" y="%.0f" width="%.0f" height="2" fill="#fff" opacity=".28"/>' % (x+s.rng.uniform(10, w*.5), y+8+k*h/8, s.rng.uniform(40, 150)))

def lounger(s, x, y, col='#F4F0E8'):
    s.rect(x, y, 90, 12, col); s.poly([(x+90, y), (x+120, y-26), (x+128, y-22), (x+98, y+12)], col); s.rect(x+4, y+12, 5, 14, '#555'); s.rect(x+80, y+12, 5, 14, '#555')

def facade_lights(s, n, x0, x1, y):
    if s.T['glow'] > .5:
        for k in range(n): s.glowspot(x0+(x1-x0)*k/(max(1, n-1)), y, 36, .5);

# ---------- villa styles ----------
def v_contemporary(s, cx, gy, wall):
    s.rect(cx-560, gy, 1120, 18, '#CFC8B8')
    s.rect(cx-420, gy-190, 640, 190, wall); s.rect(cx-300, gy-370, 640, 180, mix('#6B4A33', wall, .1))
    for k in range(3): s.window(cx-396+k*198, gy-170, 180, 150)
    for k in range(4): s.window(cx-280+k*152, gy-350, 134, 140)
    s.rect(cx-500, gy-392, 880, 20, '#262B33'); s.rect(cx-440, gy-212, 760, 14, '#262B33')
    for x in (cx-410, cx+200): s.rect(x, gy-190, 8, 190, '#262B33')
    s.rect(cx+240, gy-150, 120, 150, mix(wall, '#000', .1)); s.window(cx+256, gy-136, 88, 118)
def v_pool(s, cx, gy, wall):
    s.rect(cx-600, gy, 1200, 16, '#CFC8B8'); s.rect(cx-520, gy-210, 940, 210, wall)
    s.rect(cx-570, gy-240, 1040, 28, '#2A2F36'); s.rect(cx-520, gy-212, 940, 10, mix('#8A5E3C', wall, .1))
    for k in range(5): s.window(cx-500+k*186, gy-190, 170, 176)
    s.rect(cx+300, gy-210, 150, 210, mix(wall, '#6B4A33', .4))
def v_nature(s, cx, gy, wall):
    s.rect(cx-500, gy-30, 980, 16, '#8B6A4A')
    for x in range(-480, 480, 140): s.rect(cx+x, gy-14, 10, 60, '#5A4333')
    s.rect(cx-400, gy-230, 720, 200, wall); s.poly([(cx-460, gy-230), (cx+380, gy-290), (cx+380, gy-264), (cx-460, gy-210)], '#2D3A33')
    for k in range(4): s.window(cx-380+k*172, gy-205, 150, 150)
    s.rect(cx+250, gy-205, 70, 175, mix(wall, '#3A2A1E', .35))
    for x in range(-390, 330, 36): s.add('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2" opacity=".35"/>' % (cx+x, gy-230, cx+x, gy-30, s.c('#3A2A1E')))
def v_mountain(s, cx, gy, wall):
    s.rect(cx-440, gy-110, 880, 110, '#8C877C')
    s.rect(cx-420, gy-300, 840, 200, mix('#8B5E3C', wall, .1))
    s.poly([(cx-480, gy-290), (cx-120, gy-470), (cx+240, gy-290)], '#34302E'); s.poly([(cx-120, gy-290), (cx+200, gy-420), (cx+500, gy-290)], '#3C3836')
    s.poly([(cx-120, gy-470), (cx-60, gy-440), (cx-250, gy-352), (cx-300, gy-370)], '#F4F7FA'); s.poly([(cx+200, gy-420), (cx+260, gy-394), (cx+90, gy-352), (cx+30, gy-372)], '#F4F7FA')
    s.rect(cx+310, gy-440, 40, 120, '#8C877C');
    for k in range(5): s.window(cx-390+k*160, gy-270, 110, 130)
    for k in range(4): s.window(cx-360+k*190, gy-90, 130, 70)
    if s.t != 'day':
        for k in range(3): s.ell(cx+330+k*14, gy-470-k*40, 24+k*12, 14+k*5, '#E8EAEF', 'opacity=".25"', raw=True)
def v_family(s, cx, gy, wall):
    s.rect(cx-380, gy-250, 760, 250, wall); s.poly([(cx-420, gy-250), (cx, gy-420), (cx+420, gy-250)], '#7E4C3A')
    for k in range(3):
        s.window(cx-320+k*230, gy-210, 110, 120); s.window(cx-320+k*230, gy-76, 110, 60) if k != 1 else None
    s.rect(cx-52, gy-120, 104, 120, '#3E2E26'); s.glowspot(cx, gy-140, 70, .3*s.T['glow'])
    s.rect(cx-110, gy-130, 220, 10, '#EFEAE0'); s.rect(cx-110, gy-130, 6, 130, '#EFEAE0'); s.rect(cx+104, gy-130, 6, 130, '#EFEAE0')
    s.rect(cx+380, gy-210, 50, 210, '#9B7455'); s.rect(cx+370, gy-216, 70, 10, '#6F4F38')
    s.window(cx-60, gy-368, 120, 70, frame='#EFEAE0')
def v_garden(s, cx, gy, wall):
    s.rect(cx-480, gy-180, 900, 180, wall); s.poly([(cx-520, gy-180), (cx-380, gy-290), (cx+300, gy-290), (cx+460, gy-180)], '#B2573B')
    for k in range(4):
        x = cx-440+k*215; s.rect(x, gy-160, 120, 160, mix(wall, '#000', .06)); s.add('<path d="M%.0f,%.0f v-60 a60,60 0 0 1 120,0 v60 z" fill="%s"/>' % (x, gy-90, s.c('#2E2A28'))); s.window(x+22, gy-142, 76, 130, frame='#2E2A28')
    for x in range(-460, 440, 60): s.rect(cx+x, gy-210+110, 6, 0, '#000')
    s.rect(cx+210, gy-340, 40, 60, mix(wall, '#000', .1))
    for k in range(5): s.rect(cx-500+k*190, gy-24, 30, 24, '#E6D8C8');
def v_architectural(s, cx, gy, wall):
    s.rect(cx-520, gy-30, 1040, 30, '#C9C7C1')
    s.rect(cx-480, gy-250, 380, 220, mix('#C9CDD0', wall, .3)); s.rect(cx-130, gy-190, 340, 160, '#7B5A41'); s.rect(cx+150, gy-370, 330, 340, '#F2F0EA')
    s.rect(cx-520, gy-268, 520, 18, '#1D2128'); s.rect(cx-170, gy-208, 440, 18, '#1D2128'); s.rect(cx+120, gy-388, 400, 18, '#1D2128')
    s.window(cx-450, gy-225, 320, 170); s.window(cx-100, gy-168, 280, 120); s.window(cx+180, gy-340, 260, 150); s.window(cx+180, gy-170, 150, 120); s.rect(cx+345, gy-170, 105, 140, '#1D2128')
STYLES = dict(contemporary=v_contemporary, pool=v_pool, nature=v_nature, mountain=v_mountain, family=v_family, garden=v_garden, architectural=v_architectural)
SCENE_POOL = dict(pool=1, contemporary=1, family=1, architectural=0, garden=0, nature=0, mountain=0)

def exterior(W, H, t, villa, setting, hero=False):
    s = Scene(W, H, t, villa['seed'] + hash(t) % 97); hz = int(H*.50)
    sky(s, 0, H); setting_bg(s, setting, hz)
    gy = int(H*.70)
    s.rect(0, hz+60, W, H-hz-60, mix('#7FA86A', '#6C9A5E', .4)); s.rect(0, gy, W, H-gy, mix('#8DB478', '#6D9A5E', .5))
    # distant trees
    for k in range(14):
        x = s.rng.uniform(0, W); tree(s, x, gy-8, s.rng.uniform(70, 130), 'pine' if setting in ('mountain', 'valley') else 'round', '#2F6A46')
    STYLES[villa['style']](s, int(W*.46), gy, WALLS[villa['wall']])
    fy = gy+90
    s.rect(0, fy, W, H-fy, mix('#D8D2C4', '#C2BCAE', .3))
    if SCENE_POOL[villa['style']] or villa['category'] == 'Private Pool':
        pool(s, int(W*.20), fy+30, int(W*.58), int(H*.12)); lounger(s, int(W*.12), fy+10); lounger(s, int(W*.84), fy+10)
    else:
        for k in range(8): s.rect(W*.16+k*W*.09, fy+int(H*.07), 70, 8, '#E9E3D6');
    for k in range(10):
        x = s.rng.choice([s.rng.uniform(0, W*.14), s.rng.uniform(W*.86, W)]); tree(s, x, H-int(H*.02), s.rng.uniform(200, 340), 'palm' if setting == 'coast' else ('pine' if setting == 'mountain' else 'round'), '#2F6A46')
    if s.T['glow'] > .5:
        for k in range(9): s.glowspot(W*.1+k*W*.1, H-int(H*.04), 28, .45)
    finish(s)
    return s

def finish(s):
    W, H = s.W, s.H
    s.defs.append('<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="%.2f"/></radialGradient>' % (0.28 if s.t in ('day', 'golden') else 0.42))
    s.add('<rect width="%d" height="%d" fill="url(#vig)"/>' % (W, H))
    s.defs.append('<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .07 0"/></filter>')
    s.add('<rect width="%d" height="%d" filter="url(#grain)"/>' % (W, H))

# ---------- interiors & details ----------
def bedroom(W, H, t, villa, setting):
    s = Scene(W, H, t, villa['seed']+11); wall = mix(WALLS[villa['wall']], '#F4EFE4', .55)
    s.rect(0, 0, W, H, wall); s.rect(0, int(H*.74), W, H, '#B58B63');
    for x in range(0, W, 90): s.add('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2" opacity=".35"/>' % (x, H*.74, x-60, H, s.c('#7A5A3A')))
    wx, wy, ww, wh = int(W*.58), int(H*.12), int(W*.34), int(H*.56)
    sky(s, wy, wy+wh, wx, wx+ww); hzz = wy+int(wh*.62); setting_bg(s, setting, hzz, wx, wx+ww)
    s.rect(wx, hzz+30, ww, wy+wh-hzz-30, '#6F9B6A')
    s.add('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="%s" stroke-width="10"/>' % (wx, wy, ww, wh, s.c('#2A2F36')))
    s.add('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="6"/>' % (wx+ww/2, wy, wx+ww/2, wy+wh, s.c('#2A2F36')))
    s.rect(wx-60, wy-20, 55, wh+60, '#E9E1D2'); s.rect(wx+ww+5, wy-20, 55, wh+60, '#E9E1D2')
    bx = int(W*.08); by = int(H*.50)
    s.rect(bx, by-150, 640, 150, '#7C5B43'); s.rect(bx+20, by-20, 600, 40, '#E9E4DA'); s.rect(bx+10, by+16, 620, 110, '#7C5B43')
    for k in range(3): s.rect(bx+40+k*190, by-70, 170, 50, '#F6F2EA');
    s.rect(bx+20, by+10, 600, 40, '#9AA5A8'); s.rect(bx+330, by+10, 290, 40, '#C6B79A')
    for lx in (bx-80, bx+650):
        s.rect(lx, by-20, 60, 100, '#6F5039'); s.rect(lx+18, by-70, 24, 52, '#EADFC8'); s.glowspot(lx+30, by-48, 100, .55*s.T['glow'] if t != 'day' else .12)
    s.ell(W*.46, H*.9, 430, 56, '#C9B9A0');
    s.add('<line x1="%d" y1="0" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>' % (W*.3, W*.3, H*.14, s.c('#222'))); s.ell(W*.3, H*.16, 52, 22, '#E8D9B8'); s.glowspot(W*.3, H*.2, 150, .6*s.T['glow'] if t != 'day' else .15)
    s.add('<path d="M%d,%d q40,-90 120,-20" stroke="%s" stroke-width="12" fill="none"/>' % (W*.07, H*.46, s.c('#5F7A5A')))
    finish(s); return s

def bathroom(W, H, t, villa, setting):
    s = Scene(W, H, t, villa['seed']+23); s.rect(0, 0, W, H, '#DCD6CB')
    for y in range(0, int(H*.7), 70): s.add('<line x1="0" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2" opacity=".3"/>' % (y, W, y, s.c('#9A9488')))
    s.rect(0, int(H*.72), W, H, '#B9B2A4')
    wx, wy, ww, wh = int(W*.10), int(H*.10), int(W*.28), int(H*.55)
    sky(s, wy, wy+wh, wx, wx+ww); setting_bg(s, setting, wy+int(wh*.6), wx, wx+ww); s.add('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="%s" stroke-width="9"/>' % (wx, wy, ww, wh, s.c('#2A2F36')))
    tx, ty = int(W*.30), int(H*.66)
    s.ell(tx+220, ty+60, 300, 82, '#F6F4EE'); s.ell(tx+220, ty+48, 270, 56, '#E3DED3'); s.rect(tx+180, ty-70, 12, 90, '#B7A27A');
    mx = int(W*.66); s.rect(mx, int(H*.52)+10, 460, 36, '#8B6A4A'); s.rect(mx+30, int(H*.52)+46, 400, 120, '#EDE7DA')
    s.ell(mx+110, int(H*.28), 100, 130, '#E9E4DA'); s.ell(mx+110, int(H*.28), 88, 118, '#BFD2DB', raw=False); s.ell(mx+340, int(H*.28), 100, 130, '#E9E4DA'); s.ell(mx+340, int(H*.28), 88, 118, '#BFD2DB')
    s.glowspot(mx+225, int(H*.28), 330, .35*s.T['glow']+.08)
    s.rect(W*.9, int(H*.4), 8, int(H*.33), '#6B8C6A'); s.ell(W*.9+4, int(H*.38), 52, 70, '#4F8A56')
    finish(s); return s

def dining(W, H, t, villa, setting):
    s = Scene(W, H, t if t != 'day' else 'golden', villa['seed']+31); hz = int(H*.46)
    sky(s, 0, H); setting_bg(s, setting, hz); s.rect(0, hz+80, W, H, '#6C9A5E'); s.rect(0, int(H*.66), W, H, '#CFC7B6')
    tx = int(W*.22); ty = int(H*.70)
    s.rect(tx, ty-20, W*.56, 26, '#7C5B43');
    for x in (tx+30, tx+W*.56-60): s.rect(x, ty, 20, 150, '#5A4333')
    s.rect(tx+W*.1, ty-34, 200, 14, '#F4EFE4', );
    for k in range(6):
        x = tx+60+k*W*.085; s.rect(x, ty+30, 52, 10, '#2C2C2C'); s.rect(x+4, ty+36, 6, 110, '#2C2C2C'); s.rect(x+4, ty-70, 44, 6, '#2C2C2C')
    s.add('<path d="M0,%d Q%d,%d %d,%d T%d,%d" stroke="%s" stroke-width="2" fill="none"/>' % (int(H*.12), W*.25, int(H*.22), W*.5, int(H*.12), W, int(H*.14), s.c('#111')))
    for k in range(18):
        x = k*W/17; y = int(H*.12)+ (math.sin(k/17*math.pi*2)*-1 + 0)*0 + (int(H*.07) if 0 < k < 17 else 0)*math.sin(k/17*math.pi)
        s.glowspot(x, y+int(H*.05), 46, .8*max(.25, s.T['glow'])); s.add('<circle cx="%.0f" cy="%.0f" r="5" fill="%s"/>' % (x, y+int(H*.05), LAMP))
    for k in range(6):
        x = tx+80+k*W*.085; s.rect(x, ty-60, 14, 40, '#E8DCC0'); s.glowspot(x+7, ty-70, 40, .6*max(.2, s.T['glow']))
    for k in range(6): tree(s, s.rng.uniform(0, W), int(H*.62), s.rng.uniform(150, 260), 'palm' if setting == 'coast' else 'round', '#2F6A46')
    finish(s); return s

def poolview(W, H, t, villa, setting):
    s = Scene(W, H, t, villa['seed']+41); hz = int(H*.42)
    sky(s, 0, H); setting_bg(s, setting, hz)
    s.rect(0, hz+60, W, H, '#6C9A5E'); s.rect(0, int(H*.52), W, H, '#D8D2C4')
    pool(s, int(W*.06), int(H*.56), int(W*.88), int(H*.26), True)
    s.rect(int(W*.06)-10, int(H*.56)-12, int(W*.88)+20, 8, '#EFEAE0')
    lounger(s, int(W*.12), int(H*.88)); lounger(s, int(W*.30), int(H*.90));
    s.rect(int(W*.70), int(H*.80), 8, 150, '#6B5A48'); s.ell(int(W*.70)+4, int(H*.80), 150, 34, '#F4F0E8')
    tree(s, int(W*.93), int(H*.98), 340, 'palm' if setting == 'coast' else 'round', '#2F6A46')
    finish(s); return s

# ---------- output ----------
def render(s, path, size=None, q=80):
    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d"><defs>%s</defs>%s</svg>' % (s.W, s.H, s.W, s.H, ''.join(s.defs), ''.join(s.o))
    png = subprocess.run(['rsvg-convert', '-w', str(s.W)], input=svg.encode(), capture_output=True, check=True).stdout
    im = Image.open(io.BytesIO(png)).convert('RGB'); im.save(path, 'WEBP', quality=q, method=6)
    sm = im.resize((800, int(800*s.H/s.W)), Image.LANCZOS); sm.save(path.replace('.webp', '-sm.webp'), 'WEBP', quality=74, method=6)

def build_villa(v):
    setting = LOCMAP[v['loc']]['setting']; i = int(v['id'][-2:]); W, H = 1600, 1000
    t1 = 'golden' if i % 2 else 'day'
    jobs = [(1, lambda: exterior(W, H, t1, v, setting)), (2, lambda: poolview(W, H, 'golden' if i % 3 else 'day', v, setting)),
            (3, lambda: bedroom(W, H, 'day' if i % 2 else 'golden', v, setting)),
            (4, lambda: bathroom(W, H, 'day', v, setting) if i % 2 == 0 else dining(W, H, 'dusk', v, setting)),
            (5, lambda: exterior(W, H, 'dusk' if i % 2 else 'night', v, setting))]
    for n, f in jobs: render(f(), os.path.join(OUTV, '%s-%d.webp' % (v['slug'], n)))

def build_site():
    hv = VILLAS[2]; hs = LOCMAP[hv['loc']]['setting']
    render(exterior(2400, 1400, 'dusk', hv, hs, True), os.path.join(OUTS, 'hero.webp'), q=78)
    for t in ('day', 'golden', 'dusk', 'night'): render(exterior(1600, 1000, t, VILLAS[0], 'coast'), os.path.join(OUTS, 'scene-%s.webp' % t))
    render(bedroom(1600, 1000, 'dusk', VILLAS[1], 'mountain'), os.path.join(OUTS, 'interior-warm.webp'))
    render(dining(1600, 1000, 'dusk', VILLAS[2], 'coast'), os.path.join(OUTS, 'exp-dining.webp'))
    render(poolview(1600, 1000, 'golden', VILLAS[0], 'coast'), os.path.join(OUTS, 'exp-pool.webp'))
    render(bathroom(1600, 1000, 'day', VILLAS[4], 'lake'), os.path.join(OUTS, 'exp-spa.webp'))
    render(exterior(1600, 1000, 'golden', VILLAS[6], 'garden'), os.path.join(OUTS, 'exp-garden.webp'))
    render(exterior(1600, 1000, 'night', VILLAS[1], 'mountain'), os.path.join(OUTS, 'exp-stars.webp'))
    render(exterior(1600, 1000, 'day', VILLAS[8], 'coast'), os.path.join(OUTS, 'about.webp'))
    render(exterior(1200, 1600, 'golden', VILLAS[11], 'valley'), os.path.join(OUTS, 'portrait.webp'))
    for l in LOCMAP.values():
        v = next(x for x in VILLAS if x['loc'] == l['id']); render(exterior(1200, 900, 'golden', v, l['setting']), os.path.join(OUTS, 'loc-%s.webp' % l['id']))
    # fallback image (graceful degradation)
    fb = Scene(1600, 1000, 'dusk', 1); sky(fb, 0, 1000); mountains(fb, 620, 0, 1600); fb.rect(0, 620, 1600, 380, '#2D4A46'); finish(fb); render(fb, os.path.join(OUTS, 'fallback.webp'))

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        os.makedirs('/tmp/prev', exist_ok=True)
        for k, (v, f) in enumerate([(VILLAS[0], 'ex'), (VILLAS[1], 'ex'), (VILLAS[2], 'ex'), (VILLAS[5], 'ex'), (VILLAS[7], 'ex'), (VILLAS[6], 'ex'), (VILLAS[3], 'ex')]):
            setting = LOCMAP[v['loc']]['setting']; render(exterior(1600, 1000, 'golden' if k % 2 else 'dusk', v, setting), '/tmp/prev/ex%d.webp' % k)
        render(bedroom(1600, 1000, 'golden', VILLAS[1], 'mountain'), '/tmp/prev/bed.webp'); render(bathroom(1600, 1000, 'day', VILLAS[1], 'lake'), '/tmp/prev/bath.webp')
        render(dining(1600, 1000, 'dusk', VILLAS[1], 'coast'), '/tmp/prev/din.webp'); render(poolview(1600, 1000, 'golden', VILLAS[0], 'coast'), '/tmp/prev/pool.webp')
    else:
        for v in VILLAS: build_villa(v); print(v['slug'], flush=True)
        build_site()
