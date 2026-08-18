import { describe, expect, it } from 'vitest'
import { destinationForAelRank, JANUARY_MATCHES_ALL_CUPS, JANUARY_MATCHES_PER_CUP, januaryRouteForBandRank } from './format'

describe('AEL competition boundaries', () => {
  it('assigns all 108 ranks across three 36-club destinations', () => {
    expect(destinationForAelRank(1)).toBe('UCL')
    expect(destinationForAelRank(36)).toBe('UCL')
    expect(destinationForAelRank(37)).toBe('UEL')
    expect(destinationForAelRank(72)).toBe('UEL')
    expect(destinationForAelRank(73)).toBe('UECL')
    expect(destinationForAelRank(108)).toBe('UECL')
  })

  it('assigns every position in a cup band to the intended January route', () => {
    expect(januaryRouteForBandRank(8)).toBe('round-of-16')
    expect(januaryRouteForBandRank(9)).toBe('final-playoff')
    expect(januaryRouteForBandRank(16)).toBe('final-playoff')
    expect(januaryRouteForBandRank(17)).toBe('qualification')
    expect(januaryRouteForBandRank(28)).toBe('qualification')
    expect(januaryRouteForBandRank(29)).toBe('wild-card')
    expect(januaryRouteForBandRank(36)).toBe('wild-card')
  })

  it('produces twenty January matches per cup and sixty overall', () => {
    expect(JANUARY_MATCHES_PER_CUP).toBe(20)
    expect(JANUARY_MATCHES_ALL_CUPS).toBe(60)
  })

  it('rejects impossible rankings', () => {
    expect(() => destinationForAelRank(0)).toThrow(RangeError)
    expect(() => destinationForAelRank(109)).toThrow(RangeError)
    expect(() => januaryRouteForBandRank(37)).toThrow(RangeError)
  })
})
