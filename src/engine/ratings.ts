import type { ClubEntry, SlotEntry, SourceCompetition } from '../data/dataset'
import { hashSeed } from './random'

export type AelTier = 'A' | 'B' | 'C'

export interface RatedClub {
  id: string
  name: string
  sourceCompetition: SourceCompetition
  rating: number
  tier: AelTier
  provisional: boolean
}

const bases: Record<SourceCompetition, number> = { UCL: 84, UEL: 64, UECL: 44 }

export function assignProvisionalRatings(entries: Array<ClubEntry | SlotEntry>): RatedClub[] {
  if (entries.length !== 108) throw new RangeError('AEL tier assignment requires exactly 108 entries')
  const ordered = entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    sourceCompetition: entry.sourceCompetition,
    rating: bases[entry.sourceCompetition] + ((hashSeed(entry.id) % 801) / 100 - 4),
    tier: 'C' as AelTier,
    provisional: true,
  })).sort((left, right) => right.rating - left.rating || left.name.localeCompare(right.name))
  return ordered.map((club, index) => ({ ...club, tier: index < 36 ? 'A' : index < 72 ? 'B' : 'C' }))
}
