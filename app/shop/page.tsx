//app/shop/page.tsx

import ShopLandingContent from '@/components/ShopLandingContent';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';

const BASE_URL = 'https://unda-website.vercel.app'; // TODO: Change to 'https://www.undaalunda.com' when migrating

// Enhanced metadata for the new shop landing page
export const metadata: Metadata = {
  title: 'Shop | Physical & Digital Music Store | UNDA ALUNDA',
  description: 'Shop exclusive Unda Alunda merchandise, physical albums, and digital content. Choose between physical products (merch, CDs, vinyl) or digital downloads (backing tracks, tabs, stems).',
  keywords: [
    'unda alunda shop',
    'progressive rock merchandise',
    'backing tracks',
    'guitar tabs',
    'music stems',
    'physical albums',
    'digital downloads',
    'musician merchandise',
    'thai progressive rock',
    'official store'
  ],
  
  // Open Graph
  openGraph: {
    title: 'Shop | Physical & Digital Music Store | UNDA ALUNDA',
    description: 'Shop exclusive Unda Alunda merchandise, physical albums, and digital content. Choose between physical products or digital downloads.',
    type: 'website',
    url: `${BASE_URL}/shop`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda Official Shop',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Shop | Physical & Digital Music Store | UNDA ALUNDA',
    description: 'Shop exclusive Unda Alunda merchandise, physical albums, and digital content.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  // Additional metadata
  other: {
    'og:title': 'Shop | Physical & Digital Music Store | UNDA ALUNDA',
    'og:description': 'Shop exclusive Unda Alunda merchandise, physical albums, and digital content.',
    'og:type': 'website',
    'og:url': `${BASE_URL}/shop`,
    'og:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:site_name': 'UNDA ALUNDA',
  },

  // Canonical URL
  alternates: {
    canonical: `${BASE_URL}/shop`,
  },

  // Robots
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

export default function ShopPage() {
  // Structured data for the shop landing page
  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Unda Alunda Official Shop",
    "description": "Official store for Unda Alunda merchandise, music, and digital content",
    "url": `${BASE_URL}/shop`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Shop Categories",
      "numberOfItems": 2,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Physical Products",
          "description": "Merchandise, CDs, vinyl, books, and bundles",
          "url": `${BASE_URL}/shop/physical`
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Digital Products",
          "description": "Backing tracks, tabs, stems, and digital downloads",
          "url": `${BASE_URL}/shop/digital`
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
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(shopSchema)
        }}
      />

      {/* Breadcrumb Schema */}
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
              }
            ]
          })
        }}
      />

      <AppClientWrapper>
        <ShopLandingContent />
      </AppClientWrapper>
    </>
  );
}