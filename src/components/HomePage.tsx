/* HomePage.tsx - Enhanced Video Fallback with Static Image */

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
  
  // 🎬 Hero Video Toggle State - เพิ่ม state สำหรับ track การโหลด
  const [isVideoMode, setIsVideoMode] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoInitialized, setVideoInitialized] = useState(false);
  const [showFallbackImage, setShowFallbackImage] = useState(false); // NEW: สำหรับแสดง fallback image
  const [fallbackImageLoaded, setFallbackImageLoaded] = useState(false); // NEW: track fallback image loading
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

  // 🔘 Touch-Friendly Button Utility - สำหรับปุ่มเล็กๆ ที่ต้องการ touch area ใหญ่
  const createTouchFriendlyButton = (
    isActive: boolean,
    onClick: () => void,
    title: string,
    visualSize: number = 10,
    touchSize: number = 36 // ลดจาก 44 เป็น 36
  ) => (
    <button
      onClick={onClick}
      onTouchEnd={onClick}
      title={title}
      style={{
        // Large invisible touch area
        width: `${touchSize}px`,
        height: `${touchSize}px`,
        borderRadius: '50%',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Actual visible dot */}
      <div
        style={{
          width: `${visualSize}px`,
          height: `${visualSize}px`,
          borderRadius: '50%',
          background: isActive ? '#f8fcdc' : 'rgba(248, 252, 220, 0.25)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none'
        }}
      />
    </button>
  );

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

  // 🎬 NEW: Preload fallback image
  useEffect(() => {
    if (isVideoMode) {
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => setFallbackImageLoaded(true);
      img.onerror = () => console.warn('Fallback image failed to load');
      img.src = '/hero-video-fallback.webp';
    }
  }, [isVideoMode]);

  // 🎬 AGGRESSIVE: Force video to hide poster and show video element immediately
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Force remove poster attribute immediately
      video.removeAttribute('poster');
      
      // Set as ready to prevent play button overlay
      const forceVideoReady = () => {
        setVideoInitialized(true);
        // Try to remove any potential overlay or poster
        if (video.parentElement) {
          const overlays = video.parentElement.querySelectorAll('[class*="poster"], [class*="play"], [class*="control"]');
          overlays.forEach(overlay => {
            if (overlay !== video) {
              overlay.remove();
            }
          });
        }
      };

      // Multiple timing attempts
      forceVideoReady();
      setTimeout(forceVideoReady, 50);
      setTimeout(forceVideoReady, 200);
      setTimeout(forceVideoReady, 500);
    }
  }, []);

  // 🎬 ENHANCED: More aggressive video loading with better mobile handling and fallback
  useEffect(() => {
    const video = videoRef.current;
    if (video && isVideoMode) {
      const handleLoadedData = () => {
        setVideoLoaded(true);
        setVideoError(false);
        setVideoInitialized(true);
        setShowFallbackImage(false); // Hide fallback when video loads
        console.log('Video loadeddata event fired');
      };
      
      const handleCanPlay = () => {
        setVideoLoaded(true);
        setVideoError(false);
        setVideoInitialized(true);
        setShowFallbackImage(false); // Hide fallback when video can play
        console.log('Video canplay event fired');
      };

      const handleError = (e: Event) => {
        console.warn('Hero video failed to load:', e);
        setVideoLoaded(false);
        setVideoError(true);
        setVideoInitialized(false);
        setShowFallbackImage(true); // Show fallback on error
      };

      const handleLoadStart = () => {
        console.log('Video loading started');
        // Set as initialized immediately to prevent play button
        setVideoInitialized(true);
        setVideoLoaded(false);
        setVideoError(false);
        // Show fallback while loading if it's ready
        if (fallbackImageLoaded) {
          setShowFallbackImage(true);
        }
      };

      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded');
        setVideoInitialized(true);
        attemptPlay();
      };

      const handleSuspend = () => {
        console.log('Video suspended - attempting to resume');
        setVideoInitialized(true); // Keep showing video element
        // Show fallback during suspend if video isn't loaded
        if (!videoLoaded && fallbackImageLoaded) {
          setShowFallbackImage(true);
        }
        attemptPlay();
      };

      const handleWaiting = () => {
        console.log('Video waiting - keeping element visible');
        setVideoInitialized(true); // Keep showing video element
        // Show fallback during waiting if available
        if (!videoLoaded && fallbackImageLoaded) {
          setShowFallbackImage(true);
        }
      };

      const handleStalled = () => {
        console.log('Video stalled - showing fallback');
        if (fallbackImageLoaded) {
          setShowFallbackImage(true);
        }
      };

      // Reset states when switching to video mode
      setVideoLoaded(false);
      setVideoError(false);
      setVideoInitialized(true); // Set immediately to prevent play button
      
      // Show fallback initially if available
      if (fallbackImageLoaded) {
        setShowFallbackImage(true);
      }
      
      // Add comprehensive event listeners
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('suspend', handleSuspend);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('stalled', handleStalled);
      
      // Enhanced play attempt function
      const attemptPlay = async () => {
        if (!video) return;
        
        try {
          // Ensure video properties are set
          video.currentTime = 0;
          video.muted = true;
          video.defaultMuted = true;
          video.removeAttribute('poster');
          
          // Multiple play strategies
          const playPromise = video.play();
          if (playPromise !== undefined) {
            await playPromise;
            setVideoLoaded(true);
            setVideoInitialized(true);
            setShowFallbackImage(false); // Hide fallback when playing
            console.log('Video playing successfully');
          }
        } catch (error) {
          console.warn('Play attempt failed:', error);
          
          // Even if play fails, show video element (not poster)
          setVideoInitialized(true);
          
          // Show fallback if video fails to play
          if (fallbackImageLoaded) {
            setShowFallbackImage(true);
          }
          
          // Set up intersection observer for viewport-based autoplay
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.target === video) {
                video.play().then(() => {
                  setVideoLoaded(true);
                  setVideoInitialized(true);
                  setShowFallbackImage(false);
                  console.log('Video playing after intersection');
                }).catch(() => {
                  console.warn('Intersection play failed');
                  if (fallbackImageLoaded) {
                    setShowFallbackImage(true);
                  }
                });
                observer.unobserve(video);
              }
            });
          }, { threshold: 0.1 });
          
          observer.observe(video);
          
          // Also set up user interaction listeners
          const retryOnInteraction = (event: Event) => {
            video.play().then(() => {
              setVideoLoaded(true);
              setVideoInitialized(true);
              setShowFallbackImage(false);
              console.log('Video playing after user interaction');
            }).catch(retryError => {
              console.warn('Retry failed:', retryError);
              if (fallbackImageLoaded) {
                setShowFallbackImage(true);
              }
            });
            
            // Remove listeners after first attempt
            document.removeEventListener('touchstart', retryOnInteraction);
            document.removeEventListener('click', retryOnInteraction);
            document.removeEventListener('scroll', retryOnInteraction);
          };
          
          document.addEventListener('touchstart', retryOnInteraction, { once: true });
          document.addEventListener('click', retryOnInteraction, { once: true });
          document.addEventListener('scroll', retryOnInteraction, { once: true });
        }
      };

      // Force immediate initialization to prevent play button
      video.removeAttribute('poster');
      setVideoInitialized(true);
      
      // Initial load with multiple attempts
      video.load();
      
      // Staggered play attempts with fallback timeout
      setTimeout(() => attemptPlay(), 10);
      setTimeout(() => attemptPlay(), 100);
      setTimeout(() => attemptPlay(), 300);
      setTimeout(() => attemptPlay(), 800);
      setTimeout(() => attemptPlay(), 1500);
      
      // Fallback timeout - show image if video doesn't load within 3 seconds
      const fallbackTimeout = setTimeout(() => {
        if (!videoLoaded && fallbackImageLoaded) {
          console.log('Video loading timeout - showing fallback image');
          setShowFallbackImage(true);
        }
      }, 3000);
      
      // Check if video is already ready
      if (video.readyState >= 2) {
        handleCanPlay();
        attemptPlay();
      } else if (video.readyState >= 1) {
        handleLoadedMetadata();
      }

      return () => {
        clearTimeout(fallbackTimeout);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('suspend', handleSuspend);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('stalled', handleStalled);
      };
    }
  }, [isVideoMode, fallbackImageLoaded]);

  // 🎬 Initial video setup on mount - ปรับปรุงให้รอบคอบมากขึ้น
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // เพิ่ม attributes ที่จำเป็นสำหรับ mobile
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.muted = true;
      video.defaultMuted = true;
      
      const initializeVideo = async () => {
        try {
          // Load video first
          video.load();
          
          // Wait a bit then try to play
          setTimeout(async () => {
            try {
              await video.play();
              setVideoLoaded(true);
              setVideoInitialized(true);
              setShowFallbackImage(false);
            } catch (error) {
              console.warn('Initial auto-play blocked, will play on user interaction');
              // Set as loaded but not playing - this removes the play button
              if (video.readyState >= 2) {
                setVideoLoaded(true);
                setVideoInitialized(true);
                setShowFallbackImage(false);
              } else if (fallbackImageLoaded) {
                setShowFallbackImage(true);
              }
            }
          }, 200);
          
        } catch (error) {
          console.warn('Video initialization failed:', error);
          if (fallbackImageLoaded) {
            setShowFallbackImage(true);
          }
        }
      };

      initializeVideo();
    }
  }, [fallbackImageLoaded]);

  // 🎬 Enhanced mode switching - ให้การเปลี่ยนโหมดราบรื่นขึ้น
  const handleModeSwitch = (newVideoMode: boolean) => {
    setIsVideoMode(newVideoMode);
    
    // ถ้าเปลี่ยนเป็น video mode ให้ reset states
    if (newVideoMode) {
      setVideoLoaded(false);
      setVideoError(false);
      setVideoInitialized(false);
      setShowFallbackImage(false);
    } else {
      // ถ้าเปลี่ยนเป็น image mode ให้ซ่อน fallback
      setShowFallbackImage(false);
    }
  };

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

        {/* HERO SECTION - 🎬 WITH FIXED VIDEO TOGGLE AND FALLBACK */}
        <div className="hero-wrapper" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '100vh',
          paddingTop: '6rem'
        }}>
          
          {/* 🎬 Hero Video Background with Fallback - FIXED MOBILE LOADING */}
          {isVideoMode && (
            <>
              {/* Fallback Image - แสดงขณะวิดีโอกำลังโหลดหรือเกิดข้อผิดพลาด */}
              {showFallbackImage && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -3,
                    opacity: 1,
                    transition: 'opacity 0.5s ease',
                    backgroundImage: 'url(/hero-video-fallback.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0) 100%)'
                  }}
                />
              )}

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
                src="/hero-video.mp4"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: -2,
                  // แสดงวิดีโอเมื่อโหลดเสร็จ หรือซ่อนเมื่อแสดง fallback
                  opacity: (videoLoaded && !showFallbackImage) ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0.5) 85%, rgba(0, 0, 0, 0) 100%)'
                }}
                onLoadedData={() => {
                  setVideoLoaded(true);
                  setVideoInitialized(true);
                  setShowFallbackImage(false);
                }}
                onCanPlay={() => {
                  setVideoLoaded(true);
                  setVideoInitialized(true);
                  setShowFallbackImage(false);
                }}
                onError={() => {
                  console.warn('Hero video failed to load, showing fallback image');
                  setVideoLoaded(false);
                  setVideoError(true);
                  setVideoInitialized(false);
                  setShowFallbackImage(true);
                }}
                onPlay={() => {
                  setVideoLoaded(true);
                  setVideoInitialized(true);
                  setShowFallbackImage(false);
                  console.log('Video started playing');
                }}
                onPause={() => {
                  // ถ้า video หยุดโดยไม่ได้ตั้งใจ ให้เล่นต่อ
                  const video = videoRef.current;
                  if (video && isVideoMode && !video.ended) {
                    setTimeout(() => {
                      video.play().then(() => {
                        setShowFallbackImage(false);
                      }).catch(() => {
                        console.warn('Auto-resume failed');
                        if (fallbackImageLoaded) {
                          setShowFallbackImage(true);
                        }
                      });
                    }, 100);
                  }
                }}
              />
              
              {/* Dark Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  zIndex: -1,
                  opacity: (videoLoaded && !showFallbackImage) || showFallbackImage ? 1 : 0,
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

            {/* 🔘 Hero Mode Dots - USING TOUCH-FRIENDLY UTILITY */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0px', // เอา gap ออก ให้ปุ่มชิดกัน
              marginTop: '2rem',
              zIndex: 10
            }}>
              {/* Video Dot */}
              {createTouchFriendlyButton(
                isVideoMode,
                () => handleModeSwitch(true),
                "Video Background"
              )}
              
              {/* Image Dot */}
              {createTouchFriendlyButton(
                !isVideoMode,
                () => handleModeSwitch(false),
                "Moon Background"
              )}
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
                          ? `${item.price.toFixed(2)}`
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