// app/page.tsx - FINAL: Unified "Official website" Strategy

import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';

const BASE_URL = 'https://unda-website.vercel.app';

export const metadata: Metadata = {
  title: 'Unda Alunda | Official Website & Merch Store',
  description: 'Official website of Unda Alunda. New album "Dark Wonderful World" coming August 26, 2025. Shop exclusive music, merch, backing tracks and more.',
  keywords: [
    'Unda Alunda',
    'Dark Wonderful World',
    'guitar virtuoso',
    'instrumental rock',
    'backing tracks',
    'guitar tabs',
    'progressive rock guitarist',
    'Thailand progressive metal',
    'Thai musician',
    'guitar transcriptions',
    'live in Thailand',
    'Overdrive Guitar Contest',
    'Mahidol University',
    'progressive metal',
    'jazz fusion',
    'instrumental guitar',
    'melodic rock',
    'atmospheric music',
    'guitar music',
    'Abasi Concepts artist',
    'guitar stems',
    'music transcription',
    'guitar backing tracks'
  ],
  
  // 🎯 FIXED: Unified strategy - Same "Official website" start
  openGraph: {
    title: 'Unda Alunda | Official Website & Merch Store',
    description: 'Official website of Unda Alunda. New album "Dark Wonderful World" coming August 26, 2025.',
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

  // 🎯 FIXED: Unified Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Unda Alunda | Official Website & Merch Store',
    description: 'Official website of Unda Alunda. New album "Dark Wonderful World" coming August 26, 2025.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  // 🎯 FIXED: Unified meta tags for social
  other: {
    'og:title': 'Unda Alunda | Official Website & Merch Store',
    'og:description': 'Official website of Unda Alunda. New album "Dark Wonderful World" coming August 26, 2025.',
    'og:type': 'website',
    'og:url': BASE_URL,
    'og:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:image:secure_url': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'Unda Alunda - Dark Wonderful World',
    'og:image:type': 'image/jpeg',
    'og:site_name': 'UNDA ALUNDA',
    'twitter:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'twitter:image:alt': 'Unda Alunda - Dark Wonderful World',
  },

  alternates: {
    canonical: BASE_URL,
  },

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
      {/* 🎯 FIXED: Clean Homepage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${BASE_URL}#webpage`,
            "url": BASE_URL,
            "name": "Unda Alunda | Official Website",
            "description": "Official website of Unda Alunda featuring the new album Dark Wonderful World",
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
              "height": 630,
              "caption": "Unda Alunda - Dark Wonderful World"
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

      {/* 🎯 FIXED: Clean Album Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicAlbum",
            "name": "Dark Wonderful World",
            "description": "The upcoming album by Unda Alunda featuring beautiful instrumental guitar compositions",
            "image": `${BASE_URL}/catmoon-bg.jpeg`,
            "datePublished": "2025-08-26",
            "byArtist": {
              "@id": `${BASE_URL}#person`
            },
            "recordLabel": "Independent",
            "genre": ["Instrumental Guitar", "Melodic Rock", "Atmospheric Music"],
            "albumProductionType": "StudioAlbum",
            "albumReleaseType": "AlbumRelease"
          })
        }}
      />

      {/* 🎯 FIXED: Pre-order Offer Schema */}
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
            "validThrough": "2025-08-26T00:00:00Z",
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

      <HomePage />
    </>
  );
}