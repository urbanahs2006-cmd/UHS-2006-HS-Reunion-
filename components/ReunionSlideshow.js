'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { reunionAlbumUrl } from '@/lib/reunion-photos.mjs';
export default function ReunionSlideshow() {
  const [photos, setPhotos] = useState([]);
  const [state, setState] = useState('loading');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    fetch('/api/photos', { signal: controller.signal }).then(async response => {
      const result = await response.json();
      if (!response.ok || !Array.isArray(result.photos)) throw new Error('Unavailable');
      setPhotos(result.photos); setIndex(0); setFailed(false); setState('ready');
    }).catch(error => { if (error.name !== 'AbortError') setState('error'); });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    if (!playing || photos.length < 2) return;
    const timer = setInterval(() => { setIndex(value => (value + 1) % photos.length); setFailed(false); }, 6000);
    return () => clearInterval(timer);
  }, [playing, photos.length]);
  function move(delta) { setPlaying(false); setFailed(false); setIndex(value => (value + delta + photos.length) % photos.length); }
  return <div aria-label="20-year reunion photos" aria-roledescription="carousel">
    <div className="slide" aria-live={playing ? 'off' : 'polite'}>
      {state === 'ready' && photos.length > 0 ? <div className="slide-photo">
        {failed ? <p className="slide-error">This photo couldn’t load. Try the next photo or open the album below.</p> : <Image key={photos[index].id} src={`https://drive.google.com/thumbnail?id=${encodeURIComponent(photos[index].id)}&sz=w1600`} alt={`20-year reunion photo ${index + 1} of ${photos.length}`} fill sizes="100vw" unoptimized onError={() => setFailed(true)} />}
      </div> : <div><div className="frame" aria-hidden="true">▧</div><h3>{state === 'loading' ? 'Loading the memories…' : state === 'error' ? 'The album is taking a little longer.' : 'More memories are on the way.'}</h3><p>{state === 'error' ? 'Please try again shortly. The reunion album is also linked below.' : state === 'ready' ? 'Check back soon for photos from our reunion weekend.' : 'Gathering photos from our reunion album.'}</p></div>}
    </div>
    <div className="controls"><span>{state === 'ready' && photos.length ? `${index + 1} / ${photos.length}` : '20-year reunion album'}</span><div>
      {state === 'error' && <button type="button" onClick={() => setRetry(value => value + 1)}>Try again</button>}
      {photos.length > 1 && state === 'ready' && <><button type="button" aria-label="Previous photo" onClick={() => move(-1)}>←</button>{' '}<button type="button" onClick={() => setPlaying(value => !value)} aria-pressed={playing}>{playing ? 'Pause slideshow' : 'Play slideshow'}</button>{' '}<button type="button" aria-label="Next photo" onClick={() => move(1)}>→</button></>}
    </div></div>
    <p className="album-link"><a href={reunionAlbumUrl} target="_blank" rel="noreferrer">Open the reunion photo album ↗</a></p>
  </div>;
}
