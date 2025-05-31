/* HomePage.tsx - Performance Optimized + Accessibility Enhanced */

'use client';

import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { allItems } from '@/components/allItems';
import AppClientWrapper from '@/components/AppClientWrapper';

// 🚀 Lazy load heavy components
const BandsinTownWidget = lazy(() => import('@/components/BandsinTownWidget'));

const blacklist = [
  'bass-book', 'keys-book', 'drums-book', 'cat-scores-t-shirt-white',
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
  const [showBandsintown, setShowBandsintown] = useState(false);
  
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
            if (entry.target === tourRef.current) {
              setShowTour(true);
              setShowBandsintown(true);
            }
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
      <main id="main-content" className="homepage-main" style={{ overflow: 'visible' }}>
        {/* 🎯 Improved heading structure */}
        <h1 className="sr-only">Unda Alunda - Official Website and Music Store</h1>

        {/* HERO SECTION */}
        <section className="hero-wrapper" aria-labelledby="hero-heading">
          <div className="catmoon-background" />
          <div className="hero-text-image">
            <Image
              src="/text-hero-section.webp"
              alt="Dark Wonderful World album artwork - mystical moon landscape with dramatic typography announcing the new album coming July 1, 2025"
              height={400}
              width={600}
              quality={100}
              priority
              unoptimized={true}
              sizes="(max-width: 480px) 300px, (max-width: 768px) 400px, 600px"
            />
          </div>
          
          <div className="hero-text desktop-only">
            <h2 id="hero-heading" className="sr-only">New Album Announcement</h2>
            <p className="hero-line1">
              THE NEW ALBUM'S COMING <span className="highlight">JULY 1 2025</span>
            </p>
            <p className="hero-line2">
              AVAILABLE NOW TO <Link 
                href="/shop/merch" 
                className="hero-cta-link"
                aria-label="Pre-order Dark Wonderful World album"
              >PRE-ORDER</Link> &{' '}
              <a 
                href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero-cta-link"
                aria-label="Pre-save Dark Wonderful World album on Spotify"
              >
                PRE-SAVE
              </a>
            </p>
          </div>
          
          <div className="hero-text mobile-only">
            <h2 className="sr-only">New Album Announcement</h2>
            <p className="hero-line1">THE NEW ALBUM'S COMING</p>
            <p className="hero-line1"><span className="highlight">JULY 1 2025</span></p>
            <p className="hero-line2">AVAILABLE NOW TO</p>
            <p className="hero-line2">
              <Link 
                href="/shop/merch" 
                className="hero-cta-link"
                aria-label="Pre-order Dark Wonderful World album"
              >PRE-ORDER</Link> &{' '}
              <a 
                href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hero-cta-link"
                aria-label="Pre-save Dark Wonderful World album on Spotify"
              >
                PRE-SAVE
              </a>
            </p>
          </div>
        </section>

        <div className="after-hero-spacing" />

        {/* NAVIGATION SECTION */}
        <section aria-labelledby="shop-navigation">
          <h2 id="shop-navigation" className="sr-only">Shop by Category</h2>

          {/* BUTTON GROUP */}
          <nav ref={buttonGroupRef} className={`button-group ${showButtons ? 'fade-in' : ''}`} aria-label="Shop categories">
            <Link href="/shop/digital" className="info-button" aria-label="Browse music scores and transcriptions">SCORES</Link>
            <Link href="/shop/digital" className="info-button" aria-label="Browse stems and sample packs">STEMS & SAMPLES</Link>
            <Link href="/shop/merch" className="info-button" aria-label="Browse merchandise and apparel">MERCH</Link>
            <Link href="/shop/music" className="info-button" aria-label="Browse physical album releases">PHYSICAL ALBUMS</Link>
            <a
              href="https://undaalunda.bandcamp.com/album/dark-wonderful-world-live-in-thailand"
              className="info-button"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Purchase digital albums on Bandcamp"
            >
              DIGITAL ALBUMS
            </a>
          </nav>
          <p className="since-note">Delivering Worldwide Since 2025</p>
        </section>

        {/* VIDEO SECTION */}
        <section ref={videoRef} className={`video-section ${showVideo ? 'fade-in' : ''}`} aria-labelledby="video-section-title">
          <h2 id="video-section-title" className="sr-only">Featured Performance Video</h2>
          {showVideo ? (
            <iframe
              className="youtube-frame"
              src="https://www.youtube.com/embed/ZwXeCx8cAIM"
              title="Unda Alunda - Anomic Live Performance in Thailand"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              aria-label="Watch Unda Alunda perform Anomic live in Thailand"
            />
          ) : (
            <div className="youtube-frame loading-state" style={{ backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff' }} aria-live="polite">Loading video...</span>
            </div>
          )}
        </section>

        {/* TRANSCRIPTION SECTION */}
        <section className="transcription-section" aria-labelledby="transcriptions-title">
          <div ref={transcriptionRef} className={`fade-trigger ${showTranscriptions ? 'fade-in' : ''}`}>
            <p className="transcription-sub" aria-hidden="true">LEARN THE MUSIC</p>
            <h2 id="transcriptions-title" className="transcription-title">TRANSCRIPTIONS</h2>
            <div className="product-row" role="list" aria-label="Available transcription books">
              {["guitar", "keys", "bass", "drums"].map((inst, i) => (
                <Link 
                  href="/shop/digital" 
                  key={i} 
                  className="product-item product-label-link"
                  role="listitem"
                  aria-label={`Dark Wonderful World complete ${inst} transcription book`}
                >
                  <Image
                    src={`/product-${inst}.webp`}
                    alt={`Dark Wonderful World ${inst} transcription book cover`}
                    width={200}
                    height={200}
                    className="product-image"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 200px"
                  />
                  <div className="product-label-group">
                    <h3 className="product-title">
                      DARK WONDERFUL WORLD
                      <span className="product-subtitle block">
                        THE COMPLETE {inst.toUpperCase()} TRANSCRIPTION
                      </span>
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="shopall-button-wrapper">
              <Link 
                href="/shop/digital" 
                className="info-button"
                aria-label="View all digital transcriptions and scores"
              >SHOP ALL</Link>
            </div>
          </div>
        </section>

        {/* STEMS SECTION */}
        <section className="stems-section" aria-labelledby="stems-title">
          <div ref={stemsRef} className={`fade-trigger ${showStems ? 'fade-in' : ''}`}>
            <p className="stems-sub" aria-hidden="true">JAM THE TRACKS</p>
            <h2 id="stems-title" className="stems-title">STEMS & BACKINGS</h2>
            <div className="stems-row" role="list" aria-label="Available backing tracks and stems">
              {allItems
                .filter((item) => item.category === 'Backing Track')
                .map((item) => (
                  <Link
                    href={`/product/${item.id}`}
                    key={item.id}
                    className="stems-item product-label-link is-backing"
                    role="listitem"
                    aria-label={`${item.title} backing track - $${typeof item.price === 'object' ? item.price.sale.toFixed(2) : item.price.toFixed(2)}`}
                  >
                    <Image
                      src={item.image}
                      alt={`${item.title} backing track cover art`}
                      width={200}
                      height={200}
                      className="stems-image"
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
                    />
                    <div className="stems-label-group">
                      <h3 className="sr-only">{`${item.title} – ${item.subtitle}`}</h3>
                      <p className="stems-title-text">{item.title}</p>
                      <p className="stems-subtitle-tiny">
                        {item.subtitle
                          .replace(' BACKING TRACK', '')
                          .replace(' STEM', '')
                          .replace(' TAB', '')}
                      </p>
                      <span className="backing-line" aria-hidden="true"></span>
                      <p className="stems-subtitle-tiny tracking-wide uppercase text-center backing-text">
                        BACKING TRACK
                      </p>
                      <p className="stems-price" aria-label={`Price: $${typeof item.price === 'object' ? item.price.sale.toFixed(2) : item.price.toFixed(2)}`}>
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
              <Link 
                href="/shop?tab=DIGITAL" 
                className="info-button"
                aria-label="View all digital stems and backing tracks"
              >
                SHOP ALL
              </Link>
            </div>
          </div>
        </section>

        {/* MUSIC & MERCH */}
        <section className="stems-section" aria-labelledby="music-merch-title">
          <div ref={musicMerchRef} className={`fade-trigger ${showMerch ? 'fade-in' : ''}`}>
            <p className="stems-sub" aria-hidden="true">MUSIC IN YOUR HANDS</p>
            <h2 id="music-merch-title" className="stems-title">MUSIC & MERCH</h2>
            <div className="stems-row" role="list" aria-label="Available music and merchandise">
              {homepageItems.map((item) => (
                <Link 
                  href={`/product/${item.id}`} 
                  key={item.id} 
                  className="stems-item product-label-link"
                  role="listitem"
                  aria-label={`${item.title} - ${typeof item.price === 'object' && item.price !== null 
                    ? `Sale price ${item.price.sale.toFixed(2)}, was ${item.price.original.toFixed(2)}` 
                    : typeof item.price === 'number' 
                      ? `${item.price.toFixed(2)}` 
                      : 'Price available on product page'}`}
                >
                  <Image 
                    src={item.image} 
                    alt={`${item.title} product image`}
                    width={200} 
                    height={200} 
                    className="stems-image"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
                  />
                  <div className="stems-label-group">
                    <h3 className="sr-only">{`${item.title} – ${item.subtitle.replace(' BACKING TRACK', '').replace(' STEM', '').replace(' TAB', '')}`}</h3>
                    <p className="stems-title-text">{item.title}</p>
                    <p className="stems-subtitle-tiny">
                      {item.subtitle
                        .replace(' BACKING TRACK', '')
                        .replace(' STEM', '')
                        .replace(' TAB', '')}
                    </p>
                    <p className="stems-price">
                      {typeof item.price === 'object' && item.price !== null
                        ? <>
                            <span className="line-through mr-1 text-[#f8fcdc]" aria-label={`Original price ${item.price.original.toFixed(2)}`}>
                              ${item.price.original.toFixed(2)}
                            </span>
                            <span className="text-[#cc3f33]" aria-label={`Sale price ${item.price.sale.toFixed(2)}`}>
                              ${item.price.sale.toFixed(2)}
                            </span>
                          </>
                        : typeof item.price === 'number'
                          ? <span aria-label={`Price ${item.price.toFixed(2)}`}>${item.price.toFixed(2)}</span>
                          : null}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="shopall-button-wrapper">
              <Link 
                href="/shop?tab=MERCH" 
                className="info-button"
                aria-label="View all music and merchandise"
              >SHOP ALL</Link>
            </div>
          </div>
        </section>

        {/* TOUR SECTION */}
        <section ref={tourRef} className="tour-section" aria-labelledby="tour-dates-title">
          <div className={`fade-trigger ${showTour ? 'fade-in' : ''}`}>
            <p className="stems-sub" aria-hidden="true">SEE IT LIVE</p>
            <h2 id="tour-dates-title" className="stems-title">TOUR DATES</h2>
            <h3 className="sr-only">Upcoming Concert Dates and Ticket Information</h3>
          </div>
          <div className="tour-widget-container">
            <div style={{ textAlign: 'left' }}>
              {showBandsintown ? (
                <Suspense fallback={
                  <div 
                    style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fcdc' }}
                    aria-live="polite"
                    aria-label="Loading tour dates and concert information"
                  >
                    Loading tour dates...
                  </div>
                }>
                  <BandsinTownWidget />
                </Suspense>
              ) : (
                <div style={{ height: '400px' }} aria-hidden="true" />
              )}
            </div>
          </div>
        </section>
      </main>
    </AppClientWrapper>
  );
}