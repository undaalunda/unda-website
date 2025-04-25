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
    if (activeTab === 'DIGITAL') return item.category === 'Backing Track'; // หรือ Digital ถ้าแก้ชื่อไว้
    return false;
  });

  return (
    <main className="shop-page-main min-h-screen text-[#f8fcdc] font-[Cinzel] px-4 pt-50 pb-4">
      <h1 className="text-center text-4xl font-bold text-[#dc9e63] mb-10 uppercase tracking-wider">
        Shop
      </h1>

      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`info-button ${activeTab === tab ? 'active-tab' : ''}`}
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
          {itemsToRender.map((item) => (
            <Link
              key={item.id}
              href={`/shop/${item.id}`}
              className="stems-item product-label-link cursor-pointer"
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
                <p className="stems-subtitle-tiny">{item.subtitle}</p>
                {typeof item.price === 'object' ? (
                  <p className="stems-price">
                    <span className="line-through mr-1 text-[#f8fcdc]">{item.price.original}</span>
                    <span className="text-[#cc3f33]">{item.price.sale}</span>
                  </p>
                ) : (
                  <p className="stems-price text-[#f8fcdc]">{item.price}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}