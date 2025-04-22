'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import NewsletterForm from '../components/NewsletterForm';

export default function HomePage() {
  const videoRef = useRef(null);
  const transcriptionRef = useRef(null);
  const stemsRef = useRef(null);
  const buttonGroupRef = useRef(null);
  const musicMerchRef = useRef(null);
  const tourRef = useRef(null);
  const newsletterRef = useRef(null);

  const [isClient, setIsClient] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showTranscriptions, setShowTranscriptions] = useState(false);
  const [showStems, setShowStems] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showMerch, setShowMerch] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
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
      {
        threshold: 0.01,
        rootMargin: '0px 0px -50% 0px',
      }
    );

    [videoRef, transcriptionRef, stemsRef, buttonGroupRef, musicMerchRef, tourRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      [videoRef, transcriptionRef, stemsRef, buttonGroupRef, musicMerchRef, tourRef].forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
    <main className="homepage-main" style={{ overflow: 'visible' }}>
      {/* 👇 Only load widget client-side */}
      {isClient && (
        <Script
          src="https://widget.bandsintown.com/main.min.js"
          strategy="afterInteractive"
        />
      )}

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

      <div>
        <div ref={buttonGroupRef} className={`button-group ${showButtons ? 'fade-in' : ''}`}>
          <Link href="/scores" className="info-button">SCORES</Link>
          <Link href="/stems-samples" className="info-button">STEMS & SAMPLES</Link>
          <Link href="/merch" className="info-button">MERCH</Link>
          <Link href="/physical" className="info-button">PHYSICAL ALBUMS</Link>
          <Link href="/digital" className="info-button">DIGITAL ALBUMS</Link>
        </div>
        <p className="since-note">Delivering Worldwide Since 2025</p>
      </div>

      <section ref={videoRef} className={`video-section ${showVideo ? 'fade-in' : ''}`}>
        <iframe
          className="youtube-frame"
          src="https://www.youtube.com/embed/ZwXeCx8cAIM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </section>

      <section className="transcription-section">
        <div ref={transcriptionRef} className={`fade-trigger ${showTranscriptions ? 'fade-in' : ''}`}>
          <h2 className="transcription-sub">LEARN THE MUSIC</h2>
          <h3 className="transcription-title">TRANSCRIPTIONS</h3>
          <div className="product-row">
            {["guitar", "keys", "bass", "drums"].map((inst, i) => (
              <Link href={`/${inst}`} key={i} className="product-item product-label-link">
                <img src={`/product-${inst}.png`} alt={`${inst} Book`} className="product-image" />
                <div className="product-label-group">
                  <p className="product-title">DARK WONDERFUL WORLD</p>
                  <p className="product-subtitle">THE COMPLETE {inst.toUpperCase()} TRANSCRIPTION</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="shopall-button-wrapper">
            <Link href="/shop" className="info-button">SHOP ALL</Link>
          </div>
        </div>
      </section>

      <section className="stems-section">
        <div ref={stemsRef} className={`fade-trigger ${showStems ? 'fade-in' : ''}`}>
          <h2 className="stems-sub">JAM THE TRACKS</h2>
          <h3 className="stems-title">STEMS & BACKING TRACKS</h3>
          <div className="stems-row">
            {[
              { src: '/anomic-no-drums.jpg', title: 'ANOMIC', type: 'DRUMS', price: '$8.00' },
              { src: '/jyy-no-guitars.jpg', title: 'JYY', type: 'GUITARS', price: '$8.00' },
              { src: '/atlantic-no-lead-guitar.jpg', title: 'ATLANTIC', type: 'LEAD GUITAR', price: '$9.00' },
              { src: '/out-of-the-dark-no-drums.jpg', title: 'OUT OF THE DARK', type: 'DRUMS', price: '$12.00' },
              { src: '/feign-no-guitars.jpg', title: 'FEIGN', type: 'GUITARS', price: '$12.00' },
              { src: '/the-dark-no-keys.jpg', title: 'THE DARK', type: 'KEYS', price: '$5.00' },
              { src: '/reddown-no-bass.jpg', title: 'RED DOWN', type: 'BASS', price: '$8.00' },
              { src: '/quietness-no-bass.jpg', title: 'QUIETNESS', type: 'BASS', price: '$8.00' },
            ].map((product, i) => (
              <Link href="/shop" key={i} className="stems-item product-label-link">
                <img src={product.src} alt={product.title} className="stems-image" />
                <div className="stems-label-group">
                  <p className="stems-title-text">{product.title}</p>
                  <p className="stems-subtitle-tiny">{product.type}</p>
                  <span className="backing-line always-on"></span>
                  <p className="stems-subtitle-tiny tracking-wide uppercase text-center backing-text">BACKING TRACK</p>
                  <p className="stems-price text-[#f8fcdc]">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="shopall-button-wrapper">
            <Link href="/shop" className="info-button">SHOP ALL</Link>
          </div>
        </div>
      </section>

      <section className="stems-section">
        <div ref={musicMerchRef} className={`fade-trigger ${showMerch ? 'fade-in' : ''}`}>
          <h2 className="stems-sub">MUSIC IN YOUR HANDS</h2>
          <h3 className="stems-title">MUSIC & MERCH</h3>
          <div className="stems-row">
            {[
              { src: '/audio-digipak-dww.png', title: 'DARK WONDERFUL WORLD', type1: 'AUDIO ALBUM CD (DIGIPAK)', price: '$25.00' },
              { src: '/live-cd-dww.png', title: 'DARK WONDERFUL WORLD', type1: 'LIVE ALBUM CD', price: '$15.00' },
              { src: '/black-cats-scores-tee.png', title: 'CAT SCORES T-SHIRT', type1: 'BLACK', price: '$29.95' },
              { src: '/white-cats-scores-tee.png', title: 'CAT SCORES T-SHIRT', type1: 'WHITE', price: '$29.95' },
              { src: '/a-cat-to-the-moon-stickers.png', title: 'A CAT TO THE MOON', type1: 'STICKERS', price: '$5.00' },
              { src: '/a-musician-cats.png', title: 'A MUSICIAN CATS', type1: 'STICKERS', price: '$5.00' },
              { src: '/unda-alunda-sign-keychain.png', title: 'UNDA ALUNDA', type1: 'SIGNED KEYCHAIN', price: '$9.95' },
              { src: '/full-guitars-transcription.png', title: 'FULL GUITARS TRANSCRIPTION', type1: 'PRINTED BOOK', price: '$49.95' },
              { src: '/dark-wonderful-world-album-merch-bundle.png', title: 'DARK WONDERFUL WORLD', type1: 'ALBUM MERCH BUNDLE', price: { original: '$64.90', sale: '$51.92' } },
              { src: '/dark-wonderful-world-book-&-merch-bundle.png', title: 'DARK WONDERFUL WORLD', type1: 'BOOK & MERCH BUNDLE', price: { original: '$84.90', sale: '$67.92' } },
              { src: '/dark-wonderful-world-book-&-bonus-merch-bundle.png', title: 'DARK WONDERFUL WORLD', type1: 'BOOK & BONUS MERCH BUNDLE', price: { original: '$94.90', sale: '$75.92' } },
              { src: '/dark-wonderful-world-dual-album-merch-bundle.png', title: 'DARK WONDERFUL WORLD', type1: 'DUAL ALBUM MERCH BUNDLE', price: { original: '$109.85', sale: '$87.88' } },
            ].map((item, i) => (
              <Link href="/shop" key={i} className="stems-item product-label-link">
                <img src={item.src} alt={item.title} className="stems-image" />
                <div className="stems-label-group">
                  <p className="stems-title-text">{item.title}</p>
                  <p className="stems-subtitle-tiny">{item.type1}</p>
                  {typeof item.price === 'string' ? (
                    <p className="stems-price text-[#f8fcdc]">{item.price}</p>
                  ) : (
                    <p className="stems-price">
                      <span className="line-through mr-1 text-[#f8fcdc]">{item.price.original}</span>
                      <span className="text-[#cc3f33]">{item.price.sale}</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="shopall-button-wrapper">
            <Link href="/shop" className="info-button">SHOP ALL</Link>
          </div>
        </div>
      </section>

      {/* 👇 TOUR SECTION */}
<section ref={tourRef} className="tour-section">
  <div className={`fade-trigger ${showTour ? 'fade-in' : ''}`}>
    <h2 className="stems-sub">SEE IT LIVE</h2>
    <h3 className="stems-title">TOUR DATES</h3>
  </div>
  <div className="tour-widget-container">
    <div style={{ textAlign: 'left' }}>
      {isClient ? (
        <div className="bit-widget-initializer"
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
  );
}
