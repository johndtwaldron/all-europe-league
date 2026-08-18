# Simulation and calendar contract

## Result modes

### Real results

Replays recorded fixtures and outcomes from a completed season. Real mode never invents a result. A season can expose this mode only when its result dataset is complete.

### Simulated results

Uses club strength ratings, the selected preset, editable outcome probabilities and a visible random seed.

The initial presets describe the result from the perspective of the stronger team:

| Preset | Stronger wins | Draw | Smaller wins |
|---|---:|---:|---:|
| Hierarchy 75 | 75% | 15% | 10% |
| Level field | 33.34% | 33.33% | 33.33% |
| Underdog 75 | 10% | 15% | 75% |

Probabilities are configuration, not hard-coded match logic. They must total 100%. Equal-strength pairings use the level-field probabilities. Later versions may allow probabilities to vary by rating gap, home advantage, fatigue and travel.

## AEL 2026 working calendar

The league phase contains 378 matches:

- Tier A: 36 clubs × 8 appearances ÷ 2 = 144 match equivalents;
- Tier B: 36 clubs × 7 appearances ÷ 2 = 126;
- Tier C: 36 clubs × 6 appearances ÷ 2 = 108.

Because fixtures may cross initial tiers, these are workload totals rather than separate tier competitions.

Eight matchweeks run from September to December. Tier A plays every week, Tier B has one bye and Tier C has two. Six matchweeks contain 47 matches and two contain 48, totalling 378.

The initial working dates are 8–10 September, 22–24 September, 13–15 October, 20–22 October, 3–5 November, 24–26 November, 8–10 December and 15–17 December 2026. They are modelling assumptions, not a claim that UEFA or domestic calendars currently reserve every slot.

## Post-AEL output

The product does not need to recreate separate UCL, UEL and UECL league phases. A completed AEL table populates three stock 36-club knockout-path graphics:

- AEL 1–36 → UCL graphic;
- AEL 37–72 → UEL graphic;
- AEL 73–108 → UECL graphic.

Each graphic populates positions 1–8, 9–16, 17–28 and 29–36 within its own band.

## Ground advantage

- January Wild Card, Qualification and Final Playoff ties are single matches hosted by the higher AEL finisher.
- In the Round of 16, quarter-finals and semi-finals, the club with the better original AEL finish plays the second leg at home.
- Original AEL ranking remains the tiebreak for home order even after a lower seed eliminates a higher seed.
- Finals are played at neutral venues.

The rule is automatic. Clubs do not choose leg order.

## First playable engine

The first implementation provides:

- deterministic provisional ratings;
- exact 36/36/36 initial tier assignment;
- seeded fixture generation;
- 378 unique pairings across eight matchweeks;
- exact Tier A/B/C appearance counts of 8/7/6;
- deterministic probability-driven results;
- live points, goal difference and standings;
- UCL/UEL and UEL/UECL boundary views;
- final-table handoff to the three knockout graphics.

The provisional rating adapter uses a source-competition baseline plus a small stable club-specific variation. It exists to test the engine and is visibly labelled provisional. It will be replaced by a dated coefficient/domestic-performance model without changing the fixture or simulation interfaces.
