import type { Landskap } from '@/types'

/**
 * Kommun lookup grouped by landskap. Not exhaustive of all 290 kommun — covers
 * the kommuner referenced by seed data plus the most populous in each landskap.
 * Expand as more entries are added.
 */
export const KOMMUN_BY_LANDSKAP: Record<Landskap, readonly string[]> = {
  skane: [
    'Malmö', 'Lund', 'Helsingborg', 'Kristianstad', 'Hässleholm', 'Klippan',
    'Svalöv', 'Trelleborg', 'Ystad', 'Ängelholm', 'Båstad',
  ],
  blekinge: ['Karlskrona', 'Karlshamn', 'Ronneby', 'Olofström', 'Sölvesborg'],
  halland: ['Halmstad', 'Varberg', 'Falkenberg', 'Kungsbacka', 'Laholm', 'Hylte'],
  smaland: [
    'Växjö', 'Jönköping', 'Kalmar', 'Värnamo', 'Vetlanda', 'Eksjö',
    'Nybro', 'Oskarshamn', 'Västervik',
  ],
  oland: ['Borgholm', 'Mörbylånga'],
  gotland: ['Gotland'],
  vastergotland: [
    'Göteborg', 'Borås', 'Skövde', 'Trollhättan', 'Lidköping', 'Alingsås',
    'Mariestad', 'Vänersborg', 'Falköping', 'Ulricehamn',
  ],
  bohuslan: ['Strömstad', 'Tanum', 'Munkedal', 'Sotenäs', 'Lysekil', 'Uddevalla', 'Orust', 'Tjörn'],
  dalsland: ['Bengtsfors', 'Mellerud', 'Åmål', 'Dals-Ed', 'Färgelanda'],
  ostergotland: ['Linköping', 'Norrköping', 'Motala', 'Mjölby', 'Söderköping', 'Finspång', 'Valdemarsvik'],
  sodermanland: [
    'Stockholm', 'Nacka', 'Tyresö', 'Huddinge', 'Botkyrka', 'Haninge',
    'Södertälje', 'Nyköping', 'Eskilstuna', 'Strängnäs', 'Katrineholm', 'Trosa',
  ],
  narke: ['Örebro', 'Kumla', 'Hallsberg', 'Askersund', 'Lekeberg', 'Laxå', 'Nora'],
  vastmanland: ['Västerås', 'Köping', 'Sala', 'Fagersta', 'Arboga', 'Hallstahammar', 'Norberg'],
  uppland: ['Uppsala', 'Enköping', 'Tierp', 'Östhammar', 'Älvkarleby', 'Knivsta', 'Heby', 'Norrtälje'],
  varmland: ['Karlstad', 'Arvika', 'Kristinehamn', 'Sunne', 'Torsby', 'Hagfors', 'Filipstad', 'Säffle'],
  dalarna: [
    'Falun', 'Borlänge', 'Mora', 'Leksand', 'Avesta', 'Ludvika', 'Rättvik',
    'Sälen', 'Älvdalen', 'Malung-Sälen', 'Vansbro', 'Orsa',
  ],
  gastrikland: ['Gävle', 'Sandviken', 'Hofors', 'Ockelbo'],
  halsingland: ['Hudiksvall', 'Söderhamn', 'Bollnäs', 'Ljusdal', 'Nordanstig'],
  medelpad: ['Sundsvall', 'Timrå', 'Ånge'],
  angermanland: ['Härnösand', 'Sollefteå', 'Kramfors', 'Örnsköldsvik'],
  jamtland: ['Östersund', 'Åre', 'Berg', 'Krokom', 'Ragunda', 'Strömsund', 'Bräcke'],
  harjedalen: ['Härjedalen'],
  vasterbotten: ['Umeå', 'Skellefteå', 'Lycksele', 'Vilhelmina', 'Storuman', 'Vännäs', 'Robertsfors'],
  norrbotten: [
    'Luleå', 'Piteå', 'Boden', 'Kiruna', 'Gällivare', 'Älvsbyn',
    'Haparanda', 'Kalix', 'Övertorneå', 'Pajala', 'Jokkmokk', 'Arjeplog',
  ],
  lappland: ['Kiruna', 'Gällivare', 'Jokkmokk', 'Arjeplog', 'Sorsele', 'Storuman', 'Vilhelmina'],
}

/** Return kommun list for the given landskap selection (deduplicated, sorted). */
export function getKommunForLandskap(landskap: readonly import('@/types').Landskap[]): string[] {
  const set = new Set<string>()
  for (const l of landskap) {
    for (const k of KOMMUN_BY_LANDSKAP[l]) set.add(k)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'sv'))
}
