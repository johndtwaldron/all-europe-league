import { aelMatchweeks2026 } from './calendar'
import type { GeneratedSchedule } from './fixtures'
import type { RatedClub } from './ratings'

export interface VenueSlotAssignment { fixtureId: string; venueId: string; slot: string }
export interface LogisticsIssue { code: string; message: string }

export function validateLogistics(schedule: GeneratedSchedule, clubs: RatedClub[], assignments: VenueSlotAssignment[] = []): LogisticsIssue[] {
  const issues: LogisticsIssue[] = []
  if (schedule.matchweeks.length !== aelMatchweeks2026.length) issues.push({ code: 'MATCHWEEK_COUNT', message: 'The AEL phase must contain eight matchweeks.' })
  const appearances = new Map<string, number>()
  const pairs = new Set<string>()
  schedule.matchweeks.forEach((fixtures, index) => {
    const expected = aelMatchweeks2026[index]?.matches
    if (expected !== undefined && fixtures.length !== expected) issues.push({ code: 'WEEK_CAPACITY', message: `Matchweek ${index + 1} has ${fixtures.length} matches; expected ${expected}.` })
    const active = new Set<string>()
    fixtures.forEach(({ home, away }) => {
      for (const club of [home, away]) {
        if (active.has(club.id)) issues.push({ code: 'CLUB_DOUBLE_BOOKED', message: `${club.name} appears twice in matchweek ${index + 1}.` })
        active.add(club.id); appearances.set(club.id, (appearances.get(club.id) ?? 0) + 1)
      }
      const pair = [home.id, away.id].sort().join('|')
      if (pairs.has(pair)) issues.push({ code: 'REPEAT_PAIRING', message: `${home.name} and ${away.name} meet more than once.` })
      pairs.add(pair)
    })
  })
  clubs.forEach((club) => {
    const expected = club.tier === 'A' ? 8 : club.tier === 'B' ? 7 : 6
    if ((appearances.get(club.id) ?? 0) !== expected) issues.push({ code: 'APPEARANCE_COUNT', message: `${club.name} has ${appearances.get(club.id) ?? 0} fixtures; expected ${expected}.` })
  })
  const fixtureWeek = new Map(schedule.matchweeks.flat().map((fixture) => [fixture.id, fixture.matchweek]))
  const occupied = new Map<string, string>()
  assignments.forEach(({ fixtureId, venueId, slot }) => {
    const week = fixtureWeek.get(fixtureId)
    if (!week) { issues.push({ code: 'UNKNOWN_FIXTURE', message: `Venue assignment references unknown fixture ${fixtureId}.` }); return }
    const key = `${week}|${venueId}|${slot}`
    if (occupied.has(key)) issues.push({ code: 'VENUE_CLASH', message: `${venueId} is assigned to ${occupied.get(key)} and ${fixtureId} in matchweek ${week}, slot ${slot}.` })
    else occupied.set(key, fixtureId)
  })
  return issues
}
