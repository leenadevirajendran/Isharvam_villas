"""Single source of truth for the SAMPLE villa roster.
Used by gen_data.py (writes assets/js/mock-data.js) and gen_images.py (draws placeholder art that matches each villa).
ALL VALUES ARE FICTIONAL DEMONSTRATION DATA."""
LOCATIONS = [
 dict(id='aranya-ridge', name='Aranya Ridge', region='Forest hills', setting='valley', blurb='Pine-lined ridges, cool mornings and quiet trails.'),
 dict(id='sagar-cove', name='Sagar Cove', region='Coast', setting='coast', blurb='A sheltered bay with long sunsets and sea breeze.'),
 dict(id='kamala-valley', name='Kamala Valley', region='Countryside', setting='garden', blurb='Orchards, courtyards and open green valley light.'),
 dict(id='tarang-lakeside', name='Tarang Lakeside', region='Lakeside', setting='lake', blurb='Still water, mist at dawn and decks over the shore.'),
 dict(id='meru-heights', name='Meru Heights', region='High mountains', setting='mountain', blurb='Snowline views, wood-fire evenings and thin, clear air.'),
]
CATEGORIES = ['Contemporary Luxury','Private Pool','Nature View','Mountain Retreat','Family Holiday','Premium Garden','Modern Architectural']
# id, name, tagline, location id, category, draw style, price, beds, baths, guests, featured, wall palette
V = [
 ('Aanya','Light, stone and a long blue pool','sagar-cove','Private Pool','pool',38500,4,4,8,True,'sand'),
 ('Meghdoot','Above the clouds, below the stars','meru-heights','Mountain Retreat','mountain',52000,5,5,10,True,'stone'),
 ('Ananta','An infinity edge at the end of the garden','sagar-cove','Contemporary Luxury','contemporary',74000,5,5,10,True,'ivory'),
 ('Vanya','Forest light, folded into timber','aranya-ridge','Nature View','nature',24500,3,3,6,False,'timber'),
 ('Sarovar','A deck that hovers over the lake','tarang-lakeside','Nature View','nature',31000,4,4,8,True,'timber'),
 ('Kshitij','The horizon, framed in concrete and glass','meru-heights','Modern Architectural','architectural',61000,4,4,8,False,'concrete'),
 ('Gulmohar','Courtyards, pergolas and a red-petalled lawn','kamala-valley','Premium Garden','garden',29000,4,4,8,False,'terracotta'),
 ('Anand','Room for every generation','kamala-valley','Family Holiday','family',42000,6,6,12,False,'sand'),
 ('Neelam','Sea-blue pool, sunset terrace','sagar-cove','Private Pool','pool',27500,3,3,6,False,'ivory'),
 ('Himani','A chalet with a fireplace and snowline views','meru-heights','Mountain Retreat','mountain',36000,4,3,8,False,'timber'),
 ('Prakash','Glass pavilions that glow after dark','tarang-lakeside','Contemporary Luxury','contemporary',58000,4,5,8,False,'stone'),
 ('Tarini','A quiet house between the pines','aranya-ridge','Mountain Retreat','mountain',22000,3,3,6,False,'stone'),
 ('Suvarna','Golden-hour terraces above the bay','sagar-cove','Premium Garden','garden',33500,4,4,8,False,'sand'),
 ('Kalpana','Cubes of light on a green hill','aranya-ridge','Modern Architectural','architectural',66000,5,5,10,False,'ivory'),
 ('Ishani','Poolside mornings for the whole family','kamala-valley','Family Holiday','family',39500,5,5,10,False,'terracotta'),
 ('Jalsa','Barefoot luxury at the water\'s edge','tarang-lakeside','Private Pool','pool',26500,3,3,6,False,'timber'),
 ('Devdar','Cedar, stone and wide valley views','aranya-ridge','Nature View','nature',28500,4,4,8,False,'stone'),
 ('Rasa','A courtyard built around a mango tree','kamala-valley','Premium Garden','garden',23500,3,3,6,False,'terracotta'),
]
VILLAS=[]
for i,(n,tag,loc,cat,style,price,bd,ba,g,feat,wall) in enumerate(V,1):
    VILLAS.append(dict(id='ISH-V%02d'%i, slug='villa-'+n.lower(), name='Villa '+n, tagline=tag, loc=loc, category=cat, style=style,
        price=price, beds=bd, baths=ba, guests=g, featured=feat, wall=wall, seed=i*7919))
LOCMAP={l['id']:l for l in LOCATIONS}
