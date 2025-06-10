// app/page.tsx - MISSING FILE! (แยกจาก HomePage component)

import type { Metadata } from 'next';
import HomePage from '@/components/HomePage'; // ← Import component ที่เพื่อนมีอยู่แล้ว

// 🚀 FIXED: Use consistent domain
const BASE_URL = 'https://unda-website.vercel.app';

export const metadata: Metadata = {
  title: 'Unda Alunda | Official Website & Merch Store',
  description: 'Official website of Unda Alunda, New album "Dark Wonderful World" coming July 1, 2025. Shop exclusive music, merch, backing tracks and more.',
  keywords: [
    'Unda Alunda',
    'progressive rock guitarist',
    'Dark Wonderful World',
    'Thailand progressive metal',
    'guitar virtuoso',
    'instrumental rock',
    'backing tracks',
    'guitar tabs',
    'progressive rock',
    'Abasi Concepts artist',
    'Thai musician',
    'guitar transcriptions',
    'live in Thailand',
    'Overdrive Guitar Contest',
    'Mahidol University',
    'progressive metal',
    'jazz fusion'
  ],
  
  // 🚀 Open Graph for homepage
  openGraph: {
    title: 'Unda Alunda | Official Website & Merch Store',
    description: 'Official website of Unda Alunda, New album "Dark Wonderful World" coming July 1, 2025.',
    type: 'website',
    url: BASE_URL,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda - Progressive Rock Guitarist',
      },
    ],
  },

  // 🚀 Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Unda Alunda | Official Website & Merch Store',
    description: 'Official website of Unda Alunda, New album "Dark Wonderful World" coming July 1, 2025.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  // 🚀 Additional metadata
  other: {
    'og:title': 'Unda Alunda | Official Website & Merch Store',
    'og:description': 'Official website of Unda Alunda, New album "Dark Wonderful World" coming July 1, 2025.',
    'og:type': 'website',
    'og:url': BASE_URL,
    'og:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:site_name': 'UNDA ALUNDA',
  },

  // 🚀 Canonical URL
  alternates: {
    canonical: BASE_URL,
  },

  // 🚀 Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Page() {
  return (
    <>
      {/* 🚀 Homepage-specific Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${BASE_URL}#webpage`,
            "url": BASE_URL,
            "name": "Unda Alunda | Official Website",
            "description": "Official website of Unda Alunda, progressive rock guitarist from Thailand",
            "mainEntity": {
              "@id": `${BASE_URL}#person`
            },
            "about": {
              "@id": `${BASE_URL}#musicgroup`
            },
            "primaryImageOfPage": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/catmoon-bg.jpeg`,
              "width": 1200,
              "height": 630
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": BASE_URL
                }
              ]
            },
            "inLanguage": "en-US",
            "isPartOf": {
              "@type": "WebSite",
              "@id": `${BASE_URL}#website`
            }
          })
        }}
      />

      {/* 🚀 Offer Schema for upcoming album */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Offer",
            "name": "Dark Wonderful World - Pre-Order",
            "description": "Pre-order the upcoming album Dark Wonderful World by Unda Alunda",
            "url": `${BASE_URL}/shop/merch`,
            "availability": "https://schema.org/PreOrder",
            "validFrom": "2025-01-01T00:00:00Z",
            "validThrough": "2025-07-01T00:00:00Z",
            "seller": {
              "@type": "Organization",
              "name": "UNDA ALUNDA",
              "url": BASE_URL
            },
            "itemOffered": {
              "@type": "MusicAlbum",
              "name": "Dark Wonderful World",
              "byArtist": {
                "@id": `${BASE_URL}#person`
              }
            }
          })
        }}
      />

      {/* 🚀 ใช้ component ที่เพื่อนมีอยู่แล้ว */}
      <HomePage />
    </>
  );
}