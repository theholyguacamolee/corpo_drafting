import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, FileText, ChevronRight, X } from 'lucide-react';
import {
  DOCUMENT_CATALOG,
  CATEGORIES,
  documentsByCategory,
  searchDocuments,
  type DocumentEntry,
} from './documentRegistry';

interface HomeLandingProps {
  onOpenDocument: (doc: DocumentEntry) => void;
}

export default function HomeLanding({ onOpenDocument }: HomeLandingProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchDocuments(query), [query]);
  const showDropdown = isFocused && query.trim().length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Top bar */}
      <header className="w-full border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <img src="/stlaf-logo.png" alt="STLAF" className="h-10 w-auto object-contain" />
          <div className="hidden sm:block">
            <div className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
              Document Drafting Suite
            </div>
          </div>
        </div>
      </header>

      {/* Hero / search */}
      <main className="flex-1 flex flex-col items-center px-6">
        <div className="w-full max-w-2xl mt-16 sm:mt-24 text-center">
          <img
            src="/stlaf-logo.png"
            alt="Sadsad Tamesis Legal and Accountancy Firm"
            className="h-24 sm:h-28 w-auto object-contain mx-auto mb-6"
          />
          <p className="text-slate-500 text-sm sm:text-base mb-8">
            Search for a document to draft, or browse by category below.
          </p>

          <div ref={containerRef} className="relative w-full">
            <div
              className={`flex items-center gap-3 w-full bg-white border rounded-full px-5 py-3.5 shadow-sm transition-shadow ${
                isFocused ? 'border-[#ccaa49] shadow-md' : 'border-slate-200'
              }`}
            >
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search documents e.g. “SPA”, “proposal”, “articles of amendment”…"
                className="flex-1 outline-none text-sm sm:text-base text-slate-800 placeholder:text-slate-400 bg-transparent"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-slate-300 hover:text-slate-500 shrink-0"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Recommendations dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto text-left z-30">
                {results.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-400 text-center">
                    No documents match “{query}”.
                  </div>
                ) : (
                  results.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onOpenDocument(doc)}
                      className="w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-slate-50 border-b border-slate-50 last:border-b-0"
                    >
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#123765]/5 text-[#123765] flex items-center justify-center shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">
                          {doc.title}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {doc.category}
                          {doc.subCategory ? ` · ${doc.subCategory}` : ''}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category browse */}
        <div className="w-full max-w-5xl mt-16 mb-20">
          {CATEGORIES.map((category) => (
            <CategorySection
              key={category}
              category={category}
              documents={documentsByCategory(category)}
              onOpenDocument={onOpenDocument}
            />
          ))}
        </div>
      </main>

      <footer className="w-full border-t border-slate-100 py-6 text-center text-[11px] tracking-wide text-slate-400">
        Sadsad Tamesis Legal and Accountancy Firm
      </footer>
    </div>
  );
}

function CategorySection({
  category,
  documents,
  onOpenDocument,
}: {
  category: string;
  documents: DocumentEntry[];
  onOpenDocument: (doc: DocumentEntry) => void;
}) {
  // Group by sub-category for display, keeping things flexible: documents
  // without a subCategory just render directly under the category.
  const groups = useMemo(() => {
    const map = new Map<string, DocumentEntry[]>();
    for (const doc of documents) {
      const key = doc.subCategory ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(doc);
    }
    return map;
  }, [documents]);

  return (
    <section className="mb-12">
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#123765] mb-4 flex items-center gap-2">
        <span className="w-6 h-[2px] bg-[#ccaa49] inline-block" />
        {category}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...groups.entries()].map(([sub, docs]) =>
          docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => onOpenDocument(doc)}
              className="group text-left p-5 bg-white border border-slate-100 rounded-xl hover:border-[#ccaa49] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                {sub ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {sub}
                  </span>
                ) : (
                  <span />
                )}
                <ChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-[#ccaa49] group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <div className="text-sm font-semibold text-slate-800 mb-1">{doc.title}</div>
              <div className="text-xs text-slate-500 line-clamp-2">{doc.description}</div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

// Kept for reference/future flexibility: full catalog is exported from
// documentRegistry.ts and consumed above.
export { DOCUMENT_CATALOG };
