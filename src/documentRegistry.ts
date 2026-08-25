/**
 * Central catalog of every document generator in the suite.
 *
 * This is the single source of truth for the landing page search bar,
 * the "browse by category" grid, and the routing between modules.
 *
 * To add a new document later: add one entry here and point it at the
 * module + target that should open. Nothing else needs to change on the
 * landing page — search and category browsing pick it up automatically.
 */

export type ModuleId = 'corpo' | 'amendment';

export interface DocumentEntry {
  id: string;
  title: string;
  description: string;
  /** Top-level category shown on the landing page (e.g. "Contracts"). */
  category: string;
  /** Optional sub-content grouping within a category. */
  subCategory?: string;
  /** Which app module renders this document. */
  module: ModuleId;
  /** Value passed to the module so it opens directly on this document. */
  target: string;
  /** Extra keywords to widen search matching beyond the title/description. */
  keywords?: string[];
}

export const DOCUMENT_CATALOG: DocumentEntry[] = [
  // ───────────────── Contracts ─────────────────
  {
    id: 'aoi-corporate',
    title: 'Articles of Amendment — Corporation',
    description:
      'Amend the Articles of Incorporation for a corporation, with AI-assisted extraction from an existing AOI.',
    category: 'Contracts',
    subCategory: 'Articles of Amendment',
    module: 'amendment',
    target: 'corporate',
    keywords: ['aoi', 'incorporation', 'corporate', 'sec', 'amendment'],
  },
  {
    id: 'aoi-partnership',
    title: 'Articles of Amendment — Partnership',
    description:
      'Amend the Articles of Partnership, with AI-assisted extraction from an existing AOP.',
    category: 'Contracts',
    subCategory: 'Articles of Amendment',
    module: 'amendment',
    target: 'partnership',
    keywords: ['aop', 'partnership', 'sec', 'amendment'],
  },
  {
    id: 'spa',
    title: 'Special Power of Attorney (SPA)',
    description:
      'Draft an SPA for BIR, LGU, SSS, PhilHealth, or Pag-IBIG transactions, with AI-refined purpose clauses.',
    category: 'Contracts',
    subCategory: 'Special Power of Attorney',
    module: 'corpo',
    target: 'spa',
    keywords: ['spa', 'power of attorney', 'bir', 'lgu', 'sss', 'philhealth', 'pag-ibig'],
  },
  {
    id: 'sec-cert-standard',
    title: "Secretary's Certificate (Standard)",
    description: 'Standard Secretary\'s Certificate with board resolution clauses.',
    category: 'Contracts',
    subCategory: "Secretary's Certificate",
    module: 'corpo',
    target: 'sec',
    keywords: ['secretary', 'certificate', 'board resolution', 'sec'],
  },
  {
    id: 'sec-cert-no-dispute',
    title: "Secretary's Certificate (No Intra-Corporate Dispute)",
    description: 'Certification of no intra-corporate dispute for SEC filing purposes.',
    category: 'Contracts',
    subCategory: "Secretary's Certificate",
    module: 'corpo',
    target: 'sec_dispute',
    keywords: ['secretary', 'certificate', 'dispute', 'sec'],
  },

  // ───────────────── Proposals ─────────────────
  {
    id: 'incorporation-proposal',
    title: 'Incorporation Contract Proposal',
    description:
      'Client-facing service proposal for incorporation engagements, with custom phases, fees, and discounts.',
    category: 'Proposals',
    subCategory: 'Incorporation',
    module: 'corpo',
    target: 'proposal',
    keywords: ['proposal', 'billing', 'fees', 'engagement', 'quotation'],
  },
];

export const CATEGORIES: string[] = Array.from(
  new Set(DOCUMENT_CATALOG.map((d) => d.category))
);

export function searchDocuments(query: string): DocumentEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return DOCUMENT_CATALOG.filter((doc) => {
    const haystack = [
      doc.title,
      doc.description,
      doc.category,
      doc.subCategory ?? '',
      ...(doc.keywords ?? []),
    ]
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).every((term) => haystack.includes(term));
  });
}

export function documentsByCategory(category: string): DocumentEntry[] {
  return DOCUMENT_CATALOG.filter((d) => d.category === category);
}
