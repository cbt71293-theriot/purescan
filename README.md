# PureScan

PureScan is a SvelteKit app for scanning food product barcodes, pulling ingredient/additive data from Open Food Facts, OCR-ing labels with Tesseract.js, and scoring products by additive safety.

## Stack

- SvelteKit 2+ / Svelte 5
- TypeScript 5+
- Tailwind CSS v4
- Dexie.js (IndexedDB)
- Fastify (backend API, planned)
- html5-qrcode
- Tesseract.js
- OpenFoodFacts API

## Prerequisites

- Node.js >= 20
- npm >= 9 or pnpm/yarn

## Setup

```bash
cd purescan
cp .env.example .env
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project structure

```
purescan/
  src/
    routes/           SvelteKit routes
    lib/
      components/     Reusable UI components
      services/       Business logic (additives, scoring)
      stores/         Svelte stores + Dexie DB
    app.css           Tailwind + global styles
  static/
    sw.js             Service worker for offline caching
    manifest.json     PWA manifest
```

## Notes

- Default adapter is `@sveltejs/adapter-auto`. Change it in `svelte.config.js` when deploying.
- Offline support is implemented via a minimal service worker; expand caching strategy as needed.
- Health/medical claims should be reviewed; this app is for educational use only.
