// app/shop/[category]/page.tsx - FIXED: Complete metadata + missing pages

import ShopPageWrapper from '@/components/ShopPageWrapper';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// 🚀 FIXED: Use consistent domain
const BASE_URL = 'https://unda-website.vercel.app'; // TODO: Change to 'https://www.undaalunda.com' when migrating

// 🚀 FIXED: Add generateStaticParams for all categories
export async function generateStaticParams() {
  return [
    { category: 'merch' },
    { category: 'music' },
    { category: 'bundles' },
    { category: 'digital' },
  ];
}

// Enhanced metadata generation with better SEO
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const categoryKey = params.category?.toLowerCase();
  
  const categoryConfig = {
    merch: {
      title: 'Official Merch Store | T-Shirts, Stickers & More | UNDA ALUNDA',
      description: 'Shop exclusive Unda Alunda merchandise including limited edition t-shirts, stickers, keychains and collectibles. Official progressive rock artist merch with worldwide shipping.',
      keywords: [
        'unda alunda merch',
        'progressive rock merchandise', 
        't-shirt',
        'stickers', 
        'keychain',
        'cat scores t-shirt',
        'musician cats',
        'dark wonderful world merch',
        'thailand progressive rock',
        'official artist merch'
      ]
    },
    music: {
      title: 'Physical Albums & Music | CDs, Vinyl & Audio | UNDA ALUNDA', 
      description: 'Buy official Unda Alunda physical music releases including Dark Wonderful World live recordings, CDs, vinyl and premium audio formats from the progressive rock virtuoso.',
      keywords: [
        'unda alunda albums',
        'progressive rock CD',
        'dark wonderful world live',
        'instrumental rock vinyl',
        'thai progressive metal',
        'guitar virtuoso music',
        'live recording thailand',
        'physical music releases'
      ]
    },
    bundles: {
      title: 'Value Bundles & Deals | Music + Merch Packages | UNDA ALUNDA',
      description: 'Save with exclusive Unda Alunda bundle deals combining albums, merchandise, tabs and more. Perfect packages for progressive rock fans at special prices.',
      keywords: [
        'unda alunda bundles',
        'music merch bundle',
        'progressive rock deals',
        'album merch package',
        'value packs',
        'fan bundles',
        'special offers',
        'discounted packages'
      ]
    },
    digital: {
      title: 'Digital Downloads | Backing Tracks, Tabs & Stems | UNDA ALUNDA',
      description: 'Download high-quality backing tracks, guitar tabs, stems and digital content from Unda Alunda. Professional music files for musicians and producers.',
      keywords: [
        'backing tracks download',
        'guitar tabs digital',
        'progressive rock stems',
        'music stems download',
        'instrumental backing tracks',
        'guitar transcriptions',
        'digital sheet music',
        'unda alunda tabs'
      ]
    }
  };

  if (!categoryKey || !categoryConfig[categoryKey as keyof typeof categoryConfig]) {
    notFound();
  }

  const config = categoryConfig[categoryKey as keyof typeof categoryConfig];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    
    // 🚀 Enhanced Open Graph
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      url: `${BASE_URL}/shop/${categoryKey}`,
      siteName: 'UNDA ALUNDA',
      images: [
        {
          url: `${BASE_URL}/catmoon-bg.jpeg`,
          width: 1200,
          height: 630,
          alt: `Unda Alunda ${categoryKey} collection`,
        },
      ],
    },

    // 🚀 Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      creator: '@undaalunda',
      images: [`${BASE_URL}/catmoon-bg.jpeg`],
    },

    // 🚀 Additional metadata
    other: {
      'og:title': config.title,
      'og:description': config.description,
      'og:type': 'website',
      'og:url': `${BASE_URL}/shop/${categoryKey}`,
      'og:image': `${BASE_URL}/catmoon-bg.jpeg`,
      'og:site_name': 'UNDA ALUNDA',
    },

    // 🚀 Canonical URL
    alternates: {
      canonical: `${BASE_URL}/shop/${categoryKey}`,
    },

    // 🚀 Robots
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
}

// 🚀 Default export function
export default async function ShopCategoryPage({ params }: any) {
  const { category } = await params;
  
  // Validate category
  const validCategories = ['merch', 'music', 'bundles', 'digital'];
  if (!category || !validCategories.includes(category.toLowerCase())) {
    notFound();
  }

  // 🚀 Add structured data for each category
  const categorySchemas = {
    merch: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Official Merchandise",
      "description": "Exclusive Unda Alunda merchandise collection",
      "url": `${BASE_URL}/shop/merch`,
      "mainEntity": {
        "@type": "ItemList",
        "name": "Merch Products",
        "numberOfItems": 4
      }
    },
    music: {
      "@context": "https://schema.org",
      "@type": "CollectionPage", 
      "name": "Physical Music Albums",
      "description": "Official Unda Alunda music releases and albums",
      "url": `${BASE_URL}/shop/music`,
      "mainEntity": {
        "@type": "ItemList",
        "name": "Music Products",
        "numberOfItems": 2
      }
    },
    bundles: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Value Bundle Packages", 
      "description": "Special bundle deals combining music and merchandise",
      "url": `${BASE_URL}/shop/bundles`,
      "mainEntity": {
        "@type": "ItemList",
        "name": "Bundle Products",
        "numberOfItems": 7
      }
    },
    digital: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Digital Downloads",
      "description": "Backing tracks, tabs and digital music content",
      "url": `${BASE_URL}/shop/digital`,
      "mainEntity": {
        "@type": "ItemList", 
        "name": "Digital Products",
        "numberOfItems": 12
      }
    }
  };

  const schema = categorySchemas[category.toLowerCase() as keyof typeof categorySchemas];

  return (
    <>
      {/* 🚀 Category-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />

      {/* 🚀 Breadcrumb Schema */}
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
                "name": category.charAt(0).toUpperCase() + category.slice(1),
                "item": `${BASE_URL}/shop/${category}`
              }
            ]
          })
        }}
      />

      <AppClientWrapper>
        <ShopPageWrapper category={category} />
      </AppClientWrapper>
    </>
  );
}