import type { Area } from '@/types'

export const areas: Area[] = [
  {
    id: 'abisko',
    title: 'Abisko nationalpark',
    kind: 'nationalpark',
    region: 'Norrbotten, Lappland',
    summary: 'Porten till fjällvandring i norr, med lättillgängliga leder, fjällbjörkskog och vida vyer.',
    description:
      'Abisko är en av Sveriges mest lättillgängliga nationalparker och en naturlig startpunkt för många fjällturer. Här möts du av fjällbjörkskog, öppna dalgångar och leder som fungerar både för första fjällvandringen och för längre turer söderut.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=70&auto=format',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=70&auto=format',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70&auto=format',
    ],
    landskap: ['lappland'],
    kommun: ['Kiruna'],
    coordinates: { lat: 68.3530, lng: 18.8200 },
  },
  {
    id: 'soderasen',
    title: 'Söderåsens nationalpark',
    kind: 'nationalpark',
    region: 'Skåne län',
    summary: 'Bokskog, sprickdalar och lättillgängliga turer för dig som vill ut i sydsvensk natur.',
    description:
      'Söderåsen är ett av Skånes mest omtyckta naturområden. Här väntar bokskog, raviner och utsiktspunkter som är lätta att nå för både dagsvandrare och familjer. Naturum och markerade leder gör området enkelt att börja i.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=70&auto=format',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=70&auto=format',
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=70&auto=format',
    ],
    landskap: ['skane'],
    kommun: ['Klippan', 'Svalöv'],
    coordinates: { lat: 56.0420, lng: 13.2380 },
  },
  {
    id: 'tyresta',
    title: 'Tyresta nationalpark',
    kind: 'nationalpark',
    region: 'Stockholms län',
    summary: 'Gammelskog och tystnad nära storstaden, med leder som passar för lugna dagsturer.',
    description:
      'Tyresta är ett ovanligt vildmarksnära område så nära Stockholm. Här går du genom gammal tallskog, förbi små sjöar och över myrmarker utan att behöva resa långt. Det är en trygg plats att börja i om du vill ha naturkänsla utan krånglig logistik.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=70&auto=format',
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=70&auto=format',
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=70&auto=format',
    ],
    landskap: ['sodermanland'],
    kommun: ['Tyresö', 'Haninge'],
    coordinates: { lat: 59.1670, lng: 18.2780 },
  },
  {
    id: 'padjelanta',
    title: 'Padjelanta nationalpark',
    kind: 'nationalpark',
    region: 'Norrbotten, Lappland',
    summary: 'Vidsträckta fjällhedar, stora sjöar och långa etapper för dig som söker lugn och rymd.',
    description:
      'Padjelanta är Sveriges största nationalpark och bjuder på öppna fjällhedar, glaciärälvar och stillhet över långa avstånd. Området passar dig som vill vandra flera dagar och bära med dig det mesta du behöver.',
    imageUrl: 'https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=800&q=70&auto=format',
    images: [
      'https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=800&q=70&auto=format',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=70&auto=format',
    ],
    landskap: ['lappland'],
    kommun: ['Jokkmokk', 'Gällivare'],
    coordinates: { lat: 67.4050, lng: 17.4450 },
  },
  {
    id: 'nackareservatet',
    title: 'Nackareservatet',
    kind: 'naturreservat',
    region: 'Stockholms län',
    summary: 'Ett lättillgängligt naturreservat med skog, sjöar och leder direkt från tunnelbanan.',
    description:
      'Nackareservatet är ett enkelt sätt att komma ut i naturen utan lång resa. Här finns badsjöar, motionsspår och markerade leder som passar bra för en halvdag eller heldag i skogen. Området är särskilt bra för dig som vill kombinera kollektivtrafik med en lugn vandring.',
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=70&auto=format',
    landskap: ['sodermanland'],
    kommun: ['Nacka'],
    coordinates: { lat: 59.2870, lng: 18.1240 },
  },
  {
    id: 'erstavik',
    title: 'Erstaviks naturreservat',
    kind: 'naturreservat',
    region: 'Stockholms län',
    summary: 'Öppna marker och skog nära stan, med leder som känns längre än resan dit.',
    description:
      'Erstavik ligger nära Stockholm men bjuder på ett lugn som känns långt från vardagen. Här rör du dig mellan skog, öppna marker och småsjöar. Reservatet passar bra för dagsvandring och för dig som vill avsluta turen nära kollektivtrafik.',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=70&auto=format',
    landskap: ['sodermanland'],
    kommun: ['Nacka'],
    coordinates: { lat: 59.2320, lng: 18.2710 },
  },
  {
    id: 'dalslands-kanal',
    title: 'Dalslands kanal',
    kind: 'naturreservat',
    region: 'Dalsland',
    summary: 'Skyddade vatten, slussar och stilla etapper för paddling i lugnt tempo.',
    description:
      'Dalslands kanal är ett område där paddling och naturupplevelse går hand i hand. Här rör du dig genom sjöar, smala sund och gamla kanalavsnitt i en miljö som är lätt att läsa även för dig som inte paddlat många längre turer tidigare.',
    imageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=70&auto=format',
    landskap: ['dalsland'],
    kommun: ['Bengtsfors', 'Mellerud'],
    coordinates: { lat: 59.0290, lng: 12.2320 },
  },
]
