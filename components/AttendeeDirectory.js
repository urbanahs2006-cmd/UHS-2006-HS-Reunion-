"use client";

import { useEffect, useState } from "react";

const empty = { classmates: 0, guests: 0, total: 0, names: [], configured: false };

export default function AttendeeDirectory() {
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/attendees", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => active && setData({ ...empty, ...payload }))
      .catch(() => active && setData(empty))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="attendee-panel">
      <div className="attendee-stats">
        <div><strong>{loading ? "—" : data.classmates}</strong><span>Classmates</span></div>
        <div><strong>{loading ? "—" : data.guests}</strong><span>Guests</span></div>
        <div><strong>{loading ? "—" : data.total}</strong><span>Total attendees</span></div>
      </div>

      {data.names?.length > 0 ? (
        <div className="name-cloud" aria-label="Classmates attending">
          {data.names.map((name) => <span key={name}>{name}</span>)}
        </div>
      ) : (
        <p className="attendee-empty">
          {data.configured
            ? "Be among the first classmates listed here—opt in when you RSVP."
            : "The live attendee list will appear after the Google Sheet is connected."}
        </p>
      )}
    </div>
  );
}
