import { describe, expect, it } from 'vitest'
import { historicalFieldSizes, seasonDatasets } from './seasons'

describe('season dataset metadata', () => {
  it('uses exact 108-club modern fields', () => {
    expect(historicalFieldSizes[0]).toMatchObject({ ucl: 36, uel: 36, uecl: 36, total: 108 })
    expect(seasonDatasets.every((season) => season.fieldSize === 108)).toBe(true)
  })

  it('preserves the actual pre-2024 field instead of silently padding it', () => {
    expect(historicalFieldSizes[1]).toMatchObject({ ucl: 32, uel: 32, uecl: 32, total: 96 })
  })
})
