export type SourceCompetition = 'UCL' | 'UEL' | 'UECL'

export interface ClubEntry {
  id: string
  name: string
  sourceCompetition: SourceCompetition
  recordType: 'club'
}

export interface SlotEntry {
  id: string
  name: string
  sourceCompetition: SourceCompetition
  recordType: 'slot'
  resolutionStatus: 'unresolved'
}

export interface SeasonManifest {
  schemaVersion: 1
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
  if (manifest.schemaVersion !== 1 || manifest.entryCount !== 108 || manifest.entries.length !== 108) {
    throw new Error(`${id} season data failed validation`)
  }
  return manifest
}
