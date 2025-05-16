//ShopPageConten.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { allItems } from './allItems';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL';

function isBundlePrice(
  price: number | { original: number; sale: number }
): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

export default function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabFromQuery = searchParams.get('tab')?.toUpperCase() as TabType | undefined;

  const [activeTab, setActiveTab] = useState<TabType>('MERCH');

  useEffect(() => {
    if (
      tabFromQuery &&
      ['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'].includes(tabFromQuery)
    ) {
      setActiveTab(tabFromQuery);
    }
  }, [tabFromQuery]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.replace(`/shop?tab=${tab}`); // ใช้ replace แทน push เพื่อไม่ให้ซ้อน stack
  };

  const itemsToRender = allItems.filter((item) => {
    if (activeTab === 'MERCH') return item.category === 'Merch';
    if (activeTab === 'MUSIC') return item.category === 'Music';
    if (activeTab === 'BUNDLES') return item.category === 'Bundles';
    if (activeTab === 'DIGITAL') return item.category === 'Backing Track';
    return false;
  });

  return (
    <main className="shop-page-main min-h-screen text-[#f8fcdc] font-[Cinzel] px-4 pt-35 pb-4">
      <h1 className="text-center text-4xl font-bold text-[#dc9e63] mb-10 uppercase tracking-wider">
        Shop
      </h1>

      <div className="shop-tab-group mb-10">
        {['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab as TabType)}
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="stems-row"
          >
            {itemsToRender.map((item) => {
              const isBackingTrack = item.category === 'Backing Track';

              return (
                <Link
                  key={item.id}
                  href={`/shop/${item.id}?tab=${activeTab}`} // ส่ง tab ไปด้วย
                  className={`stems-item product-label-link cursor-pointer ${
                    isBackingTrack ? 'is-backing' : ''
                  }`}
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
                            ${item.price.original.toFixed(2)}
                          </span>
                          <span className="text-[#cc3f33]">
                            ${item.price.sale.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span>${item.price.toFixed(2)}</span>
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  );
}