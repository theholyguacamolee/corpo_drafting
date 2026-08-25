import React, { Suspense, lazy, useState } from 'react';
import HomeLanding from './HomeLanding';
import type { DocumentEntry } from './documentRegistry';

// Each module is code-split so its bundle (and, for the amendment
// module, its scoped CSS) only loads once someone actually opens it.
const CorpoApp = lazy(() => import('./modules/corpo/CorpoApp'));
const AmendmentApp = lazy(() => import('./modules/amendment/AmendmentApp'));

type Route =
  | { view: 'home' }
  | { view: 'corpo'; target: string }
  | { view: 'amendment'; target: string };

export default function App() {
  const [route, setRoute] = useState<Route>({ view: 'home' });

  function openDocument(doc: DocumentEntry) {
    setRoute({ view: doc.module, target: doc.target } as Route);
  }

  function goHome() {
    setRoute({ view: 'home' });
  }

  if (route.view === 'home') {
    return <HomeLanding onOpenDocument={openDocument} />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {route.view === 'corpo' && (
        <CorpoApp initialDocType={route.target as any} onHome={goHome} key={route.target} />
      )}
      {route.view === 'amendment' && (
        <AmendmentApp initialView={route.target as any} onHome={goHome} key={route.target} />
      )}
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-400 text-sm">
      Loading…
    </div>
  );
}
