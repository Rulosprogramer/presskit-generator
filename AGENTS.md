# AGENTS.md

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build && node scripts/prerender.mjs
npm run lint      # ESLint (all files)
npm run preview   # vite preview
```

`npm run build` includes an SSG prerender step — `scripts/prerender.mjs` generates `dist/about/`, `dist/privacidad/`, `dist/terminos/index.html` from the SPA shell.

No test suite.

## Routing & codebase

- **Manual SPA routing** via `window.location.pathname` in `src/App.tsx` — no React Router.
- **File split**: components are `.jsx`, lib utilities are `.tsx`/`.ts`. Both coexist.
- `src/lib/firebase.js` is authoritative; `src/lib/firebase.ts` is a stub. Firebase config is hardcoded in the `.js` file.
- Buffer polyfill in `src/main.tsx:8` — required by Firebase, sets `globalThis.Buffer`.

## Architecture — things you will get wrong without this

### Two PDF renderers, must stay in sync
Whenever editing PDF layout/style, update **both**:
1. `src/components/preview/HTMLPreview.jsx` — HTML/CSS mock shown in editor ("preview para descargar")
2. `src/components/pdfx/PresskitPdfDocument.jsx` — real `@react-pdf/renderer` document (rendered at `/presskitPDF`)
- After any change, bump the `blobKey` prefix in `src/pages/PresskitPDF.jsx` (e.g. `v11-` → `v12-`) to bust the cache.

### Premium whitelist — two places, keep in sync
- `src/lib/premiumAccess.js` `PREMIUM_WHITELIST`
- `firestore.rules` `premiumEmails()` function

### Gallery slot mapping — two places, keep in sync
- `gallerySlotToIndex` in `src/pages/CreatePresskit.jsx`
- `galleryPhotoSlots` in `src/components/post-login/Stepform.jsx`

### API routes
`api/` (Mercado Pago checkout, webhook, Firebase Admin SDK) are **Vercel Serverless Functions only** — do not run under `npm run dev`. Test with `vercel dev`. Env vars for these (`MP_*`, `FIREBASE_SERVICE_ACCOUNT`) have no `VITE_` prefix.

### Auto-save
- 1200ms debounce → Firestore (`presskits/{userId}`)
- 250ms debounce → localStorage (`presskit_local_draft_{uid}`, compact — no blobs)
- On load, localStorage hydrates first, then Firestore overwrites.

### Public presskit auth caveat
Firestore rules require auth for all reads. Public `/presskit/:id` uses `onSnapshot` in `src/pages/PublicPresskit.jsx`. If the rules are set to owner-only, the public page only works for the owner. Check `firestore.rules` before changing publish logic.

## Data model (Firestore: `presskits/{userId}`)
- `images[]`: `[0]`=cover, `[1]`=hero, `[2]`=landscape(unused), `[3]`=liveAct, `[4]`=concept
- `artistMilestones`: `{ digital[], live[], press[], collaborations[] }`, max 3 each
- `releases[]`: max 8
- `pressArticles[]`: max 3
- `theme`: `neon | neutral | dark | minimal` (see `src/lib/themeColors.js`)
- `status`: `draft | published`
- Image upload: `presskits/{userId}/{folder}/`; library at `users/{userId}/imageLibrary/{imageId}`

## AI
`src/lib/aiBio.js` — Gemini 2.5 Flash, up to 4 retries with exponential backoff. Requires `VITE_GEMINI_API_KEY` to be set.
