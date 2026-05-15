import type { LongHike, MapPosition } from '@/types'

const KUNGSLEDEN_TRACK: MapPosition[] = [
  { lat: 68.3530, lng: 18.8200, ele: 380 },
  { lat: 68.2400, lng: 18.7700, ele: 470 },
  { lat: 68.0900, lng: 18.7100, ele: 720 },
  { lat: 67.9500, lng: 18.5200, ele: 1140 },
  { lat: 67.8500, lng: 18.5500, ele: 850 },
  { lat: 67.7900, lng: 18.5300, ele: 720 },
  { lat: 67.7300, lng: 18.6100, ele: 650 },
  { lat: 67.6800, lng: 18.7600, ele: 700 },
  { lat: 67.7050, lng: 18.9100, ele: 530 },
  { lat: 67.8500, lng: 19.0500, ele: 460 },
]

export const longHikes: LongHike[] = [
  {
    id: 'kungsleden-abisko-nikkaluokta',
    title: 'Kungsleden — Abisko till Nikkaluokta',
    region: 'Norrbotten, Lappland',
    summary:
      'En klassisk långvandring genom öppen fjällterräng, med stugor ungefär en dagsetapp från varandra och tydliga delmål längs vägen.',
    description:
      'Den här sträckan av Kungsleden passar dig som vill göra en riktig flerdagarsvandring utan att allt behöver kännas avancerat från start. Du går från Abiskos björkskogar mot öppnare fjällhedar, över Tjäktjapasset och vidare mot Kebnekaisemassivet innan leden avslutas i Nikkaluokta. Tempot blir lugnt och naturligt när du delar upp leden i etapper med tydliga nattstopp.',
    distance: 107,
    elevation: 1700,
    duration: 2520,
    estimatedDays: 6,
    difficulty: 'hard',
    stageIds: [
      'kungsleden-etapp-1-abisko-abiskojaure',
      'kungsleden-etapp-2-abiskojaure-alesjaure',
      'kungsleden-etapp-3-alesjaure-tjaktja',
      'kungsleden-etapp-4-tjaktja-salka',
      'kungsleden-etapp-5-salka-kebnekaise',
      'kungsleden-etapp-6-kebnekaise-nikkaluokta',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=70&auto=format',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70&auto=format',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=70&auto=format',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=70&auto=format',
    ],
    season:
      'Mitten av juni till slutet av september. Snöfält kan ligga kvar tidigt på säsongen och vädret skiftar snabbt.',
    tips: [
      'Planera dagarna utifrån hur du vill bo och hur långt du vill bära mat.',
      'Lägg in lite marginal om du vill kunna vänta ut hårt väder vid pass eller längre etapper.',
      'Kontrollera båttider och bussförbindelser innan du går så blir avslutet lugnare.',
    ],
    terrain:
      'Du går genom fjällbjörkskog, över öppna hedar, på stenigare passpartier och längs breda dalgångar. Underlaget varierar mellan lättvandrade stigar, spänger och mer ojämna avsnitt.',
    waymarking:
      'Leden är väl markerad och lätt att följa i normala sommarförhållanden, men dimma och hård vind gör att du ändå behöver karta och trygg orienteringsvana.',
    overnight:
      'Stugor och fjällstationer ligger med ungefär en dags mellanrum på den här sträckan. Det gör leden lätt att dela upp i tydliga etapper utan att varje dag behöver bli ett stort beslut.',
    startPoint: 'Abisko Turiststation',
    endPoint: 'Nikkaluokta',
    accessByCar:
      'Du kan parkera i Abisko eller Nikkaluokta. Många väljer att börja i Abisko och lösa transfer eller buss från Nikkaluokta tillbaka mot Kiruna.',
    accessByTransport:
      'Nattåg går till Abisko och sommarbuss går från Nikkaluokta till Kiruna. Det gör leden ovanligt enkel att nå utan egen bil.',
    gpxTrack: KUNGSLEDEN_TRACK,
    coordinates: { lat: 68.3530, lng: 18.8200 },
    endCoordinates: { lat: 67.8500, lng: 19.0500 },
  },
]
