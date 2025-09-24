/* HomePage.tsx - Fixed Mobile Touch & Video Loading */

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
  
  // 🎬 Hero Video Toggle State
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const videoSectionRef = useRef<HTMLDivElement>(null);
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

  // 🎬 Handle video loading - AGGRESSIVE MOBILE LOADING
  useEffect(() => {
    const video = videoRef.current;
    if (video && isVideoMode) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
        setVideoError(false);
      };
      const handleError = () => {
        console.warn('Hero video failed to load');
        setVideoLoaded(false);
        setVideoError(true);
      };
      const handleCanPlay = () => {
        setVideoLoaded(true);
        setVideoError(false);
      };

      // Reset states
      setVideoLoaded(false);
      setVideoError(false);
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      // Force video to load immediately - MULTIPLE ATTEMPTS
      video.load();
      
      // Try multiple play attempts with different timings
      const attemptPlay = async () => {
        try {
          await video.play();
          setVideoLoaded(true);
        } catch (error) {
          console.warn('Play attempt failed:', error);
          // Try again after a short delay
          setTimeout(async () => {
            try {
              await video.play();
              setVideoLoaded(true);
            } catch (secondError) {
              console.warn('Second play attempt failed');
            }
          }, 500);
        }
      };

      // Immediate attempt
      attemptPlay();
      
      // If video is already ready
      if (video.readyState >= 2) {
        handleCanPlay();
      }

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isVideoMode]);

  // 🎬 AGGRESSIVE Initial video load on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Multiple load attempts with different timing
      setTimeout(() => {
        video.load();
        video.play().catch(() => {
          console.warn('Initial play blocked by browser');
        });
      }, 50);
      
      setTimeout(() => {
        video.play().catch(() => {
          console.warn('Second initial play blocked');
        });
      }, 200);
      
      setTimeout(() => {
        video.play().catch(() => {
          console.warn('Third initial play blocked');
        });
      }, 1000);
    }
  }, []);

  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === videoSectionRef.current) setShowVideo(true);
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

    const refs = [videoSectionRef, transcriptionRef, stemsRef, buttonGroupRef, musicMerchRef, tourRef];
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

        {/* HERO SECTION - 🎬 WITH VIDEO TOGGLE */}
        <div className="hero-wrapper" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100vh',
          paddingTop: '6rem'
        }}>
          
          {/* 🎬 Hero Video Background - MOBILE OPTIMIZED */}
          {isVideoMode && (
            <>
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                webkit-playsinline="true"
                x5-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
                x-webkit-airplay="deny"
                disablePictureInPicture
                controls={false}
                poster=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: -2,
                  opacity: videoLoaded || !videoError ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0) 100%)'
                }}
                onLoadedData={() => setVideoLoaded(true)}
                onCanPlay={() => setVideoLoaded(true)}
                onError={() => {
                  console.warn('Hero video failed to load, falling back to catmoon background');
                  setVideoLoaded(false);
                  setVideoError(true);
}}
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Dark Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  zIndex: -1,
                  opacity: videoLoaded || !videoError ? 1 : 0,
                  transition: 'opacity 0.5s ease'
                }}
              />
            </>
          )}

          {/* 🌙 Catmoon Background */}
          <div 
            className="catmoon-background" 
            style={{
              opacity: isVideoMode ? 0 : 1,
              transition: 'opacity 0.5s ease'
            }}
          />
          
          {/* Spacer */}
          <div style={{ flex: 1.0 }} />
          
          {/* 🎯 Hero Text Image */}
          {isVideoMode ? (
            <div>
              <div className="hero-image-container hero-video-large">
                <HeroImage
                  src="/unda-alunda-header.webp"
                  alt="Unda Alunda"
                  height={800}
                  width={1200}
                  quality={100}
                  priority={true}
                  unoptimized={true}
                  sizes="(max-width: 480px) 600px, (max-width: 768px) 900px, 1200px"
                />
              </div>
              
              {/* YouTube Content */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '-10rem',
                paddingBottom: '14rem',
                zIndex: 10,
                position: 'relative'
              }}>
                {/* Concert Title Text */}
                <p className="hero-concert-title">
                  Dark Wonderful World<br />
                  <strong>Live in Thailand (2024) Full Concert</strong>
                </p>
                
                <button
                  onClick={() => window.open('https://www.youtube.com/watch?v=ZwXeCx8cAIM', '_blank')}
                  className="hero-youtube-button"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fcdc';
                    e.currentTarget.style.borderColor = '#f8fcdc';
                    e.currentTarget.style.color = '#0d0d0d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(248, 252, 220, 0.3)';
                    e.currentTarget.style.color = 'rgba(248, 252, 220, 0.8)';
                  }}
                >
                  <svg 
                    className="hero-youtube-icon"
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    stroke="none"
                  >
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                  WATCH FULL VIDEO
                </button>
              </div>
            </div>
          ) : (
            <div className="hero-image-container">
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
          )}
          
          {/* Spacer */}
          <div style={{ flex: 1.5 }} />
          
          {/* 🎯 Hero Text */}
          <div style={{ marginBottom: '0vh' }}>
            <div className="hero-text desktop-only">
              <p className="hero-line1">
                THE NEW ALBUM'S COMING <span className="highlight">November 26<sup style={{ fontSize: '0.6em', marginLeft: '-0.1em' }}>th</sup> 2025</span>
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
              <p className="hero-line1"><span className="highlight">November 26<sup style={{ fontSize: '0.6em', marginLeft: '-0.1em' }}>th</sup> 2025</span></p>
              <p className="hero-line2">AVAILABLE NOW TO</p>
              <p className="hero-line2">
                <Link href="/shop/physical" onClick={createNavigationHandler('/shop/physical', undefined, undefined, 'merch')} className="hero-cta-link">PRE-ORDER</Link> &{' '}
                <a href="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" target="_blank" rel="noopener noreferrer" className="hero-cta-link">
                  PRE-SAVE
                </a>
              </p>
            </div>

            {/* 🔘 Hero Mode Dots - TOUCH FRIENDLY WITHOUT SIZE CHANGE */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '2rem',
              zIndex: 10
            }}>
              {/* Video Dot */}
              <button
                onClick={() => setIsVideoMode(true)}
                onTouchEnd={() => setIsVideoMode(true)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isVideoMode ? '#f8fcdc' : 'rgba(248, 252, 220, 0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  WebkitTapHighlightColor: 'rgba(248, 252, 220, 0.2)',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  if (!isVideoMode) {
                    e.currentTarget.style.background = 'rgba(248, 252, 220, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isVideoMode) {
                    e.currentTarget.style.background = 'rgba(248, 252, 220, 0.25)';
                  }
                }}
                title="Video Background"
              />
              
              {/* Image Dot */}
              <button
                onClick={() => setIsVideoMode(false)}
                onTouchEnd={() => setIsVideoMode(false)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  background: !isVideoMode ? '#f8fcdc' : 'rgba(248, 252, 220, 0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  WebkitTapHighlightColor: 'rgba(248, 252, 220, 0.2)',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  if (isVideoMode) {
                    e.currentTarget.style.background = 'rgba(248, 252, 220, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isVideoMode) {
                    e.currentTarget.style.background = 'rgba(248, 252, 220, 0.25)';
                  }
                }}
                title="Moon Background"
              />
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