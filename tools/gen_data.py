#!/usr/bin/env python3
"""Writes assets/js/mock-data.js from tools/roster.py. ALL DATA IS FICTIONAL SAMPLE DATA - replace with client data."""
import json, os, random, sys
sys.path.insert(0, os.path.dirname(__file__))
from roster import VILLAS, LOCATIONS, CATEGORIES, LOCMAP
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

AMEN = [
 ('private-pool','Private pool','waves','Water'),('infinity-pool','Infinity pool','waves','Water'),('hot-tub','Hot tub','bath','Water'),
 ('wifi','High-speed Wi-Fi','wifi','Essentials'),('ac','Air conditioning','air-vent','Essentials'),('housekeeping','Daily housekeeping','concierge-bell','Essentials'),
 ('parking','Private parking','car','Essentials'),('security','24-hour caretaker','shield-check','Essentials'),
 ('chef','Chef on request','chef-hat','Dining'),('kitchen','Fully equipped kitchen','cooking-pot','Dining'),('outdoor-dining','Outdoor dining','utensils','Dining'),('bbq','Barbecue area','flame','Dining'),('coffee','Coffee station','coffee','Dining'),('wine','Wine cellar nook','wine','Dining'),
 ('fireplace','Fireplace','flame','Comfort'),('theatre','Home theatre','tv','Comfort'),('games','Games lounge','armchair','Comfort'),('gym','Home gym','dumbbell','Comfort'),
 ('garden','Landscaped garden','flower-2','Outdoors'),('bonfire','Bonfire pit','flame','Outdoors'),('bike','Bicycles','bike','Outdoors'),
 ('mountain-view','Mountain views','mountain','Views'),('sea-view','Sea views','tree-palm','Views'),('lake-view','Lake views','waves','Views'),('valley-view','Valley views','trees','Views'),
 ('kids','Child-friendly setup','baby','Family'),('pets','Pets by arrangement','paw-print','Family'),
]
CORE = ['wifi', 'ac', 'housekeeping', 'parking', 'security', 'kitchen', 'chef']
BY_CAT = {
 'Private Pool': ['private-pool', 'outdoor-dining', 'bbq', 'garden'], 'Contemporary Luxury': ['infinity-pool', 'theatre', 'gym', 'wine', 'outdoor-dining'],
 'Nature View': ['garden', 'bonfire', 'bike', 'coffee'], 'Mountain Retreat': ['fireplace', 'bonfire', 'coffee', 'games'],
 'Family Holiday': ['private-pool', 'kids', 'games', 'garden', 'pets'], 'Premium Garden': ['garden', 'outdoor-dining', 'bbq', 'coffee', 'pets'],
 'Modern Architectural': ['infinity-pool', 'theatre', 'gym', 'wine', 'coffee'],
}
VIEW = {'valley': 'valley-view', 'coast': 'sea-view', 'garden': 'valley-view', 'lake': 'lake-view', 'mountain': 'mountain-view'}
CAT_PARA = {
 'Private Pool': 'The house is organised around a private pool, with living spaces that open straight onto the deck so mornings begin barefoot and end in the water.',
 'Contemporary Luxury': 'Clean lines, double-height glazing and a considered palette of stone, timber and brass give the house a calm, gallery-like presence.',
 'Nature View': 'Built low and close to the landscape, the villa trades spectacle for stillness: timber, stone and wide windows that let the surroundings do the talking.',
 'Mountain Retreat': 'A solid, warm chalet-style retreat designed for cool evenings, with generous fireside seating and rooms that frame the high ridgelines.',
 'Family Holiday': 'Planned for groups across generations, with a generous shared living floor, easy flow to the garden and bedrooms spread over two levels.',
 'Premium Garden': 'Courtyards, pergolas and layered planting make the garden an extra living room, shaded by day and softly lit after sunset.',
 'Modern Architectural': 'A confident composition of stacked volumes and long cantilevers, with sharp shadow lines, exposed finishes and rooms framed like pictures.',
}
SET_PARA = {
 'valley': 'Set among forested slopes, the days here are cool and slow, with birdsong and wood smoke in the air.',
 'coast': 'A short walk from the water, the villa catches sea breeze through the day and a long, amber sunset in the evening.',
 'garden': 'Surrounded by open green land, the house sits in soft valley light with plenty of room to wander.',
 'lake': 'Facing still water, the house is at its best at dawn when mist lifts off the lake and the deck turns gold.',
 'mountain': 'High on the ridge, the air is thin and clear, and the evenings end with a sky full of stars.',
}
HIGH = {
 'Private Pool': ['Private pool with sun deck', 'Open-plan living onto the water', 'Poolside outdoor dining', 'Evening pool lighting'],
 'Contemporary Luxury': ['Double-height living space', 'Infinity-edge pool', 'Home theatre room', 'Curated stone and timber finishes'],
 'Nature View': ['Cantilevered timber deck', 'Floor-to-ceiling garden views', 'Bonfire pit under open sky', 'Quiet, low-light evenings'],
 'Mountain Retreat': ['Stone fireplace lounge', 'Ridgeline views from every bedroom', 'Wood-fired evenings', 'Heated bathrooms'],
 'Family Holiday': ['Spacious shared living and dining', 'Children-friendly garden and pool', 'Bedrooms across two levels', 'Games lounge for all ages'],
 'Premium Garden': ['Shaded courtyard dining', 'Pergola with climbing blooms', 'Landscaped walking paths', 'Garden lighting after dark'],
 'Modern Architectural': ['Cantilevered volumes and deep overhangs', 'Gallery-style glazing', 'Private infinity pool', 'Evening facade lighting'],
}
ALTS = ['Exterior of {n} in daylight', 'Pool and terrace at {n}', 'Master bedroom at {n}', 'Bathroom at {n}', 'Evening view of {n}']
ALTS_DIN = 'Outdoor dining at {n} after sunset'

def amenities_for(v, rng):
    a = list(CORE) + BY_CAT[v['category']] + [VIEW[LOCMAP[v['loc']]['setting']]]
    if v['category'] != 'Private Pool' and v['style'] in ('pool', 'contemporary', 'family', 'architectural') and 'private-pool' not in a and 'infinity-pool' not in a: a.append('private-pool')
    extras = rng.sample([x[0] for x in AMEN if x[0] not in a and x[0] not in ('private-pool', 'infinity-pool')], 2); a += extras
    return list(dict.fromkeys(a))

def booked(rng):
    out = []; cur = rng.randint(3, 12)
    while cur < 170:
        n = rng.choice([2, 2, 3, 3, 4, 5]); out.append([cur, n]); cur += n + rng.randint(4, 17)
    return out

def build():
    villas = []
    for v in VILLAS:
        rng = random.Random(v['seed']); loc = LOCMAP[v['loc']]; i = int(v['id'][-2:])
        imgs = []
        for n in range(1, 6):
            alt = (ALTS_DIN if (n == 4 and i % 2) else ALTS[n-1]).format(n=v['name']); imgs.append(dict(src='%s-%d.webp' % (v['slug'], n), alt=alt))
        short = '%d-bedroom %s villa at %s, sleeping up to %d guests.' % (v['beds'], v['category'].lower(), loc['name'], v['guests'])
        desc = [CAT_PARA[v['category']], SET_PARA[loc['setting']] + ' %s offers %d bedrooms, %d bathrooms and comfortable space for up to %d guests.' % (v['name'], v['beds'], v['baths'], v['guests']),
                'The villa is yours alone for the length of your stay, with a dedicated caretaker on call and our team a message away on WhatsApp.']
        villas.append(dict(id=v['id'], slug=v['slug'], name=v['name'], tagline=v['tagline'], locationId=v['loc'], category=v['category'], shortDescription=short, description=desc,
            bedrooms=v['beds'], bathrooms=v['baths'], maxGuests=v['guests'], amenities=amenities_for(v, rng), highlights=HIGH[v['category']], pricePerNight=v['price'],
            featured=v['featured'], images=imgs, bookedRanges=booked(rng), isSample=True))
    exps = [
     dict(id='chef', title='Private chef evenings', text='A table set under the open sky and a menu built around what is in season. Menus and pricing are arranged with our team.', image='exp-dining.webp', icon='chef-hat'),
     dict(id='pool', title='Slow poolside mornings', text='Breakfast by the water, loungers in the shade and nothing on the schedule.', image='exp-pool.webp', icon='waves'),
     dict(id='spa', title='Wellness at home', text='Massage, yoga or a long soak: the house becomes a retreat. Availability varies by villa.', image='exp-spa.webp', icon='flower-2'),
     dict(id='garden', title='Garden & trail walks', text='Guided walks through the grounds and nearby paths, timed for the best light.', image='exp-garden.webp', icon='trees'),
     dict(id='stars', title='Fireside stargazing', text='Bonfire, blankets and a sky with no competition. Available at our hill and mountain villas.', image='exp-stars.webp', icon='sparkles'),
    ]
    tests = []
    faqs = [
     dict(group='Booking', q='How do I book a villa?', a='Choose your villa, dates and guests, then send a booking request. Our team continues the conversation with you on WhatsApp to confirm the stay and arrange payment.'),
     dict(group='Booking', q='Is my stay confirmed as soon as I send the request?', a='No. A request is confirmed only after our team replies on WhatsApp. Dates are held for a short time while payment is arranged.'),
     dict(group='Payment', q='Can I pay on the website?', a='Payment is not taken on the website. After you send the request, payment is arranged with our team on WhatsApp.'),
     dict(group='Payment', q='What payment methods are accepted?', a='No payment is taken on the website. After our team confirms your dates on WhatsApp, payment is arranged with you directly, for example by UPI or bank transfer.'),
     dict(group='Stay', q='What are the check-in and check-out times?', a='Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in or late check-out can be arranged on request.'),
     dict(group='Stay', q='How many guests can a villa accommodate?', a='Each villa lists its maximum guest capacity. Please ask our team if you would like to bring extra guests.'),
     dict(group='Stay', q='Are pets allowed?', a='Pets are welcome by arrangement at selected villas. Please tell us before you book.'),
     dict(group='Policies', q='What is the cancellation policy?', a='See the Cancellation Policy page. The wording there is a template and must be replaced with the business\'s approved policy.'),
     dict(group='Contact', q='When can I reach the team?', a='Our working hours are 10:00 AM to 7:00 PM. Messages sent outside these hours are answered the next working day.'),
    ]
    names = ['Aarav M.', 'Diya K.', 'Rohan S.', 'Meera P.', 'Kabir N.', 'Anika R.', 'Vihaan T.', 'Ishita D.']
    bookings = []; st = ['Requested', 'Confirmed', 'Paid', 'Paid', 'Cancelled', 'Requested', 'Confirmed', 'Paid']
    for k in range(8):
        v = villas[(k*3) % len(villas)]; nights = 2 + k % 4; off = [-40, -12, 6, 18, 25, 33, 47, 60][k]
        total = int(v['pricePerNight']*nights*1.12 + 2500)
        bookings.append(dict(ref='ISH-2611-%d' % (1001+k), villaId=v['id'], guest=names[k], phone='+91 00000 0%04d' % (1000+k), email='guest%d@example.com' % (k+1),
            checkInOffset=off, nights=nights, guests=min(v['maxGuests'], 2+k), status=st[k], total=total, created=-(60-k*6)))
    d = dict(meta=dict(isSample=True, note='All content in this file is fictional demonstration data.'), locations=[dict(l, image='loc-%s.webp' % l['id']) for l in LOCATIONS],
             categories=CATEGORIES, amenities=[dict(id=a, label=l, icon=ic, group=g) for a, l, ic, g in AMEN], villas=villas, experiences=exps, testimonials=tests, faqs=faqs, sampleBookings=bookings)
    return d

if __name__ == '__main__':
    data = build()
    js = '/* ISHARVAM VILLAS - SAMPLE DATA. Fictional demonstration properties, prices and content. Replace with client data.\n   Generated by tools/gen_data.py from tools/roster.py (edit either, or edit this file directly). */\nwindow.ISH_DATA = ' + json.dumps(data, indent=1, ensure_ascii=False) + ';\n'
    open(os.path.join(ROOT, 'assets/js/mock-data.js'), 'w').write(js); print('villas', len(data['villas']), 'bytes', len(js))
