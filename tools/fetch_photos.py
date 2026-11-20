#!/usr/bin/env python3
"""Run this ONCE on a computer with internet access. Downloads the temporary Pexels photographs, converts them to local WebP (2000px + 800px -sm)
into assets/img/, and switches the site to local files (assets/js/photos.js remote:false). Needs: pip install pillow"""
import os, sys, io, re, urllib.request
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__)); import photo_manifest as P
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def get(u):
    r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (IsharvamDemo)'}); return urllib.request.urlopen(r, timeout=40).read()
def save(im, path, w, q):
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=q, method=6)
slots = P.all_slots(); ok, bad, cache = 0, [], {}
for stem, pid in slots.items():
    d = os.path.join(ROOT, 'assets/img/villas' if stem.startswith('villa-') else 'assets/img/site')
    try:
        if pid not in cache: cache[pid] = Image.open(io.BytesIO(get(P.url(pid, 2000)))).convert('RGB')
        im = cache[pid]; save(im, os.path.join(d, stem + '.webp'), 2000, 80); save(im, os.path.join(d, stem + '-sm.webp'), 800, 76); ok += 1; print('ok', stem)
    except Exception as e:
        bad.append(stem); print('FAILED', stem, e)
print('%d downloaded, %d failed' % (ok, len(bad)))
if not bad:
    f = os.path.join(ROOT, 'assets/js/photos.js'); s = open(f).read(); open(f, 'w').write(s.replace('remote: true', 'remote: false')); print('Switched to local files (remote:false).')
else: print('Some failed; the site keeps using the remote photos. Re-run to retry.')
