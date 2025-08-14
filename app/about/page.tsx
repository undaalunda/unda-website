// app/about/page.tsx

import type { Metadata } from 'next';
import AboutClientComponent from './AboutClientComponent';

const BASE_URL = 'https://unda-website.vercel.app'; // TODO: Change to undaalunda.com

// 🚀 Artist-Focused SEO Metadata 
export const metadata: Metadata = {
  title: 'About | UNDA ALUNDA',
  description: 'Meet Unda Alunda, guitarist and composer. Creator of Dark Wonderful World album and Abasi Concepts endorser. Discover his musical journey from childhood sounds to instrumental rock artistry.',
  
  keywords: [
    'Unda Alunda',
    'progressive guitarist',
    'instrumental composer',
    'progressive guitar',
    'instrumental rock',
    'Dark Wonderful World',
    'Abasi Concepts',
    'progressive metal',
    'guitar artist',
    'Tosin Abasi',
    'guitar instrumental',
    'progressive music',
    'guitar virtuoso',
    'instrumental music',
    'guitar endorser',
    'progressive rock artist',
    'guitar composer',
    'instrumental guitarist'
  ],

  // 🚀 Enhanced Open Graph
  openGraph: {
    title: 'About | UNDA ALUNDA',
    description: 'Guitarist and composer, creator of Dark Wonderful World album. Abasi Concepts endorser.',
    type: 'profile',
    url: `${BASE_URL}/about`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda - Guitarist & Composer',
      }
    ],
    locale: 'en_US',
  },

  // 🚀 Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'About | UNDA ALUNDA',
    description: 'Guitarist and composer, creator of Dark Wonderful World album. Abasi Concepts endorser.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
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

  alternates: {
    canonical: `${BASE_URL}/about`,
  },

  other: {
    'og:type': 'profile',
    'profile:first_name': 'Unda',
    'profile:last_name': 'Alunda',
    'profile:username': 'undaalunda',
    
    'music:musician': 'Unda Alunda',
    'music:album': 'Dark Wonderful World',
    'music:release_date': '2024-04-18',
    'music:genre': 'Progressive Rock',
    
    'og:locale': 'en_US',
    
    'article:author': 'Unda Alunda',
    'article:published_time': '2024-04-18T00:00:00+00:00',
    'article:modified_time': new Date().toISOString(),
    'article:section': 'Biography',
    'article:tag': 'progressive guitarist, instrumental composer, guitar artist',
  }
};

export default function AboutPage() {
  return (
    <>
      {/* 🚀 Artist-Focused Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${BASE_URL}/about#person`,
            "name": "Unda Alunda",
            "description": "Guitarist and composer, creator of Dark Wonderful World album. Abasi Concepts endorser specializing in instrumental rock and progressive metal.",
            "url": `${BASE_URL}/about`,
            "image": [
              `${BASE_URL}/catmoon-bg.jpeg`
            ],
            "sameAs": [
              `${BASE_URL}`,
              "https://www.instagram.com/undalunda",
              "https://www.youtube.com/@undaalunda",
              "https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0",
              "https://music.apple.com/us/artist/unda-alunda/1543677299"
            ],
            
            // 🎵 Primary Artist Identity
            "jobTitle": "Guitarist & Composer",
            "hasOccupation": {
              "@type": "Occupation",
              "name": "Musician",
              "description": "Guitarist and instrumental composer"
            },
            
            // 🎼 Main Creative Works (Focus)
            "hasCreativeWork": [
              {
                "@type": "MusicAlbum",
                "name": "Dark Wonderful World",
                "datePublished": "2024-04-18",
                "genre": ["Progressive Rock", "Instrumental Rock", "Progressive Metal"],
                "inLanguage": "en",
                "creator": {
                  "@type": "Person",
                  "name": "Unda Alunda"
                },
                "description": "Debut album featuring progressive rock and instrumental compositions"
              }
            ],
            
            // 🎓 Education (Subtle)
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "College of Music, Mahidol University"
            },
            
            // 🌍 Geographic (Contextual)
            "nationality": {
              "@type": "Country",
              "name": "Thailand"
            },
            
            // 🎸 Musical Identity
            "performerIn": {
              "@type": "MusicGroup",
              "name": "Unda Alunda",
              "genre": ["Progressive Rock", "Instrumental Rock", "Progressive Metal"]
            },
            
            // 🤝 Professional Endorsement (Main Credibility)
            "sponsor": {
              "@type": "Organization",
              "name": "Abasi Concepts",
              "description": "Guitar and music equipment company founded by Tosin Abasi",
              "url": "https://www.abasiconcepts.com"
            },
            
            // 🎯 Core Skills
            "knowsAbout": [
              "Progressive Guitar",
              "Instrumental Composition", 
              "Music Production",
              "Guitar Techniques",
              "Progressive Rock",
              "Progressive Metal"
            ],
            
            // 🎵 Instruments
            "instrument": "Electric Guitar",
            
            // 🏅 Recognition (Subtle Mention)
            "award": [
              "Abasi Neural Contest recognition",
              "Guitar competition achievements"
            ],
            
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${BASE_URL}/about`,
              "url": `${BASE_URL}/about`
            }
          })
        }}
      />

      {/* 🚀 Enhanced BreadcrumbList */}
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
                "name": "About Unda Alunda",
                "item": `${BASE_URL}/about`
              }
            ]
          })
        }}
      />

      {/* 🚀 AboutPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": `${BASE_URL}/about#webpage`,
            "url": `${BASE_URL}/about`,
            "name": "About | UNDA ALUNDA",
            "description": "Learn about Unda Alunda's musical journey and artistic vision. Discover the story behind Dark Wonderful World album and his approach to progressive guitar music.",
            "mainEntity": {
              "@id": `${BASE_URL}/about#person`
            },
            "inLanguage": "en-US",
            "isPartOf": {
              "@type": "WebSite",
              "@id": `${BASE_URL}#website`,
              "name": "UNDA ALUNDA",
              "url": BASE_URL
            },
            "author": {
              "@id": `${BASE_URL}/about#person`
            },
            "datePublished": "2024-04-18T00:00:00+00:00",
            "dateModified": new Date().toISOString(),
            "keywords": "Unda Alunda, progressive guitarist, instrumental composer, Dark Wonderful World, Abasi Concepts",
            "about": {
              "@type": "Person",
              "@id": `${BASE_URL}/about#person`
            }
          })
        }}
      />

      {/* 🚀 MusicGroup Schema (Artist Project) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "@id": `${BASE_URL}/about#musicgroup`,
            "name": "Unda Alunda",
            "description": "Instrumental music project featuring original compositions and guitar-driven soundscapes",
            "genre": ["Progressive Rock", "Instrumental Rock", "Progressive Metal"],
            "member": {
              "@type": "Person",
              "@id": `${BASE_URL}/about#person`,
              "name": "Unda Alunda",
              "roleName": ["Guitarist", "Composer"]
            },
            "album": {
              "@type": "MusicAlbum",
              "name": "Dark Wonderful World",
              "datePublished": "2024-04-18"
            },
            "url": BASE_URL,
            "mainEntityOfPage": BASE_URL,
            "sameAs": [
              "https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0",
              "https://music.apple.com/us/artist/unda-alunda/1543677299",
              "https://www.youtube.com/@undaalunda"
            ]
          })
        }}
      />

      {/* 🚀 Brand/Sponsorship Schema (Abasi Concepts) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Endorsement",
            "endorsee": {
              "@type": "Person",
              "@id": `${BASE_URL}/about#person`
            },
            "endorser": {
              "@type": "Organization",
              "name": "Abasi Concepts",
              "description": "Guitar and music equipment company",
              "founder": {
                "@type": "Person",
                "name": "Tosin Abasi"
              }
            },
            "description": "Abasi Concepts endorser and artist"
          })
        }}
      />

      <AboutClientComponent />
    </>
  );
}