// app/contact/page.tsx - FINAL FIXED: Structure Corrected

import type { Metadata } from 'next';
import ContactClientComponent from './ContactClientComponent';

const BASE_URL = 'https://unda-website.vercel.app';

export const metadata: Metadata = {
  title: 'Contact | Booking & Collaboration Inquiries | UNDA ALUNDA',
  description: 'Get in touch with Unda Alunda for bookings, collaboration inquiries, press requests, and general questions.',
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
    'progressive metal guitarist',
    'instrumental guitarist booking',
    'guitar session work',
    'music producer contact',
    'live guitarist for hire'
  ],
  
  // 🎯 FIXED: Complete openGraph structure
  openGraph: {
    title: 'Contact | Booking & Collaboration Inquiries | UNDA ALUNDA',
    description: 'Get in touch with Unda Alunda for bookings and collaboration inquiries.',
    type: 'website',
    url: `${BASE_URL}/contact`,
    siteName: 'UNDA ALUNDA',
    images: [
      {
        url: `${BASE_URL}/catmoon-bg.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Unda Alunda - Dark Wonderful World',
      },
    ],
  },

  // 🎯 FIXED: Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | Booking & Collaboration Inquiries | UNDA ALUNDA',
    description: 'Get in touch with Unda Alunda for bookings and collaboration inquiries.',
    creator: '@undaalunda',
    images: [`${BASE_URL}/catmoon-bg.jpeg`],
  },

  // 🎯 FIXED: Other meta tags
  other: {
    'og:title': 'Contact | Booking & Collaboration Inquiries | UNDA ALUNDA',
    'og:description': 'Get in touch with Unda Alunda for bookings and collaboration inquiries.',
    'og:type': 'website',
    'og:url': `${BASE_URL}/contact`,
    'og:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:image:secure_url': `${BASE_URL}/catmoon-bg.jpeg`,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'Unda Alunda - Dark Wonderful World',
    'og:image:type': 'image/jpeg',
    'og:site_name': 'UNDA ALUNDA',
    'twitter:image': `${BASE_URL}/catmoon-bg.jpeg`,
    'twitter:image:alt': 'Unda Alunda - Dark Wonderful World',
  },

  alternates: {
    canonical: `${BASE_URL}/contact`,
  },

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
      {/* 🎯 FIXED: Clean Contact Page Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": `${BASE_URL}/contact#webpage`,
            "url": `${BASE_URL}/contact`,
            "name": "Contact Unda Alunda",
            "description": "Contact page for booking and collaboration inquiries with guitarist and composer Unda Alunda",
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

      {/* 🎯 FIXED: Clean Organization Schema */}
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
            "description": "Official organization page for Unda Alunda, guitarist and composer",
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

      {/* 🎯 FIXED: Clean Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Live Performance Booking",
            "description": "Professional live performance and studio session services by guitarist and composer Unda Alunda for concerts, festivals, and private events",
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