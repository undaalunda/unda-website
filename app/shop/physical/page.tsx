// app/shop/physical/page.tsx

import PhysicalShopContent from '@/components/PhysicalShopContent';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://undaalunda.com';

export const metadata: Metadata = {
  title: 'Physical Shop | Merchandise, Music & Bundles | UNDA ALUNDA',
  description: 'Shop exclusive Unda Alunda physical products including limited edition t-shirts, stickers, keychains, CDs, vinyl records, transcription books, and special bundles. Official progressive rock artist merch with worldwide shipping.',
  keywords: [
    'unda alunda merch',
    'progressive rock merchandise',
    't-shirt',
    'stickers',
    'keychain',
    'cat scores t-shirt',
    'musician cats',
    'dark wonderful world merch',
    'unda alunda albums',
    'progressive rock CD',
    'dark wonderful world live',
    'instrumental rock vinyl',
    'thai progressive metal',
    'guitar virtuoso music',
    'live recording thailand',
    'physical music releases',
    'unda alunda bundles',
    'music merch bundle',
    'progressive rock deals',
    'album merch package',
    'value packs',
    'fan bundles',
    'special offers',
    'discounted packages',
    'thailand progressive rock',
    'official artist merch'
  ],
  
  openGraph: {
    title: 'Physical Shop | Merchandise, Music & Bundles | UNDA ALUNDA',
    description: 'Shop exclusive Unda Alunda physical products including merchandise, CDs, vinyl records, and special bundles.',
    type: 'website',
    url: `${BASE_URL}/shop/physical`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda Physical Shop',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Physical Shop | Merchandise, Music & Bundles | UNDA ALUNDA',
    description: 'Shop exclusive Unda Alunda physical products including merchandise, CDs, vinyl records, and special bundles.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  alternates: {
    canonical: `${BASE_URL}/shop/physical`,
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

// แก้ไข interface สำหรับ Next.js 15+
interface PageProps {
  searchParams: Promise<{ tab?: 'merch' | 'music' | 'bundles' }>;
}

export default async function PhysicalShopPage({ searchParams }: PageProps) {
  // await searchParams ก่อนใช้งาน
  const params = await searchParams;
  
  const validTabs = ['MERCH', 'MUSIC', 'BUNDLES'] as const;
  const tabParam = params?.tab?.toUpperCase();
  const initialTab = validTabs.includes(tabParam as any) ? (tabParam as typeof validTabs[number]) : 'MERCH';

  const physicalShopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Physical Shop - Unda Alunda",
    "description": "Physical merchandise, music, and bundles from Unda Alunda",
    "url": `${BASE_URL}/shop/physical`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Physical Products",
      "numberOfItems": 18,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Official Merchandise",
          "description": "Exclusive Unda Alunda merchandise collection including limited edition t-shirts, stickers, keychains and collectibles",
          "numberOfItems": 5
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Physical Music Albums",
          "description": "Official Unda Alunda music releases including Dark Wonderful World live recordings, CDs, vinyl and transcription books",
          "numberOfItems": 6
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Value Bundle Packages",
          "description": "Special bundle deals combining music and merchandise at exclusive savings",
          "numberOfItems": 7
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
          __html: JSON.stringify(physicalShopSchema)
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
                "name": "Physical",
                "item": `${BASE_URL}/shop/physical`
              }
            ]
          })
        }}
      />

      <AppClientWrapper>
        <PhysicalShopContent initialTab={initialTab} />
      </AppClientWrapper>
    </>
  );
}