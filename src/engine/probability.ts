export type SimulationPresetId = 'hierarchy' | 'equal' | 'underdog'
export type MatchOutcome = 'favoured-win' | 'draw' | 'underdog-win'

export interface OutcomeProbabilities {
  favouredWin: number
  draw: number
  underdogWin: number
}

export interface SimulationPreset {
  id: SimulationPresetId
  name: string
  description: string
  probabilities: OutcomeProbabilities
}

export const simulationPresets: SimulationPreset[] = [
  { id: 'hierarchy', name: 'Hierarchy 75', description: 'The stronger team wins three matches in four.', probabilities: { favouredWin: 75, draw: 15, underdogWin: 10 } },
  { id: 'equal', name: 'Level field', description: 'Every team has an equal win, draw or loss chance.', probabilities: { favouredWin: 33.34, draw: 33.33, underdogWin: 33.33 } },
  { id: 'underdog', name: 'Underdog 75', description: 'The smaller team wins three matches in four.', probabilities: { favouredWin: 10, draw: 15, underdogWin: 75 } },
]

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
