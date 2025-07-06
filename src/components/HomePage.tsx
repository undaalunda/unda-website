/* HomePage.tsx - Optimized with Performance Images */

'use client';

import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
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
  const [heroImageStyles, setHeroImageStyles] = useState<React.CSSProperties>({});

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

  // 🎯 Hero Text Image Styles
  const updateHeroImageStyles = () => {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    
    let imageWidth = '90%';
    let maxWidth = '650px';
    
    if (width <= 480) {
      imageWidth = '100%';
      maxWidth = '400px';
    } else if (width <= 768) {
      imageWidth = '95%';
      maxWidth = '500px';
    } else if (width <= 1279) {
      imageWidth = '95%';
      maxWidth = '550px';
    }

    setHeroImageStyles({
      width: imageWidth,
      maxWidth: maxWidth,
      zIndex: 10,
      pointerEvents: 'none' as const,
      opacity: 0,
      animation: 'fadeInHero 1.3s ease-out 0.2s forwards',
      display: 'block',
      margin: '0 auto',
      textAlign: 'center' as const
    });
  };

  useEffect(() => {
    setIsClient(true);
    
    // 🎯 เพิ่ม keyframes animation สำหรับ hero image
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInHero {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    // 🎯 ตั้งค่า hero image styles หลัง component mount
    updateHeroImageStyles();
    
    // 🎯 เพิ่ม resize listener
    const handleResize = () => updateHeroImageStyles();
    window.addEventListener('resize', handleResize);
    
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
      // Cleanup style and resize listener
      document.head.removeChild(style);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AppClientWrapper>
      <main className="homepage-main" style={{ overflow: 'visible' }}>
        <h1 className="sr-only">Unda Alunda | Official Website & Merch Store</h1>

        {/* HERO SECTION - 🚀 OPTIMIZED */}
        <div className="hero-wrapper" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100vh',
          paddingTop: '3rem'
        }}>
          <div className="catmoon-background" />
          
          {/* Spacer เพื่อผลัก hero text image ไปตรงกลาง */}
          <div style={{ flex: 0.5 }} />
          
          {/* 🎯 Hero Text Image - อยู่ตรงกลาง */}
          <div style={{
            ...heroImageStyles,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            paddingBottom: '10rem'
          }}>
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