import { S as e, T as t, b as n, l as r, n as i, o as a, t as o, u as s, x as c } from "./shadow-C_sgEj3S.js";
import { a as l, i as u, n as d, o as f, r as p, t as m } from "./use-animate-C-xDgiIY.js";
import { n as h, r as ee, t as te } from "./confluence-etch-CfSkSswt.js";
//#region src/prototypes/scanner-gunmetal/sourceModel.ts
var g = /* @__PURE__ */ t(c(), 1), _ = [
	{
		name: "Enterprise_Refund_Policy.pdf",
		tags: [
			["type", "policy"],
			["updated", "Aug 2026"],
			["owner", "Legal"],
			["region", "EU"],
			["PII", "none"],
			["version", "current"]
		]
	},
	{
		name: "Pricing_Sheet_Q3.xlsx",
		tags: [
			["type", "pricing"],
			["updated", "Jul 2026"],
			["owner", "Finance"],
			["region", "Global"],
			["PII", "none"],
			["version", "current"]
		]
	},
	{
		name: "Security_Overview.pdf",
		tags: [
			["type", "security"],
			["updated", "Jun 2026"],
			["owner", "IT"],
			["region", "Global"],
			["PII", "none"],
			["version", "v4"]
		]
	},
	{
		name: "MSA_Template.docx",
		tags: [
			["type", "contract"],
			["updated", "Apr 2026"],
			["owner", "Legal"],
			["region", "US"],
			["PII", "none"],
			["version", "v7"]
		]
	},
	{
		name: "Support_Runbook.md",
		tags: [
			["type", "runbook"],
			["updated", "Aug 2026"],
			["owner", "Support"],
			["region", "Global"],
			["PII", "none"],
			["version", "current"]
		]
	},
	{
		name: "Data_Retention_Policy.pdf",
		tags: [
			["type", "policy"],
			["updated", "Aug 2026"],
			["owner", "Legal"],
			["region", "Global"],
			["PII", "none"],
			["version", "current"]
		]
	}
], v = [
	"Refund_Policy",
	"Pricing_Sheet",
	"Security_Overview",
	"Onboarding_Guide",
	"Vendor_Contract",
	"Travel_Policy",
	"Roadmap",
	"Incident_Review"
], y = [
	"payroll_export_2024.csv",
	"customer_emails.xlsx",
	"offer_letter_JSmith.pdf",
	"passport_scan.pdf",
	"vendor_bank_details.xlsx"
], b = {
	dup: "Duplicate",
	old: "Superseded",
	sen: "Personal data",
	sta: "Untouched since 2019"
};
function x(e, t, n = 0) {
	let r = v[e % v.length];
	switch (t) {
		case "dup": return {
			name: `${r} (copy ${2 + e % 3}).pdf`,
			reason: b.dup
		};
		case "old": return {
			name: `${r}_v${1 + e % 3}_OLD.docx`,
			reason: b.old
		};
		case "sen": return {
			name: y[e % y.length],
			reason: b.sen
		};
		case "sta": return {
			name: `${r}_2019.pptx`,
			reason: b.sta
		};
		case "keep": return {
			name: _[n % _.length].name,
			reason: "Kept"
		};
		default: return {
			name: `${r}.pdf`,
			reason: "No issues found"
		};
	}
}
//#endregion
//#region src/prototypes/scanner-gunmetal/ScannerDemo.tsx
var S = n(), C = [
	{
		id: "s3",
		name: "S3 bucket",
		count: "8,420",
		unit: "files",
		finalCount: "1,180",
		metrics: [
			51,
			64,
			31
		],
		filterCounts: [
			"8,420",
			"5,220",
			"3,199",
			"1,852",
			"1,180"
		]
	},
	{
		id: "sp",
		name: "SharePoint site",
		count: "3,160",
		unit: "files",
		finalCount: "460",
		metrics: [
			44,
			55,
			47
		],
		filterCounts: [
			"3,160",
			"1,959",
			"1,200",
			"695",
			"460"
		]
	},
	{
		id: "db",
		name: "Databricks volume",
		count: "14,200",
		unit: "files",
		finalCount: "1,980",
		metrics: [
			38,
			72,
			19
		],
		filterCounts: [
			"14,200",
			"8,804",
			"5,396",
			"3,124",
			"1,980"
		]
	},
	{
		id: "cf",
		name: "Confluence space",
		count: "9,120",
		unit: "pages",
		finalCount: "1,280",
		metrics: [
			57,
			61,
			24
		],
		filterCounts: [
			"9,120",
			"5,654",
			"3,465",
			"2,006",
			"1,280"
		]
	}
], w = Object.fromEntries(C.map((e) => [e.id, e])), T = (e, t) => {
	let n = Math.sin(e * 12.9898 + t * 78.233) * 43758.5453;
	return n - Math.floor(n);
}, E = (e) => Math.floor(T(e, 3) * 4), ne = {
	s3: 11,
	sp: 23,
	db: 37,
	cf: 41
};
function re(e) {
	let [t, n, r] = e.metrics.map((e) => e / 100), i = ne[e.id];
	return Array.from({ length: 56 }, (e, a) => ({
		dup: T(a, i) < t,
		sta: T(a, i + 1) < n,
		sen: T(a, i + 2) < r
	}));
}
var ie = {
	dup: "Duplicate",
	sta: "Untouched since 2019",
	sen: "Personal data"
}, D = [
	"sen",
	"dup",
	"sta"
], O = [
	"dup",
	"sta",
	"sen"
], ae = /* @__PURE__ */ new Set([
	6,
	17,
	25,
	33,
	41,
	53
]), k = [
	"dup",
	"dup",
	"old",
	"sen",
	"sta",
	"sta"
], A = {
	dup: 0,
	old: 1,
	sen: 2,
	sta: 3
}, j = .9, oe = .6, se = .3, M = 3.95, N = [
	.25,
	.1,
	.25,
	1
], P = Array.from({ length: 60 }, (e, t) => {
	if (ae.has(t)) return {
		kind: "keep",
		at: M
	};
	let n = k[Math.floor(T(t, 2) * k.length)];
	return {
		kind: n,
		at: A[n] * j + oe + T(t, 4) * se
	};
}), F = [
	"Read",
	"Filter",
	"Enrich",
	"Retrieve"
], ce = [
	{
		label: "Duplicated",
		color: "var(--metric-duplicate)"
	},
	{
		label: "Stale",
		color: "var(--flag-stale)"
	},
	{
		label: "Sensitive",
		color: "var(--destructive)"
	}
], le = {
	s3: e,
	sp: ee,
	db: h,
	cf: te
};
function ue({ id: e }) {
	return e === "s3" ? /* @__PURE__ */ (0, S.jsxs)("svg", {
		viewBox: "0 0 32 32",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, S.jsx)("path", {
				fill: "#8C3123",
				d: "M16 2 6 5v22l10 3 10-3V5z"
			}),
			/* @__PURE__ */ (0, S.jsx)("path", {
				fill: "#E25444",
				d: "m16 2 10 3v22l-10 3z"
			}),
			/* @__PURE__ */ (0, S.jsx)("path", {
				fill: "#5E1F18",
				d: "M11 12h10v1.4H11zm0 4h10v1.4H11zm0 4h10v1.4H11z",
				opacity: ".45"
			}),
			/* @__PURE__ */ (0, S.jsx)("circle", {
				cx: "20.5",
				cy: "9",
				r: "1.3",
				fill: "#5E1F18",
				opacity: ".5"
			})
		]
	}) : e === "sp" ? /* @__PURE__ */ (0, S.jsxs)("svg", {
		viewBox: "0 0 32 32",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, S.jsx)("circle", {
				cx: "13",
				cy: "9.5",
				r: "6.2",
				fill: "#036C70"
			}),
			/* @__PURE__ */ (0, S.jsx)("circle", {
				cx: "21",
				cy: "15",
				r: "6.6",
				fill: "#1A9BA1"
			}),
			/* @__PURE__ */ (0, S.jsx)("circle", {
				cx: "15.5",
				cy: "21.5",
				r: "5.6",
				fill: "#37C6D0"
			}),
			/* @__PURE__ */ (0, S.jsx)("path", {
				d: "M11 8.5h6.4a1 1 0 0 1 1 1v6.4a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1z",
				fill: "#036C70"
			}),
			/* @__PURE__ */ (0, S.jsx)("path", {
				d: "M13.9 11.4c-1.5 0-2.4.6-2.4 1.7 0 1.9 3 1.5 3 2.4 0 .3-.3.5-.9.5-.7 0-1.5-.3-2-.7v1.4c.5.3 1.2.5 2 .5 1.6 0 2.5-.7 2.5-1.8 0-1.9-3-1.6-3-2.4 0-.3.3-.4.8-.4.6 0 1.3.2 1.8.5v-1.3c-.5-.2-1.1-.4-1.8-.4z",
				fill: "#fff"
			})
		]
	}) : e === "db" ? /* @__PURE__ */ (0, S.jsx)("svg", {
		viewBox: "0 0 32 32",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, S.jsxs)("g", {
			fill: "#FF3621",
			children: [
				/* @__PURE__ */ (0, S.jsx)("path", { d: "m16 6 10 5.6-2 1.1L16 8.1 8 12.7l-2-1.1z" }),
				/* @__PURE__ */ (0, S.jsx)("path", { d: "m16 12 10 5.6-2 1.1L16 14.1 8 18.7l-2-1.1z" }),
				/* @__PURE__ */ (0, S.jsx)("path", { d: "m16 18 10 5.6-10 5.6L6 23.6l2-1.1 8 4.6 8-4.6z" })
			]
		})
	}) : /* @__PURE__ */ (0, S.jsxs)("svg", {
		viewBox: "0 0 32 32",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, S.jsxs)("defs", { children: [/* @__PURE__ */ (0, S.jsxs)("linearGradient", {
				id: "cf-gradient-a",
				x1: "0",
				y1: "1",
				x2: "1",
				y2: "0",
				children: [/* @__PURE__ */ (0, S.jsx)("stop", {
					offset: "0",
					stopColor: "#0052CC"
				}), /* @__PURE__ */ (0, S.jsx)("stop", {
					offset: "1",
					stopColor: "#2684FF"
				})]
			}), /* @__PURE__ */ (0, S.jsxs)("linearGradient", {
				id: "cf-gradient-b",
				x1: "1",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, S.jsx)("stop", {
					offset: "0",
					stopColor: "#0052CC"
				}), /* @__PURE__ */ (0, S.jsx)("stop", {
					offset: "1",
					stopColor: "#2684FF"
				})]
			})] }),
			/* @__PURE__ */ (0, S.jsx)("path", {
				fill: "url(#cf-gradient-a)",
				d: "M5 19.6c2.9-4.5 7.2-4.7 11.4-2.6l3.9 1.9c.5.3 1.1 0 1.3-.5l1.9-3.4c.3-.5.1-1.1-.4-1.4-1-.5-2.9-1.4-4.6-2.2-6.2-3-11.5-2.8-15.2 3.2-.3.4-.1 1 .3 1.3l3 1.8c.1-.1.2-.2.3-.3z"
			}),
			/* @__PURE__ */ (0, S.jsx)("path", {
				fill: "url(#cf-gradient-b)",
				d: "M27 12.4c-2.9 4.5-7.2 4.7-11.4 2.6l-3.9-1.9c-.5-.3-1.1 0-1.3.5L8.5 17c-.3.5-.1 1.1.4 1.4 1 .5 2.9 1.4 4.6 2.2 6.2 3 11.5 2.8 15.2-3.2.3-.4.1-1-.3-1.3l-3-1.8c-.1.1-.2.2-.3.3z"
			})
		]
	});
}
function I() {
	return /* @__PURE__ */ (0, S.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.7",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, S.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), /* @__PURE__ */ (0, S.jsx)("path", { d: "M14 2v6h6" })]
	});
}
function de({ source: e, onSelect: t }) {
	return /* @__PURE__ */ (0, S.jsxs)("button", {
		className: "source-card",
		type: "button",
		draggable: !0,
		onClick: () => t(e.id),
		onDragStart: (t) => {
			t.dataTransfer.setData("text/plain", e.id), t.dataTransfer.effectAllowed = "link";
		},
		"aria-label": `${e.name}, ${e.count} ${e.unit}`,
		children: [/* @__PURE__ */ (0, S.jsx)("span", {
			className: "source-icon",
			children: /* @__PURE__ */ (0, S.jsx)("span", {
				className: "source-etch",
				style: { "--etch": `url(${le[e.id]})` }
			})
		}), /* @__PURE__ */ (0, S.jsxs)("span", {
			className: "source-copy",
			children: [/* @__PURE__ */ (0, S.jsx)("span", {
				className: "source-name",
				children: e.name
			}), /* @__PURE__ */ (0, S.jsxs)("span", {
				className: "source-meta",
				children: [
					e.count,
					" ",
					e.unit
				]
			})]
		})]
	});
}
function L({ phase: e }) {
	return /* @__PURE__ */ (0, S.jsx)("div", {
		className: "stepper",
		"aria-label": `Step ${e + 1} of 4: ${F[e]}`,
		children: F.map((t, n) => /* @__PURE__ */ (0, S.jsxs)("div", {
			className: "step-fragment",
			children: [/* @__PURE__ */ (0, S.jsxs)("div", {
				"aria-current": n === e ? "step" : void 0,
				className: `step ${n === e ? "active" : ""} ${n < e ? "done" : ""}`,
				children: [/* @__PURE__ */ (0, S.jsx)("span", {
					className: "step-dot",
					children: n < e ? "✓" : n + 1
				}), /* @__PURE__ */ (0, S.jsx)("span", {
					className: "step-name",
					children: t
				})]
			}), n < F.length - 1 ? /* @__PURE__ */ (0, S.jsx)("span", {
				"aria-hidden": "true",
				className: `step-line ${n < e ? "done" : ""}`
			}) : null]
		}, t))
	});
}
var R = {
	type: "spring",
	duration: .5,
	bounce: 0
}, z = {
	type: "spring",
	duration: .34,
	bounce: 0
}, B = P.flatMap((e, t) => e.kind === "keep" ? [t] : []), V = (e) => B.indexOf(e);
function H({ className: e, describe: t, children: n }) {
	let [r, i] = (0, g.useState)(null), o = d(0), c = d(0), l = (e) => {
		let t = e.currentTarget.getBoundingClientRect(), n = e.clientX - t.left;
		o.set(n), c.set(e.clientY - t.top);
		let a = e.target.closest("[data-id]")?.dataset.id, s = n < t.width * .25 ? "start" : n > t.width * .75 ? "end" : "center";
		a !== void 0 && (Number(a) !== r?.id || s !== r.align) && i({
			id: Number(a),
			align: s
		});
	}, u = r ? t(r.id) : null;
	return /* @__PURE__ */ (0, S.jsxs)("div", {
		className: `${e} file-pile`,
		onPointerMove: l,
		onPointerLeave: () => i(null),
		children: [n, /* @__PURE__ */ (0, S.jsx)(s, { children: u && r ? /* @__PURE__ */ (0, S.jsxs)(a.div, {
			className: "file-tip",
			"aria-hidden": "true",
			"data-align": r.align,
			style: {
				x: o,
				y: c
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
			children: [/* @__PURE__ */ (0, S.jsx)("span", {
				className: "file-tip-name",
				children: u.name
			}), /* @__PURE__ */ (0, S.jsx)("span", {
				className: "file-tip-reason",
				"data-tone": u.tone,
				children: u.reason
			})]
		}) : null })]
	});
}
function fe({ source: e, onNext: t }) {
	let n = re(e);
	return /* @__PURE__ */ (0, S.jsxs)("div", {
		className: "report-panel rise-in",
		children: [
			/* @__PURE__ */ (0, S.jsx)(L, { phase: 0 }),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "read-layout",
				children: [/* @__PURE__ */ (0, S.jsxs)("div", {
					className: "read-head",
					children: [/* @__PURE__ */ (0, S.jsxs)("p", {
						className: "read-count",
						children: [/* @__PURE__ */ (0, S.jsx)("span", {
							className: "count-now",
							children: e.count
						}), /* @__PURE__ */ (0, S.jsxs)("span", {
							className: "count-label",
							children: [e.unit, " read"]
						})]
					}), /* @__PURE__ */ (0, S.jsx)("ul", {
						className: "read-legend",
						children: ce.map((t, n) => /* @__PURE__ */ (0, S.jsxs)("li", {
							style: { "--flag": t.color },
							children: [/* @__PURE__ */ (0, S.jsxs)("span", {
								className: "read-legend-word",
								children: [/* @__PURE__ */ (0, S.jsx)("span", {
									className: "flag-swatch",
									"aria-hidden": "true"
								}), t.label]
							}), /* @__PURE__ */ (0, S.jsxs)("strong", {
								className: "read-legend-value",
								children: [e.metrics[n], "%"]
							})]
						}, t.label))
					})]
				}), /* @__PURE__ */ (0, S.jsx)(H, {
					className: "document-swarm read-swarm",
					describe: (e) => {
						let t = D.filter((t) => n[e][t]), r = t[0] ?? null;
						return {
							name: x(e, r).name,
							reason: t.length ? t.map((e) => ie[e]).join(" · ") : "No issues found",
							tone: r ?? "clean"
						};
					},
					children: n.map((e, t) => /* @__PURE__ */ (0, S.jsx)("span", {
						className: "file",
						"data-paper": E(t),
						"data-id": t,
						children: e.dup || e.sta || e.sen ? /* @__PURE__ */ (0, S.jsx)("span", {
							className: "file-flags",
							"aria-hidden": "true",
							children: O.map((t) => e[t] ? /* @__PURE__ */ (0, S.jsx)("i", { "data-flag": t }, t) : null)
						}) : null
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "report-footer actions-only",
				children: /* @__PURE__ */ (0, S.jsx)("div", {
					className: "footer-actions",
					children: /* @__PURE__ */ (0, S.jsx)("button", {
						className: "button button-primary with-arrow",
						type: "button",
						onClick: t,
						children: "Filter it"
					})
				})
			})
		]
	});
}
function pe({ source: e, onBack: t, onNext: n }) {
	let i = [
		"Removing duplicates",
		"Removing old versions",
		"Removing sensitive data",
		"Removing stale docs",
		"Meets quality criteria"
	], o = r(), [s, c] = m(), [l, u] = (0, g.useState)(!1), d = o || l;
	return (0, g.useEffect)(() => {
		if (o) return;
		let e = !0, t = [], n = (e) => (t.push(e), e), r = (e) => Array.from(s.current.querySelectorAll(e)), i = async (t) => {
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
				ease: N
			})), e && (t.dataset.removed = "", await n(c(t, { opacity: .5 }, {
				duration: .2,
				ease: "easeOut"
			})));
		}, a = [
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
				duration: j,
				delay: e * j,
				times: [
					0,
					.14,
					.82,
					1
				],
				ease: N
			}))),
			n(c(r(".filter-count-4, .filter-label-4"), { opacity: [0, 1] }, {
				duration: .25,
				delay: 4 * j,
				ease: N
			})),
			...r(".filter-file.keep").map((e) => n(c(e, {
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
				delay: M,
				ease: N
			}))),
			...r(".filter-file:not(.keep)").map(i)
		];
		return Promise.all(a).then(() => {
			e && u(!0);
		}), () => {
			e = !1, t.forEach((e) => e.stop());
		};
	}, [
		o,
		c,
		s
	]), /* @__PURE__ */ (0, S.jsxs)("div", {
		className: "report-panel rise-in",
		children: [
			/* @__PURE__ */ (0, S.jsx)(L, { phase: 1 }),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "filter-visual",
				ref: s,
				children: [/* @__PURE__ */ (0, S.jsxs)("div", {
					className: "filter-readout",
					children: [/* @__PURE__ */ (0, S.jsxs)("div", {
						className: "filter-count",
						"aria-label": `${e.finalCount} of ${e.count} ${e.unit} meet quality criteria`,
						children: [e.filterCounts.map((e, t) => /* @__PURE__ */ (0, S.jsx)("span", {
							className: `filter-count-${t}`,
							children: e
						}, e)), /* @__PURE__ */ (0, S.jsxs)("span", {
							className: "filter-denominator",
							children: [
								"of ",
								e.count,
								" ",
								e.unit
							]
						})]
					}), /* @__PURE__ */ (0, S.jsx)("div", {
						className: "filter-label",
						children: i.map((e, t) => /* @__PURE__ */ (0, S.jsx)("span", {
							className: `filter-label-${t}`,
							children: e
						}, e))
					})]
				}), /* @__PURE__ */ (0, S.jsxs)(H, {
					className: `document-swarm filter-swarm ${d ? "gathered" : ""}`,
					describe: (e) => {
						let t = P[e].kind, n = x(e, t, V(e));
						return {
							name: n.name,
							reason: t === "keep" ? n.reason : `${n.reason} · removed`,
							tone: t
						};
					},
					children: [P.map(({ kind: e, at: t }, n) => e === "keep" ? d ? /* @__PURE__ */ (0, S.jsx)("span", { className: "filter-file vacated" }, n) : /* @__PURE__ */ (0, S.jsx)(a.span, {
						className: "filter-file keep",
						layoutId: `doc-${n}`,
						transition: R,
						"data-paper": E(n),
						"data-id": n
					}, n) : /* @__PURE__ */ (0, S.jsx)("span", {
						className: `filter-file ${e}`,
						"data-at": t,
						"data-paper": E(n),
						"data-id": n
					}, n)), d ? /* @__PURE__ */ (0, S.jsx)("div", {
						className: "filter-result",
						children: B.map((e) => /* @__PURE__ */ (0, S.jsx)(a.span, {
							className: "filter-file keep",
							layoutId: `doc-${e}`,
							transition: R,
							"data-paper": E(e),
							"data-id": e
						}, e))
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "report-footer actions-only",
				children: /* @__PURE__ */ (0, S.jsxs)("div", {
					className: "footer-actions",
					children: [/* @__PURE__ */ (0, S.jsx)("button", {
						className: "button button-ghost",
						type: "button",
						onClick: t,
						children: "Back"
					}), /* @__PURE__ */ (0, S.jsx)("button", {
						className: "button button-primary with-arrow",
						type: "button",
						onClick: n,
						children: "Enrich what’s left"
					})]
				})
			})
		]
	});
}
function me({ source: e, openId: t, onOpen: n, onBack: r, onNext: i }) {
	let o = _[V(t)];
	return /* @__PURE__ */ (0, S.jsxs)("div", {
		className: "report-panel rise-in",
		children: [
			/* @__PURE__ */ (0, S.jsx)(L, { phase: 2 }),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "enrich-wrap",
				children: [/* @__PURE__ */ (0, S.jsx)(a.div, {
					className: "enriched-document",
					layoutId: `doc-${t}`,
					transition: R,
					style: { borderRadius: 5 },
					children: /* @__PURE__ */ (0, S.jsxs)(a.div, {
						initial: { opacity: 0 },
						animate: {
							opacity: 1,
							transition: {
								delay: .22,
								duration: .2
							}
						},
						children: [
							/* @__PURE__ */ (0, S.jsx)("span", {
								className: "document-lines",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, S.jsxs)("span", {
								className: "document-kicker",
								children: ["Curated document · ", V(t) + 1]
							}),
							/* @__PURE__ */ (0, S.jsx)("div", {
								className: "document-name",
								children: o.name
							}),
							/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "document-sub",
								children: [
									V(t) + 1,
									" of ",
									e.finalCount,
									" curated docs"
								]
							})
						]
					}, t)
				}), /* @__PURE__ */ (0, S.jsx)("div", {
					className: "metadata-tags",
					children: o.tags.map(([e, t], n) => /* @__PURE__ */ (0, S.jsxs)("span", {
						className: "metadata-tag",
						style: { animationDelay: `${.45 + n * .16}s` },
						children: [/* @__PURE__ */ (0, S.jsx)("span", { children: e }), t]
					}, e))
				}, t)]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "kept-row",
				role: "group",
				"aria-label": "Kept files",
				children: [/* @__PURE__ */ (0, S.jsx)("span", {
					className: "kept-label",
					children: "Kept files"
				}), B.map((e) => e === t ? /* @__PURE__ */ (0, S.jsx)("span", {
					className: "kept-slot",
					"aria-current": "true",
					"aria-label": `${_[V(e)].name}, open`
				}, e) : /* @__PURE__ */ (0, S.jsx)(a.button, {
					className: "filter-file kept-thumb",
					type: "button",
					layoutId: `doc-${e}`,
					transition: R,
					"data-paper": E(e),
					style: { borderRadius: 3 },
					"aria-label": `Open ${_[V(e)].name}`,
					onClick: () => n(e)
				}, e))]
			}),
			/* @__PURE__ */ (0, S.jsx)("div", {
				className: "report-footer actions-only",
				children: /* @__PURE__ */ (0, S.jsxs)("div", {
					className: "footer-actions",
					children: [/* @__PURE__ */ (0, S.jsx)("button", {
						className: "button button-ghost",
						type: "button",
						onClick: r,
						children: "Back"
					}), /* @__PURE__ */ (0, S.jsx)("button", {
						className: "button button-primary with-arrow",
						type: "button",
						onClick: i,
						children: "Ask your agent"
					})]
				})
			})
		]
	});
}
var U = "What is our refund policy for enterprise customers?", W = [
	2100,
	1100,
	2800,
	2200,
	1100
], G = W.length;
function he() {
	let e = r(), [t, n] = (0, g.useState)(0), i = (0, g.useRef)([]), a = (0, g.useCallback)(() => {
		i.current.forEach(clearTimeout), i.current = [];
	}, []), o = (0, g.useCallback)(() => {
		if (a(), n(e ? G : 0), e) return;
		let t = 0;
		W.forEach((e, r) => {
			t += e, i.current.push(window.setTimeout(() => n(r + 1), t));
		});
	}, [a, e]);
	return (0, g.useEffect)(() => a, [a]), {
		stage: t,
		done: t === G,
		start: o,
		stop: a
	};
}
function K({ source: e }) {
	return e === "deasy" ? /* @__PURE__ */ (0, S.jsxs)("span", {
		className: "connector connector-deasy",
		children: [/* @__PURE__ */ (0, S.jsx)("span", {
			className: "connector-mark",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, S.jsx)("span", {
			className: "connector-name",
			children: "Deasy"
		})]
	}) : /* @__PURE__ */ (0, S.jsxs)("span", {
		className: "connector",
		children: [/* @__PURE__ */ (0, S.jsx)("span", {
			className: "connector-icon",
			children: /* @__PURE__ */ (0, S.jsx)(ue, { id: e.id })
		}), /* @__PURE__ */ (0, S.jsx)("span", {
			className: "connector-name",
			children: e.name
		})]
	});
}
var q = {
	initial: {
		opacity: 0,
		y: 10
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: z
	}
};
function J({ connectors: e }) {
	return /* @__PURE__ */ (0, S.jsxs)(a.div, {
		className: "chat-user",
		...q,
		children: [/* @__PURE__ */ (0, S.jsx)("p", {
			className: "chat-question",
			children: U
		}), e.length ? /* @__PURE__ */ (0, S.jsx)("div", {
			className: "chat-connectors",
			children: e.map((e) => /* @__PURE__ */ (0, S.jsx)(K, { source: e }, e === "deasy" ? "deasy" : e.id))
		}) : null]
	});
}
function Y({ children: e }) {
	return /* @__PURE__ */ (0, S.jsxs)(a.p, {
		className: "chat-thinking",
		...q,
		children: [/* @__PURE__ */ (0, S.jsx)("span", {
			className: "chat-thinking-dot",
			"aria-hidden": "true"
		}), e]
	});
}
function X({ source: e, script: t, onBack: n }) {
	let { stage: r, start: i } = t, o = (0, g.useRef)(null), c = r >= 3 ? [e, "deasy"] : [e], l = r === 0 || r === 3;
	return (0, g.useEffect)(() => {
		i();
	}, [i]), (0, g.useEffect)(() => {
		let e = o.current;
		e && (e.scrollTop = e.scrollHeight);
	}, [r]), /* @__PURE__ */ (0, S.jsxs)("div", {
		className: "report-panel retrieve-panel",
		children: [
			/* @__PURE__ */ (0, S.jsx)(L, { phase: 3 }),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "chat",
				ref: o,
				"aria-live": "polite",
				children: [
					r < 3 ? /* @__PURE__ */ (0, S.jsxs)(S.Fragment, { children: [
						/* @__PURE__ */ (0, S.jsxs)("p", {
							className: "chat-event",
							children: [
								e.name,
								" connected · ",
								e.count,
								" ",
								e.unit,
								", as-is"
							]
						}),
						r >= 1 ? /* @__PURE__ */ (0, S.jsx)(J, { connectors: [e] }) : null,
						r === 1 ? /* @__PURE__ */ (0, S.jsxs)(Y, { children: [
							"Searching ",
							e.count,
							" ",
							e.unit,
							"…"
						] }) : null,
						r >= 2 ? /* @__PURE__ */ (0, S.jsxs)(a.div, {
							className: "answer bad-answer",
							layoutId: "raw-answer",
							transition: z,
							...q,
							children: [
								/* @__PURE__ */ (0, S.jsxs)("div", {
									className: "verdict",
									children: [
										/* @__PURE__ */ (0, S.jsx)("span", {
											className: "verdict-sub",
											children: "Without Deasy, on the raw data"
										}),
										/* @__PURE__ */ (0, S.jsx)("span", {
											className: "verdict-mark",
											children: "×"
										}),
										/* @__PURE__ */ (0, S.jsx)("span", { children: "Wrong answer" })
									]
								}),
								/* @__PURE__ */ (0, S.jsxs)("p", { children: [
									"Enterprise customers get a ",
									/* @__PURE__ */ (0, S.jsx)("b", { children: "14-day" }),
									" refund window. To start one, email the account owner at ",
									/* @__PURE__ */ (0, S.jsx)("span", {
										className: "leak",
										children: "m.alvarez@northriver.com"
									}),
									"."
								] }),
								/* @__PURE__ */ (0, S.jsxs)("div", {
									className: "citation",
									children: [/* @__PURE__ */ (0, S.jsx)(I, {}), " refund_policy_DRAFT_v2.docx · 2021 · 1 of 4 copies"]
								})
							]
						}) : null
					] }) : /* @__PURE__ */ (0, S.jsxs)(a.div, {
						className: "answer bad-answer bad-recap",
						layoutId: "raw-answer",
						transition: z,
						children: [/* @__PURE__ */ (0, S.jsx)("span", {
							className: "verdict-mark",
							"aria-hidden": "true",
							children: "×"
						}), /* @__PURE__ */ (0, S.jsxs)("p", { children: [
							/* @__PURE__ */ (0, S.jsx)("span", {
								className: "verdict-sub",
								children: "Without Deasy"
							}),
							"Said ",
							/* @__PURE__ */ (0, S.jsx)("b", { children: "14-day" }),
							", leaked a customer email, cited a 2021 draft"
						] })]
					}),
					r >= 3 ? /* @__PURE__ */ (0, S.jsxs)(a.p, {
						className: "chat-event chat-event-deasy",
						...q,
						children: [
							"Deasy connected · ",
							e.finalCount,
							" labelled ",
							e.unit
						]
					}) : null,
					r >= 4 ? /* @__PURE__ */ (0, S.jsx)(J, { connectors: [] }) : null,
					r === 4 ? /* @__PURE__ */ (0, S.jsxs)(Y, { children: [
						"Searching ",
						e.finalCount,
						" labelled ",
						e.unit,
						" where type is policy, version is current…"
					] }) : null,
					r >= 5 ? /* @__PURE__ */ (0, S.jsxs)(a.div, {
						className: "answer good-answer",
						...q,
						children: [
							/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "verdict",
								children: [
									/* @__PURE__ */ (0, S.jsx)("span", {
										className: "verdict-sub",
										children: "With Deasy"
									}),
									/* @__PURE__ */ (0, S.jsx)("span", {
										className: "verdict-mark",
										children: "✓"
									}),
									/* @__PURE__ */ (0, S.jsx)("span", { children: "Right answer" })
								]
							}),
							/* @__PURE__ */ (0, S.jsxs)("p", { children: [
								"Enterprise customers have a ",
								/* @__PURE__ */ (0, S.jsx)("strong", { children: "30-day" }),
								" refund window under the current master agreement. No customer contact details are needed to start one."
							] }),
							/* @__PURE__ */ (0, S.jsxs)("div", {
								className: "citation",
								children: [/* @__PURE__ */ (0, S.jsx)(I, {}), " from your context layer · Enterprise_Refund_Policy.pdf"]
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "ai-query chat-composer",
				children: [
					/* @__PURE__ */ (0, S.jsx)("span", {
						className: "query-icon",
						children: /* @__PURE__ */ (0, S.jsx)("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.7",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, S.jsx)("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
						})
					}),
					/* @__PURE__ */ (0, S.jsxs)("span", {
						className: "chat-composer-text",
						children: [/* @__PURE__ */ (0, S.jsx)("span", {
							className: "query-label",
							children: "You ask your agent"
						}), l ? /* @__PURE__ */ (0, S.jsx)("span", {
							className: "typing-query",
							children: U
						}, `draft-${r}`) : /* @__PURE__ */ (0, S.jsx)("span", {
							className: "chat-placeholder",
							children: "Ask a follow-up"
						})]
					}),
					/* @__PURE__ */ (0, S.jsx)("span", {
						className: "chat-composer-connectors",
						children: /* @__PURE__ */ (0, S.jsx)(s, {
							initial: !1,
							children: c.map((e) => /* @__PURE__ */ (0, S.jsx)(a.span, {
								layout: !0,
								initial: {
									opacity: 0,
									scale: .9
								},
								animate: {
									opacity: 1,
									scale: 1,
									transition: z
								},
								children: /* @__PURE__ */ (0, S.jsx)(K, { source: e })
							}, e === "deasy" ? "deasy" : e.id))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, S.jsxs)("div", {
				className: "retrieve-footer",
				children: [
					/* @__PURE__ */ (0, S.jsx)("button", {
						className: "button button-ghost",
						type: "button",
						onClick: n,
						children: "Back"
					}),
					/* @__PURE__ */ (0, S.jsx)("button", {
						className: "button button-ghost",
						type: "button",
						onClick: i,
						disabled: !t.done,
						children: "Replay"
					}),
					/* @__PURE__ */ (0, S.jsxs)("a", {
						className: "button button-primary with-arrow",
						href: "https://www.deasylabs.com/demo",
						"aria-label": "See it on your data",
						children: [/* @__PURE__ */ (0, S.jsx)("span", {
							className: "desktop-button-label",
							children: "See it on your data"
						}), /* @__PURE__ */ (0, S.jsx)("span", {
							className: "mobile-button-label",
							children: "See demo"
						})]
					})
				]
			})
		]
	});
}
function ge() {
	let [e, t] = (0, g.useState)(null), [n, r] = (0, g.useState)(0), [i, a] = (0, g.useState)(B[0]), [o, s] = (0, g.useState)(!1), c = he(), l = (0, g.useRef)(null), u = (0, g.useRef)(null), d = e ? w[e] : void 0, f = (0, g.useCallback)(() => {
		requestAnimationFrame(() => l.current?.focus());
	}, []), m = (e) => {
		n === 3 && c.stop(), r(e);
	}, h = (e) => {
		t(e), r(0), a(B[0]), f();
	};
	return /* @__PURE__ */ (0, S.jsx)(p, {
		reducedMotion: "user",
		children: /* @__PURE__ */ (0, S.jsxs)("section", {
			className: "wrap scan-section",
			id: "platform",
			children: [/* @__PURE__ */ (0, S.jsx)("div", {
				className: "scanner-toolbar",
				children: d ? /* @__PURE__ */ (0, S.jsxs)(S.Fragment, { children: [/* @__PURE__ */ (0, S.jsxs)("div", {
					className: "blade-tab selected-source-tab",
					children: [
						/* @__PURE__ */ (0, S.jsx)("span", { className: "tab-dot" }),
						d.name,
						/* @__PURE__ */ (0, S.jsxs)("span", {
							className: "selected-source-count",
							children: [
								"· ",
								d.count,
								" ",
								d.unit
							]
						})
					]
				}), /* @__PURE__ */ (0, S.jsxs)("button", {
					className: "source-switch",
					type: "button",
					onClick: () => {
						c.stop(), t(null), r(0), requestAnimationFrame(() => u.current?.querySelector("button")?.focus());
					},
					children: [/* @__PURE__ */ (0, S.jsx)("svg", {
						viewBox: "0 0 16 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.5",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, S.jsx)("path", { d: "M2.5 5.5h9l-2.5-2.5M13.5 10.5h-9l2.5 2.5" })
					}), "Change source"]
				})] }) : /* @__PURE__ */ (0, S.jsxs)("div", {
					className: "blade-tab",
					children: [/* @__PURE__ */ (0, S.jsx)("span", { className: "tab-dot" }), "Connect to a data source to see what your agent sees"]
				})
			}), /* @__PURE__ */ (0, S.jsx)("div", {
				className: `rig ${d ? "has-source" : ""}`,
				children: /* @__PURE__ */ (0, S.jsxs)("div", {
					className: "stage",
					children: [d ? null : /* @__PURE__ */ (0, S.jsxs)("div", {
						className: "source-column",
						children: [/* @__PURE__ */ (0, S.jsx)("div", {
							className: "column-label",
							children: "Your data source"
						}), /* @__PURE__ */ (0, S.jsx)("div", {
							className: "sources",
							ref: u,
							children: C.map((e) => /* @__PURE__ */ (0, S.jsx)(de, {
								source: e,
								onSelect: h
							}, e.id))
						})]
					}), /* @__PURE__ */ (0, S.jsx)("div", {
						className: `scanner ${o ? "hot" : ""}`,
						ref: l,
						tabIndex: d ? -1 : void 0,
						onDragOver: (e) => {
							e.preventDefault(), s(!0);
						},
						onDragLeave: () => s(!1),
						onDrop: (e) => {
							e.preventDefault(), s(!1);
							let t = e.dataTransfer.getData("text/plain");
							Object.hasOwn(w, t) && h(t);
						},
						children: d ? /* @__PURE__ */ (0, S.jsxs)("div", {
							className: "selected-report",
							children: [
								n === 0 ? /* @__PURE__ */ (0, S.jsx)(fe, {
									source: d,
									onNext: () => m(1)
								}) : null,
								n === 1 ? /* @__PURE__ */ (0, S.jsx)(pe, {
									source: d,
									onBack: () => m(0),
									onNext: () => m(2)
								}) : null,
								n === 2 ? /* @__PURE__ */ (0, S.jsx)(me, {
									source: d,
									openId: i,
									onOpen: a,
									onBack: () => m(1),
									onNext: () => m(3)
								}) : null,
								n === 3 ? /* @__PURE__ */ (0, S.jsx)(X, {
									source: d,
									script: c,
									onBack: () => m(2)
								}) : null
							]
						}, `${d.id}-${n}`) : /* @__PURE__ */ (0, S.jsxs)("div", {
							className: "drop-empty",
							children: [/* @__PURE__ */ (0, S.jsx)("span", {
								className: "drop-logo",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, S.jsxs)("p", { children: [/* @__PURE__ */ (0, S.jsx)("span", {
								className: "desktop-drop-hint",
								children: "Drag a source from the list to scan the files"
							}), /* @__PURE__ */ (0, S.jsx)("span", {
								className: "mobile-drop-hint",
								children: "Choose a source to scan its files"
							})] })]
						})
					})]
				})
			})]
		})
	});
}
//#endregion
//#region embeds/src/scanner.tsx
var _e = "\n.variant-shell { font-family: var(--sans); font-size: var(--body-size); line-height: var(--body-line-height); -webkit-font-smoothing: antialiased; }\n.variant-shell[data-color-mode='light'] { color-scheme: light; background: #fbf9f5; color: #24221e; }\n.variant-shell[data-color-mode='dark'] { color-scheme: dark; background: #211e1c; color: #f0ebe3; }\n.variant-shell[data-transparent] { background: transparent; }\n";
function Z({ colorMode: e = "dark", transparent: t = !1 }) {
	return /* @__PURE__ */ (0, S.jsx)("div", {
		className: "variant-shell",
		"data-brand-theme": "rust",
		"data-color-mode": e,
		"data-theme": "deasy",
		"data-transparent": t || void 0,
		children: /* @__PURE__ */ (0, S.jsx)("main", {
			className: "scanner-gunmetal",
			children: /* @__PURE__ */ (0, S.jsx)(ge, {})
		})
	});
}
function Q(e, t = {}) {
	let n = t, r = i(e, "scanner", [
		f,
		l,
		u,
		_e
	], /* @__PURE__ */ (0, S.jsx)(Z, { ...n }), t);
	return {
		update: (e) => {
			n = {
				...n,
				...e
			}, r.update(/* @__PURE__ */ (0, S.jsx)(Z, { ...n }));
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
function ve(e = "deasy-scanner") {
	o(e, ["color-mode", "transparent"], (e) => Q(e, $(e)), (e, t) => t.update($(e)));
}
//#endregion
export { Q as n, ve as t };
