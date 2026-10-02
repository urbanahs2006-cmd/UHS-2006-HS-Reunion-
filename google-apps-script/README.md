# Reunion Google Sheets and photo backend

## Update the existing deployment before publishing the website

1. Open the **existing reunion RSVP spreadsheet**, then **Extensions → Apps Script**.
2. Replace `Code.gs` with this directory's `Code.gs`. Keep this project bound to the same spreadsheet.
3. Run `getReunionPhotos_` once from the editor and authorize the added read access to Drive. The executing Google account must have access to the reunion photo folder.
4. Use **Deploy → Manage deployments → Edit → New version → Deploy**. Keep **Execute as: Me** and the existing website-accessible web app setting. Updating the same deployment preserves the `/exec` URL already configured in Vercel as `GOOGLE_APPS_SCRIPT_URL`.
5. Submit a test from the updated site. Verify that a new **Class Contacts** tab appears and the submitted row contains the correct information. The historical **RSVPs** tab is preserved.
6. Visit the deployed `/exec?action=reunionPhotos` endpoint and confirm it returns `{ "ok": true, "photos": [...] }`.

The new form sends `action: "contact"`. Successful contact saves return `{ "ok": true, "saved": "contact" }`. The website rejects older deployments or malformed responses rather than falsely confirming a save. Responses append with timestamps; they do not overwrite records based on an unverified email address. Review the latest submission when a classmate sends updated details.

Columns: Submitted At, First Name, Last Name, Email, Phone, Preferred Communication, 25-Year Reunion Interest, Planning Interest, Message, Contact Consent. User-entered formula-like strings are escaped as text. Contact information is never returned by public GET endpoints.

## Reunion slideshow

Folder: https://drive.google.com/drive/folders/1-9s5h-EYjN9P47uSJYYAf_ywtwehYsaQ

- Add JPEG, PNG, WebP, or GIF images directly to this folder. Convert HEIC photos first; nested folders are not included.
- Photos must be available to **anyone with the link as a viewer** to display for visitors. The script never changes sharing permissions. Keep editing restricted to trusted contributors.
- Photos are sorted by filename (natural numeric order). Use numbered filenames to control order.
- The site fetches the folder listing through Apps Script, cached for five minutes; CDN stale responses can persist for ten additional minutes.
- The six verified photos present on October 2, 2026 are included as a fallback manifest in `lib/reunion-photos.mjs`, allowing the album to display before Apps Script is upgraded and during outages. Removing a photo from the folder alone does not remove it from that fallback; remove its manifest entry too, or revoke its public access.
- Slides preserve the full image, with manual previous/next controls and optional play/pause. Playback starts only when requested.

## First-time setup (only if no deployment exists)

Create a spreadsheet, open its bound Apps Script project, paste `Code.gs`, and deploy as a web app executing as the spreadsheet owner with access for website visitors. Set `GOOGLE_APPS_SCRIPT_URL` in the website environment to the resulting `/exec` URL. Never use a `NEXT_PUBLIC_` variable for the backend URL.
