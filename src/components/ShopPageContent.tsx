'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { allItems } from './allItems';
import { useCurrency } from '@/context/CurrencyContext';
import { convertPrice, isBundlePrice } from '@/utils/currency'; // ✅ ใช้ convertPrice และ isBundlePrice

interface Props {
  tabParam: 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL' | null;
}

export default function ShopPageContent({ tabParam }: Props) {
  const { currency } = useCurrency();
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

                  <p className="stems-subtitle">
                    {isBackingTrack
                      ? item.subtitle.replace(/BACKING TRACK/gi, '').trim()
                      : item.subtitle}
                  </p>

                  {isBackingTrack && <span className="backing-line" />}
                  {isBackingTrack && <p className="stems-subtitle-tiny">BACKING TRACK</p>}

                  <p className="stems-price">
  {isBundlePrice(item.price) ? (
    <>
      <span className="line-through text-[#f8fcdc] mr-1">
        {convertPrice(item.price.original, currency)}
      </span>
      <span className="text-[#cc3f33]">
        {convertPrice(item.price.sale, currency)}
      </span>
    </>
  ) : (
    <span>
      {convertPrice(item.price, currency)}
    </span>
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