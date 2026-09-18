export const instagramProfile = "https://www.instagram.com/uhstigers2006/";

function safeUrl(value, hosts) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password &&
      hosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))
      ? url.href : null;
  } catch { return null; }
}

export function normalizeInstagramPosts(data) {
  if (!Array.isArray(data)) return [];
  return data.flatMap(post => {
    const image = safeUrl(post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url,
      ["cdninstagram.com", "fbcdn.net"]);
    const url = safeUrl(post.permalink, ["instagram.com"]);
    if (!post.id || !image || !url) return [];
    return [{ id: String(post.id), image, url, caption: String(post.caption || "").slice(0, 2200),
      type: post.media_type, timestamp: Number.isFinite(Date.parse(post.timestamp)) ? post.timestamp : null }];
  }).sort((a, b) => (Date.parse(b.timestamp) || 0) - (Date.parse(a.timestamp) || 0)).slice(0, 12);
}
