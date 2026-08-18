import { describe, expect, it } from 'vitest'
import { isValidProbabilityModel, simulateOutcome, simulationPresets } from './probability'

describe('editable simulation probability models', () => {
  it('ships three valid presets', () => {
    expect(simulationPresets).toHaveLength(3)
    expect(simulationPresets.every((preset) => isValidProbabilityModel(preset.probabilities))).toBe(true)
  })

  it('maps deterministic samples to the expected result bands', () => {
    const model = simulationPresets[0].probabilities
    expect(simulateOutcome(model, 0.2)).toBe('favoured-win')
    expect(simulateOutcome(model, 0.8)).toBe('draw')
    expect(simulateOutcome(model, 0.95)).toBe('underdog-win')
  })

  it('rejects models that do not total 100 percent', () => {
    expect(isValidProbabilityModel({ favouredWin: 75, draw: 15, underdogWin: 15 })).toBe(false)
  })
})
