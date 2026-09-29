import { S as e, _ as t, g as n, h as r, l as i, n as a, o, t as s, u as c, v as l, y as u } from "./shadow-eTaySNQB.js";
import { a as d, i as f, n as p, o as m, r as h, t as ee } from "./use-animate-C6XFgL5e.js";
//#region src/prototypes/how-it-works/howItWorks.css?inline
var te = ".how-it-works{--q-dup:var(--metric-duplicate);--q-sta:var(--flag-stale);--q-sen:var(--destructive);--q-off:#6b8e6f;--q-met:#c98a1e;--q-inc:#4e7c8a;--q-con:#7d5e8c;--pw-body:#24221e;--pw-rim:transparent;--graph-edge:color-mix(in srgb, var(--ink-faint) 34%, transparent);--graph-node:color-mix(in srgb, var(--ink-faint) 42%, var(--card))}.variant-shell[data-color-mode=dark] .how-it-works{--q-off:#8fb293;--q-met:#e0a94a;--q-inc:#7fa9b6;--q-con:#a88bb6;--pw-body:#161410;--pw-rim:var(--line)}.scanner-gunmetal.how-it-works .scanner{height:548px}.how-it-works .source-card{overflow:visible}.how-it-works .source-card.connected{border-color:color-mix(in srgb, var(--good) 55%, var(--border-soft))}.how-it-works .source-badge{border:1px dashed var(--line);color:var(--ink-faint);font:500 10.5px/1.2 var(--sans);white-space:nowrap;border-radius:999px;flex:none;align-self:start;padding:3px 8px;transition:color .15s,border-color .15s}.how-it-works .source-card:hover .source-badge{border-style:solid;border-color:color-mix(in srgb, var(--brand-signal) 55%, transparent);color:var(--brand-emphasis)}.how-it-works .source-card.connected .source-badge{border:1px solid color-mix(in srgb, var(--good) 50%, transparent);background:var(--good-bg);color:var(--good)}.how-it-works .plug{box-sizing:border-box;border:1px solid var(--border-soft);background:var(--card);border-radius:3px 5px 5px 3px;flex-direction:column;justify-content:center;align-items:flex-end;gap:4px;width:12px;height:22px;padding-right:2px;transition:translate .18s,border-color .18s;display:flex;position:absolute;top:50%;right:-8px;translate:0 -50%}.how-it-works .plug i{background:var(--track);border-radius:1px;width:6px;height:3px;transition:background-color .18s}.how-it-works .source-card:hover .plug{border-color:var(--brand-signal);translate:4px -50%}.how-it-works .source-card:hover .plug i{background:var(--brand-signal)}.how-it-works .source-card.connected .plug{border-color:var(--good)}.how-it-works .source-card.connected .plug i{background:var(--good)}.variant-shell[data-color-mode] .how-it-works .rig.is-connected .scanner{border-style:solid;border-color:var(--line);box-shadow:inset 0 1px 0 var(--surface-highlight)}.variant-shell[data-color-mode] .how-it-works .rig .scanner.hot{border-color:var(--brand-signal)}.how-it-works .portwall{box-shadow:0 0 0 1px var(--pw-rim), 0 10px 26px var(--shadow-ambient);border-radius:12px;flex:none;display:flex}.how-it-works .pw-sockets{background:var(--pw-body);border-radius:12px 0 0 12px;flex-direction:column;justify-content:center;gap:10px;padding:14px 7px 14px 9px;display:flex}.how-it-works .socket{box-sizing:border-box;background:#15140f;border:1px solid #383429;border-radius:3px;flex-direction:column;justify-content:center;align-items:center;gap:4px;width:17px;height:23px;animation:4.4s ease-in-out infinite hiw-socket;display:flex}.how-it-works .socket i{background:#4a4437;border-radius:1px;width:8px;height:3px}.how-it-works .socket.filled{border-color:var(--brand-signal);box-shadow:inset 0 0 8px 1px color-mix(in srgb, var(--brand-signal) 55%, transparent);animation:none}.how-it-works .socket.filled i{background:var(--brand-signal)}@keyframes hiw-socket{0%,72%,to{box-shadow:inset 0 0 #0000}22%{box-shadow:inset 0 0 8px 1px color-mix(in srgb, var(--brand-signal) 55%, transparent)}}.how-it-works .pw-body{background:var(--pw-body);border-left:1px solid #383429;border-radius:0 12px 12px 0;flex-direction:column;justify-content:center;gap:12px;padding:18px 24px 18px 15px;display:flex}.how-it-works .pw-mark{color:#fbf9f5;font:700 19px/1 var(--sans);letter-spacing:-.02em}.how-it-works .pw-mark b,.how-it-works .lk-mark b{color:var(--brand-signal)}.how-it-works .pw-live{gap:5px;display:flex}.how-it-works .pw-live em{background:#4a4437;border-radius:50%;width:5px;height:5px;animation:1.6s ease-in-out infinite hiw-live}.how-it-works .pw-live em:nth-child(2){animation-delay:.2s}.how-it-works .pw-live em:nth-child(3){animation-delay:.4s}@keyframes hiw-live{45%{background:#8ba68c}}.how-it-works .drop-empty{gap:20px}.how-it-works .drop-empty p{gap:5px;max-width:none;display:grid}.how-it-works .tap-note{color:var(--brand-emphasis);font:600 13px/1.2 var(--sans)}.how-it-works .desktop-drop-hint,.how-it-works .mobile-drop-hint{font-size:13px}.how-it-works .connect-body{flex-wrap:wrap;flex:1;justify-content:center;align-items:center;gap:40px;padding:8px;display:flex}.how-it-works .conn-list{width:270px}.how-it-works .conn-row{border-bottom:1px solid var(--line);justify-content:space-between;align-items:center;gap:18px;padding:12px 0;display:flex}.how-it-works .conn-name{color:var(--foreground);font:600 14px/1.2 var(--sans);align-items:center;gap:10px;display:flex}.how-it-works .conn-name .source-etch{width:17px;height:17px}.how-it-works .conn-n{color:var(--ink-faint);font:12px/1 var(--sans);font-variant-numeric:tabular-nums;white-space:nowrap}.how-it-works .conn-hint{color:var(--ink-faint);font:12.5px/1.3 var(--sans);margin:12px 0 0}.how-it-works .linkstrip{flex:none;align-items:center;gap:10px;width:min(100%,760px);margin:12px auto 0;display:flex}.how-it-works .lk-sources{gap:4px;display:flex}.how-it-works .lk-source{box-sizing:border-box;border:1px solid var(--border-soft);background:var(--popover);border-radius:6px;place-items:center;width:22px;height:22px;display:grid}.how-it-works .lk-source .source-etch{width:13px;height:13px}.how-it-works .lk-pipe{background:linear-gradient(var(--line), var(--line)) center / 100% 1px no-repeat;flex:1;min-width:40px;height:9px;position:relative;overflow:hidden}.how-it-works .lk-pipe i{background:var(--brand-signal);opacity:0;border-radius:50%;width:4px;height:4px;animation:2.6s linear infinite hiw-flow;position:absolute;top:2.5px;left:0}.how-it-works .lk-pipe i:nth-child(2){animation-delay:.43s}.how-it-works .lk-pipe i:nth-child(3){animation-delay:.86s}.how-it-works .lk-pipe i:nth-child(4){animation-delay:1.3s}.how-it-works .lk-pipe i:nth-child(5){animation-delay:1.73s}.how-it-works .lk-pipe i:nth-child(6){animation-delay:2.16s}@keyframes hiw-flow{0%{opacity:0;left:0}8%,92%{opacity:1}to{opacity:0;left:100%}}.how-it-works .lk-mark{color:var(--foreground);font:700 12.5px/1 var(--sans);letter-spacing:-.01em}.how-it-works .lk-dot,.how-it-works .livedot{background:var(--good);border-radius:50%;flex:none;width:7px;height:7px;animation:1.9s ease-in-out infinite hiw-pulse}@keyframes hiw-pulse{0%,to{box-shadow:0 0 0 0 color-mix(in srgb, var(--good) 55%, transparent)}70%{box-shadow:0 0 0 5px #0000}}.how-it-works .read-grid{flex:1;grid-template-columns:minmax(0,1fr) 250px;align-items:center;gap:40px;width:min(100%,900px);min-height:0;margin-inline:auto;display:grid}.how-it-works .read-pile-side{flex-direction:column;gap:18px;min-width:0;display:flex}.how-it-works .read-swarm{gap:9px 7px}.how-it-works .file-flags [data-flag=met]{--flag:var(--q-met)}.how-it-works .file-tip-reason[data-tone=met]{color:var(--q-met)}.how-it-works .quality-head{border-bottom:1px solid var(--line);color:var(--foreground);font:600 12.5px/1 var(--sans);margin:0 0 4px;padding-bottom:9px}.how-it-works .quality-list{margin:0;padding:0;list-style:none;display:grid}.how-it-works .quality-row{--q:var(--q-dup);grid-template-columns:minmax(0,1fr) auto;align-items:baseline;gap:5px 12px;padding:7px 0 8px;display:grid}.how-it-works .quality-row[data-dim=sta]{--q:var(--q-sta)}.how-it-works .quality-row[data-dim=sen]{--q:var(--q-sen)}.how-it-works .quality-row[data-dim=off]{--q:var(--q-off)}.how-it-works .quality-row[data-dim=met]{--q:var(--q-met)}.how-it-works .quality-row[data-dim=inc]{--q:var(--q-inc)}.how-it-works .quality-row[data-dim=con]{--q:var(--q-con)}.how-it-works .quality-name{color:var(--ink-soft);font:500 12.5px/1.25 var(--sans)}.how-it-works .quality-row:is([data-dim=dup],[data-dim=sta],[data-dim=sen],[data-dim=met]) .quality-name:before{background:var(--q);content:\"\";vertical-align:2px;border-radius:2px;width:12px;height:4px;margin-right:7px;display:inline-block}.how-it-works .quality-pct{color:var(--foreground);font:500 15px/1 var(--sans);font-variant-numeric:tabular-nums}.how-it-works .quality-meter{background:var(--track);border-radius:2px;grid-column:1/-1;height:3px;overflow:hidden}.how-it-works .quality-meter span{background:var(--q);transform-origin:0;border-radius:2px;height:100%;display:block}.how-it-works .filter-label span{font-family:var(--sans);letter-spacing:0;font-size:12.5px;font-weight:500}.scanner-gunmetal.how-it-works .filter-result{grid-template-columns:repeat(6,40px);gap:12px;display:grid}.scanner-gunmetal.how-it-works .filter-result .filter-file{width:40px}.how-it-works .verpick{z-index:3;border:1px solid var(--line);background:color-mix(in srgb, var(--background) 90%, transparent);box-shadow:0 14px 34px var(--shadow-ambient);opacity:0;pointer-events:none;border-radius:14px;gap:6px;padding:16px 30px;display:flex;position:absolute;top:50%;left:50%;translate:-50% -50%}.scanner-gunmetal.how-it-works .verpick .vfile{flex:none;width:46px;position:relative}.variant-shell[data-color-mode] .how-it-works .vold{border-color:color-mix(in srgb, var(--metric-old-version) 60%, var(--sheet-edge))}.how-it-works .vnew{--catch-color:var(--good);outline-offset:2px}.how-it-works .vtag{background:var(--sheet-stock);color:#756f63;font:600 9px/1 var(--sans);border-radius:3px;padding:2px 4px;position:absolute;bottom:4px;right:4px}.how-it-works .vnew .vtag{color:#4f6b43}.how-it-works .activate-panel .ai-query,.how-it-works .activate-panel .answer{margin:0;animation:none}.how-it-works .activate-panel .chat-composer{flex:none;margin-top:14px}.how-it-works .typed-query{min-height:2.9em;font:14px/1.45 var(--sans);display:block}.how-it-works .typed-line{min-height:1.45em;display:block}.how-it-works .caret{vertical-align:-2px;background:currentColor;width:2px;height:1.05em;margin-left:1px;animation:.75s step-end infinite hiw-caret;display:inline-block}@keyframes hiw-caret{50%{opacity:0}}.how-it-works .activate-grid{flex:1;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);align-items:center;gap:24px;min-height:0;margin-top:10px;display:grid}.how-it-works .graph-svg{width:100%;height:auto;display:block;overflow:visible}.how-it-works .graph-svg .ge{fill:none;stroke:var(--graph-edge);stroke-width:.7px}.how-it-works .graph-svg .ge.dashed{opacity:.7;stroke-dasharray:3 4}.how-it-works .graph-svg .gn{fill:var(--graph-node)}.how-it-works .graph-svg .ge.on{opacity:1;stroke:var(--brand-signal);stroke-width:1.5px}.how-it-works .graph-svg .ge.on.cross{stroke:var(--good);stroke-width:1.7px}.how-it-works .graph-svg .gn.lit{fill:var(--brand-signal)}.how-it-works .graph-svg .ghalo{fill:var(--brand-signal);opacity:.12}.how-it-works .graph-svg .glabel{fill:var(--ink-soft);font-family:var(--sans);font-size:10px;font-weight:500}.how-it-works .graph-svg .xcap{fill:var(--ink-faint);font-family:var(--sans);letter-spacing:.06em;text-transform:uppercase;font-size:9.5px;font-weight:600}.how-it-works .graph-svg .mnode{opacity:0;animation:9s ease-in-out 6.1s infinite hiw-grow}.how-it-works .graph-svg .gn.new{fill:var(--good)}.how-it-works .graph-svg .medge{stroke:color-mix(in srgb, var(--good) 55%, transparent);stroke-width:1.1px}@keyframes hiw-grow{0%,84%,to{opacity:0}8%,72%{opacity:1}}.how-it-works .activate-panel .answer p{font-size:13.5px;line-height:1.55}.how-it-works .activate-panel .verdict{margin-bottom:10px;font-size:14px}.how-it-works .activate-panel .verdict-mark{width:20px;height:20px;font-size:11px}.how-it-works .activate-panel .retrieve-footer{flex:none;margin-top:auto}.how-it-works .livebar{border:1px solid color-mix(in srgb, var(--good) 40%, var(--line));background:var(--good-bg);color:var(--good);font:600 11px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;border-radius:999px;grid-column:2;justify-self:center;align-items:center;gap:7px;padding:6px 12px;display:inline-flex}@media (width<=640px){.scanner-gunmetal.how-it-works .scanner{height:660px}.scanner-gunmetal.how-it-works .rig:not(.has-source) .scanner{height:400px}.scanner-gunmetal.how-it-works .rig.is-connected:not(.has-source) .scanner{height:500px}.how-it-works .source-card:after{display:none}.how-it-works .source-badge{box-sizing:border-box;align-self:center;place-items:center;width:24px;height:24px;padding:0;font-size:0;display:grid}.how-it-works .source-badge:before{content:\"+\";font:500 15px/1 var(--sans)}.how-it-works .source-card.connected .source-badge:before{content:\"✓\";font-size:12px;font-weight:700}.how-it-works .plug{display:none}.how-it-works .selected-source-tab{text-overflow:ellipsis;overflow:hidden}.how-it-works .connect-body{flex-direction:column;gap:22px}.how-it-works .conn-list{width:min(100%,290px)}.how-it-works .linkstrip{margin-top:10px}.how-it-works .read-grid{grid-template-columns:minmax(0,1fr);align-items:start;gap:14px;margin-top:14px}.how-it-works .read-pile-side{gap:12px}.how-it-works .read-count .count-now{font-size:38px}.how-it-works .read-swarm{grid-template-columns:repeat(10,minmax(0,1fr));gap:6px 5px}.how-it-works .read-swarm>.file:nth-child(n+41){display:none}.how-it-works .quality-list{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:16px}.how-it-works .quality-row{padding:5px 0 6px}.how-it-works .quality-row[data-dim=con]{grid-column:1/-1}.how-it-works .quality-name{font-size:11.5px}.how-it-works .quality-pct{font-size:13px}.scanner-gunmetal.how-it-works .filter-result{grid-template-columns:repeat(6,30px);gap:8px}.scanner-gunmetal.how-it-works .filter-result .filter-file{width:30px}.how-it-works .filter-label span{font-size:11.5px}.how-it-works .typed-query{font-size:13px}.how-it-works .typed-line{display:inline}.how-it-works .typed-line:first-child:after{content:\" \"}.how-it-works .activate-grid{grid-template-columns:minmax(0,1fr);align-content:start;gap:12px}.how-it-works .activate-panel .answer{padding:12px 14px}.how-it-works .activate-panel .answer p{font-size:12.5px}.how-it-works .livebar{padding:5px 9px;font-size:10px}}@media (prefers-reduced-motion:reduce){.how-it-works .socket,.how-it-works .pw-live em,.how-it-works .lk-dot,.how-it-works .livedot,.how-it-works .caret{animation:none}.how-it-works .lk-pipe i{opacity:1;animation:none;left:46%}.how-it-works .lk-pipe i:not(:first-child){display:none}.how-it-works .graph-svg .mnode{opacity:1;animation:none}}", ne = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20fill='none'%20stroke='%23757575'%20stroke-width='1.4'%20stroke-linejoin='round'%3e%3crect%20x='5'%20y='6.4'%20width='22'%20height='3.8'%20rx='.7'/%3e%3cpath%20d='M7%2012.6h18l-1.8%2011.8a2%202%200%200%201-2%201.7H10.8a2%202%200%200%201-2-1.7z'/%3e%3ccircle%20cx='16'%20cy='18.2'%20r='2.2'%20fill='%23757575'%20stroke='none'/%3e%3c/svg%3e", g = /* @__PURE__ */ e(n(), 1), re = {
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
}, _ = [
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
], ie = [
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
], v = r(), y = [
	{
		id: "s3",
		name: "S3 bucket",
		count: "412,000",
		unit: "files",
		etch: u
	},
	{
		id: "sp",
		name: "SharePoint site",
		count: "186,000",
		unit: "files",
		etch: l
	},
	{
		id: "gcs",
		name: "GCS bucket",
		count: "524,000",
		unit: "files",
		etch: ne
	},
	{
		id: "cf",
		name: "Confluence space",
		count: "68,000",
		unit: "pages",
		etch: t
	}
], b = Object.fromEntries(y.map((e) => [e.id, e])), x = y.map((e) => e.id), S = 2, C = (e) => [...e].sort((e, t) => x.indexOf(e) - x.indexOf(t)).join("_"), w = (e) => e.length === 1 ? b[e[0]].unit : "files", T = (e, t) => {
	let n = Math.sin(e * 12.9898 + t * 78.233) * 43758.5453;
	return n - Math.floor(n);
}, E = (e) => Math.floor(T(e, 3) * 4), D = [
	"Read",
	"Curate",
	"Activate"
], O = [
	{
		key: "dup",
		label: "Duplicates",
		reason: "Duplicate"
	},
	{
		key: "sta",
		label: "Stale",
		reason: "Stale"
	},
	{
		key: "sen",
		label: "Sensitive",
		reason: "Sensitive data"
	},
	{
		key: "off",
		label: "Off-topic",
		reason: "Off-topic"
	},
	{
		key: "met",
		label: "Missing metadata",
		reason: "Missing metadata"
	},
	{
		key: "inc",
		label: "Incomplete",
		reason: "Incomplete"
	},
	{
		key: "con",
		label: "Contains conflicting information",
		reason: "Conflicting"
	}
], ae = [
	"dup",
	"sta",
	"sen",
	"met"
], k = {
	dup: 0,
	sta: 1,
	sen: 2,
	met: 4
}, A = {
	type: "spring",
	duration: .5,
	bounce: 0
}, j = [
	.25,
	.1,
	.25,
	1
], M = [
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
], N = [
	"payroll_export_2024.csv",
	"customer_emails.xlsx",
	"offer_letter_JSmith.pdf",
	"passport_scan.pdf",
	"vendor_bank_details.xlsx"
], P = [
	"pdf",
	"docx",
	"xlsx",
	"pptx"
], oe = (e) => `${M[e % M.length]}.${P[e % P.length]}`;
function F({ source: e }) {
	return /* @__PURE__ */ (0, v.jsx)("span", {
		className: "source-etch",
		style: { "--etch": `url(${e.etch})` },
		"aria-hidden": "true"
	});
}
function se() {
	return /* @__PURE__ */ (0, v.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.7",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, v.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ (0, v.jsx)("path", { d: "M14 2v6h6" })]
	});
}
function I({ filled: e }) {
	return /* @__PURE__ */ (0, v.jsxs)("div", {
		className: "portwall",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, v.jsx)("div", {
			className: "pw-sockets",
			children: [
				0,
				1,
				2,
				3
			].map((t) => /* @__PURE__ */ (0, v.jsxs)("span", {
				className: `socket ${t < e ? "filled" : ""}`,
				style: { animationDelay: `${t * .5}s` },
				children: [/* @__PURE__ */ (0, v.jsx)("i", {}), /* @__PURE__ */ (0, v.jsx)("i", {})]
			}, t))
		}), /* @__PURE__ */ (0, v.jsxs)("div", {
			className: "pw-body",
			children: [/* @__PURE__ */ (0, v.jsxs)("span", {
				className: "pw-mark",
				children: ["deasy", /* @__PURE__ */ (0, v.jsx)("b", { children: "." })]
			}), /* @__PURE__ */ (0, v.jsxs)("span", {
				className: "pw-live",
				children: [
					/* @__PURE__ */ (0, v.jsx)("em", {}),
					/* @__PURE__ */ (0, v.jsx)("em", {}),
					/* @__PURE__ */ (0, v.jsx)("em", {})
				]
			})]
		})]
	});
}
function ce({ source: e, connected: t, onToggle: n }) {
	return /* @__PURE__ */ (0, v.jsxs)("button", {
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
			/* @__PURE__ */ (0, v.jsx)("span", {
				className: "source-icon",
				children: /* @__PURE__ */ (0, v.jsx)(F, { source: e })
			}),
			/* @__PURE__ */ (0, v.jsxs)("span", {
				className: "source-copy",
				children: [/* @__PURE__ */ (0, v.jsx)("span", {
					className: "source-name",
					children: e.name
				}), /* @__PURE__ */ (0, v.jsxs)("span", {
					className: "source-meta",
					children: [
						e.count,
						" ",
						e.unit
					]
				})]
			}),
			/* @__PURE__ */ (0, v.jsx)("span", {
				className: "source-badge",
				"aria-hidden": "true",
				children: t ? "Connected" : "+ Add"
			}),
			/* @__PURE__ */ (0, v.jsxs)("span", {
				className: "plug",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, v.jsx)("i", {}), /* @__PURE__ */ (0, v.jsx)("i", {})]
			})
		]
	});
}
function L({ phase: e }) {
	return /* @__PURE__ */ (0, v.jsx)("div", {
		className: "stepper",
		"aria-label": e < 0 ? "Three steps: Read, Curate, Activate" : `Step ${e + 1} of 3: ${D[e]}`,
		children: D.map((t, n) => /* @__PURE__ */ (0, v.jsxs)("div", {
			className: "step-fragment",
			children: [/* @__PURE__ */ (0, v.jsxs)("div", {
				"aria-current": n === e ? "step" : void 0,
				className: `step ${n === e ? "active" : ""} ${n < e ? "done" : ""}`,
				children: [/* @__PURE__ */ (0, v.jsx)("span", {
					className: "step-dot",
					children: n < e ? "✓" : n + 1
				}), /* @__PURE__ */ (0, v.jsx)("span", {
					className: "step-name",
					children: t
				})]
			}), n < D.length - 1 ? /* @__PURE__ */ (0, v.jsx)("span", {
				"aria-hidden": "true",
				className: `step-line ${n < e ? "done" : ""}`
			}) : null]
		}, t))
	});
}
function R({ ids: e }) {
	return /* @__PURE__ */ (0, v.jsxs)("div", {
		className: "linkstrip",
		"aria-label": `${e.map((e) => b[e].name).join(" and ")} connected to Deasy, live`,
		children: [
			/* @__PURE__ */ (0, v.jsx)("span", {
				className: "lk-sources",
				"aria-hidden": "true",
				children: e.map((e) => /* @__PURE__ */ (0, v.jsx)("span", {
					className: "lk-source",
					children: /* @__PURE__ */ (0, v.jsx)(F, { source: b[e] })
				}, e))
			}),
			/* @__PURE__ */ (0, v.jsx)("span", {
				className: "lk-pipe",
				"aria-hidden": "true",
				children: [
					0,
					1,
					2,
					3,
					4,
					5
				].map((e) => /* @__PURE__ */ (0, v.jsx)("i", {}, e))
			}),
			/* @__PURE__ */ (0, v.jsxs)("span", {
				className: "lk-mark",
				"aria-hidden": "true",
				children: ["deasy", /* @__PURE__ */ (0, v.jsx)("b", { children: "." })]
			}),
			/* @__PURE__ */ (0, v.jsx)("span", {
				className: "lk-dot",
				"aria-hidden": "true"
			})
		]
	});
}
function z({ className: e, describe: t, children: n }) {
	let [r, i] = (0, g.useState)(null), a = p(0), s = p(0), l = (e) => {
		let t = e.currentTarget.getBoundingClientRect(), n = e.clientX - t.left;
		a.set(n), s.set(e.clientY - t.top);
		let o = e.target.closest("[data-id]")?.dataset.id, c = n < t.width * .25 ? "start" : n > t.width * .75 ? "end" : "center";
		o !== void 0 && (Number(o) !== r?.id || c !== r.align) && i({
			id: Number(o),
			align: c
		});
	}, u = r ? t(r.id) : null;
	return /* @__PURE__ */ (0, v.jsxs)("div", {
		className: `${e} file-pile`,
		onPointerMove: l,
		onPointerLeave: () => i(null),
		children: [n, /* @__PURE__ */ (0, v.jsx)(c, { children: u && r ? /* @__PURE__ */ (0, v.jsxs)(o.div, {
			className: "file-tip",
			"aria-hidden": "true",
			"data-align": r.align,
			style: {
				x: a,
				y: s
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
			children: [/* @__PURE__ */ (0, v.jsx)("span", {
				className: "file-tip-name",
				children: u.name
			}), /* @__PURE__ */ (0, v.jsx)("span", {
				className: "file-tip-reason",
				"data-tone": u.tone,
				children: u.reason
			})]
		}) : null })]
	});
}
function le({ ids: e, onRead: t }) {
	return /* @__PURE__ */ (0, v.jsxs)("div", {
		className: "report-panel connect-panel",
		children: [
			/* @__PURE__ */ (0, v.jsx)(L, { phase: -1 }),
			/* @__PURE__ */ (0, v.jsxs)("div", {
				className: "connect-body",
				children: [/* @__PURE__ */ (0, v.jsx)(I, { filled: e.length }), /* @__PURE__ */ (0, v.jsxs)("div", {
					className: "conn-list",
					children: [/* @__PURE__ */ (0, v.jsx)(c, {
						initial: !1,
						children: e.map((e) => /* @__PURE__ */ (0, v.jsxs)(o.div, {
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
							transition: A,
							children: [/* @__PURE__ */ (0, v.jsxs)("span", {
								className: "conn-name",
								children: [/* @__PURE__ */ (0, v.jsx)(F, { source: b[e] }), b[e].name]
							}), /* @__PURE__ */ (0, v.jsxs)("span", {
								className: "conn-n",
								children: [
									b[e].count,
									" ",
									b[e].unit
								]
							})]
						}, e))
					}), /* @__PURE__ */ (0, v.jsx)(o.p, {
						className: "conn-hint",
						layout: !0,
						transition: A,
						children: e.length < S ? "Add another source with +" : "Two sources connected"
					})]
				})]
			}),
			/* @__PURE__ */ (0, v.jsx)("div", {
				className: "report-footer actions-only",
				children: /* @__PURE__ */ (0, v.jsx)("div", {
					className: "footer-actions",
					children: /* @__PURE__ */ (0, v.jsx)("button", {
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
function B(e, t) {
	return Array.from({ length: 56 }, (n, r) => ae.filter((n, i) => T(r, t + i) < e.dims[k[n]] / 100));
}
function V({ ids: e, combo: t, onBack: n, onNext: r }) {
	let i = B(t, e.reduce((e, t) => e + x.indexOf(t) * 13 + 11, 0));
	return /* @__PURE__ */ (0, v.jsxs)("div", {
		className: "report-panel rise-in",
		children: [
			/* @__PURE__ */ (0, v.jsx)(L, { phase: 0 }),
			/* @__PURE__ */ (0, v.jsx)(R, { ids: e }),
			/* @__PURE__ */ (0, v.jsxs)("div", {
				className: "read-grid",
				children: [/* @__PURE__ */ (0, v.jsxs)("div", {
					className: "read-pile-side",
					children: [/* @__PURE__ */ (0, v.jsxs)("p", {
						className: "read-count",
						children: [/* @__PURE__ */ (0, v.jsx)("span", {
							className: "count-now",
							children: t.count
						}), /* @__PURE__ */ (0, v.jsxs)("span", {
							className: "count-label",
							children: [w(e), " read"]
						})]
					}), /* @__PURE__ */ (0, v.jsx)(z, {
						className: "document-swarm read-swarm",
						describe: (e) => {
							let t = i[e];
							return {
								name: t.includes("sen") ? N[e % N.length] : oe(e),
								reason: t.length ? t.map((e) => O[k[e]].reason).join(" · ") : "No issues found",
								tone: t[0] ?? "clean"
							};
						},
						children: i.map((e, t) => /* @__PURE__ */ (0, v.jsx)("span", {
							className: "file",
							"data-paper": E(t),
							"data-id": t,
							children: e.length ? /* @__PURE__ */ (0, v.jsx)("span", {
								className: "file-flags",
								"aria-hidden": "true",
								children: e.map((e) => /* @__PURE__ */ (0, v.jsx)("i", { "data-flag": e }, e))
							}) : null
						}, t))
					})]
				}), /* @__PURE__ */ (0, v.jsxs)("div", {
					className: "quality",
					children: [/* @__PURE__ */ (0, v.jsx)("p", {
						className: "quality-head",
						children: "Quality check"
					}), /* @__PURE__ */ (0, v.jsx)("ul", {
						className: "quality-list",
						children: O.map((e, n) => /* @__PURE__ */ (0, v.jsxs)("li", {
							className: "quality-row",
							"data-dim": e.key,
							children: [
								/* @__PURE__ */ (0, v.jsx)("span", {
									className: "quality-name",
									children: e.label
								}),
								/* @__PURE__ */ (0, v.jsxs)("strong", {
									className: "quality-pct",
									children: [t.dims[n], "%"]
								}),
								/* @__PURE__ */ (0, v.jsx)("span", {
									className: "quality-meter",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, v.jsx)(o.span, {
										initial: { scaleX: 0 },
										animate: { scaleX: t.dims[n] / 100 },
										transition: {
											duration: .7,
											delay: .25 + n * .06,
											ease: j
										}
									})
								})
							]
						}, e.key))
					})]
				})]
			}),
			/* @__PURE__ */ (0, v.jsx)("div", {
				className: "report-footer actions-only",
				children: /* @__PURE__ */ (0, v.jsxs)("div", {
					className: "footer-actions",
					children: [/* @__PURE__ */ (0, v.jsx)("button", {
						className: "button button-ghost",
						type: "button",
						onClick: n,
						children: "Back"
					}), /* @__PURE__ */ (0, v.jsx)("button", {
						className: "button button-primary with-arrow",
						type: "button",
						onClick: r,
						children: "Curate it"
					})]
				})
			})
		]
	});
}
var H = "dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup dup sta old dup keep sen sta keep dup old sta dup sen keep sta old dup keep sta dup".split(" "), U = .9, ue = .6, de = .3, W = 3.95, fe = {
	dup: 0,
	old: 0,
	sen: 1,
	sta: 2
}, pe = [
	"Resolving duplicates and old versions",
	"Screening for sensitive data",
	"Dropping irrelevant files",
	"Reconciling conflicting information",
	"Meets quality standards"
], G = H.map((e, t) => ({
	kind: e,
	at: e === "keep" ? W : fe[e] * U + ue + T(t, 4) * de
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
], me = {
	dup: "Duplicate · removed",
	old: "Old version · removed",
	sen: "Sensitive data · removed",
	sta: "Irrelevant · removed",
	keep: "Meets quality standards"
}, he = (e) => {
	let { kind: t } = G[e], n = M[e % M.length];
	return {
		name: {
			dup: `${n} (copy ${2 + e % 3}).pdf`,
			old: `${n}_v${1 + e % 3}_OLD.docx`,
			sen: N[e % N.length],
			sta: `${n}_2019.pptx`,
			keep: q[K.indexOf(e) % q.length]
		}[t],
		reason: me[t],
		tone: t
	};
};
function ge({ ids: e, combo: t, onBack: n, onNext: r }) {
	let a = i(), [s, c] = ee(), [l, u] = (0, g.useState)(!1), d = a || l;
	(0, g.useEffect)(() => {
		if (a) return;
		let e = !0, t = [], n = (e) => (t.push(e), e), r = (e) => Array.from(s.current.querySelectorAll(e)), i = (e) => s.current.querySelector(e), o = async (t) => {
			delete t.dataset.removed, await n(c(t, {
				scale: [
					1,
					1.12,
					.86
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
				ease: j
			})), e && (t.dataset.removed = "", await n(c(t, { opacity: .5 }, {
				duration: .2,
				ease: "easeOut"
			})));
		}, l = [
			...[
				0,
				1,
				2,
				3
			].map((e) => n(c(r(`.filter-count-${e}, .filter-label-${e}`), { opacity: [
				0,
				1,
				1,
				0
			] }, {
				duration: U,
				delay: e * U,
				times: [
					0,
					.14,
					.82,
					1
				],
				ease: j
			}))),
			n(c(r(".filter-count-4, .filter-label-4"), { opacity: [0, 1] }, {
				duration: .25,
				delay: 4 * U,
				ease: j
			})),
			n(c(i(".verpick"), { opacity: [
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
				ease: j
			})),
			n(c(i(".vold"), {
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
					.82
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
				ease: j
			})),
			n(c(i(".vnew"), { x: [
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
				ease: j
			})),
			n(c(i(".vnew"), { "--catch": [0, 1] }, {
				duration: .25,
				delay: 3.25,
				ease: j
			})),
			...r(".filter-swarm > .filter-file.keep").map((e) => n(c(e, {
				scale: [
					1,
					1.14,
					1.06
				],
				"--catch": [
					0,
					1,
					1
				]
			}, {
				duration: .5,
				delay: W,
				ease: j
			}))),
			...r(".filter-swarm > .filter-file:not(.keep)").map(o)
		];
		return Promise.all(l).then(() => {
			e && u(!0);
		}), () => {
			e = !1, t.forEach((e) => e.stop());
		};
	}, [
		a,
		c,
		s
	]);
	let f = w(e);
	return /* @__PURE__ */ (0, v.jsxs)("div", {
		className: "report-panel rise-in",
		children: [
			/* @__PURE__ */ (0, v.jsx)(L, { phase: 1 }),
			/* @__PURE__ */ (0, v.jsx)(R, { ids: e }),
			/* @__PURE__ */ (0, v.jsxs)("div", {
				className: "filter-visual",
				ref: s,
				children: [/* @__PURE__ */ (0, v.jsxs)("div", {
					className: "filter-readout",
					children: [/* @__PURE__ */ (0, v.jsxs)("div", {
						className: "filter-count",
						"aria-label": `${t.counts[4]} of ${t.count} ${f} meet quality standards`,
						children: [t.counts.map((e, t) => /* @__PURE__ */ (0, v.jsx)("span", {
							className: `filter-count-${t}`,
							children: e
						}, t)), /* @__PURE__ */ (0, v.jsxs)("span", {
							className: "filter-denominator",
							children: [
								"of ",
								t.count,
								" ",
								f
							]
						})]
					}), /* @__PURE__ */ (0, v.jsx)("div", {
						className: "filter-label",
						children: pe.map((e, t) => /* @__PURE__ */ (0, v.jsx)("span", {
							className: `filter-label-${t}`,
							children: e
						}, e))
					})]
				}), /* @__PURE__ */ (0, v.jsxs)(z, {
					className: `document-swarm filter-swarm ${d ? "gathered" : ""}`,
					describe: he,
					children: [
						G.map(({ kind: e, at: t }, n) => e === "keep" ? d ? /* @__PURE__ */ (0, v.jsx)("span", { className: "filter-file vacated" }, n) : /* @__PURE__ */ (0, v.jsx)(o.span, {
							className: "filter-file keep",
							layoutId: `doc-${n}`,
							transition: A,
							"data-paper": E(n),
							"data-id": n
						}, n) : /* @__PURE__ */ (0, v.jsx)("span", {
							className: `filter-file ${e}`,
							"data-at": t,
							"data-paper": E(n),
							"data-id": n
						}, n)),
						d ? /* @__PURE__ */ (0, v.jsx)("div", {
							className: "filter-result",
							children: K.map((e) => /* @__PURE__ */ (0, v.jsx)(o.span, {
								className: "filter-file keep",
								layoutId: `doc-${e}`,
								transition: A,
								"data-paper": E(e),
								"data-id": e
							}, e))
						}) : null,
						d ? null : /* @__PURE__ */ (0, v.jsxs)("div", {
							className: "verpick",
							"aria-hidden": "true",
							children: [/* @__PURE__ */ (0, v.jsx)("span", {
								className: "filter-file vfile vold",
								"data-paper": 1,
								children: /* @__PURE__ */ (0, v.jsx)("span", {
									className: "vtag",
									children: "v3"
								})
							}), /* @__PURE__ */ (0, v.jsx)("span", {
								className: "filter-file vfile vnew",
								"data-paper": 0,
								children: /* @__PURE__ */ (0, v.jsx)("span", {
									className: "vtag",
									children: "v4"
								})
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, v.jsx)("div", {
				className: "report-footer actions-only",
				children: /* @__PURE__ */ (0, v.jsxs)("div", {
					className: "footer-actions",
					children: [/* @__PURE__ */ (0, v.jsx)("button", {
						className: "button button-ghost",
						type: "button",
						onClick: n,
						children: "Back"
					}), /* @__PURE__ */ (0, v.jsx)("button", {
						className: "button button-primary with-arrow",
						type: "button",
						onClick: r,
						children: "Ask your agent"
					})]
				})
			})
		]
	});
}
var J = ["What are the renewal terms for enterprise customers", "whose subscriptions started in December 2024?"], _e = [[.25, .78], [1.05, .7]];
function ve() {
	let e = i(), [t, n] = (0, g.useState)([0, 0]);
	return (0, g.useEffect)(() => {
		if (e) return;
		let t = performance.now(), r = requestAnimationFrame(function e(i) {
			let a = (i - t) / 1e3, o = _e.map(([e, t], n) => Math.round(Math.min(1, Math.max(0, (a - e) / t)) * J[n].length));
			n((e) => e[0] === o[0] && e[1] === o[1] ? e : o), o[1] < J[1].length && (r = requestAnimationFrame(e));
		});
		return () => cancelAnimationFrame(r);
	}, [e]), e ? [J[0].length, J[1].length] : t;
}
var Y = [
	{
		x: 141.5,
		y: 126.7,
		label: "Master agreement v4",
		at: 2.7,
		lx: 133,
		ly: 120,
		anchor: "end"
	},
	{
		x: 162.9,
		y: 148.7,
		label: "Renewal terms",
		at: 3,
		lx: 172,
		ly: 145,
		anchor: "start"
	},
	{
		x: 226.1,
		y: 172.7,
		label: "Dec 2024 cohort",
		at: 3.3,
		lx: 226.1,
		ly: 192,
		anchor: "middle"
	},
	{
		x: 439.7,
		y: 182.6,
		label: "Enterprise tier",
		at: 3.6,
		lx: 439.7,
		ly: 169.6,
		anchor: "middle"
	}
], ye = [
	0,
	1,
	2
].map((e) => ({
	from: Y[e],
	to: Y[e + 1],
	at: 2.75 + e * .3,
	cross: e > 0
})), X = [
	106,
	314,
	518
];
function be({ systems: e }) {
	let t = i(), n = (e) => t ? { initial: !1 } : { transition: {
		delay: e,
		duration: .45,
		ease: j
	} };
	return /* @__PURE__ */ (0, v.jsxs)("svg", {
		className: "graph-svg",
		viewBox: "0 0 620 244",
		role: "img",
		"aria-label": `Entity graph across ${e.join(", ")}, with the answer's path lit`,
		children: [
			/* @__PURE__ */ (0, v.jsxs)("g", {
				className: "gfield",
				children: [_.map(([e, t, n, r, i], a) => /* @__PURE__ */ (0, v.jsx)("line", {
					className: `ge ${i ? "dashed" : ""}`,
					x1: e,
					y1: t,
					x2: n,
					y2: r
				}, a)), ie.map(([e, t, n], r) => /* @__PURE__ */ (0, v.jsx)("circle", {
					className: "gn",
					"data-col": n,
					cx: e,
					cy: t,
					r: 2.6
				}, r))]
			}),
			e.map((e, t) => /* @__PURE__ */ (0, v.jsx)("text", {
				className: "xcap",
				x: X[t],
				y: 20,
				textAnchor: "middle",
				children: e
			}, e)),
			ye.map(({ from: e, to: t, at: r, cross: i }) => /* @__PURE__ */ (0, g.createElement)(o.line, {
				className: `ge on ${i ? "cross" : ""}`,
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
				...n(r),
				key: r
			})),
			Y.map((e) => /* @__PURE__ */ (0, g.createElement)(o.g, {
				className: "gnode",
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				...n(e.at),
				key: e.label
			}, /* @__PURE__ */ (0, v.jsx)("circle", {
				className: "ghalo",
				cx: e.x,
				cy: e.y,
				r: 11
			}), /* @__PURE__ */ (0, v.jsx)("circle", {
				className: "gn lit",
				cx: e.x,
				cy: e.y,
				r: 4.2
			}), /* @__PURE__ */ (0, v.jsx)("text", {
				className: "glabel",
				x: e.lx,
				y: e.ly,
				textAnchor: e.anchor,
				children: e.label
			}))),
			/* @__PURE__ */ (0, v.jsxs)("g", {
				className: "mnode",
				children: [/* @__PURE__ */ (0, v.jsx)("line", {
					className: "medge",
					x1: 439.7,
					y1: 182.6,
					x2: 479.7,
					y2: 216.6
				}), /* @__PURE__ */ (0, v.jsx)("circle", {
					className: "gn new",
					cx: 479.7,
					cy: 216.6,
					r: 3.4
				})]
			})
		]
	});
}
function xe({ ids: e, combo: t, onBack: n }) {
	let r = ve(), a = i(), s = (e) => a ? { initial: !1 } : {
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: e,
			duration: .45,
			ease: j
		}
	}, c = r[1] < J[1].length;
	return /* @__PURE__ */ (0, v.jsxs)("div", {
		className: "report-panel activate-panel",
		children: [
			/* @__PURE__ */ (0, v.jsx)(L, { phase: 2 }),
			/* @__PURE__ */ (0, v.jsx)(R, { ids: e }),
			/* @__PURE__ */ (0, v.jsxs)(o.div, {
				className: "ai-query chat-composer",
				...s(.05),
				children: [
					/* @__PURE__ */ (0, v.jsx)("span", {
						className: "query-icon",
						children: /* @__PURE__ */ (0, v.jsx)("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.7",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, v.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
						})
					}),
					/* @__PURE__ */ (0, v.jsxs)("span", {
						className: "chat-composer-text",
						children: [/* @__PURE__ */ (0, v.jsx)("span", {
							className: "query-label",
							children: "You ask your agent"
						}), /* @__PURE__ */ (0, v.jsx)("span", {
							className: "typed-query",
							"aria-label": J.join(" "),
							children: J.map((e, t) => /* @__PURE__ */ (0, v.jsxs)("span", {
								className: "typed-line",
								"aria-hidden": "true",
								children: [e.slice(0, r[t]), c && (t === 1 ? r[0] === J[0].length : r[0] < J[0].length) ? /* @__PURE__ */ (0, v.jsx)("span", { className: "caret" }) : null]
							}, t))
						})]
					}),
					/* @__PURE__ */ (0, v.jsx)("span", {
						className: "chat-composer-connectors",
						children: /* @__PURE__ */ (0, v.jsxs)("span", {
							className: "connector connector-deasy",
							children: [/* @__PURE__ */ (0, v.jsx)("span", {
								className: "connector-mark",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, v.jsx)("span", {
								className: "connector-name",
								children: "Deasy"
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, v.jsxs)("div", {
				className: "activate-grid",
				children: [/* @__PURE__ */ (0, v.jsx)(o.div, {
					className: "graph-wrap",
					...s(1.8),
					children: /* @__PURE__ */ (0, v.jsx)(be, { systems: t.systems })
				}), /* @__PURE__ */ (0, v.jsxs)(o.div, {
					className: "answer good-answer",
					...s(4),
					"aria-live": "polite",
					children: [
						/* @__PURE__ */ (0, v.jsxs)("div", {
							className: "verdict",
							children: [/* @__PURE__ */ (0, v.jsx)("span", {
								className: "verdict-mark",
								children: "✓"
							}), /* @__PURE__ */ (0, v.jsxs)("span", { children: [
								"Answered across ",
								t.systems.length,
								" systems"
							] })]
						}),
						/* @__PURE__ */ (0, v.jsxs)("p", { children: [
							"Those accounts renew on a ",
							/* @__PURE__ */ (0, v.jsx)("strong", { children: "12-month term with 60 days’ notice" }),
							", under v4 of the master agreement. Subscriptions that started before November 2024 stay on the legacy 30-day notice."
						] }),
						/* @__PURE__ */ (0, v.jsxs)("div", {
							className: "citation",
							children: [
								/* @__PURE__ */ (0, v.jsx)(se, {}),
								" ",
								t.systems.join(" → ")
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, v.jsxs)("div", {
				className: "retrieve-footer",
				children: [
					/* @__PURE__ */ (0, v.jsx)("button", {
						className: "button button-ghost",
						type: "button",
						onClick: n,
						children: "Back"
					}),
					/* @__PURE__ */ (0, v.jsxs)(o.span, {
						className: "livebar",
						...s(4.35),
						children: [/* @__PURE__ */ (0, v.jsx)("span", {
							className: "livedot",
							"aria-hidden": "true"
						}), "Live"]
					}),
					/* @__PURE__ */ (0, v.jsxs)("a", {
						className: "button button-primary with-arrow",
						href: "https://www.deasylabs.com/demo",
						children: [/* @__PURE__ */ (0, v.jsx)("span", {
							className: "desktop-button-label",
							children: "See it on your data"
						}), /* @__PURE__ */ (0, v.jsx)("span", {
							className: "mobile-button-label",
							children: "See demo"
						})]
					})
				]
			})
		]
	});
}
function Se() {
	let [e, t] = (0, g.useState)([]), [n, r] = (0, g.useState)("connect"), [i, a] = (0, g.useState)(!1), o = (0, g.useRef)(null), s = (0, g.useRef)(null), c = e.length ? re[C(e)] : void 0, l = n !== "connect" && c, u = (0, g.useCallback)((e) => {
		r("connect"), t((t) => t.includes(e) ? t.filter((t) => t !== e) : t.length < S ? [...t, e] : [t[0], e]);
	}, []), d = (t) => {
		t.preventDefault(), a(!1);
		let n = t.dataTransfer.getData("text/plain");
		Object.hasOwn(b, n) && !e.includes(n) && u(n);
	}, f = () => {
		r("connect"), requestAnimationFrame(() => s.current?.querySelector("button")?.focus());
	}, p = (e) => {
		r(e), requestAnimationFrame(() => o.current?.focus({ preventScroll: !0 }));
	}, m = e.map((e) => b[e].name).join(" + ");
	return /* @__PURE__ */ (0, v.jsx)(h, {
		reducedMotion: "user",
		children: /* @__PURE__ */ (0, v.jsxs)("section", {
			className: "wrap scan-section",
			id: "how-it-works",
			children: [/* @__PURE__ */ (0, v.jsx)("div", {
				className: "scanner-toolbar",
				children: l ? /* @__PURE__ */ (0, v.jsxs)(v.Fragment, { children: [/* @__PURE__ */ (0, v.jsxs)("div", {
					className: "blade-tab selected-source-tab",
					children: [
						/* @__PURE__ */ (0, v.jsx)("span", { className: "tab-dot" }),
						m,
						/* @__PURE__ */ (0, v.jsxs)("span", {
							className: "selected-source-count",
							children: [
								"· ",
								c.count,
								" ",
								w(e)
							]
						})
					]
				}), /* @__PURE__ */ (0, v.jsxs)("button", {
					className: "source-switch",
					type: "button",
					onClick: f,
					children: [/* @__PURE__ */ (0, v.jsx)("svg", {
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, v.jsx)("path", { d: "M2.5 5.5h9l-2.5-2.5M13.5 10.5h-9l2.5 2.5" })
					}), "Change source"]
				})] }) : /* @__PURE__ */ (0, v.jsxs)("div", {
					className: "blade-tab",
					children: [/* @__PURE__ */ (0, v.jsx)("span", { className: "tab-dot" }), "Connect one or more sources"]
				})
			}), /* @__PURE__ */ (0, v.jsx)("div", {
				className: `rig ${l ? "has-source" : ""} ${e.length ? "is-connected" : ""}`,
				children: /* @__PURE__ */ (0, v.jsxs)("div", {
					className: "stage",
					children: [l ? null : /* @__PURE__ */ (0, v.jsxs)("div", {
						className: "source-column",
						children: [/* @__PURE__ */ (0, v.jsx)("div", {
							className: "column-label",
							children: "Your data sources"
						}), /* @__PURE__ */ (0, v.jsx)("div", {
							className: "sources",
							ref: s,
							children: y.map((t) => /* @__PURE__ */ (0, v.jsx)(ce, {
								source: t,
								connected: e.includes(t.id),
								onToggle: u
							}, t.id))
						})]
					}), /* @__PURE__ */ (0, v.jsx)("div", {
						className: `scanner ${i ? "hot" : ""}`,
						ref: o,
						tabIndex: -1,
						onDragOver: (e) => {
							e.preventDefault(), a(!0);
						},
						onDragLeave: () => a(!1),
						onDrop: d,
						children: c ? /* @__PURE__ */ (0, v.jsxs)("div", {
							className: "selected-report",
							children: [
								n === "connect" ? /* @__PURE__ */ (0, v.jsx)(le, {
									ids: e,
									onRead: () => p("read")
								}) : null,
								n === "read" ? /* @__PURE__ */ (0, v.jsx)(V, {
									ids: e,
									combo: c,
									onBack: f,
									onNext: () => p("curate")
								}) : null,
								n === "curate" ? /* @__PURE__ */ (0, v.jsx)(ge, {
									ids: e,
									combo: c,
									onBack: () => p("read"),
									onNext: () => p("activate")
								}) : null,
								n === "activate" ? /* @__PURE__ */ (0, v.jsx)(xe, {
									ids: e,
									combo: c,
									onBack: () => p("curate")
								}) : null
							]
						}, n === "connect" ? "connect" : `${C(e)}-${n}`) : /* @__PURE__ */ (0, v.jsxs)("div", {
							className: "drop-empty",
							children: [/* @__PURE__ */ (0, v.jsx)(I, { filled: 0 }), /* @__PURE__ */ (0, v.jsxs)("p", { children: [
								/* @__PURE__ */ (0, v.jsx)("span", {
									className: "tap-note",
									children: "Plug in a source"
								}),
								/* @__PURE__ */ (0, v.jsx)("span", {
									className: "desktop-drop-hint",
									children: "Drag one here, or click to connect"
								}),
								/* @__PURE__ */ (0, v.jsx)("span", {
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
var Ce = "\n.variant-shell { font-family: var(--sans); font-size: var(--body-size); line-height: var(--body-line-height); -webkit-font-smoothing: antialiased; }\n.variant-shell[data-color-mode='light'] { color-scheme: light; background: #fbf9f5; color: #24221e; }\n.variant-shell[data-color-mode='dark'] { color-scheme: dark; background: #211e1c; color: #f0ebe3; }\n.variant-shell[data-transparent] { background: transparent; }\n";
function Z({ colorMode: e = "dark", transparent: t = !1 }) {
	return /* @__PURE__ */ (0, v.jsx)("div", {
		className: "variant-shell",
		"data-brand-theme": "rust",
		"data-color-mode": e,
		"data-theme": "deasy",
		"data-transparent": t || void 0,
		children: /* @__PURE__ */ (0, v.jsx)("main", {
			className: "scanner-gunmetal how-it-works",
			children: /* @__PURE__ */ (0, v.jsx)(Se, {})
		})
	});
}
function Q(e, t = {}) {
	let n = t, r = a(e, "how-it-works", [
		m,
		d,
		f,
		te,
		Ce
	], /* @__PURE__ */ (0, v.jsx)(Z, { ...n }), t);
	return {
		update: (e) => {
			n = {
				...n,
				...e
			}, r.update(/* @__PURE__ */ (0, v.jsx)(Z, { ...n }));
		},
		unmount: r.unmount
	};
}
function $(e) {
	return {
		colorMode: e.getAttribute("color-mode") === "light" ? "light" : "dark",
		transparent: e.hasAttribute("transparent"),
		loadFonts: !e.hasAttribute("no-fonts")
	};
}
function we(e = "deasy-how-it-works") {
	s(e, ["color-mode", "transparent"], (e) => Q(e, $(e)), (e, t) => t.update($(e)));
}
//#endregion
export { Q as n, we as t };
