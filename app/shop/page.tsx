// app/shop/page.tsx - FINAL VERSION: เลือกที่ดีที่สุดให้แล้ว!

import type { Metadata } from 'next';
import ShopPageWrapper from '@/components/ShopPageWrapper';
import AppClientWrapper from '@/components/AppClientWrapper';

// 🚀 ใช้ domain ปัจจุบัน (ยังไม่ต้องเปลี่ยน)
const BASE_URL = 'https://unda-website.vercel.app';

// 🚀 SEO metadata ที่ครบถ้วน
export const metadata: Metadata = {
  title: 'Shop Official Unda Alunda | Music, Merch & Digital Downloads',
  description: 'Browse the complete Unda Alunda collection including progressive rock albums, exclusive merchandise, backing tracks, guitar tabs and bundle deals. Official artist store with worldwide shipping.',
  keywords: [
    'unda alunda shop',
    'progressive rock store',
    'official artist merchandise', 
    'backing tracks',
    'guitar tabs',
    'dark wonderful world',
    'instrumental rock music',
    'thailand progressive metal',
    'digital downloads',
    'music merch bundles'
  ],
  
  openGraph: {
    title: 'Shop Official Unda Alunda | Music, Merch & Digital Downloads',
    description: 'Browse the complete Unda Alunda collection including progressive rock albums, exclusive merchandise, backing tracks, guitar tabs and bundle deals.',
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

  twitter: {
    card: 'summary_large_image',
    title: 'Shop Official Unda Alunda | Music, Merch & Digital Downloads',
    description: 'Browse the complete Unda Alunda collection including progressive rock albums, exclusive merchandise, backing tracks, guitar tabs and bundle deals.',
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
};

// 🎯 ทางเลือกที่ดีที่สุด: แสดง shop page จริง
export default function ShopPage() {
  return (
    <>
      {/* 🧠 Schema.org สำหรับ Google เข้าใจว่าเป็นหน้า shop */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Unda Alunda Official Shop",
            "description": "Complete collection of Unda Alunda music, merchandise and digital downloads",
            "url": `${BASE_URL}/shop`,
            "mainEntity": {
              "@type": "ItemList",
              "name": "All Products",
              "numberOfItems": 25
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Unda Alunda Product Catalog",
              "itemListElement": [
                {
                  "@type": "OfferCatalog",
                  "name": "Music Albums",
                  "itemListElement": []
                },
                {
                  "@type": "OfferCatalog", 
                  "name": "Merchandise",
                  "itemListElement": []
                },
                {
                  "@type": "OfferCatalog",
                  "name": "Digital Downloads",
                  "itemListElement": []
                },
                {
                  "@type": "OfferCatalog",
                  "name": "Bundle Deals", 
                  "itemListElement": []
                }
              ]
            }
          })
        }}
      />

      {/* 🗺️ Breadcrumb สำหรับ navigation */}
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

      {/* 🎨 แสดงหน้า shop จริงๆ (default เป็น merch) */}
      <AppClientWrapper>
        <ShopPageWrapper category="merch" />
      </AppClientWrapper>
    </>
  );
}