import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ChevronRight, RotateCcw, Shield, Sparkles, Trophy, Zap } from 'lucide-react'
import { seasonDatasets } from './data/seasons'
import { loadSeasonManifest, type SeasonManifest } from './data/dataset'

type Scenario = 'Hierarchy' | 'Balanced' | 'Chaos'
type Focus = 'AEL' | 'UCL' | 'UEL' | 'UECL'

const destinations = [
  { id: 'UCL' as const, range: '1–36', name: 'Champions League', colour: '#39a7ff', route: 'Elite destination' },
  { id: 'UEL' as const, range: '37–72', name: 'Europa League', colour: '#ff9f43', route: 'Continental challenge' },
  { id: 'UECL' as const, range: '73–108', name: 'Conference League', colour: '#36d39a', route: 'Open European path' },
]

const scenarios: { name: Scenario; description: string; icon: typeof Shield }[] = [
  { name: 'Hierarchy', description: 'Established strength usually holds.', icon: Shield },
  { name: 'Balanced', description: 'Credible movement with real jeopardy.', icon: Sparkles },
  { name: 'Chaos', description: 'Giants fall. Outsiders surge.', icon: Zap },
]

const dots = Array.from({ length: 108 }, (_, index) => ({
  rank: index + 1,
  angle: (index / 108) * Math.PI * 2,
  ring: 118 + (index % 6) * 11,
}))

export function App() {
  const [scenario, setScenario] = useState<Scenario>('Balanced')
  const [focus, setFocus] = useState<Focus>('AEL')
  const [seed, setSeed] = useState(260826)
  const [seasonId, setSeasonId] = useState('2026-27')
  const [manifest, setManifest] = useState<SeasonManifest | null>(null)
  const [dataError, setDataError] = useState('')

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
          {manifest ? <><span><strong>{manifest.entryCount}</strong> verified entries</span><span><strong>{manifest.uniqueClubCount}</strong> resolved clubs</span>{(['UCL','UEL','UECL'] as const).map((competition) => <span key={competition}><strong>{manifest.entries.filter((entry) => entry.sourceCompetition === competition).length}</strong> {competition}</span>)}<div>{manifest.entries.slice(0, 7).map((entry) => <i key={entry.id}>{entry.name}</i>)}</div></> : <span>{dataError || 'Loading season manifest…'}</span>}
        </div>

        <div className="scenario-grid">
          {scenarios.map(({ name, description, icon: Icon }) => <button key={name} className={scenario === name ? 'scenario selected' : 'scenario'} onClick={() => setScenario(name)}><Icon/><span><strong>{name}</strong><small>{description}</small></span>{scenario === name && <i>ACTIVE</i>}</button>)}
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
