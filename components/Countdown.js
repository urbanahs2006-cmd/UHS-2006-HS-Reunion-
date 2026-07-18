"use client";

import { useEffect, useMemo, useState } from "react";

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
  const initial = useMemo(() => calculate(target), [target]);
  const [time, setTime] = useState(initial);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(calculate(target)), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return (
    <div className="countdown" aria-label="Countdown to the reunion">
      {units.map(([label]) => (
        <div className="countdown__unit" key={label}>
          <strong>{String(time[label]).padStart(label === "days" ? 3 : 2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
