import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, CalendarDays, ChevronLeft, ChevronRight, Database, GitBranch, List, RotateCcw, Table2, Trophy, Zap } from 'lucide-react'
import { seasonDatasets } from './data/seasons'
import { loadSeasonManifest, type SeasonManifest } from './data/dataset'
import { balanceLabel, balanceToProbabilities, isValidProbabilityModel } from './engine/probability'
import { aelMatchweeks2026 } from './engine/calendar'
import { assignProvisionalRatings } from './engine/ratings'
import { generateSchedule, type GeneratedSchedule } from './engine/fixtures'
import { simulateThrough } from './engine/season'
import { clubInitials, matchupClass } from './engine/presentation'
import { buildKnockoutPath, januaryRouteForRank, type KnockoutCompetition, type KnockoutPath, type SeededTie } from './engine/knockout'
import './crest.css'
import './strata.css'
import './knockout.css'

type ResultMode = 'real' | 'simulated'
type Focus = 'AEL' | 'UCL' | 'UEL' | 'UECL'

const destinations = [
  { id: 'UCL' as const, range: '1–36', name: 'Champions League', colour: '#39a7ff', route: 'Elite destination' },
  { id: 'UEL' as const, range: '37–72', name: 'Europa League', colour: '#ff9f43', route: 'Continental challenge' },
  { id: 'UECL' as const, range: '73–108', name: 'Conference League', colour: '#36d39a', route: 'Open European path' },
]

const dots = Array.from({ length: 108 }, (_, index) => ({
  rank: index + 1,
  angle: (index / 108) * Math.PI * 2,
  ring: 118 + (index % 6) * 11,
}))

function ClubBadge({ club }: { club: { name: string; tier: string; crestUrl?: string; crestUrls?: string[] } }) {
  const crests = club.crestUrls?.length ? club.crestUrls : club.crestUrl ? [club.crestUrl] : []
  return <span className={`club-badge-stack ${crests.length > 1 ? 'contested' : ''}`}>{crests.length ? crests.slice(0, 2).map((crest, index) => <b className={`club-crest tier-${club.tier.toLowerCase()}`} key={crest}><img src={`${import.meta.env.BASE_URL}${crest}`} alt={index === 0 ? `${club.name} crest` : ''}/></b>) : <b className={`club-crest tier-${club.tier.toLowerCase()}`}>{clubInitials(club.name)}</b>}</span>
}

function ClubDisplayName({ club }: { club: { name: string; qualificationLabel?: string; confirmed?: boolean } }) {
  return <strong>{club.name}{club.confirmed === false && club.qualificationLabel && <> <em>({club.qualificationLabel})</em></>}</strong>
}

const routeLabels = { direct: 'DIRECT TO ROUND OF 16', 'final-playoff': 'FINAL PLAY-OFF · ONE WIN', qualification: 'QUALIFICATION · TWO WINS', 'wild-card': 'WILD CARD · THREE WINS' }

function TieCard({ tie }: { tie: SeededTie }) {
  return <article className="bracket-tie"><span><i>{tie.homeSeed}</i>{tie.home && <ClubBadge club={tie.home.club}/>}<strong>{tie.home?.club.name}</strong><b>HOME</b></span><span><i>{tie.awaySeed ?? 'W'}</i>{tie.away ? <ClubBadge club={tie.away.club}/> : <em>ADVANCES</em>}<strong>{tie.away?.club.name ?? tie.awayLabel}</strong></span></article>
}

function KnockoutBracket({ path, onClose }: { path: KnockoutPath; onClose: () => void }) {
  const meta = destinations.find((item) => item.id === path.competition)!
  const stages: Array<{ name: string; note: string; ties: SeededTie[] }> = [
    { name: 'Wild Card', note: 'Seeds 29–36', ties: path.wildCard }, { name: 'Qualification', note: 'Seeds 17–28 join', ties: path.qualification },
    { name: 'Final Play-off', note: 'Seeds 9–16 join', ties: path.finalPlayoff }, { name: 'Round of 16', note: 'Seeds 1–8 join', ties: path.roundOf16 },
  ]
  return <section className="knockout-bracket" style={{ '--accent': meta.colour } as React.CSSProperties}>
    <header><div><span>{meta.id} · JANUARY PATH</span><h3>{meta.name} branch</h3><p>Higher AEL seed hosts every January tie. Winners move one column to the right.</p></div><button onClick={onClose}>RETURN TO TABLE</button></header>
    <div className="bracket-scroll">{stages.map((stage) => <section className="bracket-stage" key={stage.name}><header><span>{stage.name}</span><small>{stage.note}</small></header><div>{stage.ties.map((tie, index) => <TieCard tie={tie} key={`${stage.name}-${index}`}/>)}</div></section>)}</div>
  </section>
}

export function App() {
  const [resultMode, setResultMode] = useState<ResultMode>('simulated')
  const [balance, setBalance] = useState(70)
  const [focus, setFocus] = useState<Focus>('AEL')
  const [seed, setSeed] = useState(260826)
  const [seasonId, setSeasonId] = useState('2026-27')
  const [manifest, setManifest] = useState<SeasonManifest | null>(null)
  const [dataError, setDataError] = useState('')
  const [schedule, setSchedule] = useState<GeneratedSchedule | null>(null)
  const [completedMatchweeks, setCompletedMatchweeks] = useState(0)
  const [viewMatchweek, setViewMatchweek] = useState(1)
  const [seasonView, setSeasonView] = useState<'table' | 'fixtures'>('table')
  const [knockoutView, setKnockoutView] = useState<KnockoutCompetition | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setManifest(null)
    setDataError('')
    loadSeasonManifest(seasonId, controller.signal).then(setManifest).catch((error: unknown) => {
      if (!controller.signal.aborted) setDataError(error instanceof Error ? error.message : 'Dataset unavailable')
    })
    return () => controller.abort()
  }, [seasonId])

  const focusMeta = useMemo(() => destinations.find((item) => item.id === focus), [focus])
  const focusColour = focusMeta?.colour ?? '#e8f0ff'
  const season = seasonDatasets.find((item) => item.id === seasonId) ?? seasonDatasets[0]
  const probabilities = useMemo(() => balanceToProbabilities(balance), [balance])
  const probabilityValid = isValidProbabilityModel(probabilities)
  const ratedClubs = useMemo(() => manifest ? assignProvisionalRatings(manifest.entries) : [], [manifest])
  const viewedSeason = useMemo(() => schedule ? simulateThrough(schedule, ratedClubs, probabilities, viewMatchweek) : null, [schedule, ratedClubs, probabilities, viewMatchweek])
  const finalStandings = useMemo(() => schedule ? simulateThrough(schedule, ratedClubs, probabilities, 8).standings : [], [schedule, ratedClubs, probabilities])
  const knockoutPath = useMemo(() => knockoutView && finalStandings.length === 108 ? buildKnockoutPath(finalStandings, knockoutView) : null, [finalStandings, knockoutView])
  const buildSchedule = () => {
    if (ratedClubs.length !== 108 || !probabilityValid) return
    const generated = generateSchedule(ratedClubs, seed)
    setSchedule(generated); setCompletedMatchweeks(0); setViewMatchweek(1); setSeasonView('table')
  }
  const advanceTo = (matchweek: number) => {
    if (!schedule) return
    setCompletedMatchweeks(matchweek); setViewMatchweek(matchweek)
  }
  useEffect(() => { setSchedule(null); setCompletedMatchweeks(0); setViewMatchweek(1); setKnockoutView(null) }, [seasonId, seed, balance])

  return (
    <main className={focus === 'AEL' ? '' : 'focus-mode'}>
      <nav className="nav shell">
        <button className="brand" onClick={() => setFocus('AEL')} aria-label="All-Europe League home">
          <span className="brand-mark">AEL</span>
          <span><strong>ALL-EUROPE</strong><small>LEAGUE</small></span>
        </button>
        <div className="nav-links">
          <a href="#format">Format</a><a href="#explorer">Explorer</a><a href="#method">Method</a>
        </div>
        <span className="prototype">PUBLIC PROTOTYPE · 0.1</span>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">A EUROPEAN COMPETITION LABORATORY</p>
          <h1>One league.<br/><span>Three destinations.</span></h1>
          <p className="lede">A unified 108-club league phase dynamically feeds the UCL, UEL and UECL—then January knockout football decides who survives.</p>
          <div className="hero-actions">
            <a className="primary" href="#explorer">Explore the system <ChevronRight size={18}/></a>
            <a className="secondary" href="#format">Read the format</a>
          </div>
          <div className="principle"><span>THE PRINCIPLE</span><q>The league phase decides your competition. The knockout phase decides your champion.</q></div>
        </div>

        <div className="orbit-card" style={{ '--focus': focusColour } as React.CSSProperties}>
          <div className="orbit-halo" />
          <svg viewBox="0 0 420 420" role="img" aria-label="108 clubs arranged around the All-Europe League">
            <circle cx="210" cy="210" r="164" className="orbit-line" />
            <circle cx="210" cy="210" r="118" className="orbit-line inner" />
            {dots.map((dot) => {
              const x = 210 + Math.cos(dot.angle) * dot.ring
              const y = 210 + Math.sin(dot.angle) * dot.ring
              const destination = dot.rank <= 36 ? 'UCL' : dot.rank <= 72 ? 'UEL' : 'UECL'
              const colour = destinations.find((d) => d.id === destination)!.colour
              const active = focus === 'AEL' || focus === destination
              return <circle key={dot.rank} cx={x} cy={y} r={active ? 3.7 : 2.2} fill={colour} opacity={active ? .9 : .13}/>
            })}
          </svg>
          <div className="orbit-centre"><span>AEL</span><strong>108</strong><small>CLUBS</small></div>
          <div className="shield-badge"><Trophy size={15}/><span>1ST</span><strong>AEL SHIELD</strong></div>
        </div>
      </section>

      <section className="flow shell" id="format">
        <div><small>DOMESTIC MERIT</small><strong>108 qualifiers</strong></div><ArrowDown/>
        <div className="active"><small>AUG—DEC</small><strong>AEL league phase</strong></div><ArrowDown/>
        <div><small>JANUARY</small><strong>Three knockout paths</strong></div><ArrowDown/>
        <div><small>FEB—MAY</small><strong>European champions</strong></div>
      </section>

      <section className="explorer shell" id="explorer">
        <header className="section-head">
          <div><p className="eyebrow">FORMAT EXPLORER</p><h2>Zoom into the system</h2></div>
          <div className="seed"><span>SIMULATION SEED</span><strong>{seed}</strong><button onClick={() => setSeed(Math.floor(Math.random() * 900000) + 100000)} aria-label="Generate new seed"><RotateCcw size={15}/></button></div>
        </header>

        <div className="season-bar">
          <div><span>SEASON DATASET</span><strong>{season.label}</strong><small>{season.description}</small></div>
          <div className="season-options">
            {seasonDatasets.map((item) => <button key={item.id} className={seasonId === item.id ? 'active' : ''} onClick={() => setSeasonId(item.id)}>{item.shortLabel}</button>)}
          </div>
          <span className={`data-status ${season.status}`}>{season.statusLabel}</span>
        </div>
        <div className="dataset-proof" aria-live="polite">
          {manifest ? <><span><strong>{manifest.entryCount}</strong> field positions</span><span><strong>{manifest.uniqueClubCount}</strong> named clubs{manifest.snapshotAt ? ` · ${manifest.snapshotAt}` : ''}</span>{(['UCL','UEL','UECL'] as const).map((competition) => <span key={competition}><strong>{manifest.entries.filter((entry) => entry.sourceCompetition === competition).length}</strong> {competition}</span>)}<div>{manifest.entries.slice(0, 7).map((entry) => <i key={entry.id}>{entry.name}</i>)}</div></> : <span>{dataError || 'Loading season manifest…'}</span>}
        </div>

        <div className="mode-switch"><button className={resultMode === 'real' ? 'active' : ''} onClick={() => setResultMode('real')}><Database/>Real results</button><button className={resultMode === 'simulated' ? 'active' : ''} onClick={() => setResultMode('simulated')}><Zap/>Simulated results</button><span>{resultMode === 'real' ? 'Replay recorded historical outcomes' : 'Generate a reproducible alternative season'}</span></div>

        <div className={resultMode === 'simulated' ? 'balance-control' : 'balance-control disabled'}>
          <header><div><span>COMPETITIVE BALANCE</span><strong>{balanceLabel(balance)}</strong></div><small>Ratings decide which club is favoured; the slider decides how much that advantage matters.</small></header>
          <div className="balance-scale"><span>MORE RANDOM</span><input aria-label="Competitive balance" type="range" min="0" max="100" step="1" value={balance} disabled={resultMode === 'real'} onChange={(event) => setBalance(Number(event.target.value))}/><span>MORE HIERARCHICAL</span></div>
          <div className="probability-readout"><span><strong>{probabilities.favouredWin.toFixed(1)}%</strong> stronger wins</span><span><strong>{probabilities.draw.toFixed(1)}%</strong> draw</span><span><strong>{probabilities.underdogWin.toFixed(1)}%</strong> smaller wins</span></div>
        </div>

        <div className="playable-panel">
          <header><div><p className="eyebrow">FIRST PLAYABLE AEL SEASON</p><h3>{schedule ? `Matchweek ${completedMatchweeks} of 8` : 'Generate the 378-match schedule'}</h3><small>Ratings are provisional and replaceable. The visible seed reproduces fixtures and results.</small></div><div className="play-actions"><button onClick={buildSchedule} disabled={resultMode === 'real' || !probabilityValid || ratedClubs.length !== 108}>{schedule ? 'Regenerate schedule' : 'Generate schedule'}</button>{schedule && completedMatchweeks < 8 && <button className="advance" onClick={() => advanceTo(completedMatchweeks + 1)}>Play Matchweek {completedMatchweeks + 1}</button>}{schedule && completedMatchweeks < 8 && <button onClick={() => advanceTo(8)}>Simulate all</button>}</div></header>
          {resultMode === 'real' && <div className="real-notice">Historical fields are loaded. Recorded fixture/result ingestion is the next data adapter; Real mode never substitutes simulated scores.</div>}
          {schedule && <>
            <div className="week-progress">{schedule.matchweeks.map((fixtures, index) => <button key={index} className={`${completedMatchweeks >= index + 1 ? 'complete' : completedMatchweeks === index ? 'next' : ''} ${viewMatchweek === index + 1 ? 'viewing' : ''}`} onClick={() => setViewMatchweek(index + 1)}><span>MW {index + 1}</span><strong>{fixtures.length}</strong><small>matches</small></button>)}</div>
            <div className="season-toolbar">
              <button onClick={() => setViewMatchweek((week) => Math.max(1, week - 1))} disabled={viewMatchweek === 1} aria-label="Previous matchweek"><ChevronLeft/></button>
              <div><small>INSPECTING</small><strong>Matchweek {viewMatchweek}</strong><span>{aelMatchweeks2026[viewMatchweek - 1].dates}</span></div>
              <button onClick={() => setViewMatchweek((week) => Math.min(8, week + 1))} disabled={viewMatchweek === 8} aria-label="Next matchweek"><ChevronRight/></button>
              <div className="view-switch"><button className={seasonView === 'table' ? 'active' : ''} onClick={() => setSeasonView('table')}><Table2/>Table</button><button className={seasonView === 'fixtures' ? 'active' : ''} onClick={() => setSeasonView('fixtures')}><List/>Fixtures</button></div>
            </div>
            <div className="colour-legend"><span className="matchup-aa">A × A</span><span className="matchup-ab">A × B</span><span className="matchup-ac">A × C</span><span className="matchup-bc">B × C</span><span className="matchup-mixed">ALL THREE · MIXED WEEK</span></div>
            <div className={`season-stage ${seasonView}`}>
              {seasonView === 'table' ? <div className="ael-table">
                <header><span>#</span><span>CLUB</span><span>TIER</span><span>P</span><span>GD</span><span>PTS</span></header>
                {viewedSeason?.standings.map((row, index) => { const rank = index + 1; const route = januaryRouteForRank(rank); const relative = index % 36; const routeStart = [0,8,16,28].includes(relative); return <div className={`table-row destination-${index < 36 ? 'ucl' : index < 72 ? 'uel' : 'uecl'} route-${route} ${routeStart ? 'route-start' : ''} ${index === 36 || index === 72 ? 'destination-break' : ''} ${row.club.confirmed === false ? 'provisional-club' : ''}`} data-route-label={routeStart ? routeLabels[route] : undefined} key={row.club.id} title={row.club.qualificationLabel}><i>{rank}</i><span className="club-name"><ClubBadge club={row.club}/><ClubDisplayName club={row.club}/></span><small className={`tier-pill tier-${row.club.tier.toLowerCase()}`}>{row.club.tier}</small><span>{row.played}</span><span>{row.goalsFor - row.goalsAgainst > 0 ? '+' : ''}{row.goalsFor - row.goalsAgainst}</span><b>{row.points}</b></div> })}
              </div> : <div className="fixture-board">
                {schedule.matchweeks[viewMatchweek - 1].map((fixture) => <article className={matchupClass(fixture.home, fixture.away)} key={fixture.id}><span className="club"><ClubBadge club={fixture.home}/><ClubDisplayName club={fixture.home}/><small>{fixture.home.tier}</small></span><i>v</i><span className="club away"><ClubBadge club={fixture.away}/><ClubDisplayName club={fixture.away}/><small>{fixture.away.tier}</small></span></article>)}
              </div>}
            </div>
            <p className="crest-note">Official UEFA club imagery cached for this dated snapshot. Overlapping crests mark an unresolved qualifying path; hover a table row to inspect its route.</p>
            {completedMatchweeks === 8 && <div className="handoff"><span>AEL COMPLETE</span><strong>Open a competition’s January branch.</strong><div>{destinations.map((destination) => <button key={destination.id} style={{ '--accent': destination.colour } as React.CSSProperties} onClick={() => setKnockoutView(destination.id)}><GitBranch/> {destination.id} · {destination.range}</button>)}</div></div>}
            {knockoutPath && <KnockoutBracket path={knockoutPath} onClose={() => setKnockoutView(null)}/>}
          </>}
        </div>

        <div className={focus === 'AEL' ? 'destination-grid' : 'destination-grid focused'}>
          {destinations.map((item) => <button key={item.id} className={focus === item.id ? 'destination selected' : 'destination'} style={{ '--accent': item.colour } as React.CSSProperties} onClick={() => setFocus(focus === item.id ? 'AEL' : item.id)}>
            <span className="rank">{item.range}</span><span className="cup-code">{item.id}</span><strong>{item.name}</strong><small>{item.route}</small><span className="zoom">FOCUS <ChevronRight size={14}/></span>
          </button>)}
        </div>

        <div className={focusMeta ? 'focus-reveal visible' : 'focus-reveal'} style={{ '--accent': focusColour } as React.CSSProperties}>
          {focusMeta && <><button className="close-focus" onClick={() => setFocus('AEL')}>RETURN TO AEL</button><span>{focusMeta.range} · AEL TABLE</span><h3>{focusMeta.id} comes to the fore.</h3><p>The selected 36-club destination now owns the stage. Its January ladder uses the same sporting logic as the other competitions, while the other paths recede without disappearing from the system.</p><div><strong>1–8</strong> direct · <strong>9–16</strong> one win · <strong>17–28</strong> two wins · <strong>29–36</strong> three wins</div></>}
        </div>

        <div className="january-panel">
          <div className="january-copy"><p className="eyebrow">EUROPEAN KNOCKOUT MONTH</p><h3>The January backdoor</h3><p>Every club remains alive. A lower finish does not send a club into another competition—it creates a longer, harder route inside the competition it earned.</p><span className="applies">IDENTICAL IN UCL · UEL · UECL</span></div>
          <div className="ladder">
            <div><span>29–36</span><strong>Wild Card</strong><small>3 wins needed</small></div><ChevronRight/>
            <div><span>17–28</span><strong>Qualification</strong><small>2 wins needed</small></div><ChevronRight/>
            <div><span>9–16</span><strong>Final Playoff</strong><small>1 win needed</small></div><ChevronRight/>
            <div className="final"><span>1–8</span><strong>Round of 16</strong><small>Direct entry</small></div>
          </div>
        </div>

        <div className="calendar-panel">
          <header><div><p className="eyebrow">WORKING 2026 CALENDAR</p><h3>Eight matchweeks. Finished by Christmas.</h3></div><span><CalendarDays/>378 AEL matches</span></header>
          <div className="matchweeks">{aelMatchweeks2026.map((week) => <div key={week.id}><span>MW {week.id}</span><strong>{week.dates}</strong><small>{week.matches} matches</small></div>)}</div>
          <p>Tier A plays all eight matchweeks. Tier B receives one scheduled bye; Tier C receives two. Exact dates remain a modelling assumption and must be tested against domestic cups, policing, venue and rest constraints.</p>
        </div>

        <div className="advantage-panel"><div><p className="eyebrow">MERIT CARRIES FORWARD</p><h3>Higher finish, stronger ground advantage.</h3></div><div className="advantage-rules"><span><strong>JANUARY</strong>Higher AEL seed hosts every single-match tie.</span><span><strong>R16 · QF · SF</strong>Higher original AEL seed plays the second leg at home.</span><span><strong>FINAL</strong>Neutral venue. No ranking advantage.</span></div></div>
      </section>

      <section className="method shell" id="method">
        <div><p className="eyebrow">OPEN DEVELOPMENT</p><h2>A format to test, not a claim to accept.</h2></div>
        <p>The simulation engine will compare ranking methods, schedule strength and match-load effects in public. Every run will be reproducible by version, dataset, settings and seed.</p>
        <a href="https://github.com/johndtwaldron/all-europe-league">View source <ChevronRight size={16}/></a>
      </section>

      <footer className="shell"><span>AEL · ALL-EUROPE LEAGUE</span><p>Independent competition-design prototype. Not affiliated with UEFA.</p><span>BUILT IN THE OPEN</span></footer>
    </main>
  )
}
