"use client";

import { useEffect, useState } from "react";

const units = [
  ["days", 1000 * 60 * 60 * 24],
  ["hours", 1000 * 60 * 60],
  ["minutes", 1000 * 60],
  ["seconds", 1000],
];

function calculate(target) {
  let remaining = Math.max(0, new Date(target).getTime() - Date.now());
  const output = {};

  units.forEach(([label, divisor]) => {
    output[label] = Math.floor(remaining / divisor);
    remaining %= divisor;
  });

  return output;
}

export default function Countdown({ target }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(calculate(target));
    const timer = window.setInterval(() => setTime(calculate(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <div className="countdown" aria-label="Countdown to the reunion">
      {units.map(([label]) => (
        <div className="countdown__unit" key={label}>
          <strong>{time[label]}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
