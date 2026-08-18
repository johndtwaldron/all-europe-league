import type { OutcomeProbabilities } from './probability'
import { simulateOutcome } from './probability'
import type { Fixture, GeneratedSchedule } from './fixtures'
import { createRandom } from './random'
import type { RatedClub } from './ratings'

export interface PlayedFixture extends Fixture { homeGoals: number; awayGoals: number }
export interface Standing { club: RatedClub; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number }

export function simulateMatchweek(fixtures: Fixture[], probabilities: OutcomeProbabilities, seed: number) {
  const random = createRandom(seed)
  return fixtures.map((fixture): PlayedFixture => {
    const homeFavoured = fixture.home.rating >= fixture.away.rating
    const outcome = simulateOutcome(probabilities, random())
    if (outcome === 'draw') return { ...fixture, homeGoals: 1, awayGoals: 1 }
    const favouredWon = outcome === 'favoured-win'
    const homeWon = homeFavoured === favouredWon
    return { ...fixture, homeGoals: homeWon ? 2 : 0, awayGoals: homeWon ? 0 : 2 }
  })
}

export function calculateStandings(clubs: RatedClub[], results: PlayedFixture[]): Standing[] {
  const rows = new Map(clubs.map((club) => [club.id, { club, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }]))
  results.forEach((result) => {
    const home = rows.get(result.home.id)!; const away = rows.get(result.away.id)!
    home.played += 1; away.played += 1; home.goalsFor += result.homeGoals; home.goalsAgainst += result.awayGoals; away.goalsFor += result.awayGoals; away.goalsAgainst += result.homeGoals
    if (result.homeGoals === result.awayGoals) { home.drawn += 1; away.drawn += 1; home.points += 1; away.points += 1 }
    else if (result.homeGoals > result.awayGoals) { home.won += 1; away.lost += 1; home.points += 3 }
    else { away.won += 1; home.lost += 1; away.points += 3 }
  })
  return [...rows.values()].sort((left, right) => right.points - left.points || (right.goalsFor - right.goalsAgainst) - (left.goalsFor - left.goalsAgainst) || right.goalsFor - left.goalsFor || right.club.rating - left.club.rating)
}

export function simulateThrough(schedule: GeneratedSchedule, clubs: RatedClub[], probabilities: OutcomeProbabilities, matchweek: number) {
  const results = schedule.matchweeks.slice(0, matchweek).flatMap((fixtures, index) => simulateMatchweek(fixtures, probabilities, schedule.seed + index * 1009))
  return { results, standings: calculateStandings(clubs, results) }
}
