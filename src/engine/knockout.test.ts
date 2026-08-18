import { describe, expect, it } from 'vitest'
import { buildKnockoutPath, destinationForRank, januaryRouteForRank } from './knockout'
import type { Standing } from './season'

const standings = Array.from({ length: 108 }, (_, index) => ({ club: { id: `club-${index + 1}`, name: `Club ${index + 1}`, sourceCompetition: 'UCL', rating: 108 - index, tier: index < 36 ? 'A' : index < 72 ? 'B' : 'C', provisional: true }, played: 8, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 })) as Standing[]

describe('January knockout paths', () => {
  it('maps all 108 ranks to destination and difficulty strata', () => {
    expect(destinationForRank(1)).toBe('UCL'); expect(destinationForRank(37)).toBe('UEL'); expect(destinationForRank(73)).toBe('UECL')
    expect([1,37,73].map(januaryRouteForRank)).toEqual(['direct','direct','direct'])
    expect([9,45,81].map(januaryRouteForRank)).toEqual(['final-playoff','final-playoff','final-playoff'])
    expect([17,53,89].map(januaryRouteForRank)).toEqual(['qualification','qualification','qualification'])
    expect([29,65,101].map(januaryRouteForRank)).toEqual(['wild-card','wild-card','wild-card'])
  })

  it('builds the same 4-8-8-8 branch for every competition', () => {
    for (const competition of ['UCL','UEL','UECL'] as const) {
      const path = buildKnockoutPath(standings, competition)
      expect(path.clubs).toHaveLength(36); expect(path.wildCard).toHaveLength(4); expect(path.qualification).toHaveLength(8); expect(path.finalPlayoff).toHaveLength(8); expect(path.roundOf16).toHaveLength(8)
    }
  })
})
