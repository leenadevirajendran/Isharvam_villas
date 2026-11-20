#!/usr/bin/env python3
"""Converts photos from ./incoming-photos/ into site-ready WebP (2000px wide + 800px -sm) under assets/img/villas or assets/img/site.
File names must match PHOTO-PROMPTS.md (e.g. villa-aanya-1.jpg, loc-sagar-cove.png, interior-warm.jpg). Reports what is still a placeholder."""
import os, sys, glob
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'incoming-photos')
def target(stem):
    return 'assets/img/villas' if stem.startswith('villa-') else 'assets/img/site'
def save(im, path, w, q):
    im = im.convert('RGB'); 
    if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=q, method=6)
done = []
if not os.path.isdir(SRC): os.makedirs(SRC); print('Created incoming-photos/. Put your photos there and run again.'); sys.exit(0)
for f in sorted(glob.glob(os.path.join(SRC, '*'))):
    stem, ext = os.path.splitext(os.path.basename(f))
    if ext.lower() not in ('.jpg', '.jpeg', '.png', '.webp'): continue
    stem = stem.replace('-sm', '')
    d = os.path.join(ROOT, target(stem)); im = Image.open(f)
    save(im, os.path.join(d, stem + '.webp'), 2000 if stem not in ('hero',) else 2400, 82); save(im, os.path.join(d, stem + '-sm.webp'), 800, 78); done.append(stem)
print('Imported %d photo(s): %s' % (len(done), ', '.join(done) or 'none'))
sys.path.insert(0, os.path.join(ROOT, 'tools')); import roster as R
want = ['villa-%s-%d' % (v[0].lower(), n) for v in R.V for n in range(1, 6)] + ['interior-warm', 'portrait', 'about', 'exp-dining', 'exp-garden', 'exp-pool', 'exp-spa', 'exp-stars'] + ['loc-' + l['id'] for l in R.LOCATIONS]
have = set(os.path.splitext(os.path.basename(f))[0] for f in glob.glob(os.path.join(SRC, '*')))
missing = [w for w in want if w not in have]
print('Still placeholders (%d of %d): %s' % (len(missing), len(want), ', '.join(missing[:12]) + (' ...' if len(missing) > 12 else '')))
