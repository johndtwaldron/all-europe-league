import type { AelTier, RatedClub } from './ratings'

export function matchupClass(home: RatedClub, away: RatedClub) {
  return `matchup-${[home.tier, away.tier].sort().join('').toLowerCase()}`
}

export const matchupLegend: Array<{ code: string; label: string; tiers: AelTier[] }> = [
  { code: 'aa', label: 'A × A', tiers: ['A'] }, { code: 'ab', label: 'A × B', tiers: ['A','B'] },
  { code: 'ac', label: 'A × C', tiers: ['A','C'] }, { code: 'bb', label: 'B × B', tiers: ['B'] },
  { code: 'bc', label: 'B × C', tiers: ['B','C'] }, { code: 'cc', label: 'C × C', tiers: ['C'] },
]

export function clubInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase()
}
