import { ServiceItem, BuildItem, GoogleReview, BlogPost } from './types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'engine-repair',
    title: 'Engine Tuning & Repair',
    icon: 'Wrench',
    shortDesc: 'Complete mechanical diagnostics, engine rebuilds, and performance servicing.',
    details: 'Our certified master techs handle everything from regular maintenance to heavy engine rebuilding and performance stroker builds.',
    price: '$150/hr',
    turnaround: '1 - 3 Days'
  },
  {
    id: 'tune-ups',
    title: 'Tune-Ups & Diagnostics',
    icon: 'Settings',
    shortDesc: 'ECU mapping, dyno calibration, and complete vehicle electronic diagnostics.',
    details: 'Custom dyno and road tuning utilizing state-of-the-art diagnostic equipment. Unlock extra horsepower safely while maintaining reliability.',
    price: '$180/hr',
    turnaround: 'Same Day'
  },
  {
    id: 'custom-builds',
    title: 'Custom Performance Builds',
    icon: 'Gauge',
    shortDesc: 'Turbo upgrades, custom intakes, and full engine bay styling.',
    details: 'Complete turn-key performance packages. We supply and fit premium aftermarket turbos, superchargers, custom intercoolers, and intakes.',
    price: 'Custom Quote',
    turnaround: 'Varies'
  },
  {
    id: 'suspension-brakes',
    title: 'Suspension & Brakes',
    icon: 'Activity',
    shortDesc: 'Coilover installs, corner balancing, and big brake kit upgrades.',
    details: 'Precision track and street alignment, coilover installation, air suspension custom setups, and high-performance multi-piston braking systems.',
    price: '$350 - $1200',
    turnaround: '3 - 6 Hours'
  },
  {
    id: 'exhaust-systems',
    title: 'Exhaust Systems',
    icon: 'Wind',
    shortDesc: 'Handmade titanium & stainless steel catback exhausts and downpipes.',
    details: 'TIG-welded custom exhaust systems designed for maximum gas flow and an unmatched exhaust note. Choose from street-quiet to track-loud.',
    price: '$650 - $2400',
    turnaround: '1 - 2 Days'
  },
  {
    id: 'full-detail',
    title: 'Full Detail & Protection',
    icon: 'Sparkles',
    shortDesc: 'Paint correction, self-healing ceramic coatings, and interior detailing.',
    details: 'Multi-stage paint correction to remove swirls and scratches, followed by a premium multi-year ceramic coating to protect your car’s finish.',
    price: '$450 - $1500',
    turnaround: '1 - 2 Days'
  }
];

export const BUILDS_DATA: BuildItem[] = [
  {
    id: 'gtr-r35',
    carModel: 'Nissan GT-R R35',
    category: 'Performance',
    workDone: 'Stage 3 Tune, Custom Titanium Exhaust, Alpha Intercooler, 850 HP Calibration',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    instagramUrl: 'https://instagram.com'
  },
  {
    id: 'supra-a90',
    carModel: 'Toyota GR Supra A90',
    category: 'Tuning',
    workDone: 'Downpipe, Remap, KW V3 Coilovers, Advan GT Wheels, 520 WHP Dynamic Mapping',
    image: 'https://images.unsplash.com/photo-1617469167446-80e3a4466551?auto=format&fit=crop&w=800&q=80',
    instagramUrl: 'https://instagram.com'
  },
  {
    id: 'rx7-fd',
    carModel: 'Mazda RX-7 FD3S',
    category: 'Custom',
    workDone: 'Single Turbo Conversion, Apexi PowerFC, Street Port Rotary Rebuild, V-Mount Intercooler',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80',
    instagramUrl: 'https://instagram.com'
  },
  {
    id: 'porsche-gt3',
    carModel: 'Porsche 911 GT3 RS',
    category: 'Detailing',
    workDone: 'Custom Decals, 3-Stage Paint Correction, Gtechniq Serum Ceramic Coating, Full Front PPF',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    instagramUrl: 'https://instagram.com'
  },
  {
    id: 'civic-type-r',
    carModel: 'Honda Civic Type R FL5',
    category: 'Performance',
    workDone: 'Hondata FlashPro, HKS Intercooler, Milltek Exhaust, Eventuri Carbon Intake',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    instagramUrl: 'https://instagram.com'
  }
];

export const REVIEWS_DATA: GoogleReview[] = [
  {
    id: 'rev-1',
    author: 'Justin Chen',
    rating: 5,
    text: 'Dreamville is the only shop I trust with my built Supra. Honest, transparent, and incredibly skilled. Abubakar and the crew are true car enthusiasts who treat your car like their own.',
    date: '1 week ago',
    avatar: 'JC'
  },
  {
    id: 'rev-2',
    author: 'Sarah Jenkins',
    rating: 5,
    text: 'Brought my M3 in for an exhaust upgrade and custom suspension alignment. The corner balancing made a night and day difference on the track! Highly recommend their expert service.',
    date: '3 weeks ago',
    avatar: 'SJ'
  },
  {
    id: 'rev-3',
    author: 'Marcus Vance',
    rating: 5,
    text: 'Incredible customer support. They diagnosed a weird misfire issue that two other shops in Burnaby couldn’t figure out. Kept me updated throughout the entire process.',
    date: '1 month ago',
    avatar: 'MV'
  },
  {
    id: 'rev-4',
    author: 'Elena Rostova',
    rating: 5,
    text: 'Fantastic ceramic coating work! My Porsche looks glossier than the day I picked it up from the dealership. Dust just slides off. 10/10 craftsmanship.',
    date: '1 month ago',
    avatar: 'ER'
  }
];

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Unlocking Hidden Power: The Science of Custom ECU Remapping on Modern Engines',
    slug: 'unlocking-hidden-power-ecu-remapping',
    date: 'July 20, 2026',
    author: 'Marcus Vance',
    authorTitle: 'Lead Calibration Engineer',
    category: 'Performance & Tuning',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1617469167446-80e3a4466551?auto=format&fit=crop&w=1200&q=80',
    summary: 'Discover how bespoke ECU remapping on our Burnaby AWD dyno optimizes ignition timing, air-fuel ratios, and boost pressure curves to gain up to 30%+ WHP safely without sacrificing engine longevity.',
    content: [
      'Modern turbocharged and direct-injected engines leave significant factory power reserves on the table. Vehicle manufacturers calibrate Engine Control Units (ECUs) with broad safety margins designed for low-octane fuel, extreme temperature variances, and delayed maintenance intervals globally.',
      'At Dreamville Auto, our calibration process replaces generic factory tables with a high-resolution custom map tailored specifically to your vehicle’s exact hardware modifications, fuel grade (91 or 94 Octane / E85), and local elevation parameters.',
      '1. Optimized Air-Fuel Ratios (AFR): Factory tunes run rich under heavy load to cool catalytic converters, wasting fuel and choking power. Precise stoichiometric adjustments under boost deliver crisp throttle response and maximum torque density.',
      '2. Ignition Timing Advancement: By monitoring knock sensors in real-time on our load-bearing AWD dyno, we advance spark timing to extract peak cylinder pressure at the ideal crankshaft position without thermal detonation.',
      '3. Dynamic Boost Control: Turbocharger wastegate duty cycles are recalibrated to smooth out boost delivery across the entire RPM range, eliminating flat spots and sustaining power all the way to redline.',
      '4. Safety Margins Retained: Thermal protection strategies, knock mitigation maps, and oil temperature safeguards remain fully intact, ensuring your build stays reliable on the street and track.'
    ],
    tags: ['ECU Remap', 'AWD Dyno', 'Stage 2', 'Performance Tuning', 'Burnaby Auto']
  }
];

