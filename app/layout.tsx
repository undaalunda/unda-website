// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Unda Alunda | Official Website & Merch Store',
  description: 'Official Website of Unda Alunda. The New Album Dark Wonderful World out July 1, 2025 — Purchase now!',
  keywords: [
    'Unda', 'Alunda', 'Unda Alunda', 'Dark Wonderful World',
    'music', 'merch', 'Stems', 'Transcription', 'Tour date',
    'Live in Thailand', 'Progressive Rock', 'Instrumental Band'
  ],
  metadataBase: new URL('https://unda-website.vercel.app'),
  twitter: {
    card: 'summary_large_image',
    title: 'Unda Alunda',
    description: 'Official site and merch shop for Unda Alunda.',
    images: ['/catmoon-bg.jpeg'],
    creator: '@undaalunda',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  // 👇 Trick for OpenGraph (ใส่ผ่าน `other`)
  other: {
    'og:title': 'Unda Alunda | Official Website & Merch Store',
    'og:description': 'The New Album Dark Wonderful World out July 1, 2025 — Purchase now!',
    'og:url': 'https://unda-website.vercel.app',
    'og:site_name': 'Unda Alunda',
    'og:image': 'https://unda-website.vercel.app/catmoon-bg.jpeg',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'Unda Alunda Hero Image',
    'og:type': 'music.group',
    'og:locale': 'en_US',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ SEO + Social + Mobile support */}
        <meta name="google-site-verification" content="l9-GepfNOG2FpwhTM3lKy6YjpQ0ifAmNbLsv1oqC2uo" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Unda Alunda" />
        <meta name="publisher" content="Unda Alunda" />
        <meta name="theme-color" content="#160000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Unda Alunda" />
        <meta name="application-name" content="Unda Alunda" />
        <meta name="copyright" content="Unda Alunda" />
        <link rel="canonical" href="https://unda-website.vercel.app" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta property="music:musician" content="https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0" />

        {/* ✅ Structured Data for Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "name": "Unda Alunda",
              "description": "Thai guitarist and composer.",
              "url": "https://unda-website.vercel.app",
              "image": "https://unda-website.vercel.app/catmoon-bg.jpeg",
              "sameAs": [
                "https://open.spotify.com/artist/021SFwZ1HOSaXz2c5zHFZ0",
                "https://www.instagram.com/undalunda",
                "https://www.youtube.com/@undaalunda",
                "https://www.facebook.com/undaalunda",
                "https://www.threads.net/@undalunda",
                "https://twitter.com/undaalunda",
                "https://music.apple.com/us/artist/unda-alunda/1543677299",
                "https://www.deezer.com/en/artist/115903802",
                "https://tidal.com/browse/artist/22524871",
                "https://music.amazon.com/artists/B08PVKFZDZ"
              ],
              "genre": "Progressive Rock",
              "foundingLocation": {
                "@type": "Place",
                "name": "Thailand"
              }
            }),
          }}
        />
      </head>
      <body className="bg-[#190000] text-[#f8fcdc] m-0 p-0 overflow-x-hidden">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}