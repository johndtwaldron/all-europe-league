export const aelMatchweeks2026 = [
  { id: 1, dates: '8–10 Sep', matches: 47 },
  { id: 2, dates: '22–24 Sep', matches: 47 },
  { id: 3, dates: '13–15 Oct', matches: 47 },
  { id: 4, dates: '20–22 Oct', matches: 47 },
  { id: 5, dates: '3–5 Nov', matches: 47 },
  { id: 6, dates: '24–26 Nov', matches: 47 },
  { id: 7, dates: '8–10 Dec', matches: 48 },
  { id: 8, dates: '15–17 Dec', matches: 48 },
] as const

export const AEL_LEAGUE_PHASE_MATCHES = aelMatchweeks2026.reduce((sum, week) => sum + week.matches, 0)
