import { C as e, D as t, S as n, _ as r, b as i, g as a, h as o, l as s, n as c, o as l, p as u, s as d, t as f, u as p, v as m, w as h, x as g, y as _ } from "./shadow-gZh4r8ik.js";
import { a as v, i as y, n as b, o as x, r as S, t as ee } from "./use-animate-Bfrm0Xf9.js";
//#region node_modules/.pnpm/motion-dom@13.1.1/node_modules/motion-dom/dist/es/utils/transform.mjs
function C(...e) {
	let t = !Array.isArray(e[0]), n = t ? 0 : -1, r = e[0 + n], i = e[1 + n], a = e[2 + n], s = e[3 + n], c = o(i, a, s);
	return t ? c(r) : c;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/value/use-combine-values.mjs
function w(e, t) {
	let n = b(t()), i = () => n.set(t());
	return i(), m(() => {
		let t = () => r.preRender(i, !1, !0), n = e.map((e) => e.on("change", t));
		return () => {
			n.forEach((e) => e()), a(i);
		};
	}), n;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/value/use-computed.mjs
function te(e) {
	u.current = [], e();
	let t = w(u.current, e);
	return u.current = void 0, t;
}
//#endregion
//#region node_modules/.pnpm/framer-motion@13.1.1_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/framer-motion/dist/es/value/use-transform.mjs
function T(e, t, n, r) {
	if (typeof e == "function") return te(e);
	if (n !== void 0 && !Array.isArray(n) && typeof t != "function") return ne(e, t, n, r);
	let i = typeof t == "function" ? t : C(t, n, r), a = Array.isArray(e) ? E(e, i) : E([e], ([e]) => i(e)), o = Array.isArray(e) ? void 0 : e.accelerate;
	return o && !o.isTransformed && typeof t != "function" && Array.isArray(n) && r?.clamp !== !1 && (a.accelerate = {
		...o,
		times: t,
		keyframes: n,
		isTransformed: !0,
		...r?.ease ? { ease: r.ease } : {}
	}), a;
}
function E(e, t) {
	let n = _(() => []);
	return w(e, () => {
		n.length = 0;
		let r = e.length;
		for (let t = 0; t < r; t++) n[t] = e[t].get();
		return t(n);
	});
}
function ne(e, t, n, r) {
	let i = _(() => Object.keys(n)), a = _(() => ({}));
	for (let o of i) a[o] = T(e, t, n[o], r);
	return a;
}
//#endregion
//#region src/prototypes/how-it-works/howItWorks.css?inline
var re = ".how-it-works{--col:860px;--panel-r:12px;--q-sen:#a63d40;--ink-meter:color-mix(in srgb, var(--foreground) 42%, transparent);--graph-edge:color-mix(in srgb, var(--ink-faint) 34%, transparent);--graph-node:color-mix(in srgb, var(--ink-faint) 42%, var(--card));--graph-path:color-mix(in srgb, var(--foreground) 82%, transparent);--pw-body:#24221e;--pw-edge:#24221e;--pw-socket:#15140f;--pw-socket-edge:#383429;--pw-pin:#4a4437;--pw-mark:#fbf9f5}.variant-shell[data-color-mode=dark] .how-it-works{--q-sen:#e07c77;--pw-body:#161410;--pw-edge:#383429;--pw-socket:#0f0e0b}.how-it-works .file-flags [data-flag=sen]{--flag:var(--q-sen)}.how-it-works .filter-file.sen{--catch-color:var(--q-sen)}.how-it-works .filter-file.old{--catch-color:var(--metric-duplicate)}.how-it-works .file-tip-reason[data-tone=sen]{color:var(--q-sen)}.how-it-works .file-tip-reason[data-tone=old]{color:var(--metric-duplicate)}.how-it-works .eyebrow{color:var(--ink-faint);font:500 11px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase}.scanner-gunmetal.how-it-works .scanner{height:548px}.scanner-gunmetal.how-it-works .report-panel{padding:20px}.variant-shell[data-color-mode] .how-it-works .source-card{animation:none;overflow:visible}.how-it-works .source-card.connected{border-color:color-mix(in srgb, var(--good) 55%, var(--border-soft))}.how-it-works .column-label{height:auto;margin-bottom:12px}.how-it-works .source-badge{border:1px dashed var(--line);color:var(--ink-faint);font:500 11px/1.2 var(--sans);white-space:nowrap;border-radius:999px;flex:none;align-self:start;padding:3px 8px;transition:color .15s,border-color .15s}.how-it-works .source-card.connected .source-badge{border:1px solid color-mix(in srgb, var(--good) 50%, transparent);background:var(--good-bg);color:var(--good)}@media (hover:hover) and (pointer:fine){.how-it-works .source-card:not(.connected):hover .source-badge{border-style:solid;border-color:color-mix(in srgb, var(--brand-signal) 55%, transparent);color:var(--brand-emphasis)}}.variant-shell[data-color-mode] .how-it-works .rig.is-connected .scanner{border-style:solid;border-color:var(--line);box-shadow:inset 0 1px 0 var(--surface-highlight)}.variant-shell[data-color-mode] .how-it-works .rig .scanner.hot{border-color:var(--brand-signal)}.how-it-works .portwall{border:1px solid var(--pw-edge);border-radius:var(--panel-r);background:var(--pw-body);box-shadow:0 10px 26px var(--shadow-ambient);flex:none;display:flex}.how-it-works .pw-sockets{flex-direction:column;justify-content:center;gap:10px;padding:14px 8px 14px 10px;display:flex}.how-it-works .socket{box-sizing:border-box;border:1px solid var(--pw-socket-edge);background:var(--pw-socket);border-radius:3px;flex-direction:column;justify-content:center;align-items:center;gap:4px;width:17px;height:23px;transition:border-color .2s,background-color .2s;display:flex}.how-it-works .socket i{background:var(--pw-pin);border-radius:1px;width:8px;height:3px;transition:background-color .2s}.how-it-works .socket.next{animation:2.4s ease-in-out infinite hiw-socket}.how-it-works .socket.filled{border-color:color-mix(in srgb, var(--good) 70%, var(--pw-socket-edge))}.how-it-works .socket.filled i{background:var(--good)}@keyframes hiw-socket{0%,to{border-color:var(--pw-socket-edge)}50%{border-color:var(--brand-signal)}}.how-it-works .pw-body{border-left:1px solid var(--pw-edge);flex-direction:column;justify-content:center;gap:12px;padding:18px 24px 18px 16px;display:flex}.how-it-works .pw-mark{color:var(--pw-mark);font:700 19px/1 var(--sans);letter-spacing:-.02em}.how-it-works .pw-mark b,.how-it-works .lk-mark b{color:var(--brand-signal)}.how-it-works .pw-live{gap:5px;display:flex}.how-it-works .pw-live em{background:var(--pw-pin);border-radius:50%;width:5px;height:5px;transition:background-color .3s}.how-it-works .pw-live.on em{background:var(--good)}.how-it-works .pw-live.on em:nth-child(2){transition-delay:60ms}.how-it-works .pw-live.on em:nth-child(3){transition-delay:.12s}.how-it-works .drop-empty{gap:20px}.how-it-works .drop-empty p{gap:6px;max-width:none;display:grid}.how-it-works .tap-note{color:var(--brand-emphasis);font:600 13.5px/1.2 var(--sans)}.how-it-works .desktop-drop-hint,.how-it-works .mobile-drop-hint{font-size:12.5px}.how-it-works .run-head{width:min(100%, var(--col));flex:none;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:24px;min-height:22px;margin:2px auto 0;display:grid}.scanner-gunmetal.how-it-works .run-head .stepper{margin:0}.how-it-works .linkstrip{align-items:center;gap:8px;min-width:0;display:flex}.how-it-works .lk-sources{gap:4px;display:flex}.how-it-works .lk-source{box-sizing:border-box;border:1px solid var(--border-soft);background:var(--popover);border-radius:6px;place-items:center;width:22px;height:22px;display:grid}.how-it-works .lk-source .source-etch{width:13px;height:13px}.how-it-works .lk-pipe{background:linear-gradient(var(--line), var(--line)) center / 100% 1px no-repeat;flex:1;min-width:28px;max-width:88px;height:9px;position:relative;overflow:hidden}.how-it-works .lk-pipe i{background:radial-gradient(circle at calc(100% - 2px) 50%, var(--good) 2px, transparent 2.5px);opacity:0;animation:3.6s linear infinite hiw-flow;position:absolute;inset:0}.how-it-works .lk-pipe i:nth-child(2){animation-delay:1.2s}.how-it-works .lk-pipe i:nth-child(3){animation-delay:2.4s}@keyframes hiw-flow{0%{opacity:0;transform:translate(-100%)}6%,94%{opacity:1}to{opacity:0;transform:translate(0)}}.how-it-works .lk-mark{color:var(--foreground);font:700 12.5px/1 var(--sans);letter-spacing:-.01em}.how-it-works .livedot{background:var(--good);border-radius:50%;flex:none;width:6px;height:6px}.how-it-works .connect-body{flex-wrap:wrap;flex:1;justify-content:center;align-items:center;gap:48px;padding:8px;display:flex}.how-it-works .conn-list{width:270px}.how-it-works .conn-row{border-bottom:1px solid var(--line);justify-content:space-between;align-items:center;gap:18px;padding:12px 0;display:flex}.how-it-works .conn-name{color:var(--foreground);font:500 13.5px/1.2 var(--sans);align-items:center;gap:10px;display:flex}.how-it-works .conn-etch{place-items:center;width:16px;height:16px;display:inline-grid}.how-it-works .conn-name .source-etch{width:16px;height:16px}.how-it-works .conn-n{color:var(--ink-faint);font:12.5px/1 var(--sans);font-variant-numeric:tabular-nums;white-space:nowrap}.how-it-works .conn-hint{color:var(--ink-faint);font:12.5px/1.3 var(--sans);margin:12px 0 0}.how-it-works .run-body{width:min(100%, var(--col));flex:1;min-height:0;margin:24px auto 0}.how-it-works .pile-stage{grid-template-columns:minmax(0,1fr) 232px;align-items:start;gap:48px;display:grid}.how-it-works .pile-main{gap:20px;min-width:0;display:grid}.scanner-gunmetal.how-it-works .hero{text-align:center;justify-items:center;padding:0;display:grid}.how-it-works .hero-n{color:var(--foreground);font:400 52px/1 var(--serif);font-variant-numeric:tabular-nums;letter-spacing:-.01em;transition:color .4s}.how-it-works .hero-sub{color:var(--ink-faint);font:12.5px/1 var(--sans);margin-top:8px}.how-it-works .hero-label{height:16px;color:var(--ink-soft);font:500 12.5px/16px var(--sans);white-space:nowrap;margin-top:10px;display:block;position:relative}.how-it-works .hero-label>span{display:block}.how-it-works .hero.done .hero-n,.how-it-works .hero.done .hero-label{color:var(--good)}.scanner-gunmetal.how-it-works .run-pile{grid-template-columns:repeat(15,minmax(0,1fr));gap:8px;width:100%;min-height:0;margin:0;padding:0}.how-it-works .run-pile>.filter-file{position:relative}.how-it-works .run-pile.reading .file-flags i{animation:hiw-tab .32s cubic-bezier(.19, 1, .22, 1) var(--sweep) both}@keyframes hiw-tab{0%{opacity:0;transform:scaleX(.2)}}.how-it-works .run-pile.reading>.filter-file{animation:hiw-read .42s ease var(--sweep) both}@keyframes hiw-read{0%{filter:brightness(.94)}}.scanner-gunmetal.how-it-works .run-pile.gathered>.filter-file{filter:opacity(.25);transition:filter .7s}.how-it-works .run-pile>.filter-file[data-removed] .file-flags{display:none}.how-it-works .quality{padding-top:4px}.how-it-works .quality-head{border-bottom:1px solid var(--line);margin:0 0 6px;padding-bottom:10px}.how-it-works .quality-list{margin:0;padding:0;list-style:none;display:grid}.how-it-works .quality-row{--q:var(--ink-meter);grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:6px 12px;padding:7px 0 8px;display:grid}.how-it-works .quality-row[data-dim=dup]{--q:var(--metric-duplicate)}.how-it-works .quality-row[data-dim=sta]{--q:var(--flag-stale)}.how-it-works .quality-row[data-dim=sen]{--q:var(--q-sen)}.how-it-works .quality-name{color:var(--ink-soft);font:500 12.5px/1.25 var(--sans);transition:color .25s}.how-it-works .quality-row:is([data-dim=dup],[data-dim=sta],[data-dim=sen]) .quality-name:before{background:var(--q);content:\"\";vertical-align:2px;border-radius:2px;width:12px;height:4px;margin-right:8px;display:inline-block}.how-it-works .quality-pct{color:var(--foreground);font:500 13.5px/1 var(--sans);font-variant-numeric:tabular-nums;transition:color .25s}.how-it-works .quality-meter{background:var(--track);border-radius:2px;grid-column:1/-1;height:3px;overflow:hidden}.how-it-works .quality-meter span{background:var(--q);transform-origin:0;border-radius:2px;height:100%;display:block}.how-it-works .quality-row.active .quality-name{color:var(--foreground)}.how-it-works .quality-row.cleared .quality-name{color:var(--ink-faint)}.how-it-works .quality-row.cleared .quality-pct{color:var(--good)}.scanner-gunmetal.how-it-works .filter-result{border-radius:var(--panel-r);grid-template-columns:repeat(6,36px);gap:10px;padding:14px 16px;display:grid}.scanner-gunmetal.how-it-works .filter-result .filter-file{outline:none;width:36px}.how-it-works .verpick{z-index:3;border:1px solid var(--line);border-radius:var(--panel-r);background:color-mix(in srgb, var(--background) 90%, transparent);box-shadow:0 14px 34px var(--shadow-ambient);opacity:0;pointer-events:none;gap:6px;padding:16px 30px;display:flex;position:absolute;top:50%;left:50%;translate:-50% -50%}.scanner-gunmetal.how-it-works .verpick .vfile{flex:none;width:46px;position:relative}.how-it-works .vnew{--catch-color:var(--good);outline-offset:2px}.how-it-works .vtag{background:var(--sheet-stock);color:#756f63;font:600 9px/1 var(--sans);border-radius:3px;padding:2px 4px;position:absolute;bottom:4px;right:4px}.how-it-works .vnew .vtag{color:#4f6b43}.how-it-works .activate-stage{flex-direction:column;gap:20px;display:flex}.how-it-works .activate-stage .ai-query,.how-it-works .activate-stage .answer{margin:0;animation:none}.how-it-works .activate-stage .chat-composer{border-radius:var(--panel-r);flex:none}.how-it-works .activate-stage .query-label{color:color-mix(in srgb, var(--chalk) 60%, transparent)}.how-it-works .typed-query{min-height:2.9em;font:14px/1.45 var(--sans);margin-top:6px;display:block}.how-it-works .typed-line{min-height:1.45em;display:block}.how-it-works .caret{vertical-align:-2px;background:currentColor;width:2px;height:1.05em;margin-left:1px;animation:.75s step-end infinite hiw-caret;display:inline-block}@keyframes hiw-caret{50%{opacity:0}}.how-it-works .activate-context{gap:18px;min-width:0;display:grid}.how-it-works .context-strip{flex:none;align-items:center;gap:14px;display:flex}.how-it-works .kept-strip{gap:5px;display:flex}.scanner-gunmetal.how-it-works .kept-strip .filter-file{outline-offset:1.5px;outline:1.5px solid #0000;flex:none;width:18px;transition:translate .3s cubic-bezier(.19,1,.22,1),outline-color .3s;position:relative}.scanner-gunmetal.how-it-works .kept-strip .filter-file.cited{outline-color:var(--good);translate:0 -3px}.how-it-works .context-caption{color:var(--ink-faint);font:12.5px/1.3 var(--sans)}.how-it-works .activate-grid{flex:1;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);align-items:start;gap:32px;min-height:0;display:grid}.how-it-works .graph-svg{width:100%;height:auto;display:block;overflow:visible}.how-it-works .graph-svg .ge{fill:none;stroke:var(--graph-edge);stroke-width:.7px}.how-it-works .graph-svg .ge.dashed{opacity:.7;stroke-dasharray:3 4}.how-it-works .graph-svg .gn{fill:var(--graph-node)}.how-it-works .graph-svg .ge.on{opacity:1;stroke:var(--graph-path);stroke-width:1.4px}.how-it-works .graph-svg .gn.lit{fill:var(--foreground)}.how-it-works .graph-svg .ghalo{fill:var(--foreground);opacity:.08}.how-it-works .graph-svg .glabel{fill:var(--ink-soft);font-family:var(--sans);font-size:12.5px;font-weight:500}.how-it-works .graph-svg .xcap{fill:var(--ink-faint);font-family:var(--sans);letter-spacing:.08em;text-transform:uppercase;font-size:11px;font-weight:500}.how-it-works .graph-svg .mnode{opacity:0;animation:.6s 5.2s forwards hiw-grow}.how-it-works .graph-svg .gn.new{fill:var(--good)}.how-it-works .graph-svg .medge{stroke:color-mix(in srgb, var(--good) 60%, transparent);stroke-width:1.1px}@keyframes hiw-grow{to{opacity:1}}.how-it-works .activate-stage .answer{border-radius:var(--panel-r)}.how-it-works .activate-stage .answer p{font-size:13.5px;line-height:1.55}.how-it-works .activate-stage .verdict{margin-bottom:10px;font-size:13.5px}.how-it-works .activate-stage .verdict-mark{width:20px;height:20px;font-size:11px}.how-it-works .run-panel .retrieve-footer{flex:none;margin-top:auto}.how-it-works .livebar{color:var(--good);justify-self:end;align-items:center;gap:7px;display:inline-flex}@media (width<=640px){.scanner-gunmetal.how-it-works .scanner{height:680px}.scanner-gunmetal.how-it-works .rig:not(.has-source) .scanner{height:400px}.scanner-gunmetal.how-it-works .rig.is-connected:not(.has-source) .scanner{height:500px}.how-it-works .source-card:after{display:none}.how-it-works .source-badge{box-sizing:border-box;align-self:center;place-items:center;width:24px;height:24px;padding:0;font-size:0;display:grid}.how-it-works .source-badge:before{content:\"+\";font:500 15px/1 var(--sans)}.how-it-works .source-card.connected .source-badge:before{content:\"✓\";font-size:12px;font-weight:700}.how-it-works .selected-source-tab{text-overflow:ellipsis;overflow:hidden}.how-it-works .run-head{grid-template-columns:minmax(0,1fr)}.how-it-works .run-head>:not(.stepper){display:none}.how-it-works .connect-body{flex-direction:column;gap:22px}.how-it-works .conn-list{width:min(100%,290px)}.how-it-works .pile-stage{grid-template-columns:minmax(0,1fr);align-content:start;gap:18px;margin-top:16px}.how-it-works .pile-main{gap:16px}.how-it-works .hero-n{font-size:42px}.how-it-works .hero-label{font-size:12px}.scanner-gunmetal.how-it-works .run-pile{gap:5px 4px}.scanner-gunmetal.how-it-works .run-pile>.filter-file:nth-child(n+57){display:block}.how-it-works .quality-head{display:none}.how-it-works .quality-list{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px}.how-it-works .quality-row{padding:5px 0 6px}.how-it-works .quality-row[data-dim=con]{grid-column:1/-1}.how-it-works .quality-name{font-size:11.5px}.how-it-works .quality-pct{font-size:12.5px}.scanner-gunmetal.how-it-works .filter-result{grid-template-columns:repeat(6,28px);gap:8px;padding:12px}.scanner-gunmetal.how-it-works .filter-result .filter-file{width:28px}.how-it-works .activate-stage{gap:12px;margin-top:14px}.how-it-works .typed-query{margin-top:0;font-size:13px}.how-it-works .typed-line{display:inline}.how-it-works .typed-line:first-child:after{content:\" \"}.how-it-works .context-strip{flex-direction:column;align-items:flex-start;gap:8px}.how-it-works .kept-strip{gap:4px}.scanner-gunmetal.how-it-works .kept-strip .filter-file{width:16px}.how-it-works .context-caption{font-size:12px}.how-it-works .activate-grid{grid-template-columns:minmax(0,1fr);align-content:start;gap:12px}.how-it-works .graph-svg .glabel{font-size:15px}.how-it-works .activate-stage .answer{padding:12px 14px}.how-it-works .activate-stage .answer p{font-size:12.5px}}@media (prefers-reduced-motion:reduce){.how-it-works .run-pile.reading .file-flags i,.how-it-works .run-pile.reading>.filter-file,.how-it-works .socket.next,.how-it-works .caret{animation:none}.how-it-works .lk-pipe i{opacity:1;animation:none;transform:translate(-50%)}.how-it-works .lk-pipe i:not(:first-child){display:none}.how-it-works .graph-svg .mnode{opacity:1;animation:none}}", ie = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20fill='none'%20stroke='%23757575'%20stroke-width='1.4'%20stroke-linejoin='round'%3e%3crect%20x='5'%20y='6.4'%20width='22'%20height='3.8'%20rx='.7'/%3e%3cpath%20d='M7%2012.6h18l-1.8%2011.8a2%202%200%200%201-2%201.7H10.8a2%202%200%200%201-2-1.7z'/%3e%3ccircle%20cx='16'%20cy='18.2'%20r='2.2'%20fill='%23757575'%20stroke='none'/%3e%3c/svg%3e", D = /* @__PURE__ */ t(g(), 1), ae = {
	cf: {
		count: "68,000",
		dims: [
			37,
			42,
			24,
			58,
			61,
			38,
			22
		],
		counts: [
			"68,000",
			"42,000",
			"26,000",
			"15,000",
			"9,000"
		],
		systems: [
			"Confluence space",
			"S3 bucket",
			"SharePoint site"
		]
	},
	gcs: {
		count: "524,000",
		dims: [
			39,
			44,
			19,
			64,
			72,
			44,
			23
		],
		counts: [
			"524,000",
			"325,000",
			"199,000",
			"115,000",
			"73,000"
		],
		systems: [
			"GCS bucket",
			"S3 bucket",
			"SharePoint site"
		]
	},
	s3: {
		count: "412,000",
		dims: [
			35,
			40,
			31,
			60,
			65,
			40,
			20
		],
		counts: [
			"412,000",
			"255,000",
			"157,000",
			"91,000",
			"58,000"
		],
		systems: [
			"S3 bucket",
			"SharePoint site",
			"GCS bucket"
		]
	},
	sp: {
		count: "186,000",
		dims: [
			31,
			36,
			47,
			57,
			58,
			36,
			17
		],
		counts: [
			"186,000",
			"115,000",
			"71,000",
			"41,000",
			"26,000"
		],
		systems: [
			"SharePoint site",
			"S3 bucket",
			"GCS bucket"
		]
	},
	gcs_cf: {
		count: "592,000",
		dims: [
			39,
			44,
			20,
			63,
			71,
			43,
			23
		],
		counts: [
			"592,000",
			"367,000",
			"225,000",
			"130,000",
			"82,000"
		],
		systems: [
			"GCS bucket",
			"Confluence space",
			"S3 bucket"
		]
	},
	s3_cf: {
		count: "480,000",
		dims: [
			35,
			40,
			30,
			60,
			64,
			40,
			20
		],
		counts: [
			"480,000",
			"298,000",
			"182,000",
			"106,000",
			"67,000"
		],
		systems: [
			"S3 bucket",
			"Confluence space",
			"SharePoint site"
		]
	},
	s3_gcs: {
		count: "936,000",
		dims: [
			37,
			42,
			24,
			62,
			69,
			42,
			22
		],
		counts: [
			"936,000",
			"580,000",
			"356,000",
			"206,000",
			"131,000"
		],
		systems: [
			"S3 bucket",
			"GCS bucket",
			"SharePoint site"
		]
	},
	s3_sp: {
		count: "598,000",
		dims: [
			34,
			39,
			36,
			59,
			63,
			39,
			19
		],
		counts: [
			"598,000",
			"371,000",
			"227,000",
			"132,000",
			"84,000"
		],
		systems: [
			"S3 bucket",
			"SharePoint site",
			"GCS bucket"
		]
	},
	sp_cf: {
		count: "254,000",
		dims: [
			33,
			38,
			41,
			57,
			59,
			37,
			18
		],
		counts: [
			"254,000",
			"157,000",
			"97,000",
			"56,000",
			"35,000"
		],
		systems: [
			"SharePoint site",
			"Confluence space",
			"S3 bucket"
		]
	},
	sp_gcs: {
		count: "710,000",
		dims: [
			37,
			42,
			26,
			62,
			68,
			42,
			21
		],
		counts: [
			"710,000",
			"440,000",
			"270,000",
			"156,000",
			"99,000"
		],
		systems: [
			"SharePoint site",
			"GCS bucket",
			"S3 bucket"
		]
	}
}, oe = [
	[
		31.6,
		203.9,
		74.9,
		193.5,
		!1
	],
	[
		31.6,
		203.9,
		15.9,
		149.1,
		!1
	],
	[
		48.9,
		77.8,
		23.3,
		108.4,
		!1
	],
	[
		48.9,
		77.8,
		17,
		73.9,
		!1
	],
	[
		178.5,
		182.4,
		148,
		214.4,
		!1
	],
	[
		178.5,
		182.4,
		162.9,
		148.7,
		!1
	],
	[
		178.5,
		182.4,
		275.8,
		181.4,
		!0
	],
	[
		178.5,
		182.4,
		226.1,
		172.7,
		!0
	],
	[
		82.5,
		113,
		52.4,
		135.9,
		!1
	],
	[
		82.5,
		113,
		125.8,
		99.9,
		!1
	],
	[
		23.3,
		108.4,
		17,
		73.9,
		!1
	],
	[
		23.3,
		108.4,
		15.9,
		149.1,
		!1
	],
	[
		52.4,
		135.9,
		15.9,
		149.1,
		!1
	],
	[
		141.5,
		126.7,
		146.6,
		49.5,
		!1
	],
	[
		141.5,
		126.7,
		125.8,
		99.9,
		!1
	],
	[
		93,
		167.3,
		74.9,
		193.5,
		!1
	],
	[
		93,
		167.3,
		125.1,
		175.8,
		!1
	],
	[
		146.6,
		49.5,
		125.8,
		99.9,
		!1
	],
	[
		74.9,
		193.5,
		111.5,
		204.3,
		!1
	],
	[
		111.5,
		204.3,
		148,
		214.4,
		!1
	],
	[
		111.5,
		204.3,
		125.1,
		175.8,
		!1
	],
	[
		125.1,
		175.8,
		226.1,
		172.7,
		!0
	],
	[
		365,
		77.1,
		313.1,
		48.9,
		!1
	],
	[
		365,
		77.1,
		380,
		34.3,
		!1
	],
	[
		365,
		77.1,
		332.8,
		112.7,
		!1
	],
	[
		365,
		77.1,
		397.7,
		132.6,
		!1
	],
	[
		365,
		77.1,
		431.7,
		82.4,
		!0
	],
	[
		302.1,
		202.2,
		275.8,
		181.4,
		!1
	],
	[
		302.1,
		202.2,
		260.5,
		217,
		!1
	],
	[
		302.1,
		202.2,
		340.4,
		175,
		!1
	],
	[
		313.1,
		48.9,
		258.6,
		58.4,
		!1
	],
	[
		313.1,
		48.9,
		380,
		34.3,
		!1
	],
	[
		275.8,
		181.4,
		260.5,
		217,
		!1
	],
	[
		275.8,
		181.4,
		226.1,
		172.7,
		!1
	],
	[
		260.5,
		217,
		226.1,
		172.7,
		!1
	],
	[
		265.4,
		92.5,
		258.6,
		58.4,
		!1
	],
	[
		265.4,
		92.5,
		239.2,
		117,
		!1
	],
	[
		374.2,
		167.7,
		390.6,
		212.9,
		!1
	],
	[
		374.2,
		167.7,
		340.4,
		175,
		!1
	],
	[
		374.2,
		167.7,
		397.7,
		132.6,
		!1
	],
	[
		374.2,
		167.7,
		439.7,
		182.6,
		!0
	],
	[
		390.6,
		212.9,
		340.4,
		175,
		!1
	],
	[
		390.6,
		212.9,
		439.7,
		182.6,
		!0
	],
	[
		380,
		34.3,
		441,
		50.6,
		!0
	],
	[
		340.4,
		175,
		332.8,
		112.7,
		!1
	],
	[
		226.1,
		172.7,
		239.2,
		117,
		!1
	],
	[
		439.7,
		182.6,
		481.7,
		164.4,
		!1
	],
	[
		439.7,
		182.6,
		488.4,
		199,
		!1
	],
	[
		441,
		50.6,
		468.1,
		97.9,
		!1
	],
	[
		441,
		50.6,
		431.7,
		82.4,
		!1
	],
	[
		530.9,
		71.6,
		517,
		36.9,
		!1
	],
	[
		530.9,
		71.6,
		581.5,
		38.9,
		!1
	],
	[
		530.9,
		71.6,
		583.7,
		75.4,
		!1
	],
	[
		468.1,
		97.9,
		431.7,
		82.4,
		!1
	],
	[
		531.6,
		219.5,
		481.7,
		164.4,
		!1
	],
	[
		531.6,
		219.5,
		488.4,
		199,
		!1
	],
	[
		517,
		36.9,
		581.5,
		38.9,
		!1
	],
	[
		579.7,
		147.3,
		541.7,
		142,
		!1
	],
	[
		579.7,
		147.3,
		582.6,
		109.5,
		!1
	],
	[
		541.7,
		142,
		582.6,
		109.5,
		!1
	],
	[
		582.6,
		109.5,
		583.7,
		75.4,
		!1
	],
	[
		481.7,
		164.4,
		488.4,
		199,
		!1
	],
	[
		581.5,
		38.9,
		583.7,
		75.4,
		!1
	]
], se = [
	[
		31.6,
		203.9,
		0
	],
	[
		48.9,
		77.8,
		0
	],
	[
		178.5,
		182.4,
		0
	],
	[
		82.5,
		113,
		0
	],
	[
		23.3,
		108.4,
		0
	],
	[
		52.4,
		135.9,
		0
	],
	[
		93,
		167.3,
		0
	],
	[
		146.6,
		49.5,
		0
	],
	[
		74.9,
		193.5,
		0
	],
	[
		111.5,
		204.3,
		0
	],
	[
		148,
		214.4,
		0
	],
	[
		125.8,
		99.9,
		0
	],
	[
		17,
		73.9,
		0
	],
	[
		125.1,
		175.8,
		0
	],
	[
		15.9,
		149.1,
		0
	],
	[
		365,
		77.1,
		1
	],
	[
		302.1,
		202.2,
		1
	],
	[
		313.1,
		48.9,
		1
	],
	[
		275.8,
		181.4,
		1
	],
	[
		260.5,
		217,
		1
	],
	[
		265.4,
		92.5,
		1
	],
	[
		374.2,
		167.7,
		1
	],
	[
		390.6,
		212.9,
		1
	],
	[
		258.6,
		58.4,
		1
	],
	[
		380,
		34.3,
		1
	],
	[
		340.4,
		175,
		1
	],
	[
		239.2,
		117,
		1
	],
	[
		332.8,
		112.7,
		1
	],
	[
		397.7,
		132.6,
		1
	],
	[
		441,
		50.6,
		2
	],
	[
		530.9,
		71.6,
		2
	],
	[
		468.1,
		97.9,
		2
	],
	[
		531.6,
		219.5,
		2
	],
	[
		517,
		36.9,
		2
	],
	[
		579.7,
		147.3,
		2
	],
	[
		541.7,
		142,
		2
	],
	[
		582.6,
		109.5,
		2
	],
	[
		481.7,
		164.4,
		2
	],
	[
		581.5,
		38.9,
		2
	],
	[
		488.4,
		199,
		2
	],
	[
		431.7,
		82.4,
		2
	],
	[
		583.7,
		75.4,
		2
	]
], O = i(), k = [
	{
		id: "s3",
		name: "S3 bucket",
		count: "412,000",
		unit: "files",
		etch: h
	},
	{
		id: "sp",
		name: "SharePoint site",
		count: "186,000",
		unit: "files",
		etch: e
	},
	{
		id: "gcs",
		name: "GCS bucket",
		count: "524,000",
		unit: "files",
		etch: ie
	},
	{
		id: "cf",
		name: "Confluence space",
		count: "68,000",
		unit: "pages",
		etch: n
	}
], A = Object.fromEntries(k.map((e) => [e.id, e])), ce = k.map((e) => e.id), j = 2, M = (e) => [...e].sort((e, t) => ce.indexOf(e) - ce.indexOf(t)).join("_"), N = (e) => e.length === 1 ? A[e[0]].unit : "files", P = (e) => Number(e.replace(/,/g, "")), F = (e, t) => {
	let n = Math.sin(e * 12.9898 + t * 78.233) * 43758.5453;
	return n - Math.floor(n);
}, I = (e) => Math.floor(F(e, 3) * 4), L = 1.4, R = 15, le = (e) => Math.round(e % R / R * L * 820 + F(e, 7) * 120), z = [
	"Read",
	"Curate",
	"Activate"
], ue = {
	connect: -1,
	read: 0,
	curate: 1,
	activate: 2
}, B = {
	type: "spring",
	duration: .5,
	bounce: 0
}, V = [
	.19,
	1,
	.22,
	1
], H = [
	.645,
	.045,
	.355,
	1
], de = "dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup".split(" "), fe = {
	dup: "dup",
	old: "dup",
	sen: "sen",
	sta: "sta",
	keep: null
}, U = .9, pe = .6, me = .3, W = 3.95, he = {
	dup: 0,
	old: 0,
	sen: 1,
	sta: 2
}, ge = [
	"Resolving duplicates and old versions",
	"Screening for sensitive data",
	"Dropping irrelevant files",
	"Reconciling conflicting information",
	"Meets quality standards"
], G = de.map((e, t) => ({
	kind: e,
	at: e === "keep" ? W : he[e] * U + pe + F(t, 4) * me
})), K = G.flatMap((e, t) => e.kind === "keep" ? [t] : []), q = [
	"Master_Agreement_v4.pdf",
	"Renewal_Terms_2025.docx",
	"Enterprise_Tier_Pricing.xlsx",
	"Dec_2024_Cohort.csv",
	"Order_Form_Template.docx",
	"Security_Overview.pdf",
	"Support_Runbook.md",
	"Data_Retention_Policy.pdf",
	"Notice_Periods.xlsx",
	"Customer_Success_Playbook.pdf",
	"SLA_Schedule.pdf",
	"Billing_FAQ.md"
], J = K.slice(0, 3), Y = [
	"Master_Agreement",
	"Renewal_Terms",
	"Enterprise_Tier_Pricing",
	"Order_Form",
	"Security_Overview",
	"Support_Runbook",
	"Onboarding_Guide",
	"Vendor_Contract",
	"Roadmap",
	"Incident_Review"
], _e = [
	"payroll_export_2024.csv",
	"customer_emails.xlsx",
	"offer_letter_JSmith.pdf",
	"passport_scan.pdf",
	"vendor_bank_details.xlsx"
], X = {
	dup: "Duplicate",
	old: "Old version",
	sen: "Sensitive data",
	sta: "Stale",
	keep: "No issues found"
}, ve = (e, t) => {
	let { kind: n } = G[e], r = Y[e % Y.length];
	return {
		name: {
			dup: `${r} (copy ${2 + e % 3}).pdf`,
			old: `${r}_v${1 + e % 3}_OLD.docx`,
			sen: _e[e % _e.length],
			sta: `${r}_2019.pptx`,
			keep: q[K.indexOf(e) % q.length]
		}[n],
		reason: n === "keep" ? t ? "Meets quality standards" : X.keep : t ? `${X[n]} · removed` : X[n],
		tone: n
	};
}, ye = [
	{
		key: "dup",
		label: "Duplicates",
		clears: 0
	},
	{
		key: "sta",
		label: "Stale",
		clears: 2
	},
	{
		key: "sen",
		label: "Sensitive",
		clears: 1
	},
	{
		key: "off",
		label: "Off-topic",
		clears: 2
	},
	{
		key: "met",
		label: "Missing metadata",
		clears: 3
	},
	{
		key: "inc",
		label: "Incomplete",
		clears: 3
	},
	{
		key: "con",
		label: "Contains conflicting information",
		clears: 3
	}
];
function Z({ source: e }) {
	return /* @__PURE__ */ (0, O.jsx)("span", {
		className: "source-etch",
		style: { "--etch": `url(${e.etch})` },
		"aria-hidden": "true"
	});
}
function be() {
	return /* @__PURE__ */ (0, O.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.7",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, O.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ (0, O.jsx)("path", { d: "M14 2v6h6" })]
	});
}
function xe({ filled: e }) {
	return /* @__PURE__ */ (0, O.jsxs)(l.div, {
		className: "portwall",
		layoutId: "port",
		transition: B,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, O.jsx)("div", {
			className: "pw-sockets",
			children: [
				0,
				1,
				2,
				3
			].map((t) => /* @__PURE__ */ (0, O.jsxs)("span", {
				className: `socket ${t < e ? "filled" : ""} ${t === e && e < j ? "next" : ""}`,
				children: [/* @__PURE__ */ (0, O.jsx)("i", {}), /* @__PURE__ */ (0, O.jsx)("i", {})]
			}, t))
		}), /* @__PURE__ */ (0, O.jsxs)("div", {
			className: "pw-body",
			children: [/* @__PURE__ */ (0, O.jsxs)(l.span, {
				className: "pw-mark",
				layoutId: "deasy-mark",
				transition: B,
				children: ["deasy", /* @__PURE__ */ (0, O.jsx)("b", { children: "." })]
			}), /* @__PURE__ */ (0, O.jsxs)("span", {
				className: `pw-live ${e ? "on" : ""}`,
				children: [
					/* @__PURE__ */ (0, O.jsx)("em", {}),
					/* @__PURE__ */ (0, O.jsx)("em", {}),
					/* @__PURE__ */ (0, O.jsx)("em", {})
				]
			})]
		})]
	});
}
function Se({ source: e, connected: t, onToggle: n }) {
	return /* @__PURE__ */ (0, O.jsxs)("button", {
		className: `source-card ${t ? "connected" : ""}`,
		type: "button",
		draggable: !0,
		"aria-pressed": t,
		onClick: () => n(e.id),
		onDragStart: (t) => {
			t.dataTransfer.setData("text/plain", e.id), t.dataTransfer.effectAllowed = "link";
		},
		"aria-label": `${e.name}, ${e.count} ${e.unit}${t ? ", connected" : ""}`,
		children: [
			/* @__PURE__ */ (0, O.jsx)("span", {
				className: "source-icon",
				children: /* @__PURE__ */ (0, O.jsx)(Z, { source: e })
			}),
			/* @__PURE__ */ (0, O.jsxs)("span", {
				className: "source-copy",
				children: [/* @__PURE__ */ (0, O.jsx)("span", {
					className: "source-name",
					children: e.name
				}), /* @__PURE__ */ (0, O.jsxs)("span", {
					className: "source-meta",
					children: [
						e.count,
						" ",
						e.unit
					]
				})]
			}),
			/* @__PURE__ */ (0, O.jsx)("span", {
				className: "source-badge",
				"aria-hidden": "true",
				children: t ? "Connected" : "+ Add"
			})
		]
	});
}
function Ce({ phase: e }) {
	return /* @__PURE__ */ (0, O.jsx)("div", {
		className: "stepper",
		"aria-label": e < 0 ? "Three steps: Read, Curate, Activate" : `Step ${e + 1} of 3: ${z[e]}`,
		children: z.map((t, n) => /* @__PURE__ */ (0, O.jsxs)("div", {
			className: "step-fragment",
			children: [/* @__PURE__ */ (0, O.jsxs)("div", {
				"aria-current": n === e ? "step" : void 0,
				className: `step ${n === e ? "active" : ""} ${n < e ? "done" : ""}`,
				children: [/* @__PURE__ */ (0, O.jsx)("span", {
					className: "step-dot",
					children: n < e ? "✓" : n + 1
				}), /* @__PURE__ */ (0, O.jsx)("span", {
					className: "step-name",
					children: t
				})]
			}), n < z.length - 1 ? /* @__PURE__ */ (0, O.jsx)("span", {
				"aria-hidden": "true",
				className: `step-line ${n < e ? "done" : ""}`
			}) : null]
		}, t))
	});
}
function we({ ids: e, phase: t }) {
	return /* @__PURE__ */ (0, O.jsxs)("div", {
		className: "run-head",
		children: [
			t >= 0 ? /* @__PURE__ */ (0, O.jsxs)("div", {
				className: "linkstrip",
				"aria-label": `${e.map((e) => A[e].name).join(" and ")} connected to Deasy, live`,
				children: [
					/* @__PURE__ */ (0, O.jsx)("span", {
						className: "lk-sources",
						"aria-hidden": "true",
						children: e.map((e) => /* @__PURE__ */ (0, O.jsx)(l.span, {
							className: "lk-source",
							layoutId: `src-${e}`,
							transition: B,
							children: /* @__PURE__ */ (0, O.jsx)(Z, { source: A[e] })
						}, e))
					}),
					/* @__PURE__ */ (0, O.jsx)("span", {
						className: "lk-pipe",
						"aria-hidden": "true",
						children: [
							0,
							1,
							2
						].map((e) => /* @__PURE__ */ (0, O.jsx)("i", {}, e))
					}),
					/* @__PURE__ */ (0, O.jsxs)(l.span, {
						className: "lk-mark",
						layoutId: "deasy-mark",
						transition: B,
						"aria-hidden": "true",
						children: ["deasy", /* @__PURE__ */ (0, O.jsx)("b", { children: "." })]
					})
				]
			}) : /* @__PURE__ */ (0, O.jsx)("span", {}),
			/* @__PURE__ */ (0, O.jsx)(Ce, { phase: t }),
			t >= 0 ? /* @__PURE__ */ (0, O.jsxs)("span", {
				className: "eyebrow livebar",
				children: [/* @__PURE__ */ (0, O.jsx)("span", {
					className: "livedot",
					"aria-hidden": "true"
				}), "Live"]
			}) : /* @__PURE__ */ (0, O.jsx)("span", {})
		]
	});
}
function Te({ className: e, describe: t, children: n }) {
	let [r, i] = (0, D.useState)(null), a = b(0), o = b(0), s = (e) => {
		let t = e.currentTarget.getBoundingClientRect(), n = e.clientX - t.left;
		a.set(n), o.set(e.clientY - t.top);
		let s = e.target.closest("[data-id]")?.dataset.id, c = n < t.width * .25 ? "start" : n > t.width * .75 ? "end" : "center";
		s !== void 0 && (Number(s) !== r?.id || c !== r.align) && i({
			id: Number(s),
			align: c
		});
	}, c = r ? t(r.id) : null;
	return /* @__PURE__ */ (0, O.jsxs)("div", {
		className: `${e} file-pile`,
		onPointerMove: s,
		onPointerLeave: () => i(null),
		children: [n, /* @__PURE__ */ (0, O.jsx)(p, { children: c && r ? /* @__PURE__ */ (0, O.jsxs)(l.div, {
			className: "file-tip",
			"aria-hidden": "true",
			"data-align": r.align,
			style: {
				x: a,
				y: o
			},
			initial: { opacity: 0 },
			animate: {
				opacity: 1,
				transition: { duration: .12 }
			},
			exit: {
				opacity: 0,
				transition: { duration: .08 }
			},
			children: [/* @__PURE__ */ (0, O.jsx)("span", {
				className: "file-tip-name",
				children: c.name
			}), /* @__PURE__ */ (0, O.jsx)("span", {
				className: "file-tip-reason",
				"data-tone": c.tone,
				children: c.reason
			})]
		}) : null })]
	});
}
function Ee({ ids: e, onRead: t }) {
	return /* @__PURE__ */ (0, O.jsxs)("div", {
		className: "report-panel connect-panel",
		children: [
			/* @__PURE__ */ (0, O.jsx)(we, {
				ids: e,
				phase: -1
			}),
			/* @__PURE__ */ (0, O.jsxs)("div", {
				className: "connect-body",
				children: [/* @__PURE__ */ (0, O.jsx)(xe, { filled: e.length }), /* @__PURE__ */ (0, O.jsxs)("div", {
					className: "conn-list",
					children: [/* @__PURE__ */ (0, O.jsx)(p, {
						initial: !1,
						children: e.map((e) => /* @__PURE__ */ (0, O.jsxs)(l.div, {
							className: "conn-row",
							layout: !0,
							initial: {
								opacity: 0,
								x: -8
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: -8
							},
							transition: B,
							children: [/* @__PURE__ */ (0, O.jsxs)("span", {
								className: "conn-name",
								children: [/* @__PURE__ */ (0, O.jsx)(l.span, {
									className: "conn-etch",
									layoutId: `src-${e}`,
									transition: B,
									children: /* @__PURE__ */ (0, O.jsx)(Z, { source: A[e] })
								}), A[e].name]
							}), /* @__PURE__ */ (0, O.jsxs)("span", {
								className: "conn-n",
								children: [
									A[e].count,
									" ",
									A[e].unit
								]
							})]
						}, e))
					}), /* @__PURE__ */ (0, O.jsx)(l.p, {
						className: "conn-hint",
						layout: !0,
						transition: B,
						children: e.length < j ? "Add another source with +" : "Two sources connected"
					})]
				})]
			}),
			/* @__PURE__ */ (0, O.jsx)("div", {
				className: "report-footer actions-only",
				children: /* @__PURE__ */ (0, O.jsx)("div", {
					className: "footer-actions",
					children: /* @__PURE__ */ (0, O.jsx)("button", {
						className: "button button-primary with-arrow",
						type: "button",
						onClick: t,
						children: "Read it"
					})
				})
			})
		]
	});
}
function De({ ids: e, combo: t, phase: n }) {
	let r = s(), i = n === "curate", a = N(e), [o, c] = ee(), [u, f] = (0, D.useState)(-1), [m, h] = (0, D.useState)(!1), g = u >= 4, [_, v] = (0, D.useState)(!i && !r), y = b(_ ? 0 : P(t.count));
	(0, D.useEffect)(() => {
		if (!_) return;
		let e = d(y, P(t.count), {
			duration: L,
			ease: H
		}), n = window.setTimeout(() => v(!1), L * 1e3);
		return () => {
			e.stop(), window.clearTimeout(n);
		};
	}, [
		_,
		t,
		y
	]);
	let x = T(y, (e) => (Math.round(e / 1e3) * 1e3).toLocaleString("en-US"));
	(0, D.useEffect)(() => {
		if (u < 0) return;
		let e = P(t.counts[Math.min(u + 1, 4)]);
		if (r) {
			y.set(e);
			return;
		}
		let n = d(y, e, {
			duration: U * .75,
			ease: H
		});
		return () => n.stop();
	}, [
		u,
		t,
		y,
		r
	]), (0, D.useEffect)(() => {
		if (!i) return;
		if (r) {
			f(4), h(!0);
			return;
		}
		let e = !0, t = [
			0,
			1,
			2,
			3,
			4
		].map((e) => window.setTimeout(() => f(e), e * U * 1e3)), n = [], a = (e) => (n.push(e), e), s = (e) => Array.from(o.current.querySelectorAll(e)), l = (e) => o.current.querySelector(e), u = async (t) => {
			await a(c(t, {
				scale: [
					1,
					1.04,
					.9
				],
				opacity: [
					1,
					1,
					0
				],
				"--catch": [
					0,
					1,
					0
				]
			}, {
				duration: .55,
				delay: Number(t.dataset.at),
				times: [
					0,
					.35,
					1
				],
				ease: V
			})), e && (t.dataset.removed = "", await a(c(t, { opacity: .5 }, {
				duration: .2,
				ease: "easeOut"
			})));
		}, d = [
			a(c(l(".verpick"), { opacity: [
				0,
				1,
				1,
				0
			] }, {
				duration: 1.5,
				delay: 2.35,
				times: [
					0,
					.15,
					.8,
					1
				],
				ease: V
			})),
			a(c(l(".vold"), {
				x: [
					-22,
					0,
					0,
					-10
				],
				opacity: [
					1,
					1,
					1,
					0
				],
				scale: [
					1,
					1,
					1,
					.92
				]
			}, {
				duration: 1.05,
				delay: 2.45,
				times: [
					0,
					.3,
					.6,
					1
				],
				ease: H
			})),
			a(c(l(".vnew"), { x: [
				22,
				0,
				0,
				-18
			] }, {
				duration: 1.05,
				delay: 2.45,
				times: [
					0,
					.3,
					.6,
					1
				],
				ease: H
			})),
			a(c(l(".vnew"), { "--catch": [0, 1] }, {
				duration: .25,
				delay: 3.25,
				ease: V
			})),
			...s(".run-pile > [data-kind=\"keep\"]").map((e) => a(c(e, {
				scale: [
					1,
					1.05,
					1
				],
				"--catch": [
					0,
					1,
					1
				]
			}, {
				duration: .5,
				delay: W,
				ease: V
			}))),
			...s(".run-pile > [data-kind]:not([data-kind=\"keep\"])").map(u)
		];
		return Promise.all(d).then(() => {
			e && h(!0);
		}), () => {
			e = !1, t.forEach(window.clearTimeout), n.forEach((e) => e.stop());
		};
	}, [
		i,
		r,
		c,
		o
	]);
	let S = i ? `of ${t.count} ${a}` : `${a} read`, C = i ? ge[Math.max(u, 0)] : _ ? "Reading every file" : "Checked against seven quality standards";
	return /* @__PURE__ */ (0, O.jsxs)("div", {
		className: "run-body pile-stage",
		ref: o,
		children: [/* @__PURE__ */ (0, O.jsxs)("div", {
			className: "pile-main",
			children: [/* @__PURE__ */ (0, O.jsxs)("div", {
				className: `hero ${g ? "done" : ""}`,
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ (0, O.jsx)(l.span, {
						className: "hero-n",
						"aria-label": g ? `${t.counts[4]} of ${t.count} ${a} meet quality standards` : void 0,
						children: x
					}),
					/* @__PURE__ */ (0, O.jsx)("span", {
						className: "hero-sub",
						children: S
					}),
					/* @__PURE__ */ (0, O.jsx)("span", {
						className: "hero-label",
						children: /* @__PURE__ */ (0, O.jsx)(p, {
							mode: "popLayout",
							initial: !1,
							children: /* @__PURE__ */ (0, O.jsx)(l.span, {
								initial: {
									opacity: 0,
									y: 4
								},
								animate: {
									opacity: 1,
									y: 0
								},
								exit: {
									opacity: 0,
									y: -4
								},
								transition: {
									duration: .22,
									ease: V
								},
								children: C
							}, C)
						})
					})
				]
			}), /* @__PURE__ */ (0, O.jsxs)(Te, {
				className: `document-swarm filter-swarm run-pile ${m ? "gathered" : ""} ${_ ? "reading" : ""}`,
				describe: (e) => ve(e, i),
				children: [G.map(({ kind: e, at: t }, n) => {
					let r = fe[e];
					return e === "keep" ? m ? /* @__PURE__ */ (0, O.jsx)("span", { className: "filter-file vacated" }, n) : /* @__PURE__ */ (0, O.jsx)(l.span, {
						className: `filter-file ${i ? "keep" : ""}`,
						layoutId: `doc-${n}`,
						transition: B,
						"data-kind": e,
						"data-paper": I(n),
						"data-id": n
					}, n) : /* @__PURE__ */ (0, O.jsx)("span", {
						className: `filter-file ${e}`,
						"data-kind": e,
						"data-at": t,
						"data-paper": I(n),
						"data-id": n,
						style: { "--sweep": `${le(n)}ms` },
						children: r ? /* @__PURE__ */ (0, O.jsx)("span", {
							className: "file-flags",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, O.jsx)("i", { "data-flag": r })
						}) : null
					}, n);
				}), m ? /* @__PURE__ */ (0, O.jsx)("div", {
					className: "filter-result",
					children: K.map((e) => /* @__PURE__ */ (0, O.jsx)(l.span, {
						className: "filter-file keep",
						layoutId: `doc-${e}`,
						transition: B,
						"data-paper": I(e),
						"data-id": e
					}, e))
				}, "result") : /* @__PURE__ */ (0, O.jsxs)("div", {
					className: "verpick",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, O.jsx)("span", {
						className: "filter-file vfile vold",
						"data-paper": 1,
						children: /* @__PURE__ */ (0, O.jsx)("span", {
							className: "vtag",
							children: "v3"
						})
					}), /* @__PURE__ */ (0, O.jsx)("span", {
						className: "filter-file vfile vnew",
						"data-paper": 0,
						children: /* @__PURE__ */ (0, O.jsx)("span", {
							className: "vtag",
							children: "v4"
						})
					})]
				}, "verpick")]
			})]
		}), /* @__PURE__ */ (0, O.jsxs)("div", {
			className: "quality",
			children: [/* @__PURE__ */ (0, O.jsx)("p", {
				className: "eyebrow quality-head",
				children: "Quality check"
			}), /* @__PURE__ */ (0, O.jsx)("ul", {
				className: "quality-list",
				children: ye.map((e, n) => {
					let r = i && u > e.clears, a = i && u === e.clears;
					return /* @__PURE__ */ (0, O.jsxs)("li", {
						className: `quality-row ${r ? "cleared" : ""} ${a ? "active" : ""}`,
						"data-dim": e.key,
						children: [
							/* @__PURE__ */ (0, O.jsx)("span", {
								className: "quality-name",
								children: e.label
							}),
							/* @__PURE__ */ (0, O.jsx)("strong", {
								className: "quality-pct",
								children: r ? "0%" : `${t.dims[n]}%`
							}),
							/* @__PURE__ */ (0, O.jsx)("span", {
								className: "quality-meter",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, O.jsx)(l.span, {
									initial: { scaleX: 0 },
									animate: { scaleX: r ? 0 : t.dims[n] / 100 },
									transition: r ? {
										duration: .5,
										ease: H
									} : {
										duration: .7,
										delay: (_ ? L * .55 : .2) + n * .05,
										ease: V
									}
								})
							})
						]
					}, e.key);
				})
			})]
		})]
	});
}
var Q = ["What are the renewal terms for enterprise customers", "whose subscriptions started in December 2024?"], Oe = [[.25, .78], [1.05, .7]], ke = 4;
function Ae() {
	let e = s(), [t, n] = (0, D.useState)([0, 0]);
	return (0, D.useEffect)(() => {
		if (e) return;
		let t = performance.now(), r = requestAnimationFrame(function e(i) {
			let a = (i - t) / 1e3, o = Oe.map(([e, t], n) => Math.round(Math.min(1, Math.max(0, (a - e) / t)) * Q[n].length));
			n((e) => e[0] === o[0] && e[1] === o[1] ? e : o), o[1] < Q[1].length && (r = requestAnimationFrame(e));
		});
		return () => cancelAnimationFrame(r);
	}, [e]), e ? [Q[0].length, Q[1].length] : t;
}
var $ = [
	{
		x: 141.5,
		y: 126.7,
		label: "Master agreement v4",
		at: 2.7,
		lx: 131,
		ly: 119,
		anchor: "end",
		narrow: {
			lx: 132,
			ly: 111,
			anchor: "start"
		}
	},
	{
		x: 162.9,
		y: 148.7,
		label: "Renewal terms",
		at: 3,
		lx: 174,
		ly: 146,
		anchor: "start"
	},
	{
		x: 226.1,
		y: 172.7,
		label: "Dec 2024 cohort",
		at: 3.3,
		lx: 226.1,
		ly: 194,
		anchor: "middle"
	},
	{
		x: 439.7,
		y: 182.6,
		label: "Enterprise tier",
		at: 3.6,
		lx: 439.7,
		ly: 167,
		anchor: "middle"
	}
], je = [
	0,
	1,
	2
].map((e) => ({
	from: $[e],
	to: $[e + 1],
	at: 2.75 + e * .3
})), Me = (e) => e.length === 1 ? [{
	name: e[0],
	x: 310
}] : [{
	name: e[0],
	x: 106
}, {
	name: e[1],
	x: 416
}];
function Ne() {
	let e = "(max-width: 640px)", [t, n] = (0, D.useState)(() => typeof window < "u" && window.matchMedia(e).matches);
	return (0, D.useEffect)(() => {
		let t = window.matchMedia(e), r = () => n(t.matches);
		return t.addEventListener("change", r), () => t.removeEventListener("change", r);
	}, []), t;
}
function Pe({ systems: e }) {
	let t = s(), n = Ne(), r = (e) => t ? { initial: !1 } : { transition: {
		delay: e,
		duration: .45,
		ease: V
	} };
	return /* @__PURE__ */ (0, O.jsxs)("svg", {
		className: "graph-svg",
		viewBox: n ? "70 96 440 132" : "0 0 620 244",
		role: "img",
		"aria-label": `Entity graph across ${e.join(", ")}, with the answer's path lit`,
		children: [
			/* @__PURE__ */ (0, O.jsxs)("g", {
				className: "gfield",
				children: [oe.map(([e, t, n, r, i], a) => /* @__PURE__ */ (0, O.jsx)("line", {
					className: `ge ${i ? "dashed" : ""}`,
					x1: e,
					y1: t,
					x2: n,
					y2: r
				}, a)), se.map(([e, t, n], r) => /* @__PURE__ */ (0, O.jsx)("circle", {
					className: "gn",
					"data-col": n,
					cx: e,
					cy: t,
					r: 2.6
				}, r))]
			}),
			n ? null : Me(e).map(({ name: e, x: t }) => /* @__PURE__ */ (0, O.jsx)("text", {
				className: "xcap",
				x: t,
				y: 18,
				textAnchor: "middle",
				children: e
			}, e)),
			je.map(({ from: e, to: t, at: n }) => /* @__PURE__ */ (0, D.createElement)(l.line, {
				className: "ge on",
				x1: e.x,
				y1: e.y,
				x2: t.x,
				y2: t.y,
				initial: {
					pathLength: 0,
					opacity: 0
				},
				animate: {
					pathLength: 1,
					opacity: 1
				},
				...r(n),
				key: n
			})),
			$.map(({ narrow: e, ...t }) => ({
				...t,
				...n ? e : void 0
			})).map((e) => /* @__PURE__ */ (0, D.createElement)(l.g, {
				className: "gnode",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				...r(e.at),
				key: e.label
			}, /* @__PURE__ */ (0, O.jsx)("circle", {
				className: "ghalo",
				cx: e.x,
				cy: e.y,
				r: 10
			}), /* @__PURE__ */ (0, O.jsx)("circle", {
				className: "gn lit",
				cx: e.x,
				cy: e.y,
				r: 4
			}), /* @__PURE__ */ (0, O.jsx)("text", {
				className: "glabel",
				x: e.lx,
				y: e.ly,
				textAnchor: e.anchor,
				children: e.label
			}))),
			/* @__PURE__ */ (0, O.jsxs)("g", {
				className: "mnode",
				children: [/* @__PURE__ */ (0, O.jsx)("line", {
					className: "medge",
					x1: 439.7,
					y1: 182.6,
					x2: 479.7,
					y2: 216.6
				}), /* @__PURE__ */ (0, O.jsx)("circle", {
					className: "gn new",
					cx: 479.7,
					cy: 216.6,
					r: 3.4
				})]
			})
		]
	});
}
function Fe({ ids: e, combo: t }) {
	let n = e.map((e) => A[e].name), r = Ae(), i = s(), [a, o] = (0, D.useState)(!!i);
	(0, D.useEffect)(() => {
		if (i) return;
		let e = window.setTimeout(() => o(!0), ke * 1e3);
		return () => window.clearTimeout(e);
	}, [i]);
	let c = (e) => i ? { initial: !1 } : {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: e,
			duration: .5,
			ease: V
		}
	}, u = r[1] < Q[1].length;
	return /* @__PURE__ */ (0, O.jsxs)("div", {
		className: "run-body activate-stage",
		children: [/* @__PURE__ */ (0, O.jsxs)(l.div, {
			className: "ai-query chat-composer",
			...c(0),
			children: [
				/* @__PURE__ */ (0, O.jsx)("span", {
					className: "query-icon",
					children: /* @__PURE__ */ (0, O.jsx)("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.7",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, O.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
					})
				}),
				/* @__PURE__ */ (0, O.jsxs)("span", {
					className: "chat-composer-text",
					children: [/* @__PURE__ */ (0, O.jsx)("span", {
						className: "eyebrow query-label",
						children: "You ask your agent"
					}), /* @__PURE__ */ (0, O.jsx)("span", {
						className: "typed-query",
						"aria-label": Q.join(" "),
						children: Q.map((e, t) => /* @__PURE__ */ (0, O.jsxs)("span", {
							className: "typed-line",
							"aria-hidden": "true",
							children: [e.slice(0, r[t]), u && (t === 1 ? r[0] === Q[0].length : r[0] < Q[0].length) ? /* @__PURE__ */ (0, O.jsx)("span", { className: "caret" }) : null]
						}, t))
					})]
				}),
				/* @__PURE__ */ (0, O.jsx)("span", {
					className: "chat-composer-connectors",
					children: /* @__PURE__ */ (0, O.jsxs)("span", {
						className: "connector connector-deasy",
						children: [/* @__PURE__ */ (0, O.jsx)("span", {
							className: "connector-mark",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, O.jsx)("span", {
							className: "connector-name",
							children: "Deasy"
						})]
					})
				})
			]
		}), /* @__PURE__ */ (0, O.jsxs)("div", {
			className: "activate-grid",
			children: [/* @__PURE__ */ (0, O.jsxs)("div", {
				className: "activate-context",
				children: [/* @__PURE__ */ (0, O.jsxs)("div", {
					className: "context-strip",
					children: [/* @__PURE__ */ (0, O.jsx)("span", {
						className: "kept-strip",
						children: K.map((e) => /* @__PURE__ */ (0, O.jsx)(l.span, {
							className: `filter-file keep ${a && J.includes(e) ? "cited" : ""}`,
							layoutId: `doc-${e}`,
							transition: B,
							"data-paper": I(e)
						}, e))
					}), /* @__PURE__ */ (0, O.jsxs)("span", {
						className: "context-caption",
						children: [
							t.counts[4],
							" curated ",
							N(e),
							", connected to your agent"
						]
					})]
				}), /* @__PURE__ */ (0, O.jsx)(l.div, {
					className: "graph-wrap",
					...c(1.8),
					children: /* @__PURE__ */ (0, O.jsx)(Pe, { systems: n })
				})]
			}), /* @__PURE__ */ (0, O.jsxs)(l.div, {
				className: "answer good-answer",
				...c(ke),
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ (0, O.jsxs)("div", {
						className: "verdict",
						children: [/* @__PURE__ */ (0, O.jsx)("span", {
							className: "verdict-mark",
							children: "✓"
						}), /* @__PURE__ */ (0, O.jsx)("span", { children: n.length > 1 ? `Answered across ${n.length} systems` : `Answered from your ${n[0]}` })]
					}),
					/* @__PURE__ */ (0, O.jsxs)("p", { children: [
						"Those accounts renew on a ",
						/* @__PURE__ */ (0, O.jsx)("strong", { children: "12-month term with 60 days’ notice" }),
						", under v4 of the master agreement. Subscriptions that started before November 2024 stay on the legacy 30-day notice."
					] }),
					/* @__PURE__ */ (0, O.jsxs)("div", {
						className: "citation",
						children: [
							/* @__PURE__ */ (0, O.jsx)(be, {}),
							" ",
							J.length,
							" files · ",
							n.join(" + ")
						]
					})
				]
			})]
		})]
	});
}
function Ie({ ids: e, combo: t, phase: n, epoch: r, onBack: i, onNext: a }) {
	return /* @__PURE__ */ (0, O.jsxs)("div", {
		className: "report-panel run-panel",
		"data-phase": n,
		children: [
			/* @__PURE__ */ (0, O.jsx)(we, {
				ids: e,
				phase: ue[n]
			}),
			n === "activate" ? /* @__PURE__ */ (0, O.jsx)(Fe, {
				ids: e,
				combo: t
			}) : /* @__PURE__ */ (0, O.jsx)(De, {
				ids: e,
				combo: t,
				phase: n
			}, r),
			n === "activate" ? /* @__PURE__ */ (0, O.jsxs)("div", {
				className: "retrieve-footer",
				children: [/* @__PURE__ */ (0, O.jsx)("button", {
					className: "button button-ghost",
					type: "button",
					onClick: i,
					children: "Back"
				}), /* @__PURE__ */ (0, O.jsxs)("a", {
					className: "button button-primary with-arrow",
					href: "https://www.deasylabs.com/demo",
					children: [/* @__PURE__ */ (0, O.jsx)("span", {
						className: "desktop-button-label",
						children: "See it on your data"
					}), /* @__PURE__ */ (0, O.jsx)("span", {
						className: "mobile-button-label",
						children: "See demo"
					})]
				})]
			}) : /* @__PURE__ */ (0, O.jsx)("div", {
				className: "report-footer actions-only",
				children: /* @__PURE__ */ (0, O.jsxs)("div", {
					className: "footer-actions",
					children: [/* @__PURE__ */ (0, O.jsx)("button", {
						className: "button button-ghost",
						type: "button",
						onClick: i,
						children: "Back"
					}), /* @__PURE__ */ (0, O.jsx)("button", {
						className: "button button-primary with-arrow",
						type: "button",
						onClick: a,
						children: n === "read" ? "Curate it" : "Ask your agent"
					})]
				})
			})
		]
	});
}
function Le() {
	let [e, t] = (0, D.useState)([]), [n, r] = (0, D.useState)("connect"), [i, a] = (0, D.useState)(0), [o, s] = (0, D.useState)(!1), c = (0, D.useRef)(null), l = (0, D.useRef)(null), u = e.length ? ae[M(e)] : void 0, d = n !== "connect" && u, f = (0, D.useCallback)((e) => {
		r("connect"), t((t) => t.includes(e) ? t.filter((t) => t !== e) : t.length < j ? [...t, e] : [t[0], e]);
	}, []), p = (t) => {
		t.preventDefault(), s(!1);
		let n = t.dataTransfer.getData("text/plain");
		Object.hasOwn(A, n) && !e.includes(n) && f(n);
	}, m = () => {
		r("connect"), requestAnimationFrame(() => l.current?.querySelector("button")?.focus());
	}, h = (e) => {
		e === "read" && a((e) => e + 1), r(e), requestAnimationFrame(() => c.current?.focus({ preventScroll: !0 }));
	}, g = () => n === "read" ? m() : h(n === "activate" ? "curate" : "read"), _ = () => h(n === "read" ? "curate" : "activate"), v = e.map((e) => A[e].name).join(" + ");
	return /* @__PURE__ */ (0, O.jsx)(S, {
		reducedMotion: "user",
		children: /* @__PURE__ */ (0, O.jsxs)("section", {
			className: "wrap scan-section",
			id: "how-it-works",
			children: [/* @__PURE__ */ (0, O.jsx)("div", {
				className: "scanner-toolbar",
				children: d ? /* @__PURE__ */ (0, O.jsxs)(O.Fragment, { children: [/* @__PURE__ */ (0, O.jsxs)("div", {
					className: "blade-tab selected-source-tab",
					children: [
						/* @__PURE__ */ (0, O.jsx)("span", { className: "tab-dot" }),
						v,
						/* @__PURE__ */ (0, O.jsxs)("span", {
							className: "selected-source-count",
							children: [
								"· ",
								u.count,
								" ",
								N(e)
							]
						})
					]
				}), /* @__PURE__ */ (0, O.jsxs)("button", {
					className: "source-switch",
					type: "button",
					onClick: m,
					children: [/* @__PURE__ */ (0, O.jsx)("svg", {
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, O.jsx)("path", { d: "M2.5 5.5h9l-2.5-2.5M13.5 10.5h-9l2.5 2.5" })
					}), "Change source"]
				})] }) : /* @__PURE__ */ (0, O.jsxs)("div", {
					className: "blade-tab",
					children: [/* @__PURE__ */ (0, O.jsx)("span", { className: "tab-dot" }), "Connect one or two sources"]
				})
			}), /* @__PURE__ */ (0, O.jsx)("div", {
				className: `rig ${d ? "has-source" : ""} ${e.length ? "is-connected" : ""}`,
				children: /* @__PURE__ */ (0, O.jsxs)("div", {
					className: "stage",
					children: [d ? null : /* @__PURE__ */ (0, O.jsxs)("div", {
						className: "source-column",
						children: [/* @__PURE__ */ (0, O.jsx)("div", {
							className: "eyebrow column-label",
							children: "Your data sources"
						}), /* @__PURE__ */ (0, O.jsx)("div", {
							className: "sources",
							ref: l,
							children: k.map((t) => /* @__PURE__ */ (0, O.jsx)(Se, {
								source: t,
								connected: e.includes(t.id),
								onToggle: f
							}, t.id))
						})]
					}), /* @__PURE__ */ (0, O.jsx)("div", {
						className: `scanner ${o ? "hot" : ""}`,
						ref: c,
						tabIndex: -1,
						onDragOver: (e) => {
							e.preventDefault(), s(!0);
						},
						onDragLeave: () => s(!1),
						onDrop: p,
						children: u ? /* @__PURE__ */ (0, O.jsx)("div", {
							className: "selected-report",
							children: d ? /* @__PURE__ */ (0, O.jsx)(Ie, {
								ids: e,
								combo: u,
								phase: n,
								epoch: i,
								onBack: g,
								onNext: _
							}) : /* @__PURE__ */ (0, O.jsx)(Ee, {
								ids: e,
								onRead: () => h("read")
							})
						}, d ? `run-${M(e)}` : "connect") : /* @__PURE__ */ (0, O.jsxs)("div", {
							className: "drop-empty",
							children: [/* @__PURE__ */ (0, O.jsx)(xe, { filled: 0 }), /* @__PURE__ */ (0, O.jsxs)("p", { children: [
								/* @__PURE__ */ (0, O.jsx)("span", {
									className: "tap-note",
									children: "Plug in a source"
								}),
								/* @__PURE__ */ (0, O.jsx)("span", {
									className: "desktop-drop-hint",
									children: "Drag one here, or click to connect"
								}),
								/* @__PURE__ */ (0, O.jsx)("span", {
									className: "mobile-drop-hint",
									children: "Tap a source to connect it"
								})
							] })]
						})
					})]
				})
			})]
		})
	});
}
//#endregion
//#region embeds/src/how-it-works.tsx
var Re = "\n.variant-shell { font-family: var(--sans); font-size: var(--body-size); line-height: var(--body-line-height); -webkit-font-smoothing: antialiased; }\n.variant-shell[data-color-mode='light'] { color-scheme: light; background: #fbf9f5; color: #24221e; }\n.variant-shell[data-color-mode='dark'] { color-scheme: dark; background: #211e1c; color: #f0ebe3; }\n.variant-shell[data-transparent] { background: transparent; }\n";
function ze({ colorMode: e = "dark", transparent: t = !1 }) {
	return /* @__PURE__ */ (0, O.jsx)("div", {
		className: "variant-shell",
		"data-brand-theme": "rust",
		"data-color-mode": e,
		"data-theme": "deasy",
		"data-transparent": t || void 0,
		children: /* @__PURE__ */ (0, O.jsx)("main", {
			className: "scanner-gunmetal how-it-works",
			children: /* @__PURE__ */ (0, O.jsx)(Le, {})
		})
	});
}
function Be(e, t = {}) {
	let n = t, r = c(e, "how-it-works", [
		x,
		v,
		y,
		re,
		Re
	], /* @__PURE__ */ (0, O.jsx)(ze, { ...n }), t);
	return {
		update: (e) => {
			n = {
				...n,
				...e
			}, r.update(/* @__PURE__ */ (0, O.jsx)(ze, { ...n }));
		},
		unmount: r.unmount
	};
}
function Ve(e) {
	return {
		colorMode: e.getAttribute("color-mode") === "light" ? "light" : "dark",
		transparent: e.hasAttribute("transparent"),
		loadFonts: !e.hasAttribute("no-fonts")
	};
}
function He(e = "deasy-how-it-works") {
	f(e, ["color-mode", "transparent"], (e) => Be(e, Ve(e)), (e, t) => t.update(Ve(e)));
}
//#endregion
export { Be as n, He as t };
