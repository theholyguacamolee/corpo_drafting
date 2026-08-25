/**
 * Central catalog of every document generator in the suite.
 *
 * This is the single source of truth for the landing page search bar,
 * the "browse by category" grid, and the routing between templates.
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
  /** Top-level category shown on the landing page (e.g. "SEC", "Proposals", "SPA", "Amendments"). */
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
  // ───────────────── SEC ─────────────────
  {
    id: 'sec-cert-standard',
    title: 'SEC Certificate (Standard)',
    description: 'Drafting tool for standard SEC Certificates and documentation',
    category: 'SEC',
    module: 'corpo',
    target: 'sec',
    keywords: ['sec', 'secretary', 'certificate', 'standard', 'board resolution'],
  },
  {
    id: 'sec-cert-no-dispute',
    title: 'SEC Certificate (No Dispute)',
    description: 'Form for Certification of No Intra-Corporate Dispute',
    category: 'SEC',
    module: 'corpo',
    target: 'sec_dispute',
    keywords: ['sec', 'secretary', 'certificate', 'dispute', 'intra-corporate', 'no dispute'],
  },

  // ───────────────── Proposals ─────────────────
  {
    id: 'incorporation-proposal',
    title: 'Incorporation Contract',
    description: 'Contract Proposal for Incorporation with custom billing options',
    category: 'Proposals',
    module: 'corpo',
    target: 'proposal',
    keywords: ['proposal', 'incorporation', 'contract', 'billing', 'fees', 'engagement'],
  },

  // ───────────────── SPA ─────────────────
  {
    id: 'spa',
    title: 'SPA Draft',
    description: 'Special Power of Attorney drafting tailored for STLAF matters',
    category: 'SPA',
    module: 'corpo',
    target: 'spa',
    keywords: ['spa', 'draft', 'power of attorney', 'bir', 'lgu', 'sss', 'philhealth', 'pag-ibig'],
  },

  // ───────────────── Amendments ─────────────────
  {
    id: 'aoi-corporate',
    title: 'Corporate AOI',
    description:
      'Amended Articles of Incorporation drafting tailored for STLAF matters. Features AI-powered extraction.',
    category: 'Amendments',
    module: 'amendment',
    target: 'corporate',
    keywords: ['aoi', 'corporate', 'amended articles of incorporation', 'amendment', 'sec', 'ammendments'],
  },
  {
    id: 'aoi-partnership',
    title: 'Partnership AOP',
    description:
      'Drafting tool for Partnership businesses. Standard SEC compliant documentation.',
    category: 'Amendments',
    module: 'amendment',
    target: 'partnership',
    keywords: ['aop', 'partnership', 'articles of partnership', 'amendment', 'sec', 'ammendments'],
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
