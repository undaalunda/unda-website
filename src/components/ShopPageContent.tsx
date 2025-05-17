//ShopPageConten.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { allItems } from './allItems';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL';
const validTabs: TabType[] = ['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'];

function isBundlePrice(
  price: number | { original: number; sale: number }
): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

export default function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabFromQuery = searchParams.get('tab')?.toUpperCase();
  const isValidTab = validTabs.includes(tabFromQuery as TabType);
  const [activeTab, setActiveTab] = useState<TabType>(
  validTabs.includes((searchParams.get('tab')?.toUpperCase() ?? '') as TabType)
    ? (searchParams.get('tab')!.toUpperCase() as TabType)
    : 'MERCH'
);

  useEffect(() => {
    if (isValidTab) {
      setActiveTab(tabFromQuery as TabType);
    } else {
      setActiveTab('MERCH'); // fallback default
    }
  }, [tabFromQuery]);

  // ✅ ใส่ fallback UI ป้องกันแว้บ footer
  if (!activeTab) {
    return (
      <main className="shop-page-main min-h-screen text-[#f8fcdc] font-[Cinzel] px-4 pt-35 pb-4">
        <h1 className="text-center text-4xl font-bold text-[#dc9e63] mb-10 uppercase tracking-wider">
          Shop
        </h1>
        <div className="shop-tab-group mb-10">
          {validTabs.map((tab) => (
            <button
              key={tab}
              className="info-button shop-tab-button"
              disabled
            >
              {tab}
            </button>
          ))}
        </div>
        <p className="text-center text-lg text-[#dc9e63] opacity-60 mt-10">
          Loading products...
        </p>
      </main>
    );
  }

  const itemsToRender = allItems.filter((item) => {
    const category = item.category;
    switch (activeTab) {
      case 'MERCH':
        return category === 'Merch';
      case 'MUSIC':
        return category === 'Music';
      case 'BUNDLES':
        return category === 'Bundles';
      case 'DIGITAL':
        return category === 'Backing Track';
      default:
        return false;
    }
  });

  return (
    <main className="shop-page-main min-h-screen text-[#f8fcdc] font-[Cinzel] px-4 pt-35 pb-4">
      <h1 className="text-center text-4xl font-bold text-[#dc9e63] mb-10 uppercase tracking-wider">
        Shop
      </h1>

      <div className="shop-tab-group mb-10">
        {validTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              router.replace(`/shop?tab=${tab}`);
            }}
            className={`info-button shop-tab-button ${activeTab === tab ? 'active-tab' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {itemsToRender.length === 0 ? (
        <p className="text-center text-lg text-[#dc9e63] opacity-60 mt-10">
          There are currently no products available in this category.
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
              const displayPrice = isBundlePrice(item.price) ? (
                <>
                  <span className="line-through text-[#f8fcdc] mr-1">
                    ${item.price.original.toFixed(2)}
                  </span>
                  <span className="text-[#cc3f33]">${item.price.sale.toFixed(2)}</span>
                </>
              ) : (
                <span>${(item.price as number).toFixed(2)}</span>
              );

              return (
                <Link
                  key={item.id}
                  href={`/shop/${item.id}?tab=${activeTab}`}
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
                    <p className="stems-price">{displayPrice}</p>
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