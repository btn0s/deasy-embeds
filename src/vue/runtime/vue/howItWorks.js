import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, Transition } from 'vue';
import { combos, fieldEdges, fieldNodes } from '../prototypes/how-it-works/bladeData';
const sources = [
    { id: 's3', label: 'S3 bucket', count: '412,000 files', icon: 'S3', mark: '/brand/integrations/amazon-s3-etch.png' },
    { id: 'sp', label: 'SharePoint site', count: '186,000 files', icon: 'SP', mark: '/brand/integrations/sharepoint.svg' },
    { id: 'gcs', label: 'GCS bucket', count: '524,000 files', icon: 'GCS', mark: '/brand/integrations/google-cloud-storage-etch.svg' },
    { id: 'cf', label: 'Confluence space', count: '68,000 pages', icon: 'C', mark: '/brand/integrations/confluence.svg' },
];
const sourceOrder = sources.map(({ id }) => id);
const checks = ['Duplicates', 'Stale', 'Sensitive', 'Off-topic', 'Missing metadata', 'Incomplete', 'Conflicting information'];
const files = ['Master_Agreement_v4.pdf', 'Renewal_Terms_2025.docx', 'Enterprise_Tier_Pricing.xlsx', 'Dec_2024_Cohort.csv', 'Order_Form_Template.docx', 'Security_Overview.pdf'];
const names = ['Read', 'Curate', 'Activate'];
const color = { rust: '#b7500c', clay: '#d9d2c4', slate: '#5f7193', sage: '#8ba68c', chalk: '#fbf9f5', paper: '#f7f3eb', pitch: '#24221e', ash: '#49463f', ochre: '#d67e43' };
const styles = `
.deasy-vue-how{--pitch:#24221e;--ash:#49463f;--chalk:#fbf9f5;--paper:#f7f3eb;--clay:#d9d2c4;--stone:#b4ac9d;--rust:#b7500c;--slate:#5f7193;--sage:#8ba68c;--ochre:#d67e43;min-height:100vh;padding:24px max(20px,calc((100vw - 1160px)/2)) 44px;background:#2f2c25;color:var(--pitch);font-family:'Rethink Sans',sans-serif;box-sizing:border-box}.deasy-vue-how *{box-sizing:border-box}.deasy-vue-how__intro{margin:25px 0 32px;color:var(--chalk);font:400 48px/1.15 'Gilda Display',serif}.deasy-vue-how__toolbar{display:flex;align-items:center;gap:12px;color:var(--chalk);height:36px;font-size:13px}.deasy-vue-how__dot{width:7px;height:7px;border-radius:50%;background:var(--sage)}.deasy-vue-how__switch{margin-left:6px;border:0;background:none;color:var(--stone);text-decoration:underline;text-underline-offset:3px;cursor:pointer;font:500 12px 'Rethink Sans',sans-serif}.deasy-vue-how__rig{display:grid;grid-template-columns:260px minmax(0,1fr);gap:24px;padding:24px;border:1px dashed var(--stone);border-radius:4px;background:var(--paper);min-height:520px}.deasy-vue-how__sources{display:grid;gap:8px;align-content:start}.deasy-vue-how__source{display:grid;grid-template-columns:36px 1fr 20px;align-items:center;gap:10px;padding:12px;border:1px solid #e8e2d7;border-radius:4px;background:var(--chalk);text-align:left;color:var(--pitch);cursor:pointer;font:inherit;transition:border-color .16s ease,background .16s ease}.deasy-vue-how__source:hover{border-color:var(--stone)}.deasy-vue-how__source[aria-pressed=true]{border-color:var(--rust);background:#fffaf3}.deasy-vue-how__mark{width:28px;height:28px;background:var(--ash);-webkit-mask:var(--mark) center/contain no-repeat;mask:var(--mark) center/contain no-repeat}.deasy-vue-how__source b{display:block;font-size:13px;font-weight:600}.deasy-vue-how__source small{color:#777269;font-size:11px}.deasy-vue-how__check{color:var(--rust);font-size:18px}.deasy-vue-how__panel{position:relative;min-height:470px;padding:8px 4px;display:flex;flex-direction:column}.deasy-vue-how__connected{display:grid;place-items:center;align-content:center;text-align:center;min-height:450px}.deasy-vue-how__hub{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:0 auto 24px}.deasy-vue-how__hub span{padding:8px 12px;border:1px solid var(--clay);background:var(--chalk);border-radius:4px;font-size:12px}.deasy-vue-how__connected h3,.deasy-vue-how__stage h3{font:400 28px/1.2 'Gilda Display',serif;margin:4px 0 8px}.deasy-vue-how__connected p,.deasy-vue-how__stage p{color:#6f6a60;font-size:13px;line-height:1.5;margin:0 0 20px}.deasy-vue-how__button{border:0;border-radius:4px;background:var(--rust);color:white;padding:10px 16px;font:600 12px 'Rethink Sans',sans-serif;cursor:pointer;transition:background .15s ease,transform .15s ease}.deasy-vue-how__button:hover{background:#aa4c0e}.deasy-vue-how__button:active{transform:scale(.98)}.deasy-vue-how__button:disabled{opacity:.45;cursor:not-allowed}.deasy-vue-how__stepper{display:flex;gap:0;align-items:center;margin:2px 0 24px}.deasy-vue-how__step{display:flex;align-items:center;gap:7px;color:#777269;font-size:12px}.deasy-vue-how__step i{display:grid;place-items:center;width:22px;height:22px;border:1px solid var(--clay);border-radius:50%;font-style:normal}.deasy-vue-how__step.active{color:var(--rust);font-weight:600}.deasy-vue-how__step.active i{background:var(--rust);color:white;border-color:var(--rust)}.deasy-vue-how__line{height:1px;flex:1;background:var(--clay);margin:0 10px}.deasy-vue-how__stage{display:flex;flex-direction:column;flex:1}.deasy-vue-how__count{font:400 44px/1 'Gilda Display',serif;color:var(--rust);margin:8px 0 4px}.deasy-vue-how__quality{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:14px 0 22px}.deasy-vue-how__quality article{padding:12px;border-bottom:1px dashed var(--clay);font-size:12px;display:flex;justify-content:space-between;gap:8px}.deasy-vue-how__quality b{font:400 20px 'Gilda Display',serif}.deasy-vue-how__pile{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px;margin:12px 0 18px}.deasy-vue-how__file{display:grid;place-items:center;aspect-ratio:1.2;background:linear-gradient(140deg,#fff 0 68%,#e8e2d7 69%);border:1px solid #d9d2c4;color:#776f62;font-size:8px;padding:5px;overflow:hidden;transition:opacity .2s ease,transform .2s ease}.deasy-vue-how__file.removed{opacity:.28;transform:scale(.94)}.deasy-vue-how__graph{width:100%;height:200px;background:radial-gradient(ellipse,#fff 0,transparent 70%)}.deasy-vue-how__graph line{stroke:#9dabb5;stroke-width:1}.deasy-vue-how__graph circle{fill:var(--slate)}.deasy-vue-how__answer{padding:15px;border-left:3px solid var(--sage);background:#fff;margin:14px 0;color:#39362f;font-size:13px;line-height:1.55}.deasy-vue-how__actions{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:16px}.deasy-vue-how__stage-head{display:flex;justify-content:space-between;align-items:start}.deasy-vue-how__source-count{font-size:11px;color:#6f6a60}.deasy-vue-how__caption{color:#777269;font-size:11px}.deasy-vue-how__stage-enter-active,.deasy-vue-how__stage-leave-active{transition:opacity .18s ease,transform .18s ease}.deasy-vue-how__stage-enter-from{opacity:0;transform:translateY(7px)}.deasy-vue-how__stage-leave-to{opacity:0;transform:translateY(-5px)}@media(max-width:760px){.deasy-vue-how{padding:15px 14px 24px}.deasy-vue-how__intro{font-size:38px;margin:18px 0 22px}.deasy-vue-how__rig{grid-template-columns:1fr;padding:14px;gap:16px}.deasy-vue-how__sources{grid-template-columns:repeat(2,minmax(0,1fr))}.deasy-vue-how__source{grid-template-columns:28px 1fr;padding:9px;gap:7px}.deasy-vue-how__mark{width:24px;height:24px}.deasy-vue-how__check{display:none}.deasy-vue-how__panel{min-height:430px}.deasy-vue-how__quality{grid-template-columns:1fr}.deasy-vue-how__pile{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;
const fmt = (value) => value.toLocaleString('en-US');
const comboKey = (ids) => [...ids].sort((a, b) => sourceOrder.indexOf(a) - sourceOrder.indexOf(b)).join('_');
const aggregate = (ids) => {
    if (!ids.length)
        return undefined;
    if (combos[comboKey(ids)])
        return combos[comboKey(ids)];
    const chunks = ids.map((id) => combos[id]);
    const sumAt = (get) => fmt(chunks.reduce((total, item) => total + Number(get(item).replaceAll(',', '')), 0));
    const count = sumAt((item) => item.count);
    const n = Number(count.replaceAll(',', ''));
    return {
        count,
        dims: chunks[0].dims.map((_, i) => Math.round(chunks.reduce((s, item) => s + item.dims[i] * Number(item.count.replaceAll(',', '')), 0) / n)),
        counts: [0, 1, 2, 3, 4].map((i) => sumAt((item) => item.counts[i])),
        systems: chunks[0].systems,
    };
};
/** Latest How it Works flow, implemented as a Vue state machine. */
export const VueHowItWorks = defineComponent({
    name: 'VueHowItWorks',
    props: {
        design: { type: String, default: 'site' },
        colorMode: { type: String, default: 'light' },
        transparent: { type: Boolean, default: false },
        loadFonts: { type: Boolean, default: true },
    },
    setup(props, { attrs }) {
        const connected = ref([]);
        const phase = ref(-1);
        const epoch = ref(0);
        const info = computed(() => aggregate(connected.value));
        const runPhase = computed(() => phase.value >= 0);
        const toggleSource = (id) => {
            connected.value = connected.value.includes(id) ? connected.value.filter((value) => value !== id) : [...connected.value, id];
            phase.value = -1;
        };
        const acceptDrop = (event) => {
            event.preventDefault();
            const id = event.dataTransfer?.getData('text/plain');
            if (id && sourceOrder.includes(id) && !connected.value.includes(id))
                toggleSource(id);
        };
        const begin = () => { phase.value = 0; epoch.value++; };
        const go = (next) => { phase.value = Math.max(0, Math.min(2, next)); if (next === 0)
            epoch.value++; };
        const stepper = () => h('div', { class: 'deasy-vue-how__stepper', 'aria-label': `${names[phase.value]} phase` }, names.flatMap((name, index) => [
            h('span', { class: ['deasy-vue-how__step', { active: phase.value === index }], key: name }, [h('i', String(index + 1)), name]),
            index < 2 ? h('span', { class: 'deasy-vue-how__line', key: `${name}-line` }) : null,
        ]));
        const pile = () => h('div', { class: 'deasy-vue-how__pile', key: epoch.value }, files.map((file, index) => h('span', {
            key: file,
            class: ['deasy-vue-how__file', { removed: phase.value === 1 && index > 1 }],
            title: file,
        }, file)));
        const panelBody = () => {
            if (!info.value)
                return h('div', { class: 'deasy-vue-how__connected' }, [
                    h('div', { class: 'deasy-vue-how__hub' }, connected.value.length ? connected.value.map((id) => h('span', sourceOrder.indexOf(id) + 1 + ' · ' + sources.find((source) => source.id === id)?.label)) : [h('span', 'Connect data sources to Deasy')]),
                    h('h3', connected.value.length ? `${connected.value.length} source${connected.value.length === 1 ? '' : 's'} connected` : 'Connect your sources'),
                    h('p', connected.value.length ? 'Read, curate and activate trusted context for your agents.' : 'Pick one or more sources to see your data move through Deasy.'),
                    h('button', { class: 'deasy-vue-how__button', disabled: !connected.value.length, onClick: begin }, 'Read your data →'),
                ]);
            const current = info.value;
            if (phase.value === 0)
                return h('div', { class: 'deasy-vue-how__stage' }, [
                    h('div', { class: 'deasy-vue-how__stage-head' }, [h('div', [h('h3', 'Read across your sources'), h('p', 'Seven quality checks reveal what your agents would otherwise miss.')]), h('small', { class: 'deasy-vue-how__source-count' }, current.count + ' total')]),
                    h('div', { class: 'deasy-vue-how__count' }, current.count),
                    h('div', { class: 'deasy-vue-how__quality' }, checks.map((check, i) => h('article', { key: check }, [check, h('b', `${current.dims[i]}%`)]))),
                    pile(),
                ]);
            if (phase.value === 1)
                return h('div', { class: 'deasy-vue-how__stage' }, [
                    h('div', { class: 'deasy-vue-how__stage-head' }, [h('div', [h('h3', 'Curate the useful context'), h('p', 'Duplicates, stale files and sensitive data leave the stream.')]), h('small', { class: 'deasy-vue-how__source-count' }, `${current.counts[4]} kept`)]),
                    h('div', { class: 'deasy-vue-how__count' }, current.counts[phase.value + 1]),
                    h('div', { class: 'deasy-vue-how__caption' }, `Quality pass ${phase.value + 1} of 4 · ${current.counts[phase.value + 1]} documents remain`),
                    pile(),
                ]);
            return h('div', { class: 'deasy-vue-how__stage' }, [
                h('div', { class: 'deasy-vue-how__stage-head' }, [h('div', [h('h3', 'Activate trusted answers'), h('p', 'Your agent follows entities across connected systems and cites what it used.')]), h('small', { class: 'deasy-vue-how__source-count' }, current.systems.join(' · '))]),
                h('svg', { class: 'deasy-vue-how__graph', viewBox: '0 0 500 244', role: 'img', 'aria-label': `Entity graph across ${current.systems.join(', ')}` }, [
                    ...fieldEdges.map(([x1, y1, x2, y2, dashed], i) => h('line', { key: i, x1, x2, y1, y2, 'stroke-dasharray': dashed ? '4 4' : undefined })),
                    ...fieldNodes.map(([x, y], i) => h('circle', { key: `n${i}`, cx: x, cy: y, r: 2.6 })),
                ]),
                h('div', { class: 'deasy-vue-how__answer' }, [h('strong', 'Answer from your context'), h('br'), 'Those accounts renew on a 12-month term with 60 days’ notice, under v4 of the master agreement.']),
            ]);
        };
        let fontLink;
        onMounted(() => {
            if (props.loadFonts && !document.head.querySelector('[data-deasy-vue-fonts]')) {
                fontLink = document.createElement('link');
                fontLink.rel = 'stylesheet';
                fontLink.href = 'https://fonts.googleapis.com/css2?family=Gilda+Display&family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap';
                fontLink.dataset.deasyVueFonts = '';
                document.head.append(fontLink);
            }
        });
        onBeforeUnmount(() => { if (fontLink && !fontLink.isConnected)
            fontLink.remove(); });
        return () => h('section', { ...attrs, class: ['deasy-vue-how', attrs.class], 'data-design': props.design, 'data-color-mode': props.colorMode, 'data-transparent': props.transparent || undefined }, [
            h('style', styles),
            h('h2', { class: 'deasy-vue-how__intro' }, 'How it works'),
            h('div', { class: 'deasy-vue-how__toolbar' }, [h('i', { class: 'deasy-vue-how__dot' }), runPhase.value ? `${connected.value.length} sources connected` : 'Connect one or more sources', runPhase.value ? h('button', { class: 'deasy-vue-how__switch', onClick: () => { phase.value = -1; } }, 'Change sources') : null]),
            h('div', { class: 'deasy-vue-how__rig' }, [
                h('div', { class: 'deasy-vue-how__sources', 'aria-label': 'Your data sources' }, sources.map((source) => h('button', { key: source.id, class: 'deasy-vue-how__source', type: 'button', draggable: true, 'aria-pressed': connected.value.includes(source.id), onClick: () => toggleSource(source.id), onDragstart: (event) => { event.dataTransfer?.setData('text/plain', source.id); if (event.dataTransfer)
                        event.dataTransfer.effectAllowed = 'link'; } }, [h('i', { class: 'deasy-vue-how__mark', style: { '--mark': `url("${source.mark}")` } }), h('span', [h('b', source.label), h('small', source.count)]), h('span', { class: 'deasy-vue-how__check' }, connected.value.includes(source.id) ? '✓' : '+')]))),
                h('div', { class: 'deasy-vue-how__panel', onDragover: (event) => event.preventDefault(), onDrop: acceptDrop }, [
                    runPhase.value && stepper(),
                    h(Transition, { name: 'deasy-vue-how__stage', mode: 'out-in' }, { default: () => h('div', { key: `${phase.value}:${connected.value.join(',')}`, class: 'deasy-vue-how__body' }, panelBody()) }),
                    runPhase.value ? h('div', { class: 'deasy-vue-how__actions' }, [
                        h('button', { class: 'deasy-vue-how__button', onClick: () => go(phase.value - 1) }, phase.value === 0 ? '← Sources' : '← Back'),
                        h('button', { class: 'deasy-vue-how__button', onClick: () => phase.value === 2 ? begin() : go(phase.value + 1) }, phase.value === 2 ? 'Restart →' : phase.value === 0 ? 'Curate it →' : 'Ask your agent →'),
                    ]) : null,
                ]),
            ]),
        ]);
    },
});
