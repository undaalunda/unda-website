/* HomePage.tsx */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { allItems } from '@/components/allItems';
import AppClientWrapper from '@/components/AppClientWrapper';

const blacklist = [
  'bass-book', 'keys-book', 'drums-book', 'cat-scores-white',
  'album-merch-bundle', 'book-merch-bundle', 'book-bonus-bundle',
  'book-bundle', 'apparel-book-bundle', 'sticker-book-bundle'
];

const homepageItems = allItems.filter(
  (item) => 
    (item.category === 'Merch' || item.category === 'Bundles' || item.category === 'Music') &&
    !blacklist.includes(item.id)
);

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const transcriptionRef = useRef<HTMLDivElement>(null);
  const stemsRef = useRef<HTMLDivElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const musicMerchRef = useRef<HTMLDivElement>(null);
  const tourRef = useRef<HTMLDivElement>(null);

  const [showVideo, setShowVideo] = useState(false);
  const [showTranscriptions, setShowTranscriptions] = useState(false);
  const [showStems, setShowStems] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showMerch, setShowMerch] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === videoRef.current) setShowVideo(true);
            if (entry.target === transcriptionRef.current) setShowTranscriptions(true);
            if (entry.target === stemsRef.current) setShowStems(true);
            if (entry.target === buttonGroupRef.current) setShowButtons(true);
            if (entry.target === musicMerchRef.current) setShowMerch(true);
            if (entry.target === tourRef.current) setShowTour(true);
          }
        });
      },
      { threshold: 0.01 }
    );
    const refs = [videoRef, transcriptionRef, stemsRef, buttonGroupRef, musicMerchRef, tourRef];
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => {
      refs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
    <AppClientWrapper>
    <main className="homepage-main" style={{ overflow: 'visible' }}>
      {isClient && (
        <Script
          src="https://widget.bandsintown.com/main.min.js"
          strategy="afterInteractive"
        />
      )}

      {/* HERO SECTION */}
      <div className="hero-wrapper">
        <div className="catmoon-background" />
        <div className="hero-text-image">
          <Image src="/text-hero-section.png" alt="Dark Wonderful World on Moon" height={400} width={600} priority />
        </div>
        <div className="hero-text desktop-only">
          <p className="hero-line1">
            THE NEW ALBUM'S COMING <span className="highlight">MAY 1 2025</span>
          </p>
          <p className="hero-line2">
            AVAILABLE NOW TO <Link href="/preorder" className="hero-cta-link">PRE-ORDER</Link> & <Link href="/presave" className="hero-cta-link">PRE-SAVE</Link>
          </p>
        </div>
        <div className="hero-text mobile-only">
          <p className="hero-line1">THE NEW ALBUM'S COMING</p>
          <p className="hero-line1"><span className="highlight">MAY 1 2025</span></p>
          <p className="hero-line2">AVAILABLE NOW TO</p>
          <p className="hero-line2">
            <Link href="/preorder" className="hero-cta-link">PRE-ORDER</Link> & <Link href="/presave" className="hero-cta-link">PRE-SAVE</Link>
          </p>
        </div>
      </div>

      <div className="after-hero-spacing" />

      {/* BUTTON GROUP */}
      <div ref={buttonGroupRef} className={`button-group ${showButtons ? 'fade-in' : ''}`}>
        <Link href="/shop?tab=DIGITAL" className="info-button">SCORES</Link>
        <Link href="/shop?tab=DIGITAL" className="info-button">STEMS & SAMPLES</Link>
        <Link href="/shop?tab=MERCH" className="info-button">MERCH</Link>
        <Link href="/shop?tab=MUSIC" className="info-button">PHYSICAL ALBUMS</Link>
        <a href="https://undaalunda.bandcamp.com/album/dark-wonderful-world-live-in-thailand" className="info-button" target="_blank" rel="noopener noreferrer">
          DIGITAL ALBUMS
        </a>
      </div>
      <p className="since-note">Delivering Worldwide Since 2025</p>

      {/* VIDEO SECTION */}
      <section ref={videoRef} className={`video-section ${showVideo ? 'fade-in' : ''}`}>
        <iframe
          className="youtube-frame"
          src="https://www.youtube.com/embed/ZwXeCx8cAIM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </section>

      {/* TRANSCRIPTION SECTION */}
      <section className="transcription-section">
        <div ref={transcriptionRef} className={`fade-trigger ${showTranscriptions ? 'fade-in' : ''}`}>
          <h2 className="transcription-sub">LEARN THE MUSIC</h2>
          <h3 className="transcription-title">TRANSCRIPTIONS</h3>
          <div className="product-row">
            {["guitar", "keys", "bass", "drums"].map((inst, i) => (
              <Link href={`/${inst}`} key={i} className="product-item product-label-link">
                <Image src={`/product-${inst}.png`} alt={`${inst} Book`} width={200} height={200} className="product-image" />
                <div className="product-label-group">
                  <p className="product-title">DARK WONDERFUL WORLD</p>
                  <p className="product-subtitle">THE COMPLETE {inst.toUpperCase()} TRANSCRIPTION</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="shopall-button-wrapper">
            <Link href="/shop?tab=DIGITAL" className="info-button">SHOP ALL</Link>
          </div>
        </div>
      </section>

      {/* STEMS SECTION */}
<section className="stems-section">
  <div ref={stemsRef} className={`fade-trigger ${showStems ? 'fade-in' : ''}`}>
    <h2 className="stems-sub">JAM THE TRACKS</h2>
    <h3 className="stems-title">STEMS & BACKINGS</h3>
    <div className="stems-row">
      {allItems
        .filter((item) => item.category === 'Backing Track')
        .map((item) => (
          <Link
            href={`/shop/${item.id}`}
            key={item.id}
            className="stems-item product-label-link is-backing"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={200}
              height={200}
              className="stems-image"
            />
            <div className="stems-label-group">
              <p className="stems-title-text">{item.title}</p>
              <p className="stems-subtitle-tiny">
                {item.subtitle
                  .replace(' BACKING TRACK', '')
                  .replace(' STEM', '')
                  .replace(' TAB', '')}
              </p>
              <span className="backing-line"></span>
              <p className="stems-subtitle-tiny tracking-wide uppercase text-center backing-text">
                BACKING TRACK
              </p>
              <p className="stems-price">
                $
                {typeof item.price === 'object'
                  ? item.price.sale.toFixed(2)
                  : item.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
    </div>
    <div className="shopall-button-wrapper">
      <Link href="/shop?tab=DIGITAL" className="info-button">
        SHOP ALL
      </Link>
    </div>
  </div>
</section>

      {/* MUSIC & MERCH */}
      <section className="stems-section">
        <div ref={musicMerchRef} className={`fade-trigger ${showMerch ? 'fade-in' : ''}`}>
          <h2 className="stems-sub">MUSIC IN YOUR HANDS</h2>
          <h3 className="stems-title">MUSIC & MERCH</h3>
          <div className="stems-row">
            {homepageItems.map((item) => (
              <Link href={`/shop/${item.id}`} key={item.id} className="stems-item product-label-link">
                <Image src={item.image} alt={item.title} width={200} height={200} className="stems-image" />
                <div className="stems-label-group">
                  <p className="stems-title-text">{item.title}</p>
                  <p className="stems-subtitle-tiny">{item.subtitle.replace(' BACKING TRACK', '').replace(' STEM', '').replace(' TAB', '')}</p>
                  <p className="stems-price">
                    {typeof item.price === 'object' && item.price !== null
                      ? <>
                          <span className="line-through mr-1 text-[#f8fcdc]">
                            ${item.price.original.toFixed(2)}
                          </span>
                          <span className="text-[#cc3f33]">
                            ${item.price.sale.toFixed(2)}
                          </span>
                        </>
                      : typeof item.price === 'number'
                        ? `$${item.price.toFixed(2)}`
                        : null}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="shopall-button-wrapper">
            <Link href="/shop?tab=MERCH" className="info-button">SHOP ALL</Link>
          </div>
        </div>
      </section>

      {/* TOUR SECTION */}
      <section ref={tourRef} className="tour-section">
        <div className={`fade-trigger ${showTour ? 'fade-in' : ''}`}>
          <h2 className="stems-sub">SEE IT LIVE</h2>
          <h3 className="stems-title">TOUR DATES</h3>
        </div>
        <div className="tour-widget-container">
          <div style={{ textAlign: 'left' }}>
            {isClient ? (
              <div
                className="bit-widget-initializer"
                data-artist-name="Unda Alunda"
                data-background-color="transparent"
                data-limit="10"
                data-separator-color="rgba(255,255,255,0.1)"
                data-text-color="#f8fcdc"
                data-link-color="#dc9e63"
                data-display-local-dates="false"
                data-display-past-dates="false"
                data-auto-style="false"
                data-display-limit="5"
                data-date-format="ddd, MMM D, YYYY"
                data-request-show="true"
                data-language="en"
              />
            ) : (
              <div style={{ height: '400px' }} />
            )}
          </div>
        </div>
      </section>
    </main>
    </AppClientWrapper>
  );
}