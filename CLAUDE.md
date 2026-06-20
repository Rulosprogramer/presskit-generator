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

**File mix**: Most components are `.jsx`; entry point and lib utilities use `.tsx`/`.ts`. Both coexist without issue. `src/lib/firebase.js` and `src/lib/firebase.ts` both exist — `.js` is the authoritative one used by the app; `.ts` is a stub.

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
- **[src/components/post-login/livePreview.jsx](src/components/post-login/livePreview.jsx)** — right-column live preview; renders `PresskitWeb` ("preview para la web") and `HTMLPreview` ("preview para descargar")
- **[src/components/post-login/PresskitWeb.jsx](src/components/post-login/PresskitWeb.jsx)** — full web EPK render, shared between the live preview and the public `/presskit/:id` page
- **[src/components/preview/HTMLPreview.jsx](src/components/preview/HTMLPreview.jsx)** — the "pdfhtml" HTML mock of the PDF shown inside the editor as the downloadable preview. When the user says "PDF", this must be kept in sync alongside the real react-pdf document.
- **[src/components/post-login/Sidebar.jsx](src/components/post-login/Sidebar.jsx)** / **[Topbar.jsx](src/components/post-login/Topbar.jsx)** — editor shell chrome
- **[src/components/post-login/PublishModal.jsx](src/components/post-login/PublishModal.jsx)** — handles publish/unpublish flow

**Auto-save**: 1200ms debounce on every `presskitData` change writes to Firestore. A 250ms debounce also writes a compact draft (remote URLs only, no blobs) to `localStorage` keyed by `presskit_local_draft_{uid}`. On load, localStorage is hydrated first, then overwritten by Firestore.

### PDF generation

There are **two PDF renderers and you must keep them in sync** — whenever the user says "PDF", changes apply to both:
1. **[src/components/preview/HTMLPreview.jsx](src/components/preview/HTMLPreview.jsx)** ("pdfhtml") — an HTML/CSS mock of the PDF shown live inside the editor (the "preview para descargar"). Full CSS support.
2. **[src/pages/PresskitPDF.jsx](src/pages/PresskitPDF.jsx)** (lazy-loaded `/presskitPDF`) — the real downloadable PDF, renders [src/components/pdfx/PresskitPdfDocument.jsx](src/components/pdfx/PresskitPdfDocument.jsx) via `@react-pdf/renderer`. Limited styling (no text-shadow/stroke). Theme tokens in [src/lib/pdfx-theme.ts](src/lib/pdfx-theme.ts).

The real PDF is cached by a versioned `blobKey` in `PresskitPDF.jsx`; bump its prefix (e.g. `v11-…` → `v12-…`) after any layout/style change to force regeneration. There is **no** `PDFPreview.jsx` (removed — it was a dead, unused react-pdf BlobProvider component).

### AI features

[src/lib/aiBio.js](src/lib/aiBio.js) exports two functions:
- `generateBioSectionWithAI` — generates twitterBio (140 chars), shortBio, longBio, or releaseCta
- `generateArtistMilestoneWithAI` — "upcycles" a raw milestone fact into a punchy EPK phrase

Both call Gemini 2.5 Flash with up to 4 retries using exponential backoff. The modals [src/components/BiographyAIModal.jsx](src/components/BiographyAIModal.jsx) and [src/components/MilestoneAIModal.jsx](src/components/MilestoneAIModal.jsx) support a chat-like interface for custom prompts.

### Firestore rules

Presskits are owner-only read/write. Public presskit pages (`/presskit/:id`) read via `onSnapshot` in [src/pages/PublicPresskit.jsx](src/pages/PublicPresskit.jsx) — note that the Firestore rules require auth for reads, so the public page must either be opened by the owner or the rules must allow public reads for published presskits. Check [firestore.rules](firestore.rules) before changing publish logic.

### Premium access

A premium-email whitelist gives full access (clean PDF download, no protected view, publish/share). It is enforced in **two places that must stay in sync**:
- **Client**: [src/lib/premiumAccess.js](src/lib/premiumAccess.js) `isPremiumWhitelisted(email)` — used in [src/pages/PresskitPDF.jsx](src/pages/PresskitPDF.jsx) to force `hasCleanDownloadAccess` and skip the protected-view listeners.
- **Rules**: `premiumEmails()` in [firestore.rules](firestore.rules) — non-premium owners cannot set the premium flags (`downloadUnlocked`/`subscriptionActive`/`paymentStatus='paid'`); only whitelisted users (or the payment gateway via Admin SDK, which bypasses rules) can. Add new premium emails to **both** lists.

### Payments (Mercado Pago)

Mercado Pago with two billing modes — one-time **Checkout Pro** (preference) and annual **subscription** (preapproval). Single premium: $4.99 once (incl. 20-day public link) / $14.99 annual. Backend in **Vercel Serverless Functions** under `api/`:
- [api/checkout.js](api/checkout.js) — `POST /api/checkout` creates a preference (`billing:'once'`) or preapproval (`billing:'annual'`) and returns its `init_point` URL. Amounts/currency from env (`MP_PRICE_ONCE`, `MP_PRICE_ANNUAL`, `MP_CURRENCY`). Called from [src/pages/Checkout.jsx](src/pages/Checkout.jsx) `startCheckout`.
- [api/mp-webhook.js](api/mp-webhook.js) — `/api/mp-webhook` fetches the notified payment/preapproval and, via the Admin SDK ([api/_firebaseAdmin.js](api/_firebaseAdmin.js)), writes premium flags to `presskits/{uid}`. One-time → `downloadUnlocked`, `paymentStatus='paid'`, **`publicLinkExpiresAt` = now+20 days**. Subscription authorized → `subscriptionActive=true`. This bypasses Firestore rules (flags owner-locked client-side).

**20-day public link**: one-time buyers get a `publicLinkExpiresAt` Timestamp. [src/pages/PublicPresskit.jsx](src/pages/PublicPresskit.jsx) hides the page (shows "enlace expirado") when `publicLinkExpiresAt` is past AND no active subscription. Missing field = no expiry (legacy/free published unaffected).

`back_urls`/success return to `/presskitPDF`; that page's `onSnapshot` picks up the flags and unlocks. The SPA rewrite in [vercel.json](vercel.json) excludes `/api`. Env vars in [.env.example](.env.example); register the webhook URL (`/api/mp-webhook`) in the Mercado Pago dashboard. Functions run only on Vercel (or `vercel dev`), not under `npm run dev`.

## Key conventions

- Gallery slot mapping is defined in two places — `gallerySlotToIndex` in CreatePresskit and `galleryPhotoSlots` in Stepform — keep them in sync.
- `compactDraftForLocal` strips non-remote-URL strings before writing to localStorage to avoid quota errors from base64 blobs.
- `normalizeArtistMilestones` (called on load) enforces the `{ digital, live, press, collaborations }` shape and trims each array to 3 items; `ensureArtistMilestonesShape` (called on mutation) does a softer enforcement without filtering empty strings.
