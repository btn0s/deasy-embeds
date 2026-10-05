/** What the pile can say about a file: the four problems, or nothing wrong. */
export type FileKind = 'dup' | 'old' | 'sen' | 'sta' | 'keep'

export type Tag = readonly [key: string, value: string]

export type KeptDoc = { name: string; tags: readonly Tag[] }

/* The first kept file is always the refund policy, because that is the
   document the agent ends up citing in Retrieve. */
export const keptDocs: readonly KeptDoc[] = [
  {
    name: 'Enterprise_Refund_Policy.pdf',
    tags: [['type', 'policy'], ['updated', 'Aug 2026'], ['owner', 'Legal'], ['region', 'EU'], ['PII', 'none'], ['version', 'current']],
  },
  {
    name: 'Pricing_Sheet_Q3.xlsx',
    tags: [['type', 'pricing'], ['updated', 'Jul 2026'], ['owner', 'Finance'], ['region', 'Global'], ['PII', 'none'], ['version', 'current']],
  },
  {
    name: 'Security_Overview.pdf',
    tags: [['type', 'security'], ['updated', 'Jun 2026'], ['owner', 'IT'], ['region', 'Global'], ['PII', 'none'], ['version', 'v4']],
  },
  {
    name: 'MSA_Template.docx',
    tags: [['type', 'contract'], ['updated', 'Apr 2026'], ['owner', 'Legal'], ['region', 'US'], ['PII', 'none'], ['version', 'v7']],
  },
  {
    name: 'Support_Runbook.md',
    tags: [['type', 'runbook'], ['updated', 'Aug 2026'], ['owner', 'Support'], ['region', 'Global'], ['PII', 'none'], ['version', 'current']],
  },
  {
    name: 'Data_Retention_Policy.pdf',
    tags: [['type', 'policy'], ['updated', 'Aug 2026'], ['owner', 'Legal'], ['region', 'Global'], ['PII', 'none'], ['version', 'current']],
  },
]

const bases = ['Refund_Policy', 'Pricing_Sheet', 'Security_Overview', 'Onboarding_Guide', 'Vendor_Contract', 'Travel_Policy', 'Roadmap', 'Incident_Review']
const sensitive = ['payroll_export_2024.csv', 'customer_emails.xlsx', 'offer_letter_JSmith.pdf', 'passport_scan.pdf', 'vendor_bank_details.xlsx']

const reasons: Record<Exclude<FileKind, 'keep'>, string> = {
  dup: 'Duplicate',
  old: 'Superseded',
  sen: 'Personal data',
  sta: 'Untouched since 2019',
}

/** What hovering a file in the pile says about it. `kind` null means the
    scan found nothing wrong with it. */
export function describeFile(id: number, kind: FileKind | null, keptIndex = 0): { name: string; reason: string } {
  const base = bases[id % bases.length]
  switch (kind) {
    case 'dup':
      return { name: `${base} (copy ${2 + (id % 3)}).pdf`, reason: reasons.dup }
    case 'old':
      return { name: `${base}_v${1 + (id % 3)}_OLD.docx`, reason: reasons.old }
    case 'sen':
      return { name: sensitive[id % sensitive.length], reason: reasons.sen }
    case 'sta':
      return { name: `${base}_2019.pptx`, reason: reasons.sta }
    case 'keep':
      return { name: keptDocs[keptIndex % keptDocs.length].name, reason: 'Kept' }
    default:
      return { name: `${base}.pdf`, reason: 'No issues found' }
  }
}
