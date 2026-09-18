import { normalizeInstagramPosts } from "@/lib/instagram.mjs";

export const runtime = "nodejs";

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_USER_ID;
  if (!token || !accountId || !/^\d+$/.test(accountId)) {
    return Response.json({ posts: [], available: false }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const url = new URL(`https://graph.instagram.com/v25.0/${accountId}/media`);
    url.searchParams.set("fields", "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp");
    url.searchParams.set("limit", "12");
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Instagram request failed");
    const body = await response.json();
    if (!Array.isArray(body.data)) throw new Error("Invalid Instagram response");
    return Response.json({ posts: normalizeInstagramPosts(body.data), available: true });
  } catch {
    // Never log upstream responses or request details: they may contain credentials.
    console.error("Instagram feed unavailable; check account authorization.");
    return Response.json({ posts: [], available: false }, { status: 503 });
  }
}
