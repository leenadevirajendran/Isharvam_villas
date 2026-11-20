#!/usr/bin/env python3
"""Writes PHOTO-PROMPTS.md: one ready-to-paste prompt per image slot, with the exact file name the site expects.
Generate photoreal images with any image model (Midjourney, Adobe Firefly, Flux, Imagen, Ideogram...) or commission a photographer,
drop the files into ./incoming-photos/ with these names (.jpg/.png/.webp), then run: python3 tools/import_photos.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import roster as R
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOC = {l['id']: l for l in R.LOCATIONS}
SETTING = {
 'aranya-ridge': 'set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light',
 'sagar-cove': 'a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light',
 'kamala-valley': 'in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky',
 'tarang-lakeside': 'on the shore of a calm lake, timber deck over the water, soft haze on the far bank',
 'meru-heights': 'high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light',
}
STYLE = {
 'pool': 'long rectangular private swimming pool and sun deck', 'mountain': 'stone-and-timber mountain lodge with large glazing',
}
BASE = ('Real architectural photography for a luxury hospitality brochure, shot on a full-frame camera, 24mm tilt-shift lens, natural light, '
        'true-to-life colour, subtle film grain, slightly imperfect and lived-in, no people, no text, no watermark, not over-saturated, not CGI, not a 3D render, '
        'no fantasy lighting, believable materials (limestone, teak, linen, concrete), shot in India')
SLOTS = {
 1: ('Exterior, daylight', 'front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape'),
 2: ('Pool or terrace', 'the pool deck or main terrace with loungers, mid-morning, 3:2 landscape'),
 3: ('Master bedroom', 'master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape'),
 4: ('Outdoor dining at dusk', 'outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape'),
 5: ('Evening exterior', 'the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape'),
}
out = ['# Photo prompt pack (Isharvam Villas)\n',
 'The site currently uses generated illustrations as stand-ins. Replace them with real photographs (or photoreal AI images) using the prompts below.\n',
 '**How:** make each image, save it under the exact file name shown (JPG, PNG or WebP, at least 2000 px wide, 3:2 landscape), put them all in a folder named `incoming-photos/` at the project root, then run `python3 tools/import_photos.py`. It converts them to WebP, creates the small `-sm` versions and tells you what is still missing.\n',
 '**Keeping AI images from looking AI:** use the shared base prompt as-is, ask for imperfection (film grain, slightly uneven light), avoid glowing/over-saturated skies, keep the same camera language across all images, and discard any frame with warped windows, melted railings, odd reflections or extra fingers/people. Check every image at 100% zoom before using it. If the images are AI-generated, say so wherever your local advertising rules require it.\n',
 '## Base prompt (prepend to every prompt)\n', '> ' + BASE + '\n', '## Site images\n']
SITE = [
 ('interior-warm.webp', 'The hero zoom ends here: a warm, softly lit living room seen from outside through a large window at night, glowing lamps, linen sofa, teak and stone, 16:9'),
 ('portrait.webp', 'Brand story image: detail of a villa terrace at golden hour, a lit lantern on a stone table, 4:5 portrait'),
 ('about.webp', 'Wide view of a villa courtyard garden at golden hour, 3:2'),
 ('exp-dining.webp', 'Private chef dinner table under string lights in a villa garden, 3:2'),
 ('exp-garden.webp', 'Morning garden walk path between flowering shrubs at a villa, 3:2'),
 ('exp-pool.webp', 'Empty infinity pool at sunrise, 3:2'),
 ('exp-spa.webp', 'Villa spa corner: massage bed, towels, candles, plants, 3:2'),
 ('exp-stars.webp', 'Villa terrace at night with a clear starry sky and a lit fire pit, 3:2'),
 ('fallback.webp', 'Neutral architectural detail: pale limestone wall with soft shadow, 3:2'),
]
for k in R.LOCATIONS:
    SITE.append(('loc-%s.webp' % k['id'], 'Landscape establishing shot of %s: %s. No buildings in focus, 3:2' % (k['name'], SETTING[k['id']])))
for f, d in SITE: out.append('- `%s`: %s\n' % (f, d))
out.append('\n## Villa images (5 per villa)\n')
for v in R.V:
    name, tag, loc, cat, style = v[0], v[1], v[2], v[3], v[4]
    slug = 'villa-' + name.lower()
    out.append('\n### Villa %s: %s (%s)\n' % (name, tag, cat))
    desc = 'a %d-bedroom luxury villa, %s' % (v[6], SETTING[loc]) + ('; ' + STYLE[style] if style in STYLE else '')
    for n, (label, p) in SLOTS.items():
        out.append('- `%s-%d.webp` (%s): %s. Villa: %s\n' % (slug, n, label, p, desc))
open(os.path.join(ROOT, 'PHOTO-PROMPTS.md'), 'w').write(''.join(out))
print('wrote PHOTO-PROMPTS.md')
