"use client";

import { useState } from "react";

const eventOptions = [
  ["fridayEsquire", "Friday night at Esquire"],
  ["schoolTour", "Saturday school tour and class photo"],
  ["saturdayRiggs", "Saturday night at Riggs"],
  ["cowboyMonkey", "Optional Cowboy Monkey night out"],
];

const initialStatus = { type: "idle", message: "" };

export default function RsvpForm() {
  const [status, setStatus] = useState(initialStatus);
  const [attending, setAttending] = useState("yes");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Saving your RSVP…" });

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.events = eventOptions.reduce((selected, [name]) => {
      selected[name] = data.get(name) === "on";
      return selected;
    }, {});

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't save your RSVP.");

      setStatus({
        type: "success",
        message: "You're on the list! A reunion organizer can now see your RSVP.",
      });
      form.reset();
      setAttending("yes");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="form-grid form-grid--two">
        <label>
          <span>First name *</span>
          <input name="firstName" required autoComplete="given-name" />
        </label>
        <label>
          <span>Last name *</span>
          <input name="lastName" required autoComplete="family-name" />
        </label>
      </div>

      <div className="form-grid form-grid--two">
        <label>
          <span>Name in high school (optional)</span>
          <input name="formerName" autoComplete="off" />
        </label>
        <label>
          <span>Email *</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>

      <div className="form-grid form-grid--two">
        <label>
          <span>Phone (optional)</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          <span>Current city and state</span>
          <input name="currentCity" placeholder="e.g., Chicago, IL" />
        </label>
      </div>

      <fieldset>
        <legend>Will you attend? *</legend>
        <div className="choice-row">
          {[
            ["yes", "Yes"],
            ["maybe", "Maybe"],
            ["no", "No"],
          ].map(([value, label]) => (
            <label className="choice" key={value}>
              <input
                type="radio"
                name="rsvpStatus"
                value={value}
                checked={attending === value}
                onChange={() => setAttending(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {attending !== "no" && (
        <>
          <fieldset>
            <legend>Which events are you interested in?</legend>
            <div className="check-grid">
              {eventOptions.map(([name, label]) => (
                <label className="check" key={name}>
                  <input type="checkbox" name={name} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-grid form-grid--two">
            <label>
              <span>Number of guests</span>
              <select name="guestCount" defaultValue="0">
                <option value="0">No guests</option>
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
              </select>
            </label>
            <label>
              <span>Guest name(s)</span>
              <input name="guestNames" />
            </label>
          </div>
        </>
      )}

      <label>
        <span>Message to the reunion committee</span>
        <textarea name="message" rows="4" placeholder="Questions, accessibility needs, or anything else we should know." />
      </label>

      <label className="check directory-check">
        <input type="checkbox" name="directoryConsent" />
        <span>You may display my name in the public “Who’s Coming” section.</span>
      </label>

      <label className="honeypot" aria-hidden="true">
        Company
        <input name="company" tabIndex="-1" autoComplete="off" />
      </label>

      <button className="button button--orange button--large" type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Submitting…" : "Submit RSVP"}
      </button>

      {status.message && (
        <p className={`form-status form-status--${status.type}`} role="status">
          {status.message}
        </p>
      )}
    </form>
  );
}
