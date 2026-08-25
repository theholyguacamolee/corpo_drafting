import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

interface GlobalHeaderProps {
  title?: string;
  subtitle?: string;
  onHome?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

export function GlobalHeader({
  title,
  subtitle = 'Document Drafting Suite',
  onHome,
  onBack,
  backLabel = 'Other Templates',
}: GlobalHeaderProps) {
  return (
    <header className="w-full bg-[#1c2e4a] sticky top-0 z-50 no-print h-14 flex items-center">
      <div className="w-full pl-16 pr-16 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={onHome}
        >
          <img
            src="/stlaf-logo.png"
            alt="STLAF Logo"
            className="h-8 w-auto object-contain"
          />
          <div className="h-5 w-px bg-white/20 hidden sm:block" />
          <div className="hidden sm:flex flex-col">
            <span className="text-[11px] font-extrabold tracking-widest text-white uppercase leading-tight">
              {title || 'STLAF Drafting Suite'}
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#cb9a20] uppercase leading-tight mt-0.5">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Right: Nav buttons */}
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <ArrowLeft size={13} />
              <span>{backLabel}</span>
            </button>
          )}
          {onHome && (
            <button
              onClick={onHome}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <Home size={13} className="text-[#cb9a20]" />
              <span>All Documents</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default GlobalHeader;
