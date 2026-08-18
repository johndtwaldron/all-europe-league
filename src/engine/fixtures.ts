import type { RatedClub } from './ratings'
import { createRandom, hashSeed, shuffled } from './random'

export interface Fixture {
  id: string
  matchweek: number
  home: RatedClub
  away: RatedClub
}

export interface GeneratedSchedule {
  seed: number
  matchweeks: Fixture[][]
  byeClubIds: string[][]
}

function allocateByes(clubs: RatedClub[]) {
  const byes = Array.from({ length: 8 }, () => new Set<string>())
  const tierB = clubs.filter((club) => club.tier === 'B')
  const bTargets = [5, 5, 5, 5, 4, 4, 4, 4]
  let cursor = 0
  bTargets.forEach((count, week) => {
    tierB.slice(cursor, cursor + count).forEach((club) => byes[week].add(club.id))
    cursor += count
  })

  const tierC = clubs.filter((club) => club.tier === 'C')
  const remaining = [9, 9, 9, 9, 10, 10, 8, 8]
  tierC.forEach((club) => {
    const first = remaining.map((count, week) => ({ count, week })).sort((a, b) => b.count - a.count || a.week - b.week)[0].week
    remaining[first] -= 1
    const second = remaining.map((count, week) => ({ count, week })).filter(({ week }) => week !== first).sort((a, b) => b.count - a.count || a.week - b.week)[0].week
    remaining[second] -= 1
    byes[first].add(club.id)
    byes[second].add(club.id)
  })
  if (remaining.some((count) => count !== 0)) throw new Error('Unable to allocate Tier C byes')
  return byes
}

function pairWeek(active: RatedClub[], played: Set<string>, seed: number, week: number) {
  for (let attempt = 0; attempt < 250; attempt += 1) {
    const random = createRandom(`${seed}:${week}:${attempt}`)
    const pool = shuffled(active, random)
    const pairs: Array<[RatedClub, RatedClub]> = []
    let valid = true
    while (pool.length) {
      const homeCandidate = pool.shift()!
      const candidates = pool.map((club, index) => ({ club, index })).filter(({ club }) => !played.has([homeCandidate.id, club.id].sort().join('|')))
      if (!candidates.length) { valid = false; break }
      candidates.sort((left, right) => Math.abs(homeCandidate.rating - left.club.rating) - Math.abs(homeCandidate.rating - right.club.rating) || random() - .5)
      const selected = candidates[Math.floor(random() * Math.min(7, candidates.length))]
      pool.splice(selected.index, 1)
      pairs.push([homeCandidate, selected.club])
    }
    if (valid) return pairs
  }
  throw new Error(`Unable to pair matchweek ${week + 1} without repeat opponents`)
}

export function generateSchedule(clubs: RatedClub[], seed: number): GeneratedSchedule {
  if (clubs.length !== 108) throw new RangeError('AEL fixture generation requires exactly 108 clubs')
  const counts = clubs.reduce<Record<string, number>>((result, club) => ({ ...result, [club.tier]: (result[club.tier] ?? 0) + 1 }), {})
  if (counts.A !== 36 || counts.B !== 36 || counts.C !== 36) throw new RangeError('AEL requires exactly 36 clubs in each tier')
  const byes = allocateByes(clubs)
  const played = new Set<string>()
  const matchweeks = byes.map((weekByes, week) => {
    const active = clubs.filter((club) => !weekByes.has(club.id))
    const pairs = pairWeek(active, played, seed, week)
    return pairs.map(([first, second], index) => {
      const swap = (hashSeed(`${seed}:${week}:${index}`) & 1) === 1
      const home = swap ? second : first
      const away = swap ? first : second
      played.add([home.id, away.id].sort().join('|'))
      return { id: `mw${week + 1}-${String(index + 1).padStart(2, '0')}`, matchweek: week + 1, home, away }
    })
  })
  return { seed, matchweeks, byeClubIds: byes.map((week) => [...week]) }
}
