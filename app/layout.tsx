// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Unda Alunda | Official Website & Merch Store',
  description: 'Official Website of Unda Alunda. New album coming May 1, 2025. Shop music, merch, and more.',
  keywords: ['Unda Alunda', 'Dark Wonderful World', 'music', 'merch', 'thai band'],
  metadataBase: new URL('https://unda-website.vercel.app'),
  openGraph: {
    title: 'Unda Alunda | Official Website & Merch Store',
    description: 'New album out May 1, 2025 — Shop now!',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`}
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-[#190000] text-[#f8fcdc] m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}