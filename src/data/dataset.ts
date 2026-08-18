export type SourceCompetition = 'UCL' | 'UEL' | 'UECL'

export interface ClubEntry {
  id: string
  name: string
  sourceCompetition: SourceCompetition
  recordType: 'club'
  crestUrl?: string
  uefaId?: string
  qualificationLabel?: string
  confirmed?: boolean
}

export interface SlotEntry {
  id: string
  name: string
  sourceCompetition: SourceCompetition
  recordType: 'slot'
  resolutionStatus: 'unresolved'
  crestUrl?: string
  crestUrls?: string[]
  uefaId?: string
  qualificationLabel?: string
  confirmed?: boolean
  candidates?: Array<{ id: string; name: string; crestUrl: string; uefaId?: string }>
}

export interface SeasonManifest {
  schemaVersion: 1 | 2
  snapshotAt?: string
  season: string
  status: 'historical-complete' | 'live-provisional'
  fieldDefinition: string
  entryCount: number
  uniqueClubCount: number
  provenance: Array<{ competition: SourceCompetition; url: string; retrievedAt: string }>
  entries: Array<ClubEntry | SlotEntry>
}

export async function loadSeasonManifest(id: string, signal?: AbortSignal): Promise<SeasonManifest> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/seasons/${id}.json`, { signal })
  if (!response.ok) throw new Error(`Unable to load ${id} season data`)
  const manifest = await response.json() as SeasonManifest
  if (![1, 2].includes(manifest.schemaVersion) || manifest.entryCount !== 108 || manifest.entries.length !== 108) {
    throw new Error(`${id} season data failed validation`)
  }
  return manifest
}
