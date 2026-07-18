"use client";

import { useState } from "react";

const links = [
  ["Schedule", "#schedule"],
  ["Details", "#details"],
  ["Who's Coming", "#attendees"],
  ["FAQ", "#faq"],
  ["RSVP", "#rsvp"],
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`mobile-menu ${open ? "is-open" : ""}`} id="mobile-menu">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
