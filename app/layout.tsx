// app/layout.tsx - Performance Optimized + Reduced Bundle Size

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
    images: ['/catmoon-bg.jpeg'], // ✅ เก็บ JPEG สำหรับ social media
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
    'og:image': 'https://unda-website.vercel.app/catmoon-bg.jpeg', // ✅ เก็บ JPEG
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
        {/* 🚀 Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* 🎯 Preload เฉพาะรูปสำคัญที่อยู่ above-the-fold */}
        <link rel="preload" href="/text-hero-section.webp" as="image" type="image/webp" />
        <link rel="preload" href="/unda-alunda-header.webp" as="image" type="image/webp" />
        
        {/* 🎯 DNS prefetch สำหรับ resources ที่จำเป็น */}
        <link rel="dns-prefetch" href="//widget.bandsintown.com" />
        <link rel="dns-prefetch" href="//www.youtube.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* 🚀 Optimized Google Fonts - คงไว้ weights เดิมที่ชอบ */}
        {/* แบบปกติง่ายๆ - ไม่มี onLoad */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500;600;700&display=swap" 
        rel="stylesheet"
        />
        <noscript>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </noscript>
        
        {/* 🎯 Minimal social icons - ใช้ SVG แทน Font Awesome */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS สำหรับ hero section */
            .hero-wrapper{width:100vw;min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-top:6rem;padding-bottom:6vh;z-index:0;margin-top:0}
            .hero-text-image{position:absolute;top:10vh;left:50%;transform:translateX(-50%);width:80%;max-width:500px;z-index:10;pointer-events:none;opacity:0;margin-top:1rem;animation:fadeInHero 1.3s ease-out 0.2s forwards}
            @keyframes fadeInHero{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
            body{background-color:#190000;margin:0;padding:0;overflow-x:hidden}
          `
        }} />
        
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

        {/* ✅ Force preview images - เก็บ JPEG สำหรับ social media */}
        <meta property="og:image" content="https://unda-website.vercel.app/catmoon-bg.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Unda Alunda Hero Image" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* ✅ Structured Data for WebSite */}
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

        {/* ✅ Structured Data for Person */}
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
              "affiliation": {
                "@type": "Organization",
                "name": "Abasi Concepts",
                "url": "https://www.abasiconcepts.com"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://unda-website.vercel.app/about"
              }
            })
          }}
        />

        {/* ✅ Structured Data for Education & Awards */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://unda-website.vercel.app#person",
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "College of Music, Mahidol University",
                "sameAs": "https://www.music.mahidol.ac.th"
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

        {/* ✅ Structured Data for MusicGroup */}
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
              "image": "https://unda-website.vercel.app/catmoon-bg.jpeg",
              "sameAs": [
                "https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0",
                "https://www.instagram.com/undalunda",
                "https://www.youtube.com/@undaalunda",
                "https://www.facebook.com/undaalunda",
                "https://www.threads.net/@undalunda",
                "https://twitter.com/undaalunda",
                "https://music.apple.com/us/artist/unda-alunda/1543677299",
                "https://www.deezer.com/en/artist/115903802",
                "https://tidal.com/browse/artist/22524871",
                "https://music.amazon.com/artists/B08PVKFZDZ"
              ],
              "genre": ["Progressive Rock", "Progressive Metal", "Instrumental Rock", "Jazz Fusion"],
              "foundingLocation": { "@type": "Place", "name": "Thailand" },
              "member": { "@id": "https://unda-website.vercel.app#person" },
              "mainEntityOfPage": { "@id": "https://unda-website.vercel.app#website" }
            })
          }}
        />

        {/* ✅ Structured Data for SiteNavigationElement */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                { "@type": "SiteNavigationElement", "name": "Home", "url": "https://unda-website.vercel.app/" },
                { "@type": "SiteNavigationElement", "name": "Shop", "url": "https://unda-website.vercel.app/shop" },
                { "@type": "SiteNavigationElement", "name": "About", "url": "https://unda-website.vercel.app/about" },
                { "@type": "SiteNavigationElement", "name": "Tour", "url": "https://unda-website.vercel.app/tour" },
                { "@type": "SiteNavigationElement", "name": "Contact", "url": "https://unda-website.vercel.app/contact" }
              ]
            })
          }}
        />

        {/* ✅ Structured Data for VideoObject */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "Unda Alunda – Anomic | Live in Thailand (2024)",
              "description": "Live performance of 'Anomic' by Unda Alunda, recorded in Thailand during the Dark Wonderful World tour, 2024.",
              "thumbnailUrl": "https://i.ytimg.com/vi/ZwXeCx8cAIM/hqdefault.jpg",
              "uploadDate": "2024-06-19T00:00:00+07:00",
              "embedUrl": "https://www.youtube.com/embed/ZwXeCx8cAIM",
              "contentUrl": "https://www.youtube.com/watch?v=ZwXeCx8cAIM",
              "duration": "PT5M30S",
              "mainEntityOfPage": { "@id": "https://unda-website.vercel.app#website" }
            })
          }}
        />

        {/* ✅ Structured Data for Album */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicAlbum",
              "name": "Dark Wonderful World",
              "description": "The upcoming album by Unda Alunda, featuring progressive rock and metal compositions.",
              "image": "https://unda-website.vercel.app/catmoon-bg.jpeg",
              "datePublished": "2025-07-01",
              "byArtist": { "@id": "https://unda-website.vercel.app#person" },
              "recordLabel": "Independent",
              "genre": ["Progressive Rock", "Progressive Metal"],
              "mainEntityOfPage": { "@id": "https://unda-website.vercel.app#website" }
            })
          }}
        />

        {/* 🎯 Performance & Security Headers */}
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