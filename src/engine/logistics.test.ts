import { describe, expect, it } from 'vitest'
import type { ClubEntry, SourceCompetition } from '../data/dataset'
import { generateSchedule } from './fixtures'
import { validateLogistics } from './logistics'
import { assignProvisionalRatings } from './ratings'

const entries: ClubEntry[] = (['UCL','UEL','UECL'] as SourceCompetition[]).flatMap((competition) => Array.from({ length: 36 }, (_, index) => ({ id: `${competition}-${index}`, name: `${competition} ${index}`, sourceCompetition: competition, recordType: 'club' })))
const clubs = assignProvisionalRatings(entries)
const schedule = generateSchedule(clubs, 260826)

describe('AEL logistics gate', () => {
  it('accepts the generated calendar contract', () => expect(validateLogistics(schedule, clubs)).toEqual([]))
  it('rejects two fixtures at the same venue and slot', () => {
    const [first, second] = schedule.matchweeks[0]
    expect(validateLogistics(schedule, clubs, [
      { fixtureId: first.id, venueId: 'shared-ground', slot: 'evening' },
      { fixtureId: second.id, venueId: 'shared-ground', slot: 'evening' },
    ]).some((issue) => issue.code === 'VENUE_CLASH')).toBe(true)
  })
  it('allows a shared venue in separate slots', () => {
    const [first, second] = schedule.matchweeks[0]
    expect(validateLogistics(schedule, clubs, [
      { fixtureId: first.id, venueId: 'shared-ground', slot: 'early' },
      { fixtureId: second.id, venueId: 'shared-ground', slot: 'late' },
    ])).toEqual([])
  })
})
