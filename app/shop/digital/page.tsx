// app/shop/digital/page.tsx

import DigitalShopContent from '@/components/DigitalShopContent';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://undaalunda.com';

export const metadata: Metadata = {
  title: 'Digital Downloads | Backing Tracks, Tabs & Stems | UNDA ALUNDA',
  description: 'Download high-quality backing tracks, guitar tabs, stems and digital content from Unda Alunda. Professional music files for musicians and producers. Choose from complete album collections and exclusive solo pieces featuring professional WAV files and detailed transcriptions.',
  keywords: [
    'backing tracks download',
    'guitar tabs digital',
    'progressive rock stems',
    'music stems download',
    'instrumental backing tracks',
    'guitar transcriptions',
    'digital sheet music',
    'unda alunda tabs',
    'unda alunda digital shop',
    'progressive rock downloads',
    'musician tools',
    'album downloads',
    'dark wonderful world digital',
    'solo collection guitar',
    'competition guitar solos',
    'professional music files',
    'WAV backing tracks',
    'PDF tabs',
    'multi-track stems',
    'thai progressive rock digital'
  ],
  
  openGraph: {
    title: 'Digital Downloads | Backing Tracks, Tabs & Stems | UNDA ALUNDA',
    description: 'Download high-quality backing tracks, guitar tabs, stems and digital content from Unda Alunda albums and solo collections. Professional music files for musicians and producers.',
    type: 'website',
    url: `${BASE_URL}/shop/digital`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda Digital Shop',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Digital Downloads | Backing Tracks, Tabs & Stems | UNDA ALUNDA',
    description: 'Download high-quality backing tracks, guitar tabs, stems and digital content from Unda Alunda albums and solo collections.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  alternates: {
    canonical: `${BASE_URL}/shop/digital`,
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
};

export default function DigitalShopPage() {
  const digitalShopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Digital Downloads",
    "description": "Backing tracks, tabs and digital music content from Unda Alunda",
    "url": `${BASE_URL}/shop/digital`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Digital Collections",
      "numberOfItems": 2,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Dark Wonderful World",
          "description": "Complete digital collection with 141 products including professional backing tracks, detailed tabs, and high-quality stems for guitar, bass, keys, and drums",
          "url": `${BASE_URL}/shop/digital/dark-wonderful-world`,
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "4.95",
            "highPrice": "11.95",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Solo Collection",
          "description": "Exclusive guitar tabs from prestigious competition entries including Abasi Neural Contest 2020, Mayones Guitar Solo Competition 2021, and The Vola 2021 Solo Competition",
          "url": `${BASE_URL}/shop/digital/solo-collection`,
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "7.95",
            "highPrice": "7.95",
            "priceCurrency": "USD"
          }
        }
      ]
    },
    "provider": {
      "@type": "Organization",
      "name": "UNDA ALUNDA",
      "url": BASE_URL
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(digitalShopSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Digital",
                "item": `${BASE_URL}/shop/digital`
              }
            ]
          })
        }}
      />

      <AppClientWrapper>
        <DigitalShopContent />
      </AppClientWrapper>
    </>
  );
}