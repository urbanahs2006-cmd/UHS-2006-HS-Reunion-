# Urbana High School Class of 2006

Post-reunion website built with Next.js, featuring:

- A thank-you homepage for the September 25–26, 2026 reunion
- A Google Drive photo slideshow with manual navigation and optional play/pause
- Contact details, preferred communication, 25-year reunion interest, and planning interest
- An optional memory/suggestion field and contact consent
- A new **Class Contacts** tab in the existing reunion spreadsheet; historical RSVPs remain intact

## Local development

Use Node.js 24:

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set `GOOGLE_APPS_SCRIPT_URL` to the existing Apps Script web app URL. Without it, the six initial album photos remain available, but contact submissions return an unavailable message and are not saved.

## Activation

Follow [the backend upgrade instructions](google-apps-script/README.md) before deploying the website. Committing the code does not update the Google-hosted Apps Script. The existing deployment must be upgraded for contact collection and automatic photo-folder refresh.

The photo folder is configured in `google-apps-script/Code.gs` and `lib/reunion-photos.mjs`. The slideshow reads public-link-compatible images directly from Drive; no private contacts are exposed.

## Verification

```sh
node --test tests/contact.test.mjs
npm run build
```

Tests cover contact validation, separate-sheet append behavior, formula escaping, preservation of historical RSVPs, and public-photo filtering. A real Google save still requires an upgraded deployment and a live submission checked in the spreadsheet.
