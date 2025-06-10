//ShopLandingContent.tsx

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
            
            {/* Physical Shop Card */}
            <div className="shop-landing-card-item group">
              <Link href="/shop/physical" className="block">
                <div className="shop-landing-card">
                  
                  {/* Content */}
                  <div className="shop-landing-card-content">
                    <h2 className="shop-landing-card-title shop-landing-physical-title">
                      Physical Shop
                    </h2>
                    <p className="shop-landing-card-description">
                      Merchandise, music, and exclusive bundles delivered worldwide
                    </p>
                  </div>

                  <div className="shop-landing-card-button-wrapper">
                    <div className="shop-landing-card-button">
                      Shop Physical
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Digital Shop Card */}
            <div className="shop-landing-card-item group">
              <Link href="/shop/digital" className="block">
                <div className="shop-landing-card shop-landing-digital-card">
                  <div className="shop-landing-card-content">
                    <h2 className="shop-landing-card-title shop-landing-digital-title">
                      Digital Shop
                    </h2>
                    <p className="shop-landing-card-description">
                      Professional high-quality backing tracks, tabs, and stems for musicians
                    </p>
                  </div>
                  <div className="shop-landing-card-button-wrapper">
                    <div className="shop-landing-card-button shop-landing-digital-button">
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