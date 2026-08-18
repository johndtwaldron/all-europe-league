import { describe, expect, it } from 'vitest'
import { balanceLabel, balanceToProbabilities, isValidProbabilityModel, simulateOutcome } from './probability'

describe('competitive balance model', () => {
  it('blends from a level field to a strong hierarchy', () => {
    const openBalance = balanceToProbabilities(0)
    expect(openBalance.favouredWin).toBeCloseTo(100 / 3)
    expect(openBalance.draw).toBeCloseTo(100 / 3)
    expect(openBalance.underdogWin).toBeCloseTo(100 / 3)
    expect(balanceToProbabilities(100)).toEqual({ favouredWin: 75, draw: 15, underdogWin: 10 })
    expect([0, 25, 50, 75, 100].every((value) => isValidProbabilityModel(balanceToProbabilities(value)))).toBe(true)
  })

  it('maps deterministic samples to the expected result bands', () => {
    const model = balanceToProbabilities(100)
    expect(simulateOutcome(model, 0.2)).toBe('favoured-win')
    expect(simulateOutcome(model, 0.8)).toBe('draw')
    expect(simulateOutcome(model, 0.95)).toBe('underdog-win')
  })

  it('exposes plain-language points on the single scale', () => {
    expect(balanceLabel(0)).toBe('Level field')
    expect(balanceLabel(50)).toBe('Balanced')
    expect(balanceLabel(100)).toBe('Strong hierarchy')
  })

  it('rejects models that do not total 100 percent', () => {
    expect(isValidProbabilityModel({ favouredWin: 75, draw: 15, underdogWin: 15 })).toBe(false)
  })
})
