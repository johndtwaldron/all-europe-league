# All-Europe League — DEVLOG

This journal records product decisions, experiments, evidence, reversals and open questions. Newest entries appear first.

## 2026-08-18 — First playable AEL season

### Goal

Turn the format explorer into a deterministic, playable 108-club league phase.

### Decisions

- Use a replaceable provisional rating adapter until official coefficients are imported.
- Assign exactly 36 clubs to each initial tier by rating order.
- Generate all fixtures from the visible random seed.
- Preserve exact 8/7/6 appearance totals and prohibit repeat opponents.
- Show the top ten and both destination cut lines after every matchweek.

### Work completed

- Added deterministic random, rating, tier, fixture, result and standings engines.
- Added an eight-matchweek schedule generator containing 378 matches.
- Added Generate, Play Next Matchweek, jump-to-week and Simulate All controls.
- Added live standings, fixture previews and UCL/UEL/UECL boundary views.
- Added the completed-table handoff to stock knockout graphics.

### Evidence

- Every Tier A club receives eight matches, Tier B seven and Tier C six.
- All 378 pairings are unique.
- Identical seeds produce identical schedules.
- A complete 2025/26 season was generated and simulated without browser errors.
- Thirteen unit tests pass.

### Open questions

- Replace source-competition proxy ratings with dated UEFA coefficients and domestic-finishing data.
- Add association constraints once association metadata is populated.
- Expand stock knockout handoff into the full visual bracket component.

### Next

- Import coefficients and associations, then render the populated UCL, UEL and UECL January graphics.

## 2026-08-18 — Simulation contract, calendar and ground advantage

### Goal

Separate real and simulated results, make simulation probabilities editable, and define how AEL fits into the 2026 calendar and rewards higher finishers.

### Decisions

- Real mode replays recorded results; simulated mode generates alternatives.
- Provide Hierarchy 75, Level field and Underdog 75 presets.
- Store probabilities as editable configuration that must total 100%.
- Complete eight AEL matchweeks by Christmas; Tier B has one bye and Tier C has two.
- Populate stock UCL, UEL and UECL knockout graphics from the final AEL table.
- Higher AEL seed hosts January ties and plays the second leg at home thereafter.

### Work completed

- Added editable probability models and deterministic outcome bands.
- Added Real/Simulated mode controls.
- Added the working eight-matchweek 2026 calendar graphic.
- Added visible ground-advantage rules.
- Added simulation and calendar documentation.

### Evidence

- Tier workloads total 378 AEL matches.
- Six 47-match weeks plus two 48-match weeks equal 378.
- Probability presets and invalid-total handling are unit tested.

### Open questions

- Exact club-strength rating source and rating-gap treatment.
- Actual-result ingestion for real replay mode.
- Calendar conflict optimisation across domestic competitions.

### Next

- Add ratings and tier assignment, then generate the first seeded AEL fixtures and final-table knockout graphics.

## 2026-08-18 — Official UEFA season importer

### Goal

Replace placeholder season metadata with reproducible, machine-readable league-phase fields.

### Decisions

- Extract club names from official UEFA league-phase draw pages.
- Store source competition and provenance on every season manifest.
- Fail the import unless every competition produces exactly 36 entries.
- Represent unresolved 2026/27 places as typed slots rather than guessed clubs.

### Work completed

- Added a reproducible UEFA page importer.
- Generated complete 108-entry manifests for 2024/25 and 2025/26.
- Generated a 108-slot provisional manifest for 2026/27.
- Added runtime manifest validation and an interface data-proof strip.
- Exposed resolved-club and UCL/UEL/UECL counts in the format explorer.

### Evidence

- 2024/25: 108 entries and 108 unique clubs.
- 2025/26: 108 entries and 108 unique clubs.
- 2026/27: 108 typed provisional slots.
- Production build and six unit tests pass.
- Browser verification loads all 108 resolved 2025/26 clubs without errors.

### Open questions

- Populate associations and qualification routes on each club entry.
- Resolve 2026/27 slots incrementally as qualifying concludes.
- Select and freeze a pre-season strength-rating source.

### Next

- Add association metadata, club ratings and initial AEL tier allocation.

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
# 2026-08-18 — Logistics gate and combined-table presentation

- Added CI tests for the eight-matchweek calendar contract, club double-bookings, repeat pairings, tier appearance totals and optional shared-venue/slot clashes.
- Added a full 108-club table with UCL/UEL/UECL destination strata and tier-coloured shield placeholders.
- Added previous/next matchweek navigation and an animated-ready table/fixtures view switch.
- Added tier-matchup colour combinations, including an all-three mixed-week treatment.
- Documented the boundary between internally validated AEL logistics and future domestic-calendar/venue ingestion.
# 2026-08-18 — Phase One club identity snapshot

- Replaced all generic 2026/27 qualifying slots with 132 actual named clubs across 108 field positions.
- Marked the snapshot as dated 18 August 2026: 46 positions are confirmed and unresolved positions show both clubs contesting the relevant route.
- Cached 132 official UEFA crest images locally for reliable GitHub Pages rendering.
- Added overlapping crest treatment, qualification-path labels, provisional markers and provenance metadata.
- Added a reproducible snapshot builder so the field can be refreshed after the 27–28 August league-phase confirmations.
# 2026-08-18 — Canonical qualifying-path labels

- Standardised every unresolved field position as `Team A / Team B (route)` in both the AEL table and matchweek fixtures.
- Shortened route labels to UCL/UEL/UECL play-off and explicit loser-transfer arrows.
- Kept paired crests as the visual marker until each tie resolves to one club.
# 2026-08-18 — Balance slider, table strata and January branches

- Replaced three scenario presets and three probability controls with one competitive-balance slider.
- Defined a continuous 33/33/33 level field through to a 75/15/10 hierarchy while retaining randomness at every setting.
- Added twelve colour-intensity strata across the UCL, UEL and UECL table blocks, with dashed destination boundaries and increasingly muted January routes.
- Added reusable post-Matchweek-8 UCL, UEL and UECL branch views covering Wild Card, Qualification, Final Play-off and Round of 16 entry.
- Added tests for slider interpolation, rank strata and the shared 4–8–8–8 January branch structure.
