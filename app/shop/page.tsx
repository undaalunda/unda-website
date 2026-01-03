// app/shop/page.tsx

import ShopLandingContent from '@/components/ShopLandingContent';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://undaalunda.com';

export const metadata: Metadata = {
  title: 'Shop | Physical & Digital Products | UNDA ALUNDA',
  description: 'Shop exclusive Unda Alunda products including physical merchandise, music albums, digital downloads, backing tracks, guitar tabs, and stems. Professional music content for musicians with worldwide shipping.',
  keywords: [
    'unda alunda shop',
    'progressive rock merchandise',
    'physical shop',
    'digital downloads',
    'guitar tabs',
    'backing tracks',
    'music stems',
    'progressive metal merch',
    't-shirts',
    'stickers',
    'keychains',
    'cd albums',
    'vinyl records',
    'transcription books',
    'bundles',
    'dark wonderful world',
    'musician tools',
    'professional backing tracks',
    'guitar transcriptions',
    'bass tabs',
    'drums tabs',
    'keys transcriptions',
    'thai progressive rock',
    'instrumental rock',
    'guitar virtuoso',
    'music education',
    'practice tracks',
    'official artist merchandise',
    'worldwide shipping',
    'digital music files',
    'pdf transcriptions',
    'wav files',
    'music production',
    'solo collection',
    'guitar competition',
    'contest entries'
  ],
  
  openGraph: {
    title: 'Shop | Physical & Digital Products | UNDA ALUNDA',
    description: 'Shop exclusive Unda Alunda products including physical merchandise, music albums, and professional digital downloads for musicians.',
    type: 'website',
    url: `${BASE_URL}/shop`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda Shop - Physical and Digital Products',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Shop | Physical & Digital Products | UNDA ALUNDA',
    description: 'Shop exclusive Unda Alunda products including physical merchandise, music albums, and professional digital downloads for musicians.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  alternates: {
    canonical: `${BASE_URL}/shop`,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  other: {
    'theme-color': '#160000',
    'color-scheme': 'dark',
  },
};

export default function ShopPage() {
  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop - Unda Alunda",
    "description": "Official shop for Unda Alunda merchandise, music, and digital content",
    "url": `${BASE_URL}/shop`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Shop Categories",
      "numberOfItems": 2,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Physical Shop",
          "description": "Official merchandise, music albums, and exclusive bundles with worldwide shipping",
          "url": `${BASE_URL}/shop/physical`,
          "image": `${BASE_URL}/catmoon-bg.jpeg`,
          "mainEntity": {
            "@type": "Store",
            "name": "Unda Alunda Physical Store",
            "description": "Physical merchandise and music products",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Physical Products",
              "itemListElement": [
                {
                  "@type": "OfferCatalog",
                  "name": "Merchandise",
                  "description": "T-shirts, stickers, keychains, and collectibles"
                },
                {
                  "@type": "OfferCatalog", 
                  "name": "Music Albums",
                  "description": "CDs, vinyl records, and transcription books"
                },
                {
                  "@type": "OfferCatalog",
                  "name": "Bundle Packages", 
                  "description": "Special deals combining music and merchandise"
                }
              ]
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Digital Shop",
          "description": "Professional high-quality backing tracks, tabs, and stems for musicians",
          "url": `${BASE_URL}/shop/digital`,
          "image": `${BASE_URL}/catmoon-bg.jpeg`,
          "mainEntity": {
            "@type": "DigitalDocument",
            "name": "Unda Alunda Digital Content",
            "description": "Professional music files and educational content for musicians",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Digital Products",
              "itemListElement": [
                {
                  "@type": "OfferCatalog",
                  "name": "Dark Wonderful World Collection",
                  "description": "Complete album collection with 141+ products including backing tracks, tabs, and stems",
                  "numberOfItems": 141
                },
                {
                  "@type": "OfferCatalog",
                  "name": "Solo Collection",
                  "description": "Guitar tabs from prestigious competition entries",
                  "numberOfItems": 4
                }
              ]
            }
          }
        }
      ]
    },
    "provider": {
      "@type": "Organization",
      "name": "UNDA ALUNDA",
      "url": BASE_URL,
      "logo": `${BASE_URL}/unda-alunda-header.webp`,
      "sameAs": [
        "https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0",
        "https://music.apple.com/us/artist/unda-alunda/1543677299",
        "https://www.deezer.com/en/artist/115903802",
        "https://tidal.com/browse/artist/22524871",
        "https://music.amazon.com/artists/B08PVKFZDZ/unda-alunda"
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/shop?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${BASE_URL}/shop`
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "UNDA ALUNDA",
    "url": BASE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/shop?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(shopSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />

      <AppClientWrapper>
        <ShopLandingContent />
      </AppClientWrapper>
    </>
  );
}