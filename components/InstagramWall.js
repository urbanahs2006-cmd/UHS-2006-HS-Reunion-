"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { instagramProfile } from "@/lib/instagram.mjs";

export default function InstagramWall() {
  const [posts, setPosts] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const track = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await fetch("/api/instagram", { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (data.available && Array.isArray(data.posts)) setPosts(data.posts);
      } catch { /* Keep the profile link available when the feed cannot load. */ }
    }
    refresh();
    const timer = setInterval(refresh, 15 * 60 * 1000);
    return () => { controller.abort(); clearInterval(timer); };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!motion.matches);
    const update = () => setPlaying(!motion.matches);
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  function advance(direction) {
    const element = track.current;
    if (!element) return;
    const step = (element.firstElementChild?.getBoundingClientRect().width || 300) + 20;
    const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 8;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollTo({ left: direction > 0 && atEnd ? 0 : element.scrollLeft + step * direction,
      behavior: reduceMotion ? "auto" : "smooth" });
  }

  useEffect(() => {
    if (!playing || interacting || posts.length < 2) return;
    const timer = setInterval(() => { if (!document.hidden) advance(1); }, 6000);
    return () => clearInterval(timer);
  }, [playing, interacting, posts.length]);

  return (
    <section className="paper-section instagram-section" id="instagram" aria-labelledby="instagram-heading">
      <div className="page-shell">
        <div className="section-heading">
          <span />
          <div><p className="section-kicker">Once a Tiger, always a Tiger</p><h2 id="instagram-heading">Follow the Reunion</h2></div>
          <span />
        </div>
        <p className="section-intro">Memories, familiar faces, and the countdown to our reunion.</p>
        <div className="instagram-toolbar">
          <a className="text-link" href={instagramProfile} target="_blank" rel="noreferrer">@uhstigers2006 <span aria-hidden="true">↗</span></a>
          {posts.length > 1 && <div className="instagram-controls" aria-label="Instagram carousel controls">
            <button type="button" aria-label="Previous posts" onClick={() => { setPlaying(false); advance(-1); }}>←</button>
            <button type="button" aria-pressed={playing} onClick={() => setPlaying(value => !value)}>{playing ? "Pause" : "Play"}</button>
            <button type="button" aria-label="Next posts" onClick={() => { setPlaying(false); advance(1); }}>→</button>
          </div>}
        </div>
        {posts.length > 0 ? <div ref={track} className="instagram-track" tabIndex={0} role="region" aria-label="Latest Instagram posts"
          onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
          onFocus={() => setPlaying(false)} onTouchStart={() => setPlaying(false)}>
          {posts.map(post => <a className="instagram-post" key={post.id} href={post.url} target="_blank" rel="noreferrer">
            <div className="instagram-image"><Image src={post.image} alt={post.caption ? post.caption.slice(0, 160) : "Reunion post from @uhstigers2006"} fill sizes="(max-width: 640px) 80vw, 320px" unoptimized />
              {post.type === "VIDEO" && <span className="instagram-post-type">Watch on Instagram ↗</span>}
            </div>
            <div className="instagram-caption"><strong>@uhstigers2006</strong>{post.caption && <p>{post.caption}</p>}<span>View post ↗</span></div>
          </a>)}
        </div> : <div className="instagram-invite">
          <p>Catch up with the Class of 2006 on Instagram.</p>
          <a className="button button--orange" href={instagramProfile} target="_blank" rel="noreferrer">Visit @uhstigers2006 <span aria-hidden="true">↗</span></a>
        </div>}
      </div>
    </section>
  );
}
