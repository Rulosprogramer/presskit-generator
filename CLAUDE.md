# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start local dev server (Vite)
npm run build     # TypeScript check + production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

There is no test suite.

## Environment

Copy `.env` and set `VITE_GEMINI_API_KEY` with a Gemini API key to enable AI biography and milestone generation. Firebase config is hardcoded in [src/lib/firebase.js](src/lib/firebase.js) (standard practice for Firebase client keys).

## Architecture

**Stack**: React 19 + Vite, Firebase (Auth/Firestore/Storage), Tailwind CSS v4, Google Gemini AI (`@google/generative-ai`), `@react-pdf/renderer` + pdfx for PDF.

**Routing**: Manual SPA routing via `window.location.pathname` in [src/App.tsx](src/App.tsx) — no React Router. Routes: `/` (landing), `/auth`, `/dashboard`, `/createPresskit`, `/checkout`, `/presskitPDF` (lazy-loaded), `/presskit/:id` (public, unauthenticated).

**File mix**: Most components are `.jsx`; entry point and lib utilities use `.tsx`/`.ts`. Both coexist without issue.

### Data model

Each user has exactly one presskit stored at `presskits/{userId}` in Firestore. The document shape is defined by `initialPresskitData` in [src/pages/CreatePresskit.jsx](src/pages/CreatePresskit.jsx). Key fields:

- `images[]` — indexed array: `[0]` = cover, `[1]` = hero, `[2]` = landscape (unused slot), `[3]` = liveAct, `[4]` = concept
- `artistMilestones` — `{ digital[], live[], press[], collaborations[] }`, max 3 items each
- `releases[]` — max 8 releases
- `pressArticles[]` — max 3 press article images
- `theme` — one of `neon | neutral | dark | minimal` (see [src/lib/themeColors.js](src/lib/themeColors.js))
- `typeface` — options from [src/lib/typefaces.js](src/lib/typefaces.js)
- `status` — `draft | published`; published presskits get a `publishedUrl` of `/presskit/{uid}`

Images upload to Firebase Storage at `presskits/{userId}/{folder}/`. The image library subcollection lives at `users/{userId}/imageLibrary/{imageId}`.

### Editor flow

[src/pages/CreatePresskit.jsx](src/pages/CreatePresskit.jsx) owns all state and handles Firestore/Storage I/O. It passes everything down as props to:

- **[src/components/post-login/Stepform.jsx](src/components/post-login/Stepform.jsx)** — 13-step form (Portada → Tipografía → Preview), renders one card per step, all handlers come from CreatePresskit
- **[src/components/post-login/livePreview.jsx](src/components/post-login/livePreview.jsx)** — mini live preview in the right column
- **[src/components/post-login/PresskitWeb.jsx](src/components/post-login/PresskitWeb.jsx)** — full web EPK render, shared between the live preview and the public `/presskit/:id` page

**Auto-save**: 1200ms debounce on every `presskitData` change writes to Firestore. A 250ms debounce also writes a compact draft (remote URLs only, no blobs) to `localStorage` keyed by `presskit_local_draft_{uid}`. On load, localStorage is hydrated first, then overwritten by Firestore.

### PDF generation

[src/pages/PresskitPDF.jsx](src/pages/PresskitPDF.jsx) is lazy-loaded. It renders [src/components/pdfx/PresskitPdfDocument.jsx](src/components/pdfx/PresskitPdfDocument.jsx) using `@react-pdf/renderer`. Theme tokens for the PDF are in [src/lib/pdfx-theme.ts](src/lib/pdfx-theme.ts) and context in [src/lib/pdfx-theme-context.tsx](src/lib/pdfx-theme-context.tsx).

### AI features

[src/lib/aiBio.js](src/lib/aiBio.js) exports two functions:
- `generateBioSectionWithAI` — generates twitterBio (140 chars), shortBio, longBio, or releaseCta
- `generateArtistMilestoneWithAI` — "upcycles" a raw milestone fact into a punchy EPK phrase

Both call Gemini 2.5 Flash with up to 4 retries using exponential backoff. The modals [src/components/BiographyAIModal.jsx](src/components/BiographyAIModal.jsx) and [src/components/MilestoneAIModal.jsx](src/components/MilestoneAIModal.jsx) support a chat-like interface for custom prompts.

### Firestore rules

Presskits are owner-only read/write. Public presskit pages (`/presskit/:id`) read via `onSnapshot` in [src/pages/PublicPresskit.jsx](src/pages/PublicPresskit.jsx) — note that the Firestore rules require auth for reads, so the public page must either be opened by the owner or the rules must allow public reads for published presskits. Check [firestore.rules](firestore.rules) before changing publish logic.

## Key conventions

- Gallery slot mapping is defined in two places — `gallerySlotToIndex` in CreatePresskit and `galleryPhotoSlots` in Stepform — keep them in sync.
- `compactDraftForLocal` strips non-remote-URL strings before writing to localStorage to avoid quota errors from base64 blobs.
- `normalizeArtistMilestones` (called on load) enforces the `{ digital, live, press, collaborations }` shape and trims each array to 3 items; `ensureArtistMilestonesShape` (called on mutation) does a softer enforcement without filtering empty strings.
