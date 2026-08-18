# Logistics validation

CI treats the AEL schedule as a contract. Every change must preserve eight matchweeks, the published 47/48-match weekly capacity, one fixture per active club per week, unique pairings, and the 8/7/6 match allocation for Tiers A/B/C.

The validator also accepts venue and broad slot assignments. When supplied, it rejects two matches at one venue in the same matchweek and slot. Exact kick-off times are deliberately not required yet.

Domestic-league, domestic-cup, policing, travel and rest conflicts cannot be certified until those external calendars and venue records are ingested. They remain modelling assumptions, not hidden claims. A future data adapter can feed those records into the same validation gate.
