'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ProductItem {
  src: string;
  title: string;
  subtitle: string;
  price: string | { original: string; sale: string };
}

const merchItems: ProductItem[] = [
  { src: '/black-cats-scores-tee.png', title: 'CAT SCORES T-SHIRT', subtitle: 'BLACK', price: '$29.95' },
  { src: '/white-cats-scores-tee.png', title: 'CAT SCORES T-SHIRT', subtitle: 'WHITE', price: '$29.95' },
  { src: '/a-cat-to-the-moon-stickers.png', title: 'A CAT TO THE MOON', subtitle: 'STICKERS', price: '$5.00' },
  { src: '/a-musician-cats.png', title: 'A MUSICIAN CATS', subtitle: 'STICKERS', price: '$5.00' },
  { src: '/unda-alunda-sign-keychain.png', title: 'UNDA ALUNDA', subtitle: 'SIGNED KEYCHAIN', price: '$9.95' },
];

const musicItems: ProductItem[] = [
  { src: '/audio-digipak-dww.png', title: 'DARK WONDERFUL WORLD', subtitle: 'AUDIO ALBUM CD (DIGIPAK)', price: '$25.00' },
  { src: '/live-cd-dww.png', title: 'DARK WONDERFUL WORLD', subtitle: 'LIVE ALBUM CD', price: '$15.00' },
  { src: '/full-guitars-transcription.png', title: 'FULL GUITARS TRANSCRIPTION', subtitle: 'PRINTED BOOK', price: '$49.95' },
  { src: '/full-bass-transcription.png', title: 'FULL BASS TRANSCRIPTION', subtitle: 'PRINTED BOOK', price: '$49.95' },
  { src: '/full-keys-transcription.png', title: 'FULL KEYS TRANSCRIPTION', subtitle: 'PRINTED BOOK', price: '$49.95' },
  { src: '/full-drums-transcription.png', title: 'FULL DRUMS TRANSCRIPTION', subtitle: 'PRINTED BOOK', price: '$49.95' },
];

const bundleItems: ProductItem[] = [
  { src: '/dark-wonderful-world-album-merch-bundle.png', title: 'DARK WONDERFUL WORLD', subtitle: 'ALBUM MERCH BUNDLE', price: { original: '$64.90', sale: '$51.92' } },
  { src: '/dark-wonderful-world-book-&-merch-bundle.png', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & MERCH BUNDLE', price: { original: '$84.90', sale: '$67.92' } },
  { src: '/dark-wonderful-world-book-&-bonus-merch-bundle.png', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK & BONUS MERCH BUNDLE', price: { original: '$94.90', sale: '$75.92' } },
  { src: '/dark-wonderful-world-dual-album-merch-bundle.png', title: 'DARK WONDERFUL WORLD', subtitle: 'DUAL ALBUM MERCH BUNDLE', price: { original: '$109.85', sale: '$87.88' } },
  { src: '/dark-wonderful-world-book-bundle.png', title: 'DARK WONDERFUL WORLD', subtitle: 'BOOK BUNDLE', price: { original: '$74.90', sale: '$59.92' } },
  { src: '/dark-wonderful-world-apparel-&-book-bundle.png', title: 'DARK WONDERFUL WORLD', subtitle: 'APPAREL & BOOK BUNDLE', price: { original: '$94.90', sale: '$75.92' } },
  { src: '/dark-wonderful-world-sticker-&-book-bundle.png', title: 'DARK WONDERFUL WORLD', subtitle: 'STICKER & BOOK BUNDLE', price: { original: '$54.90', sale: '$43.92' } },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as 'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL' | null;
  const [activeTab, setActiveTab] = useState<'MERCH' | 'MUSIC' | 'BUNDLES' | 'DIGITAL'>('MERCH');

  useEffect(() => {
    if (tabParam && ['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const itemsToRender =
    activeTab === 'MERCH' ? merchItems :
    activeTab === 'MUSIC' ? musicItems :
    activeTab === 'BUNDLES' ? bundleItems : [];

  return (
    <main className="shop-page-main pt-32 pb-20 text-[#f8fcdc] font-[Cinzel] px-4">
      <h1 className="text-center text-4xl font-bold text-[#dc9e63] mb-10 uppercase tracking-wider">
        Shop
      </h1>

      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {['MERCH', 'MUSIC', 'BUNDLES', 'DIGITAL'].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`info-button ${isActive ? 'active-tab' : ''}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === 'DIGITAL' ? (
        <p className="text-center w-full text-[#dc9e63] font-[Cinzel] mt-10 text-lg opacity-60">เดี๋ยวมาทำต่อ นอนแป๊บ</p>
      ) : (
        <div className="stems-row">
          {itemsToRender.map((item, i) => (
            <Link href="/shop" key={i} className="stems-item product-label-link">
              <img
                src={item.src}
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
export const dynamic = 'force-dynamic';