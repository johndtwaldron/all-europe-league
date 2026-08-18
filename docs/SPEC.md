# Product specification

## Experience

AEL should feel like a premium sports-broadcast product crossed with a transparent competition-design laboratory. Visitors must be able to move from a 108-club overview to one tier, boundary battle, scenario, competition or club journey without losing context.

## Architecture

- TypeScript and React
- Vite static build
- browser-based deterministic simulation in a Web Worker
- SVG for zoomable pathways and brackets
- Canvas only where dense animated marks require it
- static versioned datasets
- local and downloadable simulation saves
- GitHub Actions and GitHub Pages

No backend is required until the project needs accounts, hosted public scenarios, collaboration, private data credentials or large scheduled simulation batches.

## MVP journeys

1. Understand the complete format in under three minutes.
2. Choose hierarchy, balanced or chaos scenario settings.
3. Generate a valid seeded schedule for 108 clubs.
4. Simulate matchweek by matchweek.
5. Inspect the UCL, UEL and UECL cut lines.
6. Play the identical January ladders.
7. Follow one club from initial tier to exit or trophy.
8. Compare and export reproducible runs.

## Engine pipeline

```text
Validate dataset
→ assign initial tiers
→ generate constrained fixtures
→ simulate results
→ calculate weekly unified standings
→ assign UCL / UEL / UECL
→ generate three January ladders
→ simulate principal knockouts
→ export run and fairness diagnostics
```

## Ranking experiments

The engine must implement and compare:

1. raw points;
2. points per game with strength-of-schedule tiebreak;
3. schedule-adjusted points.

Every result must record application version, dataset version, settings and random seed.

## Major screens

- format story;
- zoomable 108-club ecosystem;
- unified table and tier filters;
- matchweek view;
- club journey;
- January pathway;
- scenario laboratory;
- run comparison;
- methodology and limitations.
