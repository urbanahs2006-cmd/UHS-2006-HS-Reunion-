import { NextResponse } from 'next/server';
import { validateContact } from '@/lib/contact.mjs';

export const runtime = 'nodejs';
export async function POST(request) {
  let payload;
  try {
    const text = await request.text();
    if (text.length > 12000) return NextResponse.json({ error: 'Submission is too large.' }, { status: 413 });
    const input = JSON.parse(text);
    if (input?.company) return NextResponse.json({ ok: true });
    payload = validateContact(input);
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? 'Please submit a valid form.' : error.message }, { status: 400 });
  }
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!endpoint) return NextResponse.json({ error: 'The contact form is temporarily unavailable. Please try again later.' }, { status: 503 });
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    // An older RSVP deployment must never be mistaken for a saved contact.
    if (!response.ok || result.ok !== true || result.saved !== 'contact') throw new Error('Contact was not acknowledged');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'We couldn’t confirm your details were saved. Please try again in a moment.' }, { status: 502 });
  }
}
