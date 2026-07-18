'use client';

import { useEffect, useMemo, useState } from 'react';

const events = [
  {
    day: 'Friday',
    date: 'September 25, 2026',
    title: 'Night 1 at Esquire',
    place: 'Esquire Lounge · Champaign, Illinois',
    time: '5:00–8:00 PM',
    note: 'No cost to attend. Food and drinks are on your own tab.',
    map: 'https://maps.google.com/?q=Esquire+Lounge+Champaign+Illinois',
  },
  {
    day: 'Saturday',
    date: 'September 26, 2026',
    title: 'School Tour & Class Photo',
    place: 'Urbana High School',
    time: 'Details coming soon',
    note: 'Walk the halls again, reconnect with old memories, and join the class photo.',
    map: 'https://maps.google.com/?q=Urbana+High+School+Illinois',
  },
  {
    day: 'Saturday',
    date: 'September 26, 2026',
    title: 'Night 2 at Riggs',
    place: 'Riggs Beer Company · Urbana, Illinois',
    time: '5:00–8:00 PM',
    note: 'Indoor/outdoor patio. No cost to attend; food and drinks are on your own tab.',
    map: 'https://maps.google.com/?q=Riggs+Beer+Company+Urbana+Illinois',
  },
  {
    day: 'Saturday Night',
    date: 'September 26, 2026',
    title: 'Optional Night Out',
    place: 'Cowboy Monkey · Champaign, Illinois',
    time: 'After the Riggs event',
    note: 'Keep the celebration going with classmates after Night 2.',
    map: 'https://maps.google.com/?q=Cowboy+Monkey+Champaign+Illinois',
  },
];

function Countdown() {
  const target = useMemo(() => new Date('2026-09-25T17:00:00-05:00').getTime(), []);
  const [remaining, setRemaining] = useState(target - Date.now());

  useEffect(() => {
    const timer = setInterval(() => setRemaining(target - Date.now()), 1000);
    return () => clearInterval(timer);
  }, [target]);

  const total = Math.max(0, remaining);
  const values = [
    ['Days', Math.floor(total / 86400000)],
    ['Hours', Math.floor((total / 3600000) % 24)],
    ['Minutes', Math.floor((total / 60000) % 60)],
    ['Seconds', Math.floor((total / 1000) % 60)],
  ];

  return (
    <div className="countdown" aria-label="Countdown to reunion">
      {values.map(([label, value]) => (
        <div className="count-card" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="nav-wrap">
        <nav className="nav shell">
          <a className="brand" href="#top">UHS <span>2006</span></a>
          <div className="nav-links">
            <a href="#weekend">Weekend</a>
            <a href="#details">Details</a>
            <a href="#rsvp" className="button small">RSVP</a>
          </div>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="texture" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Urbana High School · Class of 2006</p>
            <h1>20 Years.<br/><span>One Weekend.</span><br/>Countless Memories.</h1>
            <p className="lead">Join us September 25–26, 2026 for a weekend of reconnecting, reminiscing, and celebrating in Champaign-Urbana.</p>
            <div className="hero-actions">
              <a href="#rsvp" className="button">RSVP Now</a>
              <a href="#weekend" className="text-link">See the weekend →</a>
            </div>
            <Countdown />
          </div>
          <div className="flyer-frame">
            <img src="/reunion-flyer.jpeg" alt="Urbana High School Class of 2006 reunion flyer" />
          </div>
        </div>
      </section>

      <section className="stripe"><div>SEPTEMBER 25 & 26, 2026 · CHAMPAIGN–URBANA · GO TIGERS</div></section>

      <section className="section shell" id="weekend">
        <div className="section-heading">
          <p className="eyebrow">The Weekend</p>
          <h2>Four chances to reconnect</h2>
          <p>Come to one event or make a full weekend of it. All currently announced events are free to attend.</p>
        </div>
        <div className="event-grid">
          {events.map((event, index) => (
            <article className="event-card" key={event.title}>
              <div className="event-number">0{index + 1}</div>
              <p className="event-date">{event.day} · {event.date}</p>
              <h3>{event.title}</h3>
              <p className="event-place">{event.place}</p>
              <p className="event-time">{event.time}</p>
              <p>{event.note}</p>
              <a href={event.map} target="_blank" rel="noreferrer">Open map →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="details" id="details">
        <div className="shell details-grid">
          <div>
            <p className="eyebrow light">Good to know</p>
            <h2>No tickets. No formal dress code. Just show up.</h2>
          </div>
          <div className="detail-list">
            <div><strong>$0</strong><span>No cost to attend currently announced events.</span></div>
            <div><strong>4</strong><span>Events across Friday and Saturday.</span></div>
            <div><strong>20</strong><span>Years since the Class of 2006 graduated.</span></div>
          </div>
        </div>
      </section>

      <section className="section shell rsvp" id="rsvp">
        <div className="rsvp-copy">
          <p className="eyebrow">Save your spot</p>
          <h2>Tell us you're coming.</h2>
          <p>This preview uses a placeholder RSVP button. In the next step, we will connect your custom form to Google Sheets through Google Apps Script.</p>
          <ul>
            <li>Select which events you plan to attend</li>
            <li>Add a guest and optional class-list consent</li>
            <li>Update your RSVP later if plans change</li>
          </ul>
        </div>
        <div className="rsvp-card">
          <span className="stamp">CLASS OF<br/><strong>2006</strong></span>
          <h3>Ready for the reunion?</h3>
          <p>RSVP form connection coming next.</p>
          <button className="button disabled" disabled>RSVP Form Coming Soon</button>
          <small>Organizer contact and RSVP deadline can be added here.</small>
        </div>
      </section>

      <footer>
        <div className="shell footer-grid">
          <div className="brand">UHS <span>2006</span></div>
          <p>Urbana High School Class of 2006 · 20-Year Reunion</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
