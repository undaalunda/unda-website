//ShopLandingContent.tsx - CSS Colors Version with Badge
'use client';

import React from 'react';
import Link from 'next/link';

export default function ShopLandingContent() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4">
      <section className="text-center w-full max-w-6xl">
        {/* Hidden H1 for SEO */}
        <h1 className="sr-only">Shop</h1>

        {/* Shop Choice Cards */}
        <div className="shop-landing-cards-container">
          <div className="shop-landing-cards-grid min-[1281px]:grid min-[1281px]:grid-cols-2 min-[1281px]:gap-8">
            
            {/* Physical Shop Card - CSS Colors - DISABLED */}
            <div className="shop-landing-card-item group cursor-not-allowed">
              <div className="block pointer-events-none relative">
                <div className="shop-landing-card bg-gradient-to-br from-[rgba(252,194,118,0.15)] via-[rgba(211,113,66,0.12)] to-[rgba(120,26,26,0.08)] border border-[rgba(252,194,118,0.3)] opacity-40">
                  
                  {/* Content */}
                  <div className="shop-landing-card-content">
                    <h2 className="shop-landing-card-title shop-landing-physical-title bg-gradient-to-r from-[#fcc276] via-[#d37142] to-[#781a1a] bg-clip-text text-transparent">
                      Physical Shop
                    </h2>
                    <p className="shop-landing-card-description">
                      Merchandise, music, and exclusive bundles delivered worldwide
                    </p>
                  </div>
                  
                  <div className="shop-landing-card-button-wrapper">
                    <div className="shop-landing-card-button bg-gradient-to-r from-[#d37142] via-[#781a1a] to-[#4a1111] shadow-lg shadow-[rgba(252,194,118,0.3)]">
                      Shop Physical
                    </div>
                  </div>
                </div>

                {/* Coming Soon Badge - Bronze/Brown tone */}
                <div className="absolute top-4 right-4 bg-[rgba(139,90,43,0.7)] text-[rgba(210,180,140,0.95)] px-4 py-2 rounded-full text-sm font-semibold border border-[rgba(160,120,80,0.4)] backdrop-blur-sm shadow-md">
                  Coming Soon
                </div>
              </div>
            </div>

            {/* Digital Shop Card - CSS Colors */}
            <div className="shop-landing-card-item group cursor-pointer">
              <Link href="/shop/digital" className="block">
                <div className="shop-landing-card shop-landing-digital-card bg-gradient-to-br from-[rgba(91,129,153,0.15)] via-[rgba(37,60,80,0.12)] to-[rgba(16,33,52,0.08)] border border-[rgba(91,129,153,0.3)] hover:border-[rgba(91,129,153,0.5)] hover:shadow-2xl hover:shadow-[rgba(91,129,153,0.2)]">
                  <div className="shop-landing-card-content">
                    <h2 className="shop-landing-card-title shop-landing-digital-title bg-gradient-to-r from-[#5b8199] via-[#253c50] to-[#102134] bg-clip-text text-transparent">
                      Digital Shop
                    </h2>
                    <p className="shop-landing-card-description">
                      Professional high-quality backing tracks, tabs, and stems for musicians
                    </p>
                  </div>
                  <div className="shop-landing-card-button-wrapper">
                    <div className="shop-landing-card-button shop-landing-digital-button bg-gradient-to-r from-[#253c50] via-[#102134] to-[#0a1421] shadow-lg shadow-[rgba(91,129,153,0.3)]">
                      Shop Digital
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}