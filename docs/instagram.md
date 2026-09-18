# Instagram wall connection

The wall is for https://www.instagram.com/uhstigers2006/. Until connected, it shows a profile invitation, not example posts. The integration is not live until authenticated media retrieval has been verified.

## Connect the account

1. Confirm this is a Business or Creator account.
2. In a Meta developer app, configure **Instagram API with Instagram Login**, add/authorize the `uhstigers2006` account, and grant the read permission `instagram_business_basic`. Use the account ID and a long-lived Instagram access token from that setup, not a Facebook Page token or the retired Basic Display API.
3. Set `INSTAGRAM_USER_ID` and `INSTAGRAM_ACCESS_TOKEN` as server-only environment variables in the Vercel project, then redeploy. Do not paste tokens into chat, commit them, or expose them through `NEXT_PUBLIC_` variables.
4. Verify `/api/instagram` returns `available: true` with the account's real posts, then check photos, Reel thumbnails, links and mobile scrolling on the homepage.

Official setup: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/

## Refresh and maintenance

- The server caches media requests for 15 minutes. Open pages request updates every 15 minutes. This is periodic refresh, not instantaneous delivery.
- Displays the latest 12 posts, using Reel thumbnails and the cover image for carousel posts; clicking opens the full post on Instagram.
- The access token must remain valid. Long-lived tokens need renewal before expiry; this implementation does **not** persist or automatically rotate tokens. Use Meta's token refresh process, update the Vercel secret, and redeploy before expiration. For unattended operation beyond the token lifetime, add a scheduled refresh job with durable secret storage or use a managed feed provider.
- Missing credentials or upstream failures show a profile link. No sample posts are published. Existing cards stay visible during a temporary refresh failure in an open page.
- No Instagram password is stored, and API credentials are never returned to the browser.
