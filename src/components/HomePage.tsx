/* HomePage.tsx */

'use client';

import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { allItems } from '@/components/allItems';
import AppClientWrapper from '@/components/AppClientWrapper';

// 🚀 Import Optimized Image Components
import { HeroImage, ProductImage } from '@/components/OptimizedImage';

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
  const router = useRouter();
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

  // Hero video states - เพิ่มแค่นี้
  const [showHeroVideo, setShowHeroVideo] = useState(true);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0); // 0 = video, 1 = image
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // Hero slide functions
  const goToHeroSlide = (slideIndex: number) => {
    setCurrentHeroSlide(slideIndex);
    if (slideIndex === 0) {
      setShowHeroVideo(true);
      if (heroVideoRef.current) {
        heroVideoRef.current.currentTime = 0;
        heroVideoRef.current.play();
      }
    } else {
      setShowHeroVideo(false);
    }
  };

  // 🚀 Smart Link Click Handlers - Clean URLs with sessionStorage
  const createNavigationHandler = (
    targetPath: string, 
    filterType?: string, 
    instrument?: string, 
    physicalTab?: string
  ) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      
      if (typeof window === 'undefined') return;
      
      // Create navigation context for target page
      const navigationContext: any = {
        from: 'homepage',
        returnUrl: '/'
      };
      
      // Add filter context for album hub
      if (filterType) {
        navigationContext.filter = filterType;
      }
      if (instrument) {
        navigationContext.instrument = instrument;
      }
      
      // Add tab context for physical shop
      if (physicalTab) {
        navigationContext.tab = physicalTab;
      }
      
      // Store context and navigate with clean URL
      sessionStorage.setItem('navigationContext', JSON.stringify(navigationContext));
      router.push(targetPath);
    };
  };

  useEffect(() => {
    // Intersection Observer for fade-in animations
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
      <main className="homepage-main" style={{ overflow: 'visible' }}>
        <h1 className="sr-only">Unda Alunda | Official Website & Merch Store</h1>

        {/* HERO SECTION - เปลี่ยน BACKGROUND เป็น VIDEO */}
        <div className="hero-wrapper" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100vh',
          paddingTop: '3rem'
        }}>
          {/* Hero Video Background */}
          {showHeroVideo ? (
            <video
              ref={heroVideoRef}
              muted
              autoPlay
              playsInline
              onEnded={() => {
                setShowHeroVideo(false);
                setCurrentHeroSlide(1);
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: -1,
                pointerEvents: 'none',
                maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0) 100%)'
              }}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(/hero-video-fallback.webp)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: -1
                }}
              />
            </video>
          ) : (
            <div className="catmoon-background" />
          )}
          
          {/* Spacer เพื่อผลัก hero text image ไปตรงกลาง */}
          <div style={{ flex: 1.0 }} />
          
          {/* 🎯 Hero Text Image - อยู่ตรงกลาง */}
          <div 
            className="hero-image-container"
            style={{
              visibility: showHeroVideo ? 'hidden' : 'visible'
            }}
          >
            <HeroImage
              src="/text-hero-section.webp"
              alt="Dark Wonderful World on Moon"
              height={400}
              width={600}
              quality={100}
              priority={true}
              unoptimized={true}
              sizes="(max-width: 480px) 300px, (max-width: 768px) 500px, 600px"
            />
          </div>

          {/* 🎯 Video Hero Overlay - วางทับตอน video เล่น */}
          <div 
            className="video-hero-overlay"
            style={{
              display: showHeroVideo ? 'block' : 'none',
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 10
            }}
          >
            {/* Logo */}
            <div className="video-hero-logo" style={{ 
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <HeroImage
                src="/unda-alunda-header.webp"
                alt="Unda Alunda Logo"
                height={80}
                width={400}
                quality={100}
                priority={true}
                unoptimized={true}
                sizes="(max-width: 480px) 400px, (max-width: 768px) 500px, (max-width: 1279px) 550px, 650px"
              />
            </div>

            {/* Dark Wonderful World */}
            <h2 className="video-hero-title" style={{ fontWeight: '300' }}>
              Dark Wonderful World
            </h2>

            {/* Live in Thailand */}
            <p className="video-hero-subtitle">
              Live in Thailand (2024) Full Concert
            </p>

            {/* Watch Full Video Button */}
            <a
              href="https://www.youtube.com/watch?v=ZwXeCx8cAIM"
              target="_blank"
              rel="noopener noreferrer"
              className="video-hero-button"
              style={{ 
                fontWeight: '100',
                letterSpacing: '0.08em',
                opacity: '0.7'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc9e63';
                e.currentTarget.style.color = '#0d0d0d';
                e.currentTarget.style.borderColor = '#dc9e63';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#f8fcdc';
                e.currentTarget.style.borderColor = 'rgba(248, 252, 220, 0.3)';
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 'inherit' }}>&#9654;</span>
              WATCH FULL VIDEO
            </a>
          </div>
          
          {/* Spacer เพื่อผลัก hero text ไปด้านล่าง */}
          <div style={{ flex: 1.5 }} />
          
          {/* 🎯 Hero Text - อยู่ด้านล่างเหมือนเดิม */}
          <div style={{ marginBottom: '0vh' }}>
            <div className="hero-text desktop-only">
              <p className="hero-line1">
                THE NEW ALBUM'S COMING <span className="highlight">August 26<sup style={{ fontSize: '0.6em', marginLeft: '-0.1em' }}>th</sup> 2025</span>
              </p>
              <p className="hero-line2">
                AVAILABLE NOW TO <Link href="/shop/physical" onClick={createNavigationHandler('/shop/physical', undefined, undefined, 'merch')} className="hero-cta-link">PRE-ORDER</Link> &{' '}
                <a href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" target="_blank" rel="noopener noreferrer" className="hero-cta-link">
                  PRE-SAVE
                </a>
              </p>
            </div>
            
            <div className="hero-text mobile-only">
              <p className="hero-line1">THE NEW ALBUM'S COMING</p>
              <p className="hero-line1"><span className="highlight">August 26<sup style={{ fontSize: '0.6em', marginLeft: '-0.1em' }}>th</sup> 2025</span></p>
              <p className="hero-line2">AVAILABLE NOW TO</p>
              <p className="hero-line2">
                <Link href="/shop/physical" onClick={createNavigationHandler('/shop/physical', undefined, undefined, 'merch')} className="hero-cta-link">PRE-ORDER</Link> &{' '}
                <a href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" target="_blank" rel="noopener noreferrer" className="hero-cta-link">
                  PRE-SAVE
                </a>
              </p>
            </div>

            {/* Hero Navigation Dots */}
            <div className="hero-dots" style={{ 
              position: 'absolute', 
              bottom: '2rem', 
              left: '50%', 
              transform: 'translateX(-50%)',
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0px',
              zIndex: 10
            }}>
              <button 
                className={`hero-dot ${currentHeroSlide === 0 ? 'active' : ''}`}
                onClick={() => goToHeroSlide(0)}
                aria-label="Show hero video"
                style={{
                  position: 'relative',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '20px', // พื้นที่กดใหญ่
                  margin: '0'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: '1px solid rgba(248, 252, 220, 0.6)',
                  backgroundColor: currentHeroSlide === 0 ? '#f8fcdc' : 'transparent',
                  transition: 'all 0.3s ease',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }} />
              </button>
              <button 
                className={`hero-dot ${currentHeroSlide === 1 ? 'active' : ''}`}
                onClick={() => goToHeroSlide(1)}
                aria-label="Show hero image"
                style={{
                  position: 'relative',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '20px', // พื้นที่กดใหญ่
                  margin: '0'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: '1px solid rgba(248, 252, 220, 0.6)',
                  backgroundColor: currentHeroSlide === 1 ? '#f8fcdc' : 'transparent',
                  transition: 'all 0.3s ease',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }} />
              </button>
            </div>
          </div>
        </div>

        <div className="after-hero-spacing" />
        <h2 className="sr-only">Shop by Category</h2>

        {/* BUTTON GROUP */}
        <div ref={buttonGroupRef} className={`button-group ${showButtons ? 'fade-in' : ''}`}>
          <Link 
            href="/shop/digital/dark-wonderful-world" 
            onClick={createNavigationHandler('/shop/digital/dark-wonderful-world', 'tabs', 'all')}
            className="info-button"
          >
            SCORES
          </Link>
          <Link 
            href="/shop/digital/dark-wonderful-world" 
            onClick={createNavigationHandler('/shop/digital/dark-wonderful-world', 'stems', 'all')}
            className="info-button"
          >
            STEMS & SAMPLES
          </Link>
          <Link 
            href="/shop/physical" 
            onClick={createNavigationHandler('/shop/physical', undefined, undefined, 'merch')}
            className="info-button"
          >
            MERCH
          </Link>
          <Link 
            href="/shop/physical" 
            onClick={createNavigationHandler('/shop/physical', undefined, undefined, 'music')}
            className="info-button"
          >
            PHYSICAL ALBUMS
          </Link>
          <a
            href="https://undaalunda.bandcamp.com/album/dark-wonderful-world-live-in-thailand"
            className="info-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            DIGITAL ALBUMS
          </a>
        </div>
        <p className="since-note">Delivering Worldwide Since 2025</p>

        {/* VIDEO SECTION */}
        <section ref={videoRef} className={`video-section ${showVideo ? 'fade-in' : ''}`}>
          <h2 className="sr-only">Watch on YouTube</h2>
          {showVideo ? (
            <iframe
              className="youtube-frame"
              src="https://www.youtube.com/embed/ZwXeCx8cAIM"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="youtube-frame" style={{ backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff' }}>Loading video...</span>
            </div>
          )}
        </section>

        {/* TRANSCRIPTION SECTION - 🚀 OPTIMIZED */}
        <section className="transcription-section">
          <div ref={transcriptionRef} className={`fade-trigger ${showTranscriptions ? 'fade-in' : ''}`}>
            <p className="transcription-sub">LEARN THE MUSIC</p>
            <h2 className="transcription-title">TRANSCRIPTIONS</h2>
            <div className="product-row">
              {["guitar", "keys", "bass", "drums"].map((inst, i) => (
                <Link 
                  href="/shop/digital/dark-wonderful-world" 
                  onClick={(e) => {
                    e.preventDefault();
                    
                    const context = {
                      from: 'homepage',
                      returnUrl: '/',
                      filter: 'tabs',
                      instrument: inst
                    };
                    
                    sessionStorage.setItem('navigationContext', JSON.stringify(context));
                    router.push('/shop/digital/dark-wonderful-world');
                  }}
                  key={i} 
                  className="product-item product-label-link"
                >
                  <ProductImage
                    src={`/product-${inst}.webp`}
                    alt={`${inst} Book`}
                    width={200}
                    height={200}
                    className="product-image"
                    quality={95}
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
                href="/shop/digital/dark-wonderful-world" 
                onClick={createNavigationHandler('/shop/digital/dark-wonderful-world', 'tabs', 'all')}
                className="info-button"
              >
                SHOP ALL
              </Link>
            </div>
          </div>
        </section>

        {/* STEMS SECTION - 🚀 OPTIMIZED */}
        <section className="stems-section">
          <div ref={stemsRef} className={`fade-trigger ${showStems ? 'fade-in' : ''}`}>
            <p className="stems-sub">JAM THE TRACKS</p>
            <h2 className="stems-title">STEMS & BACKINGS</h2>
            <div className="stems-row">
              {allItems
                .filter((item) => {
                  const selectedItems = [
                    'jyy-drums',
                    'anomic-guitars-stem',
                    'feign-keys-stem',
                    'consonance-guitars',
                    'the-dark-bass',
                    'atlantic-guitars-stem',
                    'red-down-keys',
                    'dark-wonderful-world-drums-stem'
                  ];
                  
                  return (item.category === 'Backing Track' || item.category === 'Stem') && selectedItems.includes(item.id);
                })
                .sort((a, b) => {
                  const patternOrder = [
                    'jyy-drums',
                    'anomic-guitars-stem',
                    'feign-keys-stem',
                    'consonance-guitars',
                    'the-dark-bass',
                    'atlantic-guitars-stem',
                    'red-down-keys',
                    'dark-wonderful-world-drums-stem'
                  ];
                  return patternOrder.indexOf(a.id) - patternOrder.indexOf(b.id);
                })
                .map((item) => (
                  <Link
                    href={item.url || `/product/${item.id}`}
                    key={item.id}
                    className="stems-item product-label-link is-backing"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="stems-image"
                      quality={95}
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
                      <span className="backing-line"></span>
                      <p className="stems-subtitle-tiny tracking-wide uppercase text-center backing-text">
                        {item.category === 'Stem' ? 'STEM' : 'BACKING TRACK'}
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
              <Link 
                href="/shop/digital/dark-wonderful-world" 
                onClick={createNavigationHandler('/shop/digital/dark-wonderful-world', 'backing', 'all')}
                className="info-button"
              >
                SHOP ALL
              </Link>
            </div>
          </div>
        </section>

        {/* MUSIC & MERCH - 🚀 OPTIMIZED */}
        <section className="stems-section">
          <div ref={musicMerchRef} className={`fade-trigger ${showMerch ? 'fade-in' : ''}`}>
            <p className="stems-sub">MUSIC IN YOUR HANDS</p>
            <h2 className="stems-title">MUSIC & MERCH</h2>
            <div className="stems-row">
              {homepageItems.map((item) => (
                <Link href={item.url || `/product/${item.id}`} key={item.id} className="stems-item product-label-link">
                  <ProductImage 
                    src={item.image} 
                    alt={item.title} 
                    width={200} 
                    height={200} 
                    className="stems-image"
                    quality={95}
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
              <Link 
                href="/shop/physical" 
                onClick={createNavigationHandler('/shop/physical', undefined, undefined, 'merch')}
                className="info-button"
              >
                SHOP ALL
              </Link>
            </div>
          </div>
        </section>

        {/* TOUR SECTION */}
        <section ref={tourRef} className="tour-section">
          <div className={`fade-trigger ${showTour ? 'fade-in' : ''}`}>
            <p className="stems-sub">SEE IT LIVE</p>
            <h2 className="stems-title">TOUR DATES</h2>
            <h3 className="sr-only">Upcoming Tour dates from Bandsintown Widget</h3>
          </div>
          <div className="tour-widget-container">
            <div style={{ textAlign: 'left' }}>
              {showBandsintown ? (
                <Suspense fallback={<div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fcdc' }}>Loading tour dates...</div>}>
                  <BandsinTownWidget />
                </Suspense>
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