import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const pages = {
  UCL: 'https://www.uefa.com/uefachampionsleague/clubs/',
  UEL: 'https://www.uefa.com/uefaeuropaleague/clubs/',
  UECL: 'https://www.uefa.com/uefaconferenceleague/clubs/',
}

const confirmed = {
  UCL: ['Arsenal','Aston Villa','Atleti','B. Dortmund','Barcelona','Bayern München','Club Brugge','Como','Feyenoord','Galatasaray','Inter','Leipzig','Lens','Lille','Liverpool','Man City','Man Utd','Napoli','Paris','Porto','PSV','Real Betis','Real Madrid','Roma','Shakhtar','Slavia Praha','Sporting CP','Stuttgart','Villarreal'],
  UEL: ['AZ Alkmaar','Bournemouth','Celta','Crystal Palace','Hoffenheim','Juventus','Leverkusen','Marseille','Milan','Olympiacos','Real Sociedad','Rennes','Sparta Praha','Sturm Graz','Sunderland','Torreense','Union SG'],
}

const uclPlayoffs = [
  ['Levski Sofia','AEK Athens'], ['GNK Dinamo','Viking'], ['Fenerbahçe','Lyon'],
  ['H. Beer-Sheva','Sabah'], ['Celtic','LASK'], ['S. Bratislava','Celje'], ['N.E.C.','Bodø/Glimt'],
]
const uelPlayoffs = [
  ['Kairat Almaty','Anderlecht'], ['Jagiellonia','Iberia Tbilisi'], ['Mjällby','Salzburg'],
  ['Trabzonspor','Ferencváros'], ['U. Craiova','Ararat-Armenia'], ['Egnatia','Lillestrøm'],
  ['Beşiktaş','Kauno Žalgiris'], ['Lech Poznań','Thun'], ['Sint-Truidense','Omonia'],
  ['Crvena Zvezda','Viktoria Plzeň'], ['OFI Crete','CSKA Sofia'], ['Benfica','Aarhus'],
]
const ueclPlayoffs = [
  ['L. Red Imps','Larne'], ['Klaksvík','Riga'], ['Víkingur R.','Borac'], ['Drita','Inter Escaldes'],
  ['Shamrock Rovers','KuPS Kuopio'], ['Inter Turku','Copenhagen'], ['Tromsø','Brighton'], ['Midtjylland','Rijeka'],
  ['Nordsjælland','St. Gallen'], ['PAOK','Brann'], ['Górnik Zabrze','Monaco'], ['Twente','Qarabağ'],
  ['Sion','Ajax'], ['Motherwell','Freiburg'], ['Gent','Hibernian'], ['Atalanta','H. Tel-Aviv'],
  ['Panathinaikos','Hradec Králové'], ['Lugano','M. Tel-Aviv'], ['Hearts','SK Rapid'], ['Rangers','Jablonec'],
  ['Hajduk Split','Raków'], ['Dinamo City','Pafos'], ['Braga','Austria Wien'], ['Getafe','Partizan'],
]

const aliases = {
  'Jagiellonia': 'Jagiellonia Białystok', 'H. Beer-Sheva': 'Hapoel Beer-Sheva', 'S. Bratislava': 'Slovan Bratislava',
  'U. Craiova': 'Universitatea Craiova', 'L. Red Imps': 'Lincoln Red Imps', 'Inter Escaldes': "Inter Club d'Escaldes",
  'Víkingur R.': 'Víkingur Reykjavík', 'H. Tel-Aviv': 'Hapoel Tel-Aviv', 'M. Tel-Aviv': 'Maccabi Tel-Aviv',
}
const slug = (value) => value.normalize('NFKD').replaceAll(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, '')
const badgeMap = new Map()
for (const url of Object.values(pages)) {
  const html = await (await fetch(url)).text()
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)]
  for (const block of blocks) {
    const data = JSON.parse(block[1])
    for (const team of data.competitor ?? []) {
      const id = team['@id']?.match(/\/clubs\/(\d+)--/)?.[1]
      if (id && team.name && team.logo) badgeMap.set(team.name, { uefaId: id, source: team.logo })
    }
  }
}

const crestDirectory = path.resolve('public/crests/uefa')
await mkdir(crestDirectory, { recursive: true })
const allNames = new Set([...confirmed.UCL, ...confirmed.UEL, ...uclPlayoffs.flat(), ...uelPlayoffs.flat(), ...ueclPlayoffs.flat()])
const identity = new Map()
for (const name of allNames) {
  const lookup = badgeMap.get(name) ?? badgeMap.get(aliases[name])
  if (!lookup) throw new Error(`No UEFA crest identity found for ${name}`)
  const file = `${lookup.uefaId}.png`
  const response = await fetch(lookup.source)
  if (!response.ok) throw new Error(`Unable to download crest for ${name}`)
  await writeFile(path.join(crestDirectory, file), Buffer.from(await response.arrayBuffer()))
  identity.set(name, { uefaId: lookup.uefaId, crestUrl: `crests/uefa/${file}` })
}

function club(name, competition) {
  const found = identity.get(name)
  return { id: slug(name), name, sourceCompetition: competition, recordType: 'club', crestUrl: found.crestUrl, uefaId: found.uefaId, qualificationLabel: '2025/26 domestic qualification · league phase confirmed', confirmed: true }
}
function pathEntry(pair, competition, route, index) {
  const candidates = pair.map((name) => ({ id: slug(name), name, crestUrl: identity.get(name).crestUrl, uefaId: identity.get(name).uefaId }))
  return { id: `${competition.toLowerCase()}-${slug(route)}-${String(index + 1).padStart(2, '0')}`, name: pair.join(' / '), sourceCompetition: competition, recordType: 'slot', resolutionStatus: 'unresolved', qualificationLabel: route, candidates, crestUrls: candidates.map((candidate) => candidate.crestUrl), crestUrl: candidates[0].crestUrl, confirmed: false }
}

const entries = [
  ...confirmed.UCL.map((name) => club(name, 'UCL')),
  ...uclPlayoffs.map((pair, index) => pathEntry(pair, 'UCL', 'UCL play-off', index)),
  ...confirmed.UEL.map((name) => club(name, 'UEL')),
  ...uelPlayoffs.map((pair, index) => pathEntry(pair, 'UEL', 'UEL play-off', index)),
  ...uclPlayoffs.map((pair, index) => pathEntry(pair, 'UEL', 'UCL loser → UEL', index)),
  ...ueclPlayoffs.map((pair, index) => pathEntry(pair, 'UECL', 'UECL play-off', index)),
  ...uelPlayoffs.map((pair, index) => pathEntry(pair, 'UECL', 'UEL loser → UECL', index)),
]
for (const competition of ['UCL','UEL','UECL']) {
  if (entries.filter((entry) => entry.sourceCompetition === competition).length !== 36) throw new Error(`${competition} snapshot is not 36 positions`)
}
const dataset = {
  schemaVersion: 2, season: '2026/27', status: 'live-provisional', snapshotAt: '2026-08-18',
  fieldDefinition: 'Named 2026/27 field snapshot after the 2025/26 domestic season; unresolved league-phase positions show the actual clubs contesting each route',
  entryCount: 108, uniqueClubCount: new Set(entries.flatMap((entry) => entry.candidates?.map((candidate) => candidate.id) ?? [entry.id])).size,
  provenance: Object.entries(pages).map(([competition, url]) => ({ competition, url, retrievedAt: new Date().toISOString() })), entries,
}
await writeFile(path.resolve('public/data/seasons/2026-27.json'), `${JSON.stringify(dataset, null, 2)}\n`)
console.log(`2026/27 snapshot: ${entries.length} positions, ${dataset.uniqueClubCount} named clubs, ${identity.size} cached crests`)
