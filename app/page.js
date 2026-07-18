import Countdown from "@/components/Countdown";
import MobileNav from "@/components/MobileNav";
import RsvpForm from "@/components/RsvpForm";
import AttendeeDirectory from "@/components/AttendeeDirectory";
import { events, siteConfig } from "@/lib/site";

const navLinks = [
  ["Home", "#top"],
  ["Schedule", "#schedule"],
  ["Details", "#details"],
  ["Who's Coming", "#attendees"],
  ["FAQ", "#faq"],
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Urbana High School Class of 2006 home">
          <img src="/tiger-logo.webp" alt="Urbana Tigers logo" />
          <span><b>Urbana High School</b><em>Class of 2006</em></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          <a className="nav-rsvp" href="#rsvp">RSVP</a>
        </nav>
        <MobileNav />
      </header>

      <section className="hero" id="top">
        <div className="hero__photo" aria-hidden="true" />
        <div className="hero__wash" aria-hidden="true" />
        <div className="hero__content page-shell">
          <p className="script-label">20-Year</p>
          <h1>Reunion</h1>
          <h2><span className="tiger-paw" aria-hidden="true" />Class of 2006<span className="tiger-paw" aria-hidden="true" /></h2>
          <p className="hero__tagline">One weekend. Countless memories.</p>
          <div className="hero__date">
            <svg className="calendar-icon" viewBox="0 0 48 48" aria-hidden="true">
              <rect x="6" y="9" width="36" height="33" rx="2" />
              <path d="M15 5v9M33 5v9M6 19h36" />
              <path d="M13 25h5M22 25h5M31 25h5M13 32h5M22 32h5M31 32h5" />
            </svg>
            <div>
              <strong>{siteConfig.dateLabel}</strong>
              <span>{siteConfig.locationLabel}</span>
            </div>
          </div>
          <div className="hero__actions">
            <a className="button button--orange" href="#rsvp">RSVP Now <span aria-hidden="true">›</span></a>
            <a className="button button--outline" href="#schedule">View Schedule</a>
          </div>
        </div>
      </section>

      <section className="countdown-band" aria-labelledby="countdown-title">
        <div className="page-shell countdown-band__inner">
          <div>
            <p className="section-kicker" id="countdown-title">Countdown to the reunion</p>
            <Countdown target={siteConfig.countdownTarget} />
          </div>
          <div className="countdown-copy">
            <p className="script-small">Coming together</p>
            <p>It’s been 20 years since we walked these halls. Let’s celebrate the friendships, memories, and moments that last a lifetime.</p>
            <strong>We can’t wait to see you!</strong>
          </div>
        </div>
      </section>

      <section className="paper-section schedule-section" id="schedule">
        <div className="page-shell">
          <div className="section-heading">
            <span />
            <div>
              <p className="section-kicker">September 25 & 26</p>
              <h2>Reunion Weekend at a Glance</h2>
            </div>
            <span />
          </div>

          <div className="event-grid">
            {events.map((event) => (
              <article className="event-card" key={event.id}>
                <div className="date-block">
                  <span>{event.day}</span>
                  <b>{event.month}</b>
                  <strong>{event.date}</strong>
                  <em>{event.year}</em>
                </div>
                <div className="event-card__body">
                  <div className="event-mark" aria-hidden="true">
                    <img src={event.icon} alt="" />
                  </div>
                  <div className="event-card__content">
                    <p className="event-eyebrow">{event.eyebrow}</p>
                    <h3>{event.title}</h3>
                    <p className="event-meta"><span aria-hidden="true">◷</span>{event.time}</p>
                    <p className="event-meta"><span aria-hidden="true">⌖</span>{event.city}</p>
                    <p className="event-detail">{event.detail}</p>
                    <a href={event.mapUrl} target="_blank" rel="noreferrer">View on map <span aria-hidden="true">↗</span></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="details-section" id="details">
        <div className="page-shell detail-grid">
          <div className="memory-card">
            <p className="section-kicker">Once a Tiger, always a Tiger</p>
            <h2>It’s been 20 years.<br /><span>Let’s make it unforgettable.</span></h2>
            <p>Reconnect with old friends, walk the halls again, and celebrate where we’ve been and where we’re going.</p>
            <a className="text-link" href="/reunion-flyer.jpeg" target="_blank">View the original reunion flyer <span>↗</span></a>
          </div>
          <div className="reunion-details">
            <div className="section-heading section-heading--compact">
              <span />
              <h2>Reunion Details</h2>
              <span />
            </div>
            <div className="detail-list">
              <div><b aria-hidden="true">⌖</b><p><strong>Location</strong><span>Events take place in Champaign and Urbana, Illinois.</span></p></div>
              <div><b aria-hidden="true">▣</b><p><strong>Hotels</strong><span>Room blocks and hotel recommendations will be posted when available.</span></p></div>
              <div><b aria-hidden="true">?</b><p><strong>Questions?</strong><span>Use the RSVP form to send a note to the reunion committee.</span></p></div>
            </div>
          </div>
        </div>
      </section>

      <aside className="reunion-cta" aria-label="Reunion RSVP reminder">
        <div className="page-shell reunion-cta__inner">
          <div className="footer-motto"><span className="tiger-paw tiger-paw--orange" aria-hidden="true" /><p><em>Once a Tiger,</em><strong>Always a Tiger.</strong></p></div>
          <a className="button button--orange" href="#rsvp">RSVP Now <span aria-hidden="true">›</span></a>
        </div>
      </aside>

      <section className="paper-section attendees-section" id="attendees">
        <div className="page-shell narrow-shell">
          <div className="section-heading">
            <span />
            <div>
              <p className="section-kicker">The class is getting back together</p>
              <h2>Who’s Coming</h2>
            </div>
            <span />
          </div>
          <p className="section-intro">Only classmates who opt in during RSVP will appear by name. Guest names and contact details remain private.</p>
          <AttendeeDirectory />
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="page-shell rsvp-layout">
          <div className="rsvp-copy">
            <p className="script-label">Save your spot</p>
            <h2>RSVP for the Reunion</h2>
            <p>Tell us whether you’re coming and which events you’re interested in. You can submit again later with the same email address to update your response.</p>
            <div className="rsvp-note">
              <strong>No tickets required</strong>
              <span>The Friday and Saturday evening events are free to attend; food and drinks are on your own tab.</span>
            </div>
          </div>
          <RsvpForm />
        </div>
      </section>

      <section className="paper-section faq-section" id="faq">
        <div className="page-shell narrow-shell">
          <div className="section-heading">
            <span />
            <div><p className="section-kicker">Good to know</p><h2>Frequently Asked Questions</h2></div>
            <span />
          </div>
          <div className="faq-grid">
            <details>
              <summary>Is there a cost to attend?</summary>
              <p>No. The Friday night and Saturday night gatherings have no admission charge. Food and drinks are purchased individually.</p>
            </details>
            <details>
              <summary>Can I bring a guest?</summary>
              <p>Yes. Include the number and names of your guests on the RSVP form so the committee can plan accurately.</p>
            </details>
            <details>
              <summary>When will school-tour details be available?</summary>
              <p>The time and meeting location are still being coordinated. The website can be updated as soon as those details are confirmed.</p>
            </details>
            <details>
              <summary>Can I change my RSVP?</summary>
              <p>Yes. Submit the form again using the same email address. The Google Sheet will update your existing response.</p>
            </details>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <div className="footer-motto"><span className="tiger-paw tiger-paw--cream" aria-hidden="true" /><p><em>Once a Tiger,</em><strong>Always a Tiger.</strong></p></div>
          <a className="button button--orange" href="#rsvp">RSVP Now</a>
          <p>Urbana High School · Class of 2006<br />20 years strong. A lifetime of memories.</p>
        </div>
      </footer>
    </main>
  );
}
