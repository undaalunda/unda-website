// app/shop/digital/solo-collection/page.tsx

import SoloCollectionPage from '@/components/SoloCollectionPage';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';

const BASE_URL = 'https://unda-website.vercel.app';

export const metadata: Metadata = {
  title: 'Solo Collection | Guitar Competition Entries | UNDA ALUNDA',
  description: 'Download exclusive guitar tabs from prestigious competition entries including Abasi Neural Contest 2020, Mayones Guitar Solo Competition 2021, and The Vola 2021 Solo Competition. Professional guitar solo transcriptions from contest performances.',
  keywords: [
    'guitar solo tabs',
    'competition guitar solos',
    'abasi neural contest',
    'mayones guitar competition',
    'vola solo competition',
    'unda alunda solo collection',
    'guitar contest entries',
    'technical guitar tabs',
    'progressive guitar solos',
    'competition transcriptions',
    'guitar virtuoso tabs',
    'contest guitar pieces',
    'advanced guitar tabs',
    'professional guitar solos',
    'guitar competition downloads',
    'technical guitar transcriptions',
    'modern guitar solos',
    'guitar contest tabs'
  ],
  
  openGraph: {
    title: 'Solo Collection | Guitar Competition Entries | UNDA ALUNDA',
    description: 'Download exclusive guitar tabs from prestigious competition entries. Professional transcriptions from guitar contests.',
    type: 'website',
    url: `${BASE_URL}/shop/digital/solo-collection`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/solo-collection.webp`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda Solo Collection - Guitar Competition Entries',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Solo Collection | Guitar Competition Entries | UNDA ALUNDA',
    description: 'Download exclusive guitar tabs from prestigious competition entries.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/solo-collection.webp`],
  },

  alternates: {
    canonical: `${BASE_URL}/shop/digital/solo-collection`,
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

export default function SoloCollectionRoute({ searchParams }: any) {
  const filter = searchParams?.filter || 'all';
  const instrument = searchParams?.instrument || 'all';

  const soloCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Solo Collection - Guitar Competition Entries",
    "description": "Exclusive guitar solo transcriptions from prestigious guitar competitions and contests",
    "url": `${BASE_URL}/shop/digital/solo-collection`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Guitar Competition Solos",
      "numberOfItems": 3,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Abasi Neural Contest 2020",
          "description": "Competition entry for the prestigious Abasi Neural Contest 2020",
          "url": `${BASE_URL}/product/abasi-neural-contest-2020`,
          "offers": {
            "@type": "Offer",
            "price": "7.95",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Mayones Guitar Solo Competition 2021",
          "description": "Entry for the MRNB Contest 2021 showcasing technical guitar prowess",
          "url": `${BASE_URL}/product/mayones-guitar-solo-2021`,
          "offers": {
            "@type": "Offer",
            "price": "7.95",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "The Vola 2021 Solo Competition",
          "description": "Competitive solo piece demonstrating advanced guitar techniques",
          "url": `${BASE_URL}/product/vola-solo-competition-2021`,
          "offers": {
            "@type": "Offer",
            "price": "7.95",
            "priceCurrency": "USD"
          }
        }
      ]
    },
    "isPartOf": {
      "@type": "CollectionPage",
      "name": "Digital Shop",
      "url": `${BASE_URL}/shop/digital`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(soloCollectionSchema)
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
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Solo Collection",
                "item": `${BASE_URL}/shop/digital/solo-collection`
              }
            ]
          })
        }}
      />

      <AppClientWrapper>
        <SoloCollectionPage 
          initialFilter={filter}
          initialInstrument={instrument}
        />
      </AppClientWrapper>
    </>
  );
}