import { NextResponse } from "next/server";

export const runtime = "nodejs";

function clean(value, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request) {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!endpoint) {
    return NextResponse.json(
      { error: "The RSVP form is ready, but the Google Apps Script URL has not been configured yet." },
      { status: 503 },
    );
  }

  try {
    const input = await request.json();
    if (clean(input.company)) {
      return NextResponse.json({ ok: true });
    }

    const payload = {
      firstName: clean(input.firstName, 80),
      lastName: clean(input.lastName, 80),
      formerName: clean(input.formerName, 100),
      email: clean(input.email, 180).toLowerCase(),
      phone: clean(input.phone, 40),
      currentCity: clean(input.currentCity, 120),
      rsvpStatus: clean(input.rsvpStatus, 20),
      events: {
        fridayEsquire: Boolean(input.events?.fridayEsquire),
        schoolTour: Boolean(input.events?.schoolTour),
        saturdayRiggs: Boolean(input.events?.saturdayRiggs),
        cowboyMonkey: Boolean(input.events?.cowboyMonkey),
      },
      guestCount: Math.min(10, Math.max(0, Number(input.guestCount) || 0)),
      guestNames: clean(input.guestNames, 300),
      message: clean(input.message, 1500),
      directoryConsent: input.directoryConsent === "on" || input.directoryConsent === true,
      submittedFrom: "website",
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.rsvpStatus) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { ok: response.ok };
    }

    if (!response.ok || result.ok === false) {
      throw new Error(result.error || "The Google Sheet did not accept the RSVP.");
    }

    return NextResponse.json({ ok: true, updated: Boolean(result.updated) });
  } catch (error) {
    console.error("RSVP submission failed:", error);
    return NextResponse.json(
      { error: "We couldn't save your RSVP right now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
