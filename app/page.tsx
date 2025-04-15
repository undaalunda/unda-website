'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const videoRef = useRef<HTMLDivElement>(null);
  const transcriptionRef = useRef<HTMLDivElement>(null);
  const stemsRef = useRef<HTMLDivElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);

  const [showVideo, setShowVideo] = useState(false);
  const [showTranscriptions, setShowTranscriptions] = useState(false);
  const [showStems, setShowStems] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === videoRef.current) setShowVideo(true);
            if (entry.target === transcriptionRef.current) setShowTranscriptions(true);
            if (entry.target === stemsRef.current) setShowStems(true);
            if (entry.target === buttonGroupRef.current) setShowButtons(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px',
      }
    );

    [videoRef, transcriptionRef, stemsRef, buttonGroupRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      [videoRef, transcriptionRef, stemsRef, buttonGroupRef].forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
    <main className="homepage-main">
      {/* 🪐 Hero Section */}
      <div className="hero-wrapper">
        <div className="catmoon-background" />

        {/* 🔥 Logo Header Image */}
        <div className="hero-header-image">
          <Image
            src="/unda-alunda-header.png"
            alt="Unda Alunda Header"
            width={500}
            height={150}
            priority
          />
        </div>

        {/* 🧊 Text Over Moon */}
        <div className="hero-text-image">
          <Image
            src="/text-hero-section.png"
            alt="Dark Wonderful World on Moon"
            height={400}
            width={600}
            priority
          />
        </div>

        {/* 📣 Desktop Text */}
        <div className="hero-text desktop-only">
          <p className="hero-line1">
            THE NEW ALBUM'S COMING <span className="highlight">MAY 1 2025</span>
          </p>
          <p className="hero-line2">
            AVAILABLE NOW TO{' '}
            <Link href="/preorder" className="hero-cta-link">PRE-ORDER</Link>{' '}
            &{' '}
            <Link href="/presave" className="hero-cta-link">PRE-SAVE</Link>
          </p>
        </div>

        {/* 📱 Mobile Text */}
        <div className="hero-text mobile-only">
          <p className="hero-line1">THE NEW ALBUM'S COMING</p>
          <p className="hero-line1"><span className="highlight">MAY 1 2025</span></p>
          <p className="hero-line2">AVAILABLE NOW TO</p>
          <p className="hero-line2">
            <Link href="/preorder" className="hero-cta-link">PRE-ORDER</Link>{' '}
            &{' '}
            <Link href="/presave" className="hero-cta-link">PRE-SAVE</Link>
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="after-hero-spacing" />

      {/* 🧭 Button Section + Since */}
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

      {/* 🎬 YouTube Section */}
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

      {/* 🎼 Transcriptions */}
      <section className="transcription-section">
        <div ref={transcriptionRef} className={`fade-trigger ${showTranscriptions ? 'fade-in' : ''}`}>
          <h2 className="transcription-sub">LEARN THE MUSIC</h2>
          <h3 className="transcription-title">Transcriptions</h3>
          <div className="product-row">
            {["guitar", "keys", "bass", "drums"].map((inst, i) => (
              <Link href={`/${inst}`} key={i} className="product-item product-label-link">
                <img src={`/product-${inst}.png`} alt={`${inst} Book`} className="product-image" />
                <div className="product-label-group">
                  <p className="product-title">Dark Wonderful World</p>
                  <p className="product-subtitle">The Complete {inst.toUpperCase()} Transcription</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="shopall-button-wrapper">
            <Link href="/shop" className="info-button">SHOP ALL</Link>
          </div>
        </div>
      </section>

      {/* 🎸 Stems Section */}
      <section className="stems-section">
        <div ref={stemsRef} className={`fade-trigger ${showStems ? 'fade-in' : ''}`}>
          <h2 className="stems-sub">JAM THE TRACKS</h2>
          <h3 className="stems-title">Stems & Backing Tracks</h3>
          <div className="stems-row">
            {[
              { src: '/anomic-no-drums.jpg', title: 'ANOMIC', type: 'DRUMS', price: '$18.00' },
              { src: '/jyy-no-guitars.jpg', title: 'JYY', type: 'GUITARS', price: '$18.00' },
              { src: '/atlantic-no-lead-guitar.jpg', title: 'ATLANTIC', type: 'LEAD GUITAR', price: '$19.00' },
              { src: '/out-of-the-dark-no-drums.jpg', title: 'OUT OF THE DARK', type: 'DRUMS', price: '$22.00' },
              { src: '/feign-no-guitars.jpg', title: 'FEIGN', type: 'GUITARS', price: '$22.00' },
              { src: '/the-dark-no-keys.jpg', title: 'THE DARK', type: 'KEYS', price: '$15.00' },
              { src: '/reddown-no-bass.jpg', title: 'RED DOWN', type: 'BASS', price: '$18.00' },
              { src: '/quietness-no-bass.jpg', title: 'QUIETNESS', type: 'BASS', price: '$18.00' },
            ].map((product, i) => (
              <Link href="/shop" key={i} className="stems-item product-label-link">
                <img src={product.src} alt={product.title} className="stems-image" />
                <div className="stems-label-group">
                  <p className="stems-title-text">{product.title}</p>
                  <p className="stems-subtitle-tiny">{product.type}</p>
                  <p className="stems-subtitle-tiny">Backing track</p>
                  <p className="stems-price">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="shopall-button-wrapper">
            <Link href="/shop" className="info-button">SHOP ALL</Link>
          </div>
        </div>
      </section>
    </main>
  );
}