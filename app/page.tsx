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
              <p className="product-subtitle">The Complete Guitar Transcription</p>
            </div>
          </Link>

          <Link href="/keys" className="product-item product-label-link">
            <img src="/product-keys.png" alt="Keys Book" className="product-image" />
            <div className="product-label-group">
              <p className="product-title">Dark Wonderful World</p>
              <p className="product-subtitle">The Complete Keys Transcription</p>
            </div>
          </Link>

          <Link href="/bass" className="product-item product-label-link">
            <img src="/product-bass.png" alt="Bass Book" className="product-image" />
            <div className="product-label-group">
              <p className="product-title">Dark Wonderful World</p>
              <p className="product-subtitle">The Complete Bass Transcription</p>
            </div>
          </Link>

          <Link href="/drums" className="product-item product-label-link">
            <img src="/product-drums.png" alt="Drums Book" className="product-image" />
            <div className="product-label-group">
              <p className="product-title">Dark Wonderful World</p>
              <p className="product-subtitle">The Complete Drums Transcription</p>
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
    </main>
  );
}