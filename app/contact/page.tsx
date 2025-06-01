// app/contact/page.tsx - ENHANCED with contact schema

import type { Metadata } from 'next';
import ContactClientComponent from './ContactClientComponent';

// 🚀 FIXED: Use consistent domain
const BASE_URL = 'https://unda-website.vercel.app';

export const metadata: Metadata = {
  title: 'Contact Unda Alunda | Booking & Collaboration Inquiries',
  description: 'Get in touch with Unda Alunda for bookings, collaboration inquiries, press requests, and general questions. Professional progressive rock guitarist available for live performances and studio work.',
  keywords: [
    'Unda Alunda contact',
    'booking inquiries',
    'collaboration requests',
    'progressive rock guitarist booking',
    'live performance booking',
    'studio session guitarist',
    'press inquiries',
    'Thailand guitarist booking',
    'guitar virtuoso contact',
    'music collaboration',
    'concert booking',
    'progressive metal guitarist'
  ],
  
  // 🚀 Enhanced Open Graph
  openGraph: {
    title: 'Contact Unda Alunda | Booking & Collaboration Inquiries',
    description: 'Get in touch with Unda Alunda for bookings, collaboration inquiries, press requests, and general questions.',
    type: 'website',
    url: `${BASE_URL}/contact`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Contact Unda Alunda',
      },
    ],
  },

  // 🚀 Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Unda Alunda | Booking & Collaboration Inquiries',
    description: 'Get in touch with Unda Alunda for bookings, collaboration inquiries, press requests, and general questions.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  // 🚀 Additional metadata
  other: {
    'og:title': 'Contact Unda Alunda | Booking & Collaboration Inquiries',
    'og:description': 'Get in touch with Unda Alunda for bookings, collaboration inquiries, press requests, and general questions.',
    'og:type': 'website',
    'og:url': `${BASE_URL}/contact`,
    'og:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:site_name': 'UNDA ALUNDA',
  },

  // 🚀 Canonical URL
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },

  // 🚀 Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ContactPage() {
  return (
    <>
      {/* 🚀 Contact Page Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": `${BASE_URL}/contact#webpage`,
            "url": `${BASE_URL}/contact`,
            "name": "Contact Unda Alunda",
            "description": "Contact page for booking and collaboration inquiries with Unda Alunda",
            "mainEntity": {
              "@id": `${BASE_URL}#person`
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
                  "name": "Contact",
                  "item": `${BASE_URL}/contact`
                }
              ]
            },
            "inLanguage": "en-US",
            "isPartOf": {
              "@type": "WebSite",
              "@id": `${BASE_URL}#website`
            }
          })
        }}
      />

      {/* 🚀 ContactPoint Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${BASE_URL}#organization`,
            "name": "UNDA ALUNDA",
            "url": BASE_URL,
            "logo": `${BASE_URL}/unda-alunda-header.webp`,
            "image": `${BASE_URL}/catmoon-bg.jpeg`,
            "description": "Official organization page for Unda Alunda, progressive rock guitarist",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "contactType": "General Inquiries",
                "url": `${BASE_URL}/contact`,
                "availableLanguage": ["English", "Thai"]
              },
              {
                "@type": "ContactPoint", 
                "contactType": "Booking",
                "url": `${BASE_URL}/contact`,
                "availableLanguage": ["English", "Thai"]
              },
              {
                "@type": "ContactPoint",
                "contactType": "Press",
                "url": `${BASE_URL}/contact`,
                "availableLanguage": ["English", "Thai"]
              }
            ],
            "sameAs": [
              "https://www.instagram.com/undalunda",
              "https://www.youtube.com/@undaalunda",
              "https://www.facebook.com/undaalunda",
              "https://www.threads.net/@undalunda",
              "https://twitter.com/undaalunda"
            ],
            "founder": {
              "@id": `${BASE_URL}#person`
            }
          })
        }}
      />

      {/* 🚀 Service Schema for bookings */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Live Performance Booking",
            "description": "Professional live performance services by Unda Alunda for concerts, festivals, and private events",
            "provider": {
              "@id": `${BASE_URL}#person`
            },
            "serviceType": ["Live Performance", "Concert", "Studio Session", "Collaboration"],
            "areaServed": {
              "@type": "Place",
              "name": "Worldwide"
            },
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceUrl": `${BASE_URL}/contact`,
              "serviceSmsNumber": "",
              "servicePostalAddress": {
                "@type": "PostalAddress",
                "addressCountry": "TH"
              }
            }
          })
        }}
      />

      <ContactClientComponent />
    </>
  );
}