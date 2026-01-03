// app/layout.tsx - FINAL: With Facebook Pixel + Album OUT NOW

import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { ConsentProvider } from '@/context/ConsentContext';
import { ReactNode } from 'react';
import CookieNotice from '@/components/CookieNotice';
import FacebookPixel from '@/components/FacebookPixel';

const BASE_URL = 'https://unda-website.vercel.app';

export const metadata: Metadata = {
  title: 'Unda Alunda | Official Website & Merch Store',
  description: 'Official Website of Unda Alunda. New album "Dark Wonderful World" OUT NOW — Purchase now!',
  keywords: [
    'Unda', 'Alunda', 'Unda Alunda', 'Dark Wonderful World',
    'tosin Abasi', 'animals as leaders', 'plini', 'intervals', 'panzerbullett', 'tigran hamasyan',
    'music', 'merch', 'stems', 'transcription', 'tour dates', 'matteo mancuso', 'baxty',
    'live performances', 'instrumental rock', 'guitar virtuoso',
    'backing tracks', 'guitar tabs', 'sonic landscapes',
    'progressive rock guitarist', 'Thailand progressive metal', 'Thai musician',
    'guitar music', 'instrumental guitar', 'melodic rock'
  ],
  metadataBase: new URL(BASE_URL),
  
  openGraph: {
    title: 'Unda Alunda | Official Website & Merch Store',
    description: 'Official Website of Unda Alunda. New album "Dark Wonderful World" OUT NOW — Purchase now!',
    type: 'website',
    url: BASE_URL,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda - Dark Wonderful World',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Unda Alunda | Official Website & Merch Store',
    description: 'Official Website of Unda Alunda. New album "Dark Wonderful World" OUT NOW — Purchase now!',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },
  
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  
  other: {
    'og:title': 'Unda Alunda | Official Website & Merch Store',
    'og:description': 'Official Website of Unda Alunda. New album "Dark Wonderful World" OUT NOW — Purchase now!',
    'og:url': BASE_URL,
    'og:site_name': 'UNDA ALUNDA',
    'og:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:image:secure_url': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'Unda Alunda - Dark Wonderful World',
    'og:image:type': 'image/jpeg',
    'og:type': 'website',
    'og:locale': 'en_US',
    'twitter:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'twitter:image:alt': 'Unda Alunda - Dark Wonderful World',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 🚀 Resource Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        
        {/* 🎯 FIXED: Catmoon-bg HIGHEST PRIORITY for Google/Social */}
        <link rel="preload" href="/catmoon-bg.jpeg" as="image" type="image/jpeg" fetchPriority="high" />
        <link rel="preload" href="/catmoon-bg.webp" as="image" type="image/webp" fetchPriority="high" />
        
        {/* 🚀 Text hero = lower priority */}
        <link rel="preload" href="/text-hero-section.webp" as="image" type="image/webp" />
        
        {/* 🚀 Product images = tertiary */}
        <link rel="preload" href="/product-guitar.webp" as="image" type="image/webp" />
        <link rel="preload" href="/product-keys.webp" as="image" type="image/webp" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//widget.bandsintown.com" />
        <link rel="dns-prefetch" href="//www.youtube.com" />
        <link rel="dns-prefetch" href="//i.ytimg.com" />
        <link rel="dns-prefetch" href="//s.ytimg.com" />
        <link rel="dns-prefetch" href="//www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//connect.facebook.net" />
        
        {/* Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=block" 
          rel="stylesheet"
        />
        
        {/* Critical CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *{box-sizing:border-box}
            html{scroll-behavior:auto;-webkit-text-size-adjust:100%}
            
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
            
            * {
              font-family: 'Cinzel', Georgia, 'Times New Roman', serif !important;
            }
            
            .hero-wrapper{opacity:1;position:relative;width:100vw;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-top:6rem;padding-bottom:6vh;z-index:0;margin-top:0;overflow:hidden}
            
            .catmoon-background{position:absolute;inset:0;width:100%;height:100%;background-image:url('/catmoon-bg.webp');background-repeat:no-repeat;background-size:cover;background-position:center;z-index:-1;opacity:1}
            
            .hero-text-image{position:absolute;top:10vh;left:50%;transform:translateX(-50%);width:80%;max-width:500px;z-index:10;pointer-events:none;opacity:0;margin-top:1rem;animation:fadeInHero 1.3s ease-out 0.2s forwards}
            
            .hero-wrapper,
            .catmoon-background,
            .hero-text-image {
              backface-visibility: hidden;
            }
            
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
            
            @keyframes fadeInHero{
              from{opacity:0;transform:translateX(-50%) translateY(20px)}
              to{opacity:1;transform:translateX(-50%) translateY(0)}
            }
            
            .section-loading{height:400px;background-color:#2a0808;display:flex;align-items:center;justify-content:center;color:#f8fcdc;contain:strict;content-visibility:auto}
            
            img{max-width:100%;height:auto;opacity:1}
            iframe{max-width:100%}
          `
        }} />

        {/* Scroll Restoration */}
        <style dangerouslySetInnerHTML={{
          __html: `
            html { 
              scroll-behavior: smooth;
              scroll-padding-top: 96px;
            }
            
            body {
              transition: none !important;
              scroll-behavior: smooth;
            }
            
            @media (prefers-reduced-motion: no-preference) {
              html {
                scroll-behavior: auto;
              }
            }
          `
        }} />

        {/* Scroll Script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function savePosition() {
                sessionStorage.setItem('naturalScrollPos', window.scrollY);
              }
              
              function naturalRestore() {
                const savedPos = sessionStorage.getItem('naturalScrollPos');
                
                if (savedPos && parseInt(savedPos) > 0) {
                  const targetY = parseInt(savedPos);
                  
                  if ('scrollRestoration' in history) {
                    history.scrollRestoration = 'auto';
                  }
                  
                  function gentleScrollTo() {
                    const currentY = window.scrollY;
                    
                    if (Math.abs(currentY - targetY) < 50) {
                      return;
                    }
                    
                    window.scrollTo({
                      top: targetY,
                      behavior: 'instant'
                    });
                  }
                  
                  setTimeout(gentleScrollTo, 50);
                  setTimeout(gentleScrollTo, 150);
                  setTimeout(gentleScrollTo, 300);
                }
              }
              
              window.addEventListener('scroll', savePosition, { passive: true });
              window.addEventListener('beforeunload', savePosition);
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', naturalRestore);
              } else {
                naturalRestore();
              }
              
              window.addEventListener('load', naturalRestore);
              
              let isNavigating = false;
              
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
        
        {/* Meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="google-site-verification" content="l9-GepfNOG2FpwhTM3lKy6YjpQ0ifAmNbLsv1oqC2uo" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Unda Alunda" />
        <meta name="publisher" content="Unda Alunda" />
        <meta name="theme-color" content="#160000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#160000" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#160000" />
        <meta name="msapplication-TileColor" content="#160000" />
        <meta name="msapplication-navbutton-color" content="#160000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" /> 
        <meta name="apple-mobile-web-app-title" content="Unda Alunda" />
        <meta name="application-name" content="Unda Alunda" />
        <meta name="copyright" content="Unda Alunda" />
        <link rel="canonical" href={BASE_URL} />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta property="music:musician" content="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" />

        {/* Social media images */}
        <meta property="og:image" content={`${BASE_URL}/catmoon-bg.jpeg`} />
        <meta property="og:image:secure_url" content={`${BASE_URL}/catmoon-bg.jpeg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Unda Alunda - Dark Wonderful World" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${BASE_URL}/catmoon-bg.jpeg`} />

        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${BASE_URL}#website`,
              "name": "Unda Alunda",
              "url": BASE_URL,
              "image": `${BASE_URL}/catmoon-bg.jpeg`,
              "author": { "@id": `${BASE_URL}#person` },
              "publisher": { "@id": `${BASE_URL}#person` },
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${BASE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* Structured Data - Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": `${BASE_URL}#person`,
              "name": "Alunda Chantharattanachoke",
              "alternateName": "Unda Alunda",
              "url": BASE_URL,
              "image": `${BASE_URL}/catmoon-bg.jpeg`,
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

        {/* Structured Data - MusicGroup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "@id": `${BASE_URL}#musicgroup`,
              "name": "Unda Alunda",
              "description": "Guitarist and composer creating beautiful instrumental guitar music",
              "url": BASE_URL,
              "image": `${BASE_URL}/catmoon-bg.jpeg`,
              "sameAs": [
                "https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0",
                "https://www.instagram.com/undalunda",
                "https://www.youtube.com/@undaalunda"
              ],
              "genre": ["Instrumental Guitar", "Melodic Rock", "Atmospheric Music"],
              "member": { "@id": `${BASE_URL}#person` }
            })
          }}
        />

        {/* Structured Data - Album (OUT NOW!) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicAlbum",
              "name": "Dark Wonderful World",
              "description": "The latest album by Unda Alunda, featuring beautiful instrumental guitar compositions.",
              "image": `${BASE_URL}/catmoon-bg.jpeg`,
              "datePublished": "2024-12-31",
              "byArtist": { "@id": `${BASE_URL}#person` },
              "recordLabel": "Independent",
              "genre": ["Instrumental Guitar", "Melodic Rock"]
            })
          }}
        />

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="bg-[#190000] text-[#f8fcdc] m-0 p-0 overflow-x-hidden">
        <ConsentProvider>
          <CartProvider>
            <FacebookPixel />
            {children}
            <CookieNotice />
          </CartProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}