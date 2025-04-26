'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { allItems } from '../components/allItems';

interface Props {
  tabParam: 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL' | null;
}

export default function ShopPageContent({ tabParam }: Props) {
  const [activeTab, setActiveTab] = useState<'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL'>('MERCH');

  useEffect(() => {
    if (tabParam && ['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const itemsToRender = allItems.filter((item) => {
    if (activeTab === 'MERCH') return item.category === 'Merch';
    if (activeTab === 'MUSIC') return item.category === 'Music';
    if (activeTab === 'BUNDLES') return item.category === 'Bundles';
    if (activeTab === 'DIGITAL') return item.category === 'Backing Track';
    return false;
  });

  return (
    <main className="shop-page-main min-h-screen text-[#f8fcdc] font-[Cinzel] px-4 pt-50 pb-4">
      <h1 className="text-center text-4xl font-bold text-[#dc9e63] mb-10 uppercase tracking-wider">
        Shop
      </h1>

      <div className="shop-tab-group mb-10">
        {['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'].map((tab) => (
          <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={`info-button shop-tab-button ${activeTab === tab ? 'active-tab' : ''}`}
        >
          {tab}
        </button>
        ))}
      </div>

      {itemsToRender.length === 0 ? (
        <p className="text-center text-lg text-[#dc9e63] opacity-60 mt-10">
          ไม่มีสินค้าในหมวดนี้ตอนนี้นะจ๊ะ 🥲
        </p>
      ) : (
        <div className="stems-row">
          {itemsToRender.map((item) => {
            const isBackingTrack = item.category === 'Backing Track';

            return (
              <Link
                key={item.id}
                href={`/shop/${item.id}`}
                className={`stems-item product-label-link cursor-pointer ${isBackingTrack ? 'is-backing' : ''}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="stems-image"
                  width={200}
                  height={200}
                />
                <div className="stems-label-group">
                  <p className="stems-title-text">{item.title}</p>

                  {/* subtitle */}
                  <p className="stems-subtitle">
                    {isBackingTrack
                      ? item.subtitle.replace(/BACKING TRACK/gi, '').trim()
                      : item.subtitle}
                  </p>

                  {/* เส้นเฉพาะ Backing Track */}
                  {isBackingTrack && <span className="backing-line" />}

                  {/* BACKING TRACK label */}
                  {isBackingTrack && (
                    <p className="stems-subtitle-tiny">BACKING TRACK</p>
                  )}

                  {/* ราคาสินค้า */}
                  <p className="stems-price">
                    {typeof item.price === 'object' ? (
                      <>
                        <span className="line-through text-[#f8fcdc] mr-1">{item.price.original}</span>
                        <span className="text-[#cc3f33]">{item.price.sale}</span>
                      </>
                    ) : (
                      item.price
                    )}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}