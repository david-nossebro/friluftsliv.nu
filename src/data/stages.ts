import type { StageDetail, MapPosition } from '@/types'

const KUNGSLEDEN_STAGE_1_TRACK: MapPosition[] = [
  { lat: 68.3530, lng: 18.8200 },
  { lat: 68.3000, lng: 18.8000 },
  { lat: 68.2400, lng: 18.7700 },
]

const KUNGSLEDEN_STAGE_2_TRACK: MapPosition[] = [
  { lat: 68.2400, lng: 18.7700 },
  { lat: 68.1700, lng: 18.7400 },
  { lat: 68.0900, lng: 18.7100 },
]

const KUNGSLEDEN_STAGE_3_TRACK: MapPosition[] = [
  { lat: 68.0900, lng: 18.7100 },
  { lat: 68.0100, lng: 18.6300 },
  { lat: 67.9500, lng: 18.5200 },
]

const KUNGSLEDEN_STAGE_4_TRACK: MapPosition[] = [
  { lat: 67.9500, lng: 18.5200 },
  { lat: 67.9000, lng: 18.5300 },
  { lat: 67.8500, lng: 18.5500 },
]

const KUNGSLEDEN_STAGE_5_TRACK: MapPosition[] = [
  { lat: 67.8500, lng: 18.5500 },
  { lat: 67.7900, lng: 18.5300 },
  { lat: 67.7300, lng: 18.6100 },
  { lat: 67.6800, lng: 18.7600 },
]

const KUNGSLEDEN_STAGE_6_TRACK: MapPosition[] = [
  { lat: 67.6800, lng: 18.7600 },
  { lat: 67.7050, lng: 18.9100 },
  { lat: 67.8500, lng: 19.0500 },
]

export const stages: StageDetail[] = [
  {
    id: 'kungsleden-etapp-1-abisko-abiskojaure',
    longHikeId: 'kungsleden-abisko-nikkaluokta',
    stageNumber: 1,
    title: 'Etapp 1 — Abisko till Abiskojaure',
    summary:
      'En mjuk start på leden genom björkskog och öppna dalgångar. Du kommer snabbt in i fjällrytmen utan att dagen blir alltför lång.',
    startLocation: 'Abisko Turiststation',
    endLocation: 'Abiskojaure',
    region: 'Norrbotten, Lappland',
    activityType: 'vandring',
    distance: 15,
    elevation: 250,
    duration: 360,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=70&auto=format',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=70&auto=format',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=70&auto=format',
    ],
    description:
      'Första etappen från Abisko Turiststation är lätt att följa och ger dig en trygg övergång från vardag till fjäll. Du går genom gles björkskog, över spänger och förbi jokkar innan landskapet öppnar sig mot Abiskojaure. Det här är en bra dag att hitta tempo, justera packningen och landa i leden.',
    startPoint:
      'Starta vid STF Abisko Turiststation. Följ Kungsledens tydliga markeringar söderut från stationen.',
    season:
      'Mitten av juni till slutet av september. Tidigt på säsongen kan partier vara blöta efter snösmältning.',
    tips: [
      'Lämna gärna Abisko tidigt så får du en lugn första dag.',
      'Fyll på vatten längs vägen, men ha alltid med en egen flaska i lätt åtkomlig ficka.',
      'Abiskojaure är en bra plats att testa kvällsrutiner innan längre etapper väntar.',
    ],
    accessByCar: 'Parkering finns vid Abisko Turiststation.',
    accessByTransport: 'Nattåg från Stockholm eller buss från Kiruna till Abisko Turiststation.',
    coordinates: { lat: 68.3530, lng: 18.8200 },
    endCoordinates: { lat: 68.2400, lng: 18.7700 },
    gpxTrack: KUNGSLEDEN_STAGE_1_TRACK,
  },
  {
    id: 'kungsleden-etapp-2-abiskojaure-alesjaure',
    longHikeId: 'kungsleden-abisko-nikkaluokta',
    stageNumber: 2,
    title: 'Etapp 2 — Abiskojaure till Alesjaure',
    summary:
      'Leden blir större och öppnare. Du går längre i högfjällsnära terräng med breda vyer och en tydlig känsla av att lämna skogen bakom dig.',
    startLocation: 'Abiskojaure',
    endLocation: 'Alesjaure',
    region: 'Norrbotten, Lappland',
    activityType: 'vandring',
    distance: 21,
    elevation: 350,
    duration: 510,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=70&auto=format',
    description:
      'Mellan Abiskojaure och Alesjaure blir Kungsleden luftigare. Fjällbjörken glesnar och du får mer himmel, mer vind och längre siktlinjer. Det är en dag som ofta känns längre än siffrorna säger, så ta pauser och håll ett jämnt tempo.',
    startPoint: 'Utgå från STF Abiskojaure och följ leden söderut längs dalgången.',
    season:
      'Mitten av juni till september. Vind och regn märks tydligare här än på första etappen.',
    tips: [
      'Räkna med en längre dag och fyll på snacks där du lätt kommer åt dem.',
      'Ta vindjackan nära till hands även om morgonen känns stilla.',
      'Planera in en längre lunchpaus innan de sista kilometrarna mot Alesjaure.',
    ],
    coordinates: { lat: 68.2400, lng: 18.7700 },
    endCoordinates: { lat: 68.0900, lng: 18.7100 },
    gpxTrack: KUNGSLEDEN_STAGE_2_TRACK,
  },
  {
    id: 'kungsleden-etapp-3-alesjaure-tjaktja',
    longHikeId: 'kungsleden-abisko-nikkaluokta',
    stageNumber: 3,
    title: 'Etapp 3 — Alesjaure till Tjäktja',
    summary:
      'En fjällnära dag med tydlig riktning mot högre mark. Terrängen känns kargare och leden blir mer väderutsatt.',
    startLocation: 'Alesjaure',
    endLocation: 'Tjäktja',
    region: 'Norrbotten, Lappland',
    activityType: 'vandring',
    distance: 13,
    elevation: 420,
    duration: 330,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=70&auto=format',
    description:
      'Den här etappen är kortare men mer samlad i sin ansträngning. Du vinner höjd och rör dig genom ett öppnare, stenigare landskap där väder och vind får större betydelse. Tjäktja är en bra plats att samla kraft inför passagen över Tjäktjapasset nästa dag.',
    startPoint: 'Börja från STF Alesjaure och följ leden söderut upp genom dalen.',
    season:
      'Juni till september. Kyligare temperaturer och hårdare vindar är vanliga även mitt i sommaren.',
    tips: [
      'Ha torra förstärkningsplagg överst i packningen.',
      'Den kortare distansen gör etappen bra för återhämtning om gårdagen var tung.',
      'Kolla väderprognosen för passet innan du går och igen när du kommer fram.',
    ],
    coordinates: { lat: 68.0900, lng: 18.7100 },
    endCoordinates: { lat: 67.9500, lng: 18.5200 },
    gpxTrack: KUNGSLEDEN_STAGE_3_TRACK,
  },
  {
    id: 'kungsleden-etapp-4-tjaktja-salka',
    longHikeId: 'kungsleden-abisko-nikkaluokta',
    stageNumber: 4,
    title: 'Etapp 4 — Tjäktja till Sälka',
    summary:
      'Du passerar Tjäktjapasset, ledens högsta punkt på den här sträckan. Sedan öppnar leden sig ned mot Sälka.',
    startLocation: 'Tjäktja',
    endLocation: 'Sälka',
    region: 'Norrbotten, Lappland',
    activityType: 'vandring',
    distance: 12,
    elevation: 180,
    duration: 300,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=70&auto=format',
    description:
      'Dagens höjdpunkt är bokstavlig: du går över Tjäktjapasset och får en av de klassiska utsikterna längs norra Kungsleden. Efter passet känns leden mer utför och mjukare, men underlaget kräver fortfarande uppmärksamhet. Sälka blir en tydlig vilopunkt efter en dag som många minns länge.',
    startPoint: 'Gå ut från Tjäktja tidigt om prognosen visar hård vind över passet.',
    season:
      'Juni till september. Tidigt på säsongen kan snöfält ligga kvar i anslutning till passet.',
    tips: [
      'Håll koll på vind och sikt innan du lämnar Tjäktja.',
      'Ta det lugnt i steniga partier även när leden går utför.',
      'Unna dig en längre paus när du kommit ner från passet och tempot sjunker.',
    ],
    coordinates: { lat: 67.9500, lng: 18.5200 },
    endCoordinates: { lat: 67.8500, lng: 18.5500 },
    gpxTrack: KUNGSLEDEN_STAGE_4_TRACK,
  },
  {
    id: 'kungsleden-etapp-5-salka-kebnekaise',
    longHikeId: 'kungsleden-abisko-nikkaluokta',
    stageNumber: 5,
    title: 'Etapp 5 — Sälka till Kebnekaise fjällstation',
    summary:
      'En längre etapp där du går via Singi och vidare mot fjällstationen. Dagen är varierad och kräver tålamod i steget.',
    startLocation: 'Sälka',
    endLocation: 'Kebnekaise fjällstation',
    region: 'Norrbotten, Lappland',
    activityType: 'vandring',
    distance: 27,
    elevation: 350,
    duration: 630,
    difficulty: 'hard',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=70&auto=format',
    description:
      'Från Sälka går du först mot Singi och viker sedan av mot Kebnekaise fjällstation. Det här är en dag där distansen märks. Samtidigt känns den ofta social, eftersom fler möts och leden närmar sig en av fjällvärldens mest välkända knutpunkter.',
    startPoint: 'Starta från STF Sälka och följ leden mot Singi innan du tar av mot Kebnekaise.',
    season:
      'Juli till september är oftast enklast. Tidigare på sommaren kan vattendrag och blöta partier göra dagen lång.',
    tips: [
      'Dela upp dagen i tydliga delmål så känns den längre sträckan mer hanterbar.',
      'Fyll på vatten innan du lämnar stugan och igen när du får bra tillfälle.',
      'Boka plats på fjällstationen i förväg om du vill ha ett bekvämt avslut på dagen.',
    ],
    coordinates: { lat: 67.8500, lng: 18.5500 },
    endCoordinates: { lat: 67.6800, lng: 18.7600 },
    gpxTrack: KUNGSLEDEN_STAGE_5_TRACK,
  },
  {
    id: 'kungsleden-etapp-6-kebnekaise-nikkaluokta',
    longHikeId: 'kungsleden-abisko-nikkaluokta',
    stageNumber: 6,
    title: 'Etapp 6 — Kebnekaise fjällstation till Nikkaluokta',
    summary:
      'Sista dagen är lättare att orientera på men känns i benen. Du avslutar turen i ett mer tillgängligt landskap med tydlig väg hem.',
    startLocation: 'Kebnekaise fjällstation',
    endLocation: 'Nikkaluokta',
    region: 'Norrbotten, Lappland',
    activityType: 'vandring',
    distance: 19,
    elevation: 150,
    duration: 390,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=70&auto=format',
    description:
      'Avslutningen mot Nikkaluokta är tydlig, välgången och emotionell på sitt eget sätt. Många går snabbare än de tänkt, men det är värt att stanna upp en sista gång och se tillbaka mot fjällen. Här går Kungsleden över i hemresa och vila.',
    startPoint: 'Lämna Kebnekaise fjällstation mot Nikkaluokta. Följ leden och skyltningen österut.',
    season:
      'Juni till september. Vid högsäsong kan båtalternativet över Ladtjojaure korta dagen något.',
    tips: [
      'Spara lite energi till slutet, även om etappen känns enklare på papperet.',
      'Om båten går kan du välja ett kortare avslut från Ladtjojaure.',
      'Kolla busstider från Nikkaluokta redan dagen innan så slipper du stress sista dagen.',
    ],
    accessByCar: 'Parkering finns i Nikkaluokta om du börjar turen med transfer tillbaka till Abisko.',
    accessByTransport: 'Sommarbuss går mellan Nikkaluokta och Kiruna.',
    coordinates: { lat: 67.6800, lng: 18.7600 },
    endCoordinates: { lat: 67.8500, lng: 19.0500 },
    gpxTrack: KUNGSLEDEN_STAGE_6_TRACK,
  },
]
