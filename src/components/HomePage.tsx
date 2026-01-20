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

const allowedItems = [
  'dark-wonderful-world-t-shirt',
  'cat-in-the-cloud-longsleeve',
  'mr-feign-t-shirt',
  'dark-wonderful-world-bag',
  'guitars-book',
  'signed-keychain',
  'audio-digipak',
  'dual-album-bundle'
];

const homepageItems = allItems.filter(
  (item) => allowedItems.includes(item.id)
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
  const [videoReady, setVideoReady] = useState(false);

  // Hero video states
  const [showHeroVideo, setShowHeroVideo] = useState(true);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // Hero slide functions
  const goToHeroSlide = (slideIndex: number) => {
  setCurrentHeroSlide(slideIndex);
  if (slideIndex === 0) {
    setShowHeroVideo(true);
    setVideoReady(false);
    setVideoStarted(false);
    if (heroVideoRef.current) {
      heroVideoRef.current.currentTime = 0;
      heroVideoRef.current.play().catch(err => console.log('Play failed:', err));
      setVideoStarted(true);
    }
  } else {
    setShowHeroVideo(false);
  }
};

  useEffect(() => {
  const handleInteraction = () => {
    setUserInteracted(true);
    setVideoStarted(true);
    
    if (heroVideoRef.current && showHeroVideo) {
      heroVideoRef.current.play().catch(err => {
        console.log('Play failed:', err);
      });
    }
  };

  document.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
  document.addEventListener('click', handleInteraction, { once: true });
  document.addEventListener('scroll', handleInteraction, { once: true, passive: true });
  document.addEventListener('touchmove', handleInteraction, { once: true, passive: true });

  if (heroVideoRef.current && showHeroVideo) {
    const attemptPlay = () => {
      const playPromise = heroVideoRef.current?.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoStarted(true);
            setUserInteracted(true);
          })
          .catch(err => {
            console.log('Initial autoplay prevented, waiting for user interaction');
          });
      }
    };
    
    const timer = setTimeout(attemptPlay, 100);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('touchmove', handleInteraction);
    };
  }

  return () => {
    document.removeEventListener('touchstart', handleInteraction);
    document.removeEventListener('click', handleInteraction);
    document.removeEventListener('scroll', handleInteraction);
    document.removeEventListener('touchmove', handleInteraction);
  };
}, [showHeroVideo]);

  // Check video ready state on mount and when switching to video
  useEffect(() => {
    if (showHeroVideo && heroVideoRef.current) {
      const video = heroVideoRef.current;
      
      const checkReady = () => {
        if (video.readyState >= 3) {
          setVideoReady(true);
        }
      };
      
      const handleLoadedData = () => {
  setVideoReady(true);
  if (userInteracted || currentHeroSlide !== 0) {
    video.play().then(() => {
      setVideoStarted(true);
    }).catch(err => console.log('Autoplay prevented:', err));
  }
};
      
      const handleCanPlay = () => {
  checkReady();
  if (userInteracted || currentHeroSlide !== 0) {
    video.play().then(() => {
      setVideoStarted(true);
    }).catch(err => console.log('Autoplay prevented:', err));
  }
};

const handleCanPlayThrough = () => {
  setVideoReady(true);
  if (!videoStarted && userInteracted && video.paused) {
    video.play().then(() => {
      setVideoStarted(true);
    }).catch(err => console.log('Autoplay prevented:', err));
  }
};
      
      checkReady();
      
      if (video.readyState >= 3 && (userInteracted || currentHeroSlide !== 0)) {
  video.play().then(() => {
    setVideoStarted(true);
  }).catch(err => console.log('Autoplay prevented:', err));
}
      
      video.addEventListener('loadeddata', handleLoadedData);
video.addEventListener('canplay', handleCanPlay);
video.addEventListener('canplaythrough', handleCanPlayThrough);

return () => {
  video.removeEventListener('loadeddata', handleLoadedData);
  video.removeEventListener('canplay', handleCanPlay);
  video.removeEventListener('canplaythrough', handleCanPlayThrough);
};
    }
    
  }, [showHeroVideo, userInteracted, currentHeroSlide, videoStarted]);

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
      <style jsx global>{`
      
        /* Aggressively hide ALL video controls */
        video::-webkit-media-controls {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        video::-webkit-media-controls-enclosure {
          display: none !important;
        }
        video::-webkit-media-controls-panel {
          display: none !important;
        }
        video::-webkit-media-controls-play-button {
          display: none !important;
        }
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
        }
        video::-webkit-media-controls-overlay-play-button {
          display: none !important;
        }
        video::-moz-media-controls {
          display: none !important;
        }
        video::part(controls) {
          display: none !important;
        }
        /* Target hero video specifically */
        .hero-wrapper video {
          pointer-events: none !important;
        }
        .hero-wrapper video::-webkit-media-controls {
          display: none !important;
          visibility: hidden !important;
        }
        .hero-wrapper video::-webkit-media-controls-enclosure {
          display: none !important;
          visibility: hidden !important;
        }
      `}</style>
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
          <>
            {showHeroVideo && (
              <>
                <video
  ref={heroVideoRef}
  muted
  playsInline
  webkit-playsinline="true"
  x5-playsinline="true"
  x-webkit-airplay="deny"
  controls={false}
  disablePictureInPicture
  disableRemotePlayback
  preload="auto"
  poster="/hero-video-fallback.webp"
  autoPlay={false}
  onError={() => {
    setVideoReady(false);
  }}
  onPlay={() => {
    setVideoStarted(true);
  }}
  onEnded={() => {
    // Auto transition to hero image when video ends
    setTimeout(() => {
      goToHeroSlide(1);
    }, 500); // Small delay for smooth transition
  }}
  style={{
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
    pointerEvents: 'none',
    opacity: videoReady && videoStarted ? 1 : 0,
    transition: 'opacity 0.8s ease',
    maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0.85) 88%, rgba(0, 0, 0, 0.6) 94%, rgba(0, 0, 0, 0.3) 98%, rgba(0, 0, 0, 0.15) 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0.85) 88%, rgba(0, 0, 0, 0.6) 94%, rgba(0, 0, 0, 0.3) 98%, rgba(0, 0, 0, 0.15) 100%)',
    filter: 'brightness(0.8)',
    // @ts-ignore
    WebkitAppearance: 'none',
    MozAppearance: 'none'
  } as React.CSSProperties}
>
                  <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                <div 
  style={{
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/hero-video-fallback.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -2,
    opacity: (!videoStarted || !videoReady) ? 1 : 0,
    transition: 'opacity 0.5s ease',
    maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0.85) 88%, rgba(0, 0, 0, 0.6) 94%, rgba(0, 0, 0, 0.3) 98%, rgba(0, 0, 0, 0.15) 100%)',
    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0.85) 88%, rgba(0, 0, 0, 0.6) 94%, rgba(0, 0, 0, 0.3) 98%, rgba(0, 0, 0, 0.15) 100%)',
    filter: 'brightness(0.8)'
  }}
/>

                {/* Dark overlay for video */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    zIndex: -1,
                    pointerEvents: 'none',
                    maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0.2) 98%, rgba(0, 0, 0, 0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0.2) 98%, rgba(0, 0, 0, 0) 100%)'
                  }}
                />
              </>
            )}
            <div 
              className="catmoon-background" 
              style={{ opacity: showHeroVideo ? 0 : 1 }}
            />
          </>
          
          {/* Spacer เพื่อผลัก hero text image ไปตรงกลาง */}
          <div style={{ flex: 1.0 }} />
          
          {/* 🎯 Hero Text Image - อยู่ตรงกลาง */}
         <div 
  className="hero-image-container"
  style={{
    visibility: showHeroVideo ? 'hidden' : 'visible',
    opacity: showHeroVideo ? 0 : 1
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
    opacity: showHeroVideo ? 1 : 0,
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
              C o n s o n a n c e
            </h2>

            {/* Live in Thailand */}
            <p className="video-hero-subtitle">
              (Official Music Video)
            </p>

            {/* Watch Full Video Button */}
            <a
              href="https://www.youtube.com/watch?v=hRkQyFQ1s3A"
  target="_blank"
  rel="noopener noreferrer"
  className="video-hero-button"
  style={{ 
    fontWeight: '100',
    letterSpacing: '0.08em'
  }}
>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="#f8fcdc" style={{ marginRight: '0.5rem', transition: 'fill 0.3s ease' }}>
                <path d="M0 0L10 6L0 12V0Z"/>
              </svg>
              WATCH FULL VIDEO
            </a>
          </div>
          
          {/* Spacer เพื่อผลัก hero text ไปด้านล่าง */}
          <div style={{ flex: 1.5 }} />
          
          {/* 🎯 Hero Text - อยู่ด้านล่างเหมือนเดิม */}
          <div style={{ marginBottom: '0vh' }}>
            <div className="hero-text desktop-only">
              <p className="hero-line1">
                THE NEW ALBUM'S <span className="highlight">OUT NOW</span>
              </p>
              <p className="hero-line2">
                AVAILABLE NOW TO <Link href="/shop/physical" onClick={createNavigationHandler('/shop/physical', undefined, undefined, 'music')} className="hero-cta-link">PURCHASE</Link> &{' '}
                <a href="https://orcd.co/UndaAlunda_DarkWonderfulWorld" target="_blank" rel="noopener noreferrer" className="hero-cta-link">
                  STREAM
                </a>
              </p>
            </div>
            
            <div className="hero-text mobile-only">
              <p className="hero-line1">THE NEW ALBUM'S</p>
              <p className="hero-line1"><span className="highlight">OUT NOW</span></p>
              <p className="hero-line2">AVAILABLE NOW TO</p>
              <p className="hero-line2">
               <Link href="/shop/physical" onClick={createNavigationHandler('/shop/physical', undefined, undefined, 'music')} className="hero-cta-link">PURCHASE</Link> &{' '}
                <a href="https://orcd.co/UndaAlunda_DarkWonderfulWorld" target="_blank" rel="noopener noreferrer" className="hero-cta-link">
                  STREAM
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
                  padding: '20px',
                  margin: '0'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: currentHeroSlide === 0 ? 'none' : '1px solid rgba(248, 252, 220, 0.6)',
                  backgroundColor: currentHeroSlide === 0 ? '#dc9e63' : 'transparent',
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
                  padding: '20px',
                  margin: '0'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: currentHeroSlide === 1 ? 'none' : '1px solid rgba(248, 252, 220, 0.6)',
                  backgroundColor: currentHeroSlide === 1 ? '#dc9e63' : 'transparent',
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

        {/* MUSIC & MERCH - 🚀 OPTIMIZED */}
        <section className="stems-section">
          <div ref={musicMerchRef} className={`fade-trigger ${showMerch ? 'fade-in' : ''}`}>
            <p className="stems-sub">MUSIC IN YOUR HANDS</p>
            <h2 className="stems-title">MUSIC & MERCH</h2>
            <div className="stems-row">
              {homepageItems.map((item) => (
                <Link href={item.url || `/product/${item.id}`} key={item.id} className="stems-item product-label-link">
                  <div className="relative">
                    <ProductImage
                      src={item.image}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="stems-image"
                      quality={95}
                      sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
                    />
                    {item.soldOut && (
                      <div className="absolute top-2 right-2 bg-red-900/40 text-white text-xs px-2 py-1 rounded-md font-semibold border border-red-800/50">
                        SOLD OUT
                      </div>
                    )}
                    {item.comingSoon && !item.soldOut && (
                      <div className="absolute top-2 right-2 bg-orange-600/50 text-white text-xs px-2 py-1 rounded-md font-semibold border border-orange-500/60">
                        Available Dec 31
                      </div>
                    )}
                  </div>
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
                      {item.comingSoon ? (
                        <span className="invisible">
                          {typeof item.price === 'object' && item.price !== null
                            ? `$${item.price.sale.toFixed(2)}`
                            : typeof item.price === 'number'
                              ? `$${item.price.toFixed(2)}`
                              : null}
                        </span>
                      ) : (
                        typeof item.price === 'object' && item.price !== null
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
                            : null
                      )}
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