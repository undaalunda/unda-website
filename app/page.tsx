'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const videoRef = useRef<HTMLDivElement>(null);
  const transcriptionRef = useRef<HTMLDivElement>(null);
  const stemsRef = useRef<HTMLDivElement>(null);

  const [showVideo, setShowVideo] = useState(false);
  const [showTranscriptions, setShowTranscriptions] = useState(false);
  const [showStems, setShowStems] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === videoRef.current) setShowVideo(true);
            if (entry.target === transcriptionRef.current) setShowTranscriptions(true);
            if (entry.target === stemsRef.current) setShowStems(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    if (transcriptionRef.current) observer.observe(transcriptionRef.current);
    if (stemsRef.current) observer.observe(stemsRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
      if (transcriptionRef.current) observer.unobserve(transcriptionRef.current);
      if (stemsRef.current) observer.unobserve(stemsRef.current);
    };
  }, []);

  return (
    <main className="homepage-main">
      {/* 🎬 YouTube Video */}
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

      {/* 🎼 Learn the Music */}
<section className="transcription-section">
  <div ref={transcriptionRef} className={`fade-trigger ${showTranscriptions ? 'fade-in' : ''}`}>
    <h2 className="transcription-sub">LEARN THE MUSIC</h2>
    <h3 className="transcription-title">Transcriptions</h3>

    <div className="product-row">
      <Link href="/guitar" className="product-item product-label-link">
        <img src="/product-guitar.png" alt="Guitar Book" className="product-image" />
        <div className="product-label-group">
          <p className="product-title">Dark Wonderful World</p>
          <p className="product-subtitle">The Complete GUITARS Transcription</p>
        </div>
      </Link>

      <Link href="/keys" className="product-item product-label-link">
        <img src="/product-keys.png" alt="Keys Book" className="product-image" />
        <div className="product-label-group">
          <p className="product-title">Dark Wonderful World</p>
          <p className="product-subtitle">The Complete KEYS Transcription</p>
        </div>
      </Link>

      <Link href="/bass" className="product-item product-label-link">
        <img src="/product-bass.png" alt="Bass Book" className="product-image" />
        <div className="product-label-group">
          <p className="product-title">Dark Wonderful World</p>
          <p className="product-subtitle">The Complete BASS Transcription</p>
        </div>
      </Link>

      <Link href="/drums" className="product-item product-label-link">
        <img src="/product-drums.png" alt="Drums Book" className="product-image" />
        <div className="product-label-group">
          <p className="product-title">Dark Wonderful World</p>
          <p className="product-subtitle">The Complete DRUMS Transcription</p>
        </div>
      </Link>
    </div>

    <div className="shopall-button-wrapper">
      <Link href="/shop" className="info-button">SHOP ALL</Link>
    </div>
  </div>
</section>

{/* 🎸 Jam the Tracks */}
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