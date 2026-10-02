import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import InstagramWall from "@/components/InstagramWall";
import ReunionSlideshow from "@/components/ReunionSlideshow";

export default function HomePage() {
  return (
    <>
      <header>
        <strong>URBANA <span style={{color: "#ed6b32"}}>/</span> CLASS OF 2006</strong>
        <nav>
          <a href="#memories">The memories</a>
          <a href="#next">What’s next</a>
          <a href="#instagram">Social Wall</a>
          <a className="pill" href="#connect">Stay connected</a>
        </nav>
      </header>
      <main>
        <div className="hero">
          <article>
            <div className="tag">20-year reunion · September 25 & 26, 2026</div>
            <h1>Same Tigers.<br />New memories.<br />
              <em>Thank you.</em>
            </h1>
            <p>Here’s to everyone who made our reunion weekend special—and to the classmates we hope to see next time.</p>
            <div className="actions">
              <a href="#memories" className="pill">Relive the weekend ↗</a>
              <a href="#connect">Keep in touch →</a>
            </div>
          </article>
          <figure>
            <Image src="/urbana-high-school.webp" alt="Urbana High School building" fill priority sizes="(max-width: 700px) 100vw, 50vw" />
          </figure>
        </div>
        <div className="band">
          <b>Once a Tiger, always a Tiger.</b>
          <span>Champaign & Urbana, Illinois · Twenty years of stories. More to come.</span>
        </div>
        <section id="memories">
          <div className="sectionhead">
            <div>
              <div className="tag">The 20-year reunion album</div>
              <h2>A weekend worth remembering.</h2>
            </div>
            <p>Old friends. Familiar places. A few new stories.<br />Our reunion photos, together in one place.</p>
          </div>
          <ReunionSlideshow />
        </section>
        <section className="future" id="next">
          <div>
            <div className="tag">Looking ahead · 2031?</div>
            <h2>How about a 25-year reunion?</h2>
            <p>No dates or plans just yet. Let us know if you’d like to get together again—and whether you’d like to help make it happen.</p>
            <a href="#connect">Tell us what you think →</a>
          </div>
          <aside>
            <h3>Keep the connection going.</h3>
            <p>Made it to the reunion? Missed this one? Either way, you’re part of this class. Leave your current details so we can reach you about future gatherings.</p>
            <p>
              <strong>Have a favorite memory?</strong>
              <br />Share it in the optional note below.</p>
          </aside>
        </section>
        <InstagramWall />
        <section className="connect" id="connect">
          <article>
            <div className="tag">For every member of the class</div>
            <h2>Let’s not wait<br />another 20 years.</h2>
            <p>Keep your contact information up to date and help shape our next chapter.</p>
            <div className="note">
              <strong>Your details stay with the committee.</strong>
              <p>Contact information won’t appear on this website. We’ll use it for class and reunion updates.</p>
            </div>
          </article>
          <ContactForm />
        </section>
      </main>
      <footer>
        <strong>Urbana High School · Class of 2006</strong>
        <span>Different paths. Shared roots.</span>
      </footer>
    </>
  );
}
