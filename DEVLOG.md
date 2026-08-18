# All-Europe League — DEVLOG

This journal records product decisions, experiments, evidence, reversals and open questions. Newest entries appear first.

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
