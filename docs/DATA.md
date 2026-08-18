# Season data strategy

## What counts as the field?

AEL distinguishes three related populations:

1. **Domestic qualifiers** — clubs awarded a European place before UEFA qualifying rounds.
2. **Qualifying participants** — every club that plays in any UEFA qualifying round.
3. **League-phase field** — the clubs that reach the UCL, UEL or UECL league/group phase.

The primary AEL simulation uses the third definition. It is the cleanest equivalent of the 108 clubs currently divided between UEFA's three league phases.

## Historical compatibility

| Seasons | UCL | UEL | UECL | Combined field | AEL treatment |
|---|---:|---:|---:|---:|---|
| 2024/25 onward | 36 | 36 | 36 | 108 | Exact modern input |
| 2021/22–2023/24 | 32 | 32 | 32 | 96 | Preserve actual field; optional labelled 108-club reconstruction |
| 2009/10–2020/21 | 32 | 48 | — | 80 | Historical mode or reconstructed input only |

Historical data must never be silently padded to 108. A reconstruction may add the next 12 eligible clubs from qualifying, but it must record the selection rule and remain distinct from the actual historical field.

## Current dataset plan

### 2024/25

The first exact 108-club historical baseline and the first season of UEFA's 36-club league phases.

### 2025/26

The first completed calibration dataset in the application. It will include all 108 league-phase clubs, source competition, association, domestic qualifying route and a frozen pre-season strength rating.

### 2026/27

The primary live model. At this stage the final field is provisional because qualifying remains in progress:

- UCL: 29 direct places and seven qualifying places;
- UEL: direct/titleholder places, qualifying places and transfers from UCL qualifying;
- UECL: all 36 places determined through qualifying.

Unresolved places are represented as typed slot records, not guessed club names. The dataset becomes `complete` only after the league-phase draws on 27–28 August 2026.

## Provenance requirements

Every season file must record:

- season and dataset version;
- extraction date;
- source URLs;
- actual or reconstructed status;
- competition and qualification route;
- association;
- domestic finish where available;
- rating source and rating date;
- unresolved slots;
- manual corrections with an explanation.

## Reproducible import

The checked-in manifests can be regenerated with:

```bash
npm run data:import
```

The importer reads the official UEFA league-phase draw pages and refuses to write a historical season unless it finds exactly 36 clubs in UCL, 36 in UEL and 36 in UECL. The generated files live in `public/data/seasons/` so the static GitHub Pages application can load them without a backend.

## Initial official references

- [UEFA explanation of the 36/36/36 format](https://www.uefa.com/uefaeuropaleague/news/0268-12157d69ce2d-9f011c70f6fa-1000--new-europa-league-format-explained/)
- [UEFA: 108 clubs in the 2024/25 league phases](https://www.uefa.com/uefaconferenceleague/news/0290-1bbbc5e8840b-c649b50d424a-1000--40-national-associations-to-be-represented-in-new-uefa-club-/)
- [UEFA 2026/27 Champions League overview](https://www.uefa.com/uefachampionsleague/news/02a6-20d57cfcd03e-407c22a7f465-1000--2026-27-champions-league-teams-dates-draws-format-final/)
- [UEFA 2026/27 Europa League overview](https://www.uefa.com/uefaeuropaleague/news/02a6-20d57d095740-e1e0b3de85df-1000--2026-27-europa-league-teams-dates-draws-format-final/)
- [UEFA 2026/27 Conference League qualifying overview](https://www.uefa.com/uefaconferenceleague/news/02a6-20e5e911587f-cc10425958b3-1000--conference-league-qualifying-fixtures-dates-how-it-works/)
