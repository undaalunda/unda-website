//ShopPageContent.tsx/

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { allItems } from './allItems';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL';
const validTabs: TabType[] = ['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'];

function isBundlePrice(
  price: number | { original: number; sale: number }
): price is { original: number; sale: number } {
  return typeof price === 'object' && price !== null && 'original' in price && 'sale' in price;
}

export default function ShopPageContent({ tab }: { tab?: TabType }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>(tab || 'MERCH');

  useEffect(() => {
    if (!validTabs.includes(activeTab)) {
      setActiveTab('MERCH');
    }
  }, [activeTab]);

  // 🚀 Memoize filtered items เพื่อลด re-computation
  const itemsToRender = useMemo(() => {
    return allItems.filter((item) => {
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
  }, [activeTab]);

  return (
    <main className="shop-page-main min-h-screen text-[#f8fcdc] font-[Cinzel] px-4 pt-35 pb-4">
      <h1 className="text-center text-4xl font-bold text-[#dc9e63] mb-10 uppercase tracking-wider">
        Shop
      </h1>

      <div className="shop-tab-group mb-10">
        {validTabs.map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => {
              setActiveTab(tabKey);
              router.push(`/shop/${tabKey.toLowerCase()}`);
            }}
            className={`info-button shop-tab-button ${activeTab === tabKey ? 'active-tab' : ''}`}
          >
            {tabKey}
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
                  href={`/product/${item.id}`}
                  className={`stems-item product-label-link cursor-pointer ${
                    isBackingTrack ? 'is-backing' : ''
                  }`}
                >
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="stems-image"
                      loading="lazy"
                      quality={95}
                      sizes="(max-width: 480px) 140px, (max-width: 1279px) 160px, 180px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                    {item.soldOut && (
                      <div className="absolute top-2 right-2 bg-red-900/40 text-white text-xs px-2 py-1 rounded-md font-semibold border border-red-800/50">
                        SOLD OUT
                      </div>
                    )}
                    {item.comingSoon && !item.soldOut && (
                      <div className="absolute top-2 right-2 bg-orange-600/50 text-white text-xs px-2 py-1 rounded-md font-semibold border border-orange-600/80">
                        Available Dec 31
                      </div>
                    )}
                  </div>
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