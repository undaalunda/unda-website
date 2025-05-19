// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext'; // ✅ เพิ่ม CartProvider กลางโลก
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Unda Alunda | Official Website & Merch Store',
  description: 'The New Album Dark Wonderful World out July 1, 2025 — Purchase now!',
  keywords: ['Unda','Alunda', 'Unda Alunda', 'Dark Wonderful World', 'music', 'merch', 'Stems', 'Transcription', 'Tour date'],
  metadataBase: new URL('https://unda-website.vercel.app'),
  openGraph: {
    title: 'Unda Alunda | Official Website & Merch Store',
    description: 'The New Album Dark Wonderful World out July 1, 2025 — Purchase now!',
    url: 'https://unda-website.vercel.app',
    siteName: 'Unda Alunda',
    images: [
      {
        url: '/catmoon-bg.jpeg',
        width: 1200,
        height: 630,
        alt: 'Unda Alunda Hero Image',
      },
    ],
    type: 'website',
  },
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ SEO Enhancements */}
        <meta name="google-site-verification" content="l9-GepfNOG2FpwhTM3lKy6YjpQ0ifAmNbLsv1oqC2uo" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Unda Alunda" />
        <meta name="publisher" content="Unda Alunda" />
        <meta name="theme-color" content="#190000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Unda Alunda" />
        <link rel="canonical" href="https://unda-website.vercel.app" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body className="bg-[#190000] text-[#f8fcdc] m-0 p-0 overflow-x-hidden">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}