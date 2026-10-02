import { NextResponse } from 'next/server';
import { initialReunionPhotos } from '@/lib/reunion-photos.mjs';
export const runtime = 'nodejs';
export async function GET() {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!endpoint) return NextResponse.json({ photos: initialReunionPhotos });
  try {
    const url = new URL(endpoint);
    url.searchParams.set('action', 'reunionPhotos');
    const response = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    const result = await response.json();
    if (!response.ok || result.ok !== true || !Array.isArray(result.photos)) throw new Error('Invalid album');
    const photos = result.photos.filter(photo => typeof photo.id === 'string' && /^[\w-]+$/.test(photo.id)).map(photo => ({ id: photo.id }));
    return NextResponse.json({ photos }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
  } catch {
    return NextResponse.json({ photos: initialReunionPhotos });
  }
}
