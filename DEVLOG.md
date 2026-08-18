# All-Europe League — DEVLOG

This journal records product decisions, experiments, evidence, reversals and open questions. Newest entries appear first.

## 2026-08-18 — Historical fields and cinematic competition focus

### Goal

Define how real season data enters AEL and make UCL, UEL and UECL selection feel like a genuine transition between phases.

### Decisions

- Use actual league/group-phase participants as the primary historical input.
- Treat 108 as exact only from 2024/25 onward.
- Preserve the real 96-club field for 2021/22–2023/24 and label any 108-club reconstruction explicitly.
- Use 2025/26 as the completed calibration season.
- Use 2026/27 as the primary live model with unresolved qualifying slots until the 27–28 August draws.
- Make competition focus cinematic: the selected destination advances while the other paths recede.

### Work completed

- Added season dataset metadata and historical field-size rules.
- Added a live/provisional dataset selector.
- Added slow destination focus transitions and a dedicated 36-club focus reveal.
- Added source and provenance requirements for historical data.

### Evidence

- UEFA confirms 36 clubs in each competition from 2024/25, producing exactly 108 league-phase clubs.
- UEFA's 2021–24 access list used 32 clubs in each competition, producing 96 group-stage clubs.

### Open questions

- Whether the first reconstructed 96-to-108 dataset should add qualifying play-off losers or use domestic access-list order.
- Which frozen rating source should anchor historical pre-season club strength.

### Next

- Build the typed 2025/26 club dataset and a provisional-slot-aware 2026/27 importer.

## 2026-08-18 — AEL identity and public foundation

### Goal

Turn the format discussion into a public, explorable GitHub project.

### Decisions

- Product name: **All-Europe League**.
- Acronym: **AEL**.
- Preserve UCL, UEL and UECL as the three destinations.
- Recognise first place in the unified phase with the **All-Europe Shield** without treating it as a major European championship.
- Use a static-first React and TypeScript architecture suitable for GitHub Pages.
- Keep the simulation reproducible and run it in-browser before considering a backend.
- Treat unequal 8/7/6-match schedules as a fairness hypothesis to test.

### Work completed

- Established the public repository structure and visual identity.
- Built an interactive format explorer foundation.
- Added scenario controls, destination focus and the January pathway overview.
- Added the working product specification and competition rules.

### Evidence

- The January arithmetic produces eight Round-of-16 qualifiers from each 36-club band.
- The application builds as a static site suitable for GitHub Pages.

### Open questions

- Exact initial-tier allocation formula.
- Best ranking model for unequal fixture counts.
- Whether prior European finalists receive tier protection.
- Real or fictional demonstration dataset for the first complete simulation.

### Next

- Implement deterministic competition types, a seeded random generator and mathematical rule tests.
