# Google Sheets RSVP backend

1. Create a new Google Sheet for reunion RSVPs.
2. Open **Extensions → Apps Script**.
3. Replace the default code with the contents of `Code.gs` and save.
4. Select **Deploy → New deployment**.
5. Choose **Web app**.
6. Set **Execute as** to **Me**.
7. Set **Who has access** to **Anyone**.
8. Deploy, authorize the script, and copy the Web App URL ending in `/exec`.
9. Add that URL to Vercel as the environment variable `GOOGLE_APPS_SCRIPT_URL`.
10. Redeploy the Vercel project.

The script creates an `RSVPs` tab automatically. Submitting again with the same email updates the existing row instead of creating a duplicate.
