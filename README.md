# All-Europe League (AEL)

> One league. Three destinations. Every club has a path.

The All-Europe League is an independent competition-design prototype. It explores a unified 108-club European league phase that dynamically feeds the UEFA Champions League (UCL), UEFA Europa League (UEL), and UEFA Conference League (UECL).

The league phase decides a club's competition. The knockout phase decides its champion.

## Status

This repository is at public prototype stage. The interactive format shell is live; the deterministic fixture and simulation engines are the next milestones. The project deliberately presents ranking fairness as something to test rather than something already proven.

## Core format

- Domestic football qualifies 108 clubs.
- Initial Tier A, B and C assignments shape the schedule, not the final destination.
- One August–December table sends positions 1–36 to UCL, 37–72 to UEL and 73–108 to UECL.
- Each competition uses the same seeded January ladder.
- Positions 1–8 enter the Round of 16 directly.
- Positions 9–16 need one January win, 17–28 need two, and 29–36 need three.
- There are no cross-competition parachutes after the league phase.
- First place in the unified table receives the All-Europe Shield.

## Local development

```bash
npm install
npm run dev
```

Build and test:

```bash
npm run build
npm test
```

## Open development

See [DEVLOG.md](DEVLOG.md) for the development narrative, [docs/SPEC.md](docs/SPEC.md) for the working product specification, and [docs/DATA.md](docs/DATA.md) for historical-season compatibility and provenance rules.

## Independence notice

All-Europe League is an independent thought experiment and is not affiliated with or endorsed by UEFA. The initial visual system deliberately avoids official competition logos and club crests.

## Licence

MIT
