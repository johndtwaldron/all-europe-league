import { describe, expect, it } from 'vitest'
import { generateSchedule } from './fixtures'
import { assignProvisionalRatings } from './ratings'
import type { ClubEntry, SourceCompetition } from '../data/dataset'

const entries: ClubEntry[] = (['UCL','UEL','UECL'] as SourceCompetition[]).flatMap((competition) => Array.from({ length: 36 }, (_, index) => ({ id: `${competition}-${index}`, name: `${competition} ${index}`, sourceCompetition: competition, recordType: 'club' })))

describe('AEL fixture generation', () => {
  const clubs = assignProvisionalRatings(entries)
  const schedule = generateSchedule(clubs, 260826)

  it('creates eight matchweeks and exactly 378 matches', () => {
    expect(schedule.matchweeks).toHaveLength(8)
    expect(schedule.matchweeks.flat()).toHaveLength(378)
  })

  it('gives tiers eight, seven and six appearances respectively', () => {
    const appearances = new Map<string, number>()
    schedule.matchweeks.flat().forEach(({ home, away }) => { appearances.set(home.id, (appearances.get(home.id) ?? 0) + 1); appearances.set(away.id, (appearances.get(away.id) ?? 0) + 1) })
    clubs.forEach((club) => expect(appearances.get(club.id)).toBe(club.tier === 'A' ? 8 : club.tier === 'B' ? 7 : 6))
  })

  it('never repeats a pairing', () => {
    const pairs = schedule.matchweeks.flat().map(({ home, away }) => [home.id, away.id].sort().join('|'))
    expect(new Set(pairs).size).toBe(pairs.length)
  })

  it('is deterministic for the same seed', () => {
    expect(generateSchedule(clubs, 260826)).toEqual(schedule)
  })
})
