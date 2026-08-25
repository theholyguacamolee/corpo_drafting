import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 no-print h-14 flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl w-full mx-auto px-5 sm:px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={onHome}
        >
          <img
            src="/stlaf-logo.png"
            alt="STLAF Logo"
            className="h-8 w-auto object-contain"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-[11px] font-bold tracking-widest text-[#123765] uppercase leading-tight">
              {title || 'STLAF Drafting Suite'}
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase leading-tight">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="h-8 px-3 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 gap-1.5 text-xs font-semibold uppercase tracking-wider rounded-md"
            >
              <ArrowLeft size={13} />
              <span>{backLabel}</span>
            </Button>
          )}
          {onHome && (
            <Button
              variant="outline"
              size="sm"
              onClick={onHome}
              className="h-8 px-3 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 gap-1.5 text-xs font-semibold uppercase tracking-wider rounded-md"
            >
              <Home size={13} />
              <span>All Documents</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default GlobalHeader;
