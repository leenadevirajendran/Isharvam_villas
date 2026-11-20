"""Temporary demo photographs: Pexels (free to use, no attribution required; credits are listed in assets/img/CREDITS.md).
Every ID was visually checked on a contact sheet. Replace with the client's own photography later (same file names).
Slot order per villa: 1 exterior (day), 2 pool/terrace, 3 bedroom, 4 dining (odd villas) or bathroom (even villas), 5 evening."""
V = {  # villa name: (exterior, pool/terrace, evening)
 'Aanya': (40807982, 20975727, 26859066), 'Meghdoot': (7746922, 17180776, 31299068), 'Ananta': (10647324, 12720677, 27626169),
 'Vanya': (31914733, 34939827, 29693417), 'Sarovar': (12737424, 9899872, 20548689), 'Kshitij': (12932834, 12715491, 13721095),
 'Gulmohar': (38535901, 14024959, 19075385), 'Anand': (16573669, 8134745, 19075398), 'Neelam': (13203179, 12715456, 28054849),
 'Himani': (32361209, 10481173, 31299069), 'Prakash': (33976199, 27626185, 28054849), 'Tarini': (7746550, 39045418, 31299067),
 'Suvarna': (34378030, 28054850, 13721095), 'Kalpana': (13041124, 19075385, 29693417), 'Ishani': (7031600, 19879680, 19075398),
 'Jalsa': (12737424, 20975727, 26859066), 'Devdar': (16396624, 31914733, 31299068), 'Rasa': (14024959, 34939827, 19075385),
}
BED = [34754003, 6480198, 6580373, 6588571, 6956842, 6934170, 7368344, 29702285, 12652920, 28054888, 27626174, 13283215, 6752164, 6782568, 8135502, 39733066, 19980198, 10061386]
DINE = [18823963, 5676261, 17035090, 18514405, 25390119, 18823960, 18823964, 19648312]
BATH = [7045908, 8142047, 6587852, 6492399, 31525748, 8141966, 6957081, 13722861, 27629444]
SITE = {'scene-day': 13203179, 'scene-golden': 19075385, 'scene-dusk': 28054849, 'scene-night': 26859066, 'interior-warm': 17735412, 'portrait': 29693417, 'about': 34939827, 'exp-dining': 18823963, 'exp-garden': 38535901, 'exp-pool': 20975727,
        'exp-spa': 31525748, 'exp-stars': 20548689, 'loc-aranya-ridge': 31914733, 'loc-sagar-cove': 12720677, 'loc-kamala-valley': 14024959,
        'loc-tarang-lakeside': 37784809, 'loc-meru-heights': 16396624}
def url(i, w=2000): return 'https://images.pexels.com/photos/%d/pexels-photo-%d.jpeg?auto=compress&cs=tinysrgb&w=%d' % (i, i, w)
def all_slots():
    out = {}
    for n, (name, (e, t, ev)) in enumerate(V.items()):
        s = 'villa-' + name.lower(); dining = (n + 1) % 2 == 1
        out[s + '-1'] = e; out[s + '-2'] = t; out[s + '-3'] = BED[n]
        out[s + '-4'] = DINE[n // 2 % len(DINE)] if dining else BATH[n // 2 % len(BATH)]; out[s + '-5'] = ev
    out.update(SITE); return out
