// app/layout.tsx - Font Flash Fixed Version

import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Unda Alunda | Official Website & Merch Store',
  description: 'Official Website of Unda Alunda. The New Album Dark Wonderful World out July 1, 2025 — Purchase now!',
  keywords: [
    'Unda', 'Alunda', 'Unda Alunda', 'Dark Wonderful World',
    'music', 'merch', 'Stems', 'Transcription', 'Tour date',
    'Live in Thailand', 'jazz', 'Fusion', 'Progressive Rock', 'Progressive Metal', 'Instrumental Rock', 'Guitar Virtuoso'
  ],
  metadataBase: new URL('https://unda-website.vercel.app'),
  twitter: {
    card: 'summary_large_image',
    title: 'Unda Alunda',
    description: 'Official site and merch shop for Unda Alunda.',
    images: ['/catmoon-bg.jpeg'],
    creator: '@undaalunda',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'og:title': 'Unda Alunda | Official Website & Merch Store',
    'og:description': 'The New Album Dark Wonderful World out July 1, 2025 — Purchase now!',
    'og:url': 'https://unda-website.vercel.app',
    'og:site_name': 'Unda Alunda',
    'og:image': 'https://unda-website.vercel.app/catmoon-bg.jpeg',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'Unda Alunda Hero Image',
    'og:type': 'profile',
    'og:locale': 'en_US',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 🚀 CRITICAL: Resource Hints - ลำดับความสำคัญสูงสุด */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 🎯 CRITICAL: Hero Images - Highest Priority */}
        <link rel="preload" href="/text-hero-section.webp" as="image" type="image/webp" fetchPriority="high" />
        <link rel="preload" href="/catmoon-bg.webp" as="image" type="image/webp" fetchPriority="high" />
        
        {/* 🚀 Secondary Priority - Product Images */}
        <link rel="preload" href="/product-guitar.webp" as="image" type="image/webp" />
        <link rel="preload" href="/product-keys.webp" as="image" type="image/webp" />
        
        {/* 🚀 Enhanced DNS Prefetch */}
        <link rel="dns-prefetch" href="//widget.bandsintown.com" />
        <link rel="dns-prefetch" href="//www.youtube.com" />
        <link rel="dns-prefetch" href="//i.ytimg.com" />
        <link rel="dns-prefetch" href="//s.ytimg.com" />
        <link rel="dns-prefetch" href="//www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* 🎯 FIXED: Font Loading - No Flash Strategy */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=block" 
          rel="stylesheet"
        />
        
        {/* 🚀 FONT ANTI-FLASH: Critical CSS with proper font fallback */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* 🎯 ANTI-FLASH: Prevent font switching */
            *{box-sizing:border-box}
            html{scroll-behavior:auto;-webkit-text-size-adjust:100%}
            
            /* 🔧 FONT LOADING: Ensure consistent display */
            body{
              background-color:#190000;
              margin:0;
              padding:0;
              overflow-x:hidden;
              font-family:'Cinzel', Georgia, 'Times New Roman', serif;
              font-display: block;
              opacity:1 !important;
              visibility:visible !important;
            }
            
            /* 🎯 Force Cinzel font family everywhere */
            * {
              font-family: 'Cinzel', Georgia, 'Times New Roman', serif !important;
            }
            
            /* 🎯 ANTI-FLASH: Prevent layout shift during load */
            .hero-wrapper{opacity:1;position:relative;width:100vw;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-top:6rem;padding-bottom:6vh;z-index:0;margin-top:0;overflow:hidden}
            
            /* 🚀 Catmoon background - ลบ will-change เพื่อประหยัด memory */
            .catmoon-background{position:absolute;inset:0;width:100%;height:100%;background-image:url('/catmoon-bg.webp');background-repeat:no-repeat;background-size:cover;background-position:center;z-index:-1;opacity:1}
            
            /* 🎯 Hero text - Immediate position, controlled animation */
            .hero-text-image{position:absolute;top:10vh;left:50%;transform:translateX(-50%);width:80%;max-width:500px;z-index:10;pointer-events:none;opacity:0;margin-top:1rem;animation:fadeInHero 1.3s ease-out 0.2s forwards}
            
            /* 🚀 ลด GPU acceleration เฉพาะที่จำเป็นจริงๆ */
            .hero-wrapper,
            .catmoon-background,
            .hero-text-image {
              backface-visibility: hidden;
            }
            
            /* 🎯 Mobile optimizations */
            @media (max-width: 768px) {
              .catmoon-background {
                background-attachment: scroll !important;
                transform: translate3d(0, 0, 0);
              }
              
              .hero-wrapper {
                contain: layout style;
                overflow: hidden;
              }
              
              .hero-text-image {
                contain: layout;
                isolation: isolate;
                width: 90%;
                max-width: 400px;
              }
              
              body {
                -webkit-overflow-scrolling: touch;
                overscroll-behavior-y: contain;
              }
            }
            
            /* 🎯 Original animation - เหมือนเดิม */
            @keyframes fadeInHero{
              from{opacity:0;transform:translateX(-50%) translateY(20px)}
              to{opacity:1;transform:translateX(-50%) translateY(0)}
            }
            
            /* Loading states */
            .section-loading{height:400px;background-color:#2a0808;display:flex;align-items:center;justify-content:center;color:#f8fcdc;contain:strict;content-visibility:auto}
            
            /* 🎯 Prevent initial flicker */
            img{max-width:100%;height:auto;opacity:1}
            iframe{max-width:100%}
          `
        }} />

        {/* 🔧 OPTIMIZED Scroll Restoration - เรียบง่ายขึ้น */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html { 
              scroll-behavior: smooth;
              scroll-padding-top: 96px;
            }
            
            /* ป้องกัน layout shift ขณะโหลด */
            body {
              transition: none !important;
              scroll-behavior: smooth;
            }
            
            /* ป้องกัน scroll jump ขณะ navigation */
            @media (prefers-reduced-motion: no-preference) {
              html {
                scroll-behavior: auto;
              }
            }
          `
        }} />

        {/* 🌟 NATURAL SCROLL RESTORATION - เหมือน navigation ปกติ */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // บันทึก position อย่างเดียว
              function savePosition() {
                sessionStorage.setItem('naturalScrollPos', window.scrollY);
              }
              
              // กู้คืนแบบธรรมชาติ
              function naturalRestore() {
                const savedPos = sessionStorage.getItem('naturalScrollPos');
                
                if (savedPos && parseInt(savedPos) > 0) {
                  const targetY = parseInt(savedPos);
                  
                  // 🎯 ใช้ browser restoration mechanism เป็นหลัก
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'auto';
                  }
                  
                  // 🌊 Gentle restore - ไม่ฝืน
                  function gentleScrollTo() {
                    const currentY = window.scrollY;
                    
                    // ถ้าอยู่ใกล้ตำแหน่งเป้าหมายแล้ว ไม่ต้องทำอะไร
                    if (Math.abs(currentY - targetY) < 50) {
                      return;
                    }
                    
                    // ใช้ smooth scroll ธรรมชาติ
                    window.scrollTo({
                      top: targetY,
                      behavior: 'instant' // instant แต่ไม่ violent
                    });
                  }
                  
                  // ลอง restore ช้าๆ เหมือน page navigation
                  setTimeout(gentleScrollTo, 50);   // ครั้งแรก
                  setTimeout(gentleScrollTo, 150);  // ครั้งที่สอง
                  setTimeout(gentleScrollTo, 300);  // ครั้งสุดท้าย
                }
              }
              
              // บันทึกทุกครั้งที่ scroll
              window.addEventListener('scroll', savePosition, { passive: true });
              
              // บันทึกก่อน refresh
              window.addEventListener('beforeunload', savePosition);
              
              // กู้คืนเมื่อหน้าพร้อม
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', naturalRestore);
              } else {
                naturalRestore();
              }
              
              // กู้คืนหลัง load เสร็จ (เผื่อ images ช้า)
              window.addEventListener('load', naturalRestore);
              
              // เคลียร์เมื่อไปหน้าใหม่
              let isNavigating = false;
              
              // ตรวจจับการ navigate จริง
              window.addEventListener('click', function(e) {
                const link = e.target.closest('a[href]');
                if (link && link.href && !link.href.includes('#')) {
                  isNavigating = true;
                }
              });
              
              window.addEventListener('pagehide', function() {
                if (isNavigating) {
                  sessionStorage.removeItem('naturalScrollPos');
                  isNavigating = false;
                }
              });
            })();
          `
        }} />
        
        {/* 🎯 Viewport with Performance Hints */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* SEO & Verification */}
        <meta name="google-site-verification" content="l9-GepfNOG2FpwhTM3lKy6YjpQ0ifAmNbLsv1oqC2uo" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Unda Alunda" />
        <meta name="publisher" content="Unda Alunda" />
        <meta name="theme-color" content="#160000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Unda Alunda" />
        <meta name="application-name" content="Unda Alunda" />
        <meta name="copyright" content="Unda Alunda" />
        <link rel="canonical" href="https://unda-website.vercel.app" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta property="music:musician" content="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" />

        {/* Social Media Images */}
        <meta property="og:image" content="https://unda-website.vercel.app/catmoon-bg.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Unda Alunda Hero Image" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* 🚀 OPTIMIZED Structured Data - ลดขนาดลงเล็กน้อย */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://unda-website.vercel.app#website",
              "name": "Unda Alunda",
              "url": "https://unda-website.vercel.app",
              "author": { "@id": "https://unda-website.vercel.app#person" },
              "publisher": { "@id": "https://unda-website.vercel.app#person" },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://unda-website.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* 🎯 Structured Data - Person - เก็บข้อมูลสำคัญ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://unda-website.vercel.app#person",
              "name": "Alunda Chantharattanachoke",
              "alternateName": "Unda Alunda",
              "url": "https://unda-website.vercel.app",
              "image": "https://unda-website.vercel.app/catmoon-bg.jpeg",
              "sameAs": [
                "https://www.instagram.com/undalunda",
                "https://www.youtube.com/@undaalunda",
                "https://www.facebook.com/undaalunda",
                "https://www.threads.net/@undalunda",
                "https://twitter.com/undaalunda",
                "https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0",
                "https://music.apple.com/us/artist/unda-alunda/1543677299",
                "https://www.deezer.com/en/artist/115903802",
                "https://tidal.com/browse/artist/22524871",
                "https://music.amazon.com/artists/B08PVKFZDZ"
              ],
              "jobTitle": "Guitarist, Composer",
              "nationality": "Thai",
              "birthDate": "1999-10-11",
              "gender": "Male",
              "brand": {
                "@type": "Brand",
                "name": "Abasi Concepts",
                "url": "https://www.abasiconcepts.com"
              },
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "College of Music, Mahidol University"
              },
              "award": [
                "Winner - Hard Rock Pattaya Guitar Battle (2019)",
                "Winner - Overdrive Guitar Contest 11",
                "Winner - TIJC Band Competition (2023)",
                "Winner - Abasi Neural DSP Guitar Contest (2020)"
              ]
            })
          }}
        />

        {/* 🚀 Structured Data - MusicGroup - เก็บข้อมูลสำคัญ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "@id": "https://unda-website.vercel.app#musicgroup",
              "name": "Unda Alunda",
              "description": "Progressive Rock guitarist and composer from Thailand.",
              "url": "https://unda-website.vercel.app",
              "sameAs": [
                "https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0",
                "https://www.instagram.com/undalunda",
                "https://www.youtube.com/@undaalunda"
              ],
              "genre": ["Progressive Rock", "Progressive Metal", "Instrumental Rock"],
              "foundingLocation": { "@type": "Place", "name": "Thailand" },
              "member": { "@id": "https://unda-website.vercel.app#person" }
            })
          }}
        />

        {/* 🎯 Structured Data - Album */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicAlbum",
              "name": "Dark Wonderful World",
              "description": "The upcoming album by Unda Alunda, featuring progressive rock and metal compositions.",
              "datePublished": "2025-07-01",
              "byArtist": { "@id": "https://unda-website.vercel.app#person" },
              "recordLabel": "Independent",
              "genre": ["Progressive Rock", "Progressive Metal"]
            })
          }}
        />

        {/* 🚀 Performance & Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="bg-[#190000] text-[#f8fcdc] m-0 p-0 overflow-x-hidden">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}