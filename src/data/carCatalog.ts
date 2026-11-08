import { ManufacturerEntry, RarityTier, CarSpecs } from '../types/spotter';

export const MANUFACTURER_CATALOG: ManufacturerEntry[] = [
  {
    name: 'Porsche',
    country: 'Germany',
    popular: true,
    models: [
      {
        name: '911 GT3 RS (992)',
        defaultRarity: 'epic',
        variants: ['Weissach Package', 'Standard Aero', 'Tribute to Carrera RS', 'Manthey Racing Kit'],
        rarityReason: 'Extreme active aero track weapon with DRS, 518hp naturally aspirated 4.0L flat-6.',
        specs: { hp: 518, engine: '4.0L Naturally Aspirated Flat-6', topSpeedMph: 184, zeroToSixtySec: 3.0, estValue: '$365,000', productionUnits: 'Limited track allocation' }
      },
      {
        name: '918 Spyder',
        defaultRarity: 'legendary',
        variants: ['Weissach Package', 'Liquid Metal Chrome', 'Martini Racing Livery'],
        rarityReason: 'Part of the Holy Trinity of hypercars. Only 918 examples ever built worldwide.',
        specs: { hp: 887, engine: '4.6L V8 Hybrid', topSpeedMph: 214, zeroToSixtySec: 2.2, estValue: '$2,100,000', productionUnits: '918 units worldwide' }
      },
      {
        name: 'Carrera GT',
        defaultRarity: 'legendary',
        variants: ['Standard V10', 'Zagato Edition', 'Gemballa Mirage GT'],
        rarityReason: 'Iconic analog supercar powered by a screaming 5.7L V10 derived from F1.',
        specs: { hp: 605, engine: '5.7L Naturally Aspirated V10', topSpeedMph: 205, zeroToSixtySec: 3.5, estValue: '$1,650,000', productionUnits: '1,270 units' }
      },
      {
        name: '911 S/T (Heritage 60th)',
        defaultRarity: 'legendary',
        variants: ['Heritage Design Package', 'Standard S/T Lightweight'],
        rarityReason: 'Ultra-rare manual celebration model combining GT3 RS engine with GT3 Touring body. 1,963 units.',
        specs: { hp: 518, engine: '4.0L Flat-6 (Manual Only)', topSpeedMph: 186, zeroToSixtySec: 3.5, estValue: '$650,000', productionUnits: '1,963 units' }
      },
      {
        name: '911 GT2 RS (991.2)',
        defaultRarity: 'epic',
        variants: ['Weissach Package', 'ClubSport 25', 'Clubsport'],
        rarityReason: 'The ultimate twin-turbo rear-wheel drive monster. Nürburgring lap record holder.',
        specs: { hp: 700, engine: '3.8L Twin-Turbo Flat-6', topSpeedMph: 211, zeroToSixtySec: 2.7, estValue: '$480,000', productionUnits: '~1,000 units' }
      },
      {
        name: '718 Cayman GT4 RS',
        defaultRarity: 'epic',
        variants: ['Weissach Package', 'Clubsport Spec', 'Carbon Induction Package'],
        rarityReason: 'Mid-engine monster with air intake scoops right behind the driver ears.',
        specs: { hp: 493, engine: '4.0L Naturally Aspirated Flat-6', topSpeedMph: 196, zeroToSixtySec: 3.2, estValue: '$210,000', productionUnits: 'Limited GT allocation' }
      },
      {
        name: '911 Turbo S (992)',
        defaultRarity: 'rare',
        variants: ['SportDesign Package', 'Lightweight Package', 'Cabriolet', 'Exclusive Manufaktur'],
        rarityReason: 'Benchmark all-weather supercar weapon delivering hypercar acceleration.',
        specs: { hp: 640, engine: '3.7L Twin-Turbo Flat-6', topSpeedMph: 205, zeroToSixtySec: 2.6, estValue: '$255,000', productionUnits: 'Regular production halo' }
      },
      {
        name: '911 Carrera GTS',
        defaultRarity: 'common',
        variants: ['T-Hybrid Coupe', 'Cabriolet', 'Targa 4 GTS'],
        rarityReason: 'Popular high-performance daily driver frequently spotted in metropolitan areas.',
        specs: { hp: 532, engine: '3.6L T-Hybrid Flat-6', topSpeedMph: 194, zeroToSixtySec: 2.9, estValue: '$168,000', productionUnits: 'High volume luxury' }
      }
    ]
  },
  {
    name: 'Bugatti',
    country: 'France',
    popular: true,
    models: [
      {
        name: 'Chiron Pur Sport',
        defaultRarity: 'legendary',
        variants: ['Grand Prix Spec', 'Les Légendes du Ciel', 'Full Carbon Exposed'],
        rarityReason: 'Strictly capped at 60 units globally. 1,479hp quad-turbo W16 tuned for pure agility.',
        specs: { hp: 1479, engine: '8.0L Quad-Turbo W16', topSpeedMph: 218, zeroToSixtySec: 2.3, estValue: '$4,200,000', productionUnits: '60 units worldwide' }
      },
      {
        name: 'Chiron Super Sport 300+',
        defaultRarity: 'legendary',
        variants: ['Record Edition Jet Orange/Carbon', 'Custom Hermès Spec'],
        rarityReason: 'The first production hypercar to break 300 mph. Only 30 units produced.',
        specs: { hp: 1578, engine: '8.0L Quad-Turbo W16', topSpeedMph: 304, zeroToSixtySec: 2.2, estValue: '$5,500,000', productionUnits: '30 units worldwide' }
      },
      {
        name: 'Divo',
        defaultRarity: 'legendary',
        variants: ['Bespoke Coachbuilt Spec', 'Lady Bug Livery'],
        rarityReason: 'Coachbuilt masterpiece limited to only 40 owners worldwide.',
        specs: { hp: 1479, engine: '8.0L Quad-Turbo W16', topSpeedMph: 236, zeroToSixtySec: 2.4, estValue: '$7,800,000', productionUnits: '40 units worldwide' }
      },
      {
        name: 'Tourbillon',
        defaultRarity: 'legendary',
        variants: ['Launch Specification', 'Titanium Skeleton Dash'],
        rarityReason: 'Next-generation V16 hybrid naturally aspirated masterpiece with horological instrument cluster.',
        specs: { hp: 1775, engine: '8.3L Naturally Aspirated V16 Hybrid', topSpeedMph: 276, zeroToSixtySec: 2.0, estValue: '$4,600,000', productionUnits: '250 units planned' }
      },
      {
        name: 'Veyron 16.4 Super Sport',
        defaultRarity: 'legendary',
        variants: ['World Record Edition', 'Pur Sang', 'Grand Sport Vitesse'],
        rarityReason: 'The legendary car that redefined the modern hypercar era. 48 units worldwide.',
        specs: { hp: 1184, engine: '8.0L Quad-Turbo W16', topSpeedMph: 267, zeroToSixtySec: 2.5, estValue: '$2,800,000', productionUnits: '48 units SS' }
      }
    ]
  },
  {
    name: 'Ferrari',
    country: 'Italy',
    popular: true,
    models: [
      {
        name: 'SF90 XX Stradale',
        defaultRarity: 'epic',
        variants: ['Assetto Fiorano', 'XX Spider', 'Rosso Corsa Racing Spec'],
        rarityReason: 'First road-legal Ferrari XX programme car with fixed rear aero wing. 799 coupes.',
        specs: { hp: 1016, engine: '4.0L Twin-Turbo V8 Tri-Motor Hybrid', topSpeedMph: 199, zeroToSixtySec: 2.1, estValue: '$980,000', productionUnits: '799 coupes / 599 spiders' }
      },
      {
        name: 'LaFerrari',
        defaultRarity: 'legendary',
        variants: ['Aperta', 'Corsa Clienti', 'Carbon Roof Special'],
        rarityReason: 'Maranello Holy Trinity flagship with naturally aspirated screaming 6.3L V12 and HY-KERS.',
        specs: { hp: 949, engine: '6.3L V12 + KERS Hybrid', topSpeedMph: 218, zeroToSixtySec: 2.4, estValue: '$3,800,000', productionUnits: '499 coupes / 210 apertas' }
      },
      {
        name: 'Daytona SP3 (Icona Series)',
        defaultRarity: 'legendary',
        variants: ['Icona Bespoke Tailor Made', 'Historic Tribute Spec'],
        rarityReason: 'Ferrari Icona series masterpiece celebrating 1967 24 Hours of Daytona. Only 599 units.',
        specs: { hp: 829, engine: '6.5L Naturally Aspirated V12', topSpeedMph: 211, zeroToSixtySec: 2.8, estValue: '$3,200,000', productionUnits: '599 units worldwide' }
      },
      {
        name: '812 Competizione',
        defaultRarity: 'epic',
        variants: ['Competizione A (Targa)', 'Tailor Made Matte', 'Giallo Modena Livery'],
        rarityReason: 'Peak atmospheric V12 revving to a staggering 9,500 RPM with carbon rear blade.',
        specs: { hp: 819, engine: '6.5L V12 9,500 RPM', topSpeedMph: 211, zeroToSixtySec: 2.8, estValue: '$850,000', productionUnits: '999 coupes / 599 apertas' }
      },
      {
        name: '296 GTB',
        defaultRarity: 'rare',
        variants: ['Assetto Fiorano', 'GTS Spider', 'Historic Racing Stripe'],
        rarityReason: 'The modern "piccola V12" twin-turbo 120-degree hot-V hybrid producing 819 hp.',
        specs: { hp: 819, engine: '3.0L Twin-Turbo 120° V6 Hybrid', topSpeedMph: 205, zeroToSixtySec: 2.7, estValue: '$370,000', productionUnits: 'Serial production supercar' }
      },
      {
        name: 'Roma',
        defaultRarity: 'common',
        variants: ['Spider', 'Standard Coupe'],
        rarityReason: 'Elegant front-engine GT seen regularly in upscale city districts.',
        specs: { hp: 612, engine: '3.9L Twin-Turbo V8', topSpeedMph: 199, zeroToSixtySec: 3.4, estValue: '$245,000', productionUnits: 'Regular luxury GT volume' }
      }
    ]
  },
  {
    name: 'Lamborghini',
    country: 'Italy',
    popular: true,
    models: [
      {
        name: 'Aventador SVJ',
        defaultRarity: 'epic',
        variants: ['SVJ Roadster', 'SVJ 63 Edition', 'Verde Alceo Satin Spec'],
        rarityReason: 'Superveloce Jota featuring ALA 2.0 active aerodynamics and 770hp naturally aspirated V12.',
        specs: { hp: 759, engine: '6.5L Naturally Aspirated V12', topSpeedMph: 217, zeroToSixtySec: 2.8, estValue: '$720,000', productionUnits: '900 coupes / 800 roadsters' }
      },
      {
        name: 'Revuelto',
        defaultRarity: 'epic',
        variants: ['Launch Spec Arancio Apodis', 'Sport Lightweight Aero'],
        rarityReason: 'First HPEV (High Performance Electrified Vehicle) V12 flagship delivering 1,001 hp.',
        specs: { hp: 1001, engine: '6.5L V12 Tri-Motor Hybrid', topSpeedMph: 217, zeroToSixtySec: 2.5, estValue: '$680,000', productionUnits: '2-year waitlist flagship' }
      },
      {
        name: 'Sián FKP 37',
        defaultRarity: 'legendary',
        variants: ['Roadster Edition', 'Exposed Carbon Olive Green'],
        rarityReason: 'Supercapacitor hybrid tech tribute to Ferdinand Karl Piëch. Only 63 coupes ever made.',
        specs: { hp: 808, engine: '6.5L V12 Supercapacitor Hybrid', topSpeedMph: 220, zeroToSixtySec: 2.7, estValue: '$3,900,000', productionUnits: '63 coupes / 19 roadsters' }
      },
      {
        name: 'Huracán STO',
        defaultRarity: 'epic',
        variants: ['Super Trofeo Omologata', 'Bespoke Ad Personam Livery'],
        rarityReason: 'Road-homologated version of Lamborghini Squadra Corse race cars with Confango hood.',
        specs: { hp: 631, engine: '5.2L Naturally Aspirated V10', topSpeedMph: 193, zeroToSixtySec: 3.0, estValue: '$390,000', productionUnits: 'Track-focused special' }
      },
      {
        name: 'Huracán Tecnica',
        defaultRarity: 'rare',
        variants: ['Ad Personam Satin', 'Standard Spec'],
        rarityReason: 'The refined bridge between EVO and STO with rear-wheel drive steering.',
        specs: { hp: 631, engine: '5.2L Naturally Aspirated V10', topSpeedMph: 202, zeroToSixtySec: 3.2, estValue: '$275,000', productionUnits: 'Limited run farewell V10' }
      },
      {
        name: 'Urus Performante',
        defaultRarity: 'common',
        variants: ['Carbon Fiber Package', 'Standard Urus', 'Pearl Capsule'],
        rarityReason: 'Extremely popular high-end SUV frequently spotted in nightlife and luxury retail hubs.',
        specs: { hp: 657, engine: '4.0L Twin-Turbo V8', topSpeedMph: 190, zeroToSixtySec: 3.3, estValue: '$265,000', productionUnits: 'High volume luxury SUV' }
      }
    ]
  },
  {
    name: 'McLaren',
    country: 'United Kingdom',
    popular: true,
    models: [
      {
        name: 'P1',
        defaultRarity: 'legendary',
        variants: ['P1 GTR (Road Converted)', 'P1 LM by Lanzante', 'MSO Full Visual Carbon'],
        rarityReason: 'The definitive British hypercar of the 2010s Holy Trinity. Capped at 375 cars.',
        specs: { hp: 903, engine: '3.8L Twin-Turbo V8 Hybrid', topSpeedMph: 217, zeroToSixtySec: 2.7, estValue: '$2,300,000', productionUnits: '375 units worldwide' }
      },
      {
        name: 'Senna',
        defaultRarity: 'legendary',
        variants: ['Senna GTR', 'Senna Can-Am', 'Ayrton Senna Livery'],
        rarityReason: 'Aerodynamic extremity producing 800kg of downforce. Named in honor of Ayrton Senna.',
        specs: { hp: 789, engine: '4.0L Twin-Turbo V8', topSpeedMph: 208, zeroToSixtySec: 2.7, estValue: '$1,400,000', productionUnits: '500 units worldwide' }
      },
      {
        name: '765LT',
        defaultRarity: 'epic',
        variants: ['Spider', 'MSO Carbon Theme', 'Roof Scoop Spec'],
        rarityReason: 'Longtail pedigree with titanium quad exhaust and blistering quarter-mile times.',
        specs: { hp: 755, engine: '4.0L Twin-Turbo V8', topSpeedMph: 205, zeroToSixtySec: 2.7, estValue: '$480,000', productionUnits: '765 coupes / 765 spiders' }
      },
      {
        name: '750S',
        defaultRarity: 'rare',
        variants: ['Spider', 'MSO Contrast Spec'],
        rarityReason: 'Lightest benchmark series production supercar in McLaren lineup.',
        specs: { hp: 740, engine: '4.0L Twin-Turbo V8', topSpeedMph: 206, zeroToSixtySec: 2.7, estValue: '$345,000', productionUnits: 'Production supercar' }
      },
      {
        name: 'Artura',
        defaultRarity: 'common',
        variants: ['Spider', 'Vision Spec'],
        rarityReason: 'Entry hybrid supercar from Woking, often spotted in suburban performance circles.',
        specs: { hp: 690, engine: '3.0L Twin-Turbo V6 Hybrid', topSpeedMph: 205, zeroToSixtySec: 3.0, estValue: '$240,000', productionUnits: 'Series production' }
      }
    ]
  },
  {
    name: 'Koenigsegg',
    country: 'Sweden',
    popular: true,
    models: [
      {
        name: 'Jesko Attack',
        defaultRarity: 'legendary',
        variants: ['Jesko Absolut (High Speed)', 'Naked Carbon Ghost Spec', 'Odin 24k Gold Leaf'],
        rarityReason: 'Swedish megacar generating 1,600hp with Revolutionary 9-speed Light Speed Transmission.',
        specs: { hp: 1600, engine: '5.0L Twin-Turbo Flat-Plane V8 (E85)', topSpeedMph: 310, zeroToSixtySec: 2.4, estValue: '$3,800,000', productionUnits: '125 units worldwide' }
      },
      {
        name: 'CC850',
        defaultRarity: 'legendary',
        variants: ['Silver Tribute 50th', 'Exposed Carbon Red'],
        rarityReason: 'Engage Shift System allowing seamless switch between gated 6-speed manual and 9-speed automatic.',
        specs: { hp: 1385, engine: '5.0L Twin-Turbo V8', topSpeedMph: 280, zeroToSixtySec: 2.6, estValue: '$3,650,000', productionUnits: '70 units worldwide' }
      },
      {
        name: 'Agera RS',
        defaultRarity: 'legendary',
        variants: ['Naraya (Gold Leaf)', 'Thor & Väder (Final)', 'Draken'],
        rarityReason: 'Former world record top speed holder recorded at 277.87 mph on Nevada highway.',
        specs: { hp: 1341, engine: '5.0L Twin-Turbo V8 1-Megawatt', topSpeedMph: 278, zeroToSixtySec: 2.6, estValue: '$4,500,000', productionUnits: '25 units worldwide' }
      }
    ]
  },
  {
    name: 'Pagani',
    country: 'Italy',
    popular: true,
    models: [
      {
        name: 'Huayra BC',
        defaultRarity: 'legendary',
        variants: ['BC Roadster', 'Tempesta Aero Kit', 'Macchina Volante Custom'],
        rarityReason: 'Horacio Pagani homage to Benny Caiola. Carbo-Triax chassis and bespoke AMG twin-turbo V12.',
        specs: { hp: 791, engine: '6.0L AMG Twin-Turbo V12', topSpeedMph: 238, zeroToSixtySec: 2.8, estValue: '$3,700,000', productionUnits: '20 coupes / 40 roadsters' }
      },
      {
        name: 'Utopia',
        defaultRarity: 'legendary',
        variants: ['Manual Gated Spec', 'Utopia Roadster'],
        rarityReason: 'Pure analog sculpture with 7-speed gated manual gearbox and twin-turbo Mercedes-AMG V12.',
        specs: { hp: 852, engine: '6.0L AMG Twin-Turbo V12 (Gated Manual)', topSpeedMph: 220, zeroToSixtySec: 2.9, estValue: '$2,900,000', productionUnits: '99 units worldwide' }
      },
      {
        name: 'Zonda Cinque',
        defaultRarity: 'legendary',
        variants: ['Roadster Spec', 'Exposed White Carbon Livery'],
        rarityReason: 'Holy grail hypercar. Only 5 coupes and 5 roadsters in existence worldwide.',
        specs: { hp: 678, engine: '7.3L AMG Naturally Aspirated V12', topSpeedMph: 217, zeroToSixtySec: 3.3, estValue: '$12,000,000', productionUnits: '5 coupes / 5 roadsters' }
      }
    ]
  },
  {
    name: 'Mercedes-AMG',
    country: 'Germany',
    popular: true,
    models: [
      {
        name: 'AMG ONE',
        defaultRarity: 'legendary',
        variants: ['F1 Livery Launch Edition', 'Petronas Accent Package'],
        rarityReason: 'Actual Formula 1 1.6L turbocharged hybrid engine in a street legal hypercar. 275 units.',
        specs: { hp: 1049, engine: '1.6L Turbo V6 F1 Hybrid (11,000 RPM)', topSpeedMph: 219, zeroToSixtySec: 2.8, estValue: '$2,750,000', productionUnits: '275 units worldwide' }
      },
      {
        name: 'AMG GT Black Series',
        defaultRarity: 'epic',
        variants: ['AMG ONE Edition', 'Magmabeam Orange Spec'],
        rarityReason: 'Flat-plane crank twin-turbo V8 with GT3 race car double-deck aerodynamic wing.',
        specs: { hp: 720, engine: '4.0L Flat-Plane Crank Twin-Turbo V8', topSpeedMph: 202, zeroToSixtySec: 3.1, estValue: '$460,000', productionUnits: '~1,700 units' }
      },
      {
        name: 'SLS AMG Black Series',
        defaultRarity: 'epic',
        variants: ['Solarbeam Yellow', 'Designo Mystic White'],
        rarityReason: 'Modern classic gullwing supercar with roaring 6.2L naturally aspirated AMG M159 engine.',
        specs: { hp: 622, engine: '6.2L Naturally Aspirated V8', topSpeedMph: 196, zeroToSixtySec: 3.5, estValue: '$750,000', productionUnits: '350 units' }
      },
      {
        name: 'AMG GT R (Green Hell Magno)',
        defaultRarity: 'rare',
        variants: ['GT R Pro', 'GT R Roadster'],
        rarityReason: 'Affalterbach Beast of the Green Hell featuring active underbody aero.',
        specs: { hp: 577, engine: '4.0L Twin-Turbo V8', topSpeedMph: 198, zeroToSixtySec: 3.5, estValue: '$175,000', productionUnits: 'Limited run track GT' }
      },
      {
        name: 'G63 AMG',
        defaultRarity: 'common',
        variants: ['4x4 Squared', 'Magno Matte Spec', 'Standard AMG Line'],
        rarityReason: 'Prevalent luxury status symbol spotted in major international city centers.',
        specs: { hp: 577, engine: '4.0L Twin-Turbo V8', topSpeedMph: 149, zeroToSixtySec: 4.3, estValue: '$190,000', productionUnits: 'High volume luxury' }
      }
    ]
  },
  {
    name: 'BMW M',
    country: 'Germany',
    popular: true,
    models: [
      {
        name: '3.0 CSL (Batmobile 50 Jahre)',
        defaultRarity: 'legendary',
        variants: ['Alpine White Historic M Livery'],
        rarityReason: 'Ultra-exclusive hand-built coachbuilt tribute to the original Batmobile. Only 50 units.',
        specs: { hp: 553, engine: '3.0L Twin-Turbo Inline-6 (Manual)', topSpeedMph: 190, zeroToSixtySec: 3.8, estValue: '$850,000', productionUnits: '50 units worldwide' }
      },
      {
        name: 'M4 CSL',
        defaultRarity: 'epic',
        variants: ['Frozen Brooklyn Grey', 'Sapphire Black with Red Accents'],
        rarityReason: 'Competition Sport Lightweight with laser taillights, carbon ducktail, and no rear seats.',
        specs: { hp: 543, engine: '3.0L Twin-Turbo S58 Inline-6', topSpeedMph: 191, zeroToSixtySec: 3.6, estValue: '$155,000', productionUnits: '1,000 units worldwide' }
      },
      {
        name: 'M3 CS / M4 CS',
        defaultRarity: 'rare',
        variants: ['Signal Green', 'Frozen Solid White', 'Standard CS Spec'],
        rarityReason: 'Hardcore club sport tuned chassis, yellow DRL headlights, and titanium silencer.',
        specs: { hp: 543, engine: '3.0L Twin-Turbo Inline-6 AWD', topSpeedMph: 188, zeroToSixtySec: 3.2, estValue: '$125,000', productionUnits: 'Limited 1-year production' }
      },
      {
        name: 'M3 Competition (G80)',
        defaultRarity: 'common',
        variants: ['xDrive', 'Manual Base', 'Touring (Wagon)'],
        rarityReason: 'Popular high-performance sports sedan frequently encountered on roads.',
        specs: { hp: 503, engine: '3.0L Twin-Turbo S58 Inline-6', topSpeedMph: 180, zeroToSixtySec: 3.4, estValue: '$88,000', productionUnits: 'High volume performance' }
      }
    ]
  },
  {
    name: 'Aston Martin',
    country: 'United Kingdom',
    popular: true,
    models: [
      {
        name: 'Valkyrie',
        defaultRarity: 'legendary',
        variants: ['Valkyrie Spider', 'AMR Pro (Track Only)', 'Full Carbon Spec'],
        rarityReason: 'Adrian Newey aerodynamic Formula 1 masterpiece with Cosworth 11,100 RPM V12.',
        specs: { hp: 1140, engine: '6.5L Cosworth V12 Hybrid (11,100 RPM)', topSpeedMph: 250, zeroToSixtySec: 2.5, estValue: '$3,500,000', productionUnits: '150 coupes / 85 spiders' }
      },
      {
        name: 'DBS 770 Ultimate',
        defaultRarity: 'epic',
        variants: ['Volante', 'Q by Aston Martin Bespoke'],
        rarityReason: 'Swan song to the twin-turbo 5.2L V12 super GT, limited to 499 units worldwide.',
        specs: { hp: 759, engine: '5.2L Twin-Turbo V12', topSpeedMph: 211, zeroToSixtySec: 3.2, estValue: '$420,000', productionUnits: '499 units worldwide' }
      },
      {
        name: 'Vantage (2025)',
        defaultRarity: 'common',
        variants: ['F1 Edition', 'Roadster', 'Standard V8'],
        rarityReason: 'Classic British sports tourer spotted in high-end suburbs and hotel drives.',
        specs: { hp: 656, engine: '4.0L Twin-Turbo AMG V8', topSpeedMph: 202, zeroToSixtySec: 3.4, estValue: '$190,000', productionUnits: 'Serial production' }
      }
    ]
  },
  {
    name: 'Audi Sport',
    country: 'Germany',
    popular: false,
    models: [
      {
        name: 'R8 GT (Final Edition)',
        defaultRarity: 'epic',
        variants: ['Rear-Wheel Drive Carbon Package', 'Suzuka Grey Matt'],
        rarityReason: 'Final farewell tribute to the naturally aspirated 5.2L V10. 333 numbered examples.',
        specs: { hp: 612, engine: '5.2L Naturally Aspirated V10 RWD', topSpeedMph: 199, zeroToSixtySec: 3.4, estValue: '$255,000', productionUnits: '333 units worldwide' }
      },
      {
        name: 'R8 V10 Performance',
        defaultRarity: 'rare',
        variants: ['Quattro', 'Spyder', 'Decennium Edition'],
        rarityReason: 'Quattro mid-engine naturally aspirated supercar sharing heart with Huracán.',
        specs: { hp: 602, engine: '5.2L Naturally Aspirated V10', topSpeedMph: 205, zeroToSixtySec: 3.1, estValue: '$180,000', productionUnits: 'Halo sports car' }
      },
      {
        name: 'RS6 Avant Performance',
        defaultRarity: 'common',
        variants: ['RS6 GT Edition', 'Dynamic Plus Package'],
        rarityReason: 'Ultimate family super-wagon loved by car enthusiasts everywhere.',
        specs: { hp: 621, engine: '4.0L Twin-Turbo V8 Mild Hybrid', topSpeedMph: 190, zeroToSixtySec: 3.3, estValue: '$135,000', productionUnits: 'Series production' }
      }
    ]
  },
  {
    name: 'Nissan',
    country: 'Japan',
    popular: false,
    models: [
      {
        name: 'GT-R50 by Italdesign',
        defaultRarity: 'legendary',
        variants: ['Bespoke Historic Color Scheme', 'Liquid Kinetic Blue'],
        rarityReason: 'Italdesign coachbuilt Godzilla celebration. Only 50 bespoke units in the world.',
        specs: { hp: 710, engine: '3.8L Twin-Turbo Nismo VR38DETT V6', topSpeedMph: 205, zeroToSixtySec: 2.6, estValue: '$1,100,000', productionUnits: '50 units worldwide' }
      },
      {
        name: 'GT-R Nismo (R35)',
        defaultRarity: 'epic',
        variants: ['Special Edition Clear-Coat Carbon Hood', 'N Attack Package'],
        rarityReason: 'Peak Japanese supercar engineering with GT3 race turbochargers and carbon brakes.',
        specs: { hp: 600, engine: '3.8L Twin-Turbo V6 (Hand Built)', topSpeedMph: 205, zeroToSixtySec: 2.7, estValue: '$225,000', productionUnits: 'Limited Nismo allocation' }
      },
      {
        name: 'Skyline GT-R (R34 V-Spec II)',
        defaultRarity: 'epic',
        variants: ['Midnight Purple III', 'Bayside Blue', 'Nür Spec'],
        rarityReason: 'The holy grail JDM icon with legendary RB26DETT and ATTESA E-TS Pro.',
        specs: { hp: 327, engine: '2.6L Twin-Turbo Inline-6 RB26', topSpeedMph: 165, zeroToSixtySec: 4.6, estValue: '$240,000', productionUnits: 'JDM Legend' }
      }
    ]
  },
  {
    name: 'Ford / Shelby',
    country: 'United States',
    popular: false,
    models: [
      {
        name: 'Ford GT (2nd Gen Carbon)',
        defaultRarity: 'legendary',
        variants: ['Heritage Edition Gulf Livery', 'Carbon Series', 'Alan Mann Edition', 'Liquid Red'],
        rarityReason: 'Le Mans winning carbon fiber tub supercar with flying buttresses. Strict application process.',
        specs: { hp: 660, engine: '3.5L Twin-Turbo EcoBoost V6', topSpeedMph: 216, zeroToSixtySec: 2.9, estValue: '$1,250,000', productionUnits: '1,350 total units' }
      },
      {
        name: 'Mustang GTD',
        defaultRarity: 'epic',
        variants: ['Carbon Series', 'Aero Package with DRS'],
        rarityReason: 'Street-legal GT3 race car targeting a sub-7 minute Nürburgring lap time. 800+ hp.',
        specs: { hp: 815, engine: '5.2L Supercharged V8 dry-sump', topSpeedMph: 202, zeroToSixtySec: 3.2, estValue: '$325,000', productionUnits: '~1,000 units' }
      }
    ]
  },
  {
    name: 'Chevrolet Corvette',
    country: 'United States',
    popular: false,
    models: [
      {
        name: 'Corvette ZR1 (C8)',
        defaultRarity: 'epic',
        variants: ['ZTK Track Performance Package', 'Convertible'],
        rarityReason: 'Most powerful factory American V8 ever built: 1,064 hp twin-turbo flat-plane crank LT7.',
        specs: { hp: 1064, engine: '5.5L Twin-Turbo Flat-Plane V8', topSpeedMph: 233, zeroToSixtySec: 2.3, estValue: '$180,000', productionUnits: 'Track weapon halo' }
      },
      {
        name: 'Corvette Z06 (C8)',
        defaultRarity: 'rare',
        variants: ['Z07 Performance Package', 'Carbon Aero'],
        rarityReason: 'Naturally aspirated 8,600 RPM flat-plane scream rivaling Italian exotics.',
        specs: { hp: 670, engine: '5.5L LT6 Naturally Aspirated V8', topSpeedMph: 195, zeroToSixtySec: 2.6, estValue: '$120,000', productionUnits: 'High performance serial' }
      }
    ]
  }
];

export const RARITY_CONFIG = {
  legendary: {
    label: 'Legendary',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    description: 'Hypercars & 1-of-few Holy Grail collector pieces (< 500 units worldwide).'
  },
  epic: {
    label: 'Epic',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/40',
    text: 'text-purple-400',
    badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dot: 'bg-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    description: 'Track-focused homologations, V12 flagships, and extreme aero halo cars.'
  },
  rare: {
    label: 'Rare',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dot: 'bg-cyan-400',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    description: 'Special division performance halo models, limited packages, and rare editions.'
  },
  common: {
    label: 'Common',
    bg: 'bg-zinc-700/10',
    border: 'border-zinc-700/40',
    text: 'text-zinc-400',
    badge: 'bg-zinc-800/60 text-zinc-300 border-zinc-700/40',
    dot: 'bg-zinc-400',
    glow: 'shadow-none',
    description: 'Regular series luxury and performance cars regularly spotted in urban centers.'
  }
} as const;

export function calculateAutoRarity(make: string, model: string, variant?: string): { rarity: RarityTier; reason: string; specs: CarSpecs } {
  const mfg = MANUFACTURER_CATALOG.find(m => m.name.toLowerCase() === make.toLowerCase());
  if (!mfg) {
    return {
      rarity: 'rare',
      reason: 'Bespoke custom vehicle entry.',
      specs: { hp: 500, estValue: '$150,000' }
    };
  }

  const modelEntry = mfg.models.find(m => m.name.toLowerCase() === model.toLowerCase());
  if (!modelEntry) {
    // If not found, guess based on manufacturer
    if (['Bugatti', 'Koenigsegg', 'Pagani'].includes(mfg.name)) {
      return {
        rarity: 'legendary',
        reason: `${mfg.name} hypercar tier: ultra-exclusive bespoke craftsmanship.`,
        specs: { hp: 1200, estValue: '$3,000,000' }
      };
    }
    return {
      rarity: 'rare',
      reason: `${mfg.name} performance series vehicle.`,
      specs: { hp: 500, estValue: '$120,000' }
    };
  }

  let finalRarity = modelEntry.defaultRarity;
  let finalReason = modelEntry.rarityReason;

  // Elevate if special variants are selected
  if (variant) {
    const vLower = variant.toLowerCase();
    if (vLower.includes('weissach') && finalRarity === 'rare') {
      finalRarity = 'epic';
      finalReason = `Upgraded to Epic: Weissach Package lightweight carbon aero edition. ${modelEntry.rarityReason}`;
    } else if (vLower.includes('gtr') || vLower.includes('mansory') || vLower.includes('lanzante') || vLower.includes('1 of') || vLower.includes('bespoke')) {
      if (finalRarity !== 'legendary') {
        finalRarity = finalRarity === 'common' ? 'rare' : 'epic';
        finalReason = `Elevated rarity due to ultra-exclusive bespoke variant (${variant}).`;
      }
    }
  }

  return {
    rarity: finalRarity,
    reason: finalReason,
    specs: modelEntry.specs
  };
}
