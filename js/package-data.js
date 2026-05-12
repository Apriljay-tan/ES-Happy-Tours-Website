/* Package details data.
   Package cards use these records for the details modal. */

const IMG = {
  city: 'assets/images/16.jpg',
  sirao: 'assets/images/4.jpg',
  tops: 'assets/images/15.jpg',
  magellan: 'assets/images/3.jpg',
  moalboal: 'assets/images/17.jpg',
  oslob: 'assets/images/2.jpg',
  sumilon: 'assets/images/1.jpg',
  tumalog: 'assets/images/1.jpg',
  bohol: 'assets/images/IMG_0251.JPG',
  tarsier: 'assets/images/8.jpg',
  baclayon: 'assets/images/baclayon.jpg',
  baclayonAlt: 'assets/images/baclayon2.webp',
  kawasan: 'assets/images/kawasan.jpg'
};

const cityActivity = dropAt => ({
  title: 'City Tour',
  items: [
    'Pick up at hotel or airport',
    'Tour starts at 7:00 AM',
    'Temple of Leah',
    'Sirao Garden',
    'Tops',
    'Taoist Temple',
    'Cebu Heritage Monument',
    "Magellan's Cross",
    'Sto. Nino Church',
    'Pasalubong Center',
    'CCLEX',
    '10K Roses',
    'End of tour at 6:00 PM',
    `Drop-off at ${dropAt}`
  ],
  optional: ['La Lie Parisienne - ₱100 per pax', 'Ancestral House - ₱100 per pax', 'Lechon']
});

const moalboalActivity = dropAt => ({
  title: 'Moalboal Tour',
  items: [
    'Pick up at airport or hotel',
    'Tour starts at 4:00 AM',
    'Coral watching',
    'Snorkeling',
    'Dolphin watching - seasonal',
    'Sea turtle encounter',
    'Sardines run',
    'Kawasan Falls',
    'End of tour at 6:00 PM',
    `Drop-off at ${dropAt}`
  ],
  optional: ['Canyoneering - ₱1,800 per pax with food. Highly recommended for a Cebu adventure experience.']
});

const oslobActivity = dropAt => ({
  title: 'Oslob Tour',
  items: [
    'Pick up at hotel or airport',
    'Tour starts at 2:30 AM',
    'Tumalog Falls',
    'Sumilon Island',
    'Oslob Cuartel Heritage',
    'Oslob Church',
    'Simala Church',
    'Carcar Pasalubong',
    'Souvenir stop',
    'End of tour at 7:00 PM',
    `Drop-off at ${dropAt}`
  ],
  optional: ['Whale shark - ₱500 per pax local guest / ₱1,000 per pax foreign guest', 'Lechon']
});

const boholActivity = dropAt => ({
  title: 'Bohol Countryside Tour',
  items: [
    'Pick up from hotel or airport',
    'Tour starts at 4:00 AM',
    'Chocolate Hills',
    'Man-made Forest',
    'Python',
    'Tarsier Conservation',
    'Butterfly',
    'Baclayon Church',
    'Souvenir Shop',
    'Blood Compact',
    'End of tour at 7:00 PM',
    `Drop-off at ${dropAt}`
  ],
  optional: ['ATV ride - ₱1,200 to ₱1,400', 'Loboc Cruiser - ₱1,200']
});

const standardExclusions = ['Optional activities', 'Food', 'Airfare'];
const oneDayInclusions = ['Transportation', 'Guiding fee', 'Entrance fees'];
const boholInclusions = ['Transport', 'Guide fee', 'Entrance fees', 'Ferry fare'];
const privateExclusions = ['Optional activities', 'Food', 'Airfare', 'Personal expenses'];

const joinerPackage = ({ title, image, duration, pricePerPax, activities, inclusions, notes }) => ({
  title,
  category: 'Joiner Package',
  image,
  duration,
  pricePerPax,
  minimumPax: 2,
  activities,
  optionalActivities: activities.flatMap(activity => activity.optional || []),
  itinerary: activities.flatMap((activity, index) => [
    `Activity ${index + 1}: ${activity.title}`,
    ...activity.items
  ]),
  inclusions,
  exclusions: standardExclusions,
  notes
});

const privatePackage = ({ title, image, duration, prices, activities, optionalActivities, inclusions, exclusions, notes }) => ({
  title,
  category: 'Private Tour',
  image,
  duration,
  prices: prices.map(([pax, pricePerPax]) => ({ pax, pricePerPax })),
  activities,
  optionalActivities,
  itinerary: activities.flatMap((activity, index) => [
    `Activity ${index + 1}: ${activity.title}`,
    ...activity.items
  ]),
  inclusions,
  exclusions: exclusions || privateExclusions,
  notes
});

const privateCity = title => ({
  title,
  items: [
    'Pick up at hotel or airport based on arranged schedule',
    'Temple of Leah',
    'Sirao Garden',
    'Taoist Temple',
    'Cebu Heritage Monument',
    "Magellan's Cross",
    'Sto. Nino Church',
    'Pasalubong Center',
    'CCLEX',
    '10K Roses',
    'Drop-off at preferred Cebu City area'
  ]
});

const privateCityDay = () => ({
  title: 'Day 1 - Private Cebu City Tour',
  items: [
    'Pickup: Hotel or airport from 7:00 AM onwards',
    'Temple of Leah',
    'Sirao Garden',
    'Taoist Temple',
    'Cebu Heritage Monument',
    "Magellan's Cross",
    'Sto. Nino Church',
    'Pasalubong Center',
    'CCLEX',
    '10K Roses',
    'End of tour from 5:00 PM onwards - drop-off at hotel'
  ]
});

const privateMoalboal = title => ({
  title,
  items: [
    'Private early morning pick-up',
    'Coral watching',
    'Snorkeling',
    'Dolphin watching - seasonal',
    'Sea turtle encounter',
    'Sardines run',
    'Optional Kawasan Falls or Canyoneering add-on',
    'Private drop-off after activity'
  ]
});

const privateOslob = title => ({
  title,
  items: [
    'Private early morning pick-up',
    'Whale shark activity assistance',
    'Tumalog Falls if available',
    'Sumilon Island',
    'Oslob Cuartel Heritage',
    'Oslob Church',
    'Simala Church depending on route and timing',
    'Carcar Pasalubong',
    'Souvenir stop',
    'Private drop-off after tour'
  ]
});

const privateBohol = title => ({
  title,
  items: [
    'Ferry assistance / arrival coordination',
    'Chocolate Hills',
    'Man-made Forest',
    'Python',
    'Tarsier Conservation',
    'Butterfly',
    'Baclayon Church',
    'Souvenir Shop',
    'Blood Compact',
    'Private countryside tour setup',
    'Ferry return assistance'
  ]
});

const PACKAGE_DATA = {
  'cebu-city-private': privatePackage({
    title: '1D Cebu City Private Tour',
    image: IMG.city,
    duration: '1 Day',
    prices: [[1, 5400], [2, 3000], [3, 2233], [4, 2000], [5, 1650], [6, 1483], [7, 1378], [8, 1325], [9, 1233], [10, 1158], [11, 1117], [12, 1054]],
    activities: [privateCity('Private Cebu City Tour')],
    optionalActivities: ['La Vie Parisienne', 'Ancestral House', 'Lechon stopover'],
    inclusions: ['Private transportation', 'Driver assistance', 'Guide assistance', 'Selected entrance fees'],
    exclusions: ['Optional activities', 'Food', 'Airfare']
  }),
  'moalboal-private': privatePackage({
    title: '1D Moalboal Private Tour',
    image: IMG.moalboal,
    duration: '1 Day',
    prices: [[1, 6450], [2, 4430], [3, 3346], [4, 2930], [5, 2580], [6, 2346], [7, 2251], [8, 2117], [9, 2013], [10, 1930], [11, 1861], [12, 1805]],
    activities: [privateMoalboal('Private Moalboal Tour')],
    optionalActivities: ['Kawasan Falls', 'Canyoneering', 'Snorkeling gear upgrade if applicable'],
    inclusions: ['Private transportation', 'Driver assistance', 'Local coordination', 'Tour assistance']
  }),
  'oslob-private': privatePackage({
    title: '1D Oslob Private Tour',
    image: IMG.sumilon,
    duration: '1 Day',
    prices: [[1, 7480], [2, 4230], [3, 3146], [4, 2855], [5, 2480], [6, 2230], [7, 2194], [8, 2042], [9, 1924], [10, 1830], [11, 1830], [12, 1688]],
    activities: [privateOslob('Private Oslob Tour')],
    optionalActivities: ['Sumilon Island', 'Additional side trips', 'GoPro rental if applicable'],
    inclusions: ['Private transportation', 'Driver assistance', 'Guide assistance', 'Local coordination'],
    notes: ['Private Oslob package is best for groups who prefer direct coordination and privacy.']
  }),
  'bohol-private': privatePackage({
    title: '1D Bohol Countryside Private Tour',
    image: IMG.bohol,
    duration: '1 Day',
    prices: [[1, 6570], [2, 4120], [3, 3303], [4, 2895], [5, 2650], [6, 2620], [7, 2484], [8, 2382], [9, 2302], [10, 2240], [11, 2188], [12, 2145]],
    activities: [privateBohol('Private Bohol Countryside Tour')],
    optionalActivities: ['Loboc River Cruise', 'ATV', 'Other Bohol side activities'],
    inclusions: ['Private transportation in Bohol', 'Ferry assistance', 'Countryside tour', 'Guide assistance']
  }),
  'city-moalboal-private': privatePackage({
    title: '2D1N City + Moalboal Private Tour',
    image: IMG.sirao,
    duration: '2 Days 1 Night',
    prices: [[1, 13450], [2, 7450], [3, 5600], [4, 4975], [5, 4400], [6, 4016], [7, 3885], [8, 3662], [9, 3488], [10, 3400], [11, 1450], [12, 2208]],
    activities: [privateCityDay(), privateMoalboal('Day 2 - Private Moalboal Tour')],
    optionalActivities: ['Kawasan Falls', 'Canyoneering', 'Private group side activities'],
    inclusions: ['Private transportation', 'Driver assistance', 'Hotel coordination', 'Tour coordination'],
    notes: ['Private Cebu City + Moalboal tour for your own group, with smoother pacing and private transportation.']
  }),
  'city-oslob-private': privatePackage({
    title: '2D1N City + Oslob Private Tour',
    image: IMG.tumalog,
    duration: '2 Days 1 Night',
    prices: [[1, 13800], [2, 7550], [3, 5616], [4, 5000], [5, 4390], [6, 2813], [7, 3885], [8, 2780], [9, 3561], [10, 2230], [11, 2143], [12, 2030]],
    activities: [privateCityDay(), privateOslob('Day 2 - Private Oslob Tour')],
    optionalActivities: ['Whale shark fee', 'Sumilon Island', 'Lechon stopover'],
    inclusions: ['Private transportation', 'Driver assistance', 'Hotel coordination', 'Tour coordination'],
    notes: ['Private Cebu City + Oslob tour for guests who want private transport, flexible pacing, and direct coordination.']
  }),
  'city-bohol-private': privatePackage({
    title: '2D1N City + Bohol Private Tour',
    image: IMG.magellan,
    duration: '2 Days 1 Night',
    prices: [[1, 11900], [2, 6900], [3, 5383], [4, 4850], [5, 4390], [6, 4083], [7, 3978], [8, 3800], [9, 3661], [10, 3550], [11, 3504], [12, 3425]],
    activities: [privateCityDay(), privateBohol('Day 2 - Private Bohol Countryside Tour')],
    optionalActivities: ['ATV Ride', 'Loboc Cruise'],
    inclusions: ['Private transportation', 'Ferry assistance', 'Guiding assistance', 'Tour coordination'],
    notes: ['Private Cebu City + Bohol tour package with arranged transfers, ferry assistance, and countryside tour coordination.']
  }),
  'moalboal-oslob-private': privatePackage({
    title: '2D1N Moalboal + Oslob Private Tour',
    image: IMG.kawasan,
    duration: '2 Days 1 Night',
    prices: [[1, 12350], [2, 7100], [3, 5500], [4, 4875], [5, 4400], [6, 4083], [7, 3978], [8, 3971], [9, 3644], [10, 3550], [11, 3454], [12, 3375]],
    activities: [privateMoalboal('Day 1 - Private Moalboal Tour'), privateOslob('Day 2 - Private Oslob Tour')],
    optionalActivities: ['Canyoneering', 'Sumilon Island'],
    inclusions: ['Private transportation', 'Driver assistance', 'Hotel coordination', 'Tour coordination'],
    notes: ['Private Moalboal + Oslob tour for your own group with ocean adventures and private travel coordination.']
  }),
  'moalboal-bohol-private': privatePackage({
    title: '2D1N Moalboal + Bohol Private Tour',
    image: IMG.tarsier,
    duration: '2 Days 1 Night',
    prices: [[1, 12950], [2, 7700], [3, 6100], [4, 5525], [5, 5040], [6, 4716], [7, 4600], [8, 4412], [9, 4266], [10, 4200], [11, 4100], [12, 4016]],
    activities: [privateMoalboal('Day 1 - Private Moalboal Tour'), privateBohol('Day 2 - Private Bohol Countryside Tour')],
    optionalActivities: ['ATV Ride', 'Loboc Cruise'],
    inclusions: ['Private transportation', 'Ferry assistance', 'Guide assistance', 'Tour coordination'],
    notes: ['Private Moalboal + Bohol package with ocean activity, ferry assistance, and Bohol countryside tour.']
  }),
  'oslob-bohol-private': privatePackage({
    title: '2D1N Oslob + Bohol Private Tour',
    image: IMG.baclayon,
    duration: '2 Days 1 Night',
    prices: [[1, 13300], [2, 7800], [3, 6100], [4, 5550], [5, 5030], [6, 4683], [7, 4664], [8, 4450], [9, 4283], [10, 4200], [11, 4100], [12, 4016]],
    activities: [privateOslob('Day 1 - Private Oslob Tour'), privateBohol('Day 2 - Private Bohol Countryside Tour')],
    optionalActivities: ['Whale shark fee', 'ATV Ride', 'Loboc Cruise'],
    inclusions: ['Private transportation', 'Ferry assistance', 'Guiding assistance', 'Tour coordination'],
    notes: ['Private Oslob + Bohol tour for guests who want ocean adventure and Bohol countryside in one smooth package.']
  }),
  'city-moalboal-oslob-private': privatePackage({
    title: '3D2N City + Moalboal + Oslob Private Tour',
    image: IMG.tops,
    duration: '3 Days 2 Nights',
    prices: [[1, 17800], [2, 9800], [3, 7433], [4, 6600], [5, 5900], [6, 5433], [7, 5285], [8, 5012], [9, 4800], [10, 4700], [11, 4554], [12, 4433]],
    activities: [privateCityDay(), privateMoalboal('Day 2 - Private Moalboal Tour'), privateOslob('Day 3 - Private Oslob Tour')],
    optionalActivities: ['Canyoneering', 'Sumilon Island'],
    inclusions: ['Private transportation', 'Hotel accommodation coordination', 'Driver assistance', 'Tour coordination'],
    notes: ['Private 3D2N package is recommended for families, couples, and groups who want a complete Cebu experience.']
  }),
  'moalboal-oslob-bohol-private': privatePackage({
    title: '3D2N Moalboal + Oslob + Bohol Private Tour',
    image: IMG.oslob,
    duration: '3 Days 2 Nights',
    prices: [[1, 17300], [2, 10050], [3, 7933], [4, 7150], [5, 6540], [6, 6316], [7, 6100], [8, 6000], [9, 5577], [10, 5500], [11, 5372], [12, 5266]],
    activities: [privateMoalboal('Day 1 - Private Moalboal Tour'), privateOslob('Day 2 - Private Oslob Tour'), privateBohol('Day 3 - Private Bohol Countryside Tour')],
    optionalActivities: ['ATV Ride', 'Loboc Cruise', 'Canyoneering', 'Sumilon Island'],
    inclusions: ['Private transportation', 'Ferry assistance', 'Hotel accommodation coordination', 'Tour coordination'],
    notes: ['Private 3D2N tour covering Moalboal, Oslob, and Bohol with ocean activities and countryside tour.']
  }),
  'cebu-bohol-private': privatePackage({
    title: '4D3N Cebu + Bohol Private Tour',
    image: IMG.baclayonAlt,
    duration: '4 Days 3 Nights',
    prices: [[1, 21000], [2, 13300], [3, 10416], [4, 8575], [5, 8290], [6, 7700], [7, 7507], [8, 7162], [9, 6894], [10, 6680], [11, 6504], [12, 6358]],
    activities: [privateCityDay(), privateMoalboal('Day 2 - Private Moalboal Tour'), privateOslob('Day 3 - Private Oslob Tour'), privateBohol('Day 4 - Private Bohol Countryside Tour')],
    optionalActivities: ['ATV Ride', 'Loboc Cruise', 'Canyoneering', 'Sumilon Island', 'Whale shark activity assistance'],
    inclusions: ['Private transportation', 'Hotel accommodation coordination', 'Ferry assistance', 'Tour coordination']
  }),

  'cebu-city-joiner': joinerPackage({
    title: '1D City Joiner',
    image: IMG.city,
    duration: '1 Day',
    pricePerPax: 1480,
    activities: [cityActivity('SM Cebu')],
    inclusions: oneDayInclusions
  }),
  'moalboal-joiner': joinerPackage({
    title: '1D Moalboal Joiner',
    image: IMG.moalboal,
    duration: '1 Day',
    pricePerPax: 2070,
    activities: [moalboalActivity('SM Cebu')],
    inclusions: oneDayInclusions
  }),
  'oslob-joiner': joinerPackage({
    title: '1D Oslob Joiner',
    image: IMG.sumilon,
    duration: '1 Day',
    pricePerPax: 2276,
    activities: [oslobActivity('SM Cebu')],
    inclusions: oneDayInclusions
  }),
  'bohol-joiner': joinerPackage({
    title: '1D Bohol Joiner',
    image: IMG.bohol,
    duration: '1 Day',
    pricePerPax: 3229,
    activities: [boholActivity('SM Cebu')],
    inclusions: boholInclusions
  }),
  'city-moalboal-joiner': joinerPackage({
    title: '2D1N City + Moalboal Joiner',
    image: IMG.sirao,
    duration: '2 Days 1 Night',
    pricePerPax: 3945,
    activities: [cityActivity('Hotel'), moalboalActivity('SM Cebu')],
    inclusions: ['Transportation', 'Hotel accommodation for 1 night', 'Guiding fee', 'Entrance fees']
  }),
  'city-oslob-joiner': joinerPackage({
    title: '2D1N City + Oslob Joiner',
    image: IMG.tumalog,
    duration: '2 Days 1 Night',
    pricePerPax: 4130,
    activities: [cityActivity('Hotel'), oslobActivity('SM Cebu')],
    inclusions: ['Transportation', 'Hotel accommodation for 1 night', 'Guiding fee', 'Entrance fees']
  }),
  'city-bohol-joiner': joinerPackage({
    title: '2D1N City + Bohol Joiner',
    image: IMG.magellan,
    duration: '2 Days 1 Night',
    pricePerPax: 5459,
    activities: [cityActivity('Hotel'), boholActivity('SM Cebu')],
    inclusions: ['Transportation', 'Hotel accommodation for 1 night', 'Guiding fee', 'Entrance fees', 'Ferry fare']
  }),
  'moalboal-oslob-joiner': joinerPackage({
    title: '2D1N Moalboal + Oslob Joiner',
    image: IMG.kawasan,
    duration: '2 Days 1 Night',
    pricePerPax: 4494,
    activities: [moalboalActivity('Hotel'), oslobActivity('SM Cebu')],
    inclusions: ['Transportation', 'Hotel accommodation for 1 night', 'Guiding fee', 'Entrance fees']
  }),
  'moalboal-bohol-joiner': joinerPackage({
    title: '2D1N Moalboal + Bohol Joiner',
    image: IMG.tarsier,
    duration: '2 Days 1 Night',
    pricePerPax: 6208,
    activities: [moalboalActivity('Hotel'), boholActivity('SM Cebu')],
    inclusions: ['Hotel accommodation for 1 night', 'Transport', 'Guide fee', 'Entrance fees', 'Ferry fare']
  }),
  'oslob-bohol-joiner': joinerPackage({
    title: '2D1N Oslob + Bohol Joiner',
    image: IMG.baclayon,
    duration: '2 Days 1 Night',
    pricePerPax: 6272,
    activities: [oslobActivity('Hotel'), boholActivity('SM Cebu')],
    inclusions: ['Transportation', 'Hotel accommodation for 1 night', 'Guiding fee', 'Entrance fees', 'Ferry fare']
  }),
  'city-moalboal-oslob-joiner': joinerPackage({
    title: '3D2N City + Moalboal + Oslob Joiner',
    image: IMG.tops,
    duration: '3 Days 2 Nights',
    pricePerPax: 5238,
    activities: [cityActivity('Hotel'), moalboalActivity('Hotel'), oslobActivity('SM Cebu')],
    inclusions: ['Transport', 'Hotel accommodation for 2 nights', 'Guide fee', 'Entrance fees']
  }),
  'moalboal-oslob-bohol-joiner': joinerPackage({
    title: '3D2N Moalboal + Oslob + Bohol Joiner',
    image: IMG.oslob,
    duration: '3 Days 2 Nights',
    pricePerPax: 7487,
    activities: [moalboalActivity('Hotel'), oslobActivity('Hotel'), boholActivity('SM Cebu')],
    inclusions: ['Transport', 'Hotel accommodation for 2 nights', 'Guide fee', 'Entrance fees', 'Ferry fare']
  }),
  'cebu-moalboal-oslob-bohol-joiner': joinerPackage({
    title: '4D3N City + Moalboal + Oslob + Bohol Joiner',
    image: IMG.baclayonAlt,
    duration: '4 Days 3 Nights',
    pricePerPax: 7937,
    activities: [cityActivity('Hotel'), moalboalActivity('Hotel'), oslobActivity('Hotel'), boholActivity('SM Cebu')],
    inclusions: ['Transport', 'Hotel accommodation for 3 nights', 'Guide fee', 'Entrance fees', 'Ferry fare'],
    notes: ['Best seller package.']
  })
};

window.PACKAGE_DATA = PACKAGE_DATA;
