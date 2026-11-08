import { CarSpot } from '../types/spotter';

export const INITIAL_CAR_SPOTS: CarSpot[] = [
  {
    id: 'spot-001',
    make: 'Bugatti',
    model: 'Chiron Pur Sport',
    variant: 'Grand Prix Exposed Carbon',
    year: 2023,
    rarity: 'legendary',
    rarityReason: 'Strictly capped at 60 units globally. 1,479hp quad-turbo W16 tuned for pure agility and mechanical grip.',
    photos: [
      '/src/assets/images/bugatti_chiron_spot_1794133924471.jpg',
      '/src/assets/images/bugatti_chiron_rear_1794135794826.jpg'
    ],
    coverPhotoIndex: 0,
    location: 'Place du Casino, Monaco',
    spottedAt: '2026-11-06T19:42:00Z',
    spotter: 'Alexandre_V',
    specs: {
      hp: 1479,
      engine: '8.0L Quad-Turbo W16',
      topSpeedMph: 218,
      zeroToSixtySec: 2.3,
      estValue: '$4,250,000',
      productionUnits: '60 Units Worldwide'
    },
    notes: 'Spotted rolling up to Hôtel de Paris right as the valet roped off the center fountain. Sound of the quad-turbo W16 idling gave everyone goosebumps.',
    likes: 142,
    isSaved: true
  },
  {
    id: 'spot-002',
    make: 'Porsche',
    model: '911 GT3 RS (992)',
    variant: 'Weissach Package',
    year: 2024,
    rarity: 'epic',
    rarityReason: 'Extreme active aero track weapon with DRS, 518hp naturally aspirated 4.0L flat-6 revving to 9,000 RPM.',
    photos: [
      '/src/assets/images/porsche_gt3rs_spot_1794133925156.jpg',
      '/src/assets/images/porsche_gt3rs_cockpit_1794135796109.jpg'
    ],
    coverPhotoIndex: 0,
    location: 'Park Lane Underground, London',
    spottedAt: '2026-11-05T21:15:00Z',
    spotter: 'Marcus_Apex',
    specs: {
      hp: 518,
      engine: '4.0L Naturally Aspirated Boxer-6',
      topSpeedMph: 184,
      zeroToSixtySec: 3.0,
      estValue: '$385,000',
      productionUnits: 'Limited GT allocation'
    },
    notes: 'Exposed carbon hood and magnesium forged wheels. Driver warmed up the tires before pulling onto Mayfair streets.',
    likes: 89,
    isSaved: false
  },
  {
    id: 'spot-003',
    make: 'Ferrari',
    model: 'SF90 XX Stradale',
    variant: 'Assetto Fiorano Track Spec',
    year: 2024,
    rarity: 'epic',
    rarityReason: 'First road-legal Ferrari XX programme car with fixed rear aero wing producing 530kg downforce.',
    photos: [
      '/src/assets/images/ferrari_sf90_spot_1794133926176.jpg',
      '/src/assets/images/ferrari_sf90_rear_1794135795836.jpg'
    ],
    coverPhotoIndex: 0,
    location: 'Passo di Giau, Dolomites, Italy',
    spottedAt: '2026-11-04T17:30:00Z',
    spotter: 'Matteo_Corsa',
    specs: {
      hp: 1016,
      engine: '4.0L Twin-Turbo V8 Tri-Motor Hybrid',
      topSpeedMph: 199,
      zeroToSixtySec: 2.1,
      estValue: '$1,020,000',
      productionUnits: '799 Worldwide'
    },
    notes: 'Caught resting at the mountain summit right before sunset. The carbon wing and front fender louvers look menacing in person.',
    likes: 114,
    isSaved: true
  },
  {
    id: 'spot-004',
    make: 'Lamborghini',
    model: 'Aventador SVJ',
    variant: 'Superveloce Jota Coupe',
    year: 2022,
    rarity: 'epic',
    rarityReason: 'ALA 2.0 active aerodynamics system, 759hp screaming atmospheric 6.5L V12 with center-lock wheels.',
    photos: [
      '/src/assets/images/lamborghini_svj_spot_1794133925865.jpg'
    ],
    coverPhotoIndex: 0,
    location: 'Shinjuku Kabukicho, Tokyo',
    spottedAt: '2026-11-03T23:10:00Z',
    spotter: 'Kenji_Spotter',
    specs: {
      hp: 759,
      engine: '6.5L Naturally Aspirated V12',
      topSpeedMph: 217,
      zeroToSixtySec: 2.8,
      estValue: '$760,000',
      productionUnits: '900 Coupes'
    },
    notes: 'Matte Nero Nemesis finish with bronze lightweight rims. Downshifts echoed off the neon skyscrapers.',
    likes: 98,
    isSaved: false
  },
  {
    id: 'spot-005',
    make: 'BMW M',
    model: 'M4 CSL',
    variant: 'Frozen Brooklyn Grey 50 Jahre',
    year: 2023,
    rarity: 'rare',
    rarityReason: 'Competition Sport Lightweight with laser taillights, carbon ducktail, yellow DRL headlights, and rear-seat delete.',
    photos: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80'
    ],
    coverPhotoIndex: 0,
    location: 'Nürburgring Boulevard, Germany',
    spottedAt: '2026-11-02T14:20:00Z',
    spotter: 'Ring_Hunter',
    specs: {
      hp: 543,
      engine: '3.0L Twin-Turbo S58 Inline-6',
      topSpeedMph: 191,
      zeroToSixtySec: 3.6,
      estValue: '$165,000',
      productionUnits: '1,000 Units Worldwide'
    },
    notes: 'Parked in the paddock after running a hot lap. Michelin Cup 2 R rubber was still smoking.',
    likes: 67,
    isSaved: false
  },
  {
    id: 'spot-006',
    make: 'Porsche',
    model: '911 Carrera GTS',
    variant: 'T-Hybrid Coupe',
    year: 2025,
    rarity: 'common',
    rarityReason: 'High-volume luxury sports car benchmark. Commonly spotted in metropolitan financial districts.',
    photos: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80'
    ],
    coverPhotoIndex: 0,
    location: 'Rodeo Drive, Beverly Hills',
    spottedAt: '2026-11-01T16:05:00Z',
    spotter: 'SoCal_Supercars',
    specs: {
      hp: 532,
      engine: '3.6L T-Hybrid Boxer-6',
      topSpeedMph: 194,
      zeroToSixtySec: 2.9,
      estValue: '$175,000',
      productionUnits: 'Series Production'
    },
    notes: 'Clean slate grey spec with RS Spyder design wheels. Great sounding electric turbo spool on acceleration.',
    likes: 41,
    isSaved: false
  }
];
