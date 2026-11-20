# Photo prompt pack (Isharvam Villas)
The site currently uses generated illustrations as stand-ins. Replace them with real photographs (or photoreal AI images) using the prompts below.
**How:** make each image, save it under the exact file name shown (JPG, PNG or WebP, at least 2000 px wide, 3:2 landscape), put them all in a folder named `incoming-photos/` at the project root, then run `python3 tools/import_photos.py`. It converts them to WebP, creates the small `-sm` versions and tells you what is still missing.
**Keeping AI images from looking AI:** use the shared base prompt as-is, ask for imperfection (film grain, slightly uneven light), avoid glowing/over-saturated skies, keep the same camera language across all images, and discard any frame with warped windows, melted railings, odd reflections or extra fingers/people. Check every image at 100% zoom before using it. If the images are AI-generated, say so wherever your local advertising rules require it.
## Base prompt (prepend to every prompt)
> Real architectural photography for a luxury hospitality brochure, shot on a full-frame camera, 24mm tilt-shift lens, natural light, true-to-life colour, subtle film grain, slightly imperfect and lived-in, no people, no text, no watermark, not over-saturated, not CGI, not a 3D render, no fantasy lighting, believable materials (limestone, teak, linen, concrete), shot in India
## Site images
- `interior-warm.webp`: The hero zoom ends here: a warm, softly lit living room seen from outside through a large window at night, glowing lamps, linen sofa, teak and stone, 16:9
- `portrait.webp`: Brand story image: detail of a villa terrace at golden hour, a lit lantern on a stone table, 4:5 portrait
- `about.webp`: Wide view of a villa courtyard garden at golden hour, 3:2
- `exp-dining.webp`: Private chef dinner table under string lights in a villa garden, 3:2
- `exp-garden.webp`: Morning garden walk path between flowering shrubs at a villa, 3:2
- `exp-pool.webp`: Empty infinity pool at sunrise, 3:2
- `exp-spa.webp`: Villa spa corner: massage bed, towels, candles, plants, 3:2
- `exp-stars.webp`: Villa terrace at night with a clear starry sky and a lit fire pit, 3:2
- `fallback.webp`: Neutral architectural detail: pale limestone wall with soft shadow, 3:2
- `loc-aranya-ridge.webp`: Landscape establishing shot of Aranya Ridge: set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light. No buildings in focus, 3:2
- `loc-sagar-cove.webp`: Landscape establishing shot of Sagar Cove: a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light. No buildings in focus, 3:2
- `loc-kamala-valley.webp`: Landscape establishing shot of Kamala Valley: in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky. No buildings in focus, 3:2
- `loc-tarang-lakeside.webp`: Landscape establishing shot of Tarang Lakeside: on the shore of a calm lake, timber deck over the water, soft haze on the far bank. No buildings in focus, 3:2
- `loc-meru-heights.webp`: Landscape establishing shot of Meru Heights: high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light. No buildings in focus, 3:2

## Villa images (5 per villa)

### Villa Aanya: Light, stone and a long blue pool (Private Pool)
- `villa-aanya-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck
- `villa-aanya-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck
- `villa-aanya-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck
- `villa-aanya-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck
- `villa-aanya-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck

### Villa Meghdoot: Above the clouds, below the stars (Mountain Retreat)
- `villa-meghdoot-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 5-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing
- `villa-meghdoot-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 5-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing
- `villa-meghdoot-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 5-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing
- `villa-meghdoot-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 5-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing
- `villa-meghdoot-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 5-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing

### Villa Ananta: An infinity edge at the end of the garden (Contemporary Luxury)
- `villa-ananta-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 5-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light
- `villa-ananta-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 5-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light
- `villa-ananta-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 5-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light
- `villa-ananta-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 5-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light
- `villa-ananta-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 5-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light

### Villa Vanya: Forest light, folded into timber (Nature View)
- `villa-vanya-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-vanya-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-vanya-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-vanya-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-vanya-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light

### Villa Sarovar: A deck that hovers over the lake (Nature View)
- `villa-sarovar-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank
- `villa-sarovar-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank
- `villa-sarovar-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank
- `villa-sarovar-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank
- `villa-sarovar-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank

### Villa Kshitij: The horizon, framed in concrete and glass (Modern Architectural)
- `villa-kshitij-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light
- `villa-kshitij-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light
- `villa-kshitij-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light
- `villa-kshitij-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light
- `villa-kshitij-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light

### Villa Gulmohar: Courtyards, pergolas and a red-petalled lawn (Premium Garden)
- `villa-gulmohar-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 4-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-gulmohar-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 4-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-gulmohar-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 4-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-gulmohar-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 4-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-gulmohar-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 4-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky

### Villa Anand: Room for every generation (Family Holiday)
- `villa-anand-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 6-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-anand-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 6-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-anand-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 6-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-anand-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 6-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-anand-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 6-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky

### Villa Neelam: Sea-blue pool, sunset terrace (Private Pool)
- `villa-neelam-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 3-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck
- `villa-neelam-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 3-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck
- `villa-neelam-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 3-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck
- `villa-neelam-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 3-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck
- `villa-neelam-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 3-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light; long rectangular private swimming pool and sun deck

### Villa Himani: A chalet with a fireplace and snowline views (Mountain Retreat)
- `villa-himani-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing
- `villa-himani-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing
- `villa-himani-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing
- `villa-himani-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing
- `villa-himani-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 4-bedroom luxury villa, high in the Himalayan foothills, stone and timber, snow peaks in the distance, thin clear light; stone-and-timber mountain lodge with large glazing

### Villa Prakash: Glass pavilions that glow after dark (Contemporary Luxury)
- `villa-prakash-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank
- `villa-prakash-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank
- `villa-prakash-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank
- `villa-prakash-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank
- `villa-prakash-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 4-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank

### Villa Tarini: A quiet house between the pines (Mountain Retreat)
- `villa-tarini-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light; stone-and-timber mountain lodge with large glazing
- `villa-tarini-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light; stone-and-timber mountain lodge with large glazing
- `villa-tarini-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light; stone-and-timber mountain lodge with large glazing
- `villa-tarini-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light; stone-and-timber mountain lodge with large glazing
- `villa-tarini-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 3-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light; stone-and-timber mountain lodge with large glazing

### Villa Suvarna: Golden-hour terraces above the bay (Premium Garden)
- `villa-suvarna-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light
- `villa-suvarna-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light
- `villa-suvarna-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light
- `villa-suvarna-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light
- `villa-suvarna-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 4-bedroom luxury villa, a few minutes from a sheltered tropical bay, coconut palms and laterite stone, warm coastal light

### Villa Kalpana: Cubes of light on a green hill (Modern Architectural)
- `villa-kalpana-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 5-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-kalpana-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 5-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-kalpana-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 5-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-kalpana-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 5-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-kalpana-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 5-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light

### Villa Ishani: Poolside mornings for the whole family (Family Holiday)
- `villa-ishani-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 5-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-ishani-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 5-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-ishani-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 5-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-ishani-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 5-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-ishani-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 5-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky

### Villa Jalsa: Barefoot luxury at the water's edge (Private Pool)
- `villa-jalsa-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 3-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank; long rectangular private swimming pool and sun deck
- `villa-jalsa-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 3-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank; long rectangular private swimming pool and sun deck
- `villa-jalsa-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 3-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank; long rectangular private swimming pool and sun deck
- `villa-jalsa-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 3-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank; long rectangular private swimming pool and sun deck
- `villa-jalsa-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 3-bedroom luxury villa, on the shore of a calm lake, timber deck over the water, soft haze on the far bank; long rectangular private swimming pool and sun deck

### Villa Devdar: Cedar, stone and wide valley views (Nature View)
- `villa-devdar-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 4-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-devdar-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 4-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-devdar-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 4-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-devdar-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 4-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light
- `villa-devdar-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 4-bedroom luxury villa, set among tall pines and cedar on a forested ridge in the Indian hills, soft mist, cool morning light

### Villa Rasa: A courtyard built around a mango tree (Premium Garden)
- `villa-rasa-1.webp` (Exterior, daylight): front exterior of the villa in clear daylight, three-quarter view, 3:2 landscape. Villa: a 3-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-rasa-2.webp` (Pool or terrace): the pool deck or main terrace with loungers, mid-morning, 3:2 landscape. Villa: a 3-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-rasa-3.webp` (Master bedroom): master bedroom interior, crisp white linen, wood and stone, window view of the landscape, 3:2 landscape. Villa: a 3-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-rasa-4.webp` (Outdoor dining at dusk): outdoor dining area at blue hour, warm lamps lit, set table, 3:2 landscape. Villa: a 3-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
- `villa-rasa-5.webp` (Evening exterior): the villa at dusk with every window glowing warm gold, reflected in the pool or garden, 3:2 landscape. Villa: a 3-bedroom luxury villa, in a green countryside valley with mango and orchard trees, terracotta courtyard, open sky
