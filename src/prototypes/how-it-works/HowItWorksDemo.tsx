import { useCallback, useEffect, useRef, useState, type CSSProperties, type DragEvent, type PointerEvent, type ReactNode } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  animate as tween,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from 'motion/react'
import { combos, fieldEdges, fieldNodes, type Combo, type SourceId } from './bladeData'
import { DeasyLogo } from './DeasyLogo'

/* ── The latest blade's flow, in Gunmetal's dress ─────────────────────────
 * Connect any of the sources to Deasy, Read them against seven
 * quality checks, Curate them in one timeline, then Activate: the agent's
 * question walks the entity graph across systems to a cited answer.
 *
 * The three steps are one machine rather than three slides. They share a
 * header and a frame; Read's pile is the pile Curate filters, its count is
 * the count Curate runs down, its checks are the ones Curate resolves; and
 * the files that survive are the ones the agent answers from.
 */

type Source = { id: SourceId; name: string; count: string; unit: 'files' | 'pages'; etch: string }

const sources: readonly Source[] = [
  { id: 's3', name: 'S3 bucket', count: '412,000', unit: 'files', etch: '/brand/integrations/amazon-s3-etch.png' },
  { id: 'sp', name: 'SharePoint site', count: '186,000', unit: 'files', etch: '/brand/integrations/sharepoint.svg' },
  { id: 'gcs', name: 'GCS bucket', count: '524,000', unit: 'files', etch: '/brand/integrations/google-cloud-storage-etch.svg' },
  { id: 'cf', name: 'Confluence space', count: '68,000', unit: 'pages', etch: '/brand/integrations/confluence.svg' },
]
const sourceById = Object.fromEntries(sources.map((source) => [source.id, source])) as Record<SourceId, Source>
const sourceOrder = sources.map((source) => source.id)
/* A combination is keyed in list order, the way the blade keys its figures. */
const comboKey = (ids: readonly SourceId[]) => [...ids].sort((a, b) => sourceOrder.indexOf(a) - sourceOrder.indexOf(b)).join('_')
const unitOf = (ids: readonly SourceId[]) => (ids.length === 1 ? sourceById[ids[0]].unit : 'files')
const toNumber = (figure: string) => Number(figure.replace(/,/g, ''))
/* Figures read at a glance: 412K, 1.19M. */
const abbreviate = (value: number) =>
  value >= 1e6 ? `${(value / 1e6).toFixed(2).replace(/\.?0+$/, '')}M` : value >= 1000 ? `${Math.round(value / 1000)}K` : `${Math.round(value)}`
const short = (figure: string) => abbreviate(toNumber(figure))

/* The blade publishes figures for one source and for pairs; its pairs are
   the sums of their sources, so three or four are summed the same way. */
const comboFor = (ids: readonly SourceId[]): Combo => {
  const known = combos[comboKey(ids)]
  if (known) return known
  const parts = ids.map((id) => combos[id])
  const total = (pick: (combo: Combo) => string) => parts.reduce((sum, part) => sum + toNumber(pick(part)), 0)
  const count = total((part) => part.count)
  const figure = (value: number) => value.toLocaleString('en-US')
  return {
    count: figure(count),
    dims: parts[0].dims.map((_, index) => Math.round(parts.reduce((sum, part) => sum + part.dims[index] * toNumber(part.count), 0) / count)),
    counts: [0, 1, 2, 3, 4].map((beat) => figure(total((part) => part.counts[beat]))) as unknown as Combo['counts'],
    systems: combos[ids[0]].systems,
  }
}
const countLabel = (n: number) => (n === 1 ? '1 source connected' : `${n} sources connected`)

/* A fixed hash stands in for randomness, so the pile scatters like a real
   folder but draws the same every time. */
const scatter = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}
const paperOf = (index: number) => Math.floor(scatter(index, 3) * 4)

/* Read's sweep crosses the pile left to right in this many seconds. */
const READ_SWEEP = 1.4
const PILE_COLUMNS = 15
const sweepOf = (index: number) => Math.round(((index % PILE_COLUMNS) / PILE_COLUMNS) * READ_SWEEP * 820 + scatter(index, 7) * 120)

const stepNames = ['Read', 'Curate', 'Activate'] as const
type Phase = 'connect' | 'read' | 'curate' | 'activate'
type RunPhase = Exclude<Phase, 'connect'>
const stepOf: Record<Phase, number> = { connect: -1, read: 0, curate: 1, activate: 2 }

const MORPH = { type: 'spring', duration: 0.4, bounce: 0 } as const
/* Entrances settle out of a steep start; things already on screen that
   move, or trade places, accelerate and brake. */
const EASE = [0.19, 1, 0.22, 1] as const
const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const

/* ── The pile ───────────────────────────────────────────────────────────────
   Sixty sheets, twelve of them sound. Read tabs each problem sheet with
   what is wrong with it; Curate removes it in the beat that names that
   problem; the twelve that are left go on to the agent. */

type Kind = 'dup' | 'old' | 'sen' | 'sta' | 'keep'
const kinds: readonly Kind[] = (
  'dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup ' +
  'dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup ' +
  'dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup'
).split(' ') as Kind[]
/* An old version is a kind of duplicate, so it carries the same tab. */
const tabOf: Record<Kind, 'dup' | 'sen' | 'sta' | null> = { dup: 'dup', old: 'dup', sen: 'sen', sta: 'sta', keep: null }

/* Curate's timeline, in seconds: four beats, then the result. */
const BEAT = 0.65
const CATCH_AT = 0.15
const CATCH_SPREAD = 0.2
const KEEP_AT = 4.65
const beatOfSheet = (kind: Exclude<Kind, 'keep'>, index: number) =>
  kind === 'dup' ? 0 : kind === 'sen' ? 1 : kind === 'sta' ? 2 + index % 2 : 4 + index % 3
const sheets = kinds.map((kind, index) => ({
  kind,
  at: kind === 'keep' ? KEEP_AT : beatOfSheet(kind, index) * BEAT + CATCH_AT + scatter(index, 4) * CATCH_SPREAD,
}))
const keptIds = sheets.flatMap((sheet, index) => (sheet.kind === 'keep' ? [index] : []))
const keptNames = [
  'Master_Agreement_v4.pdf', 'Renewal_Terms_2025.docx', 'Enterprise_Tier_Pricing.xlsx', 'Dec_2024_Cohort.csv',
  'Order_Form_Template.docx', 'Security_Overview.pdf', 'Support_Runbook.md', 'Data_Retention_Policy.pdf',
  'Notice_Periods.xlsx', 'Customer_Success_Playbook.pdf', 'SLA_Schedule.pdf', 'Billing_FAQ.md',
]
/* The answer cites a survivor from each source it spans, and at least three. */
const citedFor = (systems: number) => keptIds.slice(0, Math.max(3, systems))

const fileNames = [
  'Master_Agreement', 'Renewal_Terms', 'Enterprise_Tier_Pricing', 'Order_Form', 'Security_Overview',
  'Support_Runbook', 'Onboarding_Guide', 'Vendor_Contract', 'Roadmap', 'Incident_Review',
]
const sensitiveNames = ['payroll_export_2024.csv', 'customer_emails.xlsx', 'offer_letter_JSmith.pdf', 'passport_scan.pdf', 'vendor_bank_details.xlsx']
const found: Record<Kind, string> = { dup: 'Duplicate', old: 'Old version', sen: 'Sensitive data', sta: 'Stale', keep: 'No issues found' }

/* A sheet keeps its name from Read to Curate; only the verdict changes. */
const describeSheet = (id: number, curating: boolean) => {
  const { kind } = sheets[id]
  const base = fileNames[id % fileNames.length]
  const name = {
    dup: `${base} (copy ${2 + (id % 3)}).pdf`,
    old: `${base}_v${1 + (id % 3)}_OLD.docx`,
    sen: sensitiveNames[id % sensitiveNames.length],
    sta: `${base}_2019.pptx`,
    keep: keptNames[keptIds.indexOf(id) % keptNames.length],
  }[kind]
  const reason = kind === 'keep' ? (curating ? 'Kept' : found.keep) : curating ? `Removed: ${found[kind].toLowerCase()}` : found[kind]
  return { name, reason, tone: kind }
}

/* The seven checks, in the blade's order, and the Curate beat that clears
   each. The three a sheet can carry as a tab keep their tab's colour. */
const checks = [
  { key: 'dup', label: 'Duplicates', clears: 0 },
  { key: 'sta', label: 'Stale', clears: 2 },
  { key: 'sen', label: 'Sensitive', clears: 1 },
  { key: 'off', label: 'Off-topic', clears: 3 },
  { key: 'met', label: 'Missing metadata', clears: 4 },
  { key: 'inc', label: 'Incomplete', clears: 5 },
  { key: 'con', label: 'Contains conflicting information', clears: 6 },
] as const

/* ── Marks ──────────────────────────────────────────────────────────────── */

function Etch({ source }: { source: Source }) {
  return <span className="source-etch" style={{ '--etch': `url("${source.etch}")` } as CSSProperties} aria-hidden="true" />
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  )
}

/* Deasy at the centre of the first screen: dormant until a source
   connects, then transitions to colour without moving.
   The sources that are in sit beneath it. */
function DeasyHub({ ids }: { ids: readonly SourceId[] }) {
  return (
    <div className={`hub ${ids.length ? 'live' : ''}`}>
      <span className="hub-logo">
        <DeasyLogo />
      </span>
      <div className="hub-sources">
        <span className="hub-hint" hidden={ids.length > 0}>Click a source to connect</span>
        <AnimatePresence initial={false}>
          {ids.map((id) => (
            <motion.span
              className="hub-source"
              aria-hidden="true"
              layoutId={`src-${id}`}
              key={id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={MORPH}
            >
              <Etch source={sourceById[id]} />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SourceCard({ source, connected, onToggle }: { source: Source; connected: boolean; onToggle: (id: SourceId) => void }) {
  const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData('text/plain', source.id)
    event.dataTransfer.effectAllowed = 'link'
  }

  return (
    <button
      className={`source-card ${connected ? 'connected' : ''}`}
      type="button"
      draggable
      aria-pressed={connected}
      onClick={() => onToggle(source.id)}
      onDragStart={onDragStart}
      aria-label={`${source.name}, ${short(source.count)} ${source.unit}${connected ? ', connected' : ''}`}
    >
      <span className="source-icon"><Etch source={source} /></span>
      <span className="source-copy">
        <span className="source-name">{source.name}</span>
        <span className="source-meta">{short(source.count)} {source.unit}</span>
      </span>
      <span className="source-badge" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={connected ? 'M3.5 8.5 6.5 11.5 12.5 4.5' : 'M8 3.5v9M3.5 8h9'} />
        </svg>
        <span>{connected ? 'Connected' : 'Connect'}</span>
      </span>
    </button>
  )
}

function Stepper({ phase }: { phase: number }) {
  return (
    <div className="stepper" aria-label={phase < 0 ? 'Three steps: Read, Curate, Activate' : `Step ${phase + 1} of 3: ${stepNames[phase]}`}>
      {stepNames.map((name, index) => (
        <div className="step-fragment" key={name}>
          <div
            aria-current={index === phase ? 'step' : undefined}
            className={`step ${index === phase ? 'active' : ''} ${index < phase ? 'done' : ''}`}
          >
            <span className="step-dot">{index < phase ? '✓' : index + 1}</span>
            <span className="step-name">{name}</span>
          </div>
          {index < stepNames.length - 1 ? <span aria-hidden="true" className={`step-line ${index < phase ? 'done' : ''}`} /> : null}
        </div>
      ))}
    </div>
  )
}

/* One header for every step: the open link on the left, the steps in the
   middle, and an empty cell that keeps them centred. */
function RunHead({ ids, phase }: { ids: readonly SourceId[]; phase: number }) {
  return (
    <div className="run-head">
      {phase >= 0 ? (
        <div className="linkstrip" aria-label={`${ids.map((id) => sourceById[id].name).join(', ')} connected to Deasy`}>
          <span className="lk-sources" aria-hidden="true">
            {ids.map((id) => (
              <motion.span className="lk-source" layoutId={`src-${id}`} transition={MORPH} key={id}><Etch source={sourceById[id]} /></motion.span>
            ))}
          </span>
          <span className="lk-pipe" aria-hidden="true" />
          <motion.span className="lk-mark" layoutId="deasy-mark" transition={MORPH} aria-hidden="true"><DeasyLogo /></motion.span>
        </div>
      ) : <div className="linkstrip linkstrip-placeholder" aria-hidden="true" />}
      <Stepper phase={phase} />
      <span />
    </div>
  )
}

/* ── File tooltip ───────────────────────────────────────────────────────── */

type Hover = { id: number; align: 'start' | 'center' | 'end' }

/**
 * One tooltip for a whole pile, pinned to the cursor through motion values
 * so following the pointer never re-renders the pile. React only hears
 * about it when the file under the pointer changes.
 */
function FilePile({
  className,
  describe,
  children,
}: {
  className: string
  describe: (id: number) => { name: string; reason: string; tone: string }
  children: ReactNode
}) {
  const [hovered, setHovered] = useState<Hover | null>(null)
  const tipX = useMotionValue(0)
  const tipY = useMotionValue(0)

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    tipX.set(x)
    tipY.set(event.clientY - rect.top)
    const id = (event.target as HTMLElement).closest<HTMLElement>('[data-id]')?.dataset.id
    const align = x < rect.width * 0.25 ? 'start' : x > rect.width * 0.75 ? 'end' : 'center'
    if (id !== undefined && (Number(id) !== hovered?.id || align !== hovered.align)) {
      setHovered({ id: Number(id), align })
    }
  }

  const info = hovered ? describe(hovered.id) : null

  return (
    <div className={`${className} file-pile`} onPointerMove={onPointerMove} onPointerLeave={() => setHovered(null)}>
      {children}
      <AnimatePresence>
        {info && hovered ? (
          <motion.div
            className="file-tip"
            aria-hidden="true"
            data-align={hovered.align}
            style={{ x: tipX, y: tipY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.12 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <span className="file-tip-name">{info.name}</span>
            <span className="file-tip-reason" data-tone={info.tone}>{info.reason}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/* ── Connect ────────────────────────────────────────────────────────────── */

function ConnectedPanel({ ids, onRead, showHeader = true }: { ids: readonly SourceId[]; onRead: () => void; showHeader?: boolean }) {
  return (
    <div className="report-panel connect-panel">
      {showHeader ? <RunHead ids={ids} phase={-1} /> : null}
      <div className="connect-body">
        <DeasyHub ids={ids} />
      </div>
      <div className="report-footer actions-only" style={{ visibility: ids.length ? 'visible' : 'hidden' }}>
        <div className="footer-actions">
          <button className="button button-primary with-arrow" disabled={!ids.length} type="button" onClick={onRead}>Read it</button>
        </div>
      </div>
    </div>
  )
}

/* ── Read and Curate: one pile, one count, one checklist ────────────────── */

function QualityPercent({ initial, resolving }: { initial: number; resolving: boolean }) {
  const reduced = useReducedMotion()
  const value = useMotionValue(initial)
  const label = useTransform(value, (n) => `${Math.round(n)}%`)
  useEffect(() => {
    if (reduced) { value.set(resolving ? 0 : initial); return }
    const controls = tween(value, resolving ? 0 : initial, { duration: BEAT * 0.8, ease: EASE_IN_OUT })
    return () => controls.stop()
  }, [initial, resolving, reduced, value])
  return <motion.strong className="quality-pct">{label}</motion.strong>
}

function PileStage({ ids, combo, phase }: { ids: readonly SourceId[]; combo: Combo; phase: 'read' | 'curate' }) {
  const reduceMotion = useReducedMotion()
  const curating = phase === 'curate'
  const unit = unitOf(ids)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  /* Each quality dimension gets one Curate beat. */
  const [beat, setBeat] = useState(-1)
  const [gathered, setGathered] = useState(false)
  const done = gathered
  /* Read opens on the sweep: the count climbs from nothing while each sheet
     picks up its tabs, column by column. Curate reopened from Activate
     starts from the full count instead. */
  const [readingActive, setReading] = useState(!curating && !reduceMotion)
  const reading = readingActive && !curating

  /* The count runs down from what Read found to what survives, one beat's
     worth at a time. */
  const count = useMotionValue(reading ? 0 : toNumber(combo.count))
  useEffect(() => {
    if (!reading) return
    const controls = tween(count, toNumber(combo.count), { duration: READ_SWEEP, ease: EASE_IN_OUT })
    const timer = window.setTimeout(() => setReading(false), READ_SWEEP * 1000)
    return () => {
      controls.stop()
      window.clearTimeout(timer)
    }
  }, [reading, combo, count])
  const shown = useTransform(count, abbreviate)
  useEffect(() => {
    if (beat < 0) return
    const progress = Math.min((beat + 1) * 4 / checks.length, 4)
    const from = Math.floor(progress)
    const start = toNumber(combo.counts[from])
    const target = start + (toNumber(combo.counts[Math.min(from + 1, 4)]) - start) * (progress - from)
    if (reduceMotion) {
      count.set(target)
      return
    }
    const controls = tween(count, target, { duration: BEAT * 0.75, ease: EASE_IN_OUT })
    return () => controls.stop()
  }, [beat, combo, count, reduceMotion])

  useEffect(() => {
    if (!curating) return
    if (reduceMotion) {
      setBeat(checks.length)
      setGathered(true)
      return
    }
    count.set(toNumber(combo.count))
    let live = true
    const timers = Array.from({ length: checks.length + 1 }, (_, next) => window.setTimeout(() => setBeat(next), next * BEAT * 1000))
    const running: AnimationPlaybackControls[] = []
    const track = (controls: AnimationPlaybackControls) => {
      running.push(controls)
      return controls
    }
    const all = (selector: string) => Array.from(scope.current.querySelectorAll<HTMLElement>(selector))

    /* A caught sheet flashes its tab's colour, shrinks and fades, then
       comes back faintly as the outline it leaves in the pile. */
    const catchSheet = async (sheet: HTMLElement) => {
      await track(animate(sheet, { scale: [1, 1.04, 0.9], opacity: [1, 1, 0], '--catch': [0, 1, 0] }, { duration: 0.55, delay: Number(sheet.dataset.at), times: [0, 0.35, 1], ease: EASE }))
      if (!live) return
      sheet.dataset.removed = ''
      await track(animate(sheet, { opacity: 0.5 }, { duration: 0.2, ease: 'easeOut' }))
    }

    const steps = [
      ...all('.run-pile > [data-kind="keep"]').map((sheet) =>
        track(animate(sheet, { scale: [1, 1.05, 1], '--catch': [0, 1, 1] }, { duration: 0.5, delay: KEEP_AT, ease: EASE })),
      ),
      ...all('.run-pile > [data-kind]:not([data-kind="keep"])').map(catchSheet),
    ]
    Promise.all(steps).then(() => {
      if (live) setGathered(true)
    })
    return () => {
      live = false
      timers.forEach(window.clearTimeout)
      running.forEach((controls) => controls.stop())
    }
  }, [curating, reduceMotion, animate, scope, count, combo.count])

  return (
    <div className={`run-body pile-stage ${curating ? 'is-curating' : ''}`} ref={scope}>
      <div className="pile-main">
        <div className={`hero ${done ? 'done' : ''}`} aria-live="polite">
          <motion.span className="hero-n" aria-label={done ? `${short(combo.counts[4])} ${unit} meet quality standards` : undefined}>{shown}</motion.span>
          <span className="hero-status" aria-hidden={curating || undefined} style={curating ? { visibility: 'hidden' } : undefined}>{unit} read</span>
        </div>
        <FilePile className={`document-swarm filter-swarm run-pile ${gathered ? 'gathered' : ''} ${reading ? 'reading' : ''}`} describe={(id) => describeSheet(id, curating)}>
          {sheets.map(({ kind, at }, index) => {
            const tab = tabOf[kind]
            if (kind === 'keep') {
              return gathered ? (
                <span className="filter-file vacated" data-kind={kind} key={index} />
              ) : (
                <motion.span className={`filter-file ${curating ? 'keep' : ''}`} layoutId={`doc-${index}`} transition={MORPH} data-kind={kind} data-paper={paperOf(index)} data-id={index} key={index} />
              )
            }
            return (
              <span
                className={`filter-file ${kind}`}
                data-kind={kind}
                data-at={at}
                data-paper={paperOf(index)}
                data-id={index}
                style={{ '--sweep': `${sweepOf(index)}ms` } as CSSProperties}
                key={index}
              >
                {tab ? <span className="file-flags" aria-hidden="true"><i data-flag={tab} /></span> : null}
              </span>
            )
          })}
          {gathered ? (
            <div className="filter-result" key="result">
              {keptIds.map((id) => (
                <motion.span className="filter-file keep" layoutId={`doc-${id}`} transition={MORPH} data-paper={paperOf(id)} data-id={id} key={id} />
              ))}
            </div>
          ) : null}
        </FilePile>
      </div>
      <div className="quality">
        <p className="eyebrow quality-head">Quality check</p>
        <ul className="quality-list">
          {checks.map((check, index) => ({ check, index })).sort((a, b) => a.check.clears - b.check.clears).map(({ check, index }) => {
            const cleared = curating && beat > check.clears
            const active = curating && beat === check.clears
            return (
              <li className={`quality-row ${cleared ? 'cleared' : ''} ${active ? 'active' : ''}`} data-dim={check.key} key={check.key}>
                <span className="quality-name">{check.label}</span>
                <QualityPercent initial={combo.dims[index]} resolving={curating && beat >= check.clears} />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/* ── Activate ───────────────────────────────────────────────────────────── */

const QUERY = ['What are the renewal terms for enterprise customers', 'whose subscriptions started in December 2024?'] as const
/* When each line starts typing and how long it takes, in seconds. */
const TYPE_LINES = [[0.25, 0.78], [1.05, 0.7]] as const
const ANSWER_AT = 3.15

/* Types the question out a character at a time. Reduced motion shows it. */
function useTypedQuery() {
  const reduceMotion = useReducedMotion()
  const [typed, setTyped] = useState<[number, number]>([0, 0])
  useEffect(() => {
    if (reduceMotion) return
    const started = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = (now - started) / 1000
      const next = TYPE_LINES.map(([at, duration], line) =>
        Math.round(Math.min(1, Math.max(0, (t - at) / duration)) * QUERY[line].length),
      ) as [number, number]
      setTyped((current) => (current[0] === next[0] && current[1] === next[1] ? current : next))
      if (next[1] < QUERY[1].length) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [reduceMotion])
  return reduceMotion ? ([QUERY[0].length, QUERY[1].length] as const) : typed
}

/* The answer's path through the graph, each node lit in turn. */
type LabelPlace = { lx: number; ly: number; anchor: 'start' | 'middle' | 'end' }
/* `narrow` moves a label that the phone crop would cut off. */
type PathNode = LabelPlace & { x: number; y: number; label: string; at: number; narrow?: LabelPlace }
const pathNodes: PathNode[] = [
  { x: 141.5, y: 126.7, label: 'Master agreement v4', at: 1.9, lx: 131, ly: 119, anchor: 'end', narrow: { lx: 132, ly: 111, anchor: 'start' } },
  { x: 162.9, y: 148.7, label: 'Renewal terms', at: 2.2, lx: 174, ly: 146, anchor: 'start' },
  { x: 226.1, y: 172.7, label: 'Dec 2024 cohort', at: 2.5, lx: 226.1, ly: 194, anchor: 'middle' },
  { x: 439.7, y: 182.6, label: 'Enterprise tier', at: 2.8, lx: 439.7, ly: 167, anchor: 'middle' },
]
const pathEdges = [0, 1, 2].map((index) => ({ from: pathNodes[index], to: pathNodes[index + 1], at: 1.95 + index * 0.3 }))

/* The graph's columns are the connected systems: one spans the field, two
   split it where the answer's path crosses from the first to the second. */
const captionsFor = (systems: readonly string[]) =>
  systems.length === 1
    ? [{ name: systems[0], x: 310 }]
    : systems.length === 2
      ? [{ name: systems[0], x: 106 }, { name: systems[1], x: 416 }]
      : systems.map((name, index) => ({ name, x: Math.round((620 * (index + 0.5)) / systems.length) }))

/* On a phone the whole field is too small to read, so the graph closes in
   on the answer's path. */
function useNarrow() {
  const query = '(max-width: 640px)'
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = () => setNarrow(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [])
  return narrow
}

function EntityGraph({ systems }: { systems: readonly string[] }) {
  const reduceMotion = useReducedMotion()
  const narrow = useNarrow()
  const reveal = (at: number) => (reduceMotion ? { initial: false } : { transition: { delay: at, duration: 0.3, ease: EASE } })
  return (
    <svg className="graph-svg" viewBox={narrow ? '70 96 440 132' : '0 0 620 244'} role="img" aria-label={`Entity graph across ${systems.join(', ')}, with the answer's path lit`}>
      <g className="gfield">
        {fieldEdges.map(([x1, y1, x2, y2, dashed], index) => (
          <line className={`ge ${dashed ? 'dashed' : ''}`} x1={x1} y1={y1} x2={x2} y2={y2} key={index} />
        ))}
        {fieldNodes.map(([cx, cy, column], index) => <circle className="gn" data-col={column} cx={cx} cy={cy} r={2.6} key={index} />)}
      </g>
      {narrow
        ? null
        : captionsFor(systems).map(({ name, x }) => (
            <text className="xcap" x={x} y={18} textAnchor="middle" key={name}>{name}</text>
          ))}
      {pathEdges.map(({ from, to, at }) => (
        <motion.line
          className="ge on"
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          {...reveal(at)}
          key={at}
        />
      ))}
      {pathNodes.map(({ narrow: cropped, ...node }) => ({ ...node, ...(narrow ? cropped : undefined) })).map((node) => (
        <motion.g className="gnode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} {...reveal(node.at)} key={node.label}>
          <circle className="ghalo" cx={node.x} cy={node.y} r={10} />
          <circle className="gn lit" cx={node.x} cy={node.y} r={4} />
          <text className="glabel" x={node.lx} y={node.ly} textAnchor={node.anchor}>{node.label}</text>
        </motion.g>
      ))}
      {/* Answering it leaves the graph one connection richer. */}
      <g className="mnode">
        <line className="medge" x1={439.7} y1={182.6} x2={479.7} y2={216.6} />
        <circle className="gn new" cx={479.7} cy={216.6} r={3.4} />
      </g>
    </svg>
  )
}

function ActivateStage({ ids, combo }: { ids: readonly SourceId[]; combo: Combo }) {
  const systems = ids.map((id) => sourceById[id].name)
  const citedIds = citedFor(systems.length)
  const typed = useTypedQuery()
  const reduceMotion = useReducedMotion()
  const [answered, setAnswered] = useState(Boolean(reduceMotion))
  useEffect(() => {
    if (reduceMotion) return
    const timer = window.setTimeout(() => setAnswered(true), ANSWER_AT * 1000)
    return () => window.clearTimeout(timer)
  }, [reduceMotion])
  const arrive = (at: number) =>
    reduceMotion ? { initial: false as const } : { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: at, duration: 0.28, ease: EASE } }
  const typing = typed[1] < QUERY[1].length

  return (
    <div className="run-body activate-stage">
      <motion.div className="ai-query chat-composer" {...arrive(0)}>
        <span className="query-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span className="chat-composer-text">
          <span className="typed-query" aria-label={QUERY.join(' ')}>
            {QUERY.map((line, index) => (
              <span className="typed-line" aria-hidden="true" key={index}>
                {line.slice(0, typed[index])}
                {typing && (index === 1 ? typed[0] === QUERY[0].length : typed[0] < QUERY[0].length) ? <span className="caret" /> : null}
              </span>
            ))}
          </span>
        </span>
        <span className="chat-composer-connectors">
          <span className="connector connector-deasy">
            <DeasyLogo className="connector-logo" />
          </span>
        </span>
      </motion.div>
      <div className="activate-grid">
        <div className="activate-context">
          {/* What Curate kept is what the agent reads from; the three it
              answers with are marked when the answer lands. */}
          <div className="context-strip">
            <span className="kept-strip">
              {keptIds.map((id) => (
                <motion.span
                  className={`filter-file keep ${answered && citedIds.includes(id) ? 'cited' : ''}`}
                  layoutId={`doc-${id}`}
                  transition={MORPH}
                  data-paper={paperOf(id)}
                  key={id}
                />
              ))}
            </span>
            <span className="context-caption">{short(combo.counts[4])} curated {unitOf(ids)}</span>
          </div>
          <motion.div className="graph-wrap" {...arrive(1.6)}>
            <EntityGraph systems={systems} />
          </motion.div>
        </div>
        <motion.div className="answer good-answer" {...arrive(ANSWER_AT)} aria-live="polite">
          <div className="verdict">{systems.length > 1 ? `From ${systems.length} sources` : `From your ${systems[0]}`}</div>
          <p>
            Those accounts renew on a <strong>12-month term with 60 days’ notice</strong>, under v4 of the master agreement.
            Subscriptions that started before November 2024 stay on the legacy 30-day notice.
          </p>
          <div className="citation"><DocumentIcon /> {citedIds.length} cited files</div>
        </motion.div>
      </div>
    </div>
  )
}

/* ── The run: one frame from Read to Activate ───────────────────────────── */

function RunPanel({
  ids,
  combo,
  phase,
  epoch,
  onBack,
  onNext,
  showHeader = true,
}: {
  ids: readonly SourceId[]
  combo: Combo
  phase: RunPhase
  epoch: number
  onBack: () => void
  onNext: () => void
  showHeader?: boolean
}) {
  return (
    <div className="report-panel run-panel" data-phase={phase}>
      {showHeader ? <RunHead ids={ids} phase={stepOf[phase]} /> : null}
      {phase === 'activate' ? <ActivateStage ids={ids} combo={combo} /> : <PileStage ids={ids} combo={combo} phase={phase} key={epoch} />}
      {phase === 'activate' ? (
        <div className="retrieve-footer">
          <button className="button button-ghost" type="button" onClick={onBack}>Back</button>
          <a className="button button-primary with-arrow" href="https://www.deasylabs.com/demo">
            <span className="desktop-button-label">See it on your data</span>
            <span className="mobile-button-label">See demo</span>
          </a>
        </div>
      ) : (
        <div className="report-footer actions-only">
          <div className="footer-actions">
            <button className="button button-ghost" type="button" onClick={onBack}>Back</button>
            <button className="button button-primary with-arrow" type="button" onClick={onNext}>
              {phase === 'read' ? 'Curate it' : 'Ask your agent'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── The blade ──────────────────────────────────────────────────────────── */

export function HowItWorksDemo({ fixedHeader = false }: { fixedHeader?: boolean }) {
  const [connected, setConnected] = useState<SourceId[]>([])
  const [phase, setPhase] = useState<Phase>('connect')
  /* Going back to Read starts the pile over. */
  const [epoch, setEpoch] = useState(0)
  const [dropActive, setDropActive] = useState(false)
  const scannerRef = useRef<HTMLDivElement>(null)
  const sourcesRef = useRef<HTMLDivElement>(null)
  const combo = connected.length ? comboFor(connected) : undefined
  const running = phase !== 'connect' && combo

  /* A tap connects a source, or disconnects one that is already in. */
  const toggle = useCallback((id: SourceId) => {
    setPhase('connect')
    setConnected((current) =>
      current.includes(id) ? current.filter((other) => other !== id) : [...current, id],
    )
  }, [])

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDropActive(false)
    const id = event.dataTransfer.getData('text/plain')
    if (Object.hasOwn(sourceById, id) && !connected.includes(id as SourceId)) toggle(id as SourceId)
  }

  const changeSource = () => {
    setPhase('connect')
    requestAnimationFrame(() => sourcesRef.current?.querySelector('button')?.focus())
  }

  const go = (next: Phase) => {
    if (next === 'read') setEpoch((current) => current + 1)
    setPhase(next)
    requestAnimationFrame(() => scannerRef.current?.focus({ preventScroll: true }))
  }

  const back = () => (phase === 'read' ? changeSource() : go(phase === 'activate' ? 'curate' : 'read'))
  const next = () => go(phase === 'read' ? 'curate' : 'activate')

  return (
    <MotionConfig reducedMotion="user">
      <section className="wrap scan-section" id="how-it-works">
        <div className="scanner-toolbar">
          {!running ? (
            <div className="blade-tab"><span className="tab-dot" />Connect one or more sources</div>
          ) : (
            <>
              <div className="blade-tab selected-source-tab"><span className="tab-dot" />{countLabel(connected.length)}</div>
              <button className="source-switch" type="button" onClick={changeSource}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2.5 5.5h9l-2.5-2.5M13.5 10.5h-9l2.5 2.5" />
                </svg>
                Change source
              </button>
            </>
          )}
        </div>
        <div className={`rig ${running ? 'has-source' : ''} ${connected.length ? 'is-connected' : ''}`}>
          {fixedHeader ? <RunHead ids={connected} phase={stepOf[phase]} /> : null}
          <div className="stage">
            {!running ? (
              <div className="source-column">
                <div className="eyebrow column-label">Your data sources</div>
                <div className="sources" ref={sourcesRef}>
                  {sources.map((source) => (
                    <SourceCard source={source} connected={connected.includes(source.id)} onToggle={toggle} key={source.id} />
                  ))}
                </div>
              </div>
            ) : null}
            <div
              className={`scanner ${dropActive ? 'hot' : ''}`}
              ref={scannerRef}
              tabIndex={-1}
              onDragOver={(event) => { event.preventDefault(); setDropActive(true) }}
              onDragLeave={() => setDropActive(false)}
              onDrop={onDrop}
            >
                <div className="selected-report" key={running ? `run-${comboKey(connected)}` : 'connect'}>
                  {running ? (
                    <RunPanel ids={connected} combo={combo} phase={phase as RunPhase} epoch={epoch} onBack={back} onNext={next} showHeader={!fixedHeader} />
                  ) : (
                    <ConnectedPanel ids={connected} onRead={() => go('read')} showHeader={!fixedHeader} />
                  )}
                </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
