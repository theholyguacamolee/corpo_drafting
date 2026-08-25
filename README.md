# STLAF | Drafting Suite

A single website that merges your two drafting tools behind one search-driven
landing page:

- **Contracts** — Special Power of Attorney, Secretary's Certificate
  (Standard / No Intra-Corporate Dispute), Articles of Amendment
  (Corporation & Partnership)
- **Proposals** — Incorporation Contract Proposal

## What's new vs. the two original apps

- **Landing page** (`src/HomeLanding.tsx`): centered search bar with a
  live, scrollable recommendations dropdown, plus a category grid below it
  ("Contracts", "Proposals", ...). Categories and their sub-contents come
  from one flexible catalog file — see below.
- **One catalog to extend later** (`src/documentRegistry.ts`): every
  searchable/browsable document is one entry `{ id, title, description,
  category, subCategory, module, target }`. To add a new document type in
  the future, add one entry here — the search bar and category grid pick
  it up automatically. No other UI code needs to change.
- **Both original tools kept intact** as lazy-loaded modules:
  - `src/modules/corpo/` — your `corpo-drafting` app (SPA / SEC / Proposal),
    almost untouched. It now accepts `initialDocType` + `onHome` props so
    the landing page can jump straight into a specific document.
  - `src/modules/amendment/` — your `amendmentGenerator` app (Articles of
    Amendment), also almost untouched, with its dark-theme CSS scoped
    under `.amendment-scope` so it can't leak into the new white UI.
    Accepts `initialView` + `onHome` props the same way.
- **AI unified on Gemini**: all three AI endpoints (`/api/refine`,
  `/api/extract`, `/api/extract-amendment`) now call Gemini directly, so you
  only need one `GEMINI_API_KEY`. The Groq dependency was removed.
- **STLAF logo** applied across the favicon, navbar, and landing hero.

## Setup

```bash
npm install
cp .env.example .env
# then edit .env and set:
# GEMINI_API_KEY=your-key-here
npm run dev
```

Open http://localhost:3000.

## Build for production

```bash
npm run build
npm run start   # or: NODE_ENV=production node --loader tsx server.ts
```

This project also ships `api/index.ts` (a Vercel-style serverless entry
mirroring the same three endpoints) and `vercel.json`, so it can deploy to
Vercel the same way the original two apps did.

## Adding a new document later

1. Build its generator UI as a new module under `src/modules/<name>/`
   (or add a new document type inside an existing module, the way `corpo`
   already handles four document types).
2. Add one entry to `DOCUMENT_CATALOG` in `src/documentRegistry.ts` with a
   `category` (existing or new — new categories appear automatically on the
   landing page), a `module`, and a `target` value that module knows how to
   open directly.
3. Nothing else changes — search and the category grid are data-driven.

## Notes

- The amendment module's baseline-extraction endpoint was moved from
  `/api/extract` to `/api/extract-amendment` to avoid colliding with the
  corpo module's Secretary's Certificate extraction, which also uses
  `/api/extract`.
- `src/modules/corpo` uses the `@` import alias; new shell-level files use
  `@app`. See `vite.config.ts` / `tsconfig.json` if you rename folders.
