export type DatasetStatus = 'historical' | 'complete' | 'provisional'

export interface SeasonDatasetSummary {
  id: string
  label: string
  shortLabel: string
  description: string
  fieldSize: number
  status: DatasetStatus
  statusLabel: string
}

export const seasonDatasets: SeasonDatasetSummary[] = [
  {
    id: '2026-27',
    label: '2026/27 live model',
    shortLabel: '2026/27',
    description: 'Named field snapshot from the completed 2025/26 domestic season. Unresolved August paths show both clubs and crests.',
    fieldSize: 108,
    status: 'provisional',
    statusLabel: 'LIVE · PROVISIONAL',
  },
  {
    id: '2025-26',
    label: '2025/26 completed field',
    shortLabel: '2025/26',
    description: 'A complete modern 108-club season for calibration and scenario replay.',
    fieldSize: 108,
    status: 'complete',
    statusLabel: 'COMPLETE',
  },
  {
    id: '2024-25',
    label: '2024/25 inaugural league phase',
    shortLabel: '2024/25',
    description: 'The first real UEFA season with 36 clubs in each of UCL, UEL and UECL.',
    fieldSize: 108,
    status: 'historical',
    statusLabel: 'HISTORICAL',
  },
]

export const historicalFieldSizes = [
  { from: '2024/25', to: 'present', ucl: 36, uel: 36, uecl: 36, total: 108 },
  { from: '2021/22', to: '2023/24', ucl: 32, uel: 32, uecl: 32, total: 96 },
  { from: '2009/10', to: '2020/21', ucl: 32, uel: 48, uecl: 0, total: 80 },
] as const
