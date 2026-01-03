// app/shop/digital/[album]/page.tsx - Final Clean Version

import AlbumHubPage from '@/components/AlbumHubPage';
import SoloCollectionPage from '@/components/SoloCollectionPage';
import AppClientWrapper from '@/components/AppClientWrapper';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://undaalunda.com';

export async function generateStaticParams() {
  return [
    { album: 'dark-wonderful-world' },
    { album: 'solo-collection' },
  ];
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { album } = await params;
  
  const albumConfig: Record<string, any> = {
    'dark-wonderful-world': {
      title: 'Dark Wonderful World - Digital Products | Tabs, Backing Tracks & Stems | UNDA ALUNDA',
      description: 'Download complete digital collection for Dark Wonderful World album. High-quality tabs, backing tracks, and stems for guitar, bass, keys, and drums. Professional music files for musicians featuring 141 products including WAV backing tracks, PDF transcriptions, and multi-track stems.',
      keywords: [
        'dark wonderful world tabs',
        'unda alunda digital',
        'progressive rock tabs',
        'backing tracks download',
        'music stems',
        'guitar transcriptions',
        'bass tabs',
        'keys transcriptions',
        'drums tabs',
        'digital sheet music',
        'dark wonderful world backing tracks',
        'professional backing tracks',
        'WAV files 48kHz 24-bit',
        'multi-track stems',
        'progressive metal tabs',
        'instrumental backing tracks',
        'thai progressive rock',
        'guitar virtuoso tabs',
        'live album backing tracks',
        'musician practice tracks'
      ]
    },
    'solo-collection': {
      title: 'Solo Collection | Guitar Contest Entries | UNDA ALUNDA',
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
        'guitar contest tabs',
        'pdf guitar tabs',
        'digital guitar transcriptions'
      ]
    }
  };

  if (!albumConfig[album]) {
    notFound();
  }

  const config = albumConfig[album];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      url: `${BASE_URL}/shop/digital/${album}`,
      siteName: 'UNDA ALUNDA',
      images: [
        {
          url: album === 'solo-collection' ? `${BASE_URL}/solo-collection.webp` : `${BASE_URL}/catmoon-bg.jpeg`,
          width: 1200,
          height: 630,
          alt: `Unda Alunda ${album} digital collection`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      creator: '@undaalunda',
      images: [album === 'solo-collection' ? `${BASE_URL}/solo-collection.webp` : `${BASE_URL}/catmoon-bg.jpeg`],
    },

    alternates: {
      canonical: `${BASE_URL}/shop/digital/${album}`,
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
}

export default async function AlbumPage({ params, searchParams }: any) {
  const { album } = await params;
  
  const validAlbums = ['dark-wonderful-world', 'solo-collection'];
  if (!validAlbums.includes(album)) {
    notFound();
  }

  // ✅ เปลี่ยนชื่อตัวแปรเพื่อไม่ให้ซ้ำ
  const searchParamsData = await searchParams;
  const filter = searchParamsData?.filter;
  const instrument = searchParamsData?.instrument;
 
  // Generate different schemas based on collection type
  const albumSchema = album === 'solo-collection' ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Solo Collection - Guitar Contest Entries",
    "description": "Guitar tabs from prestigious guitar competitions and contests",
    "url": `${BASE_URL}/shop/digital/solo-collection`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Guitar Contest Tabs",
      "numberOfItems": 3,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Abasi Neural Contest 2020",
          "description": "Competition entry for the prestigious Abasi Neural Contest 2020",
          "offers": {
            "@type": "Offer",
            "price": "4.95",
            "priceCurrency": "USD"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Mayones Guitar Solo Competition 2021",
          "description": "Entry for the MRNB Contest 2021 showcasing technical guitar prowess",
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
          "offers": {
            "@type": "Offer",
            "price": "6.95",
            "priceCurrency": "USD"
          }
        }
      ]
    }
  } : {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${album.replace(/-/g, ' ').toUpperCase()} - Digital Collection`,
    "description": "Complete digital collection including professional backing tracks, detailed tabs, and high-quality stems for all instruments",
    "url": `${BASE_URL}/shop/digital/${album}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Digital Products",
      "numberOfItems": 141,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Backing Tracks",
          "description": "Professional WAV backing tracks (48kHz/24-bit) without specific instruments",
          "numberOfItems": 50
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tabs & Transcriptions",
          "description": "Detailed PDF transcriptions for guitar, bass, keys, and drums",
          "numberOfItems": 41
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Stems",
          "description": "High-quality multi-track stems for professional mixing",
          "numberOfItems": 50
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(albumSchema)
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
                "name": album === 'solo-collection' ? 'Solo Collection' : album.replace(/-/g, ' ').toUpperCase(),
                "item": `${BASE_URL}/shop/digital/${album}`
              }
            ]
          })
        }}
      />

      <AppClientWrapper>
        {album === 'solo-collection' ? (
          <SoloCollectionPage 
            initialFilter={filter} 
            initialInstrument={instrument} 
          />
        ) : (
          <AlbumHubPage 
            albumSlug={album} 
            initialFilter={filter} 
            initialInstrument={instrument} 
          />
        )}
      </AppClientWrapper>
    </>
  );
}