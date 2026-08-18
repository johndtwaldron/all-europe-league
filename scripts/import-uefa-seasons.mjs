import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const sources = {
  '2024-25': {
    UCL: 'https://www.uefa.com/uefachampionsleague/news/0290-1bbaa109447c-6dbed8c6fe14-1000/',
    UEL: 'https://www.uefa.com/uefaeuropaleague/news/0290-1bbc3ce94923-e3a70688bbdd-1000--europa-league-league-phase-draw-contenders-set-for-compet/',
    UECL: 'https://www.uefa.com/uefaconferenceleague/news/0290-1bbc58786450-9f803690829b-1000--conference-league-league-phase-draw-all-36-teams-learn-their-opponents/',
  },
  '2025-26': {
    UCL: 'https://www.uefa.com/uefachampionsleague/news/029c-1e92123f27d7-f1c1fabba5f1-1000--champions-league-league-phase-draw-all-36-teams-learn-their/',
    UEL: 'https://www.uefa.com/uefaeuropaleague/news/029c-1e921c539af1-ca9dedf0bcf6-1000/',
    UECL: 'https://www.uefa.com/uefaconferenceleague/news/029c-1e92246e7a6f-e273155cc9d3-1000--2025-26-conference-league-league-phase-draw-contenders-learn/',
  },
}

const aliases = {
  'B. Dortmund': 'Borussia Dortmund',
  Atleti: 'Atlético de Madrid',
  Paris: 'Paris Saint-Germain',
  Frankfurt: 'Eintracht Frankfurt',
  'Man City': 'Manchester City',
  'Union SG': 'Union Saint-Gilloise',
}

function decode(value) {
  return value
    .replaceAll(/<[^>]+>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .trim()
}

function slug(value) {
  return value.normalize('NFKD').replaceAll(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, '')
}

function extractTeams(html) {
  const marker = html.match(/Each team(?:'|’|&#39;)s league phase opponents/i)
  if (!marker) throw new Error('League-phase team marker not found')
  const article = html.slice(marker.index)
  const names = [...article.matchAll(/<pk-accordion-item-title[^>]*>(.*?)<\/pk-accordion-item-title>/g)]
    .map((match) => decode(match[1]))
    .filter(Boolean)
    .slice(0, 36)
    .map((name) => aliases[name] ?? name)
  return [...new Set(names)]
}

for (const [season, competitions] of Object.entries(sources)) {
  const clubs = []
  const provenance = []
  for (const [competition, url] of Object.entries(competitions)) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${season} ${competition}: HTTP ${response.status}`)
    const html = await response.text()
    const teams = extractTeams(html)
    if (teams.length !== 36) throw new Error(`${season} ${competition}: expected 36 clubs, extracted ${teams.length}`)
    teams.forEach((name) => clubs.push({ id: slug(name), name, sourceCompetition: competition, recordType: 'club' }))
    provenance.push({ competition, url, retrievedAt: new Date().toISOString() })
  }
  if (clubs.length !== 108) throw new Error(`${season}: expected 108 competition entries, extracted ${clubs.length}`)

  const dataset = {
    schemaVersion: 1,
    season: season.replace('-', '/'),
    status: 'historical-complete',
    fieldDefinition: 'Actual UEFA league-phase participants',
    entryCount: clubs.length,
    uniqueClubCount: new Set(clubs.map((club) => club.id)).size,
    provenance,
    entries: clubs,
  }
  const outputDirectory = path.resolve('public/data/seasons')
  await mkdir(outputDirectory, { recursive: true })
  await writeFile(path.join(outputDirectory, `${season}.json`), `${JSON.stringify(dataset, null, 2)}\n`)
  console.log(`${season}: ${clubs.length} entries, ${dataset.uniqueClubCount} unique clubs`)
}

const provisionalSources = {
  UCL: 'https://www.uefa.com/uefachampionsleague/news/02a6-20d57cfcd03e-407c22a7f465-1000--2026-27-champions-league-teams-dates-draws-format-final/',
  UEL: 'https://www.uefa.com/uefaeuropaleague/news/02a6-20d57d095740-e1e0b3de85df-1000--2026-27-europa-league-teams-dates-draws-format-final/',
  UECL: 'https://www.uefa.com/uefaconferenceleague/news/02a6-20e5e911587f-cc10425958b3-1000--conference-league-qualifying-fixtures-dates-how-it-works/',
}
const provisionalEntries = Object.entries(provisionalSources).flatMap(([competition]) =>
  Array.from({ length: 36 }, (_, index) => ({
    id: `${competition.toLowerCase()}-slot-${String(index + 1).padStart(2, '0')}`,
    name: `${competition} qualifying slot ${index + 1}`,
    sourceCompetition: competition,
    recordType: 'slot',
    resolutionStatus: 'unresolved',
  })),
)
const provisionalDataset = {
  schemaVersion: 1,
  season: '2026/27',
  status: 'live-provisional',
  fieldDefinition: 'Provisional UEFA league-phase slots pending completion of qualifying',
  entryCount: 108,
  uniqueClubCount: 0,
  provenance: Object.entries(provisionalSources).map(([competition, url]) => ({ competition, url, retrievedAt: new Date().toISOString() })),
  entries: provisionalEntries,
}
await writeFile(path.resolve('public/data/seasons/2026-27.json'), `${JSON.stringify(provisionalDataset, null, 2)}\n`)
console.log('2026-27: 108 typed provisional slots')
