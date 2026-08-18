import type { Standing } from './season'

export type KnockoutCompetition = 'UCL' | 'UEL' | 'UECL'
export type JanuaryRoute = 'direct' | 'final-playoff' | 'qualification' | 'wild-card'

export function destinationForRank(rank: number): KnockoutCompetition {
  if (rank < 1 || rank > 108) throw new RangeError('AEL rank must be from 1 to 108')
  return rank <= 36 ? 'UCL' : rank <= 72 ? 'UEL' : 'UECL'
}

export function januaryRouteForRank(rank: number): JanuaryRoute {
  const relative = (rank - 1) % 36 + 1
  if (relative <= 8) return 'direct'
  if (relative <= 16) return 'final-playoff'
  if (relative <= 28) return 'qualification'
  return 'wild-card'
}

export interface SeededTie { homeSeed: number; awaySeed?: number; home?: Standing; away?: Standing; awayLabel?: string }
export interface KnockoutPath { competition: KnockoutCompetition; clubs: Standing[]; wildCard: SeededTie[]; qualification: SeededTie[]; finalPlayoff: SeededTie[]; roundOf16: SeededTie[] }

export function buildKnockoutPath(standings: Standing[], competition: KnockoutCompetition): KnockoutPath {
  if (standings.length !== 108) throw new RangeError('AEL knockout paths require 108 final standings')
  const offset = competition === 'UCL' ? 0 : competition === 'UEL' ? 36 : 72
  const clubs = standings.slice(offset, offset + 36)
  const at = (seed: number) => clubs[seed - 1]
  const wildCard: SeededTie[] = [[29,36],[30,35],[31,34],[32,33]].map(([homeSeed, awaySeed]) => ({ homeSeed, awaySeed, home: at(homeSeed), away: at(awaySeed) }))
  const qualification: SeededTie[] = [
    ...[[21,28],[22,27],[23,26],[24,25]].map(([homeSeed, awaySeed]) => ({ homeSeed, awaySeed, home: at(homeSeed), away: at(awaySeed) })),
    ...[17,18,19,20].map((homeSeed, index) => ({ homeSeed, home: at(homeSeed), awayLabel: `Wild Card winner ${index + 1}` })),
  ]
  const finalPlayoff: SeededTie[] = Array.from({ length: 8 }, (_, index) => ({ homeSeed: index + 9, home: at(index + 9), awayLabel: `Qualification winner ${index + 1}` }))
  const roundOf16: SeededTie[] = Array.from({ length: 8 }, (_, index) => ({ homeSeed: index + 1, home: at(index + 1), awayLabel: `Final Play-off winner ${index + 1}` }))
  return { competition, clubs, wildCard, qualification, finalPlayoff, roundOf16 }
}
