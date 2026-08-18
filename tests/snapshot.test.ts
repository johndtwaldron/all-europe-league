import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

type SnapshotEntry = { name: string; sourceCompetition: string; recordType: 'club' | 'slot'; crestUrl?: string; crestUrls?: string[]; candidates?: unknown[]; qualificationLabel?: string }
const snapshot = JSON.parse(readFileSync('public/data/seasons/2026-27.json', 'utf8')) as { entries: SnapshotEntry[] }

describe('2026/27 named field snapshot', () => {
  it('contains 36 positions per destination and no generic slot names', () => {
    expect(snapshot.entries).toHaveLength(108)
    for (const competition of ['UCL', 'UEL', 'UECL']) expect(snapshot.entries.filter((entry) => entry.sourceCompetition === competition)).toHaveLength(36)
    expect(snapshot.entries.some((entry) => /qualifying slot \d/i.test(entry.name))).toBe(false)
  })

  it('gives every position real cached crest artwork', () => {
    snapshot.entries.forEach((entry) => {
      const crests = entry.recordType === 'slot' ? (entry.crestUrls ?? []) : entry.crestUrl ? [entry.crestUrl] : []
      expect(crests.length).toBeGreaterThan(0)
      crests.forEach((crest) => expect(existsSync(`public/${crest}`), crest).toBe(true))
    })
  })

  it('names both clubs in every unresolved route', () => {
    snapshot.entries.filter((entry) => entry.recordType === 'slot').forEach((entry) => {
      expect(entry.candidates).toHaveLength(2)
      expect(entry.name).toContain(' / ')
      expect(entry.qualificationLabel).toBeTruthy()
    })
  })

  it('uses concise parenthetical route labels across all three tiers', () => {
    const labels = new Set(snapshot.entries.filter((entry) => entry.recordType === 'slot').map((entry) => entry.qualificationLabel))
    expect(labels).toEqual(new Set(['UCL play-off', 'UEL play-off', 'UECL play-off', 'UCL loser → UEL', 'UEL loser → UECL']))
  })
})
