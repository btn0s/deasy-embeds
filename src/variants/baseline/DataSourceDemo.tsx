import { useCallback, useRef, useState, type CSSProperties, type DragEvent } from 'react'

type SourceId = 's3' | 'sp' | 'db' | 'cf'

type Source = {
  id: SourceId
  name: string
  count: string
  unit: 'files' | 'pages'
  finalCount: string
  metrics: readonly [number, number, number]
  note: string
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
    note: 'Nearly two thirds of it is stale, and a third holds something sensitive.',
    filterCounts: ['8,420', '5,220', '3,199', '1,852', '1,180'],
  },
  {
    id: 'sp',
    name: 'SharePoint site',
    count: '3,160',
    unit: 'files',
    finalCount: '460',
    metrics: [44, 55, 47],
    note: 'Almost half of these files hold something sensitive.',
    filterCounts: ['3,160', '1,959', '1,200', '695', '460'],
  },
  {
    id: 'db',
    name: 'Databricks volume',
    count: '14,200',
    unit: 'files',
    finalCount: '1,980',
    metrics: [38, 72, 19],
    note: 'Almost three quarters of the volume is out of date.',
    filterCounts: ['14,200', '8,804', '5,396', '3,124', '1,980'],
  },
  {
    id: 'cf',
    name: 'Confluence space',
    count: '9,120',
    unit: 'pages',
    finalCount: '1,280',
    metrics: [57, 61, 24],
    note: 'Over half the pages are duplicated or superseded.',
    filterCounts: ['9,120', '5,654', '3,465', '2,006', '1,280'],
  },
]

const sourceById = Object.fromEntries(sources.map((source) => [source.id, source])) as Record<SourceId, Source>
const documentStates = Array.from({ length: 56 }, (_, index) => {
  const states = ['g-dup', '', 'g-sta', 'g-sen', '', 'g-dup', '']
  return states[index % states.length]
})
const filterPattern = ['dup', 'sta', 'old', 'dup', 'sen', 'sta', 'keep', 'dup', 'old', 'sta', 'dup', 'sen', 'sta', 'old', 'dup', 'keep', 'sta', 'dup', 'old', 'sen']
const filterFiles = Array.from({ length: 60 }, (_, index) => {
  const kind = filterPattern[index % filterPattern.length]
  const slot = index % filterPattern.length
  let delay = 0
  if (kind === 'dup') delay = 0.6 + (slot % 6) * 0.036
  if (kind === 'old') delay = 1.524 + (slot % 5) * 0.06
  if (kind === 'sen') delay = 2.448 + (slot % 4) * 0.084
  if (kind === 'sta') delay = 3.312 + (slot % 5) * 0.048
  return { kind, delay }
})

const stepNames = ['Read', 'Filter', 'Enrich', 'Retrieve'] as const
const metricDetails = [
  { label: 'Duplicated', color: 'var(--metric-duplicate)' },
  { label: 'Stale', color: 'var(--metric-stale)' },
  { label: 'Sensitive', color: 'var(--destructive)' },
] as const

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
      <span className="source-icon"><SourceIcon id={source.id} /></span>
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
            {name}
          </div>
          {index < stepNames.length - 1 ? <span aria-hidden="true" className={`step-line ${index < phase ? 'done' : ''}`} /> : null}
        </div>
      ))}
    </div>
  )
}

function ReadPanel({ source, onNext }: { source: Source; onNext: () => void }) {
  return (
    <div className="report-panel rise-in">
      <Stepper phase={0} />
      <div className="scan-grid">
        <div className="pile-side">
          <div className="document-swarm" aria-hidden="true">
            {documentStates.map((state, index) => <span className={`file ${state}`} key={index} />)}
          </div>
          <div className="pile-count"><span className="count-now">{source.count}</span><span className="count-label">{source.unit}</span></div>
        </div>
        <div className="metric-stack">
          {metricDetails.map((metric, index) => {
            const value = source.metrics[index]
            const style = { '--pct': value, '--ring': metric.color } as CSSProperties
            return (
              <div className="quality-card" key={metric.label}>
                <div className="donut" style={style}>
                  <div className="donut-hole"><span className="donut-number" style={{ color: metric.color }}>{value}%</span></div>
                </div>
                <div className="quality-word" style={{ color: metric.color }}>{metric.label}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="report-footer">
        <p>{source.note}</p>
        <button className="button button-primary with-arrow" type="button" onClick={onNext}>Filter it</button>
      </div>
    </div>
  )
}

function FilterPanel({ source, onBack, onNext }: { source: Source; onBack: () => void; onNext: () => void }) {
  const labels = ['Removing duplicates', 'Removing old versions', 'Removing sensitive data', 'Removing stale docs', 'Meets quality criteria']
  return (
    <div className="report-panel rise-in">
      <Stepper phase={1} />
      <div className="filter-visual">
        <div className="filter-readout">
          <div className="filter-count">
            {source.filterCounts.map((count, index) => <span className={`filter-count-${index}`} key={count}>{count}</span>)}
          </div>
          <div className="filter-label">
            {labels.map((label, index) => <span className={`filter-label-${index}`} key={label}>{label}</span>)}
          </div>
        </div>
        <div className="document-swarm filter-swarm" aria-hidden="true">
          {filterFiles.map(({ kind, delay }, index) => (
            <span className={`filter-file ${kind}`} style={delay ? { animationDelay: `${delay}s` } : undefined} key={index} />
          ))}
        </div>
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

function EnrichPanel({ source, onBack, onNext }: { source: Source; onBack: () => void; onNext: () => void }) {
  const tags = [
    ['type', 'policy'],
    ['updated', 'Aug 2026'],
    ['owner', 'Legal'],
    ['region', 'EU'],
    ['PII', 'none'],
    ['version', 'current'],
  ]
  return (
    <div className="report-panel rise-in">
      <Stepper phase={2} />
      <div className="enrich-wrap">
        <div className="enriched-document">
          <span className="document-icon"><DocumentIcon /></span>
          <div className="document-name">Enterprise_Refund_Policy.pdf</div>
          <div className="document-sub">1 of {source.finalCount} curated docs</div>
        </div>
        <div className="metadata-tags">
          {tags.map(([key, value], index) => (
            <span className="metadata-tag" style={{ animationDelay: `${0.45 + index * 0.16}s` }} key={key}>
              <span>{key}</span>{value}
            </span>
          ))}
        </div>
      </div>
      <p className="enrich-caption">Every document tagged with metadata your agents can filter on.</p>
      <div className="report-footer actions-only">
        <div className="footer-actions">
          <button className="button button-ghost" type="button" onClick={onBack}>Back</button>
          <button className="button button-primary with-arrow" type="button" onClick={onNext}>Ask your agent</button>
        </div>
      </div>
    </div>
  )
}

function RetrievePanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="report-panel retrieve-panel">
      <Stepper phase={3} />
      <div className="ai-query">
        <span className="query-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span>
          <span className="query-label">You ask your agent</span>
          <span className="typing-query">What is our refund policy for enterprise customers?</span>
        </span>
      </div>
      <div className="answer good-answer">
        <div className="verdict"><span className="verdict-sub">After Deasy</span><span className="verdict-mark">✓</span><span>Right answer</span></div>
        <p>Enterprise customers have a <strong>30-day</strong> refund window under the current master agreement. No customer contact details are needed to start one.</p>
        <div className="citation"><DocumentIcon /> from your context layer · Enterprise_Refund_Policy.pdf</div>
      </div>
      <div className="answer bad-answer">
        <div className="verdict"><span className="verdict-sub">Without Deasy, on the raw data</span><span className="verdict-mark">×</span><span>Wrong answer</span></div>
        <p>Enterprise customers get a <b>14-day</b> refund window. To start one, email the account owner at <span className="leak">m.alvarez@northriver.com</span>.</p>
        <div className="citation"><DocumentIcon /> refund_policy_DRAFT_v2.docx · 2021 · 1 of 4 copies</div>
      </div>
      <div className="retrieve-footer">
        <button className="button button-ghost" type="button" onClick={onBack}>Back</button>
        <a className="button button-primary with-arrow" href="https://www.deasylabs.com/demo">See it on your data</a>
      </div>
    </div>
  )
}

export function DataSourceDemo({ embedded = false }: { embedded?: boolean }) {
  const [selectedId, setSelectedId] = useState<SourceId | null>(null)
  const [phase, setPhase] = useState(0)
  const [dropActive, setDropActive] = useState(false)
  const scannerRef = useRef<HTMLDivElement>(null)
  const changeSourceRef = useRef<HTMLButtonElement>(null)
  const selectedSource = selectedId ? sourceById[selectedId] : undefined

  const focusScanner = useCallback(() => {
    requestAnimationFrame(() => scannerRef.current?.focus())
  }, [])

  const selectSource = (id: SourceId) => {
    setSelectedId(id)
    setPhase(0)
    focusScanner()
  }

  const changeSource = () => {
    setSelectedId(null)
    setPhase(0)
    requestAnimationFrame(() => changeSourceRef.current?.focus())
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDropActive(false)
    const id = event.dataTransfer.getData('text/plain')
    if (Object.hasOwn(sourceById, id)) selectSource(id as SourceId)
  }

  const content = (
    <>
      {!selectedSource ? (
        <div className="blade-tab"><span className="tab-dot" />Connect to a data source to see what your agent sees</div>
      ) : null}
      <div className={`rig ${selectedSource ? 'has-source' : ''}`}>
        {selectedSource ? (
          <button className="change-source" ref={changeSourceRef} type="button" onClick={changeSource}>↩ change source</button>
        ) : null}
        <div className="stage">
          {!selectedSource ? (
            <div className="source-column">
              <div className="column-label">Your data source</div>
              <div className="sources">
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
                <p>Drag a source from the list to scan the files</p>
              </div>
            ) : (
              <div className="selected-report" key={`${selectedSource.id}-${phase}`}>
                {phase === 0 ? <ReadPanel source={selectedSource} onNext={() => setPhase(1)} /> : null}
                {phase === 1 ? <FilterPanel source={selectedSource} onBack={() => setPhase(0)} onNext={() => setPhase(2)} /> : null}
                {phase === 2 ? <EnrichPanel source={selectedSource} onBack={() => setPhase(1)} onNext={() => setPhase(3)} /> : null}
                {phase === 3 ? <RetrievePanel onBack={() => setPhase(2)} /> : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  if (embedded) {
    return <div className="interaction-flow__pane interaction-flow__pane--scanner">{content}</div>
  }

  return (
    <section className="wrap scan-section" id="platform">
      {content}
    </section>
  )
}
