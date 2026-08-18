export type MatchOutcome = 'favoured-win' | 'draw' | 'underdog-win'

export interface OutcomeProbabilities {
  favouredWin: number
  draw: number
  underdogWin: number
}

export function balanceToProbabilities(balance: number): OutcomeProbabilities {
  const amount = Math.min(100, Math.max(0, balance)) / 100
  const favouredWin = 100 / 3 + amount * (75 - 100 / 3)
  const draw = 100 / 3 + amount * (15 - 100 / 3)
  return { favouredWin, draw, underdogWin: 100 - favouredWin - draw }
}

export function balanceLabel(balance: number) {
  if (balance <= 20) return 'Level field'
  if (balance <= 40) return 'Open'
  if (balance <= 60) return 'Balanced'
  if (balance <= 80) return 'Hierarchical'
  return 'Strong hierarchy'
}

export function isValidProbabilityModel(model: OutcomeProbabilities) {
  const values = [model.favouredWin, model.draw, model.underdogWin]
  return values.every((value) => Number.isFinite(value) && value >= 0 && value <= 100) && Math.abs(values.reduce((sum, value) => sum + value, 0) - 100) < 0.011
}

export function simulateOutcome(model: OutcomeProbabilities, randomValue: number): MatchOutcome {
  if (!isValidProbabilityModel(model)) throw new RangeError('Match probabilities must total 100%')
  if (randomValue < 0 || randomValue >= 1) throw new RangeError('Random value must be from 0 inclusive to 1 exclusive')
  if (randomValue * 100 < model.favouredWin) return 'favoured-win'
  if (randomValue * 100 < model.favouredWin + model.draw) return 'draw'
  return 'underdog-win'
}
