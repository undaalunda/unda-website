// app/tour/page.tsx - MISSING PAGE! Important for SEO

import type { Metadata } from 'next';
import TourClientComponent from './TourClientComponent';

// 🚀 FIXED: Use consistent domain
const BASE_URL = 'https://unda-website.vercel.app'; // TODO: Change to 'https://www.undaalunda.com' when migrating

export const metadata: Metadata = {
  title: 'Tour Dates & Live Shows | UNDA ALUNDA',
  description: 'Check upcoming Unda Alunda tour dates, live performances and concert schedules. Experience progressive rock guitar virtuosity live in Thailand and worldwide.',
  keywords: [
    'unda alunda tour',
    'live concerts',
    'progressive rock shows',
    'thailand concerts',
    'guitar virtuoso live',
    'dark wonderful world tour',
    'live performances',
    'concert dates',
    'tour schedule',
    'bandsintown'
  ],
  
  // 🚀 Open Graph
  openGraph: {
    title: 'Tour Dates & Live Shows | UNDA ALUNDA',
    description: 'Check upcoming Unda Alunda tour dates, live performances and concert schedules. Experience progressive rock guitar virtuosity live.',
    type: 'website',
    url: `${BASE_URL}/tour`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda Live Tour',
      },
    ],
  },

  // 🚀 Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Tour Dates & Live Shows | UNDA ALUNDA',
    description: 'Check upcoming Unda Alunda tour dates, live performances and concert schedules.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  // 🚀 Canonical URL
  alternates: {
    canonical: `${BASE_URL}/tour`,
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

export default function TourPage() {
  return (
    <>
      {/* Tour Page Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Tour Dates & Live Shows",
            "description": "Upcoming Unda Alunda concert dates and live performances",
            "url": `${BASE_URL}/tour`,
            "mainEntity": {
              "@type": "MusicGroup",
              "@id": `${BASE_URL}#musicgroup`,
              "name": "Unda Alunda"
            },
            "breadcrumb": {
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
                  "name": "Tour",
                  "item": `${BASE_URL}/tour`
                }
              ]
            }
          })
        }}
      />

      <TourClientComponent />
    </>
  );
}