import { useCallback, useEffect, useRef, useState, type CSSProperties, type DragEvent, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion, useAnimate, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from 'motion/react'
import { describeFile, keptDocs, type FileKind } from './sourceModel'

type SourceId = 's3' | 'sp' | 'db' | 'cf'

type Source = {
  id: SourceId
  name: string
  count: string
  unit: 'files' | 'pages'
  finalCount: string
  metrics: readonly [number, number, number]
  filterCounts: readonly [string, string, string, string, string]
}

const sources: readonly Source[] = [
  {
    id: 's3',
    name: 'S3 bucket',
    count: '8,420',
    unit: 'files',
    finalCount: '1,180',
    metrics: [51, 64, 31],
    filterCounts: ['8,420', '5,220', '3,199', '1,852', '1,180'],
  },
  {
    id: 'sp',
    name: 'SharePoint site',
    count: '3,160',
    unit: 'files',
    finalCount: '460',
    metrics: [44, 55, 47],
    filterCounts: ['3,160', '1,959', '1,200', '695', '460'],
  },
  {
    id: 'db',
    name: 'Databricks volume',
    count: '14,200',
    unit: 'files',
    finalCount: '1,980',
    metrics: [38, 72, 19],
    filterCounts: ['14,200', '8,804', '5,396', '3,124', '1,980'],
  },
  {
    id: 'cf',
    name: 'Confluence space',
    count: '9,120',
    unit: 'pages',
    finalCount: '1,280',
    metrics: [57, 61, 24],
    filterCounts: ['9,120', '5,654', '3,465', '2,006', '1,280'],
  },
]

const sourceById = Object.fromEntries(sources.map((source) => [source.id, source])) as Record<SourceId, Source>
/* A fixed hash stands in for randomness, so the pile scatters like a real
   folder but draws the same every time. Cycling a short pattern lined the
   flags up into columns. */
const scatter = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}
const paperOf = (index: number) => Math.floor(scatter(index, 3) * 4)
/* Each file rolls against the source's own three figures, so the pile
   carries the flags the legend reports, overlaps included. */
const saltOf: Record<SourceId, number> = { s3: 11, sp: 23, db: 37, cf: 41 }
type ReadFlags = { dup: boolean; sta: boolean; sen: boolean }
function readPile(source: Source): ReadFlags[] {
  const [dup, sta, sen] = source.metrics.map((metric) => metric / 100)
  const salt = saltOf[source.id]
  return Array.from({ length: 56 }, (_, index) => ({
    dup: scatter(index, salt) < dup,
    sta: scatter(index, salt + 1) < sta,
    sen: scatter(index, salt + 2) < sen,
  }))
}
const flagReasons = { dup: 'Duplicate', sta: 'Untouched since 2019', sen: 'Personal data' } as const
const flagKeys = ['sen', 'dup', 'sta'] as const
/* The legend's order, which the tabs on each sheet follow. */
const legendKeys = ['dup', 'sta', 'sen'] as const
/* Six survivors, one per kept document, spread across the pile. */
const keepSlots = new Set([6, 17, 25, 33, 41, 53])
const removedKinds = ['dup', 'dup', 'old', 'sen', 'sta', 'sta'] as const
const kindOrder = { dup: 0, old: 1, sen: 2, sta: 3 } as const
/* Filter's timeline, in seconds. Each removal gets a beat carrying its count
   and label; its files are caught partway in, a little out of step with one
   another. The survivors pulse after the last beat. */
const BEAT = 0.9
const CATCH_AT = 0.6
const CATCH_SPREAD = 0.3
const KEEP_AT = 3.95
const EASE = [0.25, 0.1, 0.25, 1] as const
const filterFiles = Array.from({ length: 60 }, (_, index) => {
  if (keepSlots.has(index)) return { kind: 'keep', at: KEEP_AT }
  const kind = removedKinds[Math.floor(scatter(index, 2) * removedKinds.length)]
  return { kind, at: kindOrder[kind] * BEAT + CATCH_AT + scatter(index, 4) * CATCH_SPREAD }
})

const stepNames = ['Read', 'Filter', 'Enrich', 'Retrieve'] as const
const metricDetails = [
  { label: 'Duplicated', color: 'var(--metric-duplicate)' },
  { label: 'Stale', color: 'var(--flag-stale)' },
  { label: 'Sensitive', color: 'var(--destructive)' },
] as const

const etchedMarks: Record<SourceId, string> = {
  s3: '/brand/integrations/amazon-s3-etch.png',
  sp: '/brand/integrations/sharepoint-etch.png',
  db: '/brand/integrations/databricks-etch.png',
  cf: '/brand/integrations/confluence-etch.png',
}

function SourceIcon({ id }: { id: SourceId }) {
  if (id === 's3') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path fill="#8C3123" d="M16 2 6 5v22l10 3 10-3V5z" />
        <path fill="#E25444" d="m16 2 10 3v22l-10 3z" />
        <path fill="#5E1F18" d="M11 12h10v1.4H11zm0 4h10v1.4H11zm0 4h10v1.4H11z" opacity=".45" />
        <circle cx="20.5" cy="9" r="1.3" fill="#5E1F18" opacity=".5" />
      </svg>
    )
  }

  if (id === 'sp') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="13" cy="9.5" r="6.2" fill="#036C70" />
        <circle cx="21" cy="15" r="6.6" fill="#1A9BA1" />
        <circle cx="15.5" cy="21.5" r="5.6" fill="#37C6D0" />
        <path d="M11 8.5h6.4a1 1 0 0 1 1 1v6.4a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1z" fill="#036C70" />
        <path d="M13.9 11.4c-1.5 0-2.4.6-2.4 1.7 0 1.9 3 1.5 3 2.4 0 .3-.3.5-.9.5-.7 0-1.5-.3-2-.7v1.4c.5.3 1.2.5 2 .5 1.6 0 2.5-.7 2.5-1.8 0-1.9-3-1.6-3-2.4 0-.3.3-.4.8-.4.6 0 1.3.2 1.8.5v-1.3c-.5-.2-1.1-.4-1.8-.4z" fill="#fff" />
      </svg>
    )
  }

  if (id === 'db') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <g fill="#FF3621">
          <path d="m16 6 10 5.6-2 1.1L16 8.1 8 12.7l-2-1.1z" />
          <path d="m16 12 10 5.6-2 1.1L16 14.1 8 18.7l-2-1.1z" />
          <path d="m16 18 10 5.6-10 5.6L6 23.6l2-1.1 8 4.6 8-4.6z" />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="cf-gradient-a" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0052CC" />
          <stop offset="1" stopColor="#2684FF" />
        </linearGradient>
        <linearGradient id="cf-gradient-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0052CC" />
          <stop offset="1" stopColor="#2684FF" />
        </linearGradient>
      </defs>
      <path fill="url(#cf-gradient-a)" d="M5 19.6c2.9-4.5 7.2-4.7 11.4-2.6l3.9 1.9c.5.3 1.1 0 1.3-.5l1.9-3.4c.3-.5.1-1.1-.4-1.4-1-.5-2.9-1.4-4.6-2.2-6.2-3-11.5-2.8-15.2 3.2-.3.4-.1 1 .3 1.3l3 1.8c.1-.1.2-.2.3-.3z" />
      <path fill="url(#cf-gradient-b)" d="M27 12.4c-2.9 4.5-7.2 4.7-11.4 2.6l-3.9-1.9c-.5-.3-1.1 0-1.3.5L8.5 17c-.3.5-.1 1.1.4 1.4 1 .5 2.9 1.4 4.6 2.2 6.2 3 11.5 2.8 15.2-3.2.3-.4.1-1-.3-1.3l-3-1.8c-.1.1-.2.2-.3.3z" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  )
}

function SourceCard({ source, onSelect }: { source: Source; onSelect: (id: SourceId) => void }) {
  const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData('text/plain', source.id)
    event.dataTransfer.effectAllowed = 'link'
  }

  return (
    <button
      className="source-card"
      type="button"
      draggable
      onClick={() => onSelect(source.id)}
      onDragStart={onDragStart}
      aria-label={`${source.name}, ${source.count} ${source.unit}`}
    >
      <span className="source-icon"><span className="source-etch" style={{ '--etch': `url(${etchedMarks[source.id]})` } as CSSProperties} /></span>
      <span className="source-copy">
        <span className="source-name">{source.name}</span>
        <span className="source-meta">{source.count} {source.unit}</span>
      </span>
    </button>
  )
}

function Stepper({ phase }: { phase: number }) {
  return (
    <div className="stepper" aria-label={`Step ${phase + 1} of 4: ${stepNames[phase]}`}>
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

/* ── What this copy adds to the base ─────────────────────────────────────
 * The base scanner, unchanged in look, with three things layered on:
 * a tooltip that names any file in the pile, a kept file that grows into
 * the Enrich document, and a Retrieve that plays as one agent chat.
 */

/* Springs for anything that travels: no overshoot, calm. */
const MORPH = { type: 'spring', duration: 0.5, bounce: 0 } as const
const SETTLE = { type: 'spring', duration: 0.34, bounce: 0 } as const

/* Kept files in filter order, so each one has a document to become. */
const keptIds = filterFiles.flatMap((file, index) => (file.kind === 'keep' ? [index] : []))
const keptIndexOf = (id: number) => keptIds.indexOf(id)

type Hover = { id: number; align: 'start' | 'center' | 'end' }

/**
 * One tooltip for a whole pile, pinned to the cursor through motion values
 * so following the pointer never re-renders the pile. React only hears
 * about it when the file under the pointer changes; between files it keeps
 * the last one rather than blinking.
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

function ReadPanel({ source, onNext }: { source: Source; onNext: () => void }) {
  const pile = readPile(source)
  return (
    <div className="report-panel rise-in">
      <Stepper phase={0} />
      <div className="read-layout">
        <div className="read-head">
          <p className="read-count">
            <span className="count-now">{source.count}</span>
            <span className="count-label">{source.unit} read</span>
          </p>
          <ul className="read-legend">
            {metricDetails.map((metric, index) => (
              <li key={metric.label} style={{ '--flag': metric.color } as CSSProperties}>
                <span className="read-legend-word"><span className="flag-swatch" aria-hidden="true" />{metric.label}</span>
                <strong className="read-legend-value">{source.metrics[index]}%</strong>
              </li>
            ))}
          </ul>
        </div>
        <FilePile
          className="document-swarm read-swarm"
          describe={(id) => {
            const found = flagKeys.filter((key) => pile[id][key])
            const kind = found[0] ?? null
            return {
              name: describeFile(id, kind).name,
              reason: found.length ? found.map((key) => flagReasons[key]).join(' · ') : 'No issues found',
              tone: kind ?? 'clean',
            }
          }}
        >
          {/* Each flag is a coloured tab along the sheet's top edge, so a
              file with several flags simply carries several tabs. */}
          {pile.map((flags, index) => (
            <span className="file" data-paper={paperOf(index)} data-id={index} key={index}>
              {flags.dup || flags.sta || flags.sen ? (
                <span className="file-flags" aria-hidden="true">
                  {legendKeys.map((key) => (flags[key] ? <i data-flag={key} key={key} /> : null))}
                </span>
              ) : null}
            </span>
          ))}
        </FilePile>
      </div>
      <div className="report-footer actions-only">
        <div className="footer-actions">
          <button className="button button-primary with-arrow" type="button" onClick={onNext}>Filter it</button>
        </div>
      </div>
    </div>
  )
}

function FilterPanel({ source, onBack, onNext }: { source: Source; onBack: () => void; onNext: () => void }) {
  const labels = ['Removing duplicates', 'Removing old versions', 'Removing sensitive data', 'Removing stale docs', 'Meets quality criteria']
  const reduceMotion = useReducedMotion()
  const [scope, animate] = useAnimate<HTMLDivElement>()
  /* Once every part of the timeline has played, the survivors leave their
     slots and gather in the middle of the pile as the result. Reduced motion
     skips to that result. */
  const [played, setPlayed] = useState(false)
  const gathered = reduceMotion || played
  useEffect(() => {
    if (reduceMotion) return
    let live = true
    const running: AnimationPlaybackControls[] = []
    const track = (controls: AnimationPlaybackControls) => {
      running.push(controls)
      return controls
    }
    const all = (selector: string) => Array.from(scope.current.querySelectorAll<HTMLElement>(selector))

    /* A caught file flashes its flag, shrinks and fades out, then comes back
       faintly as the empty outline it leaves in the pile. */
    const catchFile = async (file: HTMLElement) => {
      delete file.dataset.removed
      await track(animate(file, { scale: [1, 1.12, 0.86], opacity: [1, 1, 0], '--catch': [0, 1, 0] }, { duration: 0.55, delay: Number(file.dataset.at), times: [0, 0.35, 1], ease: EASE }))
      if (!live) return
      file.dataset.removed = ''
      await track(animate(file, { opacity: 0.5 }, { duration: 0.2, ease: 'easeOut' }))
    }

    const steps = [
      ...[0, 1, 2, 3].map((beat) =>
        track(animate(all(`.filter-count-${beat}, .filter-label-${beat}`), { opacity: [0, 1, 1, 0] }, { duration: BEAT, delay: beat * BEAT, times: [0, 0.14, 0.82, 1], ease: EASE })),
      ),
      track(animate(all('.filter-count-4, .filter-label-4'), { opacity: [0, 1] }, { duration: 0.25, delay: 4 * BEAT, ease: EASE })),
      ...all('.filter-file.keep').map((file) =>
        track(animate(file, { scale: [1, 1.14, 1.06], '--catch': [0, 1, 1] }, { duration: 0.5, delay: KEEP_AT, ease: EASE })),
      ),
      ...all('.filter-file:not(.keep)').map(catchFile),
    ]
    Promise.all(steps).then(() => {
      if (live) setPlayed(true)
    })
    return () => {
      live = false
      running.forEach((controls) => controls.stop())
    }
  }, [reduceMotion, animate, scope])
  return (
    <div className="report-panel rise-in">
      <Stepper phase={1} />
      <div className="filter-visual" ref={scope}>
        <div className="filter-readout">
          <div className="filter-count" aria-label={`${source.finalCount} of ${source.count} ${source.unit} meet quality criteria`}>
            {source.filterCounts.map((count, index) => <span className={`filter-count-${index}`} key={count}>{count}</span>)}
            <span className="filter-denominator">of {source.count} {source.unit}</span>
          </div>
          <div className="filter-label">
            {labels.map((label, index) => <span className={`filter-label-${index}`} key={label}>{label}</span>)}
          </div>
        </div>
        <FilePile
          className={`document-swarm filter-swarm ${gathered ? 'gathered' : ''}`}
          describe={(id) => {
            const kind = filterFiles[id].kind as FileKind
            const info = describeFile(id, kind, keptIndexOf(id))
            return { name: info.name, reason: kind === 'keep' ? info.reason : `${info.reason} · removed`, tone: kind }
          }}
        >
          {filterFiles.map(({ kind, at }, index) =>
            /* Kept files carry a layoutId, so they can travel to the result
               row and from there grow into the Enrich document. */
            kind === 'keep' ? (
              gathered ? (
                <span className="filter-file vacated" key={index} />
              ) : (
                <motion.span className="filter-file keep" layoutId={`doc-${index}`} transition={MORPH} data-paper={paperOf(index)} data-id={index} key={index} />
              )
            ) : (
              <span className={`filter-file ${kind}`} data-at={at} data-paper={paperOf(index)} data-id={index} key={index} />
            ),
          )}
          {gathered ? (
            <div className="filter-result">
              {keptIds.map((id) => (
                <motion.span className="filter-file keep" layoutId={`doc-${id}`} transition={MORPH} data-paper={paperOf(id)} data-id={id} key={id} />
              ))}
            </div>
          ) : null}
        </FilePile>
      </div>
      <div className="report-footer actions-only">
        <div className="footer-actions">
          <button className="button button-ghost" type="button" onClick={onBack}>Back</button>
          <button className="button button-primary with-arrow" type="button" onClick={onNext}>Enrich what’s left</button>
        </div>
      </div>
    </div>
  )
}

function EnrichPanel({
  source,
  openId,
  onOpen,
  onBack,
  onNext,
}: {
  source: Source
  openId: number
  onOpen: (id: number) => void
  onBack: () => void
  onNext: () => void
}) {
  const doc = keptDocs[keptIndexOf(openId)]
  return (
    <div className="report-panel rise-in">
      <Stepper phase={2} />
      <div className="enrich-wrap">
        {/* The card's contents wait for the morph, so the file grows first
            and the words land on a card that has stopped moving. */}
        <motion.div className="enriched-document" layoutId={`doc-${openId}`} transition={MORPH} style={{ borderRadius: 5 }}>
          <motion.div key={openId} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.22, duration: 0.2 } }}>
            <span className="document-lines" aria-hidden="true" />
            <span className="document-kicker">Curated document · {keptIndexOf(openId) + 1}</span>
            <div className="document-name">{doc.name}</div>
            <div className="document-sub">{keptIndexOf(openId) + 1} of {source.finalCount} curated docs</div>
          </motion.div>
        </motion.div>
        <div className="metadata-tags" key={openId}>
          {doc.tags.map(([key, value], index) => (
            <span className="metadata-tag" style={{ animationDelay: `${0.45 + index * 0.16}s` }} key={key}>
              <span>{key}</span>{value}
            </span>
          ))}
        </div>
      </div>
      {/* Every kept file keeps its place in the row; the open one leaves an
          empty slot behind, so the picker shows which document is up. */}
      <div className="kept-row" role="group" aria-label="Kept files">
        <span className="kept-label">Kept files</span>
        {keptIds.map((id) =>
          id === openId ? (
            <span className="kept-slot" aria-current="true" aria-label={`${keptDocs[keptIndexOf(id)].name}, open`} key={id} />
          ) : (
            <motion.button
              className="filter-file kept-thumb"
              type="button"
              layoutId={`doc-${id}`}
              transition={MORPH}
              data-paper={paperOf(id)}
              style={{ borderRadius: 3 }}
              aria-label={`Open ${keptDocs[keptIndexOf(id)].name}`}
              onClick={() => onOpen(id)}
              key={id}
            />
          ),
        )}
      </div>
      <div className="report-footer actions-only">
        <div className="footer-actions">
          <button className="button button-ghost" type="button" onClick={onBack}>Back</button>
          <button className="button button-primary with-arrow" type="button" onClick={onNext}>Ask your agent</button>
        </div>
      </div>
    </div>
  )
}

/* ── Retrieve ─────────────────────────────────────────────────────────────
 * One agent chat that plays itself. The agent starts plugged into the raw
 * source as a connector and answers wrong; Deasy then clicks into the
 * composer beside it, the same question goes out again, and it comes back
 * right. Both answers stay on screen, in the base's own answer cards.
 */
const QUESTION = 'What is our refund policy for enterprise customers?'

/* Stages: 0 typing, 1 asked raw, 2 raw answer, 3 Deasy connected and
   retyping, 4 asked again, 5 Deasy answer. Each hold is how long the stage
   before lasts: typing takes 1.8s, answers get time to be read. */
const STAGE_HOLDS = [2100, 1100, 2800, 2200, 1100] as const
const LAST_STAGE = STAGE_HOLDS.length

function useChatScript() {
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState(0)
  const timers = useRef<number[]>([])

  const stop = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  /* Stable, so the panel can start it on arrival without re-arming. Reduced
     motion skips the performance and lands on the finished conversation. */
  const start = useCallback(() => {
    stop()
    setStage(reduceMotion ? LAST_STAGE : 0)
    if (reduceMotion) return
    let at = 0
    STAGE_HOLDS.forEach((hold, index) => {
      at += hold
      timers.current.push(window.setTimeout(() => setStage(index + 1), at))
    })
  }, [stop, reduceMotion])

  useEffect(() => stop, [stop])

  return { stage, done: stage === LAST_STAGE, start, stop }
}

type ChatScript = ReturnType<typeof useChatScript>

function ConnectorChip({ source }: { source: Source | 'deasy' }) {
  return source === 'deasy' ? (
    <span className="connector connector-deasy">
      <span className="connector-mark" aria-hidden="true" />
      <span className="connector-name">Deasy</span>
    </span>
  ) : (
    <span className="connector">
      <span className="connector-icon"><SourceIcon id={source.id} /></span>
      <span className="connector-name">{source.name}</span>
    </span>
  )
}

const turnIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: SETTLE },
}

function UserTurn({ connectors }: { connectors: (Source | 'deasy')[] }) {
  return (
    <motion.div className="chat-user" {...turnIn}>
      <p className="chat-question">{QUESTION}</p>
      {connectors.length ? <div className="chat-connectors">
        {connectors.map((connector) => (
          <ConnectorChip source={connector} key={connector === 'deasy' ? 'deasy' : connector.id} />
        ))}
      </div> : null}
    </motion.div>
  )
}

function Thinking({ children }: { children: ReactNode }) {
  return (
    <motion.p className="chat-thinking" {...turnIn}>
      <span className="chat-thinking-dot" aria-hidden="true" />
      {children}
    </motion.p>
  )
}

function RetrievePanel({ source, script, onBack }: { source: Source; script: ChatScript; onBack: () => void }) {
  const { stage, start } = script
  const chatRef = useRef<HTMLDivElement>(null)
  const connectors: (Source | 'deasy')[] = stage >= 3 ? [source, 'deasy'] : [source]
  const drafting = stage === 0 || stage === 3

  useEffect(() => {
    start()
  }, [start])

  useEffect(() => {
    const chat = chatRef.current
    if (chat) chat.scrollTop = chat.scrollHeight
  }, [stage])

  return (
    <div className="report-panel retrieve-panel">
      <Stepper phase={3} />
      <div className="chat" ref={chatRef} aria-live="polite">
        {/* Once Deasy joins, the first exchange folds into a one-line
            recap, so the wrong answer and the right one share the frame. */}
        {stage < 3 ? (
          <>
            <p className="chat-event">{source.name} connected · {source.count} {source.unit}, as-is</p>
            {stage >= 1 ? <UserTurn connectors={[source]} /> : null}
            {stage === 1 ? <Thinking>Searching {source.count} {source.unit}…</Thinking> : null}
            {stage >= 2 ? (
              <motion.div className="answer bad-answer" layoutId="raw-answer" transition={SETTLE} {...turnIn}>
                <div className="verdict"><span className="verdict-sub">Without Deasy, on the raw data</span><span className="verdict-mark">×</span><span>Wrong answer</span></div>
                <p>Enterprise customers get a <b>14-day</b> refund window. To start one, email the account owner at <span className="leak">m.alvarez@northriver.com</span>.</p>
                <div className="citation"><DocumentIcon /> refund_policy_DRAFT_v2.docx · 2021 · 1 of 4 copies</div>
              </motion.div>
            ) : null}
          </>
        ) : (
          <motion.div className="answer bad-answer bad-recap" layoutId="raw-answer" transition={SETTLE}>
            <span className="verdict-mark" aria-hidden="true">×</span>
            <p>
              <span className="verdict-sub">Without Deasy</span>
              Said <b>14-day</b>, leaked a customer email, cited a 2021 draft
            </p>
          </motion.div>
        )}

        {stage >= 3 ? (
          <motion.p className="chat-event chat-event-deasy" {...turnIn}>
            Deasy connected · {source.finalCount} labelled {source.unit}
          </motion.p>
        ) : null}

        {/* The joined line and the composer already show Deasy is attached. */}
        {stage >= 4 ? <UserTurn connectors={[]} /> : null}
        {stage === 4 ? <Thinking>Searching {source.finalCount} labelled {source.unit} where type is policy, version is current…</Thinking> : null}
        {stage >= 5 ? (
          <motion.div className="answer good-answer" {...turnIn}>
            <div className="verdict"><span className="verdict-sub">With Deasy</span><span className="verdict-mark">✓</span><span>Right answer</span></div>
            <p>Enterprise customers have a <strong>30-day</strong> refund window under the current master agreement. No customer contact details are needed to start one.</p>
            <div className="citation"><DocumentIcon /> from your context layer · Enterprise_Refund_Policy.pdf</div>
          </motion.div>
        ) : null}
      </div>

      {/* The composer is the base's query bar, with the connectors the next
          message will go out through sitting in it, the way ChatGPT shows
          them. */}
      <div className="ai-query chat-composer">
        <span className="query-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span className="chat-composer-text">
          <span className="query-label">You ask your agent</span>
          {drafting ? (
            <span className="typing-query" key={`draft-${stage}`}>{QUESTION}</span>
          ) : (
            <span className="chat-placeholder">Ask a follow-up</span>
          )}
        </span>
        <span className="chat-composer-connectors">
          <AnimatePresence initial={false}>
            {connectors.map((connector) => (
              <motion.span
                layout
                key={connector === 'deasy' ? 'deasy' : connector.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: SETTLE }}
              >
                <ConnectorChip source={connector} />
              </motion.span>
            ))}
          </AnimatePresence>
        </span>
      </div>

      <div className="retrieve-footer">
        <button className="button button-ghost" type="button" onClick={onBack}>Back</button>
        <button className="button button-ghost" type="button" onClick={start} disabled={!script.done}>Replay</button>
        <a className="button button-primary with-arrow" href="https://www.deasylabs.com/demo" aria-label="See it on your data">
          <span className="desktop-button-label">See it on your data</span>
          <span className="mobile-button-label">See demo</span>
        </a>
      </div>
    </div>
  )
}

export function ScannerDemo() {
  const [selectedId, setSelectedId] = useState<SourceId | null>(null)
  const [phase, setPhase] = useState(0)
  const [openId, setOpenId] = useState(keptIds[0])
  const [dropActive, setDropActive] = useState(false)
  const script = useChatScript()
  const scannerRef = useRef<HTMLDivElement>(null)
  const sourcesRef = useRef<HTMLDivElement>(null)
  const selectedSource = selectedId ? sourceById[selectedId] : undefined

  const focusScanner = useCallback(() => {
    requestAnimationFrame(() => scannerRef.current?.focus())
  }, [])

  const goTo = (next: number) => {
    if (phase === 3) script.stop()
    setPhase(next)
  }

  const selectSource = (id: SourceId) => {
    setSelectedId(id)
    setPhase(0)
    setOpenId(keptIds[0])
    focusScanner()
  }

  const changeSource = () => {
    script.stop()
    setSelectedId(null)
    setPhase(0)
    requestAnimationFrame(() => sourcesRef.current?.querySelector('button')?.focus())
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDropActive(false)
    const id = event.dataTransfer.getData('text/plain')
    if (Object.hasOwn(sourceById, id)) selectSource(id as SourceId)
  }

  return (
    <MotionConfig reducedMotion="user">
      <section className="wrap scan-section" id="platform">
        <div className="scanner-toolbar">
          {!selectedSource ? (
            <div className="blade-tab"><span className="tab-dot" />Connect to a data source to see what your agent sees</div>
          ) : (
            <>
              <div className="blade-tab selected-source-tab"><span className="tab-dot" />{selectedSource.name}<span className="selected-source-count">· {selectedSource.count} {selectedSource.unit}</span></div>
              <button className="source-switch" type="button" onClick={changeSource}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2.5 5.5h9l-2.5-2.5M13.5 10.5h-9l2.5 2.5" />
                </svg>
                Change source
              </button>
            </>
          )}
        </div>
        <div className={`rig ${selectedSource ? 'has-source' : ''}`}>
          <div className="stage">
            {!selectedSource ? (
              <div className="source-column">
                <div className="column-label">Your data source</div>
                <div className="sources" ref={sourcesRef}>
                  {sources.map((source) => <SourceCard source={source} onSelect={selectSource} key={source.id} />)}
                </div>
              </div>
            ) : null}
            <div
              className={`scanner ${dropActive ? 'hot' : ''}`}
              ref={scannerRef}
              tabIndex={selectedSource ? -1 : undefined}
              onDragOver={(event) => { event.preventDefault(); setDropActive(true) }}
              onDragLeave={() => setDropActive(false)}
              onDrop={onDrop}
            >
              {!selectedSource ? (
                <div className="drop-empty">
                  <span className="drop-logo" aria-hidden="true" />
                  <p><span className="desktop-drop-hint">Drag a source from the list to scan the files</span><span className="mobile-drop-hint">Choose a source to scan its files</span></p>
                </div>
              ) : (
                <div className="selected-report" key={`${selectedSource.id}-${phase}`}>
                  {phase === 0 ? <ReadPanel source={selectedSource} onNext={() => goTo(1)} /> : null}
                  {phase === 1 ? <FilterPanel source={selectedSource} onBack={() => goTo(0)} onNext={() => goTo(2)} /> : null}
                  {phase === 2 ? (
                    <EnrichPanel source={selectedSource} openId={openId} onOpen={setOpenId} onBack={() => goTo(1)} onNext={() => goTo(3)} />
                  ) : null}
                  {phase === 3 ? <RetrievePanel source={selectedSource} script={script} onBack={() => goTo(2)} /> : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  )
}
