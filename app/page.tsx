'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const videoRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  const [showVideo, setShowVideo] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === videoRef.current) setShowVideo(true);
            if (entry.target === productRef.current) setShowProducts(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    if (productRef.current) observer.observe(productRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
      if (productRef.current) observer.unobserve(productRef.current);
    };
  }, []);

  return (
    <main className="homepage-main">
      {/* 🎬 YouTube Video */}
      <section
        ref={videoRef}
        className={`video-section ${showVideo ? 'fade-in' : ''}`}
      >
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
      <section
        ref={productRef}
        className={`transcription-section ${showProducts ? 'fade-in-section' : ''}`}
      >
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

        {/* 🛒 SHOP ALL BUTTON */}
        <div className="shopall-button-wrapper">
          <Link href="/shop" className="info-button">
            SHOP ALL
          </Link>
        </div>
      </section>

      {/* 🎸 Jam the Tracks */}
<section className={`transcription-section ${showProducts ? 'fade-in-section' : ''}`}>
  <h2 className="transcription-sub">JAM THE TRACKS</h2>
  <h3 className="transcription-title">Stems & Backing tracks</h3>

  <div className="product-row">
    {[
      { src: '/anomic-no-drums.jpg', title: 'ANOMIC', type: 'DRUMS', price: '$18.00' },
      { src: '/jyy-no-guitars.jpg', title: 'JYY', type: 'GUITARS', price: '$18.00' },
      { src: '/atlantic-no-lead-guitar.jpg', title: 'ATLANTIC', type: 'LEAD GUITAR', price: '$19.00' },
      { src: '/out-of-the-dark-no-drums.jpg', title: 'OUT OF THE DARK', type: 'DRUMS', price: '$22.00' },
      { src: '/feign-no-guitars.jpg', title: 'FEIGN', type: 'GUITARS', price: '$22.00' },
      { src: '/the-dark-no-keys.jpg', title: 'THE DARK', type: 'KEYS', price: '$15.00' },
      { src: '/atlantic-no-bass.jpg', title: 'ATLANTIC', type: 'BASS', price: '$22.00' },
      { src: '/feign-no-bass.jpg', title: 'FEIGN', type: 'BASS', price: '$22.00' },
    ].map((product, i) => (
      <div key={i} className="product-item">
        <img src={product.src} alt={product.title} className="product-image" />
        <div className="product-label-group">
          <p className="product-title">Dark Wonderful World</p>
          <p className="product-subtitle">{product.title}</p>
          <p className="product-subtitle-small">{product.type}</p>
          <p className="product-subtitle-small">Backing track</p>
          <p className="product-price">{product.price}</p>
        </div>
      </div>
    ))}
  </div>
</section>
    </main>
  );
}