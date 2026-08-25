import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, ChevronRight, Sparkles } from 'lucide-react';
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

function getIsAi(doc: DocumentEntry) {
  return doc.id === 'aoi-corporate';
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
          <header className="w-full bg-[#1c2e4a] sticky top-0 z-40">
            <div className="w-full pl-16 pr-16 h-14 flex items-center gap-3">
              <img src="/stlaf-logo.png" alt="STLAF" className="h-8 w-auto object-contain" />
              <div className="h-5 w-px bg-white/20 hidden sm:block" />
              <div className="hidden sm:block">
                <span className="text-[11px] font-bold tracking-widest text-white uppercase block leading-none">
                  Sadsad Tamesis Legal &amp; Accountancy Firm
                </span>
                <span className="text-[9px] font-semibold tracking-widest text-[#cb9a20] uppercase block mt-0.5">
                  Document Drafting Suite
                </span>
              </div>
            </div>
          </header>

      <main className="flex-1 flex flex-col items-center px-5 sm:px-8">
        {/* Hero */}
        <div className="w-full max-w-2xl mt-12 sm:mt-16 text-center mb-10">
          <img
            src="/stlaf-logo.png"
            alt="Sadsad Tamesis Legal and Accountancy Firm"
            className="h-28 w-auto object-contain mx-auto mb-5"
          />
          <p className="text-slate-500 text-sm mb-7">
            Select a document template to start drafting.
          </p>

          {/* Search */}
          <div ref={containerRef} className="relative w-full">
            <div
              className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 transition-all ${
                isFocused
                  ? 'border-[#cb9a20] ring-2 ring-[#cb9a20]/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Search size={17} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder='Search e.g. "SPA", "SEC Certificate", "Amendments"…'
                className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 bg-transparent"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-600 shrink-0"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto text-left z-30">
                {results.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-400 text-center">
                    No documents found for "{query}".
                  </div>
                ) : (
                  results.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => onOpenDocument(doc)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{doc.title}</div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">{doc.category}</div>
                      </div>
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-[#cb9a20] shrink-0 transition-colors" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="w-full max-w-5xl mb-16 space-y-10">
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

      <footer className="w-full border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-400">
        Sadsad Tamesis Legal and Accountancy Firm · Internal Drafting System
      </footer>
    </div>
  );
}

function CategorySection({
  category,
  documents,
  onOpenDocument,
}: {
  key?: string;
  category: string;
  documents: DocumentEntry[];
  onOpenDocument: (doc: DocumentEntry) => void;
}) {
  return (
    <section>
      {/* Category Label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1 h-5 rounded-full bg-[#cb9a20] inline-block shrink-0" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#1c2e4a]">
          {category}
        </h2>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onOpenDocument(doc)}
            className="group text-left bg-white border border-slate-200 hover:border-[#1c2e4a] rounded-xl p-5 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-800 group-hover:text-[#1c2e4a] transition-colors leading-snug">
                {doc.title}
              </span>
              {getIsAi(doc) && (
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#cb9a20]/10 text-[#9a7210] border border-[#cb9a20]/20">
                  <Sparkles size={10} />
                  AI
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{doc.description}</p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#cb9a20] opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export { DOCUMENT_CATALOG };
