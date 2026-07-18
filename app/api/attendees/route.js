import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const empty = { classmates: 0, guests: 0, total: 0, names: [] };

export async function GET() {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!endpoint) return NextResponse.json({ ...empty, configured: false });

  try {
    const url = new URL(endpoint);
    url.searchParams.set("action", "publicAttendees");
    const response = await fetch(url, { cache: "no-store", redirect: "follow" });
    const result = await response.json();
    if (!response.ok || result.ok === false) throw new Error("Unable to load attendees");

    return NextResponse.json({
      classmates: Number(result.classmates) || 0,
      guests: Number(result.guests) || 0,
      total: Number(result.total) || 0,
      names: Array.isArray(result.names) ? result.names.slice(0, 250) : [],
      configured: true,
    });
  } catch (error) {
    console.error("Attendee directory failed:", error);
    return NextResponse.json({ ...empty, configured: true }, { status: 200 });
  }
}
