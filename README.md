# Urbana High School Class of 2006 Reunion Website

A mobile-first Next.js website ready to import into Vercel. It includes:

- The real Urbana High School photo in the hero
- Responsive vintage varsity styling inspired by the reunion flyer
- A live countdown to September 25, 2026 at 5:00 PM Central Time
- Reunion schedule and Google Maps search links
- A custom RSVP form backed by Google Sheets and Apps Script
- Duplicate RSVP updates by email address
- An opt-in “Who’s Coming” list and live attendance totals
- FAQ, reunion details, social sharing image, favicon, and mobile navigation

## Local preview

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The website will run without the Google Apps Script URL, but RSVP submissions and live attendee data will remain disconnected until it is configured.

## Connect Google Sheets

Follow `google-apps-script/README.md`, then add the deployed Apps Script Web App URL to `.env.local`:

```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Deploy to Vercel

1. Put all project files in the root of a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel should detect **Next.js** automatically.
4. Add `GOOGLE_APPS_SCRIPT_URL` under **Project Settings → Environment Variables**.
5. Deploy.

Each push to the connected production branch will trigger a fresh deployment.

## Edit reunion content

Most text, event details, map links, and dates are in:

```text
lib/site.js
```

Page content is in:

```text
app/page.js
```

Styling is in:

```text
app/globals.css
```

## Before launch

- Confirm the venue names, times, and school-tour details.
- Add the organizer email and Facebook URL in `lib/site.js` if desired.
- Replace `https://example.com` in `app/layout.js` after your final domain is connected.
- Test one RSVP on the deployed site and confirm it appears in the Google Sheet.
