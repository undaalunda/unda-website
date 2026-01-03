// app/not-found.tsx - MISSING! Critical for SEO

import type { Metadata } from 'next';
import Link from 'next/link';
import AppClientWrapper from '@/components/AppClientWrapper';

// 🚀 FIXED: Use consistent domain
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://undaalunda.com';

export const metadata: Metadata = {
  title: '404 - Page Not Found | UNDA ALUNDA',
  description: 'The page you are looking for could not be found. Explore Unda Alunda\'s official website for progressive rock music, merchandise, and more.',
  
  // 🚀 Important: Don't index 404 pages
  robots: {
    index: false,
    follow: true,
  },

  // 🚀 Still provide Open Graph for sharing
  openGraph: {
    title: '404 - Page Not Found | UNDA ALUNDA',
    description: 'The page you are looking for could not be found. Explore Unda Alunda\'s official website.',
    type: 'website',
    url: `${BASE_URL}/404`,
    siteName: 'UNDA ALUNDA',
  },
};

export default function NotFound() {
  return (
    <>
      {/* 🚀 404 Error Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 - Page Not Found",
            "description": "Error page indicating the requested content could not be found",
            "url": `${BASE_URL}/404`,
            "mainEntity": {
              "@type": "Thing",
              "name": "404 Error"
            },
            "isPartOf": {
              "@type": "WebSite",
              "@id": `${BASE_URL}#website`
            }
          })
        }}
      />

      <AppClientWrapper>
        <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 py-8">
          <div className="text-center max-w-2xl mt-24 md:mt-16">
            {/* 🎵 Musical 404 Header */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-[#dc9e63] mb-4">
                404
              </h1>
              <div className="text-xl md:text-2xl text-[#f8fcdc]/80 mb-2">
                Page not found
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#dc9e63]">
                Oops! This page doesn't exist
              </h2>
              <p className="text-lg text-[#f8fcdc]/80 leading-relaxed mb-6">
                The page you're looking for can't be found. Let's get you back on track!
              </p>
            </div>

            {/* Navigation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <Link 
                href="/" 
                className="block p-6 bg-[#dc9e63]/10 border border-[#dc9e63]/30 rounded-lg hover:bg-[#dc9e63]/20 transition-colors duration-200 group"
              >
                <h3 className="text-lg font-semibold text-[#dc9e63] mb-2 group-hover:text-[#f8cfa3]">
                  Go Home
                </h3>
                <p className="text-sm text-[#f8fcdc]/70">
                  Return to the homepage
                </p>
              </Link>

              <Link 
                href="/shop" 
                className="block p-6 bg-[#dc9e63]/10 border border-[#dc9e63]/30 rounded-lg hover:bg-[#dc9e63]/20 transition-colors duration-200 group"
              >
                <h3 className="text-lg font-semibold text-[#dc9e63] mb-2 group-hover:text-[#f8cfa3]">
                  Browse Shop
                </h3>
                <p className="text-sm text-[#f8fcdc]/70">
                  Music and merchandise
                </p>
              </Link>

              <Link 
                href="/about" 
                className="block p-6 bg-[#dc9e63]/10 border border-[#dc9e63]/30 rounded-lg hover:bg-[#dc9e63]/20 transition-colors duration-200 group"
              >
                <h3 className="text-lg font-semibold text-[#dc9e63] mb-2 group-hover:text-[#f8cfa3]">
                  About Unda
                </h3>
                <p className="text-sm text-[#f8fcdc]/70">
                  Learn about the artist
                </p>
              </Link>

              <Link 
                href="/tour" 
                className="block p-6 bg-[#dc9e63]/10 border border-[#dc9e63]/30 rounded-lg hover:bg-[#dc9e63]/20 transition-colors duration-200 group"
              >
                <h3 className="text-lg font-semibold text-[#dc9e63] mb-2 group-hover:text-[#f8cfa3]">
                  Tour Dates
                </h3>
                <p className="text-sm text-[#f8fcdc]/70">
                  Upcoming concerts
                </p>
              </Link>
            </div>

            {/* Popular Pages */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#dc9e63] mb-4">
                Quick Links
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                <Link 
                  href="/shop/digital" 
                  className="px-4 py-2 text-sm bg-[#1a0000]/60 border border-[#dc9e63]/50 rounded-full hover:bg-[#dc9e63]/20 transition-colors duration-200"
                >
                  Backing Tracks
                </Link>
                <Link 
                  href="/shop/merch" 
                  className="px-4 py-2 text-sm bg-[#1a0000]/60 border border-[#dc9e63]/50 rounded-full hover:bg-[#dc9e63]/20 transition-colors duration-200"
                >
                  Merchandise
                </Link>
                <Link 
                  href="/product/live-cd" 
                  className="px-4 py-2 text-sm bg-[#1a0000]/60 border border-[#dc9e63]/50 rounded-full hover:bg-[#dc9e63]/20 transition-colors duration-200"
                >
                  Live Album
                </Link>
                <Link 
                  href="/contact" 
                  className="px-4 py-2 text-sm bg-[#1a0000]/60 border border-[#dc9e63]/50 rounded-full hover:bg-[#dc9e63]/20 transition-colors duration-200"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Search Suggestion */}
            <div className="text-center">
              <p className="text-sm text-[#f8fcdc]/60 mb-4">
                Still can't find what you're looking for?
              </p>
              <p className="text-sm text-[#f8fcdc]/70">
                Try using the search function in the navigation menu or{' '}
                <Link 
                  href="/contact" 
                  className="text-[#dc9e63] hover:text-[#f8cfa3] underline transition-colors duration-200"
                >
                  contact us directly
                </Link>
                .
              </p>
            </div>
          </div>
        </main>
      </AppClientWrapper>
    </>
  );
}