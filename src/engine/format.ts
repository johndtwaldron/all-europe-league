export type Destination = 'UCL' | 'UEL' | 'UECL'
export type JanuaryRoute = 'round-of-16' | 'final-playoff' | 'qualification' | 'wild-card'

export function destinationForAelRank(rank: number): Destination {
  if (!Number.isInteger(rank) || rank < 1 || rank > 108) throw new RangeError('AEL rank must be an integer from 1 to 108')
  if (rank <= 36) return 'UCL'
  if (rank <= 72) return 'UEL'
  return 'UECL'
}

export function januaryRouteForBandRank(rank: number): JanuaryRoute {
  if (!Number.isInteger(rank) || rank < 1 || rank > 36) throw new RangeError('Band rank must be an integer from 1 to 36')
  if (rank <= 8) return 'round-of-16'
  if (rank <= 16) return 'final-playoff'
  if (rank <= 28) return 'qualification'
  return 'wild-card'
}

export const JANUARY_MATCHES_PER_CUP = 4 + 8 + 8
export const JANUARY_MATCHES_ALL_CUPS = JANUARY_MATCHES_PER_CUP * 3
