import { computed, defineComponent, shallowRef, type CSSProperties, type PropType } from 'vue';
import { watchAfterMount, useMotionPreference } from '../composables';
import { AnimatePresence, MotionConfig, animate as tween, motion, useAnimate, useMotionValue, useTransform, type AnimationPlaybackControls, RowValue } from "motion-v";
import { combos, fieldEdges, fieldNodes, type Combo, type SourceId } from './bladeData';
import { DeasyLogo } from './DeasyLogo';

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

type Source = {
  id: SourceId;
  name: string;
  count: string;
  unit: 'files' | 'pages';
  etch: string;
};
const sources: readonly Source[] = [{
  id: 's3',
  name: 'S3 bucket',
  count: '412,000',
  unit: 'files',
  etch: '/brand/integrations/amazon-s3-etch.png'
}, {
  id: 'sp',
  name: 'SharePoint site',
  count: '186,000',
  unit: 'files',
  etch: '/brand/integrations/sharepoint.svg'
}, {
  id: 'gcs',
  name: 'GCS bucket',
  count: '524,000',
  unit: 'files',
  etch: '/brand/integrations/google-cloud-storage-etch.svg'
}, {
  id: 'cf',
  name: 'Confluence space',
  count: '68,000',
  unit: 'pages',
  etch: '/brand/integrations/confluence.svg'
}];
const sourceById = Object.fromEntries(sources.map(source => [source.id, source])) as Record<SourceId, Source>;
const sourceOrder = sources.map(source => source.id);
/* A combination is keyed in list order, the way the blade keys its figures. */
const comboKey = (ids: readonly SourceId[]) => [...ids].sort((a, b) => sourceOrder.indexOf(a) - sourceOrder.indexOf(b)).join('_');
const unitOf = (ids: readonly SourceId[]) => ids.length === 1 ? sourceById[ids[0]].unit : 'files';
const toNumber = (figure: string) => Number(figure.replace(/,/g, ''));
/* Figures read at a glance: 412K, 1.19M. */
const abbreviate = (value: number) => value >= 1e6 ? `${(value / 1e6).toFixed(2).replace(/\.?0+$/, '')}M` : value >= 1000 ? `${Math.round(value / 1000)}K` : `${Math.round(value)}`;
const short = (figure: string) => abbreviate(toNumber(figure));

/* The blade publishes figures for one source and for pairs; its pairs are
   the sums of their sources, so three or four are summed the same way. */
const comboFor = (ids: readonly SourceId[]): Combo => {
  const known = combos[comboKey(ids)];
  if (known) return known;
  const parts = ids.map(id => combos[id]);
  const total = (pick: (combo: Combo) => string) => parts.reduce((sum, part) => sum + toNumber(pick(part)), 0);
  const count = total(part => part.count);
  const figure = (value: number) => value.toLocaleString('en-US');
  return {
    count: figure(count),
    dims: parts[0].dims.map((_, index) => Math.round(parts.reduce((sum, part) => sum + part.dims[index] * toNumber(part.count), 0) / count)),
    counts: [0, 1, 2, 3, 4].map(beat => figure(total(part => part.counts[beat]))) as unknown as Combo['counts'],
    systems: combos[ids[0]].systems
  };
};
const countLabel = (n: number) => n === 1 ? '1 source connected' : `${n} sources connected`;

/* A fixed hash stands in for randomness, so the pile scatters like a real
   folder but draws the same every time. */
const scatter = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const paperOf = (index: number) => Math.floor(scatter(index, 3) * 4);

/* Read's sweep crosses the pile left to right in this many seconds. */
const READ_SWEEP = 1.4;
const PILE_COLUMNS = 15;
const sweepOf = (index: number) => Math.round(index % PILE_COLUMNS / PILE_COLUMNS * READ_SWEEP * 820 + scatter(index, 7) * 120);
const stepNames = ['Read', 'Curate', 'Activate'] as const;
type Phase = 'connect' | 'read' | 'curate' | 'activate';
type RunPhase = Exclude<Phase, 'connect'>;
const stepOf: Record<Phase, number> = {
  connect: -1,
  read: 0,
  curate: 1,
  activate: 2
};
const MORPH = {
  type: 'spring',
  duration: 0.4,
  bounce: 0
} as const;
/* Entrances settle out of a steep start; things already on screen that
   move, or trade places, accelerate and brake. */
const EASE = [0.19, 1, 0.22, 1] as const;
const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const;

/* ── The pile ───────────────────────────────────────────────────────────────
   Sixty sheets, twelve of them sound. Read tabs each problem sheet with
   what is wrong with it; Curate removes it in the beat that names that
   problem; the twelve that are left go on to the agent. */

type Kind = 'dup' | 'old' | 'sen' | 'sta' | 'keep';
const kinds: readonly Kind[] = ('dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup ' + 'dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup ' + 'dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup').split(' ') as Kind[];
/* An old version is a kind of duplicate, so it carries the same tab. */
const tabOf: Record<Kind, 'dup' | 'sen' | 'sta' | null> = {
  dup: 'dup',
  old: 'dup',
  sen: 'sen',
  sta: 'sta',
  keep: null
};

/* Curate's timeline, in seconds: four beats, then the result. */
const BEAT = 0.65;
const CATCH_AT = 0.15;
const CATCH_SPREAD = 0.2;
const KEEP_AT = 4.65;
const beatOfSheet = (kind: Exclude<Kind, 'keep'>, index: number) => kind === 'dup' ? 0 : kind === 'sen' ? 1 : kind === 'sta' ? 2 + index % 2 : 4 + index % 3;
const sheets = kinds.map((kind, index) => ({
  kind,
  at: kind === 'keep' ? KEEP_AT : beatOfSheet(kind, index) * BEAT + CATCH_AT + scatter(index, 4) * CATCH_SPREAD
}));
const keptIds = sheets.flatMap((sheet, index) => sheet.kind === 'keep' ? [index] : []);
const keptNames = ['Master_Agreement_v4.pdf', 'Renewal_Terms_2025.docx', 'Enterprise_Tier_Pricing.xlsx', 'Dec_2024_Cohort.csv', 'Order_Form_Template.docx', 'Security_Overview.pdf', 'Support_Runbook.md', 'Data_Retention_Policy.pdf', 'Notice_Periods.xlsx', 'Customer_Success_Playbook.pdf', 'SLA_Schedule.pdf', 'Billing_FAQ.md'];
/* The answer cites a survivor from each source it spans, and at least three. */
const citedFor = (systems: number) => keptIds.slice(0, Math.max(3, systems));
const fileNames = ['Master_Agreement', 'Renewal_Terms', 'Enterprise_Tier_Pricing', 'Order_Form', 'Security_Overview', 'Support_Runbook', 'Onboarding_Guide', 'Vendor_Contract', 'Roadmap', 'Incident_Review'];
const sensitiveNames = ['payroll_export_2024.csv', 'customer_emails.xlsx', 'offer_letter_JSmith.pdf', 'passport_scan.pdf', 'vendor_bank_details.xlsx'];
const found: Record<Kind, string> = {
  dup: 'Duplicate',
  old: 'Old version',
  sen: 'Sensitive data',
  sta: 'Stale',
  keep: 'No issues found'
};

/* A sheet keeps its name from Read to Curate; only the verdict changes. */
const describeSheet = (id: number, curating: boolean) => {
  const {
    kind
  } = sheets[id];
  const base = fileNames[id % fileNames.length];
  const name = {
    dup: `${base} (copy ${2 + id % 3}).pdf`,
    old: `${base}_v${1 + id % 3}_OLD.docx`,
    sen: sensitiveNames[id % sensitiveNames.length],
    sta: `${base}_2019.pptx`,
    keep: keptNames[keptIds.indexOf(id) % keptNames.length]
  }[kind];
  const reason = kind === 'keep' ? curating ? 'Kept' : found.keep : curating ? `Removed: ${found[kind].toLowerCase()}` : found[kind];
  return {
    name,
    reason,
    tone: kind
  };
};

/* The seven checks, in the blade's order, and the Curate beat that clears
   each. The three a sheet can carry as a tab keep their tab's colour. */
const checks = [{
  key: 'dup',
  label: 'Duplicates',
  clears: 0
}, {
  key: 'sta',
  label: 'Stale',
  clears: 2
}, {
  key: 'sen',
  label: 'Sensitive',
  clears: 1
}, {
  key: 'off',
  label: 'Off-topic',
  clears: 3
}, {
  key: 'met',
  label: 'Missing metadata',
  clears: 4
}, {
  key: 'inc',
  label: 'Incomplete',
  clears: 5
}, {
  key: 'con',
  label: 'Contains conflicting information',
  clears: 6
}] as const;

/* ── Marks ──────────────────────────────────────────────────────────────── */
const Etch = defineComponent({
  name: "Etch",
  props: {
    source: {
      type: null as unknown as PropType<Source>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const source = computed(() => props.source);
    return () => <span class="source-etch" style={{
      '--etch': `url("${source.value.etch}")`
    } as CSSProperties} aria-hidden="true" />;
  }
});
const DocumentIcon = defineComponent({
  name: "DocumentIcon",
  props: {},
  setup(props, {
    slots
  }) {
    return () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>;
  }
});
/* Deasy at the centre of the first screen: dormant until a source
   connects, then transitions to colour without moving.
   The sources that are in sit beneath it. */
const DeasyHub = defineComponent({
  name: "DeasyHub",
  props: {
    ids: {
      type: null as unknown as PropType<readonly SourceId[]>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const ids = computed(() => props.ids);
    return () => <div class={`hub ${ids.value.length ? 'live' : ''}`}>
      <span class="hub-logo">
        <DeasyLogo />
      </span>
      <div class="hub-sources">
        <span class="hub-hint" hidden={ids.value.length > 0}>Click a source to connect</span>
        <AnimatePresence initial={false}>
          {ids.value.map(id => <motion.span class="hub-source" aria-hidden="true" layoutId={`src-${id}`} key={id} initial={{
            opacity: 0,
            y: 6
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: 6
          }} transition={MORPH}>
              <Etch source={sourceById[id]} />
            </motion.span>)}
        </AnimatePresence>
      </div>
    </div>;
  }
});
const SourceCard = defineComponent({
  name: "SourceCard",
  props: {
    source: {
      type: null as unknown as PropType<Source>,
      required: true
    },
    connected: {
      type: null as unknown as PropType<boolean>,
      required: true
    },
    onToggle: {
      type: null as unknown as PropType<(id: SourceId) => void>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const source = computed(() => props.source);
    const connected = computed(() => props.connected);
    const onToggle = computed(() => props.onToggle);
    const onDragStart = (event: DragEvent) => {
      event.dataTransfer.setData('text/plain', source.value.id);
      event.dataTransfer.effectAllowed = 'link';
    };
    return () => <button class={`source-card ${connected.value ? 'connected' : ''}`} type="button" draggable aria-pressed={connected.value} onClick={() => onToggle.value(source.value.id)} onDragstart={onDragStart} aria-label={`${source.value.name}, ${short(source.value.count)} ${source.value.unit}${connected.value ? ', connected' : ''}`}>
      <span class="source-icon"><Etch source={source.value} /></span>
      <span class="source-copy">
        <span class="source-name">{source.value.name}</span>
        <span class="source-meta">{short(source.value.count)} {source.value.unit}</span>
      </span>
      <span class="source-badge" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d={connected.value ? 'M3.5 8.5 6.5 11.5 12.5 4.5' : 'M8 3.5v9M3.5 8h9'} />
        </svg>
        <span>{connected.value ? 'Connected' : 'Connect'}</span>
      </span>
    </button>;
  }
});
const Stepper = defineComponent({
  name: "Stepper",
  props: {
    phase: {
      type: null as unknown as PropType<number>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const phase = computed(() => props.phase);
    return () => <div class="stepper" aria-label={phase.value < 0 ? 'Three steps: Read, Curate, Activate' : `Step ${phase.value + 1} of 3: ${stepNames[phase.value]}`}>
      {stepNames.map((name, index) => <div class="step-fragment" key={name}>
          <div aria-current={index === phase.value ? 'step' : undefined} class={`step ${index === phase.value ? 'active' : ''} ${index < phase.value ? 'done' : ''}`}>
            <span class="step-dot">{index < phase.value ? '✓' : index + 1}</span>
            <span class="step-name">{name}</span>
          </div>
          {index < stepNames.length - 1 ? <span aria-hidden="true" class={`step-line ${index < phase.value ? 'done' : ''}`} /> : null}
        </div>)}
    </div>;
  }
});
/* One header for every step: the open link on the left, the steps in the
   middle, and an empty cell that keeps them centred. */
const RunHead = defineComponent({
  name: "RunHead",
  props: {
    ids: {
      type: null as unknown as PropType<readonly SourceId[]>,
      required: true
    },
    phase: {
      type: null as unknown as PropType<number>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const ids = computed(() => props.ids);
    const phase = computed(() => props.phase);
    return () => <div class="run-head">
      {phase.value >= 0 ? <div class="linkstrip" aria-label={`${ids.value.map(id => sourceById[id].name).join(', ')} connected to Deasy`}>
          <span class="lk-sources" aria-hidden="true">
            {ids.value.map(id => <motion.span class="lk-source" layoutId={`src-${id}`} transition={MORPH} key={id}><Etch source={sourceById[id]} /></motion.span>)}
          </span>
          <span class="lk-pipe" aria-hidden="true" />
          <motion.span class="lk-mark" layoutId="deasy-mark" transition={MORPH} aria-hidden="true"><DeasyLogo /></motion.span>
        </div> : <div class="linkstrip linkstrip-placeholder" aria-hidden="true" />}
      <Stepper phase={phase.value} />
      <span />
    </div>;
  }
});
/* ── File tooltip ───────────────────────────────────────────────────────── */
type Hover = {
  id: number;
  align: 'start' | 'center' | 'end';
};

/**
 * One tooltip for a whole pile, pinned to the cursor through motion values
 * so following the pointer never re-renders the pile. Vue only hears
 * about it when the file under the pointer changes.
 */
const FilePile = defineComponent({
  name: "FilePile",
  props: {
    className: {
      type: null as unknown as PropType<string>,
      required: true
    },
    describe: {
      type: null as unknown as PropType<(id: number) => {
        name: string;
        reason: string;
        tone: string;
      }>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const className = computed(() => props.className);
    const describe = computed(() => props.describe);
    const hovered = shallowRef<Hover | null>(null);
    const setHovered = next => hovered.value = typeof next === "function" ? next(hovered.value) : next;
    const tipX = useMotionValue(0);
    const tipY = useMotionValue(0);
    const onPointerMove = (event: PointerEvent) => {
      const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      tipX.set(x);
      tipY.set(event.clientY - rect.top);
      const id = (event.target as HTMLElement).closest<HTMLElement>('[data-id]')?.dataset.id;
      const align = x < rect.width * 0.25 ? 'start' : x > rect.width * 0.75 ? 'end' : 'center';
      if (id !== undefined && (Number(id) !== hovered.value?.id || align !== hovered.value.align)) {
        setHovered({
          id: Number(id),
          align
        });
      }
    };
    const info = computed(() => hovered.value ? describe.value(hovered.value.id) : null);
    return () => <div class={`${className.value} file-pile`} onPointermove={onPointerMove} onPointerleave={() => setHovered(null)}>
      {slots.default?.call?.(slots)}
      <AnimatePresence>
        {info.value && hovered.value ? <motion.div class="file-tip" aria-hidden="true" data-align={hovered.value.align} style={{
          x: tipX,
          y: tipY
        }} initial={{
          opacity: 0
        }} animate={{
          opacity: 1,
          transition: {
            duration: 0.12
          }
        }} exit={{
          opacity: 0,
          transition: {
            duration: 0.08
          }
        }}>
            <span class="file-tip-name">{info.value.name}</span>
            <span class="file-tip-reason" data-tone={info.value.tone}>{info.value.reason}</span>
          </motion.div> : null}
      </AnimatePresence>
    </div>;
  }
});
/* ── Connect ────────────────────────────────────────────────────────────── */
const ConnectedPanel = defineComponent({
  name: "ConnectedPanel",
  props: {
    ids: {
      type: null as unknown as PropType<readonly SourceId[]>,
      required: true
    },
    onRead: {
      type: null as unknown as PropType<() => void>,
      required: true
    },
    showHeader: {
      type: null as unknown as PropType<boolean>,
      required: false
    }
  },
  setup(props, {
    slots
  }) {
    const ids = computed(() => props.ids);
    const onRead = computed(() => props.onRead);
    const showHeader = computed(() => props.showHeader ?? true);
    return () => <div class="report-panel connect-panel">
      {showHeader.value ? <RunHead ids={ids.value} phase={-1} /> : null}
      <div class="connect-body">
        <DeasyHub ids={ids.value} />
      </div>
      <div class="report-footer actions-only" style={{
        visibility: ids.value.length ? 'visible' : 'hidden'
      }}>
        <div class="footer-actions">
          <button class="button button-primary with-arrow" disabled={!ids.value.length} type="button" onClick={onRead.value}>Read it</button>
        </div>
      </div>
    </div>;
  }
});
/* ── Read and Curate: one pile, one count, one checklist ────────────────── */
const QualityPercent = defineComponent({
  name: "QualityPercent",
  props: {
    initial: {
      type: null as unknown as PropType<number>,
      required: true
    },
    resolving: {
      type: null as unknown as PropType<boolean>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const initial = computed(() => props.initial);
    const resolving = computed(() => props.resolving);
    const reduced = useMotionPreference();
    const value = useMotionValue(initial.value);
    const label = useTransform(value, n => `${Math.round(n)}%`);
    watchAfterMount(() => {
      if (reduced.value) {
        value.set(resolving.value ? 0 : initial.value);
        return;
      }
      const controls = tween(value, resolving.value ? 0 : initial.value, {
        duration: BEAT * 0.8,
        ease: EASE_IN_OUT
      });
      return () => controls.stop();
    }, () => [initial.value, resolving.value, reduced.value, value]);
    return () => <motion.strong class="quality-pct"><RowValue value={label} /></motion.strong>;
  }
});
const PileStage = defineComponent({
  name: "PileStage",
  props: {
    ids: {
      type: null as unknown as PropType<readonly SourceId[]>,
      required: true
    },
    combo: {
      type: null as unknown as PropType<Combo>,
      required: true
    },
    phase: {
      type: null as unknown as PropType<'read' | 'curate'>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const ids = computed(() => props.ids);
    const combo = computed(() => props.combo);
    const phase = computed(() => props.phase);
    const reduceMotion = useMotionPreference();
    const curating = computed(() => phase.value === 'curate');
    const unit = computed(() => unitOf(ids.value));
    const [scope, animate] = useAnimate<HTMLDivElement>();
    /* Each quality dimension gets one Curate beat. */
    const beat = shallowRef(-1);
    const setBeat = next => beat.value = typeof next === "function" ? next(beat.value) : next;
    const gathered = shallowRef(false);
    const setGathered = next => gathered.value = typeof next === "function" ? next(gathered.value) : next;
    const done = computed(() => gathered.value);
    /* Read opens on the sweep: the count climbs from nothing while each sheet
       picks up its tabs, column by column. Curate reopened from Activate
       starts from the full count instead. */
    const readingActive = shallowRef(!curating.value && !reduceMotion.value);
    const setReading = next => readingActive.value = typeof next === "function" ? next(readingActive.value) : next;
    const reading = computed(() => readingActive.value && !curating.value);

    /* The count runs down from what Read found to what survives, one beat's
       worth at a time. */
    const count = useMotionValue(reading.value ? 0 : toNumber(combo.value.count));
    watchAfterMount(() => {
      if (!reading.value) return;
      const controls = tween(count, toNumber(combo.value.count), {
        duration: READ_SWEEP,
        ease: EASE_IN_OUT
      });
      const timer = window.setTimeout(() => setReading(false), READ_SWEEP * 1000);
      return () => {
        controls.stop();
        window.clearTimeout(timer);
      };
    }, () => [reading.value, combo.value, count]);
    const shown = useTransform(count, abbreviate);
    watchAfterMount(() => {
      if (beat.value < 0) return;
      const progress = Math.min((beat.value + 1) * 4 / checks.length, 4);
      const from = Math.floor(progress);
      const start = toNumber(combo.value.counts[from]);
      const target = start + (toNumber(combo.value.counts[Math.min(from + 1, 4)]) - start) * (progress - from);
      if (reduceMotion.value) {
        count.set(target);
        return;
      }
      const controls = tween(count, target, {
        duration: BEAT * 0.75,
        ease: EASE_IN_OUT
      });
      return () => controls.stop();
    }, () => [beat.value, combo.value, count, reduceMotion.value]);
    watchAfterMount(() => {
      if (!curating.value) return;
      if (reduceMotion.value) {
        setBeat(checks.length);
        setGathered(true);
        return;
      }
      count.set(toNumber(combo.value.count));
      let live = true;
      const timers = Array.from({
        length: checks.length + 1
      }, (_, next) => window.setTimeout(() => setBeat(next), next * BEAT * 1000));
      const running: AnimationPlaybackControls[] = [];
      const track = (controls: AnimationPlaybackControls) => {
        running.push(controls);
        return controls;
      };
      const all = (selector: string) => Array.from(scope.value.querySelectorAll<HTMLElement>(selector));

      /* A caught sheet flashes its tab's colour, shrinks and fades, then
         comes back faintly as the outline it leaves in the pile. */
      const catchSheet = async (sheet: HTMLElement) => {
        await track(animate(sheet, {
          scale: [1, 1.04, 0.9],
          opacity: [1, 1, 0],
          '--catch': [0, 1, 0]
        }, {
          duration: 0.55,
          delay: Number(sheet.dataset.at),
          times: [0, 0.35, 1],
          ease: EASE
        }));
        if (!live) return;
        sheet.dataset.removed = '';
        await track(animate(sheet, {
          opacity: 0.5
        }, {
          duration: 0.2,
          ease: 'easeOut'
        }));
      };
      const steps = [...all('.run-pile > [data-kind="keep"]').map(sheet => track(animate(sheet, {
        scale: [1, 1.05, 1],
        '--catch': [0, 1, 1]
      }, {
        duration: 0.5,
        delay: KEEP_AT,
        ease: EASE
      }))), ...all('.run-pile > [data-kind]:not([data-kind="keep"])').map(catchSheet)];
      Promise.all(steps).then(() => {
        if (live) setGathered(true);
      });
      return () => {
        live = false;
        timers.forEach(window.clearTimeout);
        running.forEach(controls => controls.stop());
      };
    }, () => [curating.value, reduceMotion.value, animate, scope, count, combo.value.count]);
    return () => <div class={`run-body pile-stage ${curating.value ? 'is-curating' : ''}`} ref={scope}>
      <div class="pile-main">
        <div class={`hero ${done.value ? 'done' : ''}`} aria-live="polite">
          <motion.span class="hero-n" aria-label={done.value ? `${short(combo.value.counts[4])} ${unit.value} meet quality standards` : undefined}><RowValue value={shown} /></motion.span>
          <span class="hero-status" aria-hidden={curating.value || undefined} style={curating.value ? {
            visibility: 'hidden'
          } : undefined}>{unit.value} read</span>
        </div>
        <FilePile className={`document-swarm filter-swarm run-pile ${gathered.value ? 'gathered' : ''} ${reading.value ? 'reading' : ''}`} describe={id => describeSheet(id, curating.value)}>
          {sheets.map(({
            kind,
            at
          }, index) => {
            const tab = tabOf[kind];
            if (kind === 'keep') {
              return gathered.value ? <span class="filter-file vacated" data-kind={kind} key={index} /> : <motion.span class={`filter-file ${curating.value ? 'keep' : ''}`} layoutId={`doc-${index}`} transition={MORPH} data-kind={kind} data-paper={paperOf(index)} data-id={index} key={index} />;
            }
            return <span class={`filter-file ${kind}`} data-kind={kind} data-at={at} data-paper={paperOf(index)} data-id={index} style={{
              '--sweep': `${sweepOf(index)}ms`
            } as CSSProperties} key={index}>
                {tab ? <span class="file-flags" aria-hidden="true"><i data-flag={tab} /></span> : null}
              </span>;
          })}
          {gathered.value ? <div class="filter-result" key="result">
              {keptIds.map(id => <motion.span class="filter-file keep" layoutId={`doc-${id}`} transition={MORPH} data-paper={paperOf(id)} data-id={id} key={id} />)}
            </div> : null}
        </FilePile>
      </div>
      <div class="quality">
        <p class="eyebrow quality-head">Quality check</p>
        <ul class="quality-list">
          {checks.map((check, index) => ({
            check,
            index
          })).sort((a, b) => a.check.clears - b.check.clears).map(({
            check,
            index
          }) => {
            const cleared = curating.value && beat.value > check.clears;
            const active = curating.value && beat.value === check.clears;
            return <li class={`quality-row ${cleared ? 'cleared' : ''} ${active ? 'active' : ''}`} data-dim={check.key} key={check.key}>
                <span class="quality-name">{check.label}</span>
                <QualityPercent initial={combo.value.dims[index]} resolving={curating.value && beat.value >= check.clears} />
              </li>;
          })}
        </ul>
      </div>
    </div>;
  }
});
/* ── Activate ───────────────────────────────────────────────────────────── */
const QUERY = ['What are the renewal terms for enterprise customers', 'whose subscriptions started in December 2024?'] as const;
/* When each line starts typing and how long it takes, in seconds. */
const TYPE_LINES = [[0.25, 0.78], [1.05, 0.7]] as const;
const ANSWER_AT = 3.15;

/* Types the question out a character at a time. Reduced motion shows it. */
function useTypedQuery() {
  const reduceMotion = useMotionPreference();
  const typed = shallowRef<[number, number]>([0, 0]);
  const setTyped = next => typed.value = typeof next === "function" ? next(typed.value) : next;
  watchAfterMount(() => {
    if (reduceMotion.value) return;
    const started = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = (now - started) / 1000;
      const next = TYPE_LINES.map(([at, duration], line) => Math.round(Math.min(1, Math.max(0, (t - at) / duration)) * QUERY[line].length)) as [number, number];
      setTyped(current => current[0] === next[0] && current[1] === next[1] ? current : next);
      if (next[1] < QUERY[1].length) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, () => [reduceMotion.value]);
  return computed(() => reduceMotion.value ? [QUERY[0].length, QUERY[1].length] as const : typed.value);
}

/* The answer's path through the graph, each node lit in turn. */
type LabelPlace = {
  lx: number;
  ly: number;
  anchor: 'start' | 'middle' | 'end';
};
/* `narrow` moves a label that the phone crop would cut off. */
type PathNode = LabelPlace & {
  x: number;
  y: number;
  label: string;
  at: number;
  narrow?: LabelPlace;
};
const pathNodes: PathNode[] = [{
  x: 141.5,
  y: 126.7,
  label: 'Master agreement v4',
  at: 1.9,
  lx: 131,
  ly: 119,
  anchor: 'end',
  narrow: {
    lx: 132,
    ly: 111,
    anchor: 'start'
  }
}, {
  x: 162.9,
  y: 148.7,
  label: 'Renewal terms',
  at: 2.2,
  lx: 174,
  ly: 146,
  anchor: 'start'
}, {
  x: 226.1,
  y: 172.7,
  label: 'Dec 2024 cohort',
  at: 2.5,
  lx: 226.1,
  ly: 194,
  anchor: 'middle'
}, {
  x: 439.7,
  y: 182.6,
  label: 'Enterprise tier',
  at: 2.8,
  lx: 439.7,
  ly: 167,
  anchor: 'middle'
}];
const pathEdges = [0, 1, 2].map(index => ({
  from: pathNodes[index],
  to: pathNodes[index + 1],
  at: 1.95 + index * 0.3
}));

/* The graph's columns are the connected systems: one spans the field, two
   split it where the answer's path crosses from the first to the second. */
const captionsFor = (systems: readonly string[]) => systems.length === 1 ? [{
  name: systems[0],
  x: 310
}] : systems.length === 2 ? [{
  name: systems[0],
  x: 106
}, {
  name: systems[1],
  x: 416
}] : systems.map((name, index) => ({
  name,
  x: Math.round(620 * (index + 0.5) / systems.length)
}));

/* On a phone the whole field is too small to read, so the graph closes in
   on the answer's path. */
function useNarrow() {
  const query = '(max-width: 640px)';
  const narrow = shallowRef((() => typeof window !== 'undefined' && window.matchMedia(query).matches)());
  const setNarrow = next => narrow.value = typeof next === "function" ? next(narrow.value) : next;
  watchAfterMount(() => {
    const list = window.matchMedia(query);
    const onChange = () => setNarrow(list.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, () => []);
  return computed(() => narrow.value);
}
const EntityGraph = defineComponent({
  name: "EntityGraph",
  props: {
    systems: {
      type: null as unknown as PropType<readonly string[]>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const systems = computed(() => props.systems);
    const reduceMotion = useMotionPreference();
    const narrow = useNarrow();
    const reveal = (at: number) => reduceMotion.value ? {
      initial: false
    } : {
      transition: {
        delay: at,
        duration: 0.3,
        ease: EASE
      }
    };
    return () => <svg class="graph-svg" viewBox={narrow.value ? '70 96 440 132' : '0 0 620 244'} role="img" aria-label={`Entity graph across ${systems.value.join(', ')}, with the answer's path lit`}>
      <g class="gfield">
        {fieldEdges.map(([x1, y1, x2, y2, dashed], index) => <line class={`ge ${dashed ? 'dashed' : ''}`} x1={x1} y1={y1} x2={x2} y2={y2} key={index} />)}
        {fieldNodes.map(([cx, cy, column], index) => <circle class="gn" data-col={column} cx={cx} cy={cy} r={2.6} key={index} />)}
      </g>
      {narrow.value ? null : captionsFor(systems.value).map(({
        name,
        x
      }) => <text class="xcap" x={x} y={18} text-anchor="middle" key={name}>{name}</text>)}
      {pathEdges.map(({
        from,
        to,
        at
      }) => <motion.line class="ge on" x1={from.x} y1={from.y} x2={to.x} y2={to.y} initial={{
        pathLength: 0,
        opacity: 0
      }} animate={{
        pathLength: 1,
        opacity: 1
      }} {...reveal(at)} key={at} />)}
      {pathNodes.map(({
        narrow: cropped,
        ...node
      }) => ({
        ...node,
        ...(narrow.value ? cropped : undefined)
      })).map(node => <motion.g class="gnode" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} {...reveal(node.at)} key={node.label}>
          <circle class="ghalo" cx={node.x} cy={node.y} r={10} />
          <circle class="gn lit" cx={node.x} cy={node.y} r={4} />
          <text class="glabel" x={node.lx} y={node.ly} text-anchor={node.anchor}>{node.label}</text>
        </motion.g>)}
      {/* Answering it leaves the graph one connection richer. */}
      <g class="mnode">
        <line class="medge" x1={439.7} y1={182.6} x2={479.7} y2={216.6} />
        <circle class="gn new" cx={479.7} cy={216.6} r={3.4} />
      </g>
    </svg>;
  }
});
const ActivateStage = defineComponent({
  name: "ActivateStage",
  props: {
    ids: {
      type: null as unknown as PropType<readonly SourceId[]>,
      required: true
    },
    combo: {
      type: null as unknown as PropType<Combo>,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const ids = computed(() => props.ids);
    const combo = computed(() => props.combo);
    const systems = computed(() => ids.value.map(id => sourceById[id].name));
    const citedIds = computed(() => citedFor(systems.value.length));
    const typed = useTypedQuery();
    const reduceMotion = useMotionPreference();
    const answered = shallowRef(Boolean(reduceMotion.value));
    const setAnswered = next => answered.value = typeof next === "function" ? next(answered.value) : next;
    watchAfterMount(() => {
      if (reduceMotion.value) return;
      const timer = window.setTimeout(() => setAnswered(true), ANSWER_AT * 1000);
      return () => window.clearTimeout(timer);
    }, () => [reduceMotion.value]);
    const arrive = (at: number) => reduceMotion.value ? {
      initial: false as const
    } : {
      initial: {
        opacity: 0,
        y: 6
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        delay: at,
        duration: 0.28,
        ease: EASE
      }
    };
    const typing = computed(() => typed.value[1] < QUERY[1].length);
    return () => <div class="run-body activate-stage">
      <motion.div class="ai-query chat-composer" {...arrive(0)}>
        <span class="query-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span class="chat-composer-text">
          <span class="typed-query" aria-label={QUERY.join(' ')}>
            {QUERY.map((line, index) => <span class="typed-line" aria-hidden="true" key={index}>
                {line.slice(0, typed.value[index])}
                {typing.value && (index === 1 ? typed.value[0] === QUERY[0].length : typed.value[0] < QUERY[0].length) ? <span class="caret" /> : null}
              </span>)}
          </span>
        </span>
        <span class="chat-composer-connectors">
          <span class="connector connector-deasy">
            <DeasyLogo class="connector-logo" />
          </span>
        </span>
      </motion.div>
      <div class="activate-grid">
        <div class="activate-context">
          {/* What Curate kept is what the agent reads from; the three it
              answers with are marked when the answer lands. */}
          <div class="context-strip">
            <span class="kept-strip">
              {keptIds.map(id => <motion.span class={`filter-file keep ${answered.value && citedIds.value.includes(id) ? 'cited' : ''}`} layoutId={`doc-${id}`} transition={MORPH} data-paper={paperOf(id)} key={id} />)}
            </span>
            <span class="context-caption">{short(combo.value.counts[4])} curated {unitOf(ids.value)}</span>
          </div>
          <motion.div class="graph-wrap" {...arrive(1.6)}>
            <EntityGraph systems={systems.value} />
          </motion.div>
        </div>
        <motion.div class="answer good-answer" {...arrive(ANSWER_AT)} aria-live="polite">
          <div class="verdict">{systems.value.length > 1 ? `From ${systems.value.length} sources` : `From your ${systems.value[0]}`}</div>
          <p>
            Those accounts renew on a <strong>12-month term with 60 days’ notice</strong>, under v4 of the master agreement.
            Subscriptions that started before November 2024 stay on the legacy 30-day notice.
          </p>
          <div class="citation"><DocumentIcon /> {citedIds.value.length} cited files</div>
        </motion.div>
      </div>
    </div>;
  }
});
/* ── The run: one frame from Read to Activate ───────────────────────────── */
const RunPanel = defineComponent({
  name: "RunPanel",
  props: {
    ids: {
      type: null as unknown as PropType<readonly SourceId[]>,
      required: true
    },
    combo: {
      type: null as unknown as PropType<Combo>,
      required: true
    },
    phase: {
      type: null as unknown as PropType<RunPhase>,
      required: true
    },
    epoch: {
      type: null as unknown as PropType<number>,
      required: true
    },
    onBack: {
      type: null as unknown as PropType<() => void>,
      required: true
    },
    onNext: {
      type: null as unknown as PropType<() => void>,
      required: true
    },
    showHeader: {
      type: null as unknown as PropType<boolean>,
      required: false
    }
  },
  setup(props, {
    slots
  }) {
    const ids = computed(() => props.ids);
    const combo = computed(() => props.combo);
    const phase = computed(() => props.phase);
    const epoch = computed(() => props.epoch);
    const onBack = computed(() => props.onBack);
    const onNext = computed(() => props.onNext);
    const showHeader = computed(() => props.showHeader ?? true);
    return () => <div class="report-panel run-panel" data-phase={phase.value}>
      {showHeader.value ? <RunHead ids={ids.value} phase={stepOf[phase.value]} /> : null}
      {phase.value === 'activate' ? <ActivateStage ids={ids.value} combo={combo.value} /> : <PileStage ids={ids.value} combo={combo.value} phase={phase.value} key={epoch.value} />}
      {phase.value === 'activate' ? <div class="retrieve-footer">
          <button class="button button-ghost" type="button" onClick={onBack.value}>Back</button>
          <a class="button button-primary with-arrow" href="https://www.deasylabs.com/demo">
            <span class="desktop-button-label">See it on your data</span>
            <span class="mobile-button-label">See demo</span>
          </a>
        </div> : <div class="report-footer actions-only">
          <div class="footer-actions">
            <button class="button button-ghost" type="button" onClick={onBack.value}>Back</button>
            <button class="button button-primary with-arrow" type="button" onClick={onNext.value}>
              {phase.value === 'read' ? 'Curate it' : 'Ask your agent'}
            </button>
          </div>
        </div>}
    </div>;
  }
});
/* ── The blade ──────────────────────────────────────────────────────────── */
export const HowItWorksDemo = defineComponent({
  name: "HowItWorksDemo",
  props: {
    fixedHeader: {
      type: null as unknown as PropType<boolean>,
      required: false
    }
  },
  setup(props, {
    slots
  }) {
    const fixedHeader = computed(() => props.fixedHeader ?? false);
    const connected = shallowRef<SourceId[]>([]);
    const setConnected = next => connected.value = typeof next === "function" ? next(connected.value) : next;
    const phase = shallowRef<Phase>('connect');
    /* Going back to Read starts the pile over. */
    const setPhase = next => phase.value = typeof next === "function" ? next(phase.value) : next;
    const epoch = shallowRef(0);
    const setEpoch = next => epoch.value = typeof next === "function" ? next(epoch.value) : next;
    const dropActive = shallowRef(false);
    const setDropActive = next => dropActive.value = typeof next === "function" ? next(dropActive.value) : next;
    const scannerRef = shallowRef<HTMLDivElement>(null);
    const sourcesRef = shallowRef<HTMLDivElement>(null);
    const combo = computed(() => connected.value.length ? comboFor(connected.value) : undefined);
    const running = computed(() => phase.value !== 'connect' && combo.value);

    /* A tap connects a source, or disconnects one that is already in. */
    const toggle = (id: SourceId) => {
      setPhase('connect');
      setConnected(current => current.includes(id) ? current.filter(other => other !== id) : [...current, id]);
    };
    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      setDropActive(false);
      const id = event.dataTransfer.getData('text/plain');
      if (Object.hasOwn(sourceById, id) && !connected.value.includes(id as SourceId)) toggle(id as SourceId);
    };
    const changeSource = () => {
      setPhase('connect');
      requestAnimationFrame(() => sourcesRef.value?.querySelector('button')?.focus());
    };
    const go = (next: Phase) => {
      if (next === 'read') setEpoch(current => current + 1);
      setPhase(next);
      requestAnimationFrame(() => scannerRef.value?.focus({
        preventScroll: true
      }));
    };
    const back = () => phase.value === 'read' ? changeSource() : go(phase.value === 'activate' ? 'curate' : 'read');
    const next = () => go(phase.value === 'read' ? 'curate' : 'activate');
    return () => <MotionConfig reducedMotion="user">
      <section class="wrap scan-section" id="how-it-works">
        <div class="scanner-toolbar">
          {!running.value ? <div class="blade-tab"><span class="tab-dot" />Connect one or more sources</div> : <>
              <div class="blade-tab selected-source-tab"><span class="tab-dot" />{countLabel(connected.value.length)}</div>
              <button class="source-switch" type="button" onClick={changeSource}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M2.5 5.5h9l-2.5-2.5M13.5 10.5h-9l2.5 2.5" />
                </svg>
                Change source
              </button>
            </>}
        </div>
        <div class={`rig ${running.value ? 'has-source' : ''} ${connected.value.length ? 'is-connected' : ''}`}>
          {fixedHeader.value ? <RunHead ids={connected.value} phase={stepOf[phase.value]} /> : null}
          <div class="stage">
            {!running.value ? <div class="source-column">
                <div class="eyebrow column-label">Your data sources</div>
                <div class="sources" ref={sourcesRef}>
                  {sources.map(source => <SourceCard source={source} connected={connected.value.includes(source.id)} onToggle={toggle} key={source.id} />)}
                </div>
              </div> : null}
            <div class={`scanner ${dropActive.value ? 'hot' : ''}`} ref={scannerRef} tabindex={-1} onDragover={event => {
              event.preventDefault();
              setDropActive(true);
            }} onDragleave={() => setDropActive(false)} onDrop={onDrop}>
                <div class="selected-report" key={running.value ? `run-${comboKey(connected.value)}` : 'connect'}>
                  {running.value ? <RunPanel ids={connected.value} combo={combo.value} phase={phase.value as RunPhase} epoch={epoch.value} onBack={back} onNext={next} showHeader={!fixedHeader.value} /> : <ConnectedPanel ids={connected.value} onRead={() => go('read')} showHeader={!fixedHeader.value} />}
                </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>;
  }
});
